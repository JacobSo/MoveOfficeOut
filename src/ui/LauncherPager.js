/**
 * Created by Administrator on 2017/3/13.
 *
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,Platform,
    TouchableOpacity, Image,
} from 'react-native';
import {TABLE_PIC, TABLE_Q_S, TABLE_Q_S_PRODUCT, TABLE_Q_S_DRAFT, TABLE_W_D_P, TABLE_W_D_Q} from "./../db/DBConst";
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Toast from 'react-native-root-toast';
import App from '../constant/Application';
import SQLite from '../db/Sqlite';
let sqLite = new SQLite();
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class LauncherPager extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this._bindPush();

        //  sqLite.drop(TABLE_Q_S_DRAFT);
       // sqLite.drop(TABLE_Q_S_DRAFT);
      //  sqLite.drop(TABLE_Q_S_PRODUCT);
        //    sqLite.drop(TABLE_W_D);
        //    sqLite.drop(TABLE_W_D_P);
        //  sqLite.drop(TABLE_PIC);
        //    sqLite.drop(TABLE_W_D_Q);
        //     sqLite.createWdTable();
    }

    _bindPush() {
        if (Platform.OS === 'ios')
            IosModule.bindPushAccount(App.account);
        else
            AndroidModule.bindPushAccount(App.account);
    }
    componentWillUnmount() {
       // sqLite.close();
    }

    render() {
        return (
            <View style={{
                backgroundColor: Color.background,
                height: height,
            }}>

                <Toolbar
                    elevation={2}
                    title={["供应链管理", App.account + "-" + App.workType]}
                    color={Color.colorPrimary}
                    isHomeUp={false}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../drawable/setting.png")]}
                    functionArray={[
                        () => {
                        }
                        , () => {
                            this.props.nav.navigate('preferences')
                        }]}
                />
                <Text style={styles.group}>外协工作</Text>
                <View style={styles.iconContainer}>
                <TouchableOpacity  style={{alignItems:'center'}} onPress={() => {
                    this.props.nav.navigate('main')
                }}>
                    <Image style={{width: 55, height: 55}} resizeMode="contain"
                           source={ require('../drawable/ic_launcher_cyan.png')}/>
                    <Text>外出工作</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:'center'}} onPress={() => {
                  this.props.nav.navigate('wpMain');
                }}>
                    <Image style={{width: 55, height: 55}} resizeMode="contain"
                           source={ require('../drawable/ic_launcher_purple.png')}/>
                    <Text>评审单</Text>
                </TouchableOpacity>
                </View>

                <Text style={styles.group}>其他部门工作</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity  style={{alignItems:'center'}} onPress={() => {
                        this.props.nav.navigate('qcMain');
                    }}>
                        <Image style={{width: 55, height: 55}} resizeMode="contain"
                               source={ require('../drawable/ic_launcher_indigo.png')}/>
                        <Text>常规质检</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={{alignItems:'center'}} onPress={() => {
                        this.props.nav.navigate('wdMain');
                    }}>
                        <Image style={{width: 55, height: 55}} resizeMode="contain"
                               source={ require('../drawable/ic_launcher_orange_deep.png')}/>
                        <Text>板木/软体研发</Text>
                    </TouchableOpacity>

                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    group: {
        margin: 16,
        color: Color.colorPrimary
    },
    iconContainer: {
        padding: 16,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: width,
    },

});
