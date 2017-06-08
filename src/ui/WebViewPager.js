/**
 * Created by Administrator on 2017/3/13.
 *
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity, Image, WebView,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Toast from 'react-native-root-toast';
import App from '../constant/Application';
import SQLite from '../db/Sqlite';
let sqLite = new SQLite();
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class WebViewPager extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <WebView source={{uri: this.props.filePath}}/>
    }
}
