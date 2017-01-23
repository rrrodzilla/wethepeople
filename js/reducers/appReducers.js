/**
 * @providesModule AppReducers
 * @flow
 */
import React from 'react';
import CreateReducer from 'CreateReducer';
import * as types from '../actions/actionTypes.js';
import initialState from '../lib/initialState.js';

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

export const locationEnabled = CreateReducer({}, {
    // [types.LOGOUT](state, action) {     return
    // initialState.wethepeople.locationEnabled; },
    [types.ENABLE_LOCATION](state, action) {
        console.log('incoming action');
        console.log(action);
        return action.status === 'granted';
    },
    ["REDUX_STORAGE_LOAD"](state, action) {
        return (typeof action.payload.wethepeople.locationEnabled != "")
            ? action.payload.wethepeople.locationEnabled
            : initialState.wethepeople.locationEnabled;
    }
});

export const lastReportedLocation = CreateReducer({}, {
    [types.LOGOUT](state, action) {
        return initialState.wethepeople.lastReportedLocation;
    },
    [types.UPDATE_CURRENT_LOCATION](state, action) {
        return action.currentLocation.locationData;
    }
});

export const deviceToken = CreateReducer({}, {
    // [types.LOGOUT](state, action) {     return
    // initialState.wethepeople.deviceToken; },
    [types.TOKEN_RETRIEVED](state, action) {
        return action.token;
        // return initialState.wethepeople.deviceToken;
    },
    ["REDUX_STORAGE_LOAD"](state, action) {
        return (typeof action.payload.wethepeople.deviceToken != "")
            ? action.payload.wethepeople.deviceToken
            : initialState.deviceToken;
    }
});

// export const notifiedUsers = CreateReducer({}, {
// [types.REPORT_INCIDENT](state, action) {         console.log('setting
// notified users:')         console.log(action.incident.notifiedUsers); return
// action.incident.notifiedUsers;     } });

export const activeIncident = CreateReducer({}, {
    [types.LOGOUT](state, action) {
        return initialState.wethepeople.activeIncident;
    },
    [types.REPORT_INCIDENT](state, action) {
        console.log('setting active incident:')
        console.log(action.incident);
        return action.incident;
    },
    [types.CANCEL_INCIDENT](state, action) {
        console.log('resetting active incident:')
        console.log(action.incident);
        return initialState.wethepeople.activeIncident;
    }
});

export const cards = CreateReducer({}, {
    ["REDUX_STORAGE_LOAD"](state, action) {
        return initialState.wethepeople.cards;
    },
    [types.SWIPED_CARD_ENDED](state, action) {
        if (state.length > 1) {
            var updatedCards = state.slice();
            updatedCards.pop();
            var newTopCard = updatedCards[updatedCards.length - 1];
            newTopCard.index = 1;
            return updatedCards;
        } else {
            return state;
        }
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
    [types.UPSERT_USER](state, action) {
        return action.user;
    },
    ["REDUX_STORAGE_LOAD"](state, action) {
        return (typeof action.payload.wethepeople.user.id != 'undefined')
            ? action.payload.wethepeople.user
            : initialState.wethepeople.user;
    },
    [types.UPGRADE_MEMBERSHIP](state, action) {
        return {
            ...state,
            stripeSubscriptionPlan: action.plan
        }
    }
});

export const isPaidUser = CreateReducer({}, {
    [types.LOGOUT](state, action) {
        return initialState.wethepeople.isPaidUser;
    },
    [types.SET_PAID_USER_STATUS](state, action) {
        return JSON.parse(action.isPaidUser);
    },
    ["REDUX_STORAGE_LOAD"](state, action) {
        return action.payload.wethepeople.isPaidUser;
    }
});

export const latestNews = CreateReducer({}, {
    [types.GET_LATEST_NEWS](state, action) {
        console.log("action.latestNews");
        console.log(action.latestNews);
        return action.latestNews.news;
    }
});

export const incidentInProgress = CreateReducer({}, {
    [types.LOGOUT](state, action) {
        return initialState.wethepeople.incidentInProgress;
    },
    [types.INCIDENT_IN_PROGRESS](state, action) {
        return action.incidentInProgress;
    }
});

export const lowerPanelOpened = CreateReducer({}, {
    [types.LOGOUT](state, action) {
        return initialState.wethepeople.lowerPanelOpened;
    },
    [types.LOWER_PANEL_OPENED](state, action) {
        return action.isOpened;
    }
});

export const notifications = CreateReducer({}, {
    [types.LOGOUT](state, action) {
        return initialState.wethepeople.notifications;
    },
    [types.HANDLE_REQUEST_NOTIFICATION](state, action) {
        return {
            ...state,
            requestNotifications: action.notification
        }
    },
    [types.DISMISS_REQUEST_NOTIFICATION](state, action) {
        console.log('Existing STATE: ');
        console.log(state);
        return {
            ...state,
            requestNotifications: action.notification
        }
    }
});

export const membershipPlans = CreateReducer({}, {
    [types.GET_MEMBERSHIP_PLANS](state, action) {
        console.log(action.memberPlans);
        return JSON.parse(action.memberPlans);
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
