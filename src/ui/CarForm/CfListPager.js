/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions, ListView, Text, TouchableOpacity, Alert,
    DeviceEventEmitter, Image, TextInput, ScrollView, KeyboardAvoidingView, RefreshControl
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/CfApiService';
import Color from '../../constant/Color';
import Loading from 'react-native-loading-spinner-overlay'
import SnackBar from 'react-native-snackbar-dialog'
import DatePicker from '../../ui/Component/DatePicker';
import RefreshEmptyView from "../Component/RefreshEmptyView";
import QcCarCreatePager from "./CfCreatePager";
import QcCarItem from "../Component/QcCarItem";
import CfCarItem from "../Component/CfCarItem";
import App from '../../constant/Application';

const {width, height} = Dimensions.get('window');

export default class CfListPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isRefreshing: false,
        }
    }

    componentDidMount() {
        this.getCar();
    }

    getCar() {
        this.setState({isRefreshing: true});
        ApiService.getList((App.workType === '保安' ? '1,2' : '0,1,2,4'), '').then((responseJson) => {
            this.setState({isRefreshing: false});
            if (!responseJson.isErr) {
                this.setState({
                    items: responseJson.data,
                    dataSource: this.state.dataSource.cloneWithRows(responseJson.data)
                });
            } else {
                SnackBar.show(responseJson.errDesc);
            }
        })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
                this.setState({isRefreshing: false});
            }).done();
    }

    deleteCar(guid) {
        Alert.alert(
            '取消用车',
            '是否取消用车，删除本申请',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.dismissOrder(guid)
                        .then((responseJson) => {
                            this.setState({isLoading: false})
                            if (!responseJson.isErr) {
                                this.getCar();
                                SnackBar.show("删除成功");
                            } else {
                                SnackBar.show(responseJson.errDesc);

                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            SnackBar.show("出错了，请稍后再试");
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                        }).done();
                }
                },
            ]
        )
    }

    getView() {
        if (this.state.items && this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                this.getCar()
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
                            onRefresh={() => this.getCar()}
                            tintColor={Color.colorBlueGrey}//ios
                            title="刷新中..."//ios
                            titleColor='white'
                            colors={[Color.colorPrimary]}
                            progressBackgroundColor="white"
                        />}
                    enableEmptySections={true}
                    renderRow={(rowData, rowID, sectionID) => {
                        console.log(JSON.stringify(rowData));
                        return App.workType === '保安' ?
                            <TouchableOpacity
                                style={{
                                    margin: 16,
                                    backgroundColor: Color.colorIndigoDark,
                                    borderRadius: 10,
                                    elevation: 5,
                                    padding: 16
                                }}
                                onPress={() => {
                                    this.props.nav.navigate("cfSign", {
                                        carInfo: rowData,
                                        finishFunc: () => {
                                            this.getCar()
                                        }
                                    })
                                }}>
                                <Text style={{fontSize: 20, color: 'white', margin: 16}}>{rowData.carNum}</Text>
                                <Text style={{margin: 16, color: 'white'}}>{'用车人：' + rowData.account}</Text>
                                <Image style={{position: 'absolute', alignContent: 'center', right: -55, top: 0}}
                                       source={require('../../drawable/car_image.png')}/>
                            </TouchableOpacity> : <CfCarItem carInfo={rowData} deleteCar={() => {
                                this.deleteCar(rowData.billNo)
                            }}/>


                    }

                    }/>
            )
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>
                <Toolbar
                    elevation={5}
                    title={["我的用车"]}
                    color={Color.colorBlueGrey}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={[App.workType==='保安'?'':'创建']}
                    functionArray={[
                        () => this.props.nav.goBack(null),
                        () => this.props.nav.navigate("cfCreate", {
                            finishFunc: () => {
                                this.getCar()
                            }
                        })

                    ]}/>
                {this.getView()}
                <Loading visible={this.state.isLoading}/>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    button: {
        width: width - 32,
        height: 45,
        backgroundColor: Color.colorAccent,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        width: width - 32,
        marginRight: 10,
        borderColor: Color.colorAccent,
        borderBottomWidth: 1,
    },
    selection: {
        width: 55,
        height: 5,
        marginTop: 16,
        marginBottom: 16
    }
});