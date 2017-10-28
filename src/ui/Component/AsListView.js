/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import RadioForm from 'react-native-simple-radio-button';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    ListView,
    RefreshControl,
    InteractionManager
} from 'react-native';
import RefreshEmptyView from "../Component/RefreshEmptyView";
import Color from "../../constant/Color"
import ApiService from '../../network/AsApiService';
import App from '../../constant/Application';
import SnackBar from 'react-native-snackbar-dialog'
import Utility from "../../utils/Utility";
import Loading from 'react-native-loading-spinner-overlay';
import AsMainItem from "./AsMainItem";
import FloatButton from "../Component/FloatButton";
const {width, height} = Dimensions.get('window');
const exList = ["全部", "已创建", "等待处理", "处理中", "提交审核", "已审核",];
const exListValue = ["", "created", "waitting", "service_approving", "service_approved", "manager_reviewing",];

export default class AsListView extends Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        nav: PropTypes.any.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            exType: [],
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isRefreshing: false,
            isLoading: false,
            radioValue: 0
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.onRefresh();
        });
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

    onRefresh() {
        this.setState({isRefreshing: true,});
        ApiService.getOrderList(this.props.type)
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

    async  _search(value) {
        return this.state.items.filter((item) => (item.status.toLowerCase().indexOf(exListValue[value].toLowerCase()) > -1));
    }

    render() {
        return <View style={{flex: 1,}}>
            {
                (() => {
                    if (App.workType === '开发专员' && this.props.classFunc()) {
                        return <RadioForm
                            buttonColor={Color.colorAmber}
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
                            style={styles.radioStyle}
                            onPress={(value) => {
                                this._search(value).then((array) => {
                                    //       console.log(array);
                                    this.setState({
                                        dataSource: this.state.dataSource.cloneWithRows(array),
                                    });
                                });
                                this.setState({
                                    radioValue: value,
                                });
                                this.props.changeClass(exList[value])
                            }}
                        />
                    } else {
                        return null;
                    }

                })()
            }

            {
                (() => {
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
                                        if (App.workType.indexOf("开发专员") > -1) {

                                            if (rowData.status === 'manager_reviewing' || rowData.status === 'manager_reviewed') {
                                                this.props.nav.navigate("asDetail", {
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
                                        } else {
                                            this.props.nav.navigate(this.props.type === "service_approving" || this.props.type === "waitting" ? "asSign" : "asDetail", {
                                                order: rowData,
                                                refreshFunc: () => {
                                                    this.onRefresh()
                                                },
                                            })
                                        }
                                    }
                                    }/>
                                }/>
                        )
                    }
                })()
            }
            {
                (() => {
                    //   console.log(App.workType);
                    if (App.workType.indexOf("开发专员") > -1) {
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
    },
    radioStyle: {
        marginLeft: 16,
        marginBottom: 16,
        width: width - 32,
        backgroundColor: 'white',
        paddingTop: 16,
        paddingLeft: 16,
        elevation: 2
    },
});