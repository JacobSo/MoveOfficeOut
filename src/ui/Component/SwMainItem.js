/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableOpacity, Text, Dimensions} from 'react-native';

import Color from "../../constant/Color";
const {width, height} = Dimensions.get('window');
const exList = [ "待提交", "待审核", "处理中", "已驳回", "待评分", "已完结"];
let colorGroup=[Color.colorBlueGrey, Color.colorDeepOrange, Color.colorDeepPurple, Color.colorRed, Color.colorGreen,'black'];

export default class SwMainItem extends Component {
    static propTypes = {
        item: PropTypes.any.isRequired,
        action: PropTypes.func.isRequired
    };


    render() {
        return (
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={this.props.action}>
                <Text style={{
                    color: 'white',
                    backgroundColor:colorGroup[this.props.item.scStatus],
                    textAlign: 'center',
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    padding: 5,
                }}>{exList[this.props.item.scStatus]}</Text>

                <Text style={{
                    margin: 16,
                    fontWeight: 'bold'
                }}>{this.props.item.scContent}</Text>
                <View
                    style={[styles.itemText, {borderTopWidth: 1, borderColor: Color.line, paddingTop: 10}]}>
                    <Text>{'工作日期'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.item.scWorkTime}</Text>
                </View>

                <View style={styles.itemText}>
                    <Text>{'创建人'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.item.scCreator}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'协助人员'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.item.scMembers?this.props.item.scMembers:'无'}</Text>
                </View>
            </TouchableOpacity>

        )
    }
}
const styles = StyleSheet.create({
    iconContainer: {
        width: width - 32,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 16,
        elevation: 2,
        overflow: 'hidden',

    },
    itemText: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width - 32,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,

    },

});