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
                { (() => {
                    if (Platform.OS === 'ios')
                        return <View style={{width: width, height: 20, backgroundColor: Color.colorPrimaryDark}}/>
                })()}
                <StatusBar
                    backgroundColor={Color.colorPrimaryDark}
                    barStyle="light-content"
                    networkActivityIndicatorVisible={true}
                    hidden={false}/>
                {pager}
            </View>
        </Provider>)
};

const LauncherScreen = ({navigation}) => _renderScreen(<LauncherPager {...navigation.state.params} nav={navigation}/>);

const MainScreen = ({navigation}) => _renderScreen(<MainPager {...navigation.state.params} nav={navigation}/>);
const PreferencesScreen = ({navigation}) => _renderScreen(<PreferencesPager {...navigation.state.params}
                                                                            nav={navigation}/>);
const PasswordScreen = ({navigation}) => _renderScreen(<PasswordPager {...navigation.state.params} nav={navigation}/>);
const WorkScreen = ({navigation}) => _renderScreen(<WorkPager {...navigation.state.params} nav={navigation}/>);
const SearchScreen = ({navigation}) => _renderScreen(<SearchPager {...navigation.state.params} nav={navigation}/>);
const DetailScreen = ({navigation}) => _renderScreen(<DetailPager {...navigation.state.params} nav={navigation}/>);
const WorkAddScreen = ({navigation}) => _renderScreen(<WorkAddPager {...navigation.state.params} nav={navigation}/>);
const ParamScreen = ({navigation}) => _renderScreen(<ParamPager {...navigation.state.params} nav={navigation}/>);
const CommentScreen = ({navigation}) => _renderScreen(<CommentPager {...navigation.state.params} nav={navigation}/>);
const WorkSignScreen = ({navigation}) => _renderScreen(<WorkSignPager {...navigation.state.params} nav={navigation}/>);
const LoginScreen = ({navigation}) => _renderScreen(<LoginPager {...navigation.state.params} nav={navigation}/>);

const WdMainScreen = ({navigation}) => _renderScreen(<WdMainPager {...navigation.state.params} nav={navigation}/>);
const WdProductListScreen = ({navigation}) => _renderScreen(<WdProductListPager {...navigation.state.params}
                                                                                nav={navigation}/>);
const WdProductDetailScreen = ({navigation}) => _renderScreen(<WdProductDetailPager {...navigation.state.params}
                                                                                    nav={navigation}/>);
const WdProductFilterScreen = ({navigation}) => _renderScreen(<WdProductFilterPager {...navigation.state.params}
                                                                                    nav={navigation}/>);
const WdPostScreen = ({navigation}) => _renderScreen(<WdPostPager {...navigation.state.params}
                                                                                    nav={navigation}/>);
const WdReviewScreen = ({navigation}) => _renderScreen(<WdReviewPager {...navigation.state.params}
                                                                                    nav={navigation}/>);

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