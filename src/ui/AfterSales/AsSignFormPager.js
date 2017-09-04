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
            exDate: "",
            exType: "",
            exDepartment: "",
            exCause: '',
            exResponse: "",
            exReason: ""
        }
    }


    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar title={['责任单填写']}
                         color={Color.colorAmber}
                         elevation={2}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={['完成']}
                         functionArray={[
                             () => this.props.nav.goBack(null),
                             () => {
                                 if (this.state.exDate && this.state.exType && this.state.exDepartment && this.state.exReason) {
                                     this.props.finishFunc(this.state);
                                     this.props.nav.goBack(null);
                                 } else SnackBar.show('填写不完整');

                             }
                         ]}/>

                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-55}>
                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>
                        <View style={{backgroundColor: Color.background, flexDirection: 'column', paddingBottom: 80}}>
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
                            <TouchableOpacity style={styles.card} onPress={() => {
                                this.props.nav.navigate('asParam', {
                                    mode: 1,
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
                                    <Text style={{marginLeft: 16, color: Color.content}}>异常类别</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <Text>{this.state.exType}</Text>
                                    <Image source={require("../../drawable/arrow.png")}
                                           style={{width: 10, height: 20, marginRight: 10, marginLeft: 10}}/>
                                </View>
                            </TouchableOpacity>

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
                                onPress={()=>{}}
                            />
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

                            <View style={styles.card}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{
                                        backgroundColor: this.state.exReason ? Color.colorAmber : Color.line,
                                        width: 10,
                                        height: 55
                                    }}/>
                                    <Text style={{marginLeft: 16, color: Color.content}}>异常原因</Text>
                                </View>
                                {/*<Image source={require("../../drawable/arrow.png")} style={{width:10,height:20,marginRight:10}}/>*/}
                            </View>


                            <View style={{marginLeft: 16, marginRight: 16, backgroundColor: 'white',marginBottom:55}}>
                                <TextInput style={[styles.textInput, {paddingLeft: 16}]}
                                           multiline={true}
                                           defaultValue={this.state.exReason}
                                           placeholder="在这里填写异常原因"
                                           returnKeyType={'done'}
                                           underlineColorAndroid="transparent"
                                           blurOnSubmit={true}
                                           onChangeText={(text) => this.setState({exReason: text})}/>

                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Loading visible={this.state.isLoading}/>
            </View>
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
    }

});