/**
 * @providesModule Store
 * @flow
 */

import { createNavigationEnabledStore, NavigationReducer } from '@exponent/ex-navigation';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { ReducersCombined } from 'ReducersIndex';
import * as types from 'ActionTypes';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import * as api from 'API';
import initialState from 'InitialState';

const engine = createEngine(api.STORAGE_SAVE_KEY);
const middlewares = [thunk];
const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});
middlewares.push(storage.createMiddleware(engine,[types.SWIPED_CARD, types.SWIPED_CARD_ENDED]));
middlewares.push(loggerMiddleware);
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
const createStoreWithNavigation = createNavigationEnabledStore({ createStore: createStoreWithMiddleware, navigationStateKey: 'navigation' });
const store = createStoreWithNavigation(
  /* combineReducers and your normal create store things here! */
  combineReducers({
    navigation: NavigationReducer,
    wethepeople: ReducersCombined
    // other reducers
  }), initialState);

const load = storage.createLoader(engine);
//load(store);

async function loadStore() {
  await load(store)
    .then((newState) => {})
    .catch(() => console.log('Failed to load previous state'));
}


loadStore();

export default store;
