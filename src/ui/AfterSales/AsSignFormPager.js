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
const carList = ["材料供应商", "成品供应商"];

export default class AsSignFormPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isDetail: false,
            isResponse: false,
            exDate: this.props.formData ? this.props.formData.exDate : "",
            exType: this.props.formData ? this.props.formData.exType : "",
            exDepartment: this.props.formData ? this.props.formData.exDepartment : "",
            exCause: this.props.formData ? this.props.formData.exCause : "",
            exResponse: this.props.formData ? this.props.formData.exResponse : "",
            exReason: this.props.formData ? this.props.formData.exReason : "",
            exPrice: this.props.formData ? this.props.formData.exPrice : "",
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
                                        backgroundColor: this.state.exDate ? Color.colorAmber : Color.line,
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
                                        date={this.state.exDate}
                                        mode="date"
                                        placeholder="请选择时间"
                                        format="YYYY-MM-DD"
                                        minDate={this.dateStr}
                                        confirmBtnText="确认"
                                        cancelBtnText="取消"
                                        showIcon={false}
                                        onDateChange={(date) => {
                                            this.setState({exDate: date})
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
                                        this.setState({exType: data})
                                    }
                                })
                            }}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{
                                        backgroundColor: this.state.exType ? Color.colorAmber : Color.line,
                                        width: 10,
                                        height: 55
                                    }}/>
                                    <Text style={{marginLeft: 16, color: Color.content}}>异常类型</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <Text>{this.state.exType}</Text>
                                    <Image source={require("../../drawable/arrow.png")}
                                           style={{width: 10, height: 20, marginRight: 10, marginLeft: 10}}/>
                                </View>
                            </TouchableOpacity>
                            {/*异常原因*/}
                            <TouchableOpacity style={styles.card} onPress={() => {
                                this.props.nav.navigate('asParam', {
                                    mode: 1,
                                    actionFunc: (data) => {
                                        this.setState({exReason: data})
                                    }
                                })
                            }}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{
                                        backgroundColor: this.state.exReason ? Color.colorAmber : Color.line,
                                        width: 10,
                                        height: 55
                                    }}/>
                                    <Text style={{marginLeft: 16, color: Color.content}}>异常原因</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <Text>{this.state.exReason}</Text>
                                    <Image source={require("../../drawable/arrow.png")}
                                           style={{width: 10, height: 20, marginRight: 10, marginLeft: 10}}/>
                                </View>
                            </TouchableOpacity>
                            {/*责任单位*/}
                            <TouchableOpacity style={styles.card} onPress={() => {
                                this.props.nav.navigate('asParam', {
                                    mode: 0,
                                    actionFunc: (data) => {
                                        this.setState({exDepartment: data})
                                    }
                                })
                            }}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{
                                        backgroundColor: this.state.exDepartment ? Color.colorAmber : Color.line,
                                        width: 10,
                                        height: 55
                                    }}/>
                                    <Text style={{marginLeft: 16, color: Color.content}}>责任单位</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <Text>{this.state.exDepartment}</Text>
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
                                    }}>{this.state.isResponse ? "需要处罚" : "不处罚"}</Text>
                                </View>
                                <Switch
                                    style={{marginRight: 16,}}
                                    onValueChange={(value) => {
                                        this.setState({isResponse: value})
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
                                        this.setState({exPrice: data})
                                    }
                                })
                            }}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{
                                        backgroundColor: this.state.exPrice ? Color.colorAmber : Color.line,
                                        width: 10,
                                        height: 55
                                    }}/>
                                    <Text style={{marginLeft: 16, color: Color.content}}>处罚金额</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <Text>{this.state.exPrice}</Text>
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
                                    {label: carList[0], value: 0},
                                    {label: carList[1], value: 1},
                                ]}
                                initial={0}
                                formHorizontal={false}
                                style={styles.radioStyle}
                                onPress={() => {
                                }}
                            />


                            <TouchableOpacity
                                disabled={!(this.state.exDate && this.state.exType && this.state.exDepartment && this.state.exReason && this.state.exPrice)}
                                onPress={() => {
                                    this.props.finishFunc(this.state);
                                    this.props.nav.goBack(null);
                                }}>
                                <View style={[styles.button, {
                                    backgroundColor: (this.state.exDate && this.state.exType && this.state.exDepartment && this.state.exReason && this.state.exPrice) ?
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