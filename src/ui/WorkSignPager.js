/**
 * Created by Administrator on 2017/3/13.
 *
 * loading usage
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';
import ApiService from '../network/ApiService';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class WorkSignPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            comment:this.props.content,
            items: this.props.task.list,
        }
    }

    _sign() {
        if (this.state.comment !== '') {
            this.setState({isLoading: true});
            ApiService.sighWork(this.state.items[this.props.position].Guid, this.state.comment)
                .then((responseJson) => {
                    if (!responseJson.IsErr) {
                        Toast.show('操作成功');
                        this.state.items[this.props.position].WorkResult = this.state.comment;
                        //    console.log('----------'+JSON.stringify(this.state.items));
                        this.props.commentWork(this.state.items);
                        this.props.nav.goBack(null);
                    } else {
                        Toast.show(responseJson.ErrDesc);
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
                .done();
        } else Toast.show('未填写内容');
    }

    render() {
        return (
            <View>
                <Toolbar
                    title={['对接工作']}
                    color={Color.colorCyanDark}
                    elevation={2}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['提交']}
                    functionArray={[
                        () => this.props.nav.goBack(null),
                        () => this._sign()
                    ]}/>

                <ScrollView>
                    <View style={{height: height}}>
                        <Text style={{color: Color.colorPrimary, marginTop: 16, marginLeft: 16}}>对接结果反馈</Text>
                        <TextInput style={styles.textInput}
                                   multiline={true}
                                   placeholder="在此输入"
                                   defaultValue={this.props.content}
                                   returnKeyType={'done'}
                                   underlineColorAndroid="transparent"
                                   blurOnSubmit={true}
                                   onChangeText={(text) => {
                                       this.setState({comment: text})
                                   }}/>


                        <Text style={styles.titleStyle}>对接内容</Text>
                        <View style={styles.textStyle}>
                            <Text >系列</Text>
                            <Text
                                style={styles.textItem}>{this.state.items[this.props.position].Series}</Text>
                        </View>
                        <View style={styles.textStyle}>
                            <Text >供应商</Text>
                            <Text
                                style={styles.textItem}>{this.state.items[this.props.position].SupplierName}</Text>
                        </View>
                        <View style={styles.textStyle}>
                            <Text >对接方式</Text>
                            <Text
                                style={styles.textItem}>{this.state.items[this.props.position].VisitingMode}</Text>
                        </View>
                        <View style={styles.textStyle}>
                            <Text >对接内容</Text>
                            <Text
                                style={styles.textItem}>{this.state.items[this.props.position].WorkContent}</Text>
                        </View>


                    </View>
                </ScrollView>
                <Loading visible={this.state.isLoading}/></View>
        )
    }
}

const styles = StyleSheet.create(
    {
        textStyle: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginLeft: 16,
            marginRight: 16,
            marginBottom: 5,
            marginTop: 5
        },


        textInput: {
            width: width - 32,
            height: 55,
            marginLeft: 10,
            marginRight: 10,
            borderColor: Color.line,
            borderBottomWidth: 1,
        },
        titleStyle: {
            color: Color.colorPrimary,
            margin: 16
        },
        textItem: {
            color: Color.black_semi_transparent,
            width: 200,
            textAlign: 'right'
        }
    });
