'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Dimensions, TouchableOpacity, Text} from 'react-native';
import Color from "../../constant/Color"
import Utility from "../../utils/Utility";
const {width, height} = Dimensions.get('window');

export default class WpMainItem extends Component {
    static propTypes = {
        rowData: PropTypes.any.isRequired,
        action: PropTypes.func.isRequired
    };


    render() {
        return (
            <TouchableOpacity
                onPress={this.props.action}
                style={styles.itemCard}>
                <View style={{width: width - 32, padding: 5,    backgroundColor: this.props.rowData.ReviewType === 1 ? Color.colorTeal : Color.colorAmber,
                    borderTopLeftRadius:10,borderTopRightRadius:10}}>
                <Text style={{
                    width: width - 32,
                    textAlign: 'center',
                    color: 'white',
                }}>
                    {this.props.rowData.ReviewType === 1 ? '软体评审' : '板木评审'}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'评审时间'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{Utility.getTime(this.props.rowData.ReviewDate)}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'供应商'}</Text>
                    <Text style={{color: Color.black_semi_transparent}}>{this.props.rowData.FacName}</Text>
                </View>
                {
                    (() => {
                        if (this.props.rowData.ReviewType === 0) {
                            return (  <View style={styles.itemText}>
                                <Text>{'系列'}</Text>
                                <Text style={{color: Color.black_semi_transparent}}>{this.props.rowData.Series}</Text>
                            </View>)
                        }

                    })()
                }
                <View style={styles.itemText}>
                    <Text>{'产品数'}</Text>
                    <Text style={{color: Color.black_semi_transparent}}>{this.props.rowData.productlist.length}</Text>
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
        paddingBottom: 10,
        borderRadius:10
    },
});