import React from 'react';
import Root from './src/Root';
import Amplify from 'aws-amplify';
import awsmobile from './src/aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';

Amplify.configure(awsmobile);
const AppWithAuth = withAuthenticator(Root, true);

export default class App extends React.Component {
  render() {
    return <AppWithAuth />
  }
}