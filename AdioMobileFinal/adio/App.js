import React, { useState, useEffect } from 'react';
import Root from './src/Root';
import Amplify from 'aws-amplify';
import { Animated, Text, View, Image, ImageBackground } from 'react-native';
import * as Font from 'expo-font';
import awsmobile from './src/aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import LoginTheme from './libs/LoginTheme'

Amplify.configure(awsmobile);
// const MyTheme = {
//   button: { backgroundColor: "green", borderColor: "red" },
//   signInButtonIcon: { display: "none" }
// };
const signUpConfig = {
  hiddenDefaults: ["username"],
  signUpFields: [
    { label: "First Name", key: "name", required: true, type: "string", displayOrder: 1 },
    { label: "Last Name", key: "family_name", required: true, type: "string", displayOrder: 2 },
    { label: "Email", key: "email", required: true, type: "string", displayOrder: 3 },
    { label: "Phone Number", key: "phone_number", required: true, type: "string", displayOrder: 4 },
    { label: "Password", key: "password", required: true, type: "string", displayOrder: 5 }
  ]
};
const usernameAttributes = 'email';
const myContainer = Object.assign({}, LoginTheme.container, { backgroundColor: 'rgba(0,0,0,0.01)', opacity: 1.0 });
const myButton = Object.assign({}, LoginTheme.button, { backgroundColor: '#000' });
const myButtonDisabled = Object.assign({}, LoginTheme.buttonDisabled, { backgroundColor: '#000' });
const mySectionFooterLink = Object.assign({}, LoginTheme.sectionFooterLink, { color: '#000' });
const myInput = Object.assign({}, LoginTheme.input, { borderColor: '#000', borderWidth: 1});
const MyTheme = Object.assign({}, LoginTheme, {container: myContainer, input: myInput, button: myButton, buttonDisabled: myButtonDisabled, sectionFooterLink: mySectionFooterLink });
const AppWithAuth = withAuthenticator(Root, {
  signUpConfig, usernameAttributes
}, [], null, MyTheme);

const FadeInView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(0))  // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.sequence([
      Animated.delay(props.delay ? Number(props.delay) : 0),
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: Number(props.duration),
        })
    ]).start();
  });

  return (
    <Animated.View                 // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,         // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
}

export default class App extends React.Component {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'comfortaa': require('./assets/fonts/Comfortaa/Comfortaa-VariableFont.ttf'),
    });
    console.log('here');
    this.setState({ fontLoaded: true });
  }

  render() {
    console.reportErrorsAsExceptions = false;
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground source={require('./background1.png')} style={{width: '100%', height: '100%'}} imageStyle= 
{{opacity:0.5}}>
        {
          this.state.fontLoaded ? (
            <FadeInView duration="1500" >
              <Text style={{
                textAlign: 'center',
                color: '#000',
                fontFamily: 'comfortaa',
                fontSize: 64,
                marginTop: 75,

              }}>adio</Text>
            </FadeInView>
          ) : <Text style={{
            textAlign: 'center',
            color: '#fff',
            fontSize: 64,
            marginTop: 75,
            height: 60
          }}></Text>
        }<FadeInView duration="1000" delay="500" style={{ flex: 1 }}>
          <AppWithAuth />
        </FadeInView>
        </ImageBackground>
      </View >
    )
  }
}