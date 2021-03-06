/**
 *
 ┌────────────┬───────────────────────────────────────┐
 │Android       │ Deployment Key                        │http://lsprt.lsmuyprt.com:3000/
 http://scmprt.linshimuye.com:3000/
 ├────────────┼───────────────────────────────────────┤
 │ Production │ aog3ykblDmfD2uXhx2MJkMrN7dOF4ksvOXqog │
 ├────────────┼───────────────────────────────────────┤
 │ Staging    │ SR2gZyeSVx40Hz1mqqmNXavBWi3t4ksvOXqog │
 └────────────┴───────────────────────────────────────┘
 ┌────────────┬───────────────────────────────────────┐
 │ ios       │ Deployment Key                        │
 ├────────────┼───────────────────────────────────────┤
 │ Production │ rUSnlAlD495AqyWnBLYII84EgW1E4ksvOXqog │
 ├────────────┼───────────────────────────────────────┤
 │ Staging    │ pR2gglUY1v54U6zgJnjM7ADBbHVl4ksvOXqog │
 └────────────┴───────────────────────────────────────┘

 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text, Platform,
    TouchableOpacity, Image, ScrollView
} from 'react-native';
import {TABLE_PIC, TABLE_Q_S, TABLE_Q_S_PRODUCT, TABLE_Q_S_DRAFT, TABLE_W_D_P, TABLE_W_D_Q} from "./../db/DBConst";
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import App from '../constant/Application';
import ApiService from '../network/SwApiService';
import SQLite from '../db/Sqlite';
import codePush from 'react-native-code-push'
import SnackBar from 'react-native-snackbar-dialog'
import UpdateService from "../network/UpdateService";
import Loading from 'react-native-loading-spinner-overlay';
let sqLite = new SQLite();
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const code_push_production_key_android = "aog3ykblDmfD2uXhx2MJkMrN7dOF4ksvOXqog";
const code_push_production_key_ios = "rUSnlAlD495AqyWnBLYII84EgW1E4ksvOXqog";
export default class LauncherPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }
    /**
     * code-push 热更新
     * 蒲公英更新检查
     * 绑定推送账号
     */
    componentDidMount() {
        this._bindPush();
        UpdateService.update(false);
        codePush.sync({
            updateDialog: {
                appendReleaseDescription: true,
                descriptionPrefix: '\n\n更新内容：\n',
                title: '更新',
                mandatoryUpdateMessage: '',
                mandatoryContinueButtonLabel: '执行更新',
            },
            mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
            deploymentKey: Platform.OS === 'ios' ? code_push_production_key_ios : code_push_production_key_android,
        });
        //    sqLite.drop(TABLE_Q_S_DRAFT);
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

    initScheduleType() {
     //   this.setState({isLoading: true});
        ApiService.initWorkType()
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                 /*   setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);*/
                    if (responseJson.worktypes.indexOf('2') > -1 || responseJson.worktypes.indexOf('1') > -1) {
                        this.props.nav.navigate('swMain', {
                            account: null,
                            memberType: responseJson.worktypes
                        });//0normal/1audit/2check
                    } else {
                        this.props.nav.navigate('swSub', {
                            account: null,
                            memberType: responseJson.worktypes
                        });//0normal/1audit/2check
                    }
                } else {
                  /*  setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);*/
                    SnackBar.show(responseJson.ErrDesc);
                }
            })
            .catch((error) => {
                /*setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);*/
                console.log(error);
                SnackBar.show("权限配置出错，请联系权限分配人员");
            }).done();
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
                <ScrollView>
                    <View style={{marginBottom: 55}}>
                        <Text style={styles.group}>外协工作</Text>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity style={{alignItems: 'center', flex: 1}} onPress={() => {
                        //        if ((App.PowerNum & 1) === 1)
                                    this.props.nav.navigate('main');
                             //  else SnackBar.show("没有权限")
                            }}>
                                <Image style={{width: 55, height: 55}} resizeMode="contain"
                                       source={ require('../drawable/ic_launcher_cyan.png')}/>
                                <Text>外出工作</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{alignItems: 'center', flex: 1}} onPress={() => {
                                if ((App.PowerNum & 2 ) === 2)
                                    this.props.nav.navigate('wpMain');
                                else SnackBar.show("没有权限")
                            }}>
                                <Image style={{width: 55, height: 55}} resizeMode="contain"
                                       source={ require('../drawable/ic_launcher_purple.png')}/>
                                <Text>评审单</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity style={{alignItems: 'center', flex: 1}} onPress={() => {
                                if ((App.PowerNum & 16) === 16)
                                    this.props.nav.navigate('asMain');
                                else SnackBar.show("没有权限")
                            }}>
                                <Image style={{width: 55, height: 55}} resizeMode="contain"
                                       source={ require('../drawable/ic_launcher_amber.png')}/>
                                <Text>售后工作</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{alignItems: 'center', flex: 1}} onPress={() => {
                                    this.props.nav.navigate('cfList');
                            }}>
                                <Image style={{width: 55, height: 55}} resizeMode="contain"
                                       source={ require('../drawable/ic_launcher_blue_grey.png')}/>
                                <Text>车辆申请</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.group}>其他部门工作</Text>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity style={{alignItems: 'center', flex: 1}} onPress={() => {
                                if ((App.PowerNum & 4) === 4)
                                    this.props.nav.navigate('qcMain');
                                else SnackBar.show("没有权限")
                            }}>
                                <Image style={{width: 55, height: 55}} resizeMode="contain"
                                       source={ require('../drawable/ic_launcher_indigo.png')}/>
                                <Text>常规质检</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{alignItems: 'center', flex: 1}} onPress={() => {
                                if ((App.PowerNum & 8) === 8)
                                    this.props.nav.navigate('wdMain');
                                else SnackBar.show("没有权限")
                            }}>
                                <Image style={{width: 55, height: 55}} resizeMode="contain"
                                       source={ require('../drawable/ic_launcher_orange_deep.png')}/>
                                <Text>板木/软体研发</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity style={{alignItems: 'center', flex: 1}} onPress={() => {
                                if ((App.PowerNum & 32) === 32)
                                    this.initScheduleType()
                                else SnackBar.show("没有权限")
                            }}>
                                <Image style={{width: 55, height: 55}} resizeMode="contain"
                                       source={ require('../drawable/ic_launcher_green.png')}/>
                                <Text>跨部门协作</Text>
                            </TouchableOpacity>
                            <View style={{alignItems: 'center', flex: 1}}/>
                        </View>
                        <Loading visible={this.state.isLoading}/>

                    </View>
                </ScrollView>

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
        elevation: 2,
        padding: 16,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: width,
    },
});
