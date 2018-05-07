/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, Alert} from 'react-native';
import Color from "../../constant/Color"
import Utility from "../../utils/Utility";
const {width, height} = Dimensions.get('window');
const statusText = ['待审核', '待分配', '未出车', '已出车', '已结束','审核失败','分配失败','放弃用车'];
export default class CfCarItem extends Component {
    static propTypes = {
        carInfo: PropTypes.any.isRequired,
        actionText: PropTypes.any.isRequired,
        actionFunc: PropTypes.func.isRequired,
    };

    detailView() {
        Alert.alert(
            '用车详细',

            '用车单号：' + this.props.carInfo.billNo + '\n' +
            '状态：' + statusText[this.props.carInfo.status] + '\n' +
            '车辆类型：' + (this.props.carInfo.carType === 0 ? "公司车辆" : "私人车辆") + '\n\n' +

            '申请时间：' + Utility.replaceT(this.props.carInfo.createTime) + '\n' +
            '用车日期：' +  Utility.replaceT(this.props.carInfo.tripTime)+ '\n' +
            '申请人：' + this.props.carInfo.account + '\n\n' +

            '目的地：' + this.props.carInfo.tripTarget + '\n' +
            '外出范围：' + (this.props.carInfo.tripArea?"佛山外":"佛山内") + '\n' +
            '预计里程：' + this.props.carInfo.tripDistance + '\n' +

            (this.props.carInfo.carPower ? ('排量：' + this.props.carInfo.carPower) : '') + '\n' +
            '随行人员：' + (this.props.carInfo.tripMember ? this.props.carInfo.tripMember : '') + '\n' +
            '加油卡：' + (this.props.carInfo.needCard ? "需要" : "不需要") + '\n' +
            '备注：' + (this.props.carInfo.remark ? this.props.carInfo.remark : '') + '\n\n' +

            '起始里程：' + (this.props.carInfo.beginPoint ? this.props.carInfo.beginPoint : '') + '\n' +
            '结束里程：' + (this.props.carInfo.endPoint ? this.props.carInfo.endPoint : '') + '\n',

            //  '工号：'+this.props.carInfo.workNum+'\n',
            [
                {
                    text: '确定', onPress: () => {
                }
                },

            ]
        )
    }


    render() {
        return (
            <View style={{
                backgroundColor: 'white',
                elevation: 2,
                marginBottom: 55,
            }}>
                <View style={{
                    width: width,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems:'center'
                }}>
                    {
                        (() => {
                            if (this.props.carInfo.status === 3) {//pass
                                return <Image style={{alignContent: 'center',width:100,height:100}}
                                              source={require('../../drawable/car_image.png')}/>
                            } else if (this.props.carInfo.status === 2) {//process
                                return <Image style={{alignContent: 'center',width:100,height:100}}
                                              source={require('../../drawable/car_red.png')}/>
                            } else {
                                return <Image style={{alignContent: 'center',width:100,height:100}}
                                              source={require('../../drawable/car_gray.png')}/>
                            }
                        })()
                    }
                </View>
                <View style={{
                    width: width - 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 16
                }}>
                    <Text style={{color: Color.black_semi_transparent, fontSize: 18}}>
                        {statusText[this.props.carInfo.status]}
                    </Text>
                    <Text>{this.props.carInfo.billNo}</Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 25,
                        width: width / 2 + 60
                    }}>
                        <Text>起始里程</Text>
                        <Text>结束里程</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10,}}>
                        <View style={{backgroundColor: Color.line, width: 10, height: 10, borderRadius: 50}}/>
                        <View style={{backgroundColor: Color.line, width: width / 2, height: 2}}/>
                        <View style={{backgroundColor: Color.line, width: 10, height: 10, borderRadius: 50}}/>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        width: width / 2 + 60
                    }}>
                        <Text>{this.props.carInfo.beginPoint ? this.props.carInfo.beginPoint : '未填写'}</Text>
                        <Text>{this.props.carInfo.endPoint ? this.props.carInfo.endPoint : '未填写'}</Text>
                    </View>
                </View>


                <TouchableOpacity style={{
                    backgroundColor: Color.content,
                    borderRadius: 10,
                    width: width - 32,
                    margin: 16,
                    elevation: 2,
                    padding: 16,
                }} onPress={() => {
                    this.detailView();
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 18
                    }}>{this.props.carInfo.carType === 0 ? '公司车辆' : '私人车辆'}</Text>
                    <Text style={{
                        color: 'white',
                        fontSize: 25
                    }}>{this.props.carInfo.carNum}</Text>
                    <View style={{
                        backgroundColor: 'white',
                        width: 200,
                        height: 1,
                        marginTop: 16,
                        marginBottom: 16
                    }}/>
                    <Text style={{
                        color: 'white',
                        fontSize: 15
                    }}>{'用车时间：'+Utility.replaceT(this.props.carInfo.tripTime,false)}</Text>
                    <Text style={{color: 'white'}}>
                        {'目的地：' + this.props.carInfo.tripTarget}
                    </Text>
                    <Text style={{color: 'white'}}>{this.props.carInfo.Remark}</Text>

                </TouchableOpacity>

                {
                    (() => {
                        if (this.props.carInfo.status < 2||this.props.actionText==='选择') {
                            return <TouchableOpacity onPress={() =>
                                this.props.actionFunc()}>
                                <View style={styles.button}>
                                    <Text style={{color: 'white'}}>{this.props.actionText}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    })()
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: width - 32,
        height: 45,
        backgroundColor: Color.colorAccent,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        borderRadius: 10
    },
});