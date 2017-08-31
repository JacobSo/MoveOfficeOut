/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions, RefreshControl, ListView, Text, TouchableOpacity, InteractionManager,
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/AsApiService';
import Color from '../../constant/Color';
import FloatButton from "../Component/FloatButton";
import RefreshEmptyView from "../Component/RefreshEmptyView";
import SnackBar from 'react-native-snackbar-dialog'
import AsMainItem from "../Component/AsMainItem";

const {width, height} = Dimensions.get('window');

export default class AsMainPager extends Component {
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
            this.onRefresh();
        });
    }

    onRefresh() {
        this.setState({isRefreshing: true,});
        ApiService.getOrderList()
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
               if (responseJson.status===0) {
                    this.setState({
                        items: responseJson.data,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.data),
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

    getView() {
        if (this.state.items && this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                this.onRefresh()
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
                            onRefresh={() => this.onRefresh()}
                            tintColor={Color.colorBlueGrey}//ios
                            title="刷新中..."//ios
                            titleColor='white'
                            colors={[Color.colorPrimary]}
                            progressBackgroundColor="white"
                        />}
                    enableEmptySections={true}
                    renderRow={(rowData, rowID, sectionID) =>
                        <AsMainItem rowData={rowData} action={()=>{

                        }
                        }/>
                    }/>
            )
        }
    }
/*
    async  _search(text) {
        return this.state.items.filter((item) => (item.QualityNo.toLowerCase().indexOf(text.toLowerCase()) > -1));
    }*/

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={2}
                    title={["售后工作"]}
                    color={Color.colorAmber}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../../drawable/search.png")]}
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
                {this.getView()}
                <FloatButton
                    color={Color.colorAccent}
                    drawable={require('../../drawable/add.png')}
                    action={() => {
                        this.props.nav.navigate("asAdd")
                    }}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    tabView: {
        backgroundColor: Color.trans,
        width: width,
        height: height - 25 - 55,
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
