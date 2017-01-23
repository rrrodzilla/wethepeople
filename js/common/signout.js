/**
 * @providesModule Signout
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Image,
    View
} from 'react-native';

import TouchableNativeFeedback from '@exponent/react-native-touchable-native-feedback-safe';
import {createRouter, NavigationProvider, StackNavigation} from '@exponent/ex-navigation'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
import colors from 'Colors';

/* BEGIN: needed for redux connectivity */
import Router from 'Router';
import * as appActions from 'AppActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from 'ActionsIndex';
/* END: needed for redux connectivity */

class Signout extends Component {

    constructor(props) {
        super(props);
    }

    static route = {
        navigationBar: {
            visible: false
        }
    };

    componentWillUpdate(nextProps, nextState) {
        //TODO: use the state to get the main navigator so the drawermenu doesn't show up after logout
        if (nextProps.loggedIn == false) {
            nextProps
                .navigator
                .replace(Router.getRoute('home'));
        }
    }

    _signout() {
        this
            .props
            .actions
            .logout(this.props.user);
    }

    render() {
        const {state, actions} = this.props;
        return (
            <View style={styles.signoutOverlay} onLayout={(event) => this._signout()}>
                <ActivityIndicator
                    animating={true}
                    size="large"
                    color={colors.backgroundLight}/>
                <Text style={styles.text}>Signing Out</Text>
                <Text style={styles.text}>{this.props.user.name}</Text>
            </View>
        );
    }
}
/*************** Needed for redux mappings on this page  ********************/
//currently only mapping to the user prop which we use for display on this page
function mapStateToProps(state, ownProps) {
    return {user: state.safetypin.user, loggedIn:state.safetypin.loggedIn};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ActionCreators, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signout);
/*************** End Needed for redux mappings on this page  ********************/

const styles = StyleSheet.create({
    signoutOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.defaultBlue
    },
    text: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        fontSize: 18,
        fontWeight: '600',
        color: colors.backgroundLight
    }
});
