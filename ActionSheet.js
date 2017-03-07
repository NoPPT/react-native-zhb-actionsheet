'use strict';

import React, {Component, PropTypes} from 'react';
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
    ScrollView
} from 'react-native';

const kDefaultItemHeight = 44;
const kDefaultAnimateDuration = 250;
const kDefault1Px = 1.0 / PixelRatio.get();
const kDefaultNotArrayTypeErrorDesc = 'Prop `titles` must be an array.';
const kDefaultArrayIsEmpyErrorDesc = 'Prop `titles` must be an array and it must not be empty.';

export default class ActionSheet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            titles: props.titles,
            defaultTitles: [],
            cancelTitles: [],
            separateLineHeight: props.separateLineHeight,
            visible: false,
            scrollEnable: false,
            fadeAnim: new Animated.Value(0),
            containerHeight: Dimensions.get('window').height,
        };

        this.defaultActionStyles = {
            default: styles.defaultText,
            cancel: styles.cancelText,
            destructive: styles.destructiveText
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(JSON.stringify(nextProps));
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
                separateLineHeight: nextProps.separateLineHeight
            });
        }
    }

    static propTypes = {
        /**
         * array of title like:
         * [
         *      {
         *          title: "titleName", //PropTypes.string.isRequired
         *          actionStyle: "default", //PropTypes.string.oneOf(["default", "cancel", "destructive"])
         *          action: () => {}, //PropTypes.func,
         *          customStyle: {} //View.props.style
         *      },
         *      ...
         * ]
         */
        titles: PropTypes.array.isRequired,
        onClose: PropTypes.func,
        onCancel: PropTypes.func,
        separateLineHeight: PropTypes.number,

    };

    static defaultProps = {
        titles: [],
        separateLineHeight: 4
    };

    checkArrayStructure(array) {
        if (Object.prototype.toString.call(array) === '[object Array]') {
            if (array.length == 0) {
                throw Error(kDefaultArrayIsEmpyErrorDesc);
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
            this.props.onClose != undefined ? this.props.onClose(title) : null;
            title && title.action ? title.action() : null;
        });
    }

    _setContainerLayout(defaultTitles = this.state.defaultTitles, cancelTitles = this.state.cancelTitles, maxHeight = Dimensions.get('window').height) {
        console.log('PixelRatio:'+PixelRatio.get());
        let cancelHeight = 0;
        if (cancelTitles.length > 0) {
            cancelHeight = (cancelTitles.length - 1) * kDefault1Px + this.state.separateLineHeight;
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
                    style={styles.item}
                >
                    <Text style={[styles.defaultText, titleStyle]}>{title.title}</Text>
                </TouchableOpacity>
            );
            if (i != length - 1) {
                content.push(
                    <View key={'line'+i} style={styles.line}/>
                );
            }
        }
        return content;
    }

    _renderDefaultTitles() {
        let content = this._renderTitlesView(this.state.defaultTitles);
        let titlesView = null;
        if (this.state.scrollEnable) {
            titlesView = (
                <ScrollView
                    scrollEnabled={this.scrollEnable}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {content}
                </ScrollView>
            );
        } else {
            titlesView = content;
        }

        return titlesView;
    }

    _renderCancelTitles(array) {
        var content = [];

        content.push((<View key="separateLine" style={[styles.line, {height: this.state.separateLineHeight}]}/>));
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
                onOrientationChange={(obj) => {
                    console.log('onOrientationChange:'+JSON.stringify(obj.nativeEvent));
                }}
                supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}>
            <Animated.View
                style={[{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)'}, {opacity: this.state.fadeAnim}]}
                onLayout={(event) => {
                    console.log(JSON.stringify(event.nativeEvent.layout));
                    let currentScreenHeight = event.nativeEvent.layout.height;
                    this._setContainerLayout(this.state.defaultTitles, this.state.cancelTitles, currentScreenHeight);
                }}
            >
                <TouchableOpacity onPress={() => {this.hide();}}
                                  activeOpacity={1}
                                  style={{flex: 1}}>
                </TouchableOpacity>

                <Animated.View
                    style={[
                    {backgroundColor: '#ffffff', height: this.state.containerHeight, margin: 0, borderRadius: 0, overflow: 'hidden'},
                    {
                        transform: [{
                            translateY: this.state.fadeAnim.interpolate({inputRange: [0, 1],outputRange: [this.state.containerHeight, 0]})
                            }]
                    }]}>
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
    defaultText: {
        color: '#1C86EE',
        fontSize: 16
    },
    cancelText: {
        color: '#666666',
        fontSize: 16
    },
    destructiveText: {
        color: '#ff5e00',
        fontSize: 16
    },
    line: {
        height: kDefault1Px,
        backgroundColor: '#dddddd',
        margin: 0
    }
});
