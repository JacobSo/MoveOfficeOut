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
import {
    StackNavigator,
} from 'react-navigation';
/*
const MyNavScreen = ({navigation}) => (
    <ScrollView>
        <Button
            onPress={() => navigation.navigate('Photos',)}
            title="Go to a photos screen"
        />
        <Button
            onPress={() => navigation.goBack(null)}
            title="Go back"
        />
    </ScrollView>
);*/

const MainScreen = ({navigation}) => (<MainPager {...navigation.state.params} nav={navigation}/>);
const PreferencesScreen = ({navigation}) => (<PreferencesPager {...navigation.state.params} nav={navigation}/>);
const PasswordScreen = ({navigation}) => (<PasswordPager {...navigation.state.params} nav={navigation}/>);
const WorkScreen = ({navigation}) => (<WorkPager {...navigation.state.params} nav={navigation}/>);
const SearchScreen = ({navigation}) => (<SearchPager {...navigation.state.params} nav={navigation}/>);
const DetailScreen = ({navigation}) => (<DetailPager {...navigation.state.params} nav={navigation}/>);
const WorkAddScreen = ({navigation}) => (<WorkAddPager {...navigation.state.params} nav={navigation}/>);
const ParamScreen = ({navigation}) => (<ParamPager {...navigation.state.params} nav={navigation}/>);
const CommentScreen = ({navigation}) => (<CommentPager {...navigation.state.params} nav={navigation}/>);
const WorkSignScreen = ({navigation}) => (<WorkSignPager {...navigation.state.params} nav={navigation}/>);
const LoginScreen = ({navigation}) => (<LoginPager {...navigation.state.params} nav={navigation}/>);

const SimpleStack = StackNavigator({
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

}, { initialRouteName: 'login',headerMode: 'none'});

export default SimpleStack;