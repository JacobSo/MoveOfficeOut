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
import App from '../../constant/Application';
import Loading from 'react-native-loading-spinner-overlay';

const {width, height} = Dimensions.get('window');
export default class AsMainPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exType: [],
            listFlag: App.workType === "售后专员" ? "service_approving" : "waitting",
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isRefreshing: false,
            isLoading: false,
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.onRefresh();
        });
    }

    onRefresh() {
        this.setState({isRefreshing: true,});
        ApiService.getOrderList(this.state.listFlag)
            .then((responseJson) => {
                if (responseJson.status === 0) {
                    this.setState({
                        items: responseJson.data,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.data),
                        isRefreshing: false,
                    });
                } else {
                    this.setState({isRefreshing: false,});
                    SnackBar.show(responseJson.message, {duration: 3000})
                }
            })
            .catch((error) => {
                this.setState({isRefreshing: false,});
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 3000})
            }).done();
    }

    getAddType(order) {
        this.setState({isLoading: true,});
        ApiService.getProblemType()
            .then((responseJson) => {
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
                if (responseJson.status === 0) {
                    this.state.exType = responseJson.data;
                    this.props.nav.navigate("asAdd", {
                        order: order,
                        exType: responseJson.data,
                        refreshFunc: () => {
                            this.onRefresh()
                        },
                    });
                } else {
                    SnackBar.show(responseJson.message, {duration: 3000})
                }
            })
            .catch((error) => {
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 3000})
            }).done();

    }

    getView() {
        if (this.state.items && this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing}
                                      onRefreshFunc={() => {
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
                        <AsMainItem rowData={rowData} action={() => {
                            if (App.workType === "售后专员") {
                                this.props.nav.navigate("asSign", {
                                    order: rowData,
                                    refreshFunc: () => {
                                        this.onRefresh()
                                    },

                                })
                            } else {
                                if (this.state.exType.length !== 0) {
                                    this.props.nav.navigate("asAdd", {
                                        exType: this.state.exType,
                                        order: rowData,
                                        refreshFunc: () => {
                                            this.onRefresh()
                                        },

                                    })
                                } else this.getAddType(rowData)
                            }
                        }
                        }/>
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
                    elevation={2}
                    title={["售后工作"]}
                    color={Color.colorAmber}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[]}
                    functionArray={[
                        () => this.props.nav.goBack(null)
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
                {
                    (() => {
                        //   console.log(App.workType);
                        if (App.workType !== "售后专员") {
                            return <FloatButton
                                color={Color.colorAccent}
                                drawable={require('../../drawable/add.png')}
                                action={() => {
                                    if (this.state.exType.length !== 0) {
                                        this.props.nav.navigate("asAdd", {
                                            exType: this.state.exType,
                                            refreshFunc: () => {
                                                this.onRefresh()
                                            },
                                        });
                                    } else {
                                        this.getAddType(null)
                                    }
                                }}/>
                        }
                    })()
                }
                <Loading visible={this.state.isLoading}/>

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
