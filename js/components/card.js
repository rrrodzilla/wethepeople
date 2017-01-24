/**
 * @providesModule Card
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StatusBar,
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    PanResponder,
    Alert,
    ActivityIndicator,
    Image,
    InteractionManager,
    View,
    Dimensions
} from 'react-native';

import Router from 'Router';
import * as appActions from 'AppActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from 'ActionsIndex';
import {Exponent, Font} from 'exponent';
import colors from 'Colors';
import {SimpleLineIcons} from '@exponent/vector-icons';
const {width, height} = Dimensions.get('window');
const dragThreshold = 150;

class Card extends Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;

        this.rotation = new Animated.Value(this.getRandomInt(0, 3));
        this.opacity = new Animated.Value(0);
        this.pan = new Animated.ValueXY();
        this.panXVal = 0;
        this.state = {
            dragging: false
        }

    };
    componentWillUpdate() {

        if (this.props.card.index == 1) {
            Animated
                .timing(this.opacity, {
                toValue: 1,
                duration: 950
            })
                .start();
            Animated
                .timing(this.rotation, {
                toValue: 1,
                duration: 1000
            })
                .start();
        }
    }

    componentWillMount() {

        // we only want to do this for the top card, hence the test:
        // (this.props.card.index == 1)
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => (this.props.card.index == 1),
            onStartShouldSetPanResponderCapture: (evt, gestureState) => (this.props.card.index == 1),
            onMoveShouldSetPanResponder: (evt, gestureState) => (this.props.card.index == 1),
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => (this.props.card.index == 1),

            onPanResponderGrant: (evt, gestureState) => {
                // The guesture has started. Show visual feedback so the user knows what is
                // happening! gestureState.d{x,y} will be set to zero now
                if ((this.props.card.index == 1)) {
                    this
                        .pan
                        .setOffset({x: this.pan.x._value, y: this.pan.y._value});
                    this
                        .pan
                        .setValue({x: 0, y: 0});
                    this.setState({dragging: true});
                }
            },
            onPanResponderMove: Animated.event([
                null, {
                    dx: this.pan.x
                }
            ]),
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the responder. This
                // typically means a gesture has succeeded
                if ((this.props.card.index == 1)) {
                    this.panXVal = gestureState.dx;
                    this
                        .pan
                        .flattenOffset();
                    if (gestureState.dx <= -dragThreshold) {
                        this.swipeLeft();
                    } else if (gestureState.dx >= dragThreshold) {
                        this.swipeRight();
                    } else {
                        Animated.spring(this.pan, {
                            toValue: {
                                x: 0,
                                y: 0
                            },
                            friction: 3
                        }).start(() => {
                            // this.setState({dragging: false});
                        });
                    }
                }
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming
                // the JS responder. Returns true by default. Is currently only supported on
                // android.
                return true;
            }
        });
        // InteractionManager.runAfterInteractions(() => { });
    }

    swipeLeft() {
        this
            .props
            .onCardSwiped("left");
        Animated.timing(this.pan, {
            toValue: {
                x: -1000,
                y: -750
            },
            duration: 500
        }).start(() => {
            this
                .props
                .onSwipedCardEnded("left");
        });
    }

    swipeRight() {
        this
            .props
            .onCardSwiped("right");
        Animated.timing(this.pan, {
            toValue: {
                x: 1000,
                y: -750
            },
            duration: 500
        }).start(() => {
            this
                .props
                .onSwipedCardEnded("right");
        });
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    renderOpacity() {
        return {opacity: this.opacity}
    }

    getDragPosition() {
        const spin = this
            .rotation
            .interpolate({
                inputRange: [
                    0, 1, 2
                ],
                outputRange: ['-2deg', '0deg', '2deg']
            });

        // Calculate the x and y transform from the pan value
        let [translateX,
            translateY] = [this.pan.x, this.pan.y];

        // Calculate the transform property and set it as a value for our style which we
        // add below to the Animated.View component
        return {
            transform: [
                {
                    translateX
                },
                {
                    translateY
                }, {
                    rotate: (this.state.dragging)
                        ? this
                            .pan
                            .x
                            .interpolate({
                                inputRange: [
                                    -200, 0, 200
                                ],
                                outputRange: ["30deg", "0deg", "-30deg"]
                            })
                        : spin
                }
            ]
        };
    }

    renderNoteStyle() {
        return {backgroundColor: colors.red}
    }

    renderNoteTextStyle() {
        return {
            color: colors.white,
            ...Font.style('lato-semibold'),
            opacity: 1
        }
    }

    render() {
        return (
            <Animated.View
                style={[
                this.props.style, styles.container, this.getDragPosition()
            ]}
                {...this._panResponder.panHandlers}>
                <Animated.Image
                    style={[
                    styles.headshot, this.renderOpacity()
                ]}
                    source={{
                    uri: this.props.card.headshot
                }}/>
                <Animated.View
                    style={[
                    styles.headline, this.renderOpacity()
                ]}>
                    <Text
                        style={[
                        styles.headlineText, {
                            textAlign: 'left'
                        }
                    ]}>{this.props.card.name.replace(' ', '\u00a0')},{'\u00a0'}{this.props.card.age}</Text>
                    <Text
                        style={[
                        styles.headlineText, {
                            textAlign: 'right',
                            marginRight: 15,
                        }
                    ]}>{this.props.card.role}</Text>
                </Animated.View>
                <View style={styles.lowerContainer}>
                    <View style={styles.notes}>
                        <View style={styles.noteRow}>
                            <View
                                style={[
                                styles.note, {
                                    borderRightWidth: .5
                                },
                                (this.props.card.nonpolitician)
                                    ? this.renderNoteStyle()
                                    : null
                            ]}>
                                <Text
                                    style={[
                                    styles.noteText,
                                    (this.props.card.nonpolitician)
                                        ? this.renderNoteTextStyle()
                                        : null
                                ]}>Non-politician</Text>
                            </View>
                            <View
                                style={[
                                styles.note,
                                (this.props.card.military)
                                    ? this.renderNoteStyle()
                                    : null
                            ]}>
                                <Text
                                    style={[
                                    styles.noteText,
                                    (this.props.card.military)
                                        ? this.renderNoteTextStyle()
                                        : null
                                ]}>Military</Text>
                            </View>
                        </View>
                        <View style={[styles.noteRow]}>
                            <View
                                style={[
                                styles.note, {
                                    borderBottomLeftRadius: 5,
                                    borderRightWidth: .5
                                },
                                (this.props.card.bizandfinance)
                                    ? this.renderNoteStyle()
                                    : null
                            ]}>
                                <Text
                                    style={[
                                    styles.noteText,
                                    (this.props.card.bizandfinance)
                                        ? this.renderNoteTextStyle()
                                        : null
                                ]}>Business & Finance</Text>
                            </View>
                            <View
                                style={[
                                styles.note, {
                                    borderBottomRightRadius: 5
                                },
                                (this.props.card.climatechangeskeptic)
                                    ? this.renderNoteStyle()
                                    : null
                            ]}>
                                <Text
                                    style={[
                                    styles.noteText,
                                    (this.props.card.climatechangeskeptic)
                                        ? this.renderNoteTextStyle()
                                        : null
                                ]}>Climate Change Skeptic</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    }
}

/*************** Needed for redux mappings on this page  ********************/
//currently only mapping to the user prop which we use for display on this page
function mapStateToProps(state, ownProps) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ActionCreators, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);
/*************** End Needed for redux mappings on this page  ********************/

