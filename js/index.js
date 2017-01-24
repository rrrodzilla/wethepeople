/**
 * @providesModule App
 * @flow
 */
import React, {Component, AsyncStorage} from 'react';
import {
  Platform,
  View,
  Text,
  Dimensions,
  Animated,
  PanResponder,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import Exponent from 'exponent';
import {bindActionCreators} from 'redux';
import {ActionCreators} from 'ActionsIndex';
import {Provider as ReduxProvider, connect} from 'react-redux';
import Store from 'Store';
import Router from 'Router';
import {NavigationContext, NavigationProvider, StackNavigation, withNavigation} from '@exponent/ex-navigation';
import colors from 'Colors';
import Notifications from 'exponent';
import cacheAssetsAsync from 'CacheAssetsAsync';
import {MaterialIcons, Ionicons, FontAwesome, Entypo} from '@exponent/vector-icons';
import {SocialIcon} from 'react-native-elements'
const navigationContext = new NavigationContext({router: Router, store: Store})
const {width, height} = Dimensions.get('window');

@withNavigation
class App extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    appIsReady: false,
    dataReady: false
  }

  async componentDidMount() {
    await this._loadAssetsAsync();
    await this._loadCacheAsync();
    // this._loadStore();
  }

  async _loadStore()
  {
    try {

      await load(Store)
    } catch (e) {
      console.warn('Unable to load store');
      console.log(e.message);
    } finally {
      this.setState({appIsReady: true});
    }
  }

  _loadCacheAsync = async() => {
    // nothing to get here so don't need this. wanted to show how you can preload
    // data
    this.setState({dataReady: true});
  }

  async _loadAssetsAsync() {
    //going to get all the images and pre-load them from my json data
    var images = [];
    this
      .props
      .cards
      .map((data, index, cards) => {
        images.push(data.headshot);
      })
      images.push("https://function962a6c1e8a7e.blob.core.windows.net/wethepeople/trumpWatermark.png");
      images.push("https://function962a6c1e8a7e.blob.core.windows.net/wethepeople/logo.png");

      // console.log(images);

    try {
      await cacheAssetsAsync({
        images: images,
        fonts: [
          ...MaterialIcons.font, {
            'lato-black': require('../assets/fonts/Lato-Black.ttf')
          },{
            'lato-blackitalic': require('../assets/fonts/Lato-BlackItalic.ttf')
          },{
            'lato-thinitalic': require('../assets/fonts/Lato-ThinItalic.ttf')
          }, {
            'lato-light': require('../assets/fonts/Lato-Light.ttf')
          }, {
            'lato-italic': require('../assets/fonts/Lato-Italic.ttf')
          }, {
            'lato-regular': require('../assets/fonts/Lato-Regular.ttf')
          }, {
            'lato-medium': require('../assets/fonts/Lato-Medium.ttf')
          }, {
            'lato-semibold': require('../assets/fonts/Lato-Semibold.ttf')
          }
        ]
      });
    } catch (e) {
      console.warn('There was an error caching assets (see: main.js), perhaps due to a network timeo' +
          'ut, so we skipped caching. Reload the app to try again.');
      console.log(e.message);
    } finally {
      this.setState({appIsReady: true});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if (!this.state.assetsReady || !this.state.dataReady) {   return; }
    if (!this.state.appIsReady || !this.state.dataReady) {
      return;
    }

    const rootNavigator = this
      .props
      .navigation
      .getNavigator('root');
    const previouslySignedIn = prevProps.loggedIn && prevState.dataReady === this.state.dataReady;
    const currentlySignedIn = this.props.loggedIn;

    if (this.props.loggedIn == true) {
      if (!previouslySignedIn && currentlySignedIn) {
        rootNavigator.replace('main');
      } else if (previouslySignedIn && !currentlySignedIn) {
        rootNavigator.replace('home');
      }
    } else {
      rootNavigator.replace('home');
    }
  }

  render() {
    const {state, actions} = this.props;

    if (!this.state.appIsReady) {
      return <Exponent.Components.AppLoading/>;
    }

    return (
      <View style={{
        flexDirection: 'column',
        flex: 1
      }}>
        <StackNavigation
          id="root"
          navigatorUID="root"
          initialRoute={Platform.OS === 'android'
          ? 'home'
          : 'home'}></StackNavigation>
      </View>
    );
  }

}

/*************** Needed for redux mappings on this page  ********************/
//currently only mapping to the user prop which we use for display on this page
function mapStateToProps(state, ownProps) {
  return {isFirstLoad: state.wethepeople.isFirstLoad, user: state.wethepeople.user, loading: state.wethepeople.loading, loggedIn: state.wethepeople.loggedIn, cards: state.wethepeople.cards};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
/*************** End Needed for redux mappings on this page  ********************/

const styles = StyleSheet.create({
  upperContainer: {
    backgroundColor: colors.defaultBlue,
    alignItems: 'center',
    flex: 1.5,
    justifyContent: 'center'
  },
  container: {
    position: 'absolute',
    backgroundColor: '#FFF'
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 0
  },
  pause: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white'
  },

  title: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600'
  },

  author: {
    fontWeight: '600',
    color: '#aeafb3',
    fontSize: 12
  },

  music: {
    fontWeight: '300',
    color: '#40bf7c',
    fontSize: 12
  }

})
