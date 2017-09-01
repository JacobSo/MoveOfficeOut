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
    StyleSheet, TouchableOpacity
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import SnackBar from 'react-native-snackbar-dialog'
import {NavigationActions,} from 'react-navigation';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class AsSignFormPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isDetail:false,
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
                             }
                         ]}/>

                <KeyboardAvoidingView behavior='position'>
                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>
                        <View style={{backgroundColor: Color.background, flexDirection: 'column', }}>

                            <TouchableOpacity style={styles.card}>
                                <View style={{flexDirection:'row',        alignItems: "center",}}>
                                <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                <Text style={{marginLeft: 16}}>异常类别</Text>
                                </View>
                                <Image source={require("../../drawable/arrow.png")} style={{width:10,height:20,marginRight:10}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card} onPress={()=>{}}>
                                <View style={{flexDirection:'row',        alignItems: "center",}}>
                                    <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                    <Text style={{marginLeft: 16}}>责任判定日期</Text>
                                </View>
                                <Image source={require("../../drawable/arrow.png")} style={{width:10,height:20,marginRight:10}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card}>
                                <View style={{flexDirection:'row',        alignItems: "center",}}>
                                    <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                    <Text style={{marginLeft: 16}}>违约处罚</Text>
                                </View>
                                <Image source={require("../../drawable/arrow.png")} style={{width:10,height:20,marginRight:10}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card}>
                                <View style={{flexDirection:'row',        alignItems: "center",}}>
                                    <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                    <Text style={{marginLeft: 16}}>异常原因</Text>
                                </View>
                                <Image source={require("../../drawable/arrow.png")} style={{width:10,height:20,marginRight:10}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card}>
                                <View style={{flexDirection:'row',        alignItems: "center",}}>
                                    <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                    <Text style={{marginLeft: 16}}>责任单位</Text>
                                </View>
                                <Image source={require("../../drawable/arrow.png")} style={{width:10,height:20,marginRight:10}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card}>
                                <View style={{flexDirection:'row',        alignItems: "center",}}>
                                    <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                    <Text style={{marginLeft: 16}}>异常产生责任方</Text>
                                </View>
                                <Image source={require("../../drawable/arrow.png")} style={{width:10,height:20,marginRight:10}}/>
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
    card: {
        flexDirection: "row",
        height: 55,
        alignItems: "center",
        justifyContent:"space-between",
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

});