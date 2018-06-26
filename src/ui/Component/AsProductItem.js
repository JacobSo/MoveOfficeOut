'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet,  Dimensions,  TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';
import {CachedImage} from "react-native-img-cache";
const {width, height} = Dimensions.get('window');
export class AsProductItem extends Component {
    static propTypes = {
        product: PropTypes.any.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
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
                        source={{uri: this.props.product.img_path ? this.props.product.img_path : '-'}}/>
                </View>
                <View>
                        <Text style={{margin: 5,width:width/2}}>{"名称："+this.props.product.item_name}</Text>
{/*
                        <Text style={{margin: 5,width:width/2}}>{"编码："+this.props.product.item_code}</Text>
*/}
                        <Text style={{margin: 5,width:width/2}}>{"材料编码："+this.props.product.skuCode}</Text>
                        <Text style={{margin: 5,width:width/2}}>{"材料描述："+this.props.product.SkuName}</Text>
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

