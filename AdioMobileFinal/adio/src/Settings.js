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

    changeVolume = async (value) => {
        this.setState(({volume: value }));
        this.props.navigation.state.params.volume = value;
    }

    changeFreq = async (value) => {
        this.setState(({adInterval: value }));
        this.props.navigation.state.params.adInterval = value;
    }

    render() {
        if (this.props.navigation.state.params.isDarkMode) {
            return (
                <View style={{flex: 1 }}>
                    <ImageBackground source={require('../assets/background3Dark.png')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.99}}>
                        <Text style={{textAlign: 'center', color: '#fff', fontFamily: 'comfortaa', fontSize: 50, marginTop: 120}}>settings</Text>
                        <View style={SettingsThemeDark.darkModeContainer}>
                            <Text style={SettingsThemeDark.darkModeLabel}>night mode</Text>
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
                                minimumValue={2}
                                maximumValue={10}
                                value={this.props.navigation.state.params.volume}
                                minimumTrackTintColor={'#fff'}
                                maximumTrackTintColor={'rgba(255,255,255,0.3)'}
                                thumbTintColor={'#fff'}
                                onValueChange={this.changeVolume}
                            />
                            <Text style={SettingsThemeDark.sliderValue}>{this.props.navigation.state.params.volume}</Text>
                        </View>
                        <Text style={SettingsThemeDark.sliderDescription}>volume of ads</Text>
                        <View style={SettingsThemeDark.sliderContainer}>
                            <Text style={SettingsThemeDark.sliderLabel}>ad freq</Text>
                            <Slider
                                style={SettingsThemeDark.slider}
                                step={1}
                                minimumValue={1}
                                maximumValue={8}
                                value={this.props.navigation.state.params.adInterval}
                                minimumTrackTintColor={'#fff'}
                                maximumTrackTintColor={'rgba(255,255,255,0.3)'}
                                thumbTintColor={'#fff'}
                                onValueChange={this.changeFreq}
                            />
                            <Text style={SettingsThemeDark.sliderValue}>{this.props.navigation.state.params.adInterval}</Text>
                        </View>
                        <Text style={SettingsThemeDark.sliderDescription}>mins between ads</Text>
                        <TouchableOpacity style={SettingsThemeDark.logoutButton} onPress={() => {this.state.useIncomingDarkMode = true;
                            this.props.navigation.state.params.changeDarkMode(this.props.navigation.state.params.isDarkMode);
                            this.props.navigation.state.params.changeVolume(this.props.navigation.state.params.volume);
                            this.props.navigation.state.params.changeFreq(this.props.navigation.state.params.adInterval);
                            this.props.navigation.goBack()}} >
                            <Text style={SettingsThemeDark.logoutButtonText}> back </Text>
                        </TouchableOpacity>
                        <Image source={require('../assets/adio-black.png')} style={SettingsThemeDark.logo}/>
                    </ImageBackground>
                </View >
            );s
        } else {
            return (
                <View style={{flex: 1 }}>
                    <ImageBackground source={require('../assets/background3Light.jpg')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.99}}>
                        <Text style={{textAlign: 'center', color: '#000', fontFamily: 'comfortaa', fontSize: 50, marginTop: 120}}>settings</Text>
                        <View style={SettingsTheme.darkModeContainer}>
                            <Text style={SettingsTheme.darkModeLabel}>night mode</Text>
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
                                minimumValue={2}
                                maximumValue={10}
                                value={this.props.navigation.state.params.volume}
                                minimumTrackTintColor={'#000'}
                                maximumTrackTintColor={'rgba(0,0,0,0.2)'}
                                thumbTintColor={'#000'}
                                onValueChange={this.changeVolume}
                            />
                            <Text style={SettingsTheme.sliderValue}>{this.props.navigation.state.params.volume}</Text>
                        </View>
                        <Text style={SettingsTheme.sliderDescription}>volume of ads</Text>
                        <View style={SettingsTheme.sliderContainer}>
                            <Text style={SettingsTheme.sliderLabel}>ad freq</Text>
                            <Slider
                                style={SettingsTheme.slider}
                                step={1}
                                minimumValue={2}
                                maximumValue={8}
                                value={this.props.navigation.state.params.adInterval}
                                minimumTrackTintColor={'#000'}
                                maximumTrackTintColor={'rgba(0,0,0,0.2)'}
                                thumbTintColor={'#000'}
                                onValueChange={this.changeFreq}
                            />
                            <Text style={SettingsTheme.sliderValue}>{this.props.navigation.state.params.adInterval}</Text>
                        </View>
                        <Text style={SettingsTheme.sliderDescription}>mins between ads</Text>
                        <TouchableOpacity style={SettingsTheme.logoutButton} onPress={() => {this.state.useIncomingDarkMode = true;
                            this.props.navigation.state.params.changeDarkMode(this.props.navigation.state.params.isDarkMode);
                            this.props.navigation.state.params.changeVolume(this.props.navigation.state.params.volume);
                            this.props.navigation.state.params.changeFreq(this.props.navigation.state.params.adInterval);
                            this.props.navigation.goBack()}} >
                            <Text style={SettingsTheme.logoutButtonText}> back </Text>
                        </TouchableOpacity>
                        <Image source={require('../assets/adio-white.png')} style={SettingsTheme.logo}/>
                    </ImageBackground>
                </View >
            );
        }
    }
}