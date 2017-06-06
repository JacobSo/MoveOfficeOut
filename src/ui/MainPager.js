/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';
//1：开发专员，2：项目专员，3：数据专员，4：助理，5：项目专员管理员

import React, {Component} from 'react';
import {
    View,
    Platform, Button,

} from 'react-native';
import FloatButton from './Component/FloatButton';
import Toolbar from './Component/Toolbar';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import InputDialog from "./Component/InputDialog";

import Color from '../constant/Color';
import App from '../constant/Application';
import CustomList from "./Component/CustomList";
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'
const PubSub = require('pubsub-js');

export default class MainPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            floatButtonVisible: App.jobType !== '3' && App.jobType !== '4' && App.jobType !== '5',
        };

    }

    componentDidMount() {
        this._bindPush();
    }

    _bindPush() {
        if (Platform.OS === 'ios')
            IosModule.bindPushAccount(App.account);
        else
            AndroidModule.bindPushAccount(App.account);
    }

    _get() {
        if (App.jobType === '3') {
            return (<CustomList tabLabel='进行中' type="3" nav={this.props.nav}/>)
        } else if (App.jobType === '4') {
            return (
                <ScrollableTabView
                    initialPage={0}
                    tabBarBackgroundColor={Color.colorPrimary}
                    tabBarActiveTextColor='white'
                    locked={false}
                    tabBarInactiveTextColor={Color.background}
                    tabBarUnderlineStyle={{backgroundColor: 'white',}}>

                    <CustomList tabLabel='进行中' type="2" nav={this.props.nav}/>
                    <CustomList tabLabel='待审核' type="1" nav={this.props.nav}/>
                </ScrollableTabView>)
        } else if (App.jobType==='5') {
            return (<CustomList tabLabel='进行中' type="1,3" nav={this.props.nav}/>)
        } else {
            if (App.jobType==='2') {
                return (
                    <ScrollableTabView
                        initialPage={0}
                        tabBarBackgroundColor={Color.colorCyan}
                        tabBarActiveTextColor='white'
                        locked={false}
                        tabBarInactiveTextColor={Color.background}
                        tabBarUnderlineStyle={{backgroundColor: 'white',}}
                        onChangeTab={({i}) => this.setState({floatButtonVisible: (i === 0)}) }>
                        <CustomList tabLabel='外出任务' type="5" nav={this.props.nav}
                                    finishFunc={() => this.popupDialog.show()}/>
                        <CustomList tabLabel='审核' type="1" nav={this.props.nav}/>
                        <CustomList tabLabel='评分' type="3" nav={this.props.nav}/>
                    </ScrollableTabView>
                )
            } else {// 1
                return (
                    <ScrollableTabView
                        initialPage={0}
                        tabBarBackgroundColor={Color.colorCyan}
                        tabBarActiveTextColor='white'
                        tabBarInactiveTextColor={Color.background}
                        tabBarUnderlineStyle={{backgroundColor: 'white'}}
                        onChangeTab={({i}) => this.setState({floatButtonVisible: (i === 0)})}>
                        <CustomList tabLabel='进行中' type="0,1,2" nav={this.props.nav}
                                    finishFunc={() => this.popupDialog.show()}/>
                        <CustomList tabLabel='已完结' type="3,4" nav={this.props.nav}/>
                    </ScrollableTabView>
                )
            }
        }
    }

    _finishDialog() {
        return (
            <InputDialog
                action={[
                    (popupDialog) => {
                        this.popupDialog = popupDialog;
                    },
                    (text) => {
                        this.setState({editContent: text})
                    },
                    () => {
                        this.setState({editContent: ''});
                        this.popupDialog.dismiss();
                    },
                    () => {
                        PubSub.publish('finish', this.state.editContent);
                        this.popupDialog.dismiss();

                    }
                ]} str={['完成签到', '备注，如无特殊情况，可忽略']}/>)
    }

    render() {
        //  console.log("main:render");
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar
                    elevation={0}
                    title={["外出工作"]}
                    color={Color.colorCyan}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../drawable/search.png")]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        () => this.props.nav.navigate('search'),
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
                {this._finishDialog()}
            </View>
        )
    }
}

