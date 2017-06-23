/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet, Dimensions, ScrollView, Alert, ListView, Text, Image, TouchableOpacity, Switch, TextInput, Platform

} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/WpApiService';
import Color from '../../constant/Color';
import Toast from 'react-native-root-toast';
import Loading from 'react-native-loading-spinner-overlay';
import DatePicker from "../Component/DatePicker";
import {WpProductItem} from "../Component/WpProductItem";
import AndroidModule from '../../module/AndoridCommontModule'
import IosModule from '../../module/IosCommontModule'
import Utility from "../../utils/Utility";
const {width, height} = Dimensions.get('window');

export default class WpWorkPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModify: false,
            isLoading: false,
            isCarVisible: false,
            isWood: false,
            Series: "",
            SupplierName: "",
            date: "",
            memberText: "",
            isNeedCar: false,
            items: {},
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),

            submitPic: [],
            submitProduct: [],
        }
    }

    componentDidMount() {//001-1,010-2,011-3,100-4,101-5,110-6,111-7
        if (this.props.task) {
            this.props.task.productlist.map((data) => {
                let temp = [];
                switch (data.Stage) {
                    case 1:
                        temp = [false, false, true];
                        break;
                    case 2:
                        temp = [false, true, false];
                        break;
                    case 3:
                        temp = [false, true, true];
                        break;
                    case 4:
                        temp = [true, false, false];
                        break;
                    case 5:
                        temp = [true, false, true];
                        break;
                    case 6:
                        temp = [true, true, false];
                        break;
                    case 7:
                        temp = [true, true, true];
                        break;
                }
                data.selectStep = temp;
                this.state.items[data.Id] = data;
            });


            this.setState({
                isModify: true,
                isWood: this.props.task.ReviewType === 0,
                date: Utility.getTime(this.props.task.ReviewDate),
                isNeedCar: this.props.task.IsApplyCar,
                memberText: this.props.task.FollowPeson,
                Series: this.props.task.Series,
                SupplierName: this.props.task.FacName,
                dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))
            })
        }
    }

    pack() {
        let isAllFinish = true;
        let temp = [];
        let picTemp = [];
        for (let Id in this.state.items) {
            let data = this.state.items[Id];
            //  console.log(JSON.stringify(data));
            if (data.selectStep && (data.selectStep.indexOf(true) > -1)) {
                temp.push({
                    id: this.state.isModify ? data.poldid : data.Id,
                    stage: JSON.stringify(data.selectStep)
                })
            } else {
                isAllFinish = false
            }

            if (data.pics) {
                data.pics.map((pic) => {
                    //console.log(JSON.stringify(pic));
                    picTemp.push({
                        path: pic.uri.replace('file://', ''),
                        id: this.state.isModify ? data.poldid : data.Id,
                        imgCode: '',
                        fileName: pic.fileName,
                        reviewbillguid: '',
                        poldid: data.poldid,
                    })
                })
            }
        }
        /* this.state.items.map((data) => {

         });*/
        if (isAllFinish) {
            this.state.submitProduct = temp;
            this.state.submitPic = picTemp;

        }
        return isAllFinish
    }

    postDialog() {
        // console.log(JSON.stringify(this.state.items));
        if (!Object.getOwnPropertyNames(this.state.items).length) {
            Toast.show("请选择评审产品");
            return
        }

        if (!this.state.date) {
            Toast.show("请选择评审时间");
            return
        }

        if (!this.state.isWood && !this.state.SupplierName) {
            Toast.show("请选择供应商");
            return
        }
        if (this.state.isWood && (!this.state.Series || !this.state.SupplierName)) {
            Toast.show("请选择系列和供应商");
            return
        }

        if (!this.pack()) {
            Toast.show("请选择每一个产品的评审阶段");
            return
        }

        Alert.alert(
            '确认上传',
            '是否提交，包含图片共' + this.state.submitPic.length + "张",
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    // console.log(JSON.stringify(this.state.items))
                    this.pack();
                    this.postText();
                }
                },
            ]
        )
    }

    postText() {
        this.setState({isLoading: true});

        this.createOrModifyReq().then((responseJson) => {
            console.log(JSON.stringify(responseJson));
            if (!responseJson.IsErr) {
                if (this.state.submitPic.length !== 0)
                    this.postImage(responseJson.ReviewBillGuid);
                else {
                    Toast.show("提交成功");
                    this.props.refreshFunc();
                    this.props.nav.goBack(null)
                }
            } else {
                Toast.show(responseJson.ErrDesc)
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            }
        })
            .catch((error) => {
                console.log(error);
                Toast.show("出错了，请稍后再试");
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            })
            .done()
    }

    createOrModifyReq() {
        if (this.state.isModify) {
            return ApiService.modifyWork(
                this.props.task.Guid,
                this.state.Series,
                this.state.isNeedCar ? 1 : 0,
                this.state.SupplierName,
                this.state.date,
                this.state.memberText,
                this.state.isWood ? 0 : 1,
                JSON.stringify(this.state.submitProduct))
        } else {
            return ApiService.createWork(this.state.Series,
                this.state.isNeedCar ? 1 : 0,
                this.state.SupplierName,
                this.state.date,
                this.state.memberText,
                this.state.isWood ? 0 : 1,
                JSON.stringify(this.state.submitProduct))
        }
    }

    postImage(mainId) {
        if (Platform.OS === 'android') {
            this.state.submitPic.map((data, index) => {
                AndroidModule.getImageBase64(data.path, (callBackData) => {
                    this.postImgReq(data, index, callBackData, mainId);
                });
            })
        } else {
            this.state.submitPic.map((data, index) => {
                IosModule.getImageBase64(data.path, (callBackData) => {
                    this.postImgReq(data, index, callBackData, mainId);

                })
            });
        }
    }

    postImgReq(data, index, callBackData, mainId) {
        ApiService.uploadImamge(
            data.id,
            callBackData,
            data.fileName,
            this.state.isModify ? this.props.task.Guid : mainId)
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                if (!responseJson.IsErr) {
                    if (index === this.state.submitPic.length - 1) {
                        Toast.show("提交成功");
                        this.props.refreshFunc();
                        this.props.nav.goBack(null)
                    }
                } else {
                    Toast.show(responseJson.ErrDesc);
                    if (index === this.state.submitPic.length - 1) {
                        setTimeout(() => {
                            this.setState({isLoading: false})
                        }, 100);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                Toast.show("出错了，请稍后再试");
                if (index === this.state.submitPic.length - 1) {
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
            }).done();
    }

    submitWork() {
        Alert.alert(
            '确认提交',
            '提交后不可修改',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.submitWork(this.props.task.Guid)
                        .then((responseJson) => {
                            console.log(JSON.stringify(responseJson));
                            if (!responseJson.IsErr) {
                                Toast.show("提交成功");
                                this.props.refreshFunc();
                                this.props.nav.goBack(null)
                            } else{
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                                Toast.show(responseJson.ErrDesc);

                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                            Toast.show("出错了，请稍后再试");
                        }).done();
                }
                },
            ]
        )
    }

    deleteWork() {
        Alert.alert(
            '删除',
            '删除后不可恢复',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.deleteWork(this.props.task.Guid)
                        .then((responseJson) => {
                            console.log(JSON.stringify(responseJson));
                            if (!responseJson.IsErr) {
                                Toast.show("删除成功");
                                this.props.refreshFunc();
                                this.props.nav.goBack(null)
                            } else{
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                                Toast.show(responseJson.ErrDesc);

                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                            Toast.show("出错了，请稍后再试");
                        }).done();
                }
                },
            ]
        )
    }

    _carView() {
        if (this.state.isCarVisible) {
            return (
                <View>
                    <View style={{flexDirection: 'row', width: width, justifyContent: 'space-between',}}>
                        <Text style={{margin: 16, paddingLeft: 16, color: 'white', textAlign: "center"}}>申请车辆</Text>
                        <Switch
                            style={{marginRight: 32}}
                            onValueChange={(value) => this.setState({isNeedCar: value})}
                            onTintColor={Color.colorAccent}
                            value={this.state.isNeedCar}/>
                    </View>

                    <TextInput style={styles.textRemark}
                               placeholder="陪同人"
                               placeholderTextColor={Color.background}
                               onChangeText={(text) => this.setState({memberText: text})}
                               multiline={true}
                               underlineColorAndroid="transparent"
                               returnKeyType={'done'}
                               blurOnSubmit={true}
                               value={this.state.memberText}/>
                </View>
            )
        } else {
            return ( null)
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
                    title={["评审申请"]}
                    color={Color.colorPurpleDark}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={this.state.isModify ? ["修改", "提交"] : ["创建"]}
                    functionArray={[
                        () => {
                            Alert.alert(
                                '退出创建？',
                                '放弃当编辑的工作？退出后不可恢复',
                                [
                                    {
                                        text: '取消', onPress: () => {
                                    }
                                    },
                                    {
                                        text: '确定', onPress: () => {
                                        this.props.nav.goBack(null)
                                    }
                                    },
                                ]
                            );
                        },
                        () => {
                            this.postDialog();
                        },
                        () => {
                            this.submitWork();
                        }
                    ]}/>
                <ScrollView >
                    <View style={{
                        backgroundColor: Color.background
                    }}>
                        <ScrollView>
                            <View style={{
                                flexDirection: 'column',
                                backgroundColor: Color.colorPurpleDark,
                                alignItems: 'center',
                            }}>
                                <View style={[styles.control, {justifyContent: 'space-between'}]}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image style={styles.ctrlIcon} source={require('../../drawable/switch.png')}/>
                                        <Text style={ {
                                            color: 'white',
                                        }}>{this.state.isWood ? '板木评审' : '软体评审'}</Text>
                                    </View>
                                    <Switch
                                        style={{marginRight: 16,}}
                                        onValueChange={(value) => {
                                            if (Object.getOwnPropertyNames(this.state.items).length) {
                                                Alert.alert(
                                                    '切换评审',
                                                    '你已经选择了产品，切换会清空已选产品，是否继续？',
                                                    [
                                                        {
                                                            text: '取消', onPress: () => {
                                                        }
                                                        },
                                                        {
                                                            text: '确定', onPress: () => {
                                                            this.state.items = {};
                                                            this.setState({
                                                                isWood: value,
                                                                dataSource: this.state.dataSource.cloneWithRows([])
                                                            })
                                                        }
                                                        },
                                                    ]
                                                )
                                            } else this.setState({isWood: value})
                                        }}
                                        onTintColor={Color.colorAccent}
                                        value={this.state.isWood}/>
                                </View>
                                <View style={styles.control}>
                                    <Image style={styles.ctrlIcon} source={require('../../drawable/clock.png')}/>
                                    <DatePicker
                                        date={this.state.date}
                                        mode="date"
                                        placeholder="预约评审时间"
                                        format="YYYY-MM-DD"
                                        minDate={this.dateStr}
                                        confirmBtnText="确认"
                                        cancelBtnText="取消"
                                        showIcon={false}
                                        onDateChange={(date) => {
                                            this.setState({date: date})
                                        }}
                                    />
                                </View>


                                {
                                    (() => {
                                        if (this.state.isWood) {
                                            return (<TouchableOpacity style={styles.control} onPress={() => {
                                                this.setState({isCarVisible: !this.state.isCarVisible});
                                            }}>
                                                <Image style={styles.ctrlIcon}
                                                       source={require('../../drawable/car.png')}/>
                                                <Text numberOfLines={1}
                                                      style={{color: 'white', width: 200}}>
                                                    {(this.state.isNeedCar ? "需要车辆" : '不申请车辆') + " - " + (this.state.memberText ? this.state.memberText : '无陪同人')}
                                                </Text>
                                            </TouchableOpacity>);
                                        }
                                    })()

                                }
                                {
                                    this._carView()

                                }

                                <TouchableOpacity style={styles.control} onPress={() => {
                                    this.props.nav.navigate(
                                        'param',
                                        {
                                            title: '选择供应商',
                                            type: 0,//SupplierName
                                            searchKey: this.state.Series,//if key
                                            setSelect: (select) => {
                                                this.setState({SupplierName: select})
                                            },
                                            isMulti: false,
                                            existData: this.state.SupplierName ? this.state.SupplierName.split(',') : []
                                        },
                                    );
                                }}>
                                    <Image style={styles.ctrlIcon} source={require('../../drawable/remark.png')}/>
                                    <Text numberOfLines={1}
                                          style={{
                                              color: 'white',
                                              width: 200,
                                          }}>{this.state.SupplierName === '' ? '供应商' : this.state.SupplierName}</Text>
                                </TouchableOpacity>
                                {
                                    (() => {
                                        if (this.state.isWood) {
                                            return (
                                                <TouchableOpacity style={styles.control} onPress={() => {
                                                    this.props.nav.navigate(
                                                        'param',
                                                        {
                                                            title: '选择系列',
                                                            type: 1,//Series
                                                            searchKey: this.state.SupplierName,//if key
                                                            setSelect: (select) => {
                                                                this.setState({Series: select})
                                                            },
                                                            isMulti: true,
                                                            existData: this.state.Series ? this.state.Series.split(',') : []
                                                        },
                                                    );
                                                }}>
                                                    <Image style={styles.ctrlIcon}
                                                           source={require('../../drawable/remark.png')}/>
                                                    <Text numberOfLines={1}
                                                          style={{
                                                              color: 'white',
                                                              width: 200,
                                                          }}>{this.state.Series === '' ? '系列' : this.state.Series}</Text>
                                                </TouchableOpacity>)
                                        }
                                    })()
                                }


                            </View>

                            <ListView
                                style={{marginBottom: 25}}
                                dataSource={this.state.dataSource}
                                enableEmptySections={true}
                                renderRow={ (rowData, sectionID, rowID) =>
                                    <WpProductItem
                                        isWood={this.props.task.ReviewType}
                                        product={rowData}
                                        func={() => {
                                            this.props.nav.navigate(
                                                'wpDetail',
                                                {
                                                    isWood:this.props.task.ReviewType,
                                                    product: rowData,
                                                    delFunc: () => {
                                                        delete this.state.items[rowData.Id];
                                                        this.setState({
                                                            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))
                                                        });
                                                    },
                                                    finishFunc: (modifyData) => {
                                                        this.state.items[rowID] = modifyData;
                                                        this.setState({
                                                            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))
                                                        });
                                                    }
                                                },
                                            )
                                        }
                                        }/>}/>

                            <TouchableOpacity onPress={() => {
                                if(this.state.isWood){
                                    if(!this.state.Series){
                                        Toast.show('请先选择系列')
                                        return
                                    }
                                }

                                this.props.nav.navigate(
                                    'wpSearch',
                                    {
                                        isWood: this.state.isWood,
                                        series:this.state.Series,
                                        selectFunc: (data) => {
                                            data.map((d) => {
                                                //console.log(JSON.stringify(d));
                                                this.state.items[d.Id] = d;
                                                // console.log(JSON.stringify(this.state.items));
                                            });
                                            //                           this.state.items =  this.state.items.concat(data);
                                            this.setState({
                                                dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))
                                            });
                                        }
                                    },
                                );
                            }}>
                                <View
                                    style={styles.addCard}>
                                    <Image style={styles.ctrlIcon} source={require('../../drawable/pin_add.png')}/>
                                    <Text style={{fontSize: 15}}>添加评审产品</Text>
                                </View>

                            </TouchableOpacity>
                        </ScrollView>
                        <Loading visible={this.state.isLoading}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create(
    {
        addCard: {
            borderWidth: 1,
            backgroundColor: 'white',
            borderColor: Color.trans,
            margin: 16,
            padding: 15,
            shadowColor: Color.background,
            shadowOffset: {width: 2, height: 2,},
            shadowOpacity: 0.5,
            shadowRadius: 3,
            alignItems: 'center',
            elevation: 2,
        },
        control: {
            width: width - 32,
            height: 55,
            backgroundColor: Color.colorPurple,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            marginTop: 8,
        },
        ctrlIcon: {
            width: 25,
            height: 25,
            marginLeft: 16,
            marginRight: 16,
            resizeMode: 'contain'
        },
        textRemark: {
            width: width - 64,
            height: 45,
            marginLeft: 32,
            marginRight: 32,
            marginTop: 16,
            color: 'white',
            borderColor: Color.colorAccent,
            borderBottomWidth: 2,
            marginBottom: 10,

        },
    });
