/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions, TouchableOpacity, Image,
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import Toast from 'react-native-root-toast';
import {WdActions} from "../../actions/WdAction";

import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {CachedImage} from "react-native-img-cache";
const {width, height} = Dimensions.get('window');

export default  class QcProductDetailPager extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    setStatus() {

    }


    render() {
        return (

            <View style={{
                flex: 1,
                backgroundColor: "white",

            }}>
                <Toolbar
                    elevation={2}
                    title={["产品详情"]}
                    color={Color.colorIndigo}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={[]}
                    functionArray={[() => this.props.nav.goBack(null)]}
                />
                <ScrollView>
                    <View style={{alignItems: "center", marginBottom: 16}}>
                        <TouchableOpacity style={{width: width, height: 150,}} onPress={() => {
                            this.props.nav.navigate('gallery', {
                                pics: this.props.product.productImages
                            })
                        }}>
                            <CachedImage
                                resizeMode="contain"
                                style={{width: width, height: 150,}}
                                source={{uri: this.props.product.productImages ? this.props.product.productImages[0] : '-'}}/>
                        </TouchableOpacity>

                        <View style={styles.textStyle}>
                            <Text >型号</Text>
                            <Text style={{color: Color.black_semi_transparent}}>{this.props.product.itemName}</Text>
                        </View>
                        <View style={styles.textStyle}>
                            <Text >类型</Text>
                            <Text style={{color: Color.black_semi_transparent}}>{this.props.product.type}</Text>
                        </View>
                        <View style={styles.textStyle}>
                            <Text >数目</Text>
                            <Text style={{color: Color.black_semi_transparent}}>{this.props.product.qty}</Text>
                        </View>
                        <View style={styles.textStyle}>
                            <Text >规格编码</Text>
                            <Text style={{color: Color.black_semi_transparent}}>{this.props.product.skuCode}</Text>
                        </View>
                        <View style={styles.textStyle}>
                            <Text >描述</Text>
                            <Text style={{
                                width: 200,
                                textAlign: 'right',
                                color: Color.black_semi_transparent
                            }}>{this.props.product.skuName}</Text>
                        </View>
                        <View style={styles.textStyle}>
                            <Text >交货时间</Text>
                            <Text style={{
                                width: 200,
                                textAlign: 'right',
                                color: Color.black_semi_transparent
                            }}>{this.props.product.deliverDate}</Text>
                        </View>

                        <Text style={{width: width - 32, margin: 16}}>质检流程</Text>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={[styles.mainButton, {borderColor: Color.content}]}
                                onPress={() => {

                                }}>
                                <Text>材料质检</Text>
                            </TouchableOpacity>
                            <Image source={require('../../drawable/attach_file.png')} style={{width: 25, height: 25}}/>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={[styles.mainButton, {borderColor: Color.content}]}
                                onPress={() => {

                                }}>
                                <Text>工艺质检</Text>

                            </TouchableOpacity>
                            <Image source={require('../../drawable/attach_file.png')} style={{width: 25, height: 25}}/>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={[styles.mainButton, {borderColor: Color.content}]}
                                onPress={() => {

                                }}>
                                <Text>成品质检</Text>
                            </TouchableOpacity>
                            <Image source={require('../../drawable/attach_file.png')} style={{width: 25, height: 25}}/>
                        </View>

                    </View>
                </ScrollView>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    textStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: width - 32,
        marginRight: 16,
        marginLeft: 16,
        marginTop: 16,

    },
    mainButton: {
        width: 150,
        height: 55,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        margin: 16
    },
    layoutContainer: {
        width: width - 32,
        height: 100,
        backgroundColor: 'white'
    },
});
