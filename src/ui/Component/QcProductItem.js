/**
 * Created by Administrator on 2017/3/14.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, Platform, TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';
import {CachedImage, ImageCache} from "react-native-img-cache";
const {width, height} = Dimensions.get('window');
export default class QcProductItem extends Component {
    static propTypes = {
        product: PropTypes.any.isRequired,
        func: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            statusText: "待质检",
            statusColor: Color.content,
            isAllFinish: false,

        }
    }

    componentDidMount() {
        this.setStatus();
    }

    setStatus() {

    }



    render() {
        //   console.log(JSON.stringify(this.props.task));
        return (
            <TouchableOpacity
                onPress={this.props.func}>
                <View style={styles.mainContainer}>
                    <Text style={{width:width-32-16,height:45}}>未完成</Text>
                    <View style={styles.itemText}>
                        <Text>{'型号'}</Text>
                        <Text style={{color: Color.black_semi_transparent}}>{this.props.product.itemName}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text>{'数量'}</Text>
                        <Text style={{color: Color.black_semi_transparent}}>{this.props.product.qty}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text>{'交接时间'}</Text>
                        <Text style={{color: Color.black_semi_transparent}}>{this.props.product.deliverDate}</Text>
                    </View>
                    <View style={{width:width-32-16,justifyContent:'space-around',flexDirection:'row',marginTop:16}}>
                        <Text>材料</Text>
                        <Text>工艺</Text>
                        <Text>成品</Text>
                    </View>
                    <View style={{width:width-32-16,justifyContent:'space-around',flexDirection:'row',marginBottom:16}}>
                        <View style={{width:(width-32-16)/3,height:3,backgroundColor:Color.colorAccent}}/>
                        <View style={{width:(width-32-16)/3,height:3,backgroundColor:Color.colorAccent}}/>
                        <View style={{width:(width-32-16)/3,height:3,backgroundColor:Color.line}}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create(
    {
        mainContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            elevation: 2,
            marginBottom: 32,
            marginLeft: 16,
            marginRight: 16,
            marginTop: 10,
        },

        iconContainer: {
            flex: 1,
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
            width: width,
            height: 1,
            marginTop: 16,
            marginBottom: 16,
            marginLeft: -32
        },
        itemText: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: width - 32,
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10
        }
    });

