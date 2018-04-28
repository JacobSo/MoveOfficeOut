/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions, ListView, Text, TouchableOpacity, Alert,
    DeviceEventEmitter, Image, TextInput, ScrollView, KeyboardAvoidingView, RefreshControl
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/CfApiService';
import Color from '../../constant/Color';
import Loading from 'react-native-loading-spinner-overlay'
import SnackBar from 'react-native-snackbar-dialog'
import DatePicker from '../../ui/Component/DatePicker';
import RefreshEmptyView from "../Component/RefreshEmptyView";
import QcCarCreatePager from "./CfCreatePager";
import QcCarItem from "../Component/QcCarItem";
import CfCarItem from "../Component/CfCarItem";
import App from '../../constant/Application';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import CfListView from "./CfListView";

const {width, height} = Dimensions.get('window');

export default class CfListPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isRefreshing: false,
        }
    }

    componentDidMount() {
    }


    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>
                <Toolbar
                    elevation={App.workType === '保安'?5:0}
                    title={["我的用车"]}
                    color={Color.colorBlueGrey}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={[App.workType === '保安' ? '' : '创建']}
                    functionArray={[
                        () => this.props.nav.goBack(null),
                        () => this.props.nav.navigate("cfCreate", {
                            finishFunc: () => {
                                this.getCar()
                            }
                        })

                    ]}/>
                {
                    (() => {
                        if (App.workType === '保安') {
                            return <CfListView  nav={this.props.nav} type={'2,3'}/>
                        } else {
                            return <ScrollableTabView
                                initialPage={0}
                                tabBarBackgroundColor={Color.colorBlueGrey}
                                tabBarActiveTextColor='white'
                                locked={false}
                                tabBarInactiveTextColor={Color.background}
                                tabBarUnderlineStyle={{backgroundColor: 'white',}}
                                onChangeTab={({i}) => this.setState({floatButtonVisible: (i === 0)}) }>
                                <CfListView tabLabel='申请' nav={this.props.nav} type={'0,1,2,3'}/>
                                <CfListView tabLabel='审核' nav={this.props.nav} type={'0'}/>
                                <CfListView tabLabel='结束' nav={this.props.nav} type={'4,5,6,7'}/>
                            </ScrollableTabView>
                        }
                    })()
                }

            </View>

        )
    }
}
const styles = StyleSheet.create({
    button: {
        width: width - 32,
        height: 45,
        backgroundColor: Color.colorAccent,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        width: width - 32,
        marginRight: 10,
        borderColor: Color.colorAccent,
        borderBottomWidth: 1,
    },
    selection: {
        width: 55,
        height: 5,
        marginTop: 16,
        marginBottom: 16
    }
});