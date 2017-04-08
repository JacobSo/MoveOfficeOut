/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import PreferencesTextItem from './Component/PreferencesTextItem'
import App from '../constant/Application';
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'
import {NavigationActions} from "react-navigation";
export default class PreferencesPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            version: this._getVersion(),
        };
    }

    _getVersion() {
        if (Platform.OS === 'ios') {
            IosModule.getVersionName((str) => {this.setState({version: str})})
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
                                ['检查更新', '当前版本：' + this.state.version]
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
                                    if (Platform.OS === 'ios'){
                                        IosModule.checkUpdate('');
                                    }else{
                                        AndroidModule.checkUpdate();
                                    }
                                }]}/>

                    </View>
                </ScrollView>
            </View>
        )
    }
}
