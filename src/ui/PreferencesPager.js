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
        };
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
                <ScrollView  >
                    <View>
                        <PreferencesTextItem
                            group="常规"
                            items={[
                                [App.account, App.department + '-' + App.workType],
                                ['修改密码', '点击修改密码'],
                                ['检查更新', '当前版本：' + this.state.version],
                                ['此版本更新记录', "v1"]
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
                                                if (Platform.OS === 'ios')
                                                    IosModule.unbindPushAccount('');
                                                else
                                                    AndroidModule.unbindPushAccount();

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
                                () => this.props.nav.navigate('password'),
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
                               v1:初始版本...
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
        marginBottom:16,
        color: Color.black_semi_transparent
    },

    contentStyle: {
        margin: 16,
    },
});