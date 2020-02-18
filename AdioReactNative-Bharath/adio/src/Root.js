import React from 'react';
import { Storage } from 'aws-amplify';
import { Audio } from "expo-av";
import { StyleSheet, Text, View, FlatList, TextInput, Button } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import * as subscriptions from "./graphql/subscriptions";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quotes: [],
            input: "",
            hasLocationPermissions: false,
            locationResult: null,
            uniqueID: "",
            campaignName: "",
            adName: "",
            owner: "",
            maxLat: 40,
            minLat: 39.8,
            maxLng: -75,
            minLng: -75.2,
            key: ""
        }
    }

    componentDidMount() {
        this.getAdsList();
        this._getLocationAsync();
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

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                locationResult: 'Permission to access location was denied',
            });
        } else {
            this.setState({ hasLocationPermissions: true });
        }
        
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ locationResult: JSON.stringify(location) });        
    };

    getAdsList = async () => {
        try {
            // const latLongObj = {
            //     maxLat: 40,
            //     minLat: 39.8,
            //     maxLong: -75,
            //     minLong: -75.2
            // }
            const latLongObj = {
                lat: 38,
                long: -75,
            }
            
            // const response = await API.graphql(
            //     graphqlOperation(
            //         queries.listAds, { 
            //             input: latLongObj 
            //         }
            //     )
            // );

            // TODO(sneha): test whether query is working properly, how many 
            const response = await API.graphql(
                graphqlOperation(
                    queries.listAds, { 
                        filter: {
                            maxLat: {
                                ge: latLongObj.lat
                            },
                            maxLng: {
                                ge: latLongObj.long
                            },
                            minLat: {
                                le: latLongObj.lat
                            },
                            minLng: {
                                le: latLongObj.long
                            }
                        }
                    }
                )
            );
            this.setState({ ads: response.data.listAds.items });
            const url = await Storage.get('BeautifulNow.m4a', { customPrefix: { public: '', protected: '', private: '' } });
            //console.log(url);
            //const publicUrl = "https://s3.amazonaws.com/adioc492d9a3e7204c369b78b9a304571a10215215-adio/BeautifulNow.m4a";
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
            await API.graphql(
                graphqlOperation(
                    mutations.createAd, { 
                        input: {
                            uniqueID: this.state.uniqueId,
                            campaignName: this.state.campaignName,
                            adName: this.state.adName,
                            owner: this.state.owner,
                            maxLat: this.state.maxLat,
                            minLat: this.state.minLat,
                            maxLng: this.state.maxLng,
                            minLng: this.state.minLng,
                            file: { 
                                bucket: "adioc492d9a3e7204c369b78b9a304571a10215215-adio", 
                                region: "us-east-1", 
                                key: this.state.key 
                            }
                        } 
                    }
                )
            );
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
                {/* {
                    this.state.locationResult === null ?
                    <Text>Finding your current location...</Text> :
                    this.state.hasLocationPermissions === false ?
                        <Text>Location permissions are not granted.</Text> :
                    <Text>Found!</Text>
                } */}

                {/* <Text>
                    Location: {this.state.locationResult}
                </Text> */}

                {/* Form below adds dummy data to the dynamodb  */}
                <TextInput
                    placeholder='unique id'
                    value={this.state.uniqueId}
                    style={{ height: 50, margin: 5, borderColor: '#000000', borderWidth: 1 }}
                    onChangeText={v => this.setState({uniqueId: v})}
                />
                <TextInput
                    placeholder='campaign name'
                    value={this.state.campaignName}
                    style={{ height: 50, margin: 5, borderColor: '#000000', borderWidth: 1 }}
                    onChangeText={v => this.setState({campaignName: v})}
                />
                <TextInput
                    placeholder='ad name'
                    value={this.state.adName}
                    style={{ height: 50, margin: 5, borderColor: '#000000', borderWidth: 1 }}
                    onChangeText={v => this.setState({adName: v})}
                />
                <TextInput
                    placeholder='owner'
                    value={this.state.owner}
                    style={{ height: 50, margin: 5, borderColor: '#000000', borderWidth: 1 }}
                    onChangeText={v => this.setState({owner: v})}
                />
                <TextInput
                    placeholder='max latitude'
                    value={this.state.maxLat}
                    style={{ height: 50, margin: 5, borderColor: '#000000', borderWidth: 1 }}
                    onChangeText={v => this.setState({maxLat: v})}
                />
                <TextInput
                    placeholder='min latitude'
                    value={this.state.minLat}
                    style={{ height: 50, margin: 5, borderColor: '#000000', borderWidth: 1 }}
                    onChangeText={v => this.setState({minLat: v})}
                />
                <TextInput
                    placeholder='max longitude'
                    value={this.state.maxLng}
                    style={{ height: 50, margin: 5, borderColor: '#000000', borderWidth: 1 }}
                    onChangeText={v => this.setState({maxLng: v})}
                />
                <TextInput
                    placeholder='min longitude'
                    value={this.state.minLng}
                    style={{ height: 50, margin: 5, borderColor: '#000000', borderWidth: 1 }}
                    onChangeText={v => this.setState({minLng: v})}
                />
                <TextInput
                    placeholder='key'
                    value={this.state.key}
                    style={{ height: 50, margin: 5, borderColor: '#000000', borderWidth: 1 }}
                    onChangeText={v => this.setState({key: v})}
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