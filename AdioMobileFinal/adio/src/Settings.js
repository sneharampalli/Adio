import React, { useState } from 'react';
import { Auth, Storage } from 'aws-amplify';
import {Text, View, Image, ImageBackground, TouchableOpacity, Slider, Switch } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Analytics } from 'aws-amplify';
import SettingsTheme from '../libs/SettingsTheme.js';
import { Avatar } from 'react-native-elements';
import { Dimensions } from "react-native";

export default class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            darkModeEnabled: false,
            adInterval: 5,
            volume: 5,
        }
    }

    async componentDidMount() {
        // Auth.currentAuthenticatedUser({}).then(user => 
        //     this.setState({ initials: user.attributes.name.charAt(0).toUpperCase() + user.attributes.family_name.charAt(0).toUpperCase(), 
        //         name: user.attributes.name + ' ' + user.attributes.family_name, 
        //         email: user.attributes.email,
        //         phone: user.attributes.phone_number})
        // )
    }


    toggleSwitch = (value) => {
        this.setState({darkModeEnabled: value})
        this.props.navigation.state.params.isDarkMode = value;
    }

    render() {
        if (this.props.navigation.state.params.isDarkMode) {
            return (
                <View style={{flex: 1 }}>
                    <ImageBackground source={require('../assets/background3Dark.png')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.99}}>
                        
                    <View style={SettingsTheme.sliderContainer1}>
                            <Text style={SettingsTheme.sliderLabel}>volume</Text>
                            <Slider
                                style={SettingsTheme.slider}
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
                            <Text style={SettingsTheme.sliderValue}>{this.state.volume}</Text>
                        </View>
                        <Text style={SettingsTheme.sliderDescription}>volume of ads</Text>
                        <View style={SettingsTheme.sliderContainer}>
                            <Text style={SettingsTheme.sliderLabel}>ad freq</Text>
                            <Slider
                                style={SettingsTheme.slider}
                                step={1}
                                minimumValue={1}
                                maximumValue={8}
                                value={this.state.adInterval}
                                minimumTrackTintColor={'#000'}
                                maximumTrackTintColor={'rgba(0,0,0,0.2)'}
                                thumbTintColor={'#000'}
                                onValueChange={value => this.setState({ adInterval: value })}
                            />
                            <Text style={SettingsTheme.sliderValue}>{this.state.adInterval}</Text>
                        </View>
                        <Text style={SettingsTheme.sliderDescription}>mins between ads</Text>
                        <View style={SettingsTheme.darkModeContainer}>
                            <Text style={SettingsTheme.darkModeLabel}>dark mode</Text>
                            <Switch
                                style={SettingsTheme.darkModeSwitch}
                                trackColor={{ false: "#767577", true: "#000" }}
                                thumbColor={"#fff"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={this.toggleSwitch}
                                value={this.props.navigation.state.params.isDarkMode}
                            />
                        </View>
                        <TouchableOpacity style={SettingsTheme.logoutButton} onPress={() => {this.props.navigation.state.params.changeDarkMode(this.props.navigation.state.params.isDarkMode); this.props.navigation.goBack()}} >
                            <Text style={SettingsTheme.logoutButtonText}> back </Text>
                        </TouchableOpacity>
                        <Image source={require('../assets/adio-white.png')} style={SettingsTheme.logo}/>
                    </ImageBackground>
                </View >
            );
        } else {
            return (
                <View style={{flex: 1 }}>
                    <ImageBackground source={require('../assets/background3Light.jpg')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.99}}>
                        
                    <View style={SettingsTheme.sliderContainer1}>
                            <Text style={SettingsTheme.sliderLabel}>volume</Text>
                            <Slider
                                style={SettingsTheme.slider}
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
                            <Text style={SettingsTheme.sliderValue}>{this.state.volume}</Text>
                        </View>
                        <Text style={SettingsTheme.sliderDescription}>volume of ads</Text>
                        <View style={SettingsTheme.sliderContainer}>
                            <Text style={SettingsTheme.sliderLabel}>ad freq</Text>
                            <Slider
                                style={SettingsTheme.slider}
                                step={1}
                                minimumValue={1}
                                maximumValue={8}
                                value={this.state.adInterval}
                                minimumTrackTintColor={'#000'}
                                maximumTrackTintColor={'rgba(0,0,0,0.2)'}
                                thumbTintColor={'#000'}
                                onValueChange={value => this.setState({ adInterval: value })}
                            />
                            <Text style={SettingsTheme.sliderValue}>{this.state.adInterval}</Text>
                        </View>
                        <Text style={SettingsTheme.sliderDescription}>mins between ads</Text>
                        <View style={SettingsTheme.darkModeContainer}>
                            <Text style={SettingsTheme.darkModeLabel}>dark mode</Text>
                            <Switch
                                style={SettingsTheme.darkModeSwitch}
                                trackColor={{ false: "#767577", true: "#000" }}
                                thumbColor={"#fff"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={this.toggleSwitch}
                                value={this.props.navigation.state.params.isDarkMode}
                            />
                        </View>
                        
                        <TouchableOpacity style={SettingsTheme.logoutButton} onPress={() => {this.state.useIncomingDarkMode = true; this.props.navigation.state.params.changeDarkMode(this.props.navigation.state.params.isDarkMode); this.props.navigation.goBack()}} >
                            <Text style={SettingsTheme.logoutButtonText}> back </Text>
                        </TouchableOpacity>
                        <Image source={require('../assets/adio-white.png')} style={SettingsTheme.logo}/>
                    </ImageBackground>
                </View >
            );
        }
    }
}