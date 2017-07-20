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
    TextInput,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import SnackBar from 'react-native-snackbar-dialog'
import ApiService from '../network/ApiService';
import {NavigationActions,} from 'react-navigation';
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
            SnackBar.show('请填写完整信息');
        } else if (this.state.newPwd !== this.state.confirmPwd) {
            SnackBar.show('两次密码不一样');
        } else if (this.state.newPwd.length < 3) {
            SnackBar.show('密码不能太短')
        } else {

            Alert.alert(
                '修改密码',
                '是否修改密码？',
                [
                    {
                        text: '取消', onPress: () => {
                    }
                    },
                    {
                        text: '确定', onPress: () => {
                        this.setState({isLoading: true});
                        ApiService.setPassword(this.state.oldPwd, this.state.confirmPwd)
                            .then((responseJson) => {
                                    //
                                    if (!responseJson.IsErr) {
                                        SnackBar.show('修改成功');
                                        const resetAction = NavigationActions.reset({
                                            index: 0,
                                            actions: [
                                                NavigationActions.navigate({routeName: 'login'})
                                            ]
                                        });
                                        this.props.nav.dispatch(resetAction)
                                    } else {
                                        SnackBar.show(responseJson.ErrDesc)
                                        setTimeout(() => {
                                            this.setState({isLoading: false})
                                        }, 100);
                                    }
                                }
                            )
                            .catch((error) => {
                                console.log(error);
                                SnackBar.show("出错了，请稍后再试");
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                            }).done();

                    }
                    },
                ]
            )
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
                             () => this.props.nav.goBack(null),
                             () => this._password()
                         ]}/>

                <KeyboardAvoidingView behavior='position'>
                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>

                        <View style={{backgroundColor: Color.background, flexDirection: 'column', margin: 16}}>
                            <Text style={{color: Color.colorPrimary, marginTop: 16}}>旧密码</Text>
                                <TextInput style={styles.textInput}
                                           placeholder="请输入密码"
                                           secureTextEntry={true}
                                           returnKeyType={'done'}
                                           blurOnSubmit={true}
                                           underlineColorAndroid="transparent"
                                           onChangeText={(text) => this.setState({oldPwd: text})}/>
                            <Text style={{color: Color.colorPrimary, marginTop: 16}}>新密码</Text>

                                <TextInput style={styles.textInput}
                                           placeholder="请输入密码"
                                           secureTextEntry={true}
                                           returnKeyType={'done'}
                                           blurOnSubmit={true}
                                           underlineColorAndroid="transparent"
                                           onChangeText={(text) => this.setState({newPwd: text})}/>
                            <Text style={{color: Color.colorPrimary, marginTop: 16}}>确认密码</Text>
                                <TextInput style={styles.textInput}
                                           placeholder="请输入密码"
                                           secureTextEntry={true}
                                           returnKeyType={'done'}
                                           blurOnSubmit={true}
                                           underlineColorAndroid="transparent"
                                           onChangeText={(text) => this.setState({confirmPwd: text})}/>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <Loading visible={this.state.isLoading}/>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    textInput: {
        width: width-32,
        height: 65,
        marginRight: 10,
        borderColor: Color.line,
        borderBottomWidth: 1,
    },

});