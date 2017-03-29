/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ListView,
    Text,
    TouchableOpacity,
    InteractionManager, TextInput, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';
import App from '../constant/Application';
import ApiService from '../network/ApiService';
import CheckBox from 'react-native-check-box';
import InputDialog from "./Component/InputDialog";
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
        if (App.workType === '项目专员') type = 0;
        else if (App.workType === '数据专员') type = 1;

        ApiService.addScore(this.state.task.Guid, score,
            this.state.task.list[this.props.position].Guid,
            this.state.comment, type)
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    Toast.show('操作成功');
                    if (App.workType.indexOf('项目专员') > -1) {
                        this.state.task.list[this.props.position].ZhuanYuanScore = score;
                        this.state.task.list[this.props.position].ZhuanYuanSuggest = this.state.comment;
                    } else {
                        this.state.task.list[this.props.position].ShuJuScore = score;
                        this.state.task.list[this.props.position].ShuJuSuggest = this.state.comment;
                    }
                    this.props.commentWork(this.state.task.list);
                    this.setState({isLoading: false});
                    this.props.nav.pop()
                } else Toast.show(responseJson.ErrDesc);
            })

            .done();
    }

    _fullView() {
        if(this.props.type===0){
            return null
        }else{
            return (<View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <StarSeek style={{margin: 16}} onSelect={(select) => this.setState({starA: select})}/>
                    <Text style={{margin: 16,textAlign:'right'}}>工作效率</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <StarSeek style={{margin: 16}} onSelect={(select) => this.setState({starB: select})}/>
                    <Text style={{margin: 16,textAlign:'right'}}>结果质量</Text>
                </View>
            </View>);
        }

    }

    render() {
        return (

            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar
                    title={[('对' + this.props.task.Creator + '的工作评价'), (this.props.task.list[this.props.position].Series + '/' + this.props.task.list[this.props.position].SupplierName)]}
                    color={Color.colorPrimary}
                    elevation={2}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['提交评价']}
                    functionArray={[
                        () => {
                            this.props.nav.pop()
                        },
                        () => {
                            this._comment();
                        }
                    ]}/>
                <KeyboardAvoidingView behavior='position' >
                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                            height:height
                        }}>
                        <View>
                <Text style={{color: Color.colorPrimary, margin: 16}}>对接内容</Text>
                <Text style={{
                    marginLeft: 16,
                    marginRight: 16
                }}>{this.props.task.list[this.props.position].WorkResult}</Text>


                <Text style={{color: Color.colorPrimary, margin: 16,}}>工作评分</Text>
                {this._fullView()}
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <StarSeek style={{margin: 16}} onSelect={(select) => this.setState({starC: select})}/>
                    <Text style={{margin: 16,width:65,textAlign:'right'}}>进度反馈详细程度</Text>
                </View>

                <Text style={{color: Color.colorPrimary, margin: 16}}>工作评价与建议</Text>
                <TextInput style={{width: width - 32, height: 45, marginLeft: 10, marginRight: 10}}
                           placeholder="在此输入"
                           onChangeText={(text) => {
                                this.setState({comment:text})
                           }}/>
                        </View></ScrollView></KeyboardAvoidingView>

                <Loading visible={this.state.isLoading}/>
            </View>

        )
    }
}
