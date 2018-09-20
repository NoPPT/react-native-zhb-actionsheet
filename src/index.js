'use strict';

import React, {Component} from 'react';
import {
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    View,
    Text,
    StyleSheet,
    Animated,
    Modal,
    PixelRatio,
    ScrollView,
    ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';

const kDefaultItemHeight = 44;
const kDefaultAnimateDuration = 250;
const kDefault1Px = 1.0 / PixelRatio.get();
const kDefaultNotArrayTypeErrorDesc = 'Prop `titles` must be an array.';
const kDefaultArrayIsEmptyErrorDesc = 'Prop `titles` must be an array and it must not be empty.';

export default class ActionSheet extends Component {

    static propTypes = {
        /**
         * array of title like:
         * [
         *      {
         *          title: "titleName", //PropTypes.string.isRequired
         *          actionStyle: "default", //PropTypes.string.oneOf(["default", "cancel", "destructive"])
         *          action: () => {}, //PropTypes.func,
         *          textStyle: {} //Text.propTypes.style,
         *          textViewStyle: {} //View.propTypes.style,
         *      },
         *      ...
         * ]
         */
        titles: PropTypes.array.isRequired,
        onClose: PropTypes.func,
        separateHeight: PropTypes.number,
        separateColor: PropTypes.string,
        backgroundColor: PropTypes.string,
        containerStyle: ViewPropTypes.style,
        defaultTextStyle: Text.propTypes.style,
        cancelTextStyle: Text.propTypes.style,
        destructiveTextStyle: Text.propTypes.style,
        textViewStyle: ViewPropTypes.style
    };

    static defaultProps = {
        titles: [],
        separateHeight: 4,
        separateColor: '#dddddd',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        containerStyle: {}
    };

    constructor(props) {
        super(props);
        var defaultTitles = [], cancelTitles = [];
        for (var i = 0, length = props.titles.length; i < length; i ++) {
            let title = props.titles[i];
            if (title.actionStyle == 'cancel') {
                cancelTitles.push(title);
            } else {
                defaultTitles.push(title);
            }
        }
        this.state = {
            titles: props.titles,
            defaultTitles: defaultTitles,
            cancelTitles: cancelTitles,
            visible: false,
            scrollEnable: false,
            fadeAnim: new Animated.Value(0),
            containerHeight: 0,
            separateHeight: props.separateHeight,
            separateColor: props.separateColor,
            backgroundColor: props.backgroundColor,
            containerStyle: props.containerStyle,
            defaultTextStyle: props.defaultTextStyle,
            cancelTextStyle: props.cancelTextStyle,
            destructiveTextStyle: props.destructiveTextStyle,
            textViewStyle: props.textViewStyle
        };

        this.defaultActionStyles = {
            default: styles.defaultTextStyle,
            cancel: styles.cancelTextStyle,
            destructive: styles.destructiveTextStyle
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.checkArrayStructure(nextProps.titles)) {
            var defaultTitles = [], cancelTitles = [];
            for (var i = 0, length = nextProps.titles.length; i < length; i ++) {
                let title = nextProps.titles[i];
                if (title.actionStyle == 'cancel') {
                    cancelTitles.push(title);
                } else {
                    defaultTitles.push(title);
                }
            }
            this._setContainerLayout(defaultTitles, cancelTitles);
            this.setState({
                titles: nextProps.titles,
                defaultTitles: defaultTitles,
                cancelTitles: cancelTitles,
                separateHeight: nextProps.separateHeight,
                separateColor: nextProps.separateColor,
                backgroundColor: nextProps.backgroundColor,
                containerStyle: nextProps.containerStyle,
                defaultTextStyle: nextProps.defaultTextStyle,
                cancelTextStyle: nextProps.cancelTextStyle,
                destructiveTextStyle: nextProps.destructiveTextStyle,
                textViewStyle: nextProps.textViewStyle
            });

            if (nextProps.defaultTextStyle) {
                this.defaultActionStyles["default"] = nextProps.defaultTextStyle;
            }

            if (nextProps.cancelTextStyle) {
                this.defaultActionStyles["cancel"] = nextProps.cancelTextStyle;
            }

            if (nextProps.destructiveTextStyle) {
                this.defaultActionStyles["destructive"] = nextProps.destructiveTextStyle;
            }
        }
    }

    checkArrayStructure(array) {
        if (Object.prototype.toString.call(array) === '[object Array]') {
            if (array.length == 0) {
                throw Error(kDefaultArrayIsEmptyErrorDesc);
            } else {
                return true;
            }
        } else {
            throw Error(kDefaultNotArrayTypeErrorDesc);
        }
    }

    show() {
        this.setState({
            visible: true
        });

        Animated.timing(
            this.state.fadeAnim,
            {toValue: 1, duration: kDefaultAnimateDuration},
        ).start((event) => {

        });
    }

    hide(title) {
        
        Animated.timing(
            this.state.fadeAnim,
            {toValue: 0, duration: kDefaultAnimateDuration},
        ).start((event) => {
            this.setState({
                visible: false
            });
        });

        setTimeout(() => {
            this.props.onClose && this.props.onClose(title);
            title && title.action && title.action();
        }, 500);
    }

    _setContainerLayout(defaultTitles = this.state.defaultTitles, cancelTitles = this.state.cancelTitles, maxHeight = Dimensions.get('window').height) {
        let cancelHeight = 0;
        if (cancelTitles.length > 0) {
            cancelHeight = (cancelTitles.length - 1) * kDefault1Px + this.state.separateHeight;
        }
        let height = (defaultTitles.length + cancelTitles.length) * kDefaultItemHeight + (defaultTitles.length - 1) * kDefault1Px + cancelHeight;
        let maxContainerHeight = maxHeight - 2 * kDefaultItemHeight;

        this.setState({
            scrollEnable: height > maxContainerHeight,
            containerHeight: height > maxContainerHeight ? maxContainerHeight : height
        });
    }

    _renderTitlesView(titles) {
        var content = [];

        for (var i = 0, length = titles.length; i < length; i ++) {
            let title = titles[i];
            let titleStyle = this.defaultActionStyles[title.actionStyle];
            content.push(
                <TouchableOpacity
                    key={'title'+i}
                    onPress={() => {this.hide(title);}}
                    style={[styles.item, this.state.textViewStyle, title.textViewStyle]}
                    accessibilityLabel={title.accessibilityLabel}
                >
                    <Text accessible={false} style={[styles.defaultTextStyle, this.state.defaultTextStyle, titleStyle, title.textStyle]}>{title.title}</Text>
                </TouchableOpacity>
            );
            if (i != length - 1) {
                content.push(
                    <View key={'line'+i} style={[styles.line, {backgroundColor: this.state.separateColor}]}/>
                );
            }
        }

        return content;
    }

    _renderDefaultTitles() {
        let content = this._renderTitlesView(this.state.defaultTitles);

        return (
            <ScrollView
                scrollEnabled={this.state.scrollEnable}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {content}
            </ScrollView>
        );
    }

    _renderCancelTitles() {
        if (this.state.cancelTitles.length == 0) {
            return null;
        }

        var content = [];

        content.push((<View key="separateLine" style={[styles.line, {height: this.state.separateHeight, backgroundColor: this.state.separateColor}]}/>));
        content.push(this._renderTitlesView(this.state.cancelTitles));

        return content;
    }

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => {}}
                animationType="none"
                onOrientationChange={(obj) => {}}
                supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}>
                <Animated.View
                    style={[styles.flex1, {opacity: this.state.fadeAnim}, {backgroundColor: this.state.backgroundColor}]}
                    onLayout={(event) => {
                        this._setContainerLayout(this.state.defaultTitles, this.state.cancelTitles, event.nativeEvent.layout.height);
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {this.hide();}}
                        activeOpacity={1}
                        style={styles.flex1}>
                    </TouchableOpacity>

                    <Animated.View
                        style={[
                            styles.container,
                            {borderColor: this.state.separateColor},
                            this.state.containerStyle,
                            {height: this.state.containerHeight},
                            {transform: [{translateY: this.state.fadeAnim.interpolate({inputRange: [0, 1],outputRange: [this.state.containerHeight, 0]})}]}
                            ]}
                    >
                        {this._renderDefaultTitles()}
                        {this._renderCancelTitles()}
                    </Animated.View>
                </Animated.View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        height: kDefaultItemHeight,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    flex1: {
        flex: 1
    },
    container: {
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        margin: 0,
        borderRadius: 0,
        borderColor: '#00000000',
        borderWidth: kDefault1Px
    },
    defaultTextStyle: {
        color: '#1C86EE',
        fontSize: 16
    },
    cancelTextStyle: {
        color: '#666666',
        fontSize: 16
    },
    destructiveTextStyle: {
        color: '#ff5e00',
        fontSize: 16
    },
    line: {
        height: kDefault1Px,
        backgroundColor: '#dddddd',
        margin: 0
    }
});
