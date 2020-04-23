import React, { useState } from 'react';
import { Auth, Storage } from 'aws-amplify';
import {Text, View, Image, ImageBackground, TouchableOpacity, Slider, Switch } from 'react-native';
import SettingsTheme from '../libs/SettingsTheme';
import SettingsThemeDark from '../libs/SettingsThemeDark';

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
                        <Text style={{textAlign: 'center', color: '#fff', fontFamily: 'comfortaa', fontSize: 50, marginTop: 120}}>settings</Text>
                        <View style={SettingsThemeDark.darkModeContainer}>
                            <Text style={SettingsThemeDark.darkModeLabel}>dark mode</Text>
                            <Switch
                                style={SettingsThemeDark.darkModeSwitch}
                                trackColor={{ false: "#767577", true: "#fff" }}
                                thumbColor={"#000"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={this.toggleSwitch}
                                value={this.props.navigation.state.params.isDarkMode}
                            />
                        </View>
                        <View style={SettingsThemeDark.sliderContainer1}>
                            <Text style={SettingsThemeDark.sliderLabel}>volume</Text>
                            <Slider
                                style={SettingsThemeDark.slider}
                                step={1}
                                minimumValue={1}
                                maximumValue={10}
                                value={this.state.volume}
                                minimumTrackTintColor={'#fff'}
                                maximumTrackTintColor={'rgba(255,255,255,0.3)'}
                                thumbTintColor={'#fff'}
                                onValueChange={value => { this.setState({ volume: value });
                                        if (this.state.isLoaded) {
                                            this.state.soundObject.setVolumeAsync(value / 10.0); 
                                        }
                                    }
                                }
                            />
                            <Text style={SettingsThemeDark.sliderValue}>{this.state.volume}</Text>
                        </View>
                        <Text style={SettingsThemeDark.sliderDescription}>volume of ads</Text>
                        <View style={SettingsThemeDark.sliderContainer}>
                            <Text style={SettingsThemeDark.sliderLabel}>ad freq</Text>
                            <Slider
                                style={SettingsThemeDark.slider}
                                step={1}
                                minimumValue={1}
                                maximumValue={8}
                                value={this.state.adInterval}
                                minimumTrackTintColor={'#fff'}
                                maximumTrackTintColor={'rgba(255,255,255,0.3)'}
                                thumbTintColor={'#fff'}
                                onValueChange={value => this.setState({ adInterval: value })}
                            />
                            <Text style={SettingsThemeDark.sliderValue}>{this.state.adInterval}</Text>
                        </View>
                        <Text style={SettingsThemeDark.sliderDescription}>mins between ads</Text>
                        <TouchableOpacity style={SettingsThemeDark.logoutButton} onPress={() => {this.props.navigation.state.params.changeDarkMode(this.props.navigation.state.params.isDarkMode); this.props.navigation.goBack()}} >
                            <Text style={SettingsThemeDark.logoutButtonText}> back </Text>
                        </TouchableOpacity>
                        <Image source={require('../assets/adio-black.png')} style={SettingsThemeDark.logo}/>
                    </ImageBackground>
                </View >
            );
        } else {
            return (
                <View style={{flex: 1 }}>
                    <ImageBackground source={require('../assets/background3Light.jpg')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.99}}>
                        <Text style={{textAlign: 'center', color: '#000', fontFamily: 'comfortaa', fontSize: 50, marginTop: 120}}>settings</Text>
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