/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View,  Image, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Color from "../../constant/Color"
export default class FloatButton extends Component {
    static propTypes = {
        drawable: PropTypes.any.isRequired,
        action:PropTypes.func.isRequired
    };


    render() {
        return (
            <TouchableWithoutFeedback
                onPress={this.props.action}>
                <View style={[styles.iconCircle]}>
                    <Image style={{width: 25, height: 25, resizeMode: 'contain'}}
                           source={this.props.drawable}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    iconCircle: {
        flex: 1,
        width: 55,
        height: 55,
        borderRadius: 50,
        right: 16,
        bottom: 31,
        position: 'absolute',
        elevation: 5,
        backgroundColor: Color.colorAccent,
        alignItems: 'center',
        justifyContent: 'center'
    },
});