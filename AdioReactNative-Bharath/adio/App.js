import React from 'react';
import Root from './src/Root';
import Amplify from 'aws-amplify';
import awsmobile from './src/aws-exports';
import { withAuthenticator, AmplifyTheme } from 'aws-amplify-react-native';

Amplify.configure(awsmobile);
// const MyTheme = {
//   button: { backgroundColor: "green", borderColor: "red" },
//   signInButtonIcon: { display: "none" }
// };
const signUpConfig = {
  hiddenDefaults: ["username"],
  signUpFields: [
    { label: "First", key: "name", required: true, type: "string", displayOrder: 1 },
    { label: "Last", key: "family_name", required: true, type: "string", displayOrder: 2 },
    { label: "Email", key: "email", required: true, type: "string", displayOrder: 3 },
    { label: "Phone Number", key: "phone_number", required: true, type: "string", displayOrder: 4 },
    { label: "Password", key: "password", required: true, type: "string", displayOrder: 5 }
  ]
};
const usernameAttributes = 'Email';
const MySectionHeader = Object.assign({}, AmplifyTheme.container, { backgroundColor: '#96D1C7' });
const MyTheme = Object.assign({}, AmplifyTheme, { container: MySectionHeader });
const AppWithAuth = withAuthenticator(Root, {
  signUpConfig, usernameAttributes
}, [], null, MyTheme);



export default class App extends React.Component {
  render() {
    return <AppWithAuth />
  }
}