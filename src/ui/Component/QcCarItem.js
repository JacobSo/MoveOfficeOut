/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {View, Image, StyleSheet, Dimensions, Text, TouchableOpacity} from 'react-native';
import Color from "../../constant/Color"
const {width, height} = Dimensions.get('window');

export default class QcCarItem extends Component {
    static propTypes = {
        catInfo: PropTypes.any.isRequired,
        deleteCar: PropTypes.func.isRequired,
    };


    render() {
        return (
            <View style={{
                backgroundColor: 'white',
                elevation: 2,
                marginBottom: 100

            }}>
                <View style={{
                    width: width - 32,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    margin: 16,
                }}>

                    {
                        (() => {
                            if (this.props.carInfo.IsAduit) {//pass
                                return <Image style={{alignContent: 'center'}}
                                              source={require('../../drawable/car_image.png')}/>
                            } else {//process
                                return <Image style={{alignContent: 'center'}}
                                              source={require('../../drawable/car_red.png')}/>
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
                        {this.props.carInfo.IsAduit ? "车辆申请已批" : "申请处理中"}
                    </Text>
                    <Text>{this.props.carInfo ? "出发工作吧！" : "如需修改，可删除申请重新操作"}
                    </Text>
                </View>


                <View style={{
                    backgroundColor: this.props.carInfo.IsAduit ? Color.colorCyanDark : Color.black_semi_transparent,
                    borderRadius: 10,
                    width: width - 32,
                    margin: 16,
                    elevation: 2,
                    padding: 16,
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 18
                    }}>{this.props.carInfo.CarType}</Text>
                    <Text style={{
                        color: 'white',
                        fontSize: 25
                    }}>{this.props.carInfo.CarNumber}</Text>
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
                    }}>用车时间：+{this.props.carInfo.QualityDate}</Text>
                    <Text style={{color: 'white'}}>
                        {'申请处理人：' + (this.props.carInfo.AduitUser ? this.props.carInfo.AduitUser : '处理中')}
                    </Text>
                    <Text style={{color: 'white'}}>{this.props.carInfo.Remark}</Text>

                </View>

                {
                    (() => {
                        if (!this.props.carInfo.IsAduit) {
                            return <TouchableOpacity onPress={() =>
                                this.props.deleteCar()}>
                                <View style={styles.button}>
                                    <Text style={{color: 'white'}}>取消用车</Text>
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
        justifyContent: 'center'
    },
});