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
    StyleSheet
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import PreferencesTextItem from './Component/PreferencesTextItem'
import App from '../constant/Application';
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'
import {NavigationActions} from "react-navigation";
import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';
const {width, height} = Dimensions.get('window');

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
                                                if (Platform.OS === 'ios') {
                                                    IosModule.unbindPushAccount('');
                                                    IosModule.logoutShareAccount();

                                                }
                                                else {
                                                    AndroidModule.unbindPushAccount();
                                                    AndroidModule.logoutShareAccount();
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
                                ['检查更新', '当前版本：' + this.state.version],
                                ['此版本更新记录', "v3"]
                            ]}
                            functions={[
                                () => {
                                    if (Platform.OS === 'ios') {
                                        IosModule.checkUpdate('');
                                    } else {
                                        AndroidModule.checkUpdate();
                                    }
                                },
                                () => {
                                    this.popupDialog.show();
                                }]}/>
                    </View>
                </ScrollView>

                <PopupDialog
                    ref={(popupDialog) => {
                        this.popupDialog = popupDialog;
                    }}
                    width={width - 32}
                    height={200}>
                    <View style={styles.layoutContainer}>
                        <Text style={styles.titleStyle}>{"版本" + this.state.version + "更新记录"}</Text>
                        <ScrollView>
                            <Text style={styles.contentStyle}>
                                v4:{'\n'}
                                1.助理新增查看审核模块{'\n'}
                                2.增加launcher处理合并多部门app{'\n'}
                                3.关闭供应商填写{'\n'}
                                4.修复工作页面完成时签到提示？
                                5.增加没有定位提示？
                                6.修复删除工作问题？
                                7.签到距离提示？
                                8.签到规则更新？
                            </Text>
                            <Text style={styles.contentStyle}>
                                v3:{'\n'}
                                1.新增车牌选项{'\n'}
                                2.fix bugs{'\n'}
                            </Text>
                            <Text style={styles.contentStyle}>
                                v2:{'\n'}
                                1.修复搜索选择功能{'\n'}
                                2.拆分审核与评分两个功能模块。{'\n'}
                                3.签到状态加颜色区分{'\n'}
                            </Text>
                            <Text style={styles.contentStyle}>
                                v1:{'\n'}
                                1.新增支持板木研发调用{'\n'}
                                2.新增签到功能{'\n'}
                                3.修复供应商/系列列表底部显示问题{'\n'}
                                4.去掉ios通知红标(待验证){'\n'}
                                5.修复填写工作内容显示问题{'\n'}
                                6.新增工作增加编辑和删除功能{'\n'}
                                7.新增工作是走访类型时限制供应商数量唯一{'\n'}
                            </Text>
                        </ScrollView>
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
        height: 200,
        backgroundColor: 'white'
    },

    titleStyle: {
        fontSize: 18,
        marginLeft: 16,
        marginTop: 16,
        marginBottom: 16,
        color: Color.black_semi_transparent
    },

    contentStyle: {
        margin: 16,
    },
});