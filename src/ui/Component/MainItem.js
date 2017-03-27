/**
 * Created by Administrator on 2017/3/14.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View, Alert, Text, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';

const {width, height} = Dimensions.get('window');
const circleColor = {
    0: Color.colorRed,
    1: Color.colorOrange,
    2: Color.colorTeal,
    3: Color.colorIndigo,
    4: Color.colorGreen
};
const circleImage = {
    0: require("../../drawable/task_warn.png"),
    1: require("../../drawable/task_tea.png"),
    2: require("../../drawable/task_correct.png"),
    3: require("../../drawable/task_question.png"),
    4: require("../../drawable/task_finish.png")
};
export class MainItem extends Component {
    static propTypes = {
        task: PropTypes.any.isRequired,
        func: PropTypes.func.isRequired,
    };

    render() {
        return (
            <TouchableOpacity
                onPress={ this.props.func}>
                <View style={styles.mainContainer}>
                    <View style={styles.iconContainer}>
                        <View
                            style={[styles.iconCircle, {backgroundColor: circleColor[this.props.task.DailyRecordState]}]}>
                            <Image style={{width: 40, height: 40, resizeMode: 'contain'}}
                                   source={circleImage[this.props.task.DailyRecordState]}/>
                        </View>
                        <Text style={{marginLeft: -16}}>{this.props.task.DailyRecordStateName}</Text>
                        <View style={styles.line}/>
                    </View>

                    <View style={styles.textStyle}>
                        <Text >申请日期</Text>
                        <Text >{this.props.task.CreateDate}</Text>
                    </View>
                    <View style={styles.textStyle}>
                        <Text >对接日期</Text>
                        <Text >{this.props.task.DockingDate}</Text>
                    </View>
                    <View style={styles.textStyle}>
                        <Text >对接工作</Text>
                        <Text >{this.props.task.list.length + '件'}</Text>
                    </View>
                    <View style={styles.textStyle}>
                        <Text >申请人</Text>
                        <Text >{this.props.task.Creator}</Text>
                    </View>
                </View></TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create(
    {
        mainContainer: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundColor: 'white',
            elevation: 2,
            margin: 16,
        },

        iconContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: width,
        },

        iconCircle: {
            flex: 1,
            width: 70,
            height: 70,
            borderRadius: 50,
            alignItems: 'center',
            marginTop: 16,
            justifyContent: 'center',
            marginLeft: -16
        },

        textStyle: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: width - 48,
            marginLeft: 8,
            marginBottom: 10
        },
        line: {
            backgroundColor: Color.line,
            width: width - 32,
            height: 1,
            marginTop: 16,
            marginBottom: 16,
            marginLeft: -32
        }

    });
