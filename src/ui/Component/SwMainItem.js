'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableOpacity, Text, Dimensions} from 'react-native';

import Color from "../../constant/Color";
import * as ColorGroup from "../../constant/ColorGroup";
import * as StatusGroup from "../../constant/StatusGroup";
const {width, height} = Dimensions.get('window');

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
                    backgroundColor: ColorGroup.swColor[this.props.item.scStatus],
                    textAlign: 'center',
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    padding: 5,
                }}>{StatusGroup.swItemStatus[this.props.item.scStatus]}</Text>

                <Text style={{
                    margin: 16,
                    fontWeight: 'bold'
                }}>{this.props.item.scContent}</Text>
                <View
                    style={[styles.itemText, {borderTopWidth: 1, borderColor: Color.line, paddingTop: 10}]}>
                    <Text>{'工作日期'}</Text>
                    <Text
                        style={styles.textContent}>{this.props.item.scWorkTime}</Text>
                </View>

                <View style={styles.itemText}>
                    <Text>{'创建人'}</Text>
                    <Text
                        style={styles.textContent}>{this.props.item.scCreator}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'协助人员'}</Text>
                    <Text
                        style={styles.textContent}>{this.props.item.scMembers ? this.props.item.scMembers : '无'}</Text>
                </View>
                {
                    (() => {
                        if (this.props.item.rejectRemark) {
                            return <View>
                                <View style={[styles.itemText, {
                                    backgroundColor: Color.black_semi_transparent,
                                    paddingTop: 10
                                }]}>
                                    <Text style={{color: 'white'}}>{'驳回人'}</Text>
                                    <Text
                                        style={[styles.textContent,{color:'white'}]}>{ this.props.item.rejectUser}</Text>
                                </View>
                                <View style={[styles.itemText, {
                                    backgroundColor: Color.black_semi_transparent,
                                    paddingTop: 10
                                }]}>
                                    <Text style={{color: 'white'}}>{'驳回信息'}</Text>
                                    <Text
                                        style={[styles.textContent,{color:'white'}]}>{this.props.item.rejectRemark}</Text>
                                </View>
                            </View>
                        }
                    })()
                }

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
textContent:{color: Color.black_semi_transparent, width: 200,textAlign:'right'}
});