/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import Color from "../../constant/Color";
import {View,  Image, TouchableOpacity, Text,Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export default class SwMemberList extends Component {
/*    static propTypes = {
        dataSourcePic: PropTypes.any.isRequired,
        action:PropTypes.func.isRequired
    };*/


    render() {
        return (
            <View style={{
                width: width - 32,
                height: 55 + 16 + 16 + 16,
                backgroundColor: 'white',
                margin: 16,
                paddingLeft: 16,
                elevation: 2,
                borderRadius: 50,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{
                        borderRadius: 50,
                        width: 45,
                        height: 45,
                        backgroundColor: Color.content,
                        margin: 10,
                        elevation: 2,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{color: 'white',}}>+</Text>
                    </View>
                    <Text>新增</Text>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{
                        borderRadius: 50,
                        width: 45,
                        height: 45,
                        backgroundColor: Color.colorAmber,
                        margin: 10,
                        elevation: 2,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{color: 'white',}}>蒋</Text>
                    </View>
                    <Text>蒋介石</Text>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{
                        borderRadius: 50,
                        width: 45,
                        height: 45,
                        backgroundColor: Color.colorCyanDark,
                        margin: 10,
                        elevation: 2,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{color: 'white',}}>孙</Text>
                    </View>
                    <Text>孙中山</Text>
                </View>
            </View>

        )
    }
}
