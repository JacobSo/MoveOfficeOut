'use strict';
import React, {Component} from 'react';
import {
    View,
    ListView,
    Text,
    TouchableOpacity,
    InteractionManager,
    TextInput,
    StyleSheet,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import SnackBar from 'react-native-snackbar-dialog'
import ApiService from '../network/ApiService';
import InputDialog from "./Component/InputDialog";
import App from '../constant/Application';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class PasswordPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMulti: this.props.isMulti,
            isLoading: false,
            editContent: '',
            editContentSub: '',
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),

            selectItems: this.props.existData,
            selectDataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions(() => {
        this._getData();
        //  console.log(App.FirstDptId+'--------------')
        //     });
    }

    _getData() {
        this.setState({isLoading: true});
        InteractionManager.runAfterInteractions(() => {
            if (this.props.type === 2) {
                ApiService.getCarList()
                    .then((responseJson) => {
                        if (!responseJson.IsErr) {
                            this.state.items = responseJson.list;
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                            });
                        } else SnackBar.show(responseJson.ErrDesc)
                    })
                    .done(this.setState({isLoading: false}))
            } else {
                ApiService.searchParam(this.props.type, this.props.type === 0 ? this.props.searchKey : '', this.props.type === 0 ? '' : this.props.searchKey)
                    .then((responseJson) => {
                        if (!responseJson.IsErr) {
                            this.state.items = responseJson.list;
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                                selectDataSource: this.state.selectDataSource.cloneWithRows(this.state.selectItems),

                            });
                        } else SnackBar.show(responseJson.ErrDesc)
                    })
                    .done(this.setState({isLoading: false}))
            }
        });
    }

    _setSelect(rowData) {
        if (this.props.type === 2) {//car
            ApiService.addCar(this.props.searchKey, rowData)
                .then((responseJson) => {
                    if (!responseJson.IsErr) {
                        SnackBar.show('操作成功');
                        this.props.setSelect(rowData);
                    } else SnackBar.show(responseJson.ErrDesc)
                })
                .done(this.props.nav.goBack(null))
            this.props.setSelect(rowData);
        } else {
            this.props.setSelect(rowData);

            this.props.nav.goBack(null);
        }
    }

    _addSelect(rowData) {
        let isExist = false;
        this.state.selectItems.map((x, index) => {
            if (this.state.selectItems[index] === rowData) {
                isExist = true;
            }
        });
        console.log(JSON.stringify(this.state.selectItems));
        if (!isExist) {
            this.state.selectItems.push(rowData);
            this.setState({
                selectDataSource: this.state.selectDataSource.cloneWithRows(this.state.selectItems),
            });
        }
    }

    async  _search(text) {
        //console.log(JSON.stringify(this.state.items))
        return this.state.items.filter((item) => {
            console.log(item);
            return item ? (item.toLowerCase().indexOf(text.toLowerCase()) > -1) : ("无");
        });
    }

    _editDialog() {
        return (
            <InputDialog
                isMulti={(this.props.title.indexOf('供应商') > -1) && App.FirstDptId === '49'}
                action={[
                    (popupDialog) => {
                        this.popupDialog = popupDialog;
                    },
                    (text) => {
                        this.setState({editContent: text})
                    },
                    () => {
                        this.setState({editContent: ''});
                        this.popupDialog.dismiss();
                    },
                    () => {
                        if ((this.props.title.indexOf('供应商') > -1) && App.FirstDptId === '49') {
                            if (this.state.editContent && this.state.editContentSub) {
                                this.setState({isLoading: true});
                                ApiService.addLocation(this.state.editContent, this.state.editContentSub)
                                    .then((responseJson) => {
                                        if (!responseJson.IsErr) {
                                            this._setSelect(this.state.editContent);
                                            this.popupDialog.dismiss();
                                        } else SnackBar.show(responseJson.ErrDesc)

                                    })
                                    .done(this.setState({isLoading: false}))
                            } else SnackBar.show('未填写完整内容')
                        } else {
                            if (this.state.editContent) {
                                if (this.state.isMulti) {
                                    this._addSelect(this.state.editContent);
                                    this.popupDialog.dismiss();
                                } else {
                                    this._setSelect(this.state.editContent);
                                    this.popupDialog.dismiss();
                                }
                            } else {
                                SnackBar.show('未填写内容')
                            }
                        }

                    },
                    (text) => {
                        this.setState({editContentSub: text})
                    },
                ]} str={[
                this.props.title.indexOf('供应商') > -1 ? '添加供应商' : '添加系列',
                this.props.title.indexOf('供应商') > -1 ? '供应商简称' : '系列名称',
                '供应商地址，必须详细准确！'
            ]}/>
        )
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <Toolbar
                    title={[this.props.title]}
                    color={'white'}
                    elevation={5}
                    isWhiteBar={true}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={[(this.props.title.indexOf('供应商') > -1) && App.FirstDptId === '49' ? '添加' : null, this.state.isMulti ? '完成' : null]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        (this.props.title.indexOf('供应商') > -1) && App.FirstDptId === '49' ? () => {
                            this.popupDialog.show();
                        } : null,
                        this.state.isMulti ? () => {
                            this._setSelect(this.state.selectItems.toString())
                        } : null
                    ]}/>
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
                        if (this.state.isMulti)
                            return (
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{flex: 1, margin: 16, color: Color.colorPrimary}}>全部</Text>
                                    <Text style={{flex: 1, padding: 16, color: Color.colorPrimary}}>选中</Text>
                                </View>
                            );
                        else return null;
                    })()
                }

                <View style={{flexDirection: 'row'}}>
                    <ListView
                        style={{marginBottom: 180, flex: 1}}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        enableEmptySections={true}
                        renderRow={ (rowData, sectionID, rowID) =>
                            <TouchableOpacity onPress={() => {
                                if (this.state.isMulti) {
                                    this._addSelect(rowData);
                                } else
                                    this._setSelect(rowData);
                            }}>
                                <Text style={{padding: 20}}>{rowData}</Text>
                            </TouchableOpacity>
                        }/>
                    {
                        (() => {
                            if (this.state.isMulti)
                                return (
                                    <ListView
                                        style={{marginBottom: 180, flex: 1}}
                                        dataSource={this.state.selectDataSource}
                                        removeClippedSubviews={false}
                                        enableEmptySections={true}
                                        renderRow={ (rowData, sectionID, rowID) =>
                                            <TouchableOpacity onPress={() => {
                                                console.log(sectionID + ',' + rowID);
                                                let temp = JSON.parse(JSON.stringify(this.state.selectItems));
                                                temp.splice(rowID, 1);
                                                console.log(JSON.stringify(this.state.selectItems));
                                                this.setState({
                                                    selectDataSource: this.state.selectDataSource.cloneWithRows(temp),
                                                    selectItems: temp
                                                });
                                            }}>
                                                <Text style={{padding: 20}}>{rowData}</Text>
                                            </TouchableOpacity>
                                        }/>
                                );
                            else return null;
                        })()
                    }

                </View>
                <Loading visible={this.state.isLoading}/>
                {this._editDialog()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    textInput: {
        width: width - 32,
        height: 45,
        margin: 16,
        textAlign: "center",
        borderColor: Color.line,
        borderWidth: 1,
        borderRadius: 20,
    },

});