/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {View, Image, TouchableOpacity, Text, Dimensions} from 'react-native';
import Color from "../../constant/Color";
const {width, height} = Dimensions.get('window');

export default class SwFeedbackItem extends Component {
    /*    static propTypes = {
     dataSourcePic: PropTypes.any.isRequired,
     action:PropTypes.func.isRequired
     };*/


    render() {
        return (
            <View style={{
                width: width - 32,
                borderRadius: 10,
                backgroundColor: 'white',
                margin: 16,
                elevation: 2,
                overflow: 'hidden'
            }}>
                <Text style={{
                    color: 'white',
                    backgroundColor: Color.colorDeepPurple,
                    textAlign: 'center',
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    padding: 5,
                }}>主理人</Text>

                <Text style={{
                    margin: 16,
                    fontWeight: 'bold'
                }}>{'我们协会是以存在主义为核心的协会，当你们慢慢扩宽你们的哲学视野之后，你会对所有事物都会有更深层次的理解'}</Text>

                <View style={{width: 55, height: 55, backgroundColor: Color.content, margin: 16}}/>
                <View style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: width - 32,
                        paddingBottom: 10,
                        paddingLeft: 10,
                        paddingRight: 10,
                        borderTopWidth: 1,
                        borderColor: Color.line,
                        paddingTop: 10
                    }}>
                    <View/>
                    <Text
                        style={{color: Color.black_semi_transparent}}>孙中山 于 2017-1-1 提交</Text>
                </View>
            </View>

        )
    }
}
