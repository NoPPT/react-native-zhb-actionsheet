'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import ActionSheet from './src';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.defaultTitles = [{title: '拍照', action: () => {console.log('111');}},
            {title: '从相册中选取', actionStyle: 'default', action: () => {console.log('111');}},
            {title: '删除', actionStyle: 'destructive', action: () => {console.log('111');}},
            {title: '取消', actionStyle: 'cancel', action: () => {console.log('111');}},
            ];
        this.customTitles = [{title: '标题1'}, {title: '标题2'}, {title: '标题3'}, {title: '标题4'}, {title: '标题5'},
            {title: '标题6'}, {title: '标题7'}, {title: '标题8'}];
        this.state = {
            titles: this.defaultTitles,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ActionSheet
                    ref="picker"
                    titles={this.state.titles}
                    separateLineHeight={3}
                    onClose={(obj) => {console.log('action sheet closed!' + JSON.stringify(obj));}}
                />

                <Text style={styles.welcome} onPress={() => {this.setState({titles: this.defaultTitles}, () => {this.refs.picker.show();})}}>
                    click me !!!
                </Text>
                <Text style={styles.welcome} onPress={() => {this.setState({titles: this.customTitles}, () => {this.refs.picker.show();})}}>
                    click me !!!
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
    }
});