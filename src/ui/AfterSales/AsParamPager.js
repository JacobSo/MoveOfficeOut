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
    InteractionManager,
    TextInput,
    StyleSheet, Switch,
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import SnackBar from 'react-native-snackbar-dialog'
import ApiService from '../../network/AsApiService';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class AsParamPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            itemsA: [],//true
            itemsB: [],//false default
            items: [],
            switchType: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions(() => {
        this.getData();
        //  console.log(App.FirstDptId+'--------------')
        //     });
    }

    getData() {
        this.setState({isLoading: true});
        InteractionManager.runAfterInteractions(() => {
            (this.props.mode === 0 ? ApiService.getSupplierList(this.state.switchType ? '材料商' : '成品商') : ApiService.getExceptionList(this.props.mode - 1))
                .then((responseJson) => {
                    if (responseJson.status === 0) {
                        if (this.state.switchType)
                            this.state.itemsA = responseJson.data;
                        else
                            this.state.itemsB = responseJson.data;
                        this.state.items = responseJson.data;
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                        });
                    } else SnackBar.show(responseJson.message)
                }).catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            }).done(setTimeout(() => {
                this.setState({isLoading: false})
            }, 100))
        });
    }

    getItemView(rowData) {
        if (this.props.mode === 0) {
            return <TouchableOpacity onPress={() => {
                this.props.actionFunc(rowData.supplier_name);
                this.props.nav.goBack(null);
            }}
            >
                <Text style={{padding: 30,}}>{rowData.short_name === rowData.supplier_name ?
                    rowData.supplier_name : (rowData.short_name + "\n" + rowData.supplier_name)}</Text>

            </TouchableOpacity>
        } else {
            return <TouchableOpacity onPress={() => {
                this.props.actionFunc(rowData);
                this.props.nav.goBack(null);
            }}>
                <Text style={{
                    padding: 20,
                    borderColor: Color.line,
                    borderBottomWidth: 1
                }}>{rowData}</Text>
            </TouchableOpacity>
        }
    }


    async  _search(text) {
        //console.log(JSON.stringify(this.state.items))
        if (this.props.mode === 0) {
            if (this.state.switchType) {
                return this.state.itemsA.filter((item) => {
                    //console.log(item);
                    return item ? (JSON.stringify(item).toLowerCase().indexOf(text.toLowerCase()) > -1) : ("无");
                });
            } else {
                return this.state.itemsB.filter((item) => {
                    //console.log(item);
                    return item ? (JSON.stringify(item).toLowerCase().indexOf(text.toLowerCase()) > -1) : ("无");
                });
            }
        } else {
            return this.state.items.filter((item) => {
                //console.log(item);
                return item ? (JSON.stringify(item).toLowerCase().indexOf(text.toLowerCase()) > -1) : ("无");
            });
        }

    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: Color.backgroundColor}}>
                <Toolbar
                    title={[this.props.mode === 0 ? '供应商列表' : (this.props.mode === 1 ? '异常原因' : (this.props.mode === 2 ? '异常类型' : "处罚金额"))]}
                    color={Color.colorAmber}
                    elevation={2}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={[]}
                    functionArray={[() => this.props.nav.goBack(null),]}/>
                <TextInput style={styles.textInput}
                           placeholder="搜索"
                           returnKeyType={'done'}
                           blurOnSubmit={true}
                           underlineColorAndroid="transparent"
                           onChangeText={(text) => {
                               this._search(text).then((array) => {
                                   //       console.log(array);
                                   this.setState({
                                       dataSource: this.state.dataSource.cloneWithRows(array),
                                   });
                               })
                           }}/>
                {
                    (() => {
                        if (this.props.mode === 0) {
                            return <View style={{
                                paddingLeft: 16,
                                paddingRight: 16,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderColor: Color.line,
                                borderBottomWidth: 1
                            }}>
                                <Text style={{
                                    color: Color.content
                                }}>{this.state.switchType ? '材料商' : '成品商'}</Text>
                                <Switch
                                    onValueChange={(value) => {
                                        this.setState({
                                            switchType: value,
                                        });
                                        if (value) {
                                            if (this.state.itemsA.length !== 0) {
                                                this.setState({
                                                    dataSource: this.state.dataSource.cloneWithRows(this.state.itemsA),
                                                });
                                            } else {
                                                this.getData()
                                            }
                                        } else {
                                            if (this.state.itemsB.length !== 0) {
                                                this.setState({
                                                    dataSource: this.state.dataSource.cloneWithRows(this.state.itemsB),
                                                });
                                            } else {
                                                this.getData()
                                            }
                                        }
                                    }}
                                    onTintColor={Color.colorAmber}
                                    tintColor={Color.colorBlueGrey}
                                    thumbTintColor={Color.backgroundColor}
                                    value={this.state.switchType}/>
                            </View>
                        }
                    })()
                }


                <View style={{flexDirection: 'row'}}>
                    <ListView
                        style={{marginBottom: 180, flex: 1}}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        enableEmptySections={true}
                        renderRow={ (rowData, sectionID, rowID) =>
                            this.getItemView(rowData)
                        }/>
                </View>
                <Loading visible={this.state.isLoading}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    textInput: {
        width: width - 32,
        height: 45,
        margin: 16,
        backgroundColor: 'white',
        elevation: 2,
        borderRadius: 50,
        textAlign: 'center'
    },

});