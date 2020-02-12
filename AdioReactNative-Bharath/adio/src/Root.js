import React from 'react';
import { Storage } from 'aws-amplify';
import { Audio } from "expo-av";
import { StyleSheet, Text, View, FlatList, TextInput, Button } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import * as subscriptions from "./graphql/subscriptions";


export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quotes: [],
            input: ""
        }
    }

    componentDidMount() {
        this.getAdsList();
        // API.graphql(graphqlOperation(subscriptions.onCreateAd)).subscribe({
        //     next: (data) => {
        //         console.log(data);
        //         const addedQuote = data.value.data.onCreateQuote;
        //         this.setState({ quotes: [addedQuote, ...this.state.quotes] });
        //     }
        // });
        // API.graphql(graphqlOperation(subscriptions.onDeleteQuote)).subscribe({
        //     next: (data) => {
        //         console.log(data);
        //         const removedQuote = data.value.data.onDeleteQuote;
        //         const updatedList = this.state.quotes.filter((quote => {
        //             return quote.id !== removedQuote.id;
        //         }))
        //         this.setState({ quotes: updatedList });
        //     }
        // });
    }

    getAdsList = async () => {
        try {
            const latLongObj = {
                maxLat: 40,
                minLat: 39.8,
                maxLong: -75,
                minLong: -75.2
            }
            const response = await API.graphql(graphqlOperation(queries.listAds, { input: latLongObj }));
            this.setState({ ads: response.data.listAds.items });
            const url = await Storage.get('BeautifulNow.m4a', { customPrefix: { public: '', protected: '', private: '' } });
            //console.log(url);
            //const publicUrl = "https://s3.amazonaws.com/adioc492d9a3e7204c369b78b9a304571a10215215-adio/BeautifulNow.m4a";
<<<<<<< HEAD
<<<<<<< HEAD
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, interruptionModeIOS: INTERRUPTION_MODE_IOS_DUCK_OTHERS,staysActiveInBackground: true });
=======
>>>>>>> parent of 1ef5982... Added background playing
=======
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
>>>>>>> parent of 08349c4... added ducking
            const soundObject = new Audio.Sound();
            try {
                await soundObject.loadAsync({ uri: url });
                await soundObject.playAsync();
                // Your sound is playing!
            } catch (error) {
                // An error occurred!
            }

        } catch (err) {
            console.error(err);
        }
    }

    addPost = async () => {
        try {
            const postObj = {
                uniqueID: "doug@walmart.com-10:02",
                campaignName: "walmartC",
                adName: "make money quick",
                owner: "doug@walmart.com",
                maxLat: 40,
                minLat: 39.8,
                maxLng: -75,
                minLng: -75.2,
                file: { bucket: "adioc492d9a3e7204c369b78b9a304571a10215215-adio", region: "us-east-1", key: "BeautifulNow.m4a" }

            }
            await API.graphql(graphqlOperation(mutations.createAd, { input: postObj }))
            this.setState({ input: "" });
        } catch (err) {
            console.error(err);
        }
    }
    // deleteQuote = async (id) => {
    //     try {
    //         await API.graphql(graphqlOperation(mutations.deleteQuote, { input: { id: id } }))
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    render() {

        return (
            <View style={styles.container}>
                <TextInput
                    style={{ height: 40 }}
                    value={this.state.input}
                    placeholder="Type a post!"
                    onChangeText={(text) => this.setState({ input: text })}
                />
                <Button title="Add Post" onPress={this.addPost} />
                <FlatList
                    data={this.state.ads}
                    renderItem={({ item }) => (
                        <View key={item.id}>
                            <Text style={styles.item}>"{item.adName}"</Text>
                            <Text style={styles.item}>- {item.file.key}</Text>
                            {/* <View style={{ width: 150 }}>
                                <Button title="Delete Quote" color="#ffa500" onPress={() => this.deleteQuote(item.id)} />
                            </View> */}
                        </View>

                    )}
                />
            </View>
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