/**
 * Created by Administrator on 2017/3/13.
 *
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
    TextInput,
    KeyboardAvoidingView,
    ScrollView, TouchableOpacity, Image, Button,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';
import App from '../constant/Application';
import ApiService from '../network/ApiService';
import StarSeek from "./Component/StarSeek";
import SQLite from '../db/Sqlite';
import {TABLE_PIC, TABLE_W_D, TABLE_W_D_P, TABLE_W_D_Q} from "../db/DBConst";
let sqLite = new SQLite();
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class LauncherPager extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount(){
        sqLite.drop(TABLE_W_D);
        sqLite.drop(TABLE_W_D_P);
        sqLite.drop(TABLE_PIC);
        sqLite.drop(TABLE_W_D_Q);
   //     sqLite.createWdTable();
    }
    componentWillUnmount(){
        sqLite.close();
    }

    render() {
        return (
            <View style={{
                backgroundColor: Color.background,
                height: height,
            }}>

                <Toolbar
                    elevation={2}
                    title={["供应链管理"]}
                    color={Color.colorPrimary}
                    isHomeUp={false}
                    isAction={false}
                    isActionByText={true}
                    actionArray={[]}
                    functionArray={[]}

                />
                <Text style={styles.group}>外协工作</Text>
                <TouchableOpacity onPress={() => {
                    this.props.nav.navigate('main')
                }} style={{width: width, backgroundColor: 'white', height: 55,}}>
                    <Text style={{fontSize:18,height: 55,margin:16}}>外出工作</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                }} style={{width: width, backgroundColor: 'white', height: 55,}}>
                    <Text  style={{fontSize:18,height: 55,margin:16}}>板木评审</Text>
                </TouchableOpacity>

                <Text style={styles.group}>其他部门工作</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => {
                        Toast.show("开发中")
                    }} >
                        <Image style={{width: 55, height: 55}} resizeMode="contain"
                               source={ require('../drawable/ic_launcher_indigo.png')}/>
                        <Text>常规质检</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.nav.navigate('wdMain')
                    }}>
                        <Image style={{width: 55, height: 55}} resizeMode="contain"
                               source={ require('../drawable/ic_launcher_orange_deep.png')}/>
                        <Text>板木研发</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        Toast.show("开发中")
                    }} >
                        <Image style={{width: 55, height: 55}} resizeMode="contain"
                               source={ require('../drawable/ic_launcher_blue_grey.png')}/>
                        <Text>软体研发</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => this.props.nav.navigate('preferences')}  style={styles.button}>
                        <Text style={{color: 'white'}}>设置</Text>
                </TouchableOpacity>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    titleStyle: {
        color: Color.colorPrimary,
        margin: 16,
    },


    textInput: {
        width: width - 32,
        height: 55,
        marginLeft: 16,
        marginRight: 16,
        borderColor: Color.line,
        borderBottomWidth: 1,
    },
    group: {
        margin: 16,
        color: Color.colorPrimary
    },

    mainContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        elevation: 2,
        marginBottom: 32,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10,
        paddingTop: 10
    },

    iconContainer: {
        padding:16,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: width,
    },
    button: {
        width: width - 44,
        height: 45,
        backgroundColor: Color.colorAccent,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
