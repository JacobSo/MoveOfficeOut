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
import WdMainPager from "./ui/WoodDevelop/WdMainPager";
import WdProductListPager from "./ui/WoodDevelop/WdProductListPager";
import LauncherPager from "./ui/LauncherPager";
import WdProductDetailPager from "./ui/WoodDevelop/WdProductDetailPager";
import WdProductFilterPager from "./ui/WoodDevelop/WdProductFilterPager";
import WdPostPager from "./ui/WoodDevelop/WdPostPager";
import WdReviewPager from "./ui/WoodDevelop/WdReviewPager";
import WdFileListPager from "./ui/WoodDevelop/WdFileListPager";
import WpMainPager from "./ui/WoodProcess/WpMainPager";
import WpWorkPager from "./ui/WoodProcess/WpWorkPager";
import WpSearchPager from "./ui/WoodProcess/WpSearchPager";
import WpProductDetailPager from "./ui/WoodProcess/WpProductDetailPager";
import GalleryPager from "./ui/GalleryPager";
import QcMainPager from "./ui/QuailtyCheck/QcMainPager";
import QcProductListPager from "./ui/QuailtyCheck/QcProductListPager";
import QcProductDetailPager from "./ui/QuailtyCheck/QcProductDetailPager";
import WebViewPager from "./ui/WebViewPager";
import QcFormPager from "./ui/QuailtyCheck/QcFormPager";
import QcPostPager from "./ui/QuailtyCheck/QcPostPager";
import QcSubmitPager from "./ui/QuailtyCheck/QcSubmitPager";
import QcSignPager from "./ui/QuailtyCheck/QcSignPager";
import QcCarPager from "./ui/QuailtyCheck/QcCarPager";
import QcCarCreatePager from "./ui/QuailtyCheck/QcCarCreatePager";
import AsMainPager from "./ui/AfterSales/AsMainPager";
import AsAddOrderPager from "./ui/AfterSales/AsAddOrderPager";
import AsSignFormPager from "./ui/AfterSales/AsSignFormPager";
import AsProductSearchPager from "./ui/AfterSales/AsProductSearchPager";
import AsSignOrderPager from "./ui/AfterSales/AsSignOrderPager";
import AsParamPager from "./ui/AfterSales/AsParamPager";
import AsOrderDetailPager from "./ui/AfterSales/AsOrderDetailPager";
import SwMainPager from "./ui/ScheduleWork/SwMainPager";
import SwAddPager from "./ui/ScheduleWork/SwAddPager";
import SwDetailPager from "./ui/ScheduleWork/SwDetailPager";
import SwParamPager from "./ui/ScheduleWork/SwParamPager";
import SwCountPager from "./ui/ScheduleWork/SwCountPager";
const {width, height} = Dimensions.get('window');


_renderScreen = (pager) => {
    //  console.log("screen1");

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

_statusBar = (color) => {
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
};

const LauncherScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorPrimaryDark)}<LauncherPager {...navigation.state.params}
                                                                                nav={navigation}/></View>);
const MainScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorCyanDark)}<MainPager {...navigation.state.params}
                                                                         nav={navigation}/></View>);
const PreferencesScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorPrimaryDark)}<PreferencesPager {...navigation.state.params}
                                                                                   nav={navigation}/></View>);
const PasswordScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorPrimaryDark)}<PasswordPager {...navigation.state.params}
                                                                                nav={navigation}/></View>);
const WorkScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorCyanDark)}<WorkPager {...navigation.state.params}
                                                                         nav={navigation}/></View>);
const SearchScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorCyanDark)}<SearchPager {...navigation.state.params}
                                                                           nav={navigation}/></View>);
const DetailScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorCyanDark)}<DetailPager {...navigation.state.params}
                                                                           nav={navigation}/></View>);
const WorkAddScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorCyanDark)}<WorkAddPager {...navigation.state.params}
                                                                            nav={navigation}/></View>);
const ParamScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorCyanDark)}<ParamPager {...navigation.state.params}
                                                                          nav={navigation}/></View>);
const CommentScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorCyanDark)}<CommentPager {...navigation.state.params}
                                                                            nav={navigation}/></View>);
const WorkSignScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorCyanDark)}<WorkSignPager {...navigation.state.params}
                                                                             nav={navigation}/></View>);
const LoginScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorPrimaryDark)}<LoginPager {...navigation.state.params}
                                                                             nav={navigation}/></View>);
const WdMainScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdMainPager {...navigation.state.params}
                                                                                 nav={navigation}/></View>);
const WdProductListScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdProductListPager {...navigation.state.params}
                                                                                        nav={navigation}/></View>);
const WdProductDetailScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdProductDetailPager {...navigation.state.params}
                                                                                          nav={navigation}/></View>);
const WdProductFilterScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdProductFilterPager {...navigation.state.params}
                                                                                          nav={navigation}/></View>);
const WdPostScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdPostPager {...navigation.state.params}
                                                                                 nav={navigation}/></View>);
const WdReviewScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdReviewPager {...navigation.state.params}
                                                                                   nav={navigation}/></View>);
const WdFileListScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorDeepOrangeDark)}<WdFileListPager {...navigation.state.params}
                                                                                     nav={navigation}/></View>);
const WpMainScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorPurpleDark)}<WpMainPager {...navigation.state.params}
                                                                             nav={navigation}/></View>);
const WpWorkScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorPurpleDark)}<WpWorkPager {...navigation.state.params}
                                                                             nav={navigation}/></View>);
const WpSearchScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorPurpleDark)}<WpSearchPager {...navigation.state.params}
                                                                               nav={navigation}/></View>);
const WpProductDetailScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorPurpleDark)}<WpProductDetailPager {...navigation.state.params}
                                                                                      nav={navigation}/></View>);
const GalleryScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar('black')}<GalleryPager {...navigation.state.params}
                                                                nav={navigation}/></View>);
const QcMainScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorIndigoDark)}<QcMainPager {...navigation.state.params}
                                                                             nav={navigation}/></View>);
const QcListScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorIndigoDark)}<QcProductListPager {...navigation.state.params}
                                                                                    nav={navigation}/></View>);
const QcDetailScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorIndigoDark)}<QcProductDetailPager {...navigation.state.params}
                                                                                      nav={navigation}/></View>);
const WebScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorDeepOrangeDark)}<WebViewPager {...navigation.state.params}
                                                                                  nav={navigation}/></View>);
const QcFormScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorIndigoDark)}<QcFormPager {...navigation.state.params}
                                                                             nav={navigation}/></View>);
const QcPostScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorIndigoDark)}<QcPostPager {...navigation.state.params}
                                                                             nav={navigation}/></View>);
const QcSubmitScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorIndigoDark)}<QcSubmitPager {...navigation.state.params}
                                                                               nav={navigation}/></View>);
const QcSignScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorIndigoDark)}<QcSignPager {...navigation.state.params}
                                                                             nav={navigation}/></View>);
const QcCarScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorIndigoDark)}<QcCarPager {...navigation.state.params}
                                                                            nav={navigation}/></View>);
const QcCarCreateScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorIndigoDark)}<QcCarCreatePager {...navigation.state.params}
                                                                                  nav={navigation}/></View>);
const AsMainScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorOrange)}<AsMainPager {...navigation.state.params}
                                                                         nav={navigation}/></View>);
const AsAddScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorOrange)}<AsAddOrderPager {...navigation.state.params}
                                                                         nav={navigation}/></View>);
const AsSignScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorOrange)}<AsSignOrderPager {...navigation.state.params}
                                                                         nav={navigation}/></View>);
const AsProductScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorOrange)}<AsProductSearchPager {...navigation.state.params}
                                                                         nav={navigation}/></View>);
const AsFormScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorOrange)}<AsSignFormPager {...navigation.state.params}
                                                                         nav={navigation}/></View>);
const AsParamScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorOrange)}<AsParamPager {...navigation.state.params}
                                                                         nav={navigation}/></View>);
const AsOrderDetailScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorOrange)}<AsOrderDetailPager {...navigation.state.params}
                                                                          nav={navigation}/></View>);
const SwMainScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorGreenDark)}<SwMainPager {...navigation.state.params}
                                                                                nav={navigation}/></View>);
const SwAddScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorGreenDark)}<SwAddPager {...navigation.state.params}
                                                                                nav={navigation}/></View>);
const SwDetailScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorGreenDark)}<SwDetailPager {...navigation.state.params}
                                                                           nav={navigation}/></View>);
const SwParamScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorGreenDark)}<SwParamPager {...navigation.state.params}
                                                                           nav={navigation}/></View>);

const SwCountScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.colorGreenDark)}<SwCountPager {...navigation.state.params}
                                                                           nav={navigation}/></View>);

const SimpleStack = StackNavigator({
        launcher: {
            screen: LauncherScreen,
        },
        gallery: {
            screen: GalleryScreen,
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
        wdFile: {
            screen: WdFileListScreen,
        },
        wpMain: {
            screen: WpMainScreen,
        },
        wpWork: {
            screen: WpWorkScreen,
        },
        wpSearch: {
            screen: WpSearchScreen,
        },
        wpDetail: {
            screen: WpProductDetailScreen,
        },
        qcMain: {
            screen: QcMainScreen,
        },
        qcList: {
            screen: QcListScreen,
        },
        qcDetail: {
            screen: QcDetailScreen,
        },
        web: {
            screen: WebScreen,
        },
        qcForm: {
            screen: QcFormScreen,
        },
        qcPost: {
            screen: QcPostScreen,
        },
        qcSubmit: {
            screen: QcSubmitScreen,
        },
        qcSign: {
            screen: QcSignScreen,
        },
        qcCar: {
            screen: QcCarScreen,
        },
        qcCarCreate: {
            screen: QcCarCreateScreen,
        },
        asMain: {
            screen: AsMainScreen,
        },
        asAdd: {
            screen: AsAddScreen,
        },
        asSign: {
            screen: AsSignScreen,
        },
        asProduct: {
            screen: AsProductScreen,
        },
        asForm: {
            screen: AsFormScreen,
        },
        asParam: {
            screen: AsParamScreen,
        },
        asDetail: {
            screen: AsOrderDetailScreen,
        },
        swMain: {
            screen: SwMainScreen,
        },
        swAdd: {
            screen: SwAddScreen,
        },
        swParam: {
            screen: SwParamScreen,
        },
        swDetail: {
            screen: SwDetailScreen,
        },
        swCount: {
            screen: SwCountScreen,
        },

    },
    {
        initialRouteName: 'login',
        headerMode: 'none',
    });

export default SimpleStack;