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

        this.panProfile = new Animated.ValueXY();
        this.panAlert = new Animated.ValueXY({x:0,y:-40});
        this.opacityAlert = new Animated.Value(0);
        this.scaleAlert = new Animated.Value(0);
        this.state = {
            alertText: ""
        }
    }

    static route = {
        navigationBar: {
            visible: true,
            title: 'We the People',
            titleStyle: {
                color: colors.white,
                ...Font.style('lato-black'),
                letterSpacing: 1
            },
            backgroundColor: colors.tinderRed,
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

    renderCards() {
        return this
            .props
            .cards
            .map((data, index, cards) => {
                return (<Card
                    card={data}
                    key={index}
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
                    y: -40
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
            ? this.setState({alertText: 'Ok!'})
            : this.setState({alertText: 'Hell no!'});
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

        Animated.timing(this.panProfile, {
            toValue: {
                x: 0,
                y: 500
            },
            duration: 250
        }).start(() => {
            Animated.timing(this.panProfile, {
                toValue: {
                    x: 0,
                    y: 0
                },
                easing: Easing.out(Easing.exp),
                duration: 750
            }).start();

        });
    }

    renderProfileStyle() {
        var [translateX,
            translateY] = [this.panProfile.x, this.panProfile.y];
        return {
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
            color: (this.state.alertText == 'Ok!')
                ? colors.swipeRight
                : colors.swipeLeft
        }
    }

    render() {

        const {state, actions} = this.props;
        let currentCard = this.props.cards[this.props.cards.length - 1]
        return (
            <View style={styles.container}>
                <View style={styles.upperContainer}>
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
                        <Text style={styles.profileHeaders}>Summary:</Text>
                        <Text style={styles.profileComment}>{currentCard.comment}</Text>
                    </View>
                    <View style={styles.notes}>
                        <View style={styles.noteRow}>
                            <View
                                style={[
                                styles.note, {
                                    backgroundColor: colors.nonpolitician
                                }
                            ]}>
                                <Text style={styles.noteText}>Non-politician</Text>
                            </View>
                            <View
                                style={[
                                styles.note, {
                                    backgroundColor: colors.military
                                }
                            ]}>
                                <Text style={styles.noteText}>Military</Text>
                            </View>
                        </View>
                        <View style={[styles.noteRow]}>
                            <View
                                style={[
                                styles.note, {
                                    backgroundColor: colors.bizandfinance,
                                    borderBottomLeftRadius: 5
                                }
                            ]}>
                                <Text style={styles.noteText}>Business & Finance</Text>
                            </View>
                            <View
                                style={[
                                styles.note, {
                                    backgroundColor: colors.climatechange,
                                    borderBottomRightRadius: 5
                                }
                            ]}>
                                <Text style={styles.noteText}>Climate Change Skeptic</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </View>
        );
    }
}
/*************** Needed for redux mappings on this page  ********************/
//currently only mapping to the user prop which we use for display on this page
function mapStateToProps(state, ownProps) {
    return {cards: state.wethepeople.cards, swipedDirection: state.wethepeople.swipedDirection, swiping: state.wethepeople.swiping};
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
        height: 150,
        borderWidth: .5,
        borderColor: colors.tinderRed,
        margin: 15,
        borderRadius: 5

    },
    profileItems: {
        flexDirection: 'column',
        padding: 10,
        paddingTop: 5,
        alignSelf: 'stretch',
        flex: 1
    },
    profileHeaders: {
        ...Font.style('lato-semibold'),
        color: colors.tinderRed,
        letterSpacing: 1,
        fontSize: 16
    },
    profileComment: {
        ...Font.style('lato-light'),
        color: colors.darkred,
        fontSize: 14
    },
    notes: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        flex: 1
    },
    noteRow: {
        flexDirection: 'row',
        flex: 1
    },
    note: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noteText: {
        ...Font.style('lato-light'),
        fontSize: 12,
        color: colors.white
    },
    swipeAlert: {
        alignSelf: 'center',
        zIndex: 10,
        backgroundColor: 'transparent'
    },
    swipeAlertText: {
        ...Font.style('lato-black'),
        fontSize: 48
    }
});
