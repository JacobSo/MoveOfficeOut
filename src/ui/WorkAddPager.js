/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    ListView,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import CheckBox from 'react-native-check-box';
import Toast from 'react-native-root-toast';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class PasswordPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            supply: '',
            series: '',
            content: '',
            wayCall: false,
            wayQQ: false,
            wayMeet: false,
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>

                <Toolbar title={['新增工作']}
                         color={Color.colorPrimary}
                         elevation={2}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={['完成']}
                         functionArray={[
                             () => {
                                 this.props.nav.goBack(null)
                             },
                             () => {
                                 if (this.state.content === '' || this.state.series === '' || this.state.supply === '' ||
                                     (this.state.wayCall === false && this.state.wayQQ === false && this.state.wayMeet === false)) {
                                     Toast.show('填写不完整');
                                 } else {
                                     //       console.log(this.state);
                                     this.props.addWork([this.state]);
                                     this.props.nav.goBack(null)
                                 }
                             }]}/>
                <ScrollView>
                    <View style={{backgroundColor: 'white', flexDirection: 'column', margin: 16}}>
                        <Text style={{color: Color.colorPrimary,}}>对接内容</Text>
                        <TextInput style={{width: width - 32, height: 65,}}
                                   multiline={true}
                                   placeholder="输入对接内容"
                                   onChangeText={(text) => this.setState({content: text})}/>
                        <Text style={{color: Color.colorPrimary, marginTop: 16}}>对接方式</Text>
                        <View style={{flexDirection: 'column'}}>
                            <CheckBox
                                style={{padding: 10}}
                                isChecked={false}
                                onClick={() => {
                                    this.setState({wayCall: !this.state.wayCall})
                                } }
                                rightText={'电话'}/>
                            <CheckBox
                                style={{padding: 10}}
                                isChecked={false}
                                onClick={() => {
                                    this.setState({wayQQ: !this.state.wayQQ})
                                }}
                                rightText={'QQ'}/>
                            <CheckBox
                                style={{padding: 10}}
                                isChecked={false}
                                onClick={() => {
                                    this.setState({wayMeet: !this.state.wayMeet})
                                } }
                                rightText={'走访'}/>
                        </View>
                        <View style={{
                            marginTop: 16,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text style={{color: Color.colorPrimary,}}>供应商与系列</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({supply: '', series: ''})
                                }}>
                                <Text>清空</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.nav.navigate(
                                    'param',
                                    {
                                        title: '选择供应商',
                                        type: 0,//supply
                                        searchKey: this.state.series,//if key
                                        setSelect: (select) => {
                                            this.setState({supply: select})
                                        }
                                    },
                                );
                            }}
                        >
                            <Text style={{
                                margin: 16,
                                fontSize: 15
                            }}>{this.state.supply === '' ? '选择供应商' : this.state.supply}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.nav.navigate(
                                    'param',
                                    {
                                        title: '选择系列',
                                        type: 1,//series
                                        searchKey: this.state.supply,//if key
                                        setSelect: (select) => {
                                            this.setState({series: select})
                                        }
                                    },
                                );
                            }}>
                            <Text style={{
                                marginLeft: 16,
                                fontSize: 15
                            }}>{this.state.series === '' ? '选择系列' : this.state.series}</Text>
                        </TouchableOpacity>


                    </View>
                </ScrollView>
                <Loading visible={this.state.isLoading}/>
            </View>
        )
    }
}
