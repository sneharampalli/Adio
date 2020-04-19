import React from 'react';
import { Auth, Storage } from 'aws-amplify';
import { Audio } from "expo-av";
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import * as subscriptions from "./graphql/subscriptions";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Analytics } from 'aws-amplify'

Analytics.configure({ disabled: true })

export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sessionActive: false,
            hasLocationPermissions: false,
            locationResult: null,
            ads: []
        }
    }

    componentDidMount() {
        this.setupAudioPlayer();
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
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS, staysActiveInBackground: true, interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS });
        const soundObject = new Audio.Sound();
        this.setState({soundObject: soundObject});
    }

    startPlaying = async () => {
        await this._getLocationAsync();
        if (!this.state.hasLocationPermissions) {
            console.log("Cannot access location due to permissions.");
            return;
        }
        if (!this.state.sessionActive) {
            this.setState({ sessionActive: true });
            this.playAd();
            var intervalId = window.setInterval(this.playAd, 7000); // plays ad every 7 seconds
            this.setState({intervalId: intervalId});
        } else {
            this.setState({sessionActive: false});
            let state = this.state;
            let shouldPause = false;
            await this.state.soundObject.getStatusAsync().then(function(result) {
                if (result.isPlaying) {
                    shouldPause = true;
                }
            });
            if (shouldPause) {
                console.log("Pausing current song");
                await state.soundObject.pauseAsync();
            }
            window.clearInterval(this.state.intervalId);
        }
    }

    playAd = async () => {
        console.log("Time to play new ad!");
        let self = this;
        let songLoaded = false;
        let didFinish = false;
        console.log(this.state.soundObject);
        await this.state.soundObject.getStatusAsync().then(function (result) {
            console.log(result);
            if (result.isLoaded) {
                console.log("Some song already loaded.");
                songLoaded = true;
                if (result.isPlaying) {
                    didFinish = true;
                    console.log("Song was over, playing new ad.");
                } else {
                    console.log("Continuing to play old ad.");
                }
            } else {
                console.log("No song loaded.");
            }
        });
        if (songLoaded) {
            if (didFinish) {
                console.log("Resetting sound object");
                self.setState({soundObject: new Audio.Sound()});
                console.log("Reset sound object");
            } else {
                console.log("Continue to play old ad.")
                await this.state.soundObject.playAsync();
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
        console.log("Current location: " + this.state.locationResult);
        var currLoc = this.state.locationResult.coords;
        if (currLoc.latitude <= maxLat && currLoc.latitude >= minLat
            && currLoc.longitude <= maxLong && currLoc.longitude >= minLong) {
            return true;
        }
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
        this.setState({ locationResult: JSON.stringify(location) });
        console.log("Current location is " + this.state.locationResult);
    };

    getAdsList = async () => {
        await this._getLocationAsync();
        try {
            // const response = await API.graphql(graphqlOperation(queries.listAds, { maxLat: 40, minLat: 39.8, maxLong: -75, minLong: -75.2 }));
            const response = await API.graphql(graphqlOperation(queries.listAds, { maxLat: 10, minLat: 10, maxLong: 10, minLong: 10 }));
            this.setState({ ads: response.data.listAds.items });
            console.log("Got list of ads: " + this.state.ads);
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
            <View style={styles.container, { flex: 1, backgroundColor: '#96D1C7' }}>
                <View>
                    <Button
                        onPress={this.startPlaying}
                        type="clear"
                        icon={
                            <Icon
                                name={this.state.sessionActive ? "pause-circle" : "play-circle"}
                                size={200}
                                color="white"
                            />
                        }
                    />
                </View>
                <Button title="Log Out" onPress={this.signOut} />
            </View >
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        marginLeft: 20,
        marginRight: 20
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    }
})