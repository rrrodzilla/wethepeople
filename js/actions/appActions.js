/**
 * @providesModule AppActions
 * @flow
 */
import {NavigationActions} from '@exponent/ex-navigation'
import Store from 'Store';
import Router from 'Router'
import * as types from './actionTypes.js';
import * as api from 'API';
import thunk from 'redux-thunk';
import initialState from 'InitialState';
import Exponent from 'exponent';
import {Platform} from 'react-native';
import {Permissions, Notifications} from 'exponent';
import {NavigationContext, NavigationProvider, StackNavigation} from '@exponent/ex-navigation';
const navigationContext = new NavigationContext({router: Router, store: Store})



export function SetLoading(isLoading) {
  return _setLoading(isLoading);
}

function _setLoading(isLoading) {
  return {type: types.LOADING, isLoading}
}


function UpsertUser(user) {
  return {type: types.UPSERT_USER, user};
}
export function _upsertUser({user}) {

  return function (dispatch, getState) {

    var url = api.UPSERT_USER;
    console.log("incoming user");
    console.log(user);
    console.log("stringified user");
    var stringify = JSON.stringify({
      "id": user.id,
      "name": user.name,
      "profilePic": user.profilePic,
      "socialMediaId": user.socialMediaId,
      "accountType": user.accountType,
      "stripeSubscriptionPlan": user.stripeSubscriptionPlan
    });
    console.log(stringify);
    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
        method: 'POST',
        body: JSON.stringify({"name": user.name, "id": user.id, "profilePic": user.profilePic, "socialMediaId": user.socialMediaId, "accountType": user.accountType})
      })
      .then(function (result) {
        console.log("UPSERT RESULTS");
        console.log(result);
        if (result.status === 200) {
          return result.json();
        }
      })
      .then(function (jsonResult) {
        console.log("Returned JSON");
        console.log(jsonResult);
        var obj = JSON.parse(jsonResult);
        var updatedUser = {
          ...user,
          stripeSubscriptionPlan: obj.stripeSubscriptionPlan,
          registrationDate: obj.registrationDate
        }
        return updatedUser;
      })
      .then(function (updatedUser) {
        return dispatch(UpsertUser(updatedUser));
      })
      .catch(function (err) {
        console.log("*** ERROR ***");
        console.log(err);
      });
  }
}
// "{'name':'My iPad','pushToken': 'ExponentPushToken[H4fVGAAQfmvfIbUyTFNrLk]'}"
// when facebook finishes logging out a user
function _logout(state) {
  return {type: types.LOGOUT, loggedIn: state};

}

export function logout(state) {
  return async function (dispatch, getState) {
    // var prevState = getState(); const rootNavigator = prevState   .navigation
    // .getNavigator('root'); let navigatorUID =
    // state.navigation.currentNavigatorUID; NavigationActions.replace("root");

    return dispatch(_logout(state));
  }
}
export function swipedCard(direction) {
  return {type: types.SWIPED_CARD, direction:direction};
}
export function swipedCardEnded(direction) {
  return {type: types.SWIPED_CARD_ENDED, direction:direction};
}

//when facebook finishes logging out a user
export function login(state) {
  return {type: types.LOGIN, loggedIn: state};
}

export function setFirstLoad(hasLoaded) {
  return {type: types.LOGIN, loaded: hasLoaded};
}


// async thunk method to retrieve FB User details dispatches the
// GET_FB_USER_DETAILS action when completed
export function syncFBUser(token, {user}) {
  return function (dispatch, getState) {
    var u = getState();
    var url = api.FB_GRAPH_URL + token;

    fetch(url).then(function (result) {
      if (result.status === 200) {
        return result.json();
        }
      })
      .then(function (jsonResult) {
        var updatedUser = {
          ...u.wethepeople.user,
          id: jsonResult.email,
          name: jsonResult.name,
          socialMediaId: jsonResult.id,
          accountType: "facebook",
          profilePic: jsonResult.picture.data.url
        }

        return dispatch(_upsertUser({user: updatedUser}));
      })
      .catch(function (err) {
        console.log(err);
      });
  };
}

export function signInFB() {

  return async function (dispatch, getState) {
    var props = getState();
    const {type, token} = await Exponent
      .Facebook
      .logInWithReadPermissionsAsync(api.FB_APP_ID, {
        permissions: ['email', 'public_profile', 'user_location']
      });
    if (type === 'success') {
      //first we want to sync the user info
      Promise.all([
        dispatch(syncFBUser(token, props.wethepeople.user)),
        dispatch(login(props.wethepeople.loggedIn))
      ])

    }

  }

}

