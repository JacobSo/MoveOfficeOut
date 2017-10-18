/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions,
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import Color from '../../constant/Color';
import App from '../../constant/Application';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import AsListView from "../Component/AsListView";

const {width, height} = Dimensions.get('window');
export default class AsMainPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isClass: false,
            className: "全部"
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={2}
                    title={["售后工作"+(App.workType.indexOf('开发专员')>-1?"("+this.state.className+")":"")]}
                    color={Color.colorAmber}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[App.workType.indexOf('开发专员')>-1?require("../../drawable/filter.png"):null]}
                    functionArray={[
                        () => this.props.nav.goBack(null),
                        () => {
                            this.setState({isClass: !this.state.isClass})
                        }
                    ]}
                    isSearch={this.state.isSearch}
                    searchFunc={(text) => {
                        this._search(text).then((array) => {
                            //       console.log(array);
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(array),
                            });
                        })
                    }}
                />
                {
                    (() => {
                        if (App.workType.indexOf("售后负责人") > -1) {
                            return <ScrollableTabView
                                initialPage={0}
                                tabBarBackgroundColor={Color.colorAmber}
                                tabBarActiveTextColor='white'
                                tabBarInactiveTextColor={Color.background}
                                tabBarUnderlineStyle={{backgroundColor: 'white'}}
                                onChangeTab={({i}) => this.setState({floatButtonVisible: (i === 0)})}>
                                <AsListView tabLabel='待处理' type="waitting" nav={this.props.nav}/>
                                <AsListView tabLabel='我的单据' type="service_approving" nav={this.props.nav}/>
                                <AsListView tabLabel='售后审核' type="service_approved" nav={this.props.nav}/>
                            </ScrollableTabView>
                        } else if (App.workType.indexOf("售后专员") > -1) {
                            return <ScrollableTabView
                                initialPage={0}
                                tabBarBackgroundColor={Color.colorAmber}
                                tabBarActiveTextColor='white'
                                tabBarInactiveTextColor={Color.background}
                                tabBarUnderlineStyle={{backgroundColor: 'white'}}
                                onChangeTab={({i}) => this.setState({floatButtonVisible: (i === 0)})}>
                                <AsListView tabLabel='待处理' type="waitting" nav={this.props.nav}/>
                                <AsListView tabLabel='我的单据' type="service_approving" nav={this.props.nav}/>
                            </ScrollableTabView>
                        }
                        else {
                            return <AsListView
                                type={""}
                                nav={this.props.nav}
                                classFunc={() => this.state.isClass}
                                changeClass={(text) => {
                                    this.setState({
                                        isClass: !this.state.isClass,
                                        className: text
                                    })
                                }}/>
                        }
                    })()
                }
            </View>
        )
    }
}
