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

export default class QcInputDialog extends Component {
    static propTypes = {
        action: PropTypes.array.isRequired,//[ref,change,confirm,dismiss]
        defaultStr: PropTypes.string.isRequired,//[ref,change,confirm,dismiss]
        countArray: PropTypes.array.isRequired,//[ref,change,confirm,dismiss]

    };

    constructor(props) {
        super(props);
    }




    render() {
        return (
            <PopupDialog
                ref={this.props.action[0]}
                width={width - 32}
                height={250}>
                <View style={styles.layoutContainer}>
                    <Text style={styles.titleStyle}>质检总评</Text>
                    <View style={styles.borderBottomLine}>
                        <TextInput style={styles.textInput}
                                   placeholder={"填写总评"}
                                   returnKeyType={'done'}
                                   defaultValue={this.props.defaultStr}
                                   blurOnSubmit={true}
                                   underlineColorAndroid="transparent"
                                   onChangeText={this.props.action[1]}/>
                    </View>
                    <View style={styles.iconContainer}>
                        <View
                            style={{alignItems: 'center'}}>
                            <View style={styles.iconCircle}>
                                <Text>{this.props.countArray[0]}</Text></View>
                            <Text >通过</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <View style={styles.iconCircle}>
                                <Text>{this.props.countArray[1]}</Text></View>
                            <Text>不通过</Text></View>

                        <View style={{alignItems: 'center'}}>
                            <View style={styles.iconCircle}>
                                <Text>{this.props.countArray[2]}</Text></View>
                            <Text>图片</Text></View>


                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity onPress={this.props.action[2]}>
                            <Text style={{margin: 16}}>保存</Text>
                        </TouchableOpacity>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={this.props.action[3]}>
                                <Text style={{margin: 16}}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.props.action[4]}>
                                <Text style={{color: Color.colorPrimary, margin: 16}}>提交</Text>
                            </TouchableOpacity>
                        </View>
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
        height: 250,
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
        marginLeft: 16,
        marginRight: 16,
        borderColor: Color.line,
        borderBottomWidth: 1,
    },

    buttonContainer: {
        right: 0,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0
    },
    borderBottomLine: {
        borderBottomWidth: 1,
        borderBottomColor: Color.line,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    iconContainer: {
        flex: 1,
        marginTop: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: width - 32,
    },

    iconCircle: {
        flex: 1,
        width: 55,
        height: 55,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Color.line
    },
});