/**
 * Created by Administrator on 2017/3/14.
 */
'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet,  Image,  TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';
import {CachedImage} from "react-native-img-cache";
export class WpProductItem extends Component {
    static propTypes = {
        product: PropTypes.any.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        console.log(JSON.stringify(this.state.product))
    }

    componentWillReceiveProps(newProps) {

    }

    render() {
        //   console.log(JSON.stringify(this.props.task));
        return (
            <TouchableOpacity
                style={{flexDirection: 'row', backgroundColor: 'white', elevation: 2, margin: 16}}
                onPress={() => {
                    //this.props.func(this.props.product)
                    this.props.func();
                }}>
                <View style={{width: 100, height: 100, backgroundColor: Color.line, margin: 5}}>
                    <CachedImage
                        resizeMode="contain"
                        style={{width: 100, height: 100,}}
                        source={{uri: this.props.product.PicPath ? this.props.product.PicPath : '-'}}/>
                </View>
                <View>
                    <View style={{flexDirection: "row",alignItems:"center"}}>
                        <Text style={{
                            color: Color.black_semi_transparent,
                            margin: 5,
                        }}>{ this.props.product.ItemName}</Text>
                        {
                            (()=>{
                                if(this.props.product.pics&&this.props.product.pics.length>0){
                                    return  <Image
                                        style={{width:15,height:15}}
                                        source={require('../../drawable/pass_ico.png')}/>
                                }
                            })()

                        }


                    </View>
                    <Text style={{margin: 5, width: 150}}>{ this.props.product.ItemRemark}</Text>
                    <View style={{flexDirection: "row"}}>
                        {
                            (() => {
                                if (this.props.product.selectStep && this.props.product.selectStep[0]) {
                                    return (
                                        <View
                                            style={styles.tips}>
                                            <Text
                                                style={{color: "white"}}>{this.props.isWood ? '白胚' : '木架'}</Text>
                                        </View>)
                                }
                            })()
                        }
                        {
                            (() => {
                                if (this.props.product.selectStep && this.props.product.selectStep[1]) {
                                    return (
                                        <View
                                            style={styles.tips}>
                                            <Text
                                                style={{color: "white"}}>成品</Text>
                                        </View>)
                                }
                            })()
                        }
                        {
                            (() => {
                                if (this.props.product.selectStep && this.props.product.selectStep[2]) {
                                    return (
                                        <View
                                            style={styles.tips}>
                                            <Text
                                                style={{color: "white"}}>包装</Text>
                                        </View>)
                                }
                            })()
                        }
                        {/*                        {
                         (() => {
                         if (this.props.product.pics) {
                         return (
                         <View
                         style={styles.tips}>
                         <Text
                         style={{color: "white"}}>{this.props.product.pics.length + "张"}</Text>
                         </View>)
                         }


                         })()
                         }*/}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create(
    {
        tips: {
            width: 45,
            backgroundColor: Color.colorPurple,
            margin: 2,
            justifyContent: "center",
            padding: 5,
            borderRadius: 10,
            alignItems: 'center'
        }
    });

