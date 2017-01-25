/**
 * @providesModule Main
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Button,
    Animated,
    Easing,
    Alert,
    TextInput,
    Linking,
    Image,
    View,
    Dimensions,
    InteractionManager
} from 'react-native';
import Store from 'Store';
import Router from 'Router';
import * as appActions from 'AppActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Exponent, Font} from 'exponent';
import {ActionCreators} from 'ActionsIndex';
import {createRouter, NavigationProvider, StackNavigation, withNavigation} from '@exponent/ex-navigation';
import {SimpleLineIcons} from '@exponent/vector-icons';
import colors from 'Colors';
import Card from 'Card';
const {width, height} = Dimensions.get('window');

class Main extends Component {

    constructor(props) {
        super(props);

        this.yesText = "Ok then!";
        this.noText = "Nope!"
        this.opacityFinal = new Animated.Value(0);
        this.panProfile = new Animated.ValueXY();
        this.opacityProfile = new Animated.Value(1);
        this.panAlert = new Animated.ValueXY({x: 0, y: -120});
        this.opacityAlert = new Animated.Value(0);
        this.scaleAlert = new Animated.Value(0);
        this.scaleOverlay = new Animated.Value(0);
        this.opacityOverlay = new Animated.Value(0);
        this.showInstructions = this.props.isFirstLoad;
        this.overlayIndex = -1;
        this.state = {
            alertText: ""
        };

        if (this.props.isFirstLoad) {
            this.showOverlay();
        }

    }

    static route = {
        navigationBar: {
            visible: true,
            title: 'We the People',
            titleStyle: {
                color: colors.white,
                ...Font.style('lato-regular'),
                letterSpacing: 1
            },
            backgroundColor: colors.blue,
            renderRight: (route, props) => {
                return (
                    <View>
                        <TouchableOpacity
                            onPress={() => Store.dispatch(appActions.logout())}
                            width="75"
                            height="50">
                            <SimpleLineIcons
                                name="logout"
                                style={{
                                color: colors.white,
                                marginVertical: 10,
                                marginHorizontal: 20,
                                fontSize: 24
                            }}/>
                        </TouchableOpacity>
                    </View>
                );
            }
        }
    }

    componentWillMount() {
        console.disableYellowBox = true;

    }

    showOverlay() {
        this.overlayIndex = 10;
        Animated.sequence([
            Animated.timing(this.scaleOverlay, {
                toValue: 1,
                duration: 1
            }),
            Animated.timing(this.opacityOverlay, {
                toValue: .9,
                duration: 250,
                easing: Easing.ease
            })
        ]).start();
    }

    hideOverlay() {
        Animated.sequence([
            Animated.timing(this.opacityOverlay, {
                toValue: 0,
                duration: 250
            }),
            Animated.timing(this.scaleOverlay, {
                toValue: 0,
                duration: 1,
                easing: Easing.ease
            })
        ]).start(() => {
            this.overlayIndex = -10;
            this
                .props
                .actions
                .setFirstLoad(false);
        });
    }
    _getOverlayStyle() {
        return {
            position: 'absolute',
            top: 0,
            left: 0,
            height: height - 50,
            width: width,
            zIndex: this.overlayIndex,
            opacity: this.opacityOverlay,
            padding: 40,
            backgroundColor: colors.blue,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [
                {
                    scale: this.scaleOverlay
                }
            ]

        }
    }
    renderCards() {
        return this
            .props
            .cards
            .map((data, index, cards) => {
                return (<Card
                    card={data}
                    key={index}
                    quotes={this.props.quotes}
                    style={{
                    position: 'absolute',
                    top: 0,
                    left: ((width - (width * .9)) / 2)
                }}
                    onCardSwiped={(direction) => this.onCardSwiped(direction)}
                    onSwipedCardEnded={(direction) => this.onCardSwipeEnded(direction)}/>)
            })

    }

    displayAlert(direction) {

        Animated.parallel([
            Animated.timing(this.opacityAlert, {
                toValue: 1,
                duration: 250
            }),
            Animated.timing(this.scaleAlert, {
                toValue: 1,
                duration: 250
            }),
            Animated.timing(this.panAlert, {
                toValue: {
                    x: 0,
                    y: -120
                },
                duration: 1000
            })
        ]).start(() => {
            Animated
                .timing(this.opacityAlert, {
                toValue: 0,
                delay: 750,
                duration: 500
            })
                .start(() => {
                    this
                        .scaleAlert
                        .setValue(0);
                })
        });
    }

    onCardSwipeEnded(direction) {
        (direction == 'right')
            ? this.setState({alertText: this.yesText})
            : this.setState({alertText: this.noText});
        this.displayAlert(this.props.swipedDirection);
        InteractionManager.runAfterInteractions(() => {
            this
                .props
                .actions
                .swipedCardEnded(direction);
            this.updateProfile(this.props.swipedDirection);
        });
    }

    onCardSwiped(direction) {
        InteractionManager.runAfterInteractions(() => {
            this
                .props
                .actions
                .swipedCard(direction);
        });
    }

    updateProfile(direction) {
        Animated
            .timing(this.opacityProfile, {
            toValue: 0,
            duration: 150
        })
            .start();

        Animated.timing(this.panProfile, {
            toValue: {
                x: 0,
                y: 500
            },
            duration: 500
        }).start(() => {
            //do this only if there's another card left
            if (this.props.cards.length > 0) {
                Animated.timing(this.panProfile, {
                    toValue: {
                        x: 0,
                        y: 0
                    },
                    delay: 500,
                    easing: Easing.out(Easing.exp),
                    duration: 750
                }).start(() => {
                    Animated
                        .timing(this.opacityProfile, {
                        toValue: 1,
                        duration: 200
                    })
                        .start()

                });

            } else {
                Animated
                    .timing(this.opacityFinal, {
                    toValue: 1,
                    duration: 750
                })
                    .start()

            }
        });
    }

    renderProfileStyle() {
        var [translateX,
            translateY] = [this.panProfile.x, this.panProfile.y];
        return {
            opacity: this.opacityProfile,
            transform: [{
                    translateX
                }, {
                    translateY
                }]
        }
    }

    renderAlertStyle() {
        var [translateX,
            translateY] = [this.panAlert.x, this.panAlert.y];
        return {
            opacity: this.opacityAlert,
            transform: [
                {
                    scale: this.scaleAlert
                }, {
                    translateX
                }, {
                    translateY
                }
            ]
        }
    }

    renderAlertTextStyle() {
        return {
            color: (this.state.alertText == this.yesText)
                ? colors.swipeRight
                : colors.swipeLeft
        }
    }

    renderFinalCardStyle() {
        return {opacity: this.opacityFinal}
    }

    render() {

        const {state, actions} = this.props;
        let currentCard = (this.props.cards.length > 0)
            ? this.props.cards[this.props.cards.length - 1]
            : {
                comment: '',
                role: ''
            };
        return (
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <Animated.View
                        style={[
                        styles.finalCard, this.renderFinalCardStyle()
                    ]}>
                        <Text style={styles.profileRole}>Thank you for playing.</Text>
                        <Text
                            style={[
                            styles.profileHeaders, {
                                textAlign: 'center'
                            }
                        ]}>If
                            you found any of the quotes attributed to our 45th President offensive or
                            disturbing in any way, we encourage you to take action by joining the Safetypin
                            Foundation when we launch.</Text>
                        <Text
                            style={[
                            styles.profileHeaders, {
                                textAlign: 'center'
                            }
                        ]}>Sign up for info here:</Text>
                        <TouchableOpacity
                            onPress={() => Linking.openURL("http://signup.staysafetypin.us")}>
                            <Text
                                style={[
                                styles.profileHeaders, {
                                    textAlign: 'center',
                                    ...Font.style('lato-black'),
                                    fontSize: 16,
                                    marginVertical: 15,
                                    color: colors.red
                                }
                            ]}>http://signup.staysafetypin.us</Text>
                        </TouchableOpacity>

                    </Animated.View>
                    {this.renderCards()}
                    <Animated.View
                        style={[
                        styles.swipeAlert, this.renderAlertStyle()
                    ]}>
                        <Text
                            style={[
                            styles.swipeAlertText, this.renderAlertTextStyle()
                        ]}>{this.state.alertText}</Text>
                    </Animated.View>
                </View>
                <Animated.View
                    style={[
                    styles.profile, this.renderProfileStyle()
                ]}>
                    <View style={styles.profileItems}>
                        <Text style={styles.profileRole}> ~ {currentCard.role} ~</Text>
                        <Text style={styles.profileHeaders}>Notes:</Text>
                        <Text style={styles.profileComment}>{currentCard.comment}</Text>
                    </View>
                </Animated.View>
                <Animated.View
                    name="overlay"
                    style={this._getOverlayStyle()}
                    pointerEvents={((!this.props.isFirstLoad)
                    ? 'none'
                    : 'auto')}>
                    <TouchableOpacity onPress={() => this.hideOverlay()}>
                        <Text style={styles.overlayInstructionsHeading}>Play Senator!</Text>
                        <Text style={styles.overlayInstructions}>Swipe right to vote for the nominee.</Text>
                        <Text style={styles.overlayInstructions}>Swipe left to withhold your vote for the nominee.</Text>
                        <Text style={styles.overlayTinyInstructions}>*currently no data is being persisted. Coming soon!</Text>
                        <Text
                            style={[
                            styles.overlayInstructions, {
                                fontSize: 20
                            }
                        ]}>(tap anywhere to dismiss)</Text>
                    </TouchableOpacity>
                </Animated.View>

            </View>
        );
    }
}
/*************** Needed for redux mappings on this page  ********************/
//currently only mapping to the user prop which we use for display on this page
function mapStateToProps(state, ownProps) {
    return {isFirstLoad: state.wethepeople.isFirstLoad, quotes: state.wethepeople.presidentialQuotes, cards: state.wethepeople.cards, swipedDirection: state.wethepeople.swipedDirection, swiping: state.wethepeople.swiping};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ActionCreators, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
/*************** End Needed for redux mappings on this page  ********************/

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: width,
        flex: 1
    },
    upperContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        flex: 2
    },
    profile: {
        flexDirection: 'column',
        flex: .75,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: .5,
        borderColor: colors.black,
        margin: 15,
        backgroundColor: '#99BADB',
        marginVertical: 25,
        borderRadius: 5,
        shadowColor: colors.black,
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: .8,
        shadowRadius: 5
    },
    profileItems: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    profileHeaders: {
        ...Font.style('lato-light'),
        color: colors.blue,
        marginBottom: 10,
        letterSpacing: 1,
        fontSize: 14
    },
    profileComment: {
        ...Font.style('lato-regular'),
        color: colors.blue,
        marginHorizontal: 15,
        marginBottom: 15,
        fontSize: 18
    },
    profileRole: {
        ...Font.style('lato-black'),
        marginBottom: 15,
        color: colors.red,
        fontSize: 18
    },
    swipeAlert: {
        alignSelf: 'center',
        zIndex: 10,
        backgroundColor: 'transparent'
    },
    swipeAlertText: {
        ...Font.style('lato-black'),
        fontSize: 48
    },
    finalCard: {
        marginHorizontal: 30,
        alignItems: 'center'
    },
    overlayInstructionsHeading: {
        ...Font.style('lato-blackitalic'),
        color: colors.white,
        fontSize: 30
    },
    overlayInstructions: {
        ...Font.style('lato-italic'),
        color: colors.white,
        marginVertical: 10,
        fontSize: 24
    },
    overlayTinyInstructions: {
        ...Font.style('lato-thinitalic'),
        color: colors.white,
        fontSize: 16
    }
});
