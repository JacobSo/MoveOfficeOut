/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    Platform
} from 'react-native';
import FloatButton from './Component/FloatButton';
import Toolbar from './Component/Toolbar';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import Color from '../constant/Color';
import App from '../constant/Application';
import CustomList from "./Component/CustomList";
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'

export default class MainPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            floatButtonVisible: App.workType !== '数据专员' && App.workType !== '助理' && App.workType !== '项目专员管理人'
        }
    }

    componentDidMount() {
        // this._bindPush();
    }



    _bindPush() {
        if (Platform.OS === 'ios')
            IosModule.bindPushAccount(App.account);
        else
            AndroidModule.bindPushAccount(App.account);
    }

    sync() {
        CodePush.sync();

    }

    /** Update pops a confirmation dialog, and then immediately reboots the app */

    syncImmediate() {
        CodePush.sync(
            {
                installMode: CodePush.InstallMode.IMMEDIATE,//启动模式三种：ON_NEXT_RESUME、ON_NEXT_RESTART、IMMEDIATE
                updateDialog: {
                    appendReleaseDescription: true,//是否显示更新description，默认为false
                    descriptionPrefix: "更新内容：",//更新说明的前缀。 默认是” Description:
                    mandatoryContinueButtonLabel: "立即更新",//强制更新的按钮文字，默认为continue
                    mandatoryUpdateMessage: "",//- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
                    optionalIgnoreButtonLabel: '稍后',//非强制更新时，取消按钮文字,默认是ignore
                    optionalInstallButtonLabel: '后台更新',//非强制更新时，确认文字. Defaults to “Install”
                    optionalUpdateMessage: '有新版本了，是否更新？',//非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
                    title: '更新提示'//要显示的更新通知的标题. Defaults to “Update available”.
                },
            },
        );
    }

    _get() {
        if (App.workType === '数据专员') {
            return (<CustomList tabLabel='进行中' type="3" nav={this.props.nav}/>)
        } else if (App.workType === '助理') {
            return (<CustomList tabLabel='进行中' type="2" nav={this.props.nav}/>)
        } else if (App.workType.indexOf('项目专员管理人') > -1) {
            return (<CustomList tabLabel='进行中' type="1,3" nav={this.props.nav}/>)
        } else {
            if (App.workType.indexOf('项目专员') > -1) {
                return (
                    <ScrollableTabView
                        initialPage={0}
                        tabBarBackgroundColor={Color.colorPrimary}
                        tabBarActiveTextColor='white'
                        tabBarInactiveTextColor={Color.background}
                        tabBarUnderlineStyle={{backgroundColor: 'white',}}
                        onChangeTab={({i}) => this.setState({floatButtonVisible: (i === 0)}) }>
                        <CustomList tabLabel='我的外出任务' type="5" nav={this.props.nav}/>
                        <CustomList tabLabel='审核与评分' type="1,3" nav={this.props.nav}/>
                    </ScrollableTabView>)
            } else {
                return (
                    <ScrollableTabView
                        initialPage={0}
                        tabBarBackgroundColor={Color.colorPrimary}
                        tabBarActiveTextColor='white'
                        tabBarInactiveTextColor={Color.background}
                        tabBarUnderlineStyle={{backgroundColor: 'white'}}
                        onChangeTab={({i}) => this.setState({floatButtonVisible: (i === 0)})}>
                        <CustomList tabLabel='进行中' type="0,1,2" nav={this.props.nav}/>
                        <CustomList tabLabel='已完结' type="3,4" nav={this.props.nav}/>
                    </ScrollableTabView>
                )
            }
        }
    }

    render() {
        //  console.log("main:render");
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar
                    elevation={3}
                    title={[App.account, App.department + '-' + App.workType]}
                    color={Color.colorPrimary}
                    isHomeUp={false}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../drawable/search.png"), require("../drawable/setting.png")]}
                    functionArray={[
                        () => this.props.nav.navigate('search'),
                        () => this.props.nav.navigate('preferences')
                    ]}/>

                {this._get()}
                {
                    (() => {
                        if (this.state.floatButtonVisible) {
                            return (
                                <FloatButton drawable={require('../drawable/add.png')} action={() => {
                                    this.props.nav.navigate('work');
                                    //       console.log(JSON.stringify(this.props))
                                }}/>)
                        } else return null;
                    })()
                }

            </View>

        )
    }
}

