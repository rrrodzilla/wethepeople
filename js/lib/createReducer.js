/**
 * @providesModule CreateReducer
 * @flow
 */

import initialState from 'InitialState';

export default function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    }
}
