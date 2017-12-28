/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions, RefreshControl, ListView, Text, TouchableOpacity, InteractionManager,
    TouchableWithoutFeedback
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/QcApiService';
import Color from '../../constant/Color';
import FloatButton from "../Component/FloatButton";
import SQLite from '../../db/Sqlite';
import RefreshEmptyView from "../Component/RefreshEmptyView";
import SnackBar from 'react-native-snackbar-dialog'

const {width, height} = Dimensions.get('window');
let sqLite = new SQLite();

export default class QcMainPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isRefreshing: false,
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

            sqLite.createQcTable();
            this._onRefresh();
        });
    }

    getDataLocal() {
        this.setState({isRefreshing: true});
        sqLite.getQcData().then((results) => {
            this.setState({isRefreshing: false});
            if (results.length !== 0) {
                this.setState({
                    items: results,
                    dataSource: this.state.dataSource.cloneWithRows(results),
                    isRefreshing: false,
                });
            } else
                this._onRefresh();
        }).catch((err) => {
            this.setState({isRefreshing: false});
            SnackBar.show("出错了，请稍后再试");
        }).done();
    }

    _onRefresh() {
        this.setState({isRefreshing: true,});
        ApiService.getProductListOld()
            .then((responseJson) => {
                sqLite.insertQcData(responseJson.data);//save in db
                if (!responseJson.IsErr) {
                    this.setState({
                        items: responseJson.QNlist,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.QNlist),
                        isRefreshing: false,
                    });
                } else {
                    this.setState({isRefreshing: false,});
                    SnackBar.show(responseJson.ErrDesc, {duration: 3000})
                }
            })
            .catch((error) => {
                this.setState({isRefreshing: false,});
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 3000})
            }).done();
    }

    _getView() {
        if (this.state.items && this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                this._onRefresh()
            } }/>)
        } else {
            return (
                <ListView
                    ref="scrollView"
                    style={styles.tabView}
                    dataSource={this.state.dataSource}
                    removeClippedSubviews={false}
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
                    enableEmptySections={true}
                    renderRow={(rowData, rowID, sectionID) =>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.nav.navigate('qcList', {
                                    task: rowData,
                                    refreshFunc: () => {
                                        this._onRefresh()
                                    }
                                });
                            }}>
                            <View style={styles.itemCard}>
                                <View style={styles.itemText}>
                                    <Text>{'质检单'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{rowData.QualityNo}
                                    </Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'供应商'}</Text>
                                    <Text style={{color: Color.black_semi_transparent,width:200,textAlign :'right'}}>{rowData.Supplier}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'分配时间'}</Text>
                                    <Text style={{color: Color.black_semi_transparent}}>{rowData.CreateTime}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'同步时间'}</Text>
                                    <Text style={{color: Color.black_semi_transparent}}>{rowData.LockTime}</Text>
                                </View></View>
                        </TouchableOpacity>
                    }/>
            )
        }
    }

    async  _search(text) {
        return this.state.items.filter((item) => (item.QualityNo.toLowerCase().indexOf(text.toLowerCase()) > -1));
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={2}
                    title={["常规质检"]}
                    color={Color.colorIndigo}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../../drawable/search.png"), require("../../drawable/car_ico.png")]}
                    functionArray={[
                        () => {
                            if (this.state.isSearch) {
                                this.setState({
                                    isSearch: !this.state.isSearch,
                                    isHeader: true
                                })
                            } else this.props.nav.goBack(null)
                        },
                        () => {
                            this.setState({isSearch: !this.state.isSearch})
                        },
                        () => this.props.nav.navigate("qcCar")
                    ]}
                    isSearch={this.state.isSearch}
                    searchFunc={(text) => {
                        this._search(text).then((array) => {
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(array),
                            });
                        })
                    }}
                />
                {this._getView()}
                <FloatButton
                    color={Color.colorPink}
                    drawable={require('../../drawable/finger_print.png')}
                    action={() => {
                        this.props.nav.navigate("qcSign")
                    }}/>
            </View>
        )
    }
}
const styles = StyleSheet.create(
    {
        tabView: {
            backgroundColor: Color.trans,
            width: width,
            height: height - 25 - 55 ,
        },


        itemCard: {
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            elevation: 2,
            marginBottom: 32,
            marginLeft: 16,
            marginRight: 16,
            marginTop: 10,
            paddingBottom: 10
        },
        itemText: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: width - 32,
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10
        }
    });
