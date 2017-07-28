/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions, Platform, ListView, Text, TouchableOpacity, Alert,
    DeviceEventEmitter, Image, TextInput, ScrollView, KeyboardAvoidingView
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/QcApiService';
import Color from '../../constant/Color';
import Loading from 'react-native-loading-spinner-overlay'
import SnackBar from 'react-native-snackbar-dialog'
import DatePicker from '../../ui/Component/DatePicker';

const {width, height} = Dimensions.get('window');

export default class QcCarCreatePager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            editContent: '',
            myCar: '',
            selection: 0,
            carType: '公司车辆',
            useTime: ''
        }
    }

    componentDidMount() {
    }

    requestCar() {
        if (!this.state.useTime) {
            SnackBar.show("必须选择用车日期");
            return
        }
        if (this.state.carType === "私车公用" && !this.state.myCar) {
            SnackBar.show("私车必须填写车牌");
            return
        }
        if (this.state.carType === "其他用车" && !this.state.editContent) {
            SnackBar.show("请在备注填写其他用车方式");
            return
        }
        this.setState({isLoading: true});
        ApiService.requestCar(this.state.editContent, this.state.myCar, this.state.carType, this.state.useTime,this.state.carType==="其他用车"?0:1)
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                if (!responseJson.IsErr) {

                    this.props.nav.goBack(null);
                    this.props.finishFunc();
                    SnackBar.show("申请车牌成功，等待助理分配");
                } else {
                    SnackBar.show(responseJson.ErrDesc);
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            }).done();
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>
                <Toolbar
                    elevation={0}
                    title={["车辆申请"]}
                    color={Color.colorIndigo}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                    ]}/>
                <KeyboardAvoidingView behavior='position'>
                    <ScrollView>
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
                                <Image style={{alignContent: 'center'}}
                                       source={require('../../drawable/car_gray.png')}/>
                            </View>
                            <View style={{
                                width: width - 32,
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 16
                            }}>
                                <Text style={{color: Color.black_semi_transparent, fontSize: 18}}>车辆申请</Text>
                                <Text>外出车辆申请审核后才可以用车</Text>
                                <View style={{
                                    backgroundColor: Color.line,
                                    justifyContent: 'center',
                                    marginTop: 16,
                                    width:width/3
                                }}>
                                    <DatePicker
                                        customStyles={{
                                            placeholderText: {color: 'black', textAlign: 'center',width:width/3},
                                            dateText: {color: 'black', textAlign: 'center',width:width/3}
                                        }}
                                        date={this.state.useTime}
                                        mode="date"
                                        placeholder="用车日期"
                                        format="YYYY-MM-DD"
                                        confirmBtnText="确认"
                                        cancelBtnText="取消"
                                        showIcon={true}
                                        onDateChange={(date) => {
                                            this.setState({useTime: date});
                                        }}
                                    /></View>

                            </View>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: "space-around",
                                marginTop: 16
                            }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({selection: 0, carType: "公司车辆"})
                                }}>
                                    <Text>公司车辆</Text>
                                    <View style={[styles.selection, {
                                        backgroundColor: this.state.selection === 0 ? Color.colorAccent : Color.line,
                                    }]}/>
                                </TouchableOpacity>
                                <View style={{backgroundColor: Color.line, width: 1, height: 25}}/>
                                <TouchableOpacity onPress={() => {
                                    this.setState({selection: 1, carType: "私车公用"})
                                }}>
                                    <Text>私车公用</Text>
                                    <View style={[styles.selection, {
                                        backgroundColor: this.state.selection === 1 ? Color.colorAccent : Color.line,
                                    }]}/>
                                </TouchableOpacity>
                                <View style={{backgroundColor: Color.line, width: 1, height: 25}}/>

                                <TouchableOpacity onPress={() => {
                                    this.setState({selection: 2, carType: "其他用车"})
                                }}>
                                    <Text>其他用车</Text>
                                    <View style={[styles.selection, {
                                        backgroundColor: this.state.selection === 2 ? Color.colorAccent : Color.line,
                                    }]}/>
                                </TouchableOpacity>
                            </View>
                            {
                                (() => {
                                    if (!this.state.isCarExist && this.state.selection === 1)
                                        return <View style={{margin: 16}}>
                                            <Text style={{color: Color.colorAccent,}}>私车车牌</Text>
                                            <TextInput style={styles.textInput}
                                                       placeholder="请输入私车车牌"
                                                       returnKeyType={'done'}
                                                       blurOnSubmit={true}
                                                       underlineColorAndroid="transparent"
                                                       onChangeText={(text) => this.setState({myCar: text})}/>
                                        </View>

                                })()
                            }
                            {
                                (() => {
                                    if (!this.state.isCarExist)
                                        return <View style={{margin: 16}}>
                                            <Text style={{color: Color.colorAccent,}}>备注</Text>
                                            <TextInput style={styles.textInput}
                                                       placeholder="请填写备注"
                                                       returnKeyType={'done'}
                                                       blurOnSubmit={true}
                                                       underlineColorAndroid="transparent"
                                                       onChangeText={(text) => this.setState({editContent: text})}/>
                                        </View>
                                })()
                            }

                            <TouchableOpacity onPress={() => this.requestCar()}>
                                <View style={styles.button}>
                                    <Text
                                        style={{color: 'white'}}>我要车!</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Loading visible={this.state.isLoading}/>

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
    textInput: {
        width: width - 32,
        marginRight: 10,
        borderColor: Color.colorAccent,
        borderBottomWidth: 1,
    },

    selection: {
        width: 55,
        height: 5,
        marginTop: 16,
        marginBottom: 16
    }
});
