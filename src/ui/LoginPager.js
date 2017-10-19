/**
 * Created by Administrator on 2017/3/13.
 *
 * loading usage
 */
'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    InteractionManager,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import Loading from 'react-native-loading-spinner-overlay';
import ApiService from '../network/ApiService';
import Color from '../constant/Color';
import App from '../constant/Application';
import {NavigationActions,} from 'react-navigation';
import CheckBox from "../ui/Component/CheckBox";
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'
import UpdateService from "../network/UpdateService";
import SnackBar from 'react-native-snackbar-dialog'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class LoginPager extends Component {
    //构造方法
    constructor(props) {
        super(props);//父组件传递的属性
        this.state = {//本页面的状态
            account: '',//崔韵强//孙小伟//李成功//张选国//杨伟军//陈彬
            pwd: '',
            isLoading: false,
            check: false,
        };
    }

//组件挂载完成（生命周期）
    componentDidMount() {
        //    console.log(JSON.stringify(newProps) + '-------------------------')
        UpdateService.update(false);
        this._localLogin();
    }

//导航器-页面跳转
    _launchPager(page) {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: page})
            ]
        });
        this.props.nav.dispatch(resetAction)
    }

//自动登录判断
    _localLogin() {
        App.initAccount(() => {
            if (App.check && App.account !== '' && App.pwd !== '') {
                //   this._launchPager("main");
                this.state.account = App.account;
                this.state.pwd = App.pwd;
                this.state.check = true;
                this._login();
            }
        });
    }

//登录请求
    _login() {
        if (this.state.account.length === 0 || this.state.pwd.length === 0) {
            SnackBar.show("信息不能为空");
            return
        }
        this.setState({isLoading: true});
        ApiService.loginFuc(this.state.account, this.state.pwd)
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    //  SnackBar.show('登录成功');
                    App.saveAccount(
                        App.session = responseJson.uniqueIdentifier,
                        App.account = responseJson.UserName,
                        App.department = responseJson.DptName,
                        App.workType = responseJson.WorkType,
                        this.state.check,
                        App.dptList = responseJson.Dptlist,
                        this.state.pwd,
                        App.jobType = responseJson.JobType + '',
                        App.PowerNum = responseJson.PowerNum + '',
                        App.FirstDptId = responseJson.FirstDptId + ''
                    );
                    if (responseJson.WorkType)
                        this._launchPager("launcher");
                    else SnackBar.show('没有工作类型，无法登陆')
                } else {
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                    SnackBar.show(responseJson.ErrDesc);
                }
            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            })
            .done();
    }

//渲染（生命周期）
    render() {
        // console.log("login:render");
        return (
            <KeyboardAvoidingView behavior={'padding'}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={{width: width,}}>
                            <Image style={styles.logo}
                                   resizeMode="contain"
                                   source={require('../drawable/logo_white.png')}/>
                        </View>
                        <Text style={styles.welcome}>供应链管理</Text>
                        <View style={{backgroundColor: 'white', width: width / 4, height: 2,}}/>
                        <Text style={{color: 'white', fontSize: 18, margin: 16}}>登录</Text>
                        <View style={{marginLeft: 16, marginRight: 16, backgroundColor: 'white',}}>

                            <Text style={styles.textTitle}>账号</Text>
                                <TextInput style={styles.textInput}
                                           placeholder="请输入登录账号"
                                           returnKeyType={'done'}
                                           blurOnSubmit={true}
                                           clearButtonMode={'always'}
                                           underlineColorAndroid="transparent"
                                           onChangeText={(text) => this.setState({account: text})}/>
                            <Text style={styles.textTitle}>密码</Text>
                                <TextInput style={styles.textInput}
                                           placeholder="请输入密码"
                                           secureTextEntry={true}
                                           returnKeyType={'done'}
                                           underlineColorAndroid="transparent"
                                           blurOnSubmit={true}
                                           clearButtonMode={'always'}
                                           onChangeText={(text) => this.setState({pwd: text})}/>
                            <CheckBox
                                style={{padding: 10}}
                                isChecked={this.state.check}
                                onClick={() => this.setState({check: !this.state.check})}
                                rightText={'自动登录'}/>

                            <TouchableOpacity onPress={() => this._login(this.state.account, this.state.pwd)}>
                                <View style={styles.button}>
                                    <Text style={{color: 'white'}}>登录</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Loading visible={this.state.isLoading}/>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        );
    }
}
//样式
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Color.colorPrimary,
        height: height,
    },
    logo: {
        width: 85,
        height: 35,
        margin: 16,
    },

    welcome: {
        fontSize: 25,
        margin: 10,
        color: 'white'
    },
    button: {
        width: width - 44,
        height: 55,
        backgroundColor: Color.colorPrimary,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },

    textTitle: {
        color: Color.colorPrimary,
        marginLeft: 10,
        marginTop: 10,
    },

    textInput: {
        width: width - 32,
        height: 65,
        marginLeft: 10,
        marginRight: 10,
        padding: 0,
        borderBottomWidth: 1,
        borderBottomColor: Color.line
    },
});
