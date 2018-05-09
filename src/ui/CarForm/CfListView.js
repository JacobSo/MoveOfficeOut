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
import RefreshEmptyView from "../Component/RefreshEmptyView";
import CfCarItem from "../Component/CfCarItem";
import App from '../../constant/Application';
import FloatButton from "../Component/FloatButton";
import Utility from "../../utils/Utility";
const statusText = ['待审核', '待分配', '未出车', '已出车', '已结束', '审核失败', '分配失败', '放弃用车'];

const {width, height} = Dimensions.get('window');

export default class CfListView extends Component {
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

    detailView(rowData) {
        Alert.alert(
            '用车详细',

            '用车单号：' + rowData.billNo + '\n' +
            '状态：' + statusText[rowData.status] + '\n' +
            '车辆类型：' + (rowData.carType === 0 ? "公司车辆" : "私人车辆") + '\n' +
            '车牌号码：' + (rowData.carNum) + '\n\n' +

            '申请时间：' + Utility.replaceT(rowData.createTime) + '\n' +
            '用车日期：' + Utility.replaceT(rowData.tripTime) + '\n' +
            '申请人：' + rowData.account + '\n\n' +

            '目的地：' + rowData.tripTarget + '\n' +
            '外出范围：' + (rowData.tripArea ? "佛山外" : "佛山内") + '\n' +
            '预计里程：' + rowData.tripDistance + '\n' +

            (rowData.carPower ? ('排量：' + rowData.carPower) : '') + '\n' +
            '随行人员：' + (rowData.tripMember ? rowData.tripMember : '') + '\n' +
            '加油卡：' + (rowData.needCard ? "需要" : "不需要") + '\n' +
            '备注：' + (rowData.remark ? rowData.remark : '') + '\n\n' +

            '起始里程：' + (rowData.beginPoint ? rowData.beginPoint : '') + '\n' +
            '结束里程：' + (rowData.endPoint ? rowData.endPoint : '') + '\n',

            //  '工号：'+rowData.workNum+'\n',
            [
                {
                    text: '驳回', onPress: () => {
                    this.confirmCar(rowData.billNo, 2)
                }
                },
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '通过', onPress: () => {
                    this.confirmCar(rowData.billNo, 1)
                }
                },

            ]
        )
    }

    getCar() {
        this.setState({isRefreshing: true});
        (App.workType==='人事部'?ApiService.getDetail('',this.props.type):ApiService.getList(this.props.type))
            .then((responseJson) => {
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

    confirmCar(guid, type) {
        let now = new Date().getHours();
        if ((now >= 11 && App.workType === '人事部') || now < 11 && App.workType !== '人事部') {
            Alert.alert(
                type === 1 ? '通过' : '驳回',
                type === 1 ? '通过车辆申请单，进入分配车辆流程' : '驳回车辆申请单，车辆申请结束',
                [
                    {
                        text: '取消', onPress: () => {
                    }
                    },
                    {
                        text: '确定', onPress: () => {
                        this.setState({isLoading: true});
                        ApiService.confirmOrder(guid, type)//2reject
                            .then((responseJson) => {
                                this.setState({isLoading: false})
                                if (!responseJson.isErr) {
                                    this.getCar();
                                    SnackBar.show("审核成功");
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
        } else SnackBar.show('非审核时间段');

    }

    getItemView(rowData) {
        if (App.workType === '保安') {
            return <TouchableOpacity
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
            </TouchableOpacity>
        } else if (rowData.creator === App.account) {
            return <CfCarItem carInfo={rowData} actionText={'删除'} actionFunc={
                () => this.deleteCar(rowData.billNo)
            }/>
        } else {
            return <TouchableOpacity style={{
                //  backgroundColor: '#CFD8DC',
                backgroundColor: 'white',
                borderRadius: 10,
                width: width - 32,
                margin: 16,
                elevation: 2,

            }} onPress={() => {
                this.detailView(rowData);
            }}>
                <View style={{
                    backgroundColor: '#CFD8DC',
                    padding: 16,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                }}>
                    <Text style={{
                        fontSize: 18,
                    }}>{rowData.carType === 0 ? '公司车辆' : '私人车辆'}</Text>
                    <Text style={{
                        fontSize: 25,

                    }}>{'申请人：' + rowData.creator}</Text>
                </View>
                {/*      <View style={{
                 backgroundColor: Color.line,
                 width: 200,
                 height: 1,
                 marginTop: 16,
                 marginBottom: 16
                 }}/>*/}
                <View style={{padding: 16}}>

                    <Text style={{
                        fontSize: 15
                    }}>{'用车时间：' + Utility.replaceT(rowData.tripTime)}</Text>
                    <Text >
                        {'目的地：' + rowData.tripTarget}
                    </Text>
                    <Text >{rowData.Remark}</Text>
                </View>
            </TouchableOpacity>
        }
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
                    renderRow={(rowData, rowID, sectionID) => this.getItemView(rowData)}/>
            )
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>

                {this.getView()}
                {
                    (() => {
                        if (App.workType !== '保安' && this.props.type === '0,1,2,3') {
                            return (
                                <FloatButton drawable={require('../../drawable/add.png')}
                                             action={() => this.props.nav.navigate("cfCreate", {
                                                 finishFunc: () => {
                                                     this.getCar()
                                                 }
                                             })}/>)
                        } else return null;
                    })()
                }
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