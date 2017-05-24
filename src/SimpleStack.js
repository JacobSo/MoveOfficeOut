/**
 * @flow
 */

import React from 'react';
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
import {Provider} from 'react-redux';
import store from './stores/Store'
import {StackNavigator,} from 'react-navigation';
import {Platform, Dimensions, View, StatusBar} from 'react-native';
import codePush from 'react-native-code-push'
import WdMainPager from "./ui/WoodDevelop/WdMainPager";
import WdProductListPager from "./ui/WoodDevelop/WdProductListPager";
import LauncherPager from "./ui/LauncherPager";
import WdProductDetailPager from "./ui/WoodDevelop/WdProductDetailPager";
import WdProductFilterPager from "./ui/WoodDevelop/WdProductFilterPager";
import WdPostPager from "./ui/WoodDevelop/WdPostPager";
import WdReviewPager from "./ui/WoodDevelop/WdReviewPager";
import App from "./constant/Application"
const {width, height} = Dimensions.get('window');


_renderScreen = (pager) => {
    //  console.log("screen1");
    //  codePush.sync();
    return (
        <Provider store={store}>
            <View
                style={{
                    width: width,
                    height: height,
                }}>

                {pager}
            </View>
        </Provider>)
};

_statusBar = (color)=>{
    return (
        <View>
        { (() => {
        if (Platform.OS === 'ios')
            return <View style={{width: width, height: 20, backgroundColor: color}}/>
    })()}
    <StatusBar
        backgroundColor={color}
        barStyle="light-content"
        networkActivityIndicatorVisible={true}
        hidden={false}/></View>)
}

const LauncherScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<LauncherPager {...navigation.state.params} nav={navigation}/></View>);

const MainScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<MainPager {...navigation.state.params} nav={navigation}/></View>);
const PreferencesScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<PreferencesPager {...navigation.state.params}
                                                                                                                     nav={navigation}/></View>);
const PasswordScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<PasswordPager {...navigation.state.params} nav={navigation}/></View>);
const WorkScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<WorkPager {...navigation.state.params} nav={navigation}/></View>);
const SearchScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<SearchPager {...navigation.state.params} nav={navigation}/></View>);
const DetailScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<DetailPager {...navigation.state.params} nav={navigation}/></View>);
const WorkAddScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<WorkAddPager {...navigation.state.params} nav={navigation}/></View>);
const ParamScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<ParamPager {...navigation.state.params} nav={navigation}/></View>);
const CommentScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<CommentPager {...navigation.state.params} nav={navigation}/></View>);
const WorkSignScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<WorkSignPager {...navigation.state.params} nav={navigation}/></View>);
const LoginScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorPrimaryDark)}<LoginPager {...navigation.state.params} nav={navigation}/></View>);

const WdMainScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdMainPager {...navigation.state.params} nav={navigation}/></View>);
const WdProductListScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdProductListPager {...navigation.state.params}
                                                                                nav={navigation}/></View>);
const WdProductDetailScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdProductDetailPager {...navigation.state.params}
                                                                                    nav={navigation}/></View>);
const WdProductFilterScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdProductFilterPager {...navigation.state.params}
                                                                                    nav={navigation}/></View>);
const WdPostScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdPostPager {...navigation.state.params}
                                                                                    nav={navigation}/></View>);
const WdReviewScreen = ({navigation}) => _renderScreen(<View style={{height:height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdReviewPager {...navigation.state.params}
                                                                                                               nav={navigation}/></View>);

const SimpleStack = StackNavigator({
    launcher: {
        screen: LauncherScreen,
    },
    main: {
        screen: MainScreen,
    },
    preferences: {
        screen: PreferencesScreen,
    },
    password: {
        screen: PasswordScreen,
    },
    work: {
        screen: WorkScreen,
    },
    search: {
        screen: SearchScreen,
    },
    detail: {
        screen: DetailScreen,
    },
    add: {
        screen: WorkAddScreen,
    },
    param: {
        screen: ParamScreen,
    },
    comment: {
        screen: CommentScreen,
    },
    sign: {
        screen: WorkSignScreen,
    },
    login: {
        screen: LoginScreen,
    },

    wdMain: {
        screen: WdMainScreen,
    },
    wdProduct: {
        screen: WdProductListScreen,
    },
    wdDetail: {
        screen: WdProductDetailScreen,
    },
    wdFilter: {
        screen: WdProductFilterScreen,
    },
    wdPost: {
        screen: WdPostScreen,
    },
    wdReview: {
        screen: WdReviewScreen,
    },
}, {
    initialRouteName: 'login',
    headerMode: 'none',
});

export default SimpleStack;