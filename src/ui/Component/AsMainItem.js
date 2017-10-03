/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Dimensions, TouchableOpacity, Text} from 'react-native';
import Color from "../../constant/Color"
import Utility from "../../utils/Utility";
const {width, height} = Dimensions.get('window');

export default class AsMainItem extends Component {
    static propTypes = {
        rowData: PropTypes.any.isRequired,
        action: PropTypes.func.isRequired
    };


    render() {
        return (
            <TouchableOpacity
                onPress={this.props.action}
                style={styles.itemCard}>
                <Text style={{
                    textAlign: 'center',
                    width: width - 32,
                    padding: 5,
                    color: 'white',
                    backgroundColor: (this.props.rowData.reason === "成品" ? Color.colorGreen :
                        (this.props.rowData.reason==="材料"?Color.colorDeepPurple:Color.colorBlueGrey))
                }}>
                    {this.props.rowData.reason}</Text>
                <View style={styles.itemText}>
                    <Text>{'单据编号'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.rowData.serial_number}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'类型'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.rowData.type}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'投诉方'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent,width:200,textAlign:'right'}} numberOfLines={2}>{this.props.rowData.customer_name}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'被投诉方'}</Text>
                    <Text style={{color: Color.black_semi_transparent}}>{this.props.rowData.accuser_name}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'创建时间'}</Text>
                    <Text style={{color: Color.black_semi_transparent}}>{this.props.rowData.created_at}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    itemText: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width - 32,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    itemCard: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 2,
        marginBottom: 32,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10,
        paddingBottom: 10
    },
});