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
import Loading from 'react-native-loading-spinner-overlay';
import QcProductItem from "../Component/QcProductItem";
import Drawer from 'react-native-drawer'
import SnackBar from 'react-native-snackbar-dialog'

const {width, height} = Dimensions.get('window');

export default class QcProductListPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isMulti: false,
            selectNum: 0,
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
        this.initData();
    }

    initData() {
        this.props.task.Productlist.map((data) => {
            data.check = false;
        });
        this.setState({
            isMulti: false,
            selectNum: 0,
            items: this.props.task.Productlist,
            dataSource: this.state.dataSource.cloneWithRows(this.props.task.Productlist)
        })
    }

    /*  drawerLayout() {
     return (
     <View style={{flex: 1, backgroundColor: Color.drawerColor,}}>
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
     let groupTemp = [];
     this.props.task.Productlist.map((data) => {
     group.push(data.ProductNo);
     });
     group = Array.from(new Set(group));
     //           console.log("group:" + JSON.stringify(group));
     //分组
     group.map((groupName) => {
     let groupData = [];
     this.props.task.Productlist.map((item) => {
     if ((item.Quantity === 1) && (item.ProductNo === groupName)) {
     groupData.push(item);
     }
     });
     groupTemp.push(groupData);
     });
     //   console.log("group content:" + JSON.stringify(this.state.multiTask));

     //校验组别是否只有一个任务,
     groupTemp.map((data) => {
     //   console.log("remove content:" + JSON.stringify(data));
     if (data.length > 2) {
     // console.log("remove content:"+JSON.stringify( data));
     this.state.multiTask.push(data)
     }
     });
     }
     console.log("remove content:" + JSON.stringify(this.state.multiTask));
     if (this.state.multiTask.length !== 0) {
     this.setState({dataSourceMulti: this.state.dataSourceMulti.cloneWithRows(this.state.multiTask)});
     this.openControlPanel();
     } else SnackBar.show("没有可以批量任务", {duration: 1000})
     }
     */
    finishDialog() {
        let flag = false;
        this.state.items.map((data) => {
            if (!flag) {
                if (data.state === 0) {
                    flag = true;
                }
            }

        });
        if (flag) {
            SnackBar.show("还有没完成的质检", {duration: 2000});
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
        this.setState({isLoading: true});
        ApiService.finishTaskOld(this.props.task.QualityNoGuid, '0.0', '0.0')
            .then((responseJson) => {
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
            /*            <Drawer
             ref={(ref) => this._drawer = ref}
             content={this.drawerLayout()}
             tapToClose={true}
             type="overlay"
             side="right"
             openDrawerOffset={0.2}
             panCloseMask={0.2}>*/
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={2}
                    title={this.state.isMulti ? ['批量质检'] : [this.props.task.QualityNo, '产品列表']}
                    color={this.state.isMulti ? Color.colorRed : Color.colorIndigo}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={this.state.isMulti ? ['全选', '开始质检(' + this.state.selectNum + ')'] : ['批量', '完成']}
                    functionArray={[
                        () => {
                            if (this.state.isMulti) {
                                this.initData();
                            } else {
                                this.props.nav.goBack(null);
                            }
                        },
                        () => {
                            /*                        if (this.state.items.length > 1)
                             this.getMultiData();
                             else
                             SnackBar.show("没有可以批量任务", {duration: 1000})*/

                            if (this.state.isMulti) {
                                let temp = !this.state.items[0].check;
                                this.state.items.map((data) => {
                                    data.check = temp;
                                });
                                this.setState({
                                    selectNum:temp?this.state.items.length:0,
                                    isMulti:temp,
                                    dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))
                                })
                            }
                            else {
                                if (this.state.items.length > 1)
                                    this.setState({isMulti: true});
                                else
                                    SnackBar.show("批量质检至少两个批次")
                            }

                        },
                        () => {
                            if (this.state.isMulti) {
                                if (this.state.selectNum > 1) {
                                    let multiTaskTemp = [];
                                    let typeTemp = null;
                                    let allSame = true;
                                    this.state.items.map((data) => {
                                        if (data.check) {
                                            if (typeTemp === null)
                                                typeTemp = data.QualityType;
                                            allSame = (typeTemp === data.QualityType);
                                            multiTaskTemp.push(data);
                                        }
                                    });
                                    if (allSame) {
                                        this.props.nav.navigate('qcSubmit',
                                            {
                                                product: multiTaskTemp,
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
                                        this.initData();
                                    } else SnackBar.show("批量类型必须相同");
                                } else SnackBar.show("批量至少选择2个")

                            } else {
                                this.finishDialog();

                            }
                        }
                    ]}/>
                <ListView
                    ref="scrollView"
                    style={styles.tabView}
                    dataSource={this.state.dataSource}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    renderRow={(rowData, sectionID, rowID) =>
                        <View
                            style={{backgroundColor: rowData.check ? Color.colorPrimary : Color.trans,}}>
                            <QcProductItem product={rowData} func={() => {
                                if (this.state.isMulti) {
                                    let temp = this.state.selectNum;//select
                                    this.state.items[rowID].check = !this.state.items[rowID].check;
                                    if (this.state.items[rowID].check)
                                        ++temp;
                                    else --temp;
                                    this.setState({
                                        selectNum: temp,
                                        isMulti: temp !== 0,
                                        dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),
                                    });
                                } else {
                                    this.props.nav.navigate('qcSubmit',
                                        {
                                            product: [rowData],
                                            task: this.props.task,
                                            finishFunc: (isStore, qcNum, passNum, storeNum) => {
                                                // console.log('--------------------');
                                                this.state.items[rowID].GetInQuantity = storeNum;
                                                this.state.items[rowID].IsGetIn = isStore;
                                                this.state.items[rowID].PassQty = passNum;
                                                this.state.items[rowID].QualityQty = qcNum;
                                                this.state.items[rowID].state = 1;
                                                this.setState({
                                                    dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))
                                                })
                                            }

                                        })
                                }

                            }}/></View>
                    }/>
                <Loading visible={this.state.isLoading}/>

            </View>
            //</Drawer>
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
