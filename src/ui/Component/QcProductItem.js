/**
 * Created by Administrator on 2017/3/14.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, Dimensions,  TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';
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
    }

    getStatus(flag) {
        if (this.props.product.state && this.props.product.state.length === 3) {
            if (this.props.product.state.substring(flag-1, flag) === "1")
                return 1;
            else
                return 0;
        } else return 0;

    }



    render() {
        //   console.log(JSON.stringify(this.props.task));
        return (
            <TouchableOpacity
                onPress={this.props.func}>
                <View style={styles.mainContainer}>
                    <Text style={{
                        width: width - 32,
                        height: 25,
                        backgroundColor: this.getStatus(1)&&this.getStatus(2)&&this.getStatus(3)?   Color.colorPrimaryDark:Color.content,
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 16
                    }}>{this.getStatus(1)&&this.getStatus(2)&&this.getStatus(3)?'已完成':'未完成'}</Text>
                    <View style={styles.itemText}>
                        <Text>{'型号'}</Text>
                        <Text style={{backgroundColor: Color.colorAccent,color:'white',paddingLeft:10,paddingRight:10}}>{this.props.product.itemName}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text>{'数量'}</Text>
                        <Text style={{color: Color.black_semi_transparent}}>{this.props.product.qty}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text>{'交接时间'}</Text>
                        <Text style={{color: Color.black_semi_transparent}}>{this.props.product.deliverDate}</Text>
                    </View>
                    <View style={{
                        width: width - 32 - 16,
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        marginTop: 16
                    }}>
                        <Text>材料</Text>
                        <Text>工艺</Text>
                        <Text>成品</Text>
                    </View>
                    <View style={{
                        width: width - 32 - 16,
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        marginBottom: 16
                    }}>
                        <View style={{width: (width - 32 - 16) / 3, height: 3, backgroundColor: this.getStatus(1)===1?Color.colorAccent:Color.line}}/>
                        <View style={{width: (width - 32 - 16) / 3, height: 3, backgroundColor: this.getStatus(2)===1?Color.colorAccent:Color.line}}/>
                        <View style={{width: (width - 32 - 16) / 3, height: 3, backgroundColor: this.getStatus(3)===1?Color.colorAccent:Color.line}}/>
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

