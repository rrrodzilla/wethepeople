/**
 * @providesModule ReducersIndex
 * @flow
 */

import {combineReducers} from 'redux';
import * as appReducers from 'AppReducers';

export const ReducersCombined =  combineReducers(Object.assign(appReducers,));
