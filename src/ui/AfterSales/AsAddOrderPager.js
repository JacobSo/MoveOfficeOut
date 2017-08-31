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
            select: [true, false, false],
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
                         actionArray={[]}
                         functionArray={[
                             () => this.props.nav.goBack(null),
                         ]}/>

                <KeyboardAvoidingView behavior='position'>
                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            height:55,
                            backgroundColor: 'white',
                            margin:16,
                            elevation: 2
                        }}>
                            <TouchableOpacity
                                style={[styles.stepButton, {backgroundColor: (this.state.select[0] ? Color.colorAmber : Color.trans)},]}
                                onPress={() => this.setState({select: [true,false,false]})
                                }>
                                <Text style={{
                                    textAlign: "center",
                                    color:this.state.select[0]?"white":"black"
                                }}>成品</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.stepButton, {backgroundColor: (this.state.select[1] ? Color.colorAmber : Color.trans)},]}
                                onPress={() => this.setState({select: [false,true,false]})
                                }>
                                <Text style={{ textAlign: "center",color:this.state.select[1]?"white":"black"}}>材料</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.stepButton, {backgroundColor: (this.state.select[2] ? Color.colorAmber : Color.trans)},]}
                                onPress={() => this.setState({select: [false,false,true]})}>
                                <Text style={{ textAlign: "center",color:this.state.select[2]?"white":"black"}}>其他</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            height:55,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            margin:16,
                            elevation: 2,
                        }}>
                            <Text style={{marginLeft:16}}>客户与售后专员</Text>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            height:100,
                            backgroundColor: 'white',
                            margin:16,
                            elevation: 2
                        }}>
                            <TextInput style={styles.textInput}
                                       multiline={true}
                                       defaultValue={this.state.WorkContent}
                                       placeholder="异常描述"
                                       returnKeyType={'done'}
                                       underlineColorAndroid="transparent"
                                       blurOnSubmit={true}
                                       onChangeText={(text) => this.setState({WorkContent: text})}/>
                        </View>
                        <TouchableOpacity onPress={() => {}}>
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
        justifyContent: 'center'
    },
    textInput: {
        width: width-64,
        height: 65,
        marginRight: 10,
    },
    stepButton: {
        flex: 1,
        justifyContent: "center",

    },

});