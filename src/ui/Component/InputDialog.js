/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions} from 'react-native';
import Color from "../../constant/Color"
import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';

const {width, height} = Dimensions.get('window');

export default class InputDialog extends Component {
    static propTypes = {
        action: PropTypes.array.isRequired,//[ref,change,confirm,dismiss]
        str: PropTypes.array.isRequired,//[title,holder,]

    };


    render() {
        return (
            <PopupDialog
                ref={this.props.action[0]}
                width={width - 32}
                height={200}
            >
                <View style={styles.layoutContainer}>

                    <Text style={styles.titleStyle}>{this.props.str[0]}</Text>

                    <TextInput style={styles.textInput}
                               placeholder={this.props.str[1]}
                               returnKeyType={'done'}
                               blurOnSubmit={true}
                               underlineColorAndroid="transparent"
                               onChangeText={this.props.action[1]}/>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={this.props.action[2]}>
                            <Text style={{margin: 16}}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.action[3]}>
                            <Text style={{color: Color.colorPrimary, margin: 16}}>确认</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </PopupDialog>
        )
    }
}

const styles = StyleSheet.create({
    layoutContainer: {
        width: width - 32,
        flexDirection: 'column',
        height: 200,
        backgroundColor: 'white'
    },

    titleStyle: {
        fontSize: 18,
        marginLeft: 16,
        marginTop: 16,
        color: Color.black_semi_transparent
    },

    textInput: {
        width: width - 64,
        height: 65,
        marginLeft: 10,
        marginRight: 10,
        borderColor: Color.line,
        borderBottomWidth: 1,
    },

    buttonContainer: {
        right: 0,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0
    }
});