/**
 * @providesModule AppReducers
 * @flow
 */
import React from 'react';
import CreateReducer from 'CreateReducer';
import * as types from 'ActionTypes';
import initialState from 'InitialState';

export const loading = CreateReducer({}, {
    [types.LOGOUT](state, action) {
        return initialState.wethepeople.loading;
    },
    [types.LOADING](state, action) {
        return action.isLoading;
    }
});

export const isFirstLoad = CreateReducer({}, {
    [types.LOGOUT](state, action) {
        return initialState.wethepeople.isFirstLoad;
    },
    [types.IS_FIRST_LOAD](state, action) {
        return action.loaded;
    }
});

export const presidentialQuotes = CreateReducer({}, {
    ["REDUX_STORAGE_LOAD"](state, action) {
        return initialState.wethepeople.presidentialQuotes;
    },
});

export const cards = CreateReducer({}, {
    ["REDUX_STORAGE_LOAD"](state, action) {
        return initialState.wethepeople.cards;
    },
    [types.SWIPED_CARD_ENDED](state, action) {
        var updatedCards = state.slice();
        updatedCards.pop();
        console.log(state.length);  
        if (state.length != 1) {
            var newTopCard = updatedCards[updatedCards.length - 1];
            newTopCard.index = 1;
        }
        return updatedCards;
    },
    [types.SWIPED_CARD](state, action) {
        return state;
    }
});
export const swipedDirection = CreateReducer({}, {
    [types.SWIPED_CARD](state, action) {
        return action.direction;
    }
});

export const swiping = CreateReducer({}, {
    [types.SWIPED_CARD](state, action) {
        return true;
    },
    [types.SWIPED_CARD_ENDED](state, action) {
        return false;
    }
});

export const user = CreateReducer({}, {
    [types.LOGOUT](state, action) {
        return initialState.wethepeople.user;
    },
    ["REDUX_STORAGE_LOAD"](state, action) {
        return (typeof action.payload.wethepeople.user.id != 'undefined')
            ? action.payload.wethepeople.user
            : initialState.wethepeople.user;
    }
});

export const loggedIn = CreateReducer({}, {
    [types.LOGOUT](state, action) {
        return initialState.wethepeople.loggedIn;
    },
    [types.LOGIN](state, action) {
        return true;
    },
    ["REDUX_STORAGE_LOAD"](state, action) {
        return action.payload.wethepeople.loggedIn
    }
});
