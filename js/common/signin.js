/**
 * @providesModule Home
 * @flow
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  View,
  Dimensions
} from 'react-native';

import Router from 'Router';
import * as appActions from 'AppActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from 'ActionsIndex';
import * as api from 'API';
import {Exponent, Font} from 'exponent';
import colors from 'Colors';
import {Ionicons} from '@exponent/vector-icons';
import {FontAwesome} from '@exponent/vector-icons';
import {SocialIcon} from 'react-native-elements'
import {Button} from 'react-native-elements'

const {width, height} = Dimensions.get('window');

class Home extends Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
  };

  static route = {
    navigationBar: {
      visible: false
    }
  }

  _renderOverlay() {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator
          animating={true}
          size="large"
          color={colors.backgroundLight}/>
        <Text style={styles.text}>Signing In</Text>
      </View>

    );
  }

  render() {
    const {state, actions} = this.props;
    if (this.props.loading) {
      return this._renderOverlay();
    } else {

      return (
        <View style={styles.container}>
          <StatusBar hidden={true}/>
          <View style={styles.upperContainer}>
            <Image style={styles.logo} source={require('../../img/logo.png')}/>
            <Text style={styles.welcome}>
              We the People
            </Text>
            <Text style={styles.upperInstructions}>
              A single swipe can change our country.
            </Text>
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.instructions}>
              Join in seconds and cast your vote.
            </Text>
            <Text style={styles.tinyInstructions}>
              We never post anything without your permission.
            </Text>
            <View style={styles.btnsContainer}>
              <View style={styles.btnContainer}>
                <FontAwesome.Button
                  style={styles.btn}
                  textAlign="center"
                  name="facebook"
                  backgroundColor="#3b5998"
                  onPress={() => this.props.actions.signInFB()}>
                  Sign in with Facebook
                </FontAwesome.Button>
              </View>
            </View>
          </View>
          <Text style={styles.tinyInstructions} paddingTop="30">
            By creating a membership you agree that this is for demo and entertainment
            purposes only.
          </Text>
        </View>
      );
    }
  }
}

/*************** Needed for redux mappings on this page  ********************/
//currently only mapping to the user prop which we use for display on this page
function mapStateToProps(state, ownProps) {
  return {isFirstLoad: state.wethepeople.isFirstLoad, user: state.wethepeople.user, loading: state.wethepeople.loading, loggedIn: state.wethepeople.loggedIn};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
/*************** End Needed for redux mappings on this page  ********************/

const styles = StyleSheet.create({
  fbButtonText: {
    color: "#FFFFFF"
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.defaultBlue
  },
  btn: {
    borderColor: '#CFCFCF',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    height: 50,
    width: 250
  },
  btnText: {
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: '500',
    flexDirection: 'column'
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: 'contain'
  },
  btnContainer: {
    flexDirection: 'row',
    height: 50,
    margin: 5
  },
  btnsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 20
  },
  container: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    flex: 1
  },
  upperContainer: {
    backgroundColor: colors.backgroundBlue,
    alignItems: 'center',
    flex: 1.5,
    justifyContent: 'center',
    borderColor: "#3b5998",
    borderBottomWidth: 4
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    backgroundColor: colors.tinderRed,
    flexDirection: 'column',
    flex: 1
  },
  welcome: {
    fontSize: 32,
    ...Font.style('lato-black'),
    textAlign: 'center',
    margin: 10,
    letterSpacing: 2,
    color: colors.tinderRed
  },
  upperInstructions: {
    textAlign: 'center',
    color: colors.tinderRed,
    ...Font.style('lato-light'),
    fontWeight: "300",
    marginBottom: 5,
    fontSize: 16
  },
  instructions: {
    textAlign: 'center',
    color: colors.white,
    ...Font.style('lato-medium'),
    marginBottom: 5,
    backgroundColor: 'transparent',
    fontSize: 16
  },
  tinyInstructions: {
    textAlign: 'center',
    ...Font.style('lato-medium'),
    fontSize: 11,
    paddingBottom: 15,
    backgroundColor: colors.tinderRed,
    color: colors.white
  },
  terms: {
    marginVertical: 5,
    alignItems: 'center',
    marginHorizontal: 15,
    height: 30
  },
  btnFb: {
    borderColor: '#CFCFCF',
    borderStyle: 'solid',
    borderWidth: .5,
    width: 300,
    paddingVertical: 10
  },
  btnGoogle: {
    borderColor: '#CFCFCF',
    borderStyle: 'solid',
    borderWidth: .5,
    width: 300,
    paddingVertical: 10,
    backgroundColor: '#dd4b39'
  }
});
