/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    TouchableOpacity, Dimensions, FlatList, StyleSheet, Text, RefreshControl
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/SwApiService';
import Color from '../../constant/Color';
import App from '../../constant/Application';
import SnackBar from 'react-native-snackbar-dialog'
import RefreshEmptyView from "../Component/RefreshEmptyView";
import WpMainItem from "../Component/WpMainItem";
import RadioForm from 'react-native-simple-radio-button';
import SwMainItem from "../Component/SwMainItem";
import * as ColorGroup from "../../constant/ColorGroup";
import DatePicker from "../Component/DatePicker";
import SwCountItem from "./SwCountItem";
import PropTypes from 'prop-types';
import * as StatusGroup from "../../constant/StatusGroup";
import FloatButton from "./FloatButton";

const {width, height} = Dimensions.get('window')
let myDate = new Date();
export default class SwListView extends Component {
    static propTypes = {
        pageType: PropTypes.number.isRequired,//0main 1count
        nav: PropTypes.any.isRequired,
        memberType: PropTypes.string.isRequired,

    };

    /**
     * add props
     *
     isFilter:
     filterFunc:
     searchKey
     *
     */

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isSearch: false,
            isFilter: false,
            items: [],
            itemsBackup: [],
            timeFilter: myDate.getFullYear() + "-" + (myDate.getMonth() + 1)//count use

        }
    }

    componentDidMount() {
        if (this.props.pageType === 1) {
            this.onCountRefresh();
        } else {
            this.onMainRefresh();
        }
    }

    componentWillReceiveProps(newProps) {
        console.log(newProps);
        if (newProps.isSearch) {
            if (newProps.searchKey) {
                this.props.pageType === 0 ?
                    this.searchMainText(newProps.searchKey).then((array) => {
                        this.setState({
                            items: array
                        });
                    }) : this.searchCountText(newProps.searchKey)
                    .then((array) => {
                        this.setState({
                            items: array
                        });
                    })
            } else
                this.setState({items: this.state.itemsBackup});
        } else
            this.setState({items: this.state.itemsBackup});

    }


    initItems(items) {
        items.map((data, index) => {
            data.scId = index
        });
        return items
    }

    onCountRefresh() {
        this.setState({isRefreshing: true,});
        ApiService.getCount(this.state.timeFilter)
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    this.setState({
                        items: this.initItems(responseJson.list),
                        itemsBackup: this.initItems(responseJson.list),
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

    onMainRefresh() {
        this.setState({isRefreshing: true,});
        ApiService.getList(
            this.props.memberType.indexOf("1") > -1|| this.props.memberType.indexOf("2") > -1 ? "1,2,3,4,5" : "0,1,2,3,4,5",
            this.props.account,
        )
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


    async  searchCountText(text) {
        return this.state.items.filter((item) => (item.UserName.toLowerCase().indexOf(text.toLowerCase()) > -1));
    }

    async  searchMainType(value) {
        return this.state.itemsBackup.filter((item) => (StatusGroup.swItemStatus[item.scStatus].toLowerCase().indexOf(StatusGroup.swMainFilter[value].toLowerCase()) > -1));
    }

    async  searchMainText(text) {
        console.log(text)
        return this.state.items.filter((item) => (JSON.stringify(item).toLowerCase().indexOf(text.toLowerCase()) > -1));
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>
                {
                    (() => {
                        if (this.props.isFilter) {
                            return <RadioForm
                                buttonColor={Color.colorGreen}
                                labelStyle={{color: Color.content, margin: 16}}
                                radio_props={ [
                                    {label: StatusGroup.swMainFilter[0], value: 0},
                                    {label: StatusGroup.swMainFilter[1], value: 1},
                                    {label: StatusGroup.swMainFilter[2], value: 2},
                                    {label: StatusGroup.swMainFilter[3], value: 3},
                                    {label: StatusGroup.swMainFilter[4], value: 4},
                                    {label: StatusGroup.swMainFilter[5], value: 5},
                                ]}
                                initial={this.state.radioValue}
                                formHorizontal={false}
                                style={styles.radioContainer}
                                onPress={(value) => {
                                    if (value === 0)
                                        this.setState({
                                            items: this.state.itemsBackup,
                                            radioValue: value
                                        });
                                    else
                                        this.searchMainType(value).then((array) => this.setState({
                                            items: array,
                                            radioValue: value,
                                        }));
                                    this.props.filterFunc(value);
                                }}
                            />
                        } else {
                            return null
                        }
                    })()
                }
                {
                    (() => {
                        if (this.state.items && this.state.items.length === 0) {
                            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                                this.props.pageType===0?this.onMainRefresh():this.onCountRefresh()
                            } }/>)
                        } else {
                            return (
                                <FlatList
                                    data={this.state.items}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => item.scId}
                                    ListFooterComponent={<View style={{height: 75}}/>}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.isRefreshing}
                                            onRefresh={() => this.props.pageType===0?this.onMainRefresh():this.onCountRefresh()}
                                            tintColor={Color.colorBlueGrey}//ios
                                            title="刷新中..."//ios
                                            titleColor='white'
                                            colors={[Color.colorPrimary]}
                                            progressBackgroundColor="white"
                                        />}
                                    renderItem={({item}) => this.props.pageType === 0 ?
                                        <SwMainItem
                                            item={item}
                                            action={() => {
                                                if (item.scStatus === 0 || item.scStatus === 1 || item.scStatus === 3) {
                                                    this.props.nav.navigate("swAdd", {
                                                        memberType: this.props.memberType,
                                                        item: item,
                                                        refreshFunc: () => {
                                                            this.onMainRefresh()
                                                        }
                                                    });
                                                } else {
                                                    this.props.nav.navigate("swDetail", {
                                                        memberType: this.props.memberType,
                                                        item: item,
                                                        refreshFunc: () => {
                                                            this.onMainRefresh()
                                                        }
                                                    })
                                                }
                                            }
                                            }/>
                                        :
                                        <SwCountItem item={item} action={() => {
                                            this.props.nav.navigate('swSub', {
                                                memberType: this.props.memberType,
                                                account: item.UserName
                                            });//0normal/1audit/2check
                                        }}/>
                                    }
                                />
                            )
                        }
                    })()
                }
                {
                    (() => {
                        if (this.props.pageType === 0 && this.props.memberType.indexOf("0") > -1) {
                            return <FloatButton
                                color={Color.colorOrange}
                                drawable={require('../../drawable/add.png')}
                                action={() => {
                                    this.props.nav.navigate('swAdd', {
                                        refreshFunc: () => {
                                            this.onMainRefresh()
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