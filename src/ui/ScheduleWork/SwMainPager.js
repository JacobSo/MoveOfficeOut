/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet, Dimensions, FlatList, RefreshControl,
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/SwApiService';
import Color from '../../constant/Color';
import FloatButton from "../Component/FloatButton";
import SnackBar from 'react-native-snackbar-dialog'
import RefreshEmptyView from "../Component/RefreshEmptyView";
import WpMainItem from "../Component/WpMainItem";
import RadioForm from 'react-native-simple-radio-button';
import SwMainItem from "../Component/SwMainItem";
import * as StatusGroup from "../../constant/StatusGroup";

const {width, height} = Dimensions.get('window');
const exList = ["全部", "待提交", "待审核", "处理中", "已审核", "待评分", "已完结"];
export default class SwMainPager extends Component {
    //this.props.memberType
    //监督:12345
    //审核:123
    //普通:6
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isFilter: false,
            items: [],
            itemsBackup: [],
            radioValue: 0,
        }
    }

    componentDidMount() {
        this._onRefresh();
    }

    _onRefresh() {
        this.setState({isRefreshing: true,});
        ApiService.getList(this.props.memberType.indexOf("0") > -1 ? "0,1,2,3,4,5" : "1,2,3,4,5", "")
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    this.setState({
                        items: responseJson.list,
                        itemsBackup: responseJson.list,
                        isRefreshing: false,
                    });
                } else {
                    this.setState({isRefreshing: false,});
                    SnackBar.show(responseJson.ErrDesc);
                }
            })
            .catch((error) => {
                this.setState({isRefreshing: false,});
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
            }).done();
    }

    _getView() {
        if (this.state.items && this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                this._onRefresh()
            } }/>)
        } else {
            return (
                <FlatList
                    data={this.state.items}
                    ListFooterComponent={<View style={{height: 75}}/>}
                    keyExtractor={(item, index) => item.scGuid}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this._onRefresh()}
                            tintColor={Color.colorBlueGrey}//ios
                            title="刷新中..."//ios
                            titleColor='white'
                            colors={[Color.colorPrimary]}
                            progressBackgroundColor="white"
                        />}
                    renderItem={({item}) => <SwMainItem
                        item={item}
                        action={() => {
                            if (item.scStatus === 0 || item.scStatus === 1 || item.scStatus === 3) {
                                this.props.nav.navigate("swAdd", {
                                    memberType: this.props.memberType,
                                    item: item,
                                    refreshFunc: () => {
                                        this._onRefresh()
                                    }
                                });
                            } else {
                                this.props.nav.navigate("swDetail", {
                                    memberType: this.props.memberType,
                                    item: item,
                                    refreshFunc: () => {
                                        this._onRefresh()
                                    }
                                })
                            }
                        }
                        }/>
                    }
                />
            )
        }
    }

    async  _search(value) {
        return this.state.itemsBackup.filter((item) => (StatusGroup.swItemStatus[item.scStatus].toLowerCase().indexOf(exList[value].toLowerCase()) > -1));
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>

                <Toolbar
                    elevation={2}
                    title={[this.props.memberType.indexOf("2") > -1 ? "工作监督" : this.props.memberType.indexOf("0") > -1 ? "日程工作" : "审核工作", exList[this.state.radioValue]]}
                    color={Color.colorGreen}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../../drawable/filter.png"), require("../../drawable/search.png")]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        () => this.setState({isFilter: !this.state.isFilter}),
                        () => this.props.nav.navigate('swSearch')

                    ]}/>
                {
                    (() => {
                        if (this.state.isFilter) {
                            return <RadioForm
                                buttonColor={Color.colorGreen}
                                labelStyle={{color: Color.content, margin: 16}}
                                radio_props={ [
                                    {label: exList[0], value: 0},
                                    {label: exList[1], value: 1},
                                    {label: exList[2], value: 2},
                                    {label: exList[3], value: 3},
                                    {label: exList[4], value: 4},
                                    {label: exList[5], value: 5},
                                ]}
                                initial={this.state.radioValue}
                                formHorizontal={false}
                                style={styles.radioContainer}
                                onPress={(value) => {
                                    if (value === 0) {
                                        this.setState({
                                            items: this.state.itemsBackup
                                        });
                                    } else {
                                        this._search(value).then((array) => {
                                            this.setState({
                                                items: array
                                            });
                                        });
                                    }

                                    this.setState({
                                        radioValue: value,
                                        isFilter: false,
                                    });
                                }}
                            />
                        } else {
                            return null
                        }
                    })()
                }
                {this._getView()}
                {
                    (() => {
                        if (this.props.memberType.indexOf("0") > -1) {
                            return <FloatButton
                                color={Color.colorOrange}
                                drawable={require('../../drawable/add.png')}
                                action={() => {
                                    this.props.nav.navigate('swAdd', {
                                        refreshFunc: () => {
                                            this._onRefresh()
                                        },
                                        memberType: this.props.memberType
                                    });
                                }}/>
                        }
                    })()
                }

            </View>
        )
    }
}
const styles = StyleSheet.create({
    radioContainer: {
        marginLeft: 16,
        marginBottom: 16,
        width: width - 32,
        backgroundColor: 'white',
        paddingTop: 16,
        paddingLeft: 16,
        elevation: 2,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    }
});
