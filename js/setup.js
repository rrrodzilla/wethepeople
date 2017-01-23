/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, AsyncStorage} from 'react';
import {
  Platform,
} from 'react-native';
import Exponent from 'exponent';
import {bindActionCreators} from 'redux';
import {Provider as ReduxProvider, connect} from 'react-redux';
import Store from 'Store';
import Router from 'Router';
import {NavigationContext, NavigationProvider, StackNavigation, withNavigation} from '@exponent/ex-navigation';
import App from 'App';
const navigationContext = new NavigationContext({router: Router, store: Store});

export default class AppContainer extends React.Component {
  render() {
    return (
      <ReduxProvider store={Store}>
        <NavigationProvider router={Router} context={navigationContext}>
          <App {...this.props}/>
        </NavigationProvider>
      </ReduxProvider>
    );
  }
}
