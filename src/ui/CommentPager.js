/**
 * Created by Administrator on 2017/3/13.
 *
 * loading usage
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Platform,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import SnackBar from 'react-native-snackbar-dialog'
import App from '../constant/Application';
import ApiService from '../network/ApiService';
import StarSeek from "./Component/StarSeek";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class CommentPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            starA: 0,
            starB: 0,
            starC: 0,
            comment: '',
            task: this.props.task,
        }
    }

    _comment() {
        this.setState({isLoading: true});
        let type = 2;
        let score = this.state.starA + ':' + this.state.starB + ':' + this.state.starC;
        if (App.jobType === '2') type = 0;
        else if (App.jobType === '3') type = 1;

        ApiService.addScore(this.state.task.Guid, score,
            this.state.task.list[this.props.position].Guid,
            this.state.comment, type)
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    SnackBar.show('操作成功');
                    if ((App.jobType==='2'||App.jobType==='5')) {
                        this.state.task.list[this.props.position].ZhuanYuanScore = score;
                        this.state.task.list[this.props.position].ZhuanYuanSuggest = this.state.comment;
                    } else {
                        this.state.task.list[this.props.position].ShuJuScore = score;
                        this.state.task.list[this.props.position].ShuJuSuggest = this.state.comment;
                    }
                    this.props.commentWork(this.state.task.list);

                    this.props.nav.goBack(null)
                } else {
                    SnackBar.show(responseJson.ErrDesc);
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
            })
            .done();
    }

    _fullView() {
        if (this.props.type === 0) {
            return null
        } else {
            return (<View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <StarSeek style={{margin: 16}} onSelect={(select) => this.setState({starA: select})}/>
                    <Text style={{margin: 16, textAlign: 'right'}}>工作效率</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <StarSeek style={{margin: 16}} onSelect={(select) => this.setState({starB: select})}/>
                    <Text style={{margin: 16, textAlign: 'right'}}>结果质量</Text>
                </View>
            </View>);
        }
    }

    render() {
        return (
            <View style={{
                backgroundColor: Color.background,
                height: height,
                marginBottom: 25
            }}>
                <Toolbar
                    title={[('对' + this.props.task.Creator + '的工作评价'),
                        (this.props.task.list[this.props.position].Series + '/' + this.props.task.list[this.props.position].SupplierName)]}
                    color={Color.colorCyan}
                    elevation={2}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['提交评价']}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        () => {
                            this._comment();
                        }
                    ]}/>
                <KeyboardAvoidingView behavior='position'
                                      keyboardVerticalOffset={
                                          Platform.select({
                                              ios: () => 0,
                                              android: () => 30
                                          })()
                                      }>
                    <ScrollView
                        style={{backgroundColor: Color.background,}}
                    >
                        <View>
                            <Text style={styles.titleStyle}>对接内容</Text>
                            <Text style={{
                                marginLeft: 16,
                                marginRight: 16
                            }}>{this.props.task.list[this.props.position].WorkResult}</Text>


                            <Text style={styles.titleStyle}>工作评分</Text>
                            {this._fullView()}
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <StarSeek style={{margin: 16}} onSelect={(select) => this.setState({starC: select})}/>
                                <Text style={{margin: 16, width: 65, textAlign: 'right'}}>进度反馈详细程度</Text>
                            </View>

                            <Text style={{color: Color.colorPrimary, marginLeft: 16, marginTop: 16}}>工作评价与建议</Text>
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
                    </ScrollView>
                </KeyboardAvoidingView>
                <Loading visible={this.state.isLoading}/>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    titleStyle: {
        color: Color.colorPrimary,
        margin: 16,
    },


    textInput: {
        width: width - 32,
        height: 55,
        marginLeft: 16,
        marginRight: 16,
        borderColor: Color.line,
        borderBottomWidth: 1,
    }
});
