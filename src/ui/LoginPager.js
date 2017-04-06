/**
 * Created by Administrator on 2017/3/13.
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
    KeyboardAvoidingView, ScrollView,
} from 'react-native';

import Loading from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';
import ApiService from '../network/ApiService';
import Color from '../constant/Color';
import App from '../constant/Application';
import {NavigationActions,} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default class LoginPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            pwd: '',
            isLoading: false,
            check: false,
        };
    }


    componentDidMount() {
        //    console.log(JSON.stringify(newProps) + '-------------------------')
        InteractionManager.runAfterInteractions(() => {
            this._autoLogin()
        });

    }

    _toMain() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'main'})
            ]
        });
        this.props.nav.dispatch(resetAction)
    }

    _autoLogin() {
        App.initAccount(() => {
            if (App.check && App.session !== '' && App.account !== '' && App.workType !== '' && App.department !== '') {
                this._toMain();
            }
        });
    }

    _login() {
        if (this.state.account.length === 0 || this.state.pwd.length === 0) {
            Toast.show("信息不能为空");
            return
        }
        this.setState({isLoading: true});
        ApiService.loginFuc(this.state.account, this.state.pwd)
            .then((responseJson) => {
                //  console.log(responseJson);

                if (!responseJson.IsErr) {
                    //  Toast.show('登录成功');
                    App.saveAccount(
                        App.session = responseJson.uniqueIdentifier,
                        App.account = responseJson.UserName,
                        App.department = responseJson.DptName,
                        App.workType = responseJson.WorkType,
                        this.state.check);

                    this._toMain();
                } else {
                    Toast.show(responseJson.ErrDesc, {});
                }
            }).done(this.setState({isLoading: false}));
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={'padding'}>
                <ScrollView>

                    <View style={styles.container}>
                        <View style={{width: width, alignItems: 'flex-start'}}>
                            <Image style={styles.logo}
                                   source={require('../drawable/logo_white.png')}/></View>
                        <Text style={styles.welcome}>外协工作记录</Text>
                        <View style={{backgroundColor: 'white', width: width / 4, height: 2,}}/>
                        <Text style={{width: width, textAlign: 'center', color: 'white', fontSize: 18, margin: 16}}>
                            登录
                        </Text>


                        <View style={{marginLeft: 16, marginRight: 16, backgroundColor: 'white',}}>
                            <Text style={{color: Color.colorPrimary, marginLeft: 10, marginTop: 10}}>账号</Text>

                            <TextInput style={{width: width - 32, height: 65, marginLeft: 10, marginRight: 10}}
                                       placeholder="请输入登录账号"
                                       onChangeText={(text) => this.setState({account: text})}/>
                            <Text style={{color: Color.colorPrimary, marginLeft: 10, marginTop: 10,}}>密码</Text>
                            <TextInput style={{width: width - 32, height: 65, marginLeft: 10, marginRight: 10}}
                                       placeholder="请输入密码"
                                       secureTextEntry={true}
                                       onChangeText={(text) => this.setState({pwd: text})}/>
{/*

                            <CheckBox
                                style={{padding: 10}}
                                isChecked={this.state.check}
                                onClick={() => this.setState({check: !this.state.check})}
                                rightText={'自动登录'}/>
*/}

                        </View>

                        <View style={{backgroundColor: 'white', padding: 16}}>
                            <TouchableOpacity onPress={() => this._login(this.state.account, this.state.pwd)}>
                                <View style={styles.button}>
                                    <Text style={{color: 'white'}}>登录</Text>
                                </View></TouchableOpacity></View>
                        <Loading visible={this.state.isLoading}/>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Color.colorPrimary,
        justifyContent: 'flex-start',
        height: height,
    },
    logo: {
        width: 100,
        height: 45,
        margin: 16
    },

    welcome: {
        width: width,
        fontSize: 25,
        textAlign: 'center',
        margin: 10,
        color: 'white'
    },
    button: {
        width: width - 44,
        height: 55,
        backgroundColor: Color.colorPrimary,
        alignItems: 'center',
        justifyContent: 'center'
    }

});
