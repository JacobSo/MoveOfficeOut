/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions, Alert, Platform, Text, TouchableOpacity, DeviceEventEmitter, Image, ScrollView,
    KeyboardAvoidingView, TextInput,
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/QcApiService';
import Color from '../../constant/Color';
import SQLite from '../../db/Sqlite';
import AndroidModule from '../../module/AndoridCommontModule'
import IosModule from '../../module/IosCommontModule'
import SnackBar from 'react-native-snackbar-dialog'
import Loading from 'react-native-loading-spinner-overlay'
import {QC_FORM_ITEM_SOFA, QC_FORM_ITEM_WOOD} from "../../constant/QcFormItems";
import NumberPicker from "../Component/NumberPicker";
import MultiCheckPicker from "../Component/MultiCheckPicker";

const {width, height} = Dimensions.get('window');
let sqLite = new SQLite();

export default class QcSubmitPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            product: this.props.product[0],
            isMulti: this.props.product.length > 1,
            initFormItem: this.props.product[0].QualityType === "板木" ? QC_FORM_ITEM_WOOD : QC_FORM_ITEM_SOFA,
            formItems: [],
            editContent: this.props.product[0].ImprovementMeasures,
            isEdit: false,

            selectFunc: null,
            selectTitle: '',
            qcNumber: this.props.product[0].QualityQty,
            passNumber: this.props.product[0].PassQty,
            storeNumber: this.props.product[0].GetInQuantity,
            arrayNumber: [],
            arraySeries: [],
            storeStr: this.props.product[0].IsGetIn === 0 ? '不入库' : '全部入库',
            singleStore: this.props.product[0].IsGetIn === 1,

            address: '',
            lat: '0.0',
            lng: '0.0',

            submitPic: [],
        }
    }

    componentWillMount() {
        this.state.arrayNumber = this.getNumberArray(0);
        this.props.product.map((data) => {
            this.state.arraySeries.push({title: data.QualityLot, IsGetIn: 1, ProductNoGuid: data.ProductNoGuid})
        });

        sqLite.fetchQcDraft(this.state.initFormItem, this.state.product.ProductNoGuid)
            .then((result) => {
                console.log(JSON.stringify(result));
                this.setState({
                    formItems: result,
                    editContent:   this.props.product[0].state===1?this.props.product[0].ImprovementMeasures:(result[0].submitContent ? result[0].submitContent.totalContent : ''),
                })
            }).done()
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            this.watchID = navigator.geolocation.watchPosition((position) => {
                this.state.lat = position.coords.latitude;
                this.state.lng = position.coords.longitude;
            });
        } else {
            DeviceEventEmitter.addListener('callLocationChange', this.onAndroidLocationChange)
        }
    }

    onAndroidLocationChange = (e) => {
        // SnackBar.show(e.address + ":" + e.lat + ":" + e.lng)
        if (this.state.address !== e.address) {
            this.state.address = e.address;
            this.state.lat = e.lat;
            this.state.lng = e.lng;
        }
    };


    countFinishItem() {
        let count = 0;
        this.state.formItems.map((data) => {
            if (data.isPass ===0|| data.isPass === 1) {
                count++;
            }
        });
        return count;
    }


    infoDialog() {
        Alert.alert(
            this.state.product.ProductNo + "详情",
            '质检单：' + this.props.task.QualityNo + '\n' +
            '交货时间：' + this.state.product.DeliveryDate + '\n' +
            '商品编码：' + this.state.product.ProductCode + '\n' +
            '采购单号：' + this.state.product.JPNo + '\n' +
            '类型：' + this.state.product.QualityType + '\n' +
            this.state.product.StyleName + '\n' +
            '备注：' + this.state.product.Remark + '\n')
    }

    numberPicker() {
        //  console.log('*******'+this.state.arrayNumber)
        return (
            <NumberPicker
                actionFunc={
                    {
                        refFunc: (popupDialog) => {
                            this.popupDialog = popupDialog;
                        },
                        selectFunc: this.state.selectFunc
                    }
                }
                arrayNumber={this.state.arrayNumber}
                titleStr={this.state.selectTitle}
            />
        )
    }

    multiPicker() {
        return (
            <MultiCheckPicker
                actionFunc={
                    {
                        refFunc: (popupDialog1) => {
                            this.popupDialog1 = popupDialog1;
                        },
                        selectFunc: this.state.selectFunc

                    }
                }
                arrayStr={this.state.arraySeries}
                titleStr={this.state.selectTitle}
            />
        )
    }

    getNumberArray(flag) {
        let top = 0, bottom = 0;
        switch (flag) {
            case 0:
                top = this.state.product.Quantity;
                break;
            case 1:
                top = this.state.qcNumber;
                break;
            case 2:
                top = this.state.product.Quantity;
                bottom = this.state.product.Quantity - this.state.qcNumber + this.state.passNumber;
                break;
        }

        let num = [];
        for (let i = 0; i < top - bottom + 1; i++)
            num.push(top - i);
        return num;
    }

    formatFormItem() {
        let temp = [];
        this.state.formItems.map((data) => {
        //    if () {
                temp.push({
                    IsPass: data.isPass,
                    UnPassDescription: data.submitContent?data.submitContent.subContent:"",
                    picAdresslist: [],
                })
         //   }
        });
        return temp;
    }

    submitDialog() {
        this.state.formItems.map((data) => {
            if (data.submitPic) {
                data.submitPic.map((pic) => {
                    console.log(JSON.stringify(data.submitPic));
                    pic.fid = data.Guid;
                    this.state.submitPic.push(pic);

                })
            }
        });
        if (this.countFinishItem() !== this.state.initFormItem.length) {
            SnackBar.show("质检项未填写完整", {duration: 1000});
            return;
        }

        if (!this.state.editContent) {
            SnackBar.show("质检反馈未填写", {duration: 1000});
            return;
        }

        if (this.props.product.length === 1) {
            if (this.state.qcNumber === 0) {
                SnackBar.show("请选择质检数", {duration: 1000});
                return;
            }
            // console.log(JSON.stringify(this.state.arraySeries));

            if (this.state.arraySeries[0].IsGetIn === 1) {
                if (this.state.passNumber === 0 || this.state.storeNumber === 0) {
                    SnackBar.show("请选择合格数和入库量", {duration: 1000});
                    return;
                }
            }
        }
        Alert.alert(
            "提交",
            "提交质检？",
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {text: '确认', onPress: () => this.submitTask()}
            ]
        )
    }

    submitTask() {
        this.setState({isLoading: true});
        ApiService.submitTaskOld(
            this.props.task.QualityNoGuid,
            JSON.stringify(this.state.arraySeries),
            this.props.product.length === 1 ? this.state.qcNumber : '0',
            this.props.product.length === 1 ? this.state.passNumber : '0',
            this.state.storeNumber,
            this.props.product.length === 1 && this.state.arraySeries[0].IsGetIn === 1 ? (this.state.passNumber / this.state.qcNumber).toFixed(2) * 100 + "%" : '0',
            this.state.editContent,
            JSON.stringify(this.formatFormItem()),
            this.state.lat,
            this.state.lng)
            .then((responseJson) => {
                console.log(responseJson);
                if (!responseJson.IsErr) {
                    if (this.state.submitPic.length !== 0) {
                        this.submitImage();
                    } else {
                        setTimeout(() => {
                            this.setState({isLoading: false})
                        }, 100);
                        SnackBar.show("提交成功");
                        this.props.nav.goBack(null);
                        if (this.props.product.length > 1)
                            this.props.finishFuncMulti(this.state.arraySeries);
                        else
                            this.props.finishFunc(this.state.singleStore ? 1 : 0, this.state.qcNumber, this.state.passNumber, this.state.storeNumber)
                    }
                } else {
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                    SnackBar.show(responseJson.ErrDesc, {duration: 3000})
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

    submitImage() {
        this.state.submitPic.map((data, index) => {
            if (Platform.OS === 'android') {
                AndroidModule.getImageBase64(data.path, (callBackData) => {
                    this.postImageReq(data, index, callBackData);
                })
            } else {
                IosModule.getImageBase64(data.uri.replace('file://', ''), (callBackData) => {
                    this.postImageReq(data, index, callBackData);
                });
            }
        })

    }

    postImageReq(data, index, callBackData) {
        ApiService.uploadImageOld(JSON.stringify(this.state.arraySeries), data.fid, data.fileName, callBackData)
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                if (!responseJson.IsErr) {
                    if (index === this.state.submitPic.length - 1) {
                        SnackBar.show("提交成功");
                        this.props.nav.goBack(null);
                        if (this.props.product.length > 1)
                            this.props.finishFuncMulti(this.state.arraySeries);
                        else
                            this.props.finishFunc(this.state.singleStore ? 1 : 0, this.state.qcNumber, this.state.passNumber, this.state.storeNumber)
                    }
                } else {
                    SnackBar.show(responseJson.ErrDesc);
                    if (index === this.state.submitPic.length - 1) {
                        setTimeout(() => {
                            this.setState({isLoading: false})
                        }, 100);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
                if (index === this.state.submitPic.length - 1) {
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
            }).done();
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={'padding'}>
                <ScrollView>
                    <View style={{
                        flex: 1,
                        backgroundColor: Color.background,
                        height: height
                    }}>
                        <Toolbar
                            elevation={2}
                            title={["质检中"]}
                            color={Color.colorIndigo}
                            isHomeUp={true}
                            isAction={true}
                            isActionByText={true}
                            actionArray={["保存", "提交"]}
                            functionArray={[
                                () => {
                                    this.props.nav.goBack(null)
                                },
                                () => {
                               // console.log(this.state.product.ProductNoGuid+"===========================");
                                    sqLite.insertQcDraftAll(this.state.formItems, this.state.product.ProductNoGuid, this.state.editContent)
                                        .then((result) => {
                                            SnackBar.show(result);
                                            this.props.nav.goBack(null);
                                        }).done()
                                },
                                () => this.submitDialog()

                            ]}/>
                        <Text style={{color: Color.colorIndigo, margin: 16}}>质检概览</Text>
                        <TouchableOpacity style={styles.itemText} onPress={() => this.infoDialog()}>
                            <Text>质检产品</Text>
                            <View style={{flexDirection: 'row',}}>
                                <Text
                                    style={{color: Color.black_semi_transparent}}>{this.state.product.ProductNo}</Text>
                                <Image source={require('../../drawable/arrow.png')} style={styles.arrow}/>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.itemText}>
                            <Text>质检方式</Text>
                            <Text
                                style={{color: Color.black_semi_transparent}}>{this.state.isMulti ? '批量质检' : '单品质检'}</Text>
                        </View>
                        <View style={styles.itemText}>
                            <Text>总数</Text>
                            <Text
                                style={{color: Color.black_semi_transparent}}>{this.state.isMulti ? this.props.product.length : this.state.product.Quantity}</Text>
                        </View>

                        <Text style={{color: Color.colorIndigo, margin: 16}}>质检结果</Text>
                        <TouchableOpacity style={styles.itemText} onPress={() => {
                            this.props.nav.navigate('qcForm',
                                {
                                    product: this.props.product,
                                    formItems: this.state.formItems,
                                    finishFunc: (result) => {
                                        this.setState({
                                            formItems: result
                                        });
                                    }
                                })
                        }}>
                            <Text>质检项目</Text>
                            <View style={{flexDirection: 'row',}}>
                                <Text
                                    style={{color: Color.black_semi_transparent}}>{this.countFinishItem() + '项/' + this.state.initFormItem.length + '项'}</Text>
                                <Image source={require('../../drawable/arrow.png')} style={styles.arrow}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.itemText} onPress={() => {
                            this.setState({
                                isEdit: !this.state.isEdit
                            })
                        }}>
                            <Text>质检反馈</Text>
                            <View style={{flexDirection: 'row',}}>
                                <Text style={{color: Color.black_semi_transparent, width: 150, textAlign: 'right'}}
                                      numberOfLines={1}>{this.state.editContent ? this.state.editContent : '未填写'}</Text>
                                <Image source={require('../../drawable/arrow.png')} style={styles.arrow}/>
                            </View>
                        </TouchableOpacity>
                        {
                            (() => {
                                if (this.state.isEdit) {
                                    return <TextInput
                                        style={styles.textInput}
                                        placeholder="在此输入"
                                        returnKeyType={'done'}
                                        blurOnSubmit={true}
                                        multiline={true}
                                        defaultValue={this.state.formItems[0].submitContent ? this.state.formItems[0].submitContent.totalContent : ''}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(text) => this.setState({editContent: text})}/>
                                }
                            })()
                        }

                        {
                            (() => {
                                if (!this.state.isMulti) {
                                    return (
                                        <TouchableOpacity style={styles.itemText} onPress={() => {
                                            this.setState({
                                                arrayNumber: this.getNumberArray(0),
                                                selectTitle: '质检数',
                                                selectFunc: (number) => {
                                                    this.popupDialog.dismiss();
                                                    this.setState({
                                                        qcNumber: number,
                                                        passNumber: 0,
                                                        storeNumber: 0
                                                    });
                                                }
                                            });
                                            this.popupDialog.show();
                                        }}>
                                            <Text>质检数</Text>
                                            <View style={{flexDirection: 'row',}}>
                                                <Text
                                                    style={{color: Color.black_semi_transparent}}>{this.state.qcNumber === 0 ? '选择' : this.state.qcNumber}</Text>
                                                <Image source={require('../../drawable/arrow.png')}
                                                       style={styles.arrow}/>
                                            </View>
                                        </TouchableOpacity>

                                    )
                                }
                            })()
                        }

                        {
                            (() => {
                                if (!this.state.isMulti && this.state.singleStore) {
                                    return (
                                        <View>
                                            <TouchableOpacity style={styles.itemText} onPress={() => {
                                                if (this.state.qcNumber === 0) {
                                                    SnackBar.show("请先选择质检数", {duration: 2000});
                                                    return
                                                }
                                                this.setState({
                                                    arrayNumber: this.getNumberArray(1),
                                                    selectTitle: '合格数',
                                                    selectFunc: (number) => {
                                                        this.popupDialog.dismiss();
                                                        this.setState({
                                                            passNumber: number,
                                                            storeNumber: 0
                                                        });
                                                    }
                                                });
                                                this.popupDialog.show();
                                            }}>
                                                <Text>合格数</Text>
                                                <View style={{flexDirection: 'row',}}>
                                                    <Text
                                                        style={{color: Color.black_semi_transparent}}>{this.state.passNumber === 0 ? '选择' : this.state.passNumber}</Text>
                                                    <Image source={require('../../drawable/arrow.png')}
                                                           style={styles.arrow}/>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.itemText} onPress={() => {
                                                if (this.state.passNumber === 0) {
                                                    SnackBar.show("请先选择合格数", {duration: 2000});
                                                    return
                                                }
                                                this.setState({
                                                    arrayNumber: this.getNumberArray(2),
                                                    selectTitle: '入库量',
                                                    selectFunc: (number) => {
                                                        this.popupDialog.dismiss();
                                                        this.setState({storeNumber: number});
                                                    }
                                                });
                                                this.popupDialog.show();
                                            }}>
                                                <Text>入库量</Text>
                                                <View style={{flexDirection: 'row',}}>
                                                    <Text
                                                        style={{color: Color.black_semi_transparent}}>{this.state.storeNumber === 0 ? '选择' : this.state.storeNumber}</Text>
                                                    <Image source={require('../../drawable/arrow.png')}
                                                           style={styles.arrow}/>
                                                </View>
                                            </TouchableOpacity>
                                        </View>)
                                }
                            })()
                        }

                        <TouchableOpacity style={styles.itemText} onPress={() => {
                            this.setState({
                                selectTitle: '入库批次',
                                selectFunc: (result) => {
                                    this.popupDialog1.dismiss();
                                    let i = 0;
                                    result.map((data) => {
                                        if (!(data.IsGetIn === 1))
                                            i++;
                                    });
                                    this.state.arraySeries = result;
                                    this.setState({
                                        arraySeries: result,
                                        storeStr: i === 0 ? '全部入库' : i + '项不入库',
                                        singleStore: i === 0,
                                        passNumber: i === 0 ? 0 : this.state.passNumber,
                                        storeNumber: i === 0 ? 0 : this.state.storeNumber
                                    })

                                }
                            });
                            this.popupDialog1.show();
                        }
                        }>

                            <Text>入库批次</Text>
                            <View style={{flexDirection: 'row',}}>
                                <Text style={{color: Color.black_semi_transparent}}>{this.state.storeStr}</Text>
                                <Image source={require('../../drawable/arrow.png')} style={styles.arrow}/>
                            </View>
                        </TouchableOpacity>
                        <Loading visible={this.state.isLoading}/>
                    </View>
                </ScrollView>
                {this.numberPicker()}
                {this.multiPicker()}
                <Loading visible={this.state.isLoading}/>
            </KeyboardAvoidingView>
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

        itemText: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: width - 20,
            paddingBottom: 16,
            paddingLeft: 16,
        },
        arrow: {
            width: 10,
            height: 20,
            marginLeft: 16
        },
        borderBottomLine: {
            justifyContent: 'center',
            width: width,
        },
        textInput: {
            width: width - 32,
            height: 55,
            margin: 16,
            borderColor: Color.line,
            borderBottomWidth: 1,
        },
    });
