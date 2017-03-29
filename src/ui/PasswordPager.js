/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    TextInput, KeyboardAvoidingView,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';
import ApiService from '../network/ApiService';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class PasswordPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            oldPwd: '',
            newPwd: '',
            confirmPwd: '',
        }
    }

    _password() {
        if (this.state.oldPwd === '' || this.state.newPwd === '' || this.state.confirmPwd === '') {
            Toast.show('请填写完整信息');
        } else if (this.state.newPwd !== this.state.confirmPwd) {
            Toast.show('两次密码不一样');
        } else if (this.state.newPwd.length < 3) {
            Toast.show('密码不能太短')
        } else {
            this.setState({isLoading: !this.state.isLoading});
            ApiService.setPassword(this.state.oldPwd, this.state.confirmPwd)
                .then((responseJson) => {
                        this.setState({isLoading: !this.state.isLoading});
                        if (!responseJson.IsErr) {
                            Toast.show('修改成功');
                            this.props.nav.pop();
                        } else {
                            Toast.show(responseJson.ErrDesc)
                        }
                    }
                ).done();


        }
    }

    render() {
        return (

            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar title={['修改密码']}
                         color={Color.colorPrimary}
                         elevation={2}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={['提交']}
                         functionArray={[
                             () => {
                                 this.props.nav.pop()
                             },
                             () => {

                                 this._password()
                             }]}/>

                <KeyboardAvoidingView behavior='position'>
                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>

                        <View style={{backgroundColor: Color.background, flexDirection: 'column', margin: 16}}>
                            <Text style={{color: Color.colorPrimary, marginTop: 16}}>旧密码</Text>
                            <TextInput style={{width: width, height: 65,}}
                                       placeholder="请输入密码"
                                       secureTextEntry={true}
                                       onChangeText={(text) => this.setState({oldPwd: text})}/>
                            <Text style={{color: Color.colorPrimary, marginTop: 16}}>新密码</Text>
                            <TextInput style={{width: width, height: 65,}}
                                       placeholder="请输入密码"
                                       secureTextEntry={true}
                                       onChangeText={(text) => this.setState({newPwd: text})}/>
                            <Text style={{color: Color.colorPrimary, marginTop: 16}}>确认密码</Text>
                            <TextInput style={{width: width, height: 65,}}
                                       placeholder="请输入密码"
                                       secureTextEntry={true}
                                       onChangeText={(text) => this.setState({confirmPwd: text})}/>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <Loading visible={this.state.isLoading}/>
            </View>

        )
    }
}
