'user strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import Color from '../../constant/Color';
import SwListView from "../Component/SwListView";
import * as StatusGroup from "../../constant/StatusGroup";
export default class SwSubMainPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSearch: false,
            isFilter: false,
            pageFlag: 0,
            filterText: "全部",
            searchKey: "",
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: Color.background,}}>
                <Toolbar
                    elevation={2}
                    title={["日程工作",this.props.account?this.props.account+"-"+this.state.filterText:"我的工作-"+this.state.filterText]}
                    color={Color.colorGreen}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={ [require("../../drawable/search.png"), require("../../drawable/filter.png")]}
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

                <SwListView
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
                    account={this.props.account}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({});