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
    StyleSheet, TouchableOpacity, Image
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import ApiService from '../../network/AsApiService';
import SnackBar from 'react-native-snackbar-dialog'
const Dimensions = require('Dimensions');
import RadioForm from 'react-native-simple-radio-button';
//const  exList= ["皮布\n姓名：aaa\n电话：12321341321", "化工", "辅料", "板木", "五金"];
const {width, height} = Dimensions.get('window');

export default class AsAddOrderPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            select: this.props.order && this.props.order.reason !== "成品" ?
                (this.props.order.reason === "材料" ? [false, true, false] : [false, false, true]) : [true, false, false],
            isLoading: false,
            selectType: this.props.order ? this.props.order.reason : "成品",
            customer_name: this.props.order ? this.props.order.customer_name : "",
            remark: this.props.order ? this.props.order.remark : "",
            accuser_name: this.props.order ? this.props.order.accuser_name : "",
            //type: this.props.order ? this.props.order.type :  this.props.exType[0].TypeName.trim(),
            radioValue: this.props.order ? this.props.exType.findIndex(data => data.TypeName.trim() == this.props.order.type.trim()) : 0,
            isShow: false,
            checkBox: [],
        }
    }

    componentWillMount() {
        let temp = [];
        this.props.exType.map((data, index) => {
            temp.push({
                label: data.TypeName + (data.TypePersons && data.TypePersons.length !== 0 ?
                    ("\n售后专员：" + data.TypePersons[0].UserName + "\n电话：" + data.TypePersons[0].Phone) :
                    "无售后专员"),
                value: index
            })
        });
        this.state.checkBox = temp;
    }

    getSelectionView() {
        return <View style={styles.selectContainer}>
            <TouchableOpacity
                disabled={this.props.order&&this.props.order.status !== 'created'}
                style={[styles.stepButton, {backgroundColor: (this.state.select[0] ? Color.colorAmber : Color.trans)},]}
                onPress={() => this.setState({select: [true, false, false], selectType: "成品"})
                }>
                <Text style={{
                    textAlign: "center",
                    color: this.state.select[0] ? "white" : "black"
                }}>成品</Text>
            </TouchableOpacity>
            <TouchableOpacity
                disabled={this.props.order&&this.props.order.status !== 'created'}
                style={[styles.stepButton, {backgroundColor: (this.state.select[1] ? Color.colorAmber : Color.trans)},]}
                onPress={() => this.setState({select: [false, true, false], selectType: "材料"})
                }>
                <Text style={{
                    textAlign: "center",
                    color: this.state.select[1] ? "white" : "black"
                }}>材料</Text>
            </TouchableOpacity>
            <TouchableOpacity
                disabled={this.props.order&&this.props.order.status !== 'created'}
                style={[styles.stepButton, {backgroundColor: (this.state.select[2] ? Color.colorAmber : Color.trans)},]}
                onPress={() => this.setState({select: [false, false, true], selectType: "其他"})}>
                <Text style={{
                    textAlign: "center",
                    color: this.state.select[2] ? "white" : "black"
                }}>其他</Text>
            </TouchableOpacity>
        </View>
    }

    confirmRequest(operation) {
        if ((operation !== "删除") && (!this.state.remark || !this.state.customer_name)) {
            SnackBar.show("信息不完整");
            return
        }
        Alert.alert(
            operation + "单据",
            "确认" + operation + "售后单据",
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    (operation === "创建" ?
                        ApiService.createOrder(
                            this.state.selectType,
                            this.state.customer_name,
                            this.state.remark,
                            this.state.accuser_name,
                            this.props.exType[this.state.radioValue].TypeName.trim(),
                            this.props.exType[this.state.radioValue].TypePersons.length === 0 ? "" : this.props.exType[this.state.radioValue].TypePersons[0].UserName)
                        : (operation === "删除" ?
                            ApiService.deleteOrder(this.props.order.id) :
                            ApiService.updateOrder(
                                this.props.order.id,
                                this.state.selectType,
                                this.state.customer_name,
                                this.state.remark,
                                operation === "修改" ? null : 'done',
                                this.state.accuser_name,
                                this.props.exType[this.state.radioValue].TypeName.trim(),
                                this.props.exType[this.state.radioValue].TypePersons.length === 0 ? "" : this.props.exType[this.state.radioValue].TypePersons[0].UserName)))
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

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
                paddingBottom: 75
            }}>
                <Toolbar title={this.props.order ? ['我的单据'] : ['创建售后单据']}
                         color={Color.colorAmber}
                         elevation={2}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={[]}
                         functionArray={[
                             () => this.props.nav.goBack(null),
                         ]}/>

                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-55}>
                    <ScrollView
                        style={{backgroundColor: Color.background,}}>
                        {
                            this.getSelectionView()
                        }
                        <TouchableOpacity
                            disabled={this.props.order&&this.props.order.status !== 'created'}
                            style={styles.supplierTouch}
                            onPress={() => {
                                this.props.nav.navigate('asParam', {
                                    mode: 0,
                                    actionFunc: (selectSupplier) => {
                                        this.setState({customer_name: selectSupplier})
                                    }
                                })
                            }}>
                            <Text
                                style={{marginLeft: 16}}>投诉方</Text>
                            <View style={{flexDirection: 'row',alignItems:'center'}}>
                                <Text style={{width: 150}}>{this.state.customer_name}</Text>
                                <Image source={require("../../drawable/arrow.png")}
                                       style={{width: 10, height: 20, marginRight: 10, marginLeft: 10}}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={this.props.order&&this.props.order.status !== 'created'}
                            style={styles.supplierTouch}
                            onPress={() => {
                                this.props.nav.navigate('asParam', {
                                    mode: 0,
                                    actionFunc: (selectSupplier) => {
                                        this.setState({accuser_name: selectSupplier})
                                    }
                                })
                            }}>
                            <Text
                                style={{marginLeft: 16}}>被投诉方</Text>
                            <View style={{flexDirection: 'row',alignItems:'center'}}>
                                <Text style={{width: 150}}>{this.state.accuser_name}</Text>
                                <Image source={require("../../drawable/arrow.png")}
                                       style={{width: 10, height: 20, marginRight: 10, marginLeft: 10}}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={this.props.order&&this.props.order.status !== 'created'}
                            style={styles.supplierTouch}
                            onPress={() => {
                                this.setState({isShow: !this.state.isShow})
                            }}>
                            <Text
                                style={{marginLeft: 16}}>类型</Text>
                            <View style={{flexDirection: 'row',alignItems:'center'}}>
                                <Text>{this.props.exType[this.state.radioValue].TypeName.trim()}</Text>
                                <Image source={require("../../drawable/arrow.png")}
                                       style={{width: 10, height: 20, marginRight: 10, marginLeft: 10}}/>
                            </View>
                        </TouchableOpacity>
                        {
                            (() => {
                                if (this.state.isShow) {
                                    return <RadioForm
                                        buttonColor={Color.colorAmber}
                                        labelStyle={{color: Color.content, margin: 16}}
                                        radio_props={ this.state.checkBox}
                                        initial={this.state.radioValue}
                                        formHorizontal={false}
                                        style={styles.radioStyle}
                                        onPress={(value) => {
                                            this.setState({
                                                radioValue: value,
                                                isShow: false
                                            })
                                        }}
                                    />
                                }
                            })()
                        }

                        <View style={styles.editContainer}>
                            <TextInput
                                editable={!this.props.order||(this.props.order&&this.props.order.status === 'created')}
                                style={styles.textInput}
                                multiline={true}
                                defaultValue={this.state.remark}
                                placeholder="异常描述"
                                returnKeyType={'done'}
                                underlineColorAndroid="transparent"
                                blurOnSubmit={true}
                                onChangeText={(text) => this.setState({remark: text})}/>
                        </View>

                        {
                            (() => {
                                if (!this.props.order||(this.props.order && this.props.order.status === 'created'))
                                    return <TouchableOpacity
                                        onPress={() => this.confirmRequest(this.props.order ? '修改' : '创建')}>
                                        <View style={styles.button}>
                                            <Text style={{color: 'white'}}>{this.props.order ? '修改' : '创建'}</Text>
                                        </View>
                                    </TouchableOpacity>
                            })()
                        }

                        {
                            (() => {
                                if (this.props.order && this.props.order.status === 'created')
                                    return <View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <TouchableOpacity onPress={() => this.confirmRequest("删除")}>
                                                <View style={[styles.button, {
                                                    backgroundColor: 'white',
                                                    width: width / 2 - 32
                                                }]}>
                                                    <Text>删除</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.confirmRequest("提交")}>
                                                <View style={[styles.button, {
                                                    backgroundColor: 'white',
                                                    width: width / 2 - 32,
                                                }]}>
                                                    <Text>提交</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={{
                                            marginLeft: 16,
                                            width: width - 32,
                                            paddingBottom: 100
                                        }}>注意：如果修改过单据，需要先修改，再提交，提交后不可修改</Text>
                                    </View>
                            })()
                        }
                    </ScrollView>
                </KeyboardAvoidingView>
                <Loading visible={this.state.isLoading}/>
            </View>

        )
    }
}
const styles = StyleSheet.create({
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
        width: width - 64,
        height: 100,
        marginRight: 10,
    },
    stepButton: {
        flex: 1,
        justifyContent: "center",
    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        height: 55,
        backgroundColor: 'white',
        margin: 16,
        elevation: 2
    },
    supplierTouch: {
        flexDirection: "row",
        height: 55,
        backgroundColor: 'white',
        alignItems: 'center',
        margin: 16,
        justifyContent: 'space-between',
        elevation: 2,
    },
    editContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        height: 100,
        backgroundColor: 'white',
        margin: 16,
        elevation: 2
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