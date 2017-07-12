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
    Alert,Platform,BackHandler
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import CheckBox from '../ui/Component/CheckBox';
import SnackBar from 'react-native-snackbar-dialog'
import App from '../constant/Application';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class PasswordPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            SupplierName: this.props.existData.SupplierName,
            Series: this.props.existData.Series,
            WorkContent: this.props.existData.WorkContent,
            VisitingMode: this.props.existData.VisitingMode,
            wayCall: this.props.existData.wayCall,
            wayQQ: this.props.existData.wayQQ,
            wayMeet: this.props.existData.wayMeet,
        };
        //  console.log(JSON.stringify(this.state))
    }

    componentWillUnmount() {
        if (Platform.OS === "android")
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAction);
    }

    componentWillMount() {
        if (Platform.OS === "android")
            BackHandler.addEventListener('hardwareBackPress', this.onBackAction);
    }
    onBackAction=()=>{
        Alert.alert(
            '退出编辑？',
            '放弃当前填写内容？退出后不可恢复',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.props.nav.goBack(null)
                }
                },
            ]
        );
        return true
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white'
                }}>

                <Toolbar
                    title={['新增工作']}
                    color={Color.colorCyan}
                    elevation={2}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['删除', '完成']}
                    functionArray={[
                        () => {
                            if (this.state.SupplierName || this.state.Series || this.state.WorkContent) {

                            } else {
                                this.props.nav.goBack(null)
                            }

                        },
                        () => {
                            Alert.alert(
                                '删除工作项',
                                '删除当前工作项？删除后不可恢复',
                                [
                                    {
                                        text: '取消', onPress: () => {
                                    }
                                    },
                                    {
                                        text: '确定', onPress: () => {
                                        this.props.deleteData();
                                        this.props.nav.goBack(null)
                                    }
                                    },
                                ]
                            );

                        },
                        () => {
                            if (this.state.WorkContent === '' || this.state.SupplierName === '' ||
                                (this.state.wayCall === false && this.state.wayQQ === false && this.state.wayMeet === false)
                                || ( this.state.Series === '' && App.department.indexOf('仓库')<0)) {
                                SnackBar.show('填写不完整');
                            } else {
                                //       console.log(this.state);
                                this.setState({
                                    VisitingMode: ( (this.state.wayQQ ? "QQ" : "") +
                                    (this.state.wayCall ? "电话" : "") +
                                    (this.state.wayMeet ? "走访" : ""))
                                });
                                this.props.addWork([this.state]);
                                this.props.nav.goBack(null)
                            }
                        }]}/>
                <ScrollView>
                    <View style={{backgroundColor: 'white', flexDirection: 'column', margin: 16}}>
                        <Text style={{color: Color.colorCyan,}}>对接内容</Text>
                        <TextInput style={styles.textInput}
                                   multiline={true}
                                   defaultValue={this.state.WorkContent}
                                   placeholder="输入对接内容"
                                   returnKeyType={'done'}
                                   underlineColorAndroid="transparent"
                                   blurOnSubmit={true}
                                   onChangeText={(text) => this.setState({WorkContent: text})}/>
                        <Text style={{color: Color.colorCyan, marginTop: 16}}>对接方式</Text>
                        <View style={{flexDirection: 'column'}}>
                            <CheckBox
                                style={{padding: 10}}
                                isChecked={this.state.wayCall}
                                onClick={() => {
                                    this.setState({
                                        wayCall: !this.state.wayCall,
                                        VisitingMode: ( (this.state.wayQQ ? "QQ " : "") +
                                        (!this.state.wayCall ? "电话 " : "") +
                                        (this.state.wayMeet ? "走访" : ""))
                                    })

                                } }
                                rightText={'电话'}/>
                            <CheckBox
                                style={{padding: 10}}
                                isChecked={this.state.wayQQ}
                                onClick={() => {
                                    this.setState({
                                        wayQQ: !this.state.wayQQ,
                                        VisitingMode: ( (!this.state.wayQQ ? "QQ " : "") +
                                        (this.state.wayCall ? "电话 " : "") +
                                        (this.state.wayMeet ? "走访" : ""))
                                    })
                                }}
                                rightText={'QQ'}/>

                            <CheckBox
                                style={{padding: 10}}
                                isChecked={this.state.wayMeet}
                                onClick={() => {
                                    this.setState({
                                        wayMeet: !this.state.wayMeet, VisitingMode: ( (this.state.wayQQ ? "QQ " : "") +
                                        (this.state.wayCall ? "电话 " : "") +
                                        (!this.state.wayMeet ? "走访" : ""))
                                    });
                                    if (this.state.SupplierName.split(',').length > 1) {
                                        SnackBar.show("请重新选择供应商");
                                        this.setState({SupplierName: '',})
                                    }
                                } }
                                rightText={'走访'}/>


                        </View>
                        <View style={styles.textContainer}>
                            <Text style={{color: Color.colorCyan,}}>供应商与系列</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        SupplierName: '',
                                        Series: ''
                                    })
                                }}>
                                <Text>清空</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.wayCall || this.state.wayMeet || this.state.wayQQ) {
                                    this.props.nav.navigate(
                                        'param',
                                        {
                                            title: '选择供应商',
                                            type: 0,//SupplierName
                                            searchKey: this.state.Series,//if key
                                            setSelect: (select) => {
                                                this.setState({SupplierName: select})
                                            },
                                            isMulti: !this.state.wayMeet,
                                            existData: this.state.SupplierName ? this.state.SupplierName.split(',') : []
                                        },
                                    );
                                } else {
                                    SnackBar.show("请先选择对接方式")
                                }

                            }}
                        >
                            <Text
                                style={styles.titleText}>{this.state.SupplierName === '' ? '选择供应商' : this.state.SupplierName}</Text>
                        </TouchableOpacity>
                        {
                            (() => {
                                if (App.department.indexOf('仓库') < 0) {
                                    return <TouchableOpacity
                                        onPress={() => {
                                            if (this.state.wayCall || this.state.wayMeet || this.state.wayQQ) {
                                                this.props.nav.navigate(
                                                    'param',
                                                    {
                                                        title: '选择系列',
                                                        type: 1,//Series
                                                        searchKey: this.state.SupplierName,//if key
                                                        setSelect: (select) => {
                                                            this.setState({Series: select})
                                                        },
                                                        isMulti: true,
                                                        existData: this.state.Series ? this.state.Series.split(',') : []
                                                    },
                                                );
                                            } else {
                                                SnackBar.show("请先选择对接方式")
                                            }

                                        }}>
                                        <Text
                                            style={styles.titleText}>{this.state.Series === '' ? '选择系列' : this.state.Series}</Text>
                                    </TouchableOpacity>
                                }
                            })()
                        }
                    </View>
                </ScrollView>
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
        paddingTop: 16,
        fontSize: 15
    },
    textContainer: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});