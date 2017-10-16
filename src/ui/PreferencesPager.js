/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Alert, Dimensions,
    Platform,
    Text,
    StyleSheet,
    Linking, TouchableOpacity

} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import PreferencesTextItem from './Component/PreferencesTextItem'
import App from '../constant/Application';
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'
import {NavigationActions} from "react-navigation";
import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';
import SQLite from '../db/Sqlite';
import {TABLE_W_D, TABLE_W_D_P} from "../db/DBConst";
import SnackBar from 'react-native-snackbar-dialog'
import UpdateService from "../network/UpdateService";
let sqLite = new SQLite();
const {width, height} = Dimensions.get('window');
import {ImageCache,} from "react-native-img-cache";

export default class PreferencesPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            version: this._getVersion(),
            department: ''
        };
    }

    componentDidMount() {
        console.log(JSON.stringify(App.dptList));
        let array = '';
        App.dptList.map((x, index) => {
            array = array + App.dptList[index].dptname + '，'
        });
        this.setState({department: array.substring(0, array.length - 1)})
    }

    _getVersion() {
        if (Platform.OS === 'ios') {
            IosModule.getVersionName((str) => {
                this.setState({version: str})
            })
        } else {
            AndroidModule.getVersionName((str) => this.setState({version: str}));
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar title={['设置']}
                         color={Color.colorPrimary}
                         elevation={2}
                         isHomeUp={true}
                         isAction={false}
                         isActionByText={false}
                         actionArray={[]}
                         functionArray={[() => this.props.nav.goBack(null)]}/>
                <ScrollView>
                    <View>
                        <PreferencesTextItem
                            group="常规"
                            items={[
                                [App.account, '注销登录'],
                                [App.workType, this.state.department],
                                ['修改密码', '点击修改密码'],
                            ]}
                            functions={[
                                () => {
                                    Alert.alert(
                                        '注销',
                                        '注销当前账号，返回登录页面',
                                        [
                                            {
                                                text: '取消', onPress: () => {
                                            }
                                            },
                                            {
                                                text: '确定', onPress: () => {
                                                sqLite.clearTable(TABLE_W_D);
                                                sqLite.clearTable(TABLE_W_D_P);
                                                if (Platform.OS === 'ios') {
                                                    IosModule.unbindPushAccount('');
                                                }
                                                else {
                                                    AndroidModule.unbindPushAccount();
                                                }

                                                App.saveAccount('', '', '', '', false);
                                                const resetAction = NavigationActions.reset({
                                                    index: 0,
                                                    actions: [
                                                        NavigationActions.navigate({routeName: 'login'})
                                                    ]
                                                });
                                                this.props.nav.dispatch(resetAction)
                                            }
                                            },
                                        ]
                                    )
                                },
                                () => {
                                },
                                () => this.props.nav.navigate('password'),
                            ]}/>
                        <PreferencesTextItem
                            group="应用"
                            items={[
                                ['清理图片缓存', '所有图片将重新下载'],
                                ['检查更新', '当前版本：' + this.state.version],
                                ['此版本更新记录', 'v15'],
                                ['手动更新', 'http://pgyer.com/lsout']
                            ]}
                            functions={[
                                () => {
                                    ImageCache.get().clear();
                                    SnackBar.show("清理成功")

                                },
                                () => UpdateService.update(true),
                                () => {
                                    this.popupDialog.show();
                                },
                                () => {
                                    Linking.openURL('http://pgyer.com/lsout');
                                }]}/>
                    </View>
                </ScrollView>

                <PopupDialog
                    ref={(popupDialog) => {
                        this.popupDialog = popupDialog;
                    }}
                    width={width - 32}
                    height={height - 200}>
                    <View style={styles.layoutContainer}>
                        <Text style={styles.titleStyle}>{"版本" + this.state.version + "更新记录"}</Text>
                        <ScrollView>
                            <Text style={{margin: 16}}>
                                v15:{'\n'}
                                1.【全局】更换职位功能判断{'\n'}
                                2.【售后工作】新增售后负责人功能{'\n'}
                                3.【售后工作】加入单据驳回功能{'\n'}
                                4.【售后工作】修改售后专员提交单据的必要条件{'\n'}
                                5.【售后工作】增加上传图片{'\n'}
                                5.【常规质检】修复申请车辆选择时间问题{'\n'}{'\n'}
                                v14:{'\n'}
                                1.【售后工作】更新创建责任单类型信息{'\n'}
                                2.【售后工作】搜索产品加入关键词长度为2的要求{'\n'}
                                3.【全局】更新超时时间30秒{'\n'}
                                v13:{'\n'}
                                1.【售后工作】修改创建责任单{'\n'}
                                v12:{'\n'}
                                1.【售后工作】修改产品描述{'\n'}
                                v11:{'\n'}
                                1.【售后工作】更换异常产品数据{'\n'}
                                2.【售后工作】新增售后罚款，罚款更换数字输入{'\n'}
                                v10:{'\n'}
                                1.【售后工作】建单必填项-1{'\n'}
                                v9:{'\n'}
                                1.【售后工作】新增售后模块{'\n'}
                                v8:{'\n'}
                                1.【常规质检】加入分配时间，同步时间{'\n'}
                                v7:{'\n'}
                                1.【板木/软体】修复阶段Filter进入详细页面bug{'\n'}
                                v6:{'\n'}
                                1.加入清理图片缓存{'\n'}
                                v5:{'\n'}
                                1.【板木/软体】:修复提交图片bug{'\n'}
                                v4:{'\n'}
                                1.【常规质检】:修复提交后bug{'\n'}
                                v3:{'\n'}
                                1.【常规质检】:更改批量质检方式{'\n'}
                                2.【常规质检】:新增车辆申请{'\n'}
                                3.【板木/软体】:修复android端图片保存{'\n'}
                                v1-v2:{'\n'}
                                1.评审单模块launch{'\n'}
                                2.板木/软体评审模块launch{'\n'}
                                3.质检模块launch{'\n'}
                                4.修复距离问题{'\n'}
                            </Text>

                        </ScrollView>
                        <View style={{width: width - 64, flexDirection: "row-reverse", marginBottom: 16,marginTop:16}}>
                            <TouchableOpacity onPress={() => this.popupDialog.dismiss()}>
                                <Text style={{color: Color.colorPrimary}}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </PopupDialog>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    layoutContainer: {
        width: width - 32,
        flexDirection: 'column',
        height: height - 200,
        backgroundColor: 'white'
    },

    titleStyle: {
        fontSize: 18,
        marginLeft: 16,
        marginTop: 16,
        marginBottom: 16,
        color: Color.black_semi_transparent
    },

});