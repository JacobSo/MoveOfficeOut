/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {View, Image, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity} from 'react-native';
import Color from "../../constant/Color"
export default class LocationView extends Component {
    static propTypes = {
        task: PropTypes.any.isRequired,
        action:PropTypes.func.isRequired
    };


    render() {
        return (
            <View style={styles.signListItem}>
                {
                    (() => {
                        if (this.props.task.VisitingMode.indexOf('走访') > -1)
                            if (this.props.task.Signtype === 2) {
                                return (<Text style={styles.finishBtn}>已完成</Text>)
                            } else {
                                return (
                                    <TouchableOpacity
                                        style={this.props.task.Signtype === -1 ?
                                            styles.normalBtn : styles.endBtn}
                                        onPress={this.props.action}>
                                        <Text
                                            style={styles.panelButtonTitle}>
                                            {this.props.task.Signtype === -1 ? '到达' : '完成'}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                    })()}
                <Text style={{width: 200}}
                      numberOfLines={1}>系列：{this.props.task.Series}</Text>
                <Text style={{width: 200}}
                      numberOfLines={1}>供应商：{this.props.task.SupplierName}</Text>
                <Text style={{width: 200}}
                      numberOfLines={6}>对接内容：{'\n'}{this.props.task.WorkContent}</Text>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    endBtn: {
        padding: 16,
        backgroundColor: Color.colorAccent,
        alignItems: 'center',
        marginVertical: 10
    },
    normalBtn: {
        padding: 16,
        backgroundColor: Color.colorCyan,
        alignItems: 'center',
        marginVertical: 10
    },
    panelButtonTitle: {
        fontWeight: 'bold',
        color: 'white'
    },
    finishBtn: {
        padding: 16,
        backgroundColor: Color.line,
        alignItems: 'center',
        textAlign: 'center',
        marginVertical: 10,
        color: 'white'
    },
    signListItem: {
        margin: 16,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
    },
});