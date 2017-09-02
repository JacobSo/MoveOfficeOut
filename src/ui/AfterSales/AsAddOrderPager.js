/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    Platform,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet, TouchableOpacity, Image
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import ApiService from '../../network/AsApiService';
import SnackBar from 'react-native-snackbar-dialog'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class AsAddOrderPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            select: [true, false, false],
            isLoading: false,
            selectType:"成品",
            supplier:"",
            remark:"",
        }
    }

    getSelectionView() {
        return <View style={{
            flexDirection: "row",
            justifyContent: "space-around",
            height: 55,
            backgroundColor: 'white',
            margin: 16,
            elevation: 2
        }}>
            <TouchableOpacity
                style={[styles.stepButton, {backgroundColor: (this.state.select[0] ? Color.colorAmber : Color.trans)},]}
                onPress={() => this.setState({select: [true, false, false],selectType:"成品"})
                }>
                <Text style={{
                    textAlign: "center",
                    color: this.state.select[0] ? "white" : "black"
                }}>成品</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.stepButton, {backgroundColor: (this.state.select[1] ? Color.colorAmber : Color.trans)},]}
                onPress={() => this.setState({select: [false, true, false],selectType:"材料"})
                }>
                <Text style={{
                    textAlign: "center",
                    color: this.state.select[1] ? "white" : "black"
                }}>材料</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.stepButton, {backgroundColor: (this.state.select[2] ? Color.colorAmber : Color.trans)},]}
                onPress={() => this.setState({select: [false, false, true],selectType:"其他"})}>
                <Text style={{
                    textAlign: "center",
                    color: this.state.select[2] ? "white" : "black"
                }}>其他</Text>
            </TouchableOpacity>
        </View>
    }

    createOrder() {
        if(this.state.supplier&&this.state.remark){
            this.setState({isLoading:true});
            ApiService.createOrder(this.state.selectType,this.state.supplier,this.state.remark)
                .then((responseJson) => {
                        console.log(JSON.stringify(responseJson));
                        if (responseJson.status===0) {
                            SnackBar.show('操作成功');
                            this.props.nav.goBack(null);
                        } else {
                            SnackBar.show(responseJson.message);
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                        }
                    })
                .catch((error) => {
                    console.log(error);
                    SnackBar.show("出错了，请稍后再试");
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }).done();
        }else SnackBar.show("信息不完整");
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar title={['创建售后单据']}
                         color={Color.colorAmber}
                         elevation={2}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={[]}
                         functionArray={[
                             () => this.props.nav.goBack(null),
                         ]}/>

                <KeyboardAvoidingView behavior='position'>
                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>
                        {
                            this.getSelectionView()
                        }
                        <TouchableOpacity style={{
                            flexDirection: "row",
                            height: 55,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            margin: 16,
                            justifyContent: 'space-between',
                            elevation: 2,
                        }} onPress={() => {
                            this.props.nav.navigate('asParam', {
                                mode: 0,
                                actionFunc:(selectSupplier)=>{
                                    this.setState({supplier:selectSupplier})
                                }
                            })
                        }}>
                            <Text style={{marginLeft: 16}}>{this.state.supplier?this.state.supplier:"客户与售后专员"}</Text>
                            <Image source={require("../../drawable/arrow.png")}
                                   style={{width: 10, height: 20, marginRight: 10}}/>
                        </TouchableOpacity>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            height: 100,
                            backgroundColor: 'white',
                            margin: 16,
                            elevation: 2
                        }}>
                            <TextInput style={styles.textInput}
                                       multiline={true}
                                       defaultValue={this.state.remark}
                                       placeholder="异常描述"
                                       returnKeyType={'done'}
                                       underlineColorAndroid="transparent"
                                       blurOnSubmit={true}
                                       onChangeText={(text) => this.setState({remark: text})}/>
                        </View>
                        <TouchableOpacity onPress={() => this.createOrder()}>
                            <View style={styles.button}>
                                <Text style={{color: 'white'}}>创建单据</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>


                <Loading visible={this.state.isLoading}/>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    button: {
        width: width - 44,
        height: 55,
        backgroundColor: Color.colorAmber,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2
    },
    textInput: {
        width: width - 64,
        height: 65,
        marginRight: 10,
    },
    stepButton: {
        flex: 1,
        justifyContent: "center",

    },

});