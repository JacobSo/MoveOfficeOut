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
import InputDialog from "../Component/InputDialog";
import {CachedImage} from "react-native-img-cache";
import RadioForm from 'react-native-simple-radio-button';
import App from '../../constant/Application';
import CheckBox from "../Component/CheckBox";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
let typeGroup = ['created', 'waitting', 'service_approving', 'service_approved', 'manager_reviewing', "manager_reviewed"];
let transGroup = ['已创建', '等待处理', '处理中', '提交审核', '已审核', '完结'];
const exList = ["a.是否影响品质", "b.是否影响交期，处理结果一般", "c.解决方案是否永久杜绝此类型售后", "d.是否牺牲性纠错(金钱损失)", "e.主动性与否"];
let colorGroup = [Color.colorBlueGrey, Color.colorDeepOrange, Color.colorDeepPurple, Color.colorRed, Color.colorGreen, 'black'];
export default class AsOrderDetailPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            rejectContent: '',
            radioValue: 0,
            comment: '',
            image: [],
            scoreA: false,
            scoreB: false,
            scoreC: false,
            scoreD: false,
            scoreE: false,
        }
    }

    //constant pic merge
    componentWillMount() {
        let tempPic = [];
        if (this.props.order && this.props.order.pic_attachment.length !== 0) {
            tempPic = this.props.order.pic_attachment;
        }
        if (this.props.order && this.props.order.attachment) {
            let tempAtt = this.props.order.attachment.split(',');
            tempAtt.map((data) => {
                if (['jpg', 'gif', 'png', 'jpeg', 'bmp'].indexOf(data.substring(data.lastIndexOf('.') + 1).toLowerCase()) > -1)
                    tempPic.push("http://lsprt.lsmuyprt.com:5050/api/v1/afterservice/download/" + data)
            })
        }
        this.state.image = tempPic

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
                        remark: this.state.comment,
                        submitType: 'PC',
                        quality: this.state.scoreA ? 0 : 1,
                        delivery_date: this.state.scoreB ? 0 : 1,
                        not_allow: this.state.scoreC ? 1 : 0,
                        loss: this.state.scoreD ? 0 : 1,
                        initiative: this.state.scoreE ? 1 : 0,
                        resume: (this.state.scoreA ? 0 : 1) + (this.state.scoreB ? 0 : 1) + (this.state.scoreC ? 1 : 0) + (this.state.scoreD ? 0 : 1) + (this.state.scoreE ? 1 : 0),
                    })
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

    submit(ststus) {
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
                                    <Text style={{
                                        color: Color.black_semi_transparent,
                                        width: 200,
                                        textAlign: 'right'
                                    }}>{this.props.order.remark}</Text>
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
                                <Text style={styles.subTitleStyle}>{'已提交图片'}</Text>
                                <ListView
                                    ref="scrollView"
                                    dataSource={new ListView.DataSource({rowHasChanged: (row1, row2) => true,}).cloneWithRows(this.state.image)}
                                    removeClippedSubviews={false}
                                    enableEmptySections={true}
                                    contentContainerStyle={styles.listStyle}
                                    renderRow={(rowData, sectionID, rowID) =>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.nav.navigate("gallery", {
                                                    pics: this.state.image
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
                                                <Text style={styles.titleStyle}>售后评分</Text>
                                                <CheckBox
                                                    style={{padding: 10,}}
                                                    rightTextStyle={{color: "#555555"}}
                                                    isChecked={this.state.scoreA}
                                                    onClick={() => this.setState({scoreA: !this.state.scoreA})}
                                                    rightText={ exList[0] + "，得分：" + (this.state.scoreA ? 0 : 1)}/>
                                                <CheckBox
                                                    style={{padding: 10}}
                                                    isChecked={this.state.scoreB}
                                                    onClick={() => this.setState({scoreB: !this.state.scoreB})}
                                                    rightText={ exList[1] + "，得分：" + (this.state.scoreB ? 0 : 1)}/>
                                                <CheckBox
                                                    style={{padding: 10}}
                                                    isChecked={this.state.scoreC}
                                                    onClick={() => this.setState({scoreC: !this.state.scoreC})}
                                                    rightText={ exList[2] + "，得分：" + (this.state.scoreC ? 1 : 0)}/>
                                                <CheckBox
                                                    style={{padding: 10}}
                                                    isChecked={this.state.scoreD}
                                                    onClick={() => this.setState({scoreD: !this.state.scoreD})}
                                                    rightText={ exList[3] + "，得分：" + (this.state.scoreD ? 0 : 1)}/>
                                                <CheckBox
                                                    style={{padding: 10}}
                                                    isChecked={this.state.scoreE}
                                                    onClick={() => this.setState({scoreE: !this.state.scoreE})}
                                                    rightText={ exList[4] + "-、，得分：" + (this.state.scoreE ? 1 : 0)}/>
                                                {/*                  <RadioForm
                                                 buttonColor={Color.colorAmber}
                                                 labelStyle={{color: Color.content, margin: 16}}
                                                 radio_props={ [
                                                 {label: exList[0], value: 0},
                                                 {label: exList[1], value: 1},
                                                 {label: exList[2], value: 2},
                                                 {label: exList[3], value: 3},
                                                 {label: exList[4], value: 4},
                                                 ]}
                                                 initial={this.state.radioValue}
                                                 formHorizontal={false}
                                                 style={styles.radioStyle}
                                                 onPress={(value) => {
                                                 this.setState({
                                                 radioValue: value,
                                                 })
                                                 }}
                                                 />*/}
                                                <TextInput style={styles.textInput}
                                                           placeholder="在此输入建议和评价"
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
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => this.popupDialog.show()}>
                                                <View style={[styles.button, {backgroundColor: 'white'}]}>
                                                    <Text>退审</Text>
                                                </View>
                                            </TouchableOpacity></View>
                                    } else if (this.props.order.status === "manager_reviewed" || this.props.isReject || App.workType === "开发专员") {
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
        backgroundColor: 'white',
        elevation: 2,
        marginBottom: 32,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10,
        paddingBottom: 10,
        borderRadius: 10
    },
    button: {
        width: width - 32,
        height: 55,
        backgroundColor: Color.colorAmber,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        borderRadius: 10
    },
    textInput: {
        width: width - 32,
        height: 55,
        marginLeft: 16,
        marginRight: 16,
        borderColor: Color.line,
        borderBottomWidth: 1,
        padding: 16
        // textAlign: 'center'
    },
    titleStyle: {
        textAlign: 'center',
        width: width - 32,
        padding: 5,
        color: 'white',
        backgroundColor: Color.colorGrey,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,

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
    radioStyle: {
        marginLeft: 16,
        marginBottom: 16,
        width: width - 32,
        backgroundColor: 'white',
        paddingTop: 16,
        paddingLeft: 16
    },
});