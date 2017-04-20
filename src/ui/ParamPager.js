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
    StyleSheet,
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';
import ApiService from '../network/ApiService';
import InputDialog from "./Component/InputDialog";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class PasswordPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMulti: this.props.isMulti,
            isLoading: false,
            editContent: '',
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),

            selectItems: [],
            selectDataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }

    componentDidMount() {
        // InteractionManager.runAfterInteractions(() => {
        this._getData();
        //     });
    }


    _getData() {
        this.setState({isLoading: true});
        InteractionManager.runAfterInteractions(() => {
            if (this.props.type === 2) {
                ApiService.getCarList()
                    .then((responseJson) => {
                        // console.log(responseJson);
                        this.state.items = responseJson.list;
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                        });
                    })
                    .done(this.setState({isLoading: false}))
            } else {
                ApiService.searchParam(this.props.type, this.props.type === 0 ? this.props.searchKey : '', this.props.type === 0 ? '' : this.props.searchKey)
                    .then((responseJson) => {
                        //   console.log(responseJson);
                        this.state.items = responseJson.list;
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                        });
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
                        Toast.show('操作成功');
                        this.props.setSelect(rowData);
                    } else Toast.show(responseJson.ErrDesc)
                })
                .done(this.props.nav.goBack(null))
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
        return this.state.items.filter((item) => item.toLowerCase().indexOf(text.toLowerCase()) > -1);
    }

    _editDialog() {
        return (
            <InputDialog
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
                        if (this.state.editContent) {
                            if (this.state.isMulti) {
                                this._addSelect(this.state.editContent);
                                this.popupDialog.dismiss();
                            } else {
                                this._setSelect(this.state.editContent);
                                this.popupDialog.dismiss();
                            }

                        } else {
                            Toast.show('未填写内容')
                        }
                    }
                ]} str={['自行填写', '在此填写内容']}/>
        )
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>

                <Toolbar title={[this.props.title]}
                         color={Color.colorPrimary}
                         elevation={2}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={['填写',this.state.isMulti?'完成':null]}
                         functionArray={[
                             () => {
                                 this.props.nav.goBack(null)
                             },
                             () => {
                                 this.popupDialog.show();
                             },
                             this.state.isMulti?()=>{
                             this._setSelect(this.state.selectItems.toString())
                             }:null
                         ]}/>
                <View style={styles.borderBottomLine}>
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
                               }}/></View>
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
                        style={{marginBottom: 25, flex: 1}}
                        dataSource={this.state.dataSource}
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
                                        style={{marginBottom: 25, flex: 1}}
                                        dataSource={this.state.selectDataSource}
                                        enableEmptySections={true}
                                        renderRow={ (rowData, sectionID, rowID) =>
                                            <TouchableOpacity onPress={() => {
                                                this.state.selectItems.splice(rowID, 1);
                                                this.setState({
                                                    selectDataSource: this.state.selectDataSource.cloneWithRows(this.state.selectItems),
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
        marginLeft: 16,
        marginRight: 16,
        borderColor: Color.line,
        borderBottomWidth: 1,
    },
    borderBottomLine: {
        borderBottomWidth: 1,
        borderBottomColor: Color.line,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    }
});