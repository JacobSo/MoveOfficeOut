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
import StarSeek from "../Component/StarSeek";
import {CachedImage} from "react-native-img-cache";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
let typeGroup = ['created', 'waitting', 'service_approving', 'service_approved', 'manager_reviewing', "manager_reviewed"];
let transGroup = ['已创建', '等待处理', '处理中', '提交审核', '已审核', '完结'];
let colorGroup = [Color.colorBlueGrey, Color.colorDeepOrange, Color.colorDeepPurple, Color.colorRed, Color.colorGreen, 'black'];
export default class AsOrderDetailPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            rejectContent: '',
            starA: 0,
            starB: 0,
            starC: 0,
            comment: '',
        }
    }

    getTypeIndex() {
        let temp = 0;
        typeGroup.map((data, index) => {
            if (data === this.props.order.status) {
                temp = index;
            }
        });
        return temp;
    }

    doneOrder() {

        Alert.alert(
            "完结单据",
            "确认完结售后单据",
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.submitOrderSimple(this.props.order.id, 'done', {
                        'effect': this.state.starA,
                        'detail': this.state.starB,
                        'efficient': this.state.starC,
                        'remark': this.state.comment
                    }).then((responseJson) => {
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
                },
            ]
        )
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
                             functionArray={[() => this.props.nav.goBack(null),]}/>

                    <ScrollView style={{backgroundColor: Color.background,}}>
                        <View style={{backgroundColor: Color.background, flexDirection: 'column',}}>
                            <View style={styles.itemCard}>
                                <Text style={[styles.titleStyle, {backgroundColor: colorGroup[this.getTypeIndex()]}]}>
                                    {transGroup[this.getTypeIndex()]}</Text>
                                <View style={styles.itemText}>
                                    <Text>{'单据编号'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{this.props.order.serial_number}</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'售后原因'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>{this.props.order.reason}</Text>
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
                                <Text style={styles.titleStyle}>
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

                                <Text style={styles.subTitleStyle}>{'异常产品'}</Text>


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

                                <Text style={styles.subTitleStyle}>{'跟进进度'}</Text>
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

                                <Text style={styles.subTitleStyle}>{'责任报告'}</Text>
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
                                <Text style={styles.subTitleStyle}>{'售后图片'}</Text>
                                <ListView
                                    ref="scrollView"
                                    dataSource={new ListView.DataSource({rowHasChanged: (row1, row2) => true,}).cloneWithRows(this.props.order.pic_attachment)}
                                    removeClippedSubviews={false}
                                    enableEmptySections={true}
                                    contentContainerStyle={styles.listStyle}
                                    renderRow={(rowData, sectionID, rowID) =>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.nav.navigate("gallery", {
                                                    pics: this.props.order.pic_attachment
                                                })
                                            }}>
                                            <CachedImage
                                                resizeMode="contain"
                                                style={{width: 80, height: 80, margin: 5}}
                                                source={{uri: rowData}}/>
                                        </TouchableOpacity>
                                    }/>

                            </View>
                            {
                                (() => {
                                    if (this.props.order.status === "manager_reviewing") {
                                        {/*评分*/
                                        }
                                        return <View>
                                            <View style={styles.itemCard}>
                                                <Text style={styles.titleStyle}>工作评分</Text>
                                                <Text style={styles.subTitleStyle}>工作效率</Text>
                                                <StarSeek style={{margin: 16}}
                                                          onSelect={(select) => this.setState({starA: select})}/>
                                                <Text style={styles.subTitleStyle}>结果质量</Text>
                                                <StarSeek style={{margin: 16}}
                                                          onSelect={(select) => this.setState({starB: select})}/>
                                                <Text style={styles.subTitleStyle}>进度反馈{"\n"}详细程度</Text>
                                                <StarSeek style={{margin: 16}}
                                                          onSelect={(select) => this.setState({starC: select})}/>
                                                <Text style={styles.subTitleStyle}>评价建议</Text>
                                                <TextInput style={styles.textInput}
                                                           placeholder="在此输入"
                                                           multiline={true}
                                                           returnKeyType={'done'}
                                                           blurOnSubmit={true}
                                                           underlineColorAndroid="transparent"
                                                           onChangeText={(text) => {
                                                               this.setState({comment: text})
                                                           }}/>

                                            </View>
                                            <TouchableOpacity
                                                onPress={() => this.doneOrder()}>
                                                <View style={styles.button}>
                                                    <Text style={{color: 'white'}}>完结单据</Text>
                                                </View>
                                            </TouchableOpacity></View>
                                    } else if (this.props.order.status === "manager_reviewed") {
                                        return null
                                    } else {
                                        return <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <TouchableOpacity onPress={() => this.popupDialog.show()}>
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
                                    }
                                })()
                            }


                        </View>
                    </ScrollView>
                    <Loading visible={this.state.isLoading}/>
                    {this.rejectDialog()}

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
    textInput: {
        width: width - 32,
        height: 55,
        marginLeft: 16,
        marginRight: 16,
        borderColor: Color.line,
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    titleStyle: {
        textAlign: 'center',
        width: width - 32,
        padding: 5,
        color: 'white',
        backgroundColor: Color.colorGrey
    },
    subTitleStyle: {
        borderLeftColor: Color.colorAmber,
        borderLeftWidth: 5,
        paddingLeft: 16,
        margin: 16
    },
    listStyle: {
        flexDirection: 'row', //改变ListView的主轴方向
        flexWrap: 'wrap', //换行
    },

});