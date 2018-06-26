'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Dimensions, TouchableOpacity, Text} from 'react-native';
import Color from "../../constant/Color"
const {width, height} = Dimensions.get('window');
let typeGroup=['created', 'waitting', 'service_approving', 'service_approved', 'manager_reviewing',"manager_reviewed"];
let transGroup=['已创建', '等待处理', '处理中', '提交审核', '已审核','完结'];
let colorGroup=[Color.colorBlueGrey, Color.colorDeepOrange, Color.colorDeepPurple, Color.colorRed, Color.colorGreen,'black'];
export default class AsMainItem extends Component {
    static propTypes = {
        rowData: PropTypes.any.isRequired,
        action: PropTypes.func.isRequired
    };

    getTypeIndex(){
        let temp = 0;
        typeGroup.map((data,index)=>{
            if(data === this.props.rowData.status){
                temp = index;
            }
        });
        return temp;
    }

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
                    borderTopRightRadius:10,
                    borderTopLeftRadius:10,
                    backgroundColor:colorGroup[this.getTypeIndex()]
                }}>
                    {transGroup[this.getTypeIndex()]}</Text>

                <View style={styles.itemText}>
                    <Text>{'单据编号'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.rowData.serial_number}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'售后原因'}</Text>
                    <Text style={{color: Color.black_semi_transparent}}>{this.props.rowData.reason}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'类型'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.rowData.type}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'投诉方'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent, width: 200, textAlign: 'right'}}
                        numberOfLines={2}>{this.props.rowData.customer_name}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'被投诉方'}</Text>
                    <Text style={{color: Color.black_semi_transparent}}>{this.props.rowData.accuser_name}</Text>
                </View>
                <View style={[styles.itemText,{ paddingBottom: 10}]}>
                    <Text>{'创建时间'}</Text>
                    <Text style={{color: Color.black_semi_transparent}}>{this.props.rowData.created_at}</Text>
                </View>
                {
                    (() => {
                        if (this.props.rowData.reject_reason) {
                            return <View style={[styles.itemText, {backgroundColor: Color.black_semi_transparent,paddingBottom:10}]}>
                                <Text style={{color: 'white'}}>{'单据驳回'}</Text>
                                <Text style={{color: 'white',width: 200,textAlign: 'right'}}>{this.props.rowData.reject_reason}</Text>
                            </View>
                        }

                    })()

                }

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
        borderRadius:10
    },
});