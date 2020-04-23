import React from 'react';
import { Auth, Storage } from 'aws-amplify';
import { Audio } from "expo-av";
import {Text, View, Image, ImageBackground, TouchableOpacity, Slider } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import * as subscriptions from "./graphql/subscriptions";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Analytics } from 'aws-amplify';
import HomeTheme from '../libs/HomeTheme';
import { Avatar } from 'react-native-elements';

Analytics.configure({ disabled: true })

const timer = require('react-native-timer');

export default class Root extends React.Component {

    constructor(props) {
        super(props);
        var today = new Date();
        this.state = {
            sessionActive: false,
            hasLocationPermissions: false,
            currLat: null,
            currLong: null,
            ads: [],
            adInterval: 5,
            isLoaded: false,
            isPlaying: false,
            didFinish: false,
            volume: 5,
            initials: '',
            email: null,
            date: {
                month: today.getMonth() + 1,
                day: today.getDate(),
                year: today.getFullYear()
            },
            numImpressions: 0,
            darkModeEnabled: false,
        }
    }

    componentDidMount() {
        this.setupAudioPlayer();
        this.setupUserInfo();
    }

    setupUserInfo = async () => {
        await Auth.currentAuthenticatedUser({}).then(user => this.setState({ initials:
                user.attributes.name.charAt(0).toUpperCase() + 
                    user.attributes.family_name.charAt(0).toUpperCase(),
                    email: user.attributes.email }))
            .catch(err => console.log(err));
        try {
            const response = await API.graphql(graphqlOperation(queries.getImpression, { uniqueID: this.state.email + '-' + this.state.date.month + '-' + this.state.date.day + '-' + this.state.date.year }));
            if (response.data.getImpression == null) {
                await this.createImpressionLog();
            } else {
                this.setState({ numImpressions: response.data.getImpression.numImpressions });
                console.log("Num impressions so far today is: " + response.data.getImpression.numImpressions)
            }
        } catch (err) {
            console.error(err);
        }
    }

    createImpressionLog = async () => {
        try {
            const impression = {
                uniqueID: this.state.email + '-' + this.state.date.month + '-' + this.state.date.day + '-' + this.state.date.year,
                driver: this.state.email,
                year: this.state.date.year,
                month: this.state.date.month,
                date: this.state.date.day,
                numImpressions: 0
            }
            await API.graphql(graphqlOperation(mutations.createImpression, { input: impression }));
            console.log("Created impression log");
        } catch (err) {
            console.error(err);
        }
    }

    signOut = () => {
        Auth.signOut()
            .then(() => {
                this.props.onStateChange('signedOut', null);
            })
            .catch(err => {
                console.log('err: ', err)
            });
    }