const styles = StyleSheet.create({
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
        justifyContent: 'center',
        borderColor: colors.lightred,
        backgroundColor: 'transparent',
        borderTopWidth: .5
    },
    noteText: {
        ...Font.style('lato-regular'),
        fontSize: 12,
        color: 'rgba(224,22,43,.55)',
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        height: 300,
        backgroundColor:colors.blue,
        width: (width * .9),
        shadowColor: colors.black,
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: .1,
        shadowRadius: 5,
        borderRadius: 3,
        borderColor:colors.black,
        borderWidth:.5,
        marginTop: 20
    },
    lowerContainer: {
        flexDirection: 'column',
        alignSelf: 'flex-end',
        backgroundColor:colors.lightred,
        width: (width * .9),
        flex: 1
    },
    likesContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        width: (width * .9),
        flex: 1
    },
    headshot: {
        resizeMode: 'contain',
        alignSelf: 'flex-start',
        height: 200,
        width: (width * .9),
        margin: 0,
        marginBottom: 20
    },
    headline: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 25,
        width: (width * .9),
        backgroundColor: 'rgba(224,22,43,.55)',
        marginTop: -47
    },
    headlineText: {
        marginLeft: 15,
        ...Font.style('lato-semibold'),
        fontSize:13,
        opacity: .95,
        flex: 1,
        color: colors.white
    },
    likes: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
        backgroundColor:colors.red,
        shadowColor: colors.black,
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: .3,
        shadowRadius: 3,
        borderRadius: 5,
        margin: 5
    },
    icon: {
        fontSize: 22,
        color: colors.white,
        marginBottom: -15
    }
});
