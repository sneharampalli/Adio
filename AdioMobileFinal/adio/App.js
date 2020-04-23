import React from 'react';
import { createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation';
import HomeScreen from './src/Home';
import RootScreen from './src/Root';
import ProfileScreen from './src/Profile';

const AppStack = createStackNavigator({  
    Home: { 
        screen: HomeScreen, 
        navigationOptions: {headerShown: false}
    },
    Root: {
      screen: HomeScreen, 
      navigationOptions: {headerShown: false}
    },
    Profile: { 
        screen: ProfileScreen, 
        navigationOptions: {headerShown: false}
    }
});

const AppNavigator = createAppContainer(AppStack);

export default class App extends React.Component {
  render() {
    return (
      <AppNavigator screenProps={this.props} />
    );
  }
}