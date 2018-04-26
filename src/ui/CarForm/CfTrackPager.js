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
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class CfTrackPager extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        console.log(this.props.filePath);
        return<View style={{
            flex: 1,
            backgroundColor: Color.background
        }}>
            <Toolbar
                elevation={2}
                title={['查看报表']}
                color={Color.colorBlueGrey}
                isHomeUp={true}
                isAction={false}
                isActionByText={true}
                actionArray={[]}
                functionArray={[
                    () => {
                        this.props.nav.goBack(null)
                    },
                ]}
            />
            <WebView source={{uri: 'http://192.168.1.113:811'}}/>
        </View>;
    }
}


