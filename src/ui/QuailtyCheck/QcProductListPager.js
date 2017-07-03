/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet, Dimensions, Alert, ListView, Text, TouchableOpacity, Image,

} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/QcApiService';
import Color from '../../constant/Color';
import FloatButton from "../Component/FloatButton";
import Toast from 'react-native-root-toast';
import Utility from "../../utils/Utility";
import Loading from 'react-native-loading-spinner-overlay';
import QcProductItem from "../Component/QcProductItem";
import Drawer from 'react-native-drawer'
import SnackBar from 'react-native-snackbar-dialog'

const {width, height} = Dimensions.get('window');

export default class QcProductListPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading:false,
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isRefreshing: false,
            multiTask: [],
            dataSourceMulti: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
        }
    }

    componentDidMount() {
        this.setState({
            items: this.props.task.Productlist,
            dataSource: this.state.dataSource.cloneWithRows(this.props.task.Productlist)
        })
    }

    drawerLayout() {
        return (
            <View style={{flex: 1, backgroundColor: Color.black_semi_transparent,}}>
                <Text style={{color: 'white', margin: 16, fontSize: 18}}>批量质检</Text>

                <ListView
                    style={styles.tabView}
                    dataSource={this.state.dataSourceMulti}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    renderRow={(rowData, rowID, sectionID) =>
                        <TouchableOpacity onPress={() => {
                            this.props.nav.navigate('qcSubmit',
                                {
                                    product: rowData,
                                    task: this.props.task,
                                    finishFuncMulti: (result) => {
                                        result.map((data, index) => {
                                            this.state.items[index].IsGetIn = data.IsGetIn;
                                            this.state.items[index].state = 1;

                                        });
                                        this.setState({
                                            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))
                                        })
                                    },
                                });
                            this.closeControlPanel();
                        }}>
                            <View style={{
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                width: width * 0.7,
                                alignItems: 'center',
                            }}>
                                <View style={{margin: 16, width: width * 0.6, height: 45}}>
                                    <Text style={{color: 'white'}}>批量型号：{JSON.stringify(rowData[0].ProductNo)}</Text>
                                    <Text style={{color: 'white'}}>批量总数：{rowData.length}</Text>
                                    <View style={{
                                        backgroundColor: Color.content,
                                        width: width * 0.8,
                                        height: 1,
                                        marginTop: 16,
                                        marginBottom: 16
                                    }}/>
                                </View>
                                <Image source={require('../../drawable/arrow.png')} style={{width: 10, height: 20,}}/>
                            </View>
                        </TouchableOpacity>
                    }/>
            </View>)
    }

    closeControlPanel = () => {
        this._drawer.close()
    };

    openControlPanel = () => {
        this._drawer.open()
    };

    getMultiData() {
        if (this.state.multiTask.length === 0) {
            //提取组别
            let group = [];
            this.props.task.Productlist.map((data) => {
                group.push(data.ProductNo);
            });
            group = Array.from(new Set(group));
            //分组
            group.map((groupName) => {
                let groupData = [];
                this.props.task.Productlist.map((item) => {
                    if (item.ProductNo === groupName) {
                        groupData.push(item);
                    }
                });
                this.state.multiTask.push(groupData);
            });
            //校验组别是否只有一个任务,
            this.state.multiTask.map((data, index) => {
                if (data.length < 2) {
                    this.state.multiTask.splice(index, 1)
                }
            });
            //  console.log(JSON.stringify(this.state.multiTask[0].length));
        }
        if (this.state.multiTask.length !== 0) {
            this.setState({dataSourceMulti: this.state.dataSourceMulti.cloneWithRows(this.state.multiTask)});
            this.openControlPanel();
        } else SnackBar.show("没有可以批量任务", {duration: 1000})
    }

    finishDialog() {
        let flag = false;
        this.state.items.map((data)=>{
            if(!flag){
                if(data.state===0){
                    flag = true;
                }
            }

        });
        if(flag){
            SnackBar.show("还有没完成的质检",{duration:2000});
            return
        }

        Alert.alert(
            "完成",
            "完成质检？",
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {text: '确认', onPress: () => this.finishTask()}
            ]
        )
    }

    finishTask() {
        this.setState({isLoading:true});
        ApiService.finishTaskOld(this.props.task.QualityNoGuid,'0.0','0.0')
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
                if (!responseJson.IsErr) {
                    SnackBar.show("提交成功", {duration: 3000});
                    this.props.refreshFunc();
                    this.props.nav.goBack(null)
                } else {
                    SnackBar.show(responseJson.ErrDesc, {duration: 3000});
                }
            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 3000});
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            }).done();
    }

    render() {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                content={this.drawerLayout()}
                type="static"
                tapToClose={true}
                side="right"
                openDrawerOffset={0.2}
                panCloseMask={0.2}>
                <View style={{
                    flex: 1,
                    backgroundColor: Color.background
                }}>
                    <Toolbar
                        elevation={0}
                        title={['产品列表', this.props.task.purchaseNo]}
                        color={Color.colorIndigo}
                        isHomeUp={true}
                        isAction={true}
                        isActionByText={true}
                        actionArray={['批量', '完成']}
                        functionArray={[
                            () => {
                                this.props.nav.goBack(null)
                            },
                            () => {
                                if (this.state.items.length > 1)
                                    this.getMultiData();
                                else
                                    SnackBar.show("没有可以批量任务", {duration: 1000})
                            },
                            () => {
                                this.finishDialog();
                            }
                        ]}/>
                    <ListView
                        ref="scrollView"
                        style={styles.tabView}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        enableEmptySections={true}
                        renderRow={(rowData, rowID, sectionID) =>
                            <QcProductItem product={rowData} func={() => {
                                this.props.nav.navigate('qcSubmit',
                                    {
                                        product: [rowData],
                                        task: this.props.task,
                                        finishFunc: (isStore, qcNum, passNum, storeNum) => {
                                            console.log('--------------------');
                                            this.state.items[sectionID].GetInQuantity = storeNum;
                                            this.state.items[sectionID].IsGetIn = isStore;
                                            this.state.items[sectionID].PassQty = passNum;
                                            this.state.items[sectionID].QualityQty = qcNum;
                                            this.state.items[sectionID].state = 1;
                                            this.setState({
                                                dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))
                                            })
                                        }

                                    })
                            }}/>
                        }/>
                    <Loading visible={this.state.isLoading}/>

                </View></Drawer>
        )
    }
}
const styles = StyleSheet.create(
    {
        tabView: {
            backgroundColor: Color.trans,
            width: width,
            height: height - 25 - 55 * 2
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
