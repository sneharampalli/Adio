import React from 'react';
import { Auth, Storage } from 'aws-amplify';
import { StyleSheet, Text, View, FlatList, Image, ImageBackground, TouchableOpacity, Slider } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Analytics } from 'aws-amplify';
import ProfileTheme from '../libs/ProfileTheme.js';
import { Avatar } from 'react-native-elements';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initials: '',
            name: '',
            email: '',
            phone: '',
        }
    }
    async componentDidMount() {
        Auth.currentAuthenticatedUser({}).then(user => 
            this.setState({ initials: user.attributes.name.charAt(0).toUpperCase() + user.attributes.family_name.charAt(0).toUpperCase(), 
                name: user.attributes.name + ' ' + user.attributes.family_name, 
                email: user.attributes.email,
                phone: user.attributes.phone_number})
        )

    }

    render() {
        return (
            <View style={{flex: 1 }}>
                <ImageBackground source={require('../assets/background3.png')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.85}}>
                    <Avatar size={200} containerStyle={ProfileTheme.avatar} onPress={() =>
                                this.props.navigation.navigate('Home')
                            } overlayContainerStyle={{backgroundColor: 'rgba(50,50,50,0.9)'}} rounded title={this.state.initials} />
                    <Text style={ProfileTheme.text}>{this.state.name}</Text>
                    <Text style={ProfileTheme.text}>{this.state.email}</Text>
                    <Text style={ProfileTheme.text}>{this.state.phone}</Text>
                    <TouchableOpacity style={ProfileTheme.logoutButton} onPress={() => this.props.navigation.navigate('Home')} >
                        <Text style={ProfileTheme.logoutButtonText}> back </Text>
                    </TouchableOpacity>
                    <Image source={require('../assets/adio-white.png')} style={ProfileTheme.logo}/>
                </ImageBackground>
            </View >
        );
    }
}