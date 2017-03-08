# ActionSheet for React Native
[![npm Version](https://img.shields.io/npm/v/react-native-zhb-actionsheet.svg)](https://www.npmjs.com/package/react-native-zhb-actionsheet) [![License](https://img.shields.io/npm/l/react-native-zhb-actionsheet.svg)](https://www.npmjs.com/package/react-native-zhb-actionsheet) [![Build Status](https://travis-ci.org/airbnb/react-native-zhb-actionsheet.svg)](https://travis-ci.org/airbnb/react-native-zhb-actionsheet)

ActionSheet component for React Native (iOS and Android)

![1](./docs/1.jpeg)
![2](./docs/2.jpeg)

## Installation

Get started with actionsheet by installing the node module:
```
$ npm install react-native-zhb-actionsheet --save
```

## Props

| prop | type | default | required | description |
| ---- | ---- | ---- | ---- | ---- |
| titles | array of object, [{title: string, actionStyle: oneOf(["default", "cancel", "destructive"]), action: func] | [] | yes | |
| onClose | func | none | no | |
| separateLineHeight | number | 4 | no | |

## Basic Usage

```
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import ActionSheet from 'react-native-zhb-actionsheet';

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
```

## Running the Example Project

You can check out the example project with the following instructions

1. Clone the repo: `git clone https://github.com/NoPPT/react-native-zhb-actionsheet.git`
2. Open: `cd react-native-zhb-actionsheet` and Install: `npm install`
3. Run `npm start` to start the packager.

## License
[MIT](./LICENSE)