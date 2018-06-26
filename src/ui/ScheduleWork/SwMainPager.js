'user strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import Color from '../../constant/Color';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import SwListView from "../Component/SwListView";
import * as StatusGroup from "../../constant/StatusGroup";
export default class SwMainPager extends Component {
    //this.props.memberType
    //监督:12345 cs1
    //审核:123 cs2
    //普通:6
    constructor(props) {
        super(props);
        this.state = {
            isSearch: false,
            isFilter: false,
            pageFlag: 0,
            filterText: "",
            searchKey: "",
        }
    }

    componentDidMount() {
    }

    getView() {
        return <ScrollableTabView
            initialPage={0}
            tabBarBackgroundColor={Color.colorGreen}
            tabBarActiveTextColor='white'
            locked={false}
            tabBarInactiveTextColor={Color.background}
            tabBarUnderlineStyle={{backgroundColor: 'white',}}
            onChangeTab={({i}) => this.setState({
                pageFlag: i,
                isSearch: false,
                isFilter: false,
            }) }>
            {
                (() => {
                    if (this.props.memberType.indexOf('1') > -1) {
                        return <SwListView
                            tabLabel='我的工作'
                            pageType={0}
                            nav={this.props.nav}
                            memberType={this.props.memberType}
                            isFilter={this.state.isFilter}
                            filterFunc={(value) => this.setState({
                                isFilter: !this.state.isFilter,
                                filterText: value === 0 ? "" : StatusGroup.swMainFilter[value]
                            })}
                            searchKey={this.state.searchKey}
                            isSearch={this.state.isSearch}
                            account={null}
                        />
                    } else {
                        return <SwListView
                            tabLabel='工作监督'
                            pageType={1}
                            nav={this.props.nav}
                            memberType={this.props.memberType}
                            searchKey={this.state.searchKey}
                            isSearch={this.state.isSearch}

                        />
                    }
                })()
            }
            <SwListView
                tabLabel={this.props.memberType.indexOf('1') > -1 ? "审核工作" : "我的" + this.state.filterText + "工作"}//// + pageFlag===1?this.state.filterText:"" +
                pageType={0}
                nav={this.props.nav}
                memberType={this.props.memberType}
                isFilter={this.state.isFilter}
                filterFunc={(value) => this.setState({
                    isFilter: !this.state.isFilter,
                    filterText: value === 0 ? "" : StatusGroup.swMainFilter[value]
                })}
                searchKey={this.state.searchKey}
                isSearch={this.state.isSearch}
                isAuditCreate={true}

            />
        </ScrollableTabView>
    }

    /*    [this.props.memberType.indexOf("2") > -1 ? this.props.account + "的工作" : this.props.memberType.indexOf("0") > -1 ? "日程工作" : "审核工作",
     exList[this.state.radioValue]]*/
    render() {
        return (
            <View style={{flex: 1, backgroundColor: Color.background,}}>
                <Toolbar
                    elevation={2}
                    title={["日程工作",]}
                    color={Color.colorGreen}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={this.state.pageFlag === 0 && this.props.memberType.indexOf('2') > -1 ? [require("../../drawable/search.png")] : [require("../../drawable/search.png"), require("../../drawable/filter.png")]}
                    functionArray={[
                        () => {
                            if (this.state.isSearch) {
                                this.setState({
                                    isSearch: !this.state.isSearch,
                                })
                            } else this.props.nav.goBack(null)
                        },
                        () => this.setState({isSearch: !this.state.isSearch}),
                        () => this.setState({isFilter: !this.state.isFilter}),

                    ]}
                    isSearch={this.state.isSearch}
                    searchFunc={(text) => this.setState({searchKey: text})}/>

                {this.getView()}


            </View>
        )
    }
}
const styles = StyleSheet.create({});
