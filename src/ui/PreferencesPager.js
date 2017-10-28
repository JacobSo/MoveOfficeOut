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
                                ['此版本更新记录', 'v3'],
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
                                v3:{'\n'}
                                1.【售后】新增最终驳回{'\n'}{'\n'}
                                v2:{'\n'}
                                1.【全局】更新测试{'\n'}
                                v1:{'\n'}
                                1.【全局】更换更新服务器，新增对话框提示更新{'\n'}
                                2.【全局】android同步ios版本号（2.x->7.x）{'\n'}
                                3.【评审单】板木新增选择评审人{'\n'}
                                4.【全局】优化定位获取,android端开启循环定位，3s循环,ios端开启高功耗定位，20s超时，3s循环{'\n'}
                                5.【售后工作】一大堆更新{'\n'}
                                6.【全局】更新Android端蒲公英更新方式{'\n'}
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