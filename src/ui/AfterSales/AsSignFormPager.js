/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
    Image,
    KeyboardAvoidingView,
    StyleSheet, TouchableOpacity, TextInput, Switch
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import SnackBar from 'react-native-snackbar-dialog'
import {NavigationActions,} from 'react-navigation';
import DatePicker from "../Component/DatePicker";
import RadioForm from 'react-native-simple-radio-button';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const exList = ["材料供应商", "成品供应商"];

export default class AsSignFormPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isDetail: false,
            isResponse: this.props.formData?this.props.formData.isResponse:false,
            radioValue:this.props.formData?this.props.formData.radioValue:0,
            DutyDate: this.props.formData ? this.props.formData.DutyDate : "",//责任判定时间
            abnormal_type: this.props.formData ? this.props.formData.abnormal_type : "",//异常类型
            duty_to: this.props.formData ? this.props.formData.duty_to : "",//责任单位
            publishment: this.props.formData ? this.props.formData.publishment : "不处罚",//处罚
            publish_to: this.props.formData ? this.props.formData.publish_to : "材料供应商",//产生责任方
            abnormal_reason: this.props.formData ? this.props.formData.abnormal_reason : "",//异常原因
            compensation: this.props.formData ? this.props.formData.compensation : "",//金额
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-55}>
                <View style={{backgroundColor: Color.background, height: height}}>
                    <Toolbar title={['责任单填写']}
                             color={Color.colorAmber}
                             elevation={2}
                             isHomeUp={true}
                             isAction={true}
                             isActionByText={true}
                             actionArray={[]}
                             functionArray={[
                                 () => this.props.nav.goBack(null),
                             ]}/>

                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>
                        <View style={{backgroundColor: Color.background, flexDirection: 'column', paddingBottom: 16}}>
                            <View style={styles.card}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{
                                        backgroundColor: this.state.DutyDate ? Color.colorAmber : Color.line,
                                        width: 10,
                                        height: 55
                                    }}/>
                                    <Text style={{marginLeft: 16, color: Color.content}}>责任判定时间</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: "center"}}>
                                    <DatePicker
                                        customStyles={{
                                            placeholderText: {
                                                color: Color.content,
                                                textAlign: 'center',
                                                width: width / 4
                                            },
                                            dateText: {color: Color.content, textAlign: 'center', width: width / 4}
                                        }}
                                        date={this.state.DutyDate}
                                        mode="date"
                                        placeholder="请选择时间"
                                        format="YYYY-MM-DD"
                                        minDate={this.dateStr}
                                        confirmBtnText="确认"
                                        cancelBtnText="取消"
                                        showIcon={false}
                                        onDateChange={(date) => {
                                            this.setState({DutyDate: date})
                                        }}
                                    />
                                    <Image source={require("../../drawable/arrow.png")}
                                           style={{width: 10, height: 20, marginRight: 10}}/>
                                </View>
                            </View>
                            {/*异常类型*/}
                            <TouchableOpacity style={styles.card} onPress={() => {
                                this.props.nav.navigate('asParam', {
                                    mode: 2,
                                    actionFunc: (data) => {
                                        this.setState({abnormal_type: data})
                                    }
                                })
                            }}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{
                                        backgroundColor: this.state.abnormal_type ? Color.colorAmber : Color.line,
                                        width: 10,
                                        height: 55
                                    }}/>
                                    <Text style={{marginLeft: 16, color: Color.content}}>异常类型</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <Text>{this.state.abnormal_type}</Text>
                                    <Image source={require("../../drawable/arrow.png")}
                                           style={{width: 10, height: 20, marginRight: 10, marginLeft: 10}}/>
                                </View>
                            </TouchableOpacity>
                            {/*异常原因*/}
                            <TouchableOpacity style={styles.card} onPress={() => {
                                this.props.nav.navigate('asParam', {
                                    mode: 1,
                                    actionFunc: (data) => {
                                        this.setState({abnormal_reason: data})
                                    }
                                })
                            }}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{
                                        backgroundColor: this.state.abnormal_reason ? Color.colorAmber : Color.line,
                                        width: 10,
                                        height: 55
                                    }}/>
                                    <Text style={{marginLeft: 16, color: Color.content}}>异常原因</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <Text>{this.state.abnormal_reason}</Text>
                                    <Image source={require("../../drawable/arrow.png")}
                                           style={{width: 10, height: 20, marginRight: 10, marginLeft: 10}}/>
                                </View>
                            </TouchableOpacity>
                            {/*责任单位*/}
                            <TouchableOpacity style={styles.card} onPress={() => {
                                this.props.nav.navigate('asParam', {
                                    mode: 0,
                                    actionFunc: (data) => {
                                        this.setState({duty_to: data})
                                    }
                                })
                            }}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{
                                        backgroundColor: this.state.duty_to ? Color.colorAmber : Color.line,
                                        width: 10,
                                        height: 55
                                    }}/>
                                    <Text style={{marginLeft: 16, color: Color.content}}>责任单位</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <Text>{this.state.duty_to}</Text>
                                    <Image source={require("../../drawable/arrow.png")}
                                           style={{width: 10, height: 20, marginRight: 10, marginLeft: 10}}/>
                                </View>
                            </TouchableOpacity>
                            {/*处罚*/}
                            <View style={styles.card}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{backgroundColor: Color.colorAmber, width: 10, height: 55}}/>
                                    <Text style={{
                                        marginLeft: 16,
                                        color: Color.content
                                    }}>{this.state.publishment }</Text>
                                </View>
                                <Switch
                                    style={{marginRight: 16,}}
                                    onValueChange={(value) => {
                                        this.setState({isResponse:value,
                                            publishment: value?"需要处罚" : "不处罚"})
                                    }}
                                    onTintColor={Color.colorAmber}
                                    tintColor={Color.colorBlueGrey}
                                    thumbTintColor={Color.backgroundColor}
                                    value={this.state.isResponse}/>
                            </View>
                            {/*金额*/}
                            <TouchableOpacity style={styles.card} onPress={() => {
                                this.props.nav.navigate('asParam', {
                                    mode: 3,
                                    actionFunc: (data) => {
                                        this.setState({compensation: data})
                                    }
                                })
                            }}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{
                                        backgroundColor: this.state.compensation ? Color.colorAmber : Color.line,
                                        width: 10,
                                        height: 55
                                    }}/>
                                    <Text style={{marginLeft: 16, color: Color.content}}>处罚金额</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <Text>{this.state.compensation}</Text>
                                    <Image source={require("../../drawable/arrow.png")}
                                           style={{width: 10, height: 20, marginRight: 10, marginLeft: 10}}/>
                                </View>
                            </TouchableOpacity>
                            {/*责任方*/}
                            <TouchableOpacity style={styles.card}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{backgroundColor: Color.colorAmber, width: 10, height: 55}}/>
                                    <Text style={{marginLeft: 16, color: Color.content}}>异常产生责任方</Text>
                                </View>

                                {/*    <Image source={require("../../drawable/arrow.png")} style={{width:10,height:20,marginRight:10}}/>*/}
                            </TouchableOpacity>
                            <RadioForm
                                buttonColor={Color.colorAmber}
                                labelStyle={{color: Color.content, margin: 16}}
                                radio_props={ [
                                    {label: exList[0], value: 0},
                                    {label: exList[1], value: 1},
                                ]}
                                initial={this.state.radioValue}
                                formHorizontal={false}
                                style={styles.radioStyle}
                                onPress={(value) => {
                                    this.setState({
                                        radioValue:value,
                                        publish_to:exList[value]})
                                }}
                            />


                            <TouchableOpacity
                                disabled={!(this.state.DutyDate && this.state.abnormal_type && this.state.duty_to && this.state.abnormal_reason && this.state.compensation)}
                                onPress={() => {
                                    this.props.finishFunc(this.state);
                                    this.props.nav.goBack(null);
                                }}>
                                <View style={[styles.button, {
                                    backgroundColor: (this.state.DutyDate && this.state.abnormal_type && this.state.duty_to && this.state.abnormal_reason && this.state.compensation) ?
                                        Color.colorAmber : Color.line
                                }]}>
                                    <Text style={{color: 'white'}}>{"继续"}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <Loading visible={this.state.isLoading}/>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        height: 55,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        marginLeft: 16,
        marginRight: 16,
        marginTop: 16,
        elevation: 2,
    },
    textInput: {
        width: width - 32,
        height: 65,
        marginRight: 10,
        borderColor: Color.line,
        borderBottomWidth: 1,
    },
    radioStyle: {
        marginLeft: 16,
        marginBottom: 16,
        width: width - 32,
        backgroundColor: 'white',
        paddingTop: 16,
        paddingLeft: 16
    },
    button: {
        marginBottom: 55 + 25,
        width: width - 32,
        height: 55,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2
    },

});