/**
 * Created by Administrator on 2017/3/14.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, Platform, TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {WdActions} from "../../actions/WdAction";
import {CachedImage, CustomCachedImage, ImageCache} from "react-native-img-cache";
import RNFetchBlob from "react-native-fetch-blob";
const {width, height} = Dimensions.get('window');
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
                        source={{uri: this.props.product.PicPath?this.props.product.PicPath:'-'}}/>
                </View>
                <View>
                    <Text style={{
                        color: Color.black_semi_transparent,
                        margin: 5,
                        width: 150
                    }}>{ this.props.product.ItemName}</Text>
                    <Text style={{margin: 5, width: 150}}>{ this.props.product.ItemRemark}</Text>
                    <View style={{flexDirection: "row"}}>
                        {
                            (() => {
                                if (this.props.product.selectStep && this.props.product.selectStep[0]) {
                                    return (
                                        <View
                                            style={styles.tips}>
                                            <Text
                                                style={{color: "white"}}>白胚</Text>
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

