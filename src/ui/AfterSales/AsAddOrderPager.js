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
    StyleSheet, TouchableOpacity
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import SnackBar from 'react-native-snackbar-dialog'
import {NavigationActions,} from 'react-navigation';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class AsAddOrderPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            select: [false, false, false],
            isLoading: false,
        }
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
                         actionArray={['提交']}
                         functionArray={[
                             () => this.props.nav.goBack(null),
                             () =>{}
                         ]}/>

                <KeyboardAvoidingView behavior='position'>
                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            position: 'absolute',
                            bottom: Platform.OS === 'android' ? 25 : 0,
                            backgroundColor: 'white',
                            elevation: 2
                        }}>
                            <TouchableOpacity
                                style={[styles.stepButton, {backgroundColor: (this.state.select[0] ? Color.colorPurple : Color.line)},]}
                                onPress={() => {
                                    this.state.select[0] = !this.state.select[0];
                                    this.setState({select: this.state.select})
                                }}>
                                <Text style={{
                                    color: "white",
                                    textAlign: "center"
                                }}>{this.props.isWood ? '白胚' : '木架'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.stepButton, {backgroundColor: (this.state.select[1] ? Color.colorPurple : Color.line)},]}
                                onPress={() => {
                                    this.state.select[1] = !this.state.select[1];
                                    this.setState({select: this.state.select})
                                } }>
                                <Text style={{color: "white", textAlign: "center"}}>成品</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.stepButton, {backgroundColor: (this.state.select[2] ? Color.colorPurple : Color.line)},]}
                                onPress={() => {
                                    this.state.select[2] = !this.state.select[2];
                                    this.setState({select: this.state.select})
                                }}>
                                <Text style={{color: "white", textAlign: "center"}}>包装</Text>
                            </TouchableOpacity>
                        </View>
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