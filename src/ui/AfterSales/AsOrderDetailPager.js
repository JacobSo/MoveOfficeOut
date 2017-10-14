/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet, TouchableOpacity, Image, ListView
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import ApiService from '../../network/AsApiService';
import SnackBar from 'react-native-snackbar-dialog'
import {AsProductEditor} from "../Component/AsProductEditor";
import InputDialog from "../Component/InputDialog";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default class AsOrderDetailPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            rejectContent: '',
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        //   this.state.dataSourceProduct.cloneWithRows(this.props.order.abnormal_products);
        //  this.state.dataSourceComment.cloneWithRows(this.props.order.tracks);

    }

    rejectOrder() {
        if (!this.state.rejectContent) {
            SnackBar.show("一定要填写驳回原因");
            return
        }
        ApiService.rejectOrder(this.props.order.id, this.state.rejectContent)
            .then((responseJson) => {
                if (responseJson.status === 0) {
                    SnackBar.show('操作成功');
                    this.props.refreshFunc();
                    this.props.nav.goBack(null);
                } else {
                    SnackBar.show(responseJson.message);
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
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

    rejectDialog() {
        return <InputDialog
            isMulti={false}
            action={[
                (popupDialog) => {
                    this.popupDialog = popupDialog;
                },
                (text) => {
                    this.setState({rejectContent: text})
                },
                () => {
                    this.setState({rejectContent: ''});
                    this.popupDialog.dismiss();
                },
                () => {
                    this.rejectOrder();
                    this.popupDialog.dismiss();

                }
            ]} str={['驳回原因', '备注驳回原因，必填']}/>
    }

    submit() {
        Alert.alert(
            "通过单据",
            "确认通过售后单据",
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.submitOrderSimple(this.props.order.id, "end")
                        .then((responseJson) => {
                            if (responseJson.status === 0) {
                                SnackBar.show('操作成功');
                                this.props.refreshFunc();
                                this.props.nav.goBack(null);
                            } else {
                                SnackBar.show(responseJson.message);
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
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
                },
            ]
        )
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-55}>
                <View style={{backgroundColor: Color.background, height: height, paddingBottom: 25}}>

                    <Toolbar title={["审核单据"]}
                             color={Color.colorAmber}
                             elevation={2}
                             isHomeUp={true}
                             isAction={true}
                             isActionByText={true}
                             actionArray={[]}
                             functionArray={[
                                 () => this.props.nav.goBack(null),
                             ]}/>

                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>
                        <View style={{
                            backgroundColor: Color.background, flexDirection: 'column',
                        }}>
                            <View style={styles.itemCard}>
                                <Text style={{
                                    textAlign: 'center',
                                    width: width - 32,
                                    padding: 5,
                                    color: 'white',
                                    backgroundColor: (this.props.order.reason === "成品" ? Color.colorGreen :
                                        (this.props.order.reason === "材料" ? Color.colorDeepPurple : Color.colorBlueGrey))
                                }}>
                                    {this.props.order.reason}</Text>
                                <View style={styles.itemText}>
                                    <Text>{'单据编号'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{this.props.order.serial_number}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'财务单号'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{this.props.order.charge_number}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'类型'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{this.props.order.type}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'投诉方'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent, width: 200, textAlign: 'right'}}
                                        numberOfLines={2}>{this.props.order.customer_name}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'被投诉方'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{this.props.order.accuser_name}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'创建时间'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{this.props.order.created_at}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'创建人'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{this.props.order.creater_name}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'问题描述'}</Text>
                                    <Text style={{color: Color.black_semi_transparent}}>{this.props.order.remark}</Text>
                                </View>
                            </View>

                            <View style={styles.itemCard}>
                                <Text style={{
                                    textAlign: 'center',
                                    width: width - 32,
                                    padding: 5,
                                    color: 'white',
                                    backgroundColor: Color.colorGrey
                                }}>
                                    跟进情况</Text>
                                <View style={styles.itemText}>
                                    <Text>{'售后专员'}</Text>
                                    <Text style={{color: Color.black_semi_transparent}}>{this.props.order.saler}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'联系方式'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{this.props.order.saler_phone}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'处理时间'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{this.props.order.summited_at}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'更新时间'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{this.props.order.updated_at}</Text>
                                </View>

                                <Text style={{
                                    borderLeftColor: Color.colorAmber,
                                    borderLeftWidth: 5,
                                    paddingLeft: 16,
                                    margin: 16
                                }}>{'异常产品'}</Text>


                                <ListView
                                    dataSource={new ListView.DataSource({rowHasChanged: (row1, row2) => true,}).cloneWithRows(this.props.order.abnormal_porducts)}
                                    style={{marginLeft: 16, marginRight: 16, width: width - 32}}
                                    removeClippedSubviews={false}
                                    enableEmptySections={true}
                                    renderRow={(rowData, sectionID, rowID) =>
                                        <View style={{
                                            width: width - 64,
                                            padding: 10,
                                            borderRadius: 10,
                                            margin: 16,
                                            backgroundColor: Color.line,
                                        }}>
                                            <Text style={{margin: 5,}}>{"产品：" + rowData.product_itemName}</Text>
                                            <Text style={{margin: 5,}}>{"编号：" + rowData.skuCode}</Text>
                                            <Text style={{margin: 5,}}>{"异常：" + rowData.remark}</Text>
                                        </View>
                                    }/>

                                <Text style={{
                                    borderLeftColor: Color.colorAmber,
                                    borderLeftWidth: 5,
                                    paddingLeft: 16,
                                    margin: 16
                                }}>{'跟进进度'}</Text>
                                <ListView
                                    dataSource={new ListView.DataSource({rowHasChanged: (row1, row2) => true,}).cloneWithRows(this.props.order.tracks)}
                                    style={{marginLeft: 16, marginRight: 16, width: width - 32}}
                                    removeClippedSubviews={false}
                                    enableEmptySections={true}
                                    renderRow={(rowData, sectionID, rowID) =>
                                        <View style={{
                                            width: width - 64,
                                            padding: 10,
                                            borderRadius: 10,
                                            margin: 16,
                                            backgroundColor: Color.line,
                                        }}>
                                            <Text>{rowID + "：" + rowData.remark}</Text>
                                        </View>
                                    }/>

                                <Text style={{
                                    borderLeftColor: Color.colorAmber,
                                    borderLeftWidth: 5,
                                    paddingLeft: 16,
                                    margin: 16
                                }}>{'责任报告'}</Text>
                                <ListView
                                    dataSource={new ListView.DataSource({rowHasChanged: (row1, row2) => true,}).cloneWithRows(this.props.order.duty_report)}
                                    style={{marginLeft: 16, marginRight: 16, width: width - 32}}
                                    removeClippedSubviews={false}
                                    enableEmptySections={true}
                                    renderRow={(rowData, sectionID, rowID) =>
                                        <View style={{
                                            width: width - 64,
                                            padding: 10,
                                            borderRadius: 10,
                                            margin: 16,
                                            backgroundColor: Color.line,
                                        }}>
                                            <Text style={{margin: 5,}}>{"责任判定时间：" + rowData.duty_date}</Text>
                                            <Text style={{margin: 5,}}>{"异常类型：" + rowData.abnormal_type}</Text>
                                            <Text style={{margin: 5,}}>{"异常原因：" + rowData.abnormal_reason}</Text>
                                            <Text style={{margin: 5,}}>{"责任单位：" + rowData.duty_to}</Text>
                                            <Text style={{margin: 5,}}>{"是否处罚：" + rowData.publishment}</Text>
                                            <Text style={{margin: 5,}}>{"处罚金额：" + rowData.compensation}</Text>
                                            <Text style={{margin: 5,}}>{"售后扣款：" + rowData.sale_compensation}</Text>
                                            <Text style={{margin: 5,}}>{"异常产生责任方：" + rowData.publish_to}</Text>

                                        </View>
                                    }/>
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TouchableOpacity onPress={() => this.rejectDialog()}>
                                    <View style={[styles.button, {
                                        backgroundColor: 'white',
                                        width: width / 2 - 32
                                    }]}>
                                        <Text>驳回</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.submit()}>
                                    <View style={[styles.button, {
                                        backgroundColor: Color.colorAmber,
                                        width: width / 2 - 32,
                                    }]}>
                                        <Text style={{color: 'white'}}>通过</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    <Loading visible={this.state.isLoading}/>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    itemText: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width - 32,
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16
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
    button: {
        width: width - 32,
        height: 55,
        backgroundColor: Color.colorAmber,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2
    },
});