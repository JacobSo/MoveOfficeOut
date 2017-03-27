/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ListView,
    Text,
    StyleSheet,
    InteractionManager, TextInput,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';
import App from '../constant/Application';
import ApiService from '../network/ApiService';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class WorkSignPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comment: '',
        }
    }

    _sign() {
        if(this.state.comment!==''){
            this.setState({isLoading: true});
            ApiService.sighWork(this.state.task.Guid, this.state.comment)
                .then((responseJson) => {
                    if (!responseJson.IsErr) {
                        Toast.show('操作成功');
                        this.props.task.list[this.props.position].WorkResult = this.state.comment;
                        this.props.commentWork(this.props.task.list);
                        this.setState({isLoading: false});
                        this.props.nav.pop()
                    } else Toast.show(responseJson.ErrDesc);
                })
                .done();
        }else Toast.show('未填写内容');


    }


    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar
                    title={['对接工作']}
                    color={Color.colorPrimary}
                    elevation={2}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['提交']}
                    functionArray={[
                        () => {
                            this.props.nav.pop()
                        },
                        () => {
                        this._sign();
                        }
                    ]}/>

                <Text style={{color: Color.colorPrimary, margin: 16}}>对接内容</Text>

                <View style={styles.textStyle}>
                    <Text >系列</Text>
                    <Text style={{color: Color.black_semi_transparent}}>{this.props.task.list[this.props.position].Series}</Text>
                </View>
                <View style={styles.textStyle}>
                    <Text >供应商</Text>
                    <Text style={{color: Color.black_semi_transparent}}>{this.props.task.list[this.props.position].SupplierName}</Text>
                </View>
                <View style={styles.textStyle}>
                    <Text >对接方式</Text>
                    <Text style={{color: Color.black_semi_transparent}}>{this.props.task.list[this.props.position].VisitingMode}</Text>
                </View>
                <View style={styles.textStyle}>
                    <Text >对接内容</Text>
                    <Text style={{color: Color.black_semi_transparent}}>{this.props.task.list[this.props.position].WorkContent}</Text>
                </View>

                <Text style={{color: Color.colorPrimary, margin: 16}}>对接结果反馈</Text>
                <TextInput style={{width: width - 32, height: 45, marginLeft: 10, marginRight: 10}}
                           placeholder="在此输入"
                           onChangeText={(text) => {
                                this.setState({comment:text})
                           }}/>

                <Loading visible={this.state.isLoading}/>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        mainContainer: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundColor: 'white',
            elevation: 2,
            margin: 16,
        },

        textStyle: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginLeft: 16,
            marginRight: 16,
            marginBottom: 5,
            marginTop: 5
        },

        line: {
            backgroundColor: Color.line,
            width: width - 32,
            height: 1,

        },
    });
