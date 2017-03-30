/**
 * Created by Administrator on 2017/3/13.
 */
import React, {Component} from 'react';
import {Platform, Navigator, BackAndroid, Dimensions, Text, View, StatusBar} from 'react-native';

import LoginPager from './ui/LoginPager';
import MainPager from './ui/MainPager';
import PreferencesPager from './ui/PreferencesPager';
import Color from './constant/Color'
import PasswordPager from "./ui/PasswordPager";
import WorkPager from "./ui/WorkPager";
import SearchPager from "./ui/SearchPager";
import DetailPager from "./ui/DetailPager";
import WorkAddPager from "./ui/WorkAddPager";
import ParamPager from "./ui/ParamPager";
import CommentPager from "./ui/CommentPager";
import WorkSignPager from "./ui/WorkSignPager";

let _navigator;
const {width, height} = Dimensions.get('window');
BackAndroid.addEventListener('hardwareBackPress', () => {
    if (['main', 'login'].indexOf(_navigator.getCurrentRoutes()[_navigator.getCurrentRoutes().length - 1].id) > -1) {
        return false;
    }

    _navigator.pop();
    return true;
});


export default class RouterAndroid extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        // console.log('componentWillMount');

    }

    _renderStatusBar = () => {
        if (Platform.OS === 'ios')
            return <View style={{width: width, height: 20, backgroundColor: Color.colorPrimaryDark}}/>
    };

    render() {
        //  console.log('render');

        return (
            <View
                style={{
                    width: width,
                    height: height,
                }}>

                {this._renderStatusBar()}
                <StatusBar
                    backgroundColor={Color.colorPrimaryDark}
                    barStyle="light-content"
                    networkActivityIndicatorVisible={true}
                    hidden={false}
                />

                <Navigator
                    initialRoute={{component: LoginPager}}
                    //       configureScene={() => Navigator.SceneConfigs.FloatFromBottomAndroid}
                    renderScene={this.renderScene}
                />
            </View>
        )
    }

    renderScene(route, navigator) {
      //  console.info("当前路由：", navigator.getCurrentRoutes());
        //   console.log('renderScene');
        _navigator = navigator;
        if (route.id === "main") {
            return (<MainPager {...route.params} nav={_navigator}/>)
        } else if (route.id === "preferences") {
            return (<PreferencesPager {...route.params} nav={_navigator}/>)
        } else if (route.id === 'password') {
            return (<PasswordPager {...route.params} nav={_navigator}/>)
        } else if (route.id === 'work') {
            return (<WorkPager  {...route.params} nav={_navigator}/>)
        } else if (route.id === 'search') {
            return (<SearchPager {...route.params} nav={_navigator}/>)
        } else if (route.id === 'detail') {
            return (<DetailPager {...route.params} nav={_navigator}/>)
        } else if (route.id === 'add') {
            return (<WorkAddPager {...route.params} nav={_navigator}/>)
        } else if (route.id === 'param') {
            return (<ParamPager {...route.params} nav={_navigator}/>)
        } else if (route.id === 'comment') {
            return (<CommentPager {...route.params} nav={_navigator}/>)
        } else if (route.id === 'sign') {
            return (<WorkSignPager {...route.params} nav={_navigator}/>)
        } else {
            return (<LoginPager {...route.params} nav={_navigator}/>)
        }

    }

}