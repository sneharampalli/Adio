import React from 'react';
import { Auth, Storage } from 'aws-amplify';
import { Audio } from "expo-av";
import { StyleSheet, Text, View, FlatList, Image, ImageBackground, TouchableOpacity } from 'react-native';
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
import Slider from '@react-native-community/slider';

Analytics.configure({ disabled: true })

const timer = require('react-native-timer');

export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sessionActive: false,
            hasLocationPermissions: false,
            currLat: null,
            currLong: null,
            ads: [],
            adInterval: 20,
            isLoaded: false,
            isPlaying: false,
            didFinish: false
            locationResult: null,
            ads: [],
            volume: 0,
        }
        // SystemSetting.getVolume().then((volume)=>{
        //     this.state.volume = volume;
        // });
    }

    componentDidMount() {
        this.setupAudioPlayer();
        // window.setInterval(async () => {console.log("hi"); }, 5000);
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

    _onPlaybackStatusUpdate = async playbackStatus => {
          if (!playbackStatus.isLoaded) {
            // Update your UI for the unloaded state
            console.log("Player is unloaded");
            this.setState({ isLoaded: false });

            if (playbackStatus.error) {
              console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
            }

          } else {
            // Update your UI for the loaded state
            console.log("Player is loaded");
            this.setState({ isLoaded: true });

            if (playbackStatus.isPlaying) {
              // Update your UI for the playing state
              console.log("Player is playing");
              this.setState({ isPlaying: true });
              this.setState({ didFinish: false });
            } else {
              // Update your UI for the paused state
              console.log("Player is not playing");
              this.setState({ isPlaying: false });
            }

            if (playbackStatus.didJustFinish) {
              // The player has just finished playing and will stop. Maybe you want to play something else?
              console.log("Player finished playing song");
              await this.state.soundObject.unloadAsync();
              console.log("Player is unloaded");
              this.setState({ didFinish: true });
            }

          }
    };

    sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // componentWillUnmount() {
    //     console.log("Clearing timer");
    //     timer.clearInterval(this);
    // }

    startPlaying = async () => {
        await this._getLocationAsync();
        if (!this.state.hasLocationPermissions) {
            console.log("Cannot access location due to permissions.");
            return;
        }
        if (!this.state.sessionActive) {
            this.setState({ sessionActive: true });
            // while (this.state.sessionActive) {
            //     console.log("play new ad");
            //     this.playAd();
            //     console.log("done playing");
            //     this.sleep(this.state.adInterval * 1000);
            // }
            this.playAd();
            // timer.setInterval(this, "ads", async () => { await this.playAd }, this.state.adInterval * 1000);
            var intervalId = window.setInterval(this.playAd, this.state.adInterval * 1000);
            this.setState({intervalId: intervalId});
        } else {
            this.setState({sessionActive: false});
            // let state = this.state;
            // let shouldPause = false;
            // await this.state.soundObject.getStatusAsync().then(function(result) {
            //     if (result.isPlaying) {
            //         shouldPause = true;
            //     }
            // });
            if (this.state.isPlaying) {
                console.log("Pausing current song");
                await this.state.soundObject.pauseAsync();
            }
            window.clearInterval(this.state.intervalId);
            // timer.clearInterval("ads");
        }
    }

    playAd = async () => {
        console.log("Time to play new ad!");
        console.log("why does it always crash here");
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

        await this.state.soundObject.loadAsync({ uri: url });
        await this.state.soundObject.playAsync();
    }

    getNextAd = async () => {
        var nextAdIdx = 0;
        while (nextAdIdx < this.state.ads.length) {
            if (!this.withinRange(this.state.ads[nextAdIdx].maxLat, this.state.ads[nextAdIdx].minLat,
                this.state.ads[nextAdIdx].maxLong, this.state.ads[nextAdIdx].minLong)) {
                nextAd++;
            }
        }
        if (nextAdIdx == this.state.ads.length) {
            await this.getAdsList();
        }
        if (this.state.ads.length == 0) {
            // no ads found!
            return null;
        }

        var nextAd = this.state.ads.shift();
        console.log("Next ad to play: " + nextAd.file.key)
        return nextAd;
    }

    withinRange = async (maxLat, minLat, maxLong, minLong) => {
        await this._getLocationAsync();
        console.log("Current location: " + this.state.currLat + " " + this.state.currLong);
        if (this.state.currLat <= maxLat && this.state.currLat >= minLat
            &this.state.currLong <= maxLong && this.state.currLong >= minLong) {
            console.log("Ad is within range");
            return true;
        }
        console.log("Ad is not within range");
        return false;
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
        this.setState({ currLat: location.coords.latitude, currLong: location.coords.longitude });
        console.log("Current location is " + this.state.currLat + " " + this.state.currLong);
    };

    getAdsList = async () => {
        console.log("Refresh ad list");
        await this._getLocationAsync();
        try {
            // const response = await API.graphql(graphqlOperation(queries.listAds, { maxLat: 40, minLat: 39.8, maxLong: -75, minLong: -75.2 }));

            const response = await API.graphql(graphqlOperation(queries.listAds, {
                filter: {
                    maxLat: {
                        ge: 15 // TODO: later replace with this.state.currLat
                    }, minLat: {
                        le: 15 // TODO: later replace with this.state.currLat
                    }, maxLng: {
                        ge: 15 // TODO: later replace with this.state.currLong
                    }, minLng: {
                        le: 15 // TODO: later replace with this.state.currLong
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

    // addPost = async () => {
    //     try {
    //         const postObj = {
    //             uniqueID: "doug@walmart.com-10:02",
    //             campaignName: "walmartC",
    //             adName: "make money quick",
    //             owner: "doug@walmart.com",
    //             maxLat: 40,
    //             minLat: 39.8,
    //             maxLng: -75,
    //             minLng: -75.2,
    //             file: { bucket: "adio-1", region: "us-east-1", key: "BeautifulNow.m4a" }

    //         }
    //         await API.graphql(graphqlOperation(mutations.createAd, { input: postObj }))
    //         this.setState({ input: "" });
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    render() {

        return (
            <View style={{flex: 1 }}>
                <ImageBackground source={require('../assets/background2.png')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.85}}>
                    <Text style={{textAlign: 'center', color: '#000', fontFamily: 'comfortaa', fontSize: 64, marginTop: 75}}>adio</Text>
                    <View>
                        <Button
                            style={HomeTheme.playButton}
                            onPress={this.startPlaying}
                            type="clear"
                            icon={
                                <Icon
                                    name={this.state.sessionActive ? "pause-circle" : "play-circle"}
                                    size={160}
                                    color="rgb(0,0,0)"
                                />
                            }
                        />
                    </View>
                    <TouchableOpacity style={HomeTheme.button} onPress={this.signOut}>
                        <Text style={HomeTheme.buttonText}> Logout </Text>
                    </TouchableOpacity>
                    <Slider
                        value={this.state.volume}
                        onValueChange={this.sliderChange}/>
                    <Image source={require('../assets/adio-white.png')} style={HomeTheme.logo}/>
                </ImageBackground>
            </View >
        )

    }
}