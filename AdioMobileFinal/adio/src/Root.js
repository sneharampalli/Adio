import React from 'react';
import { Storage, Auth } from 'aws-amplify';
import { Audio } from "expo-av";
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import * as subscriptions from "./graphql/subscriptions";


export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sessionActive: false,
        }
    }

    componentDidMount() {
        this.getAdsList();
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

    getAdsList = async () => {
        const latLongObj = {
            maxLat: 40,
            minLat: 39.8,
            maxLong: -75,
            minLong: -75.2
        }
        try {
            const response = await API.graphql(graphqlOperation(queries.listAds, { input: latLongObj }));
            this.setState({ ads: response.data.listAds.items });
            const url = await Storage.get('BeautifulNow.m4a', { customPrefix: { public: '', protected: '', private: '' } });
            // const publicUrl = "https://s3.amazonaws.com/adioc492d9a3e7204c369b78b9a304571a10215215-adio/BeautifulNow.m4a";
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS, staysActiveInBackground: true, interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS });
            const soundObject = new Audio.Sound();
            await soundObject.loadAsync({ uri: url });
            await soundObject.playAsync();
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
    //             file: { bucket: "adioc492d9a3e7204c369b78b9a304571a10215215-adio", region: "us-east-1", key: "BeautifulNow.m4a" }

    //         }
    //         await API.graphql(graphqlOperation(mutations.createAd, { input: postObj }))
    //         this.setState({ input: "" });
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    render() {

        return (
            <View style={styles.container, { flex: 1, backgroundColor: '#96D1C7' }
            }>
                {/* <TextInput
                    style={{ height: 40 }}
                    value={this.state.input}
                    placeholder="Type a post!"
                    onChangeText={(text) => this.setState({ input: text })}
                />
                <Button title="Add Post" onPress={this.addPost} /> */}
                <FlatList
                    data={this.state.ads}
                    renderItem={({ item }) => (
                        <View key={item.id}>
                            <Button
                                onPress={this.signOut}
                                //() => { this.setState({ sessionActive: !this.state.sessionActive }); }}
                                type="clear"
                                icon={
                                    <Icon
                                        name={this.state.sessionActive ? "pause-circle" : "play-circle"}
                                        size={200}
                                        color="white"
                                    />
                                }
                            />
                            {!this.state.sessionActive ? <Text style={styles.item}>Active Session</Text> : <Text style={styles.item}>No Active Session</Text>}
                            {/* <Text style={styles.item}>- {item.file.key}</Text> */}
                            {/* <View style={{ width: 150 }}>
                                <Button title="Delete Quote" color="#ffa500" onPress={() => this.deleteQuote(item.id)} />
                            </View> */}
                        </View>

                    )}
                />
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