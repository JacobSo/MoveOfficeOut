/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet, Dimensions, ScrollView, RefreshControl, ListView, Text, TouchableOpacity,

} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/WpApiService';
import Color from '../../constant/Color';
import FloatButton from "../Component/FloatButton";
import Toast from 'react-native-root-toast';
import Utility from "../../utils/Utility";

const {width, height} = Dimensions.get('window');

export default class WpMainPager extends Component {
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
        this._onRefresh();
    }

    _onRefresh() {
        this.setState({isRefreshing: true,})
        ApiService.getList(0)
            .then((responseJson) => {
                console.log(responseJson);
                if (!responseJson.IsErr) {
                    console.log(responseJson);
                    this.setState({
                        items: responseJson.list,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.list),
                        isRefreshing: false,
                    });
                } else Toast.show(responseJson.ErrDesc);
            })
            .catch((error) => {
                console.log(error);
                Toast.show("出错了，请稍后再试");
            }).done();
    }

    _getView() {
        if (this.state.items && this.state.items.length === 0) {
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this._onRefresh()}
                            tintColor={Color.colorBlueGrey}//ios
                            title="Loading..."//ios
                            titleColor='white'
                            colors={[Color.colorPrimary]}
                            progressBackgroundColor="white"
                        />
                    }>
                    <View
                        style={styles.card}>
                        <Text>没有数据</Text>
                    </View></ScrollView>)
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
                                this.props.nav.navigate('wpWork', {
                                    task: rowData,
                                    refreshFunc:()=>{
                                        this._onRefresh()
                                    }
                                });
                            }}
                            style={styles.itemCard}>
                            <Text style={{
                                textAlign: 'center',
                                width: width - 32,
                                padding: 5,
                                color: 'white',
                                backgroundColor: rowData.ReviewType === 1 ? Color.colorTeal : Color.colorAmber
                            }}>
                                {rowData.ReviewType === 1 ? '软体评审' : '板木评审'}</Text>
                            <View style={styles.itemText}>
                                <Text>{'评审时间'}</Text>
                                <Text
                                    style={{color: Color.black_semi_transparent}}>{Utility.getTime(rowData.ReviewDate)}</Text>
                            </View>
                            <View style={styles.itemText}>
                                <Text>{'供应商'}</Text>
                                <Text style={{color: Color.black_semi_transparent}}>{rowData.FacName}</Text>
                            </View>
                            {
                                (() => {
                                    if (rowData.ReviewType === 0) {
                                        return (  <View style={styles.itemText}>
                                            <Text>{'系列'}</Text>
                                            <Text style={{color: Color.black_semi_transparent}}>{rowData.Series}</Text>
                                        </View>)
                                    }

                                })()
                            }
                            <View style={styles.itemText}>
                                <Text>{'产品数'}</Text>
                                <Text style={{color: Color.black_semi_transparent}}>{rowData.productlist.length}</Text>
                            </View>
                        </TouchableOpacity>
                    }/>
            )
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar
                    elevation={0}
                    title={["评审单"]}
                    color={Color.colorPurple}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },

                    ]}/>
                {this._getView()}
                <FloatButton
                    color={Color.colorOrange}
                    drawable={require('../../drawable/add.png')}
                    action={() => {
                        this.props.nav.navigate('wpWork',{
                            refreshFunc:()=>{
                                this._onRefresh()
                            }
                        });
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
        },
        card: {
            borderWidth: 1,
            backgroundColor: 'white',
            borderColor: Color.trans,
            margin: 16,
            height: 55,
            padding: 15,
            shadowColor: Color.background,
            shadowOffset: {width: 2, height: 2,},
            shadowOpacity: 0.5,
            shadowRadius: 3,
            alignItems: 'center',
            elevation: 2
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
