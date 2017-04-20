/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import CheckBox from '../ui/Component/CheckBox';
import Toast from 'react-native-root-toast';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class PasswordPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            SupplierName: '',
            Series: '',
            WorkContent: '',
            VisitingMode: '',
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
                                 if (this.state.WorkContent === '' || this.state.Series === '' || this.state.SupplierName === '' ||
                                     (this.state.wayCall === false && this.state.wayQQ === false && this.state.wayMeet === false)) {
                                     Toast.show('填写不完整');
                                 } else {
                                     //       console.log(this.state);
                                     this.setState({
                                         VisitingMode:( (this.state.wayQQ ? "QQ" : "") +
                                         (this.state.wayCall ? "电话" : "") +
                                         (this.state.wayMeet ? "走访" : ""))
                                     });
                                     this.props.addWork([this.state]);
                                     this.props.nav.goBack(null)
                                 }
                             }]}/>
                <ScrollView>
                    <View style={{backgroundColor: 'white', flexDirection: 'column', margin: 16}}>
                        <Text style={{color: Color.colorPrimary,}}>对接内容</Text>
                        <TextInput style={styles.textInput}
                                   multiline={true}
                                   placeholder="输入对接内容"
                                   returnKeyType={'done'}
                                   underlineColorAndroid="transparent"
                                   blurOnSubmit={true}
                                   onChangeText={(text) => this.setState({WorkContent: text})}/>
                        <Text style={{color: Color.colorPrimary, marginTop: 16}}>对接方式</Text>
                        <View style={{flexDirection: 'column'}}>
                            <CheckBox
                                style={{padding: 10}}
                                isChecked={false}
                                onClick={() => {
                                    this.setState({wayCall: !this.state.wayCall,
                                        VisitingMode:( (this.state.wayQQ ? "QQ " : "") +
                                        (!this.state.wayCall ? "电话 " : "") +
                                        (this.state.wayMeet ? "走访" : ""))})

                                } }
                                rightText={'电话'}/>
                            <CheckBox
                                style={{padding: 10}}
                                isChecked={false}
                                onClick={() => {
                                    this.setState({wayQQ: !this.state.wayQQ,
                                        VisitingMode:( (!this.state.wayQQ ? "QQ " : "") +
                                        (this.state.wayCall ? "电话 " : "") +
                                        (this.state.wayMeet ? "走访" : ""))})
                                }}
                                rightText={'QQ'}/>
                            <CheckBox
                                style={{padding: 10}}
                                isChecked={false}
                                onClick={() => {
                                    this.setState({wayMeet: !this.state.wayMeet, VisitingMode:( (this.state.wayQQ ? "QQ " : "") +
                                    (this.state.wayCall ? "电话 " : "") +
                                    (!this.state.wayMeet ? "走访" : ""))})
                                } }
                                rightText={'走访'}/>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={{color: Color.colorPrimary,}}>供应商与系列</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({SupplierName: '', Series: ''})
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
                                        type: 0,//SupplierName
                                        searchKey: this.state.Series,//if key
                                        setSelect: (select) => {
                                            this.setState({SupplierName: select})
                                        },
                                        isMulti:true,
                                    },
                                );
                            }}
                        >
                            <Text style={styles.titleText}>{this.state.SupplierName === '' ? '选择供应商' : this.state.SupplierName}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.nav.navigate(
                                    'param',
                                    {
                                        title: '选择系列',
                                        type: 1,//Series
                                        searchKey: this.state.SupplierName,//if key
                                        setSelect: (select) => {
                                            this.setState({Series: select})
                                        },
                                        isMulti:true,
                                    },
                                );
                            }}>
                            <Text style={styles.titleText}>{this.state.Series === '' ? '选择系列' : this.state.Series}</Text>
                        </TouchableOpacity>


                    </View>
                </ScrollView>
                <Loading visible={this.state.isLoading}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    textInput: {
        width: width - 32,
        height: 65,
        borderColor: Color.line,
        borderBottomWidth: 1,
    },
    titleText: {
        margin: 10,
        paddingTop:16,
        fontSize: 15
    },
    textContainer:{
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});