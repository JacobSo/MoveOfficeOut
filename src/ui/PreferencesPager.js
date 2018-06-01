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
                                ['此版本更新记录', 'v10'],
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
                                v11:{'\n'}
                                1.【板木/软体研发】新增搜索历史评审，方便打印以往报告{'\n'}
                                2.【板木/软体研发】解除完成所有产品才能提交的限定，改为警告提醒{'\n'}{'\n'}
                                v10:{'\n'}
                                1.【全局】新增申请车辆模块{'\n'}
                                2.【外出】申请车辆流程整合新模块{'\n'}
                                v9:{'\n'}
                                1.【全局】ios禁用首页更新提示{'\n'}
                                v8:{'\n'}
                                1.【售后】评分更新{'\n'}
                                v7:{'\n'}
                                1.【日程】监督人分页管理{'\n'}
                                2.【日程】监督人/审核人增加建单协助功能{'\n'}
                                3.【日程】人员管理增加颜色区分和搜索功能{'\n'}
                                4.【日程】统计页面增加协助数，相关选项高亮{'\n'}
                                5.【日程】页面显示优化{'\n'}
                                v6:{'\n'}
                                1.1【日程】项目管理人日程工作上线{'\n'}
                                1.2:-
                                1.3:修复苹果手机上传本地图片bug
                                1.4：修复苹果手机拍照上传bug
                                v5:{'\n'}
                                1.【全局】修复标题宽度{'\n'}
                                2.【售后】更改开发专员查看详细页面，增加图片显示格式{'\n'}
                                v4:{'\n'}
                                1.【售后】创建新增图片，各流程增加图片显示{'\n'}
                                v3:{'\n'}
                                1.【售后】新增最终驳回{'\n'}
                                2.【售后】新增厂商简称{'\n'}
                                3.【售后】修复创建单bug{'\n'}
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