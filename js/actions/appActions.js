/**
 * @providesModule AppActions
 * @flow
 */
import {NavigationActions} from '@exponent/ex-navigation'
import Store from 'Store';
import Router from 'Router'
import * as types from './actionTypes.js';
import thunk from 'redux-thunk';
import initialState from 'InitialState';
import Exponent from 'exponent';
import {Platform} from 'react-native';
import * as api from 'API';
import {Permissions, Notifications} from 'exponent';
import {NavigationContext, NavigationProvider, StackNavigation} from '@exponent/ex-navigation';
const navigationContext = new NavigationContext({router: Router, store: Store})



export function SetLoading(isLoading) {
  return _setLoading(isLoading);
}

function _setLoading(isLoading) {
  return {type: types.LOADING, isLoading}
}


// when facebook finishes logging out a user
function _logout(state) {
  return {type: types.LOGOUT, loggedIn: state};

}

export function logout(state) {
  return async function (dispatch, getState) {
    //why this thunked method before logout?
    //you'll probably want to do some things with the account
    //or various portions based on your backend db.  You'd do this here
    return dispatch(_logout(state));
  }
}
export function swipedCard(direction) {
  return {type: types.SWIPED_CARD, direction:direction};
}
export function swipedCardEnded(direction) {
  return {type: types.SWIPED_CARD_ENDED, direction:direction};
}

export function login(state) {
  return {type: types.LOGIN, loggedIn: state};
}

export function setFirstLoad(hasLoaded) {
  return {type: types.IS_FIRST_LOAD, loaded: hasLoaded};
}


export function signInFB() {

  return async function (dispatch, getState) {
    var props = getState();
    const {type, token} = await Exponent
      .Facebook
      .logInWithReadPermissionsAsync(api.FB_APP_ID, {
        permissions: ['email', 'public_profile']
      });
    if (type === 'success') {
      Promise.all([

        //additionally you'd want to pull additional dispatches for FB user data and push into
        //your choice of persistent storage
        dispatch(login(props.wethepeople.loggedIn))
      ])

    }

  }

}

