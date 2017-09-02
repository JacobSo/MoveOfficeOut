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
    Image,
    KeyboardAvoidingView,
    StyleSheet, TouchableOpacity, TextInput, ListView
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import ApiService from '../../network/AsApiService';
import {NavigationActions,} from 'react-navigation';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class AsSignOrderPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isDetail: false,
            isEdit: false,
            isModify: false,
            modifyPosition: 0,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            editList: [],
            editContent: '',
        }
    }

    onDetail() {
        if (this.state.isDetail) {
            return (
                <View style={[styles.card, {height: height / 2 - 45}]}>
                    <View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", margin: 10}}>
                            <Text style={{color: Color.content}}>单据编号</Text>
                            <Text>-</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", margin: 10}}>
                            <Text style={{color: Color.content}}>单据类型</Text>
                            <Text>-</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", margin: 10}}>
                            <Text style={{color: Color.content}}>建单日期</Text>
                            <Text>-</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", margin: 10}}>
                            <Text style={{color: Color.content}}>客户</Text>
                            <Text>-</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", margin: 10}}>
                            <Text style={{color: Color.content}}>物料编码</Text>
                            <Text>-</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", margin: 10}}>
                            <Text style={{color: Color.content}}>售后专员</Text>
                            <Text>-</Text>
                        </View>
                        <TouchableOpacity style={{width: width - 32, alignItems: "center"}}
                                          onPress={() => this.setState({isDetail: false})}>
                            <Text style={{margin: 10, color: Color.colorAmber}}>收起</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    onEdit() {
        if (this.state.isEdit)
            return (<View style={{alignItems: 'center'}}>
                {
                    (() => {
                        if (this.state.editList.length !== 0)
                            return <View style={{backgroundColor: Color.line, width: width - 32, height: 1}}/>
                    })()
                }

                <ListView
                    dataSource={this.state.dataSource}
                    style={{marginLeft: 16, marginRight: 16, width: width - 32}}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    renderRow={(rowData, sectionID, rowID) =>
                        <View style={{
                            flexDirection: 'row',
                            width: width - 32,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: this.state.isModify && this.state.modifyPosition === rowID ? Color.line : 'white',
                                    padding: 10,
                                    width: width - 64+8
                                }}
                                onPress={
                                    () => {
                                        this.setState({
                                            modifyPosition: rowID,
                                            isModify: !this.state.isModify,
                                            editContent: this.state.isModify ? '' : rowData,//last status not update to date
                                        })
                                    }
                                }>
                                <Text style={{color: Color.colorAmber}}>{'第' + (Number(rowID) + 1) + '条跟进描述'}</Text>
                                <Text>{rowData}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.state.editList.splice(rowID, 1);
                                    this.setState({
                                        dataSource: this.state.dataSource.cloneWithRows(this.state.editList)
                                    })
                                }}>
                                <Image source={require('../../drawable/close_post_label.png')}
                                       style={{width: 25, height: 25}}/>

                                {/*<Text >删除</Text>*/}
                            </TouchableOpacity>
                        </View>
                    }/>


                <View style={{margin: 16, paddingBottom: 80}}>
                    <TextInput style={styles.textInput}
                               multiline={true}
                               defaultValue={this.state.editContent}
                               placeholder="在这里填写跟进情况"
                               returnKeyType={'done'}
                               underlineColorAndroid="transparent"
                               blurOnSubmit={true}
                               onChangeText={(text) => this.setState({editContent: text})}/>
                    <View style={{width: width - 32, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity style={{alignItems: "center", backgroundColor: 'white', flex: 1}}
                                          onPress={() => this.setState({isEdit: false})}>
                            <Text style={{margin: 10,}}>收起</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{alignItems: "center", backgroundColor: Color.colorAmber, flex: 1}}
                            onPress={() => {
                                if (this.state.editContent) {
                                    if (this.state.isModify)
                                        this.state.editList[this.state.modifyPosition] = this.state.editContent;
                                    else
                                        this.state.editList.push(this.state.editContent);
                                    this.setState({
                                        dataSource: this.state.dataSource.cloneWithRows(this.state.editList),
                                        editContent: '',
                                        isModify: false,
                                    })
                                }

                            }}>
                            <Text style={{margin: 10, color: "white"}}>{this.state.isModify ? '修改' : '新增描述'}</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>)
    }


    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar title={['单据跟踪']}
                         color={Color.colorAmber}
                         elevation={2}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={['提交']}
                         functionArray={[
                             () => this.props.nav.goBack(null),
                             () => {
                             }
                         ]}/>

                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-55}>
                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>
                        <View style={{backgroundColor: Color.background, flexDirection: 'column',}}>

                            <TouchableOpacity
                                style={{
                                    justifyContent: "space-between",
                                    flexDirection: "row",
                                    alignItems: 'center',
                                    margin: 16
                                }}
                                onPress={() => this.setState({isDetail: !this.state.isDetail})}>
                                <Text>单据编号</Text>
                                <View style={{flexDirection: "row", alignItems: 'center', height: 20}}>
                                    <Text style={{color: Color.content}}>详细</Text>
                                    <Image source={require("../../drawable/info_icon.png")}
                                           style={{width: 15, height: 15, marginLeft: 10}}/>
                                </View>
                            </TouchableOpacity>
                            <View style={{alignItems: "center", width: width}}>
                                <View style={{backgroundColor: Color.line, width: width - 32, height: 1}}/>
                            </View>

                            {
                                this.onDetail()
                            }

                            <TouchableOpacity style={styles.card}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                    <Text style={{marginLeft: 16}}>原料供应商</Text>
                                </View>
                                <Image source={require("../../drawable/arrow.png")}
                                       style={{width: 10, height: 20, marginRight: 10}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card}
                                              onPress={() => this.props.nav.navigate('asProduct', {})}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                    <Text style={{marginLeft: 16}}>产品列表</Text>
                                </View>
                                <Image source={require("../../drawable/arrow.png")}
                                       style={{width: 10, height: 20, marginRight: 10}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card} onPress={() => this.props.nav.navigate('asForm', {})}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                    <Text style={{marginLeft: 16}}>责任单</Text>
                                </View>
                                <Image source={require("../../drawable/arrow.png")}
                                       style={{width: 10, height: 20, marginRight: 10}}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card}
                                              onPress={() => this.setState({isEdit: !this.state.isEdit})}>
                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                    <View style={{
                                        backgroundColor: this.state.editList.length === 0 ? Color.line : Color.colorAmber,
                                        width: 10,
                                        height: 55
                                    }}/>
                                    <Text style={{marginLeft: 16}}>跟进进度</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text>{this.state.editList.length}</Text>
                                    <Image source={require("../../drawable/arrow.png")}
                                           style={{width: 10, height: 20, marginRight: 10, marginLeft: 10}}/>
                                </View>
                            </TouchableOpacity>
                            {
                                this.onEdit()
                            }


                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <Loading visible={this.state.isLoading}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        height: 55,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        marginLeft: 16,
        marginRight: 16,
        marginTop: 16,
        elevation: 2,
    },
    textInput: {
        width: width - 32,
        height: 65,
        padding: 5,
        backgroundColor: "white",
    },

});