    setupAudioPlayer = async () => {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
            staysActiveInBackground: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS });
        const soundObject = new Audio.Sound();
        soundObject.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
        this.setState({soundObject: soundObject});
    }

    _onPlaybackStatusUpdate = playbackStatus => {
          if (!playbackStatus.isLoaded) {
            // Update your UI for the unloaded state
            this.setState({ isLoaded: false });

            if (playbackStatus.error) {
              console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
            }

          } else {
            // Update your UI for the loaded state
            this.setState({ isLoaded: true });

            if (playbackStatus.isPlaying) {
              // Update your UI for the playing state
              this.state.soundObject.setVolumeAsync(this.state.volume / 10.0);
              this.setState({ isPlaying: true });
              this.setState({ didFinish: false });
            } else {
              // Update your UI for the paused state
              this.setState({ isPlaying: false });
            }

            if (playbackStatus.didJustFinish) {
              // The player has just finished playing and will stop. Maybe you want to play something else?
              console.log("Player finished playing song");
              this.addImpression();
              this.setState({ didFinish: true });
            }

          }
    };

    componentWillUnmount() {
        console.log("Clearing timer");
        timer.clearInterval("ads");
    }

    startPlaying = async () => {
        await this._getLocationAsync();
        if (!this.state.hasLocationPermissions) {
            console.log("Cannot access location due to permissions.");
            return;
        }
        if (!this.state.sessionActive) {
            this.setState({ sessionActive: true });
            timer.setInterval("ads", this.playAd, this.state.adInterval * 1000);
        } else {
            this.setState({sessionActive: false});
            if (this.state.isPlaying) {
                console.log("Pausing current song");
                await this.state.soundObject.pauseAsync();
            }
            timer.clearInterval("ads");
        }
    }

    playAd = async () => {
        console.log("Time to play new ad!");
        if (this.state.isLoaded) {
            console.log("Already have a loaded song because: ")
            if (this.state.isPlaying) {
                console.log("Currently playing an ad.");
                return;
            }
            if (this.state.didFinish) {
                console.log("Finished playing a song.")
                await this.setupAudioPlayer();
                console.log("Reset sound object.");
            } else {
                // song was paused
                console.log("Ad has been paused.")
                await this.state.soundObject.playAsync();
                console.log("Continue to play old song.")
                return;
            }
        }
        console.log("Looking for new song to load.");
        var nextAd = await this.getNextAd();

        if (nextAd == null) {
            // no ad found!
            console.log("No new ad to play.");
            return;
        }
        console.log("Playing " + nextAd.file.key);
        const url = await Storage.get(nextAd.file.key, { customPrefix: { public: '', protected: '', private: '' } });

        try {
            await this.state.soundObject.loadAsync({ uri: url });
            await this.state.soundObject.playAsync();
        } catch {
            await this.playAd();
        }
    }
    
    getNextAd = async () => {
        var nextAdIdx = 0;
        await this._getLocationAsync();
        while (this.state.ads.length != 0) {
            if (this.state.currLat <= this.state.ads[0].maxLat && this.state.currLat >= this.state.ads[0].minLat
                && this.state.currLong <= this.state.ads[0].maxLng && this.state.currLong >= this.state.ads[0].minLng) {
                console.log("Ad is within range");
                break;
            } else {
                console.log("Ad is not within range");
                this.state.ads.shift();
            }
        }
        if (this.state.ads.length == 0) {
            // none of the current ads are in range, fetch more ads instead
            await this.getAdsList();
        }
        if (this.state.ads.length == 0) {
            // no more ads to fetch!
            return null;
        }
        var nextAd = this.state.ads.shift();
        this.setState({currAd: nextAd});
        console.log("Next ad to play: " + nextAd.file.key)
        return nextAd;
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({ hasLocationPermissions: false });
            return;
        } else {
            this.setState({ hasLocationPermissions: true });
        }
        
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ currLat: 39.952586, currLong: -75.165219 }); // TODO: REPLACE WITH BELOW LINE
        // this.setState({ currLat: location.coords.latitude, currLong: location.coords.longitude });
        console.log("Current location is " + this.state.currLat + " " + this.state.currLong);
    };

    getAdsList = async () => {
        console.log("Refresh ad list");
        await this._getLocationAsync();
        try {
            const response = await API.graphql(graphqlOperation(queries.listAds, {
                filter: {
                    maxLat: {
                        ge: this.state.currLat
                    }, minLat: {
                        le: this.state.currLat
                    }, maxLng: {
                        ge: this.state.currLong
                    }, minLng: {
                        le: this.state.currLong
                    }
                }
            }));
            this.setState({ ads: response.data.listAds.items });
            console.log("Got list of ads: ");
            for (var i = 0; i < this.state.ads.length; i++) {
                console.log("[" + i + "]: " + this.state.ads[i].adName);
            }
        } catch (err) {
            console.error(err);
        }
    }

    changeDarkMode(darkMode) {
        this.setState({darkModeEnabled: darkMode});
    }

    addImpression = async () => {
        try {
            const ad = {
                uniqueID: this.state.currAd.uniqueID,
                numImpressions: this.state.currAd.numImpressions + 1
            }
            await API.graphql(graphqlOperation(mutations.updateAd, {input: ad }));

            this.setState({ numImpressions: this.state.numImpressions + 1 });
            const impression = {
                uniqueID: this.state.email + '-' + this.state.date.month + '-' + this.state.date.day + '-' + this.state.date.year,
                driver: this.state.email,
                year: this.state.date.year,
                month: this.state.date.month,
                date: this.state.date.day,
                numImpressions: this.state.numImpressions
            }
            await API.graphql(graphqlOperation(mutations.createImpression, { input: impression }));
            
            console.log("Logged impression");
        } catch (err) {
            console.error(err);
        }
    }
    render() {
        if (this.state.darkModeEnabled) {
            return (
                <View style={{flex: 1 }}>
                    <ImageBackground source={require('../assets/background2Dark.png')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.99}}>
                        <Avatar containerStyle={HomeTheme.avatar} onPress={() =>
                            this.props.navigation.navigate('Profile', {isDarkMode: this.state.darkModeEnabled})
                        } overlayContainerStyle={{backgroundColor: 'rgba(50,50,50,0.9)'}} rounded title={this.state.initials} />
                        <Button
                                style={HomeTheme.settings}
                                onPress={() => this.props.navigation.navigate('Settings', {changeDarkMode: this.changeDarkMode.bind(this), isDarkMode: this.state.darkModeEnabled})}
                                type="clear"
                                icon={
                                    <Icon
                                        name="gear"
                                        size={40}
                                        color="rgb(0,0,0)"
                                    />
                                }
                            />
                        <Text style={{textAlign: 'center', color: '#000', fontFamily: 'comfortaa', fontSize: 64, marginTop: 75}}>adio</Text>
                        <Text style={{textAlign: 'center', color: '#000', fontFamily: 'comfortaa', fontSize: 20, marginTop: 0}}>audio ads for rideshare</Text>
                        <View style={HomeTheme.sliderContainer1}>
                            <Text style={HomeTheme.sliderLabel}>volume</Text>
                            <Slider
                                style={HomeTheme.slider}
                                step={1}
                                minimumValue={1}
                                maximumValue={10}
                                value={this.state.volume}
                                minimumTrackTintColor={'#000'}
                                maximumTrackTintColor={'rgba(0,0,0,0.2)'}
                                thumbTintColor={'#000'}
                                onValueChange={value => { this.setState({ volume: value });
                                        if (this.state.isLoaded) {
                                            this.state.soundObject.setVolumeAsync(value / 10.0); 
                                        }
                                    }
                                }
                            />
                            <Text style={HomeTheme.sliderValue}>{this.state.volume}</Text>
                        </View>
                        <Text style={HomeTheme.sliderDescription}>volume of ads</Text>
                        <View style={HomeTheme.sliderContainer}>
                            <Text style={HomeTheme.sliderLabel}>ad freq</Text>
                            <Slider
                                style={HomeTheme.slider}
                                step={1}
                                minimumValue={1}
                                maximumValue={8}
                                value={this.state.adInterval}
                                minimumTrackTintColor={'#000'}
                                maximumTrackTintColor={'rgba(0,0,0,0.2)'}
                                thumbTintColor={'#000'}
                                onValueChange={value => this.setState({ adInterval: value })}
                            />
                            <Text style={HomeTheme.sliderValue}>{this.state.adInterval}</Text>
                        </View>
                        <Text style={HomeTheme.sliderDescription}>mins between ads</Text>
                        
                        <View>
                            <Button
                                style={HomeTheme.playButton}
                                onPress={this.startPlaying}
                                type="clear"
                                icon={
                                    <Icon
                                        name={this.state.sessionActive ? "pause-circle" : "play-circle"}
                                        size={170}
                                        color="rgb(0,0,0)"
                                    />
                                }
                            />
                        </View>
                        <TouchableOpacity style={HomeTheme.playButtonLabel}>
                            <Text style={HomeTheme.playButtonLabelText}> {this.state.sessionActive ? "stop adio" : "start adio"} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={HomeTheme.button} onPress={() => this.props.navigation.navigate('Settings', {changeDarkMode: this.changeDarkMode.bind(this), isDarkMode: this.state.darkModeEnabled})}>
                            <Text style={HomeTheme.buttonText}> more settings </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={HomeTheme.logoutButton} onPress={this.signOut}>
                            <Text style={HomeTheme.logoutButtonText}> logout </Text>
                        </TouchableOpacity>
                        <Image source={require('../assets/adio-white.png')} style={HomeTheme.logo}/>
                    </ImageBackground>
                </View >
            )
        } else {
            return (
                <View style={{flex: 1 }}>
                    <ImageBackground source={require('../assets/background2Light.jpg')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.99}}>
                        <Avatar containerStyle={HomeTheme.avatar} onPress={() =>
                            this.props.navigation.navigate('Profile', {isDarkMode: this.state.darkModeEnabled})
                        } overlayContainerStyle={{backgroundColor: 'rgba(50,50,50,0.9)'}} rounded title={this.state.initials} />
                        <Button
                                style={HomeTheme.settings}
                                onPress={() => this.props.navigation.navigate('Settings', {changeDarkMode: this.changeDarkMode.bind(this), isDarkMode: this.state.darkModeEnabled})}
                                type="clear"
                                icon={
                                    <Icon
                                        name="gear"
                                        size={40}
                                        color="rgb(0,0,0)"
                                    />
                                }
                        />
                        <Text style={{textAlign: 'center', color: '#000', fontFamily: 'comfortaa', fontSize: 64, marginTop: 75}}>adio</Text>
                        <Text style={{textAlign: 'center', color: '#000', fontFamily: 'comfortaa', fontSize: 20, marginTop: 0}}>audio ads for rideshare</Text>
                        <View style={HomeTheme.sliderContainer1}>
                            <Text style={HomeTheme.sliderLabel}>volume</Text>
                            <Slider
                                style={HomeTheme.slider}
                                step={1}
                                minimumValue={1}
                                maximumValue={10}
                                value={this.state.volume}
                                minimumTrackTintColor={'#000'}
                                maximumTrackTintColor={'rgba(0,0,0,0.2)'}
                                thumbTintColor={'#000'}
                                onValueChange={value => { this.setState({ volume: value });
                                        if (this.state.isLoaded) {
                                            this.state.soundObject.setVolumeAsync(value / 10.0); 
                                        }
                                    }
                                }
                            />
                            <Text style={HomeTheme.sliderValue}>{this.state.volume}</Text>
                        </View>
                        <Text style={HomeTheme.sliderDescription}>volume of ads</Text>
                        <View style={HomeTheme.sliderContainer}>
                            <Text style={HomeTheme.sliderLabel}>ad freq</Text>
                            <Slider
                                style={HomeTheme.slider}
                                step={1}
                                minimumValue={1}
                                maximumValue={8}
                                value={this.state.adInterval}
                                minimumTrackTintColor={'#000'}
                                maximumTrackTintColor={'rgba(0,0,0,0.2)'}
                                thumbTintColor={'#000'}
                                onValueChange={value => this.setState({ adInterval: value })}
                            />
                            <Text style={HomeTheme.sliderValue}>{this.state.adInterval}</Text>
                        </View>
                        <Text style={HomeTheme.sliderDescription}>mins between ads</Text>
                        
                        <View>
                            <Button
                                style={HomeTheme.playButton}
                                onPress={this.startPlaying}
                                type="clear"
                                icon={
                                    <Icon
                                        name={this.state.sessionActive ? "pause-circle" : "play-circle"}
                                        size={170}
                                        color="rgb(0,0,0)"
                                    />
                                }
                            />
                        </View>
                        <TouchableOpacity style={HomeTheme.playButtonLabel}>
                            <Text style={HomeTheme.playButtonLabelText}> {this.state.sessionActive ? "stop adio" : "start adio"} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={HomeTheme.button} onPress={() => this.props.navigation.navigate('Settings', {changeDarkMode: this.changeDarkMode.bind(this), isDarkMode: this.state.darkModeEnabled})}>
                            <Text style={HomeTheme.buttonText}> more settings </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={HomeTheme.logoutButton} onPress={this.signOut}>
                            <Text style={HomeTheme.logoutButtonText}> logout </Text>
                        </TouchableOpacity>
                        <Image source={require('../assets/adio-white.png')} style={HomeTheme.logo}/>
                    </ImageBackground>
                </View >
            )
        }
    }
}