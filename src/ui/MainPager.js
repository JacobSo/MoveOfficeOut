/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,

} from 'react-native';
import Toast from 'react-native-root-toast';
import FloatButton from './Component/FloatButton';
import Toolbar from './Component/Toolbar';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import Color from '../constant/Color';
import App from '../constant/Application';
import CustomList from "./Component/CustomList";
export default class MainPager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFloat: true,
        };


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
                        tabBarUnderlineStyle={{backgroundColor: 'white'}}
                        onScroll={(position) => this.setState({isFloat: position === 0})}>
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
                        onScroll={(position) => this.setState({isFloat: position === 0})}>
                        <CustomList tabLabel='进行中' type="0,1,2" nav={this.props.nav}/>
                        <CustomList tabLabel='已完结' type="3,4" nav={this.props.nav}/>
                    </ScrollableTabView>
                )
            }
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar
                    elevation={0}
                    title={[App.account, App.department + '-' + App.workType]}
                    color={Color.colorPrimary}
                    isHomeUp={false}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../drawable/search.png"), require("../drawable/setting.png")]}
                    functionArray={[() => this.props.nav.push({id: 'search',}), () => this.props.nav.push({id: 'preferences',})]}/>

                {this._get()}
                {
                    (() => {
                        if (this.state.isFloat) {
                            return (
                                <FloatButton drawable={require('../drawable/add.png')} action={() => {


                                    this.props.nav.push({id: 'work',})
                                }}/>)
                        } else return null;
                    })()
                }

            </View>

        )
    }


}

