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
import ApiService from '../network/ApiService';
import CheckBox from 'react-native-check-box';
import InputDialog from "./Component/InputDialog";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class PasswordPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            editContent: '',
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }

    componentDidMount() {
        this._getData();
    }

    _getData() {
        this.setState({isLoading: true});
        InteractionManager.runAfterInteractions(() => {
            if (this.props.type === 2) {
                ApiService.getCarList()
                    .then((responseJson) => {
                        console.log(responseJson);
                        this.state.items = responseJson.list;
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                        });
                    })
                    .done(this.setState({isLoading: false}))
            } else {
                ApiService.searchParam(this.props.type, this.props.type === 0 ? this.props.searchKey : '', this.props.type === 0 ? '' : this.props.searchKey)
                    .then((responseJson) => {
                        console.log(responseJson);
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
            this.setState({isLoading: true});
            ApiService.addCar(this.props.searchKey, rowData)
                .then((responseJson) => {
                    if (!responseJson.IsErr) {
                        Toast.show('操作成功');
                        this.props.setSelect(rowData);
                    } else Toast.show(responseJson.ErrDesc)
                })
                .done( this.props.nav.goBack(null))
        } else {
            this.props.setSelect(rowData);
            this.props.nav.goBack(null);
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
                            this._setSelect(this.state.editContent)
                            this.popupDialog.dismiss();

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
                         actionArray={['填写']}
                         functionArray={[
                             () => {
                                 this.props.nav.goBack(null)
                             },
                             () => {
                                 this.popupDialog.show();
                             }
                         ]}/>

                <TextInput style={{width: width - 32, height: 45, marginLeft: 10, marginRight: 10}}
                           placeholder="搜索"
                           onChangeText={(text) => {
                               this._search(text).then((array) => {
                                   console.log(array);
                                   this.setState({
                                       dataSource: this.state.dataSource.cloneWithRows(array),
                                   });
                               })
                           }}/>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={ (rowData) =>
                        <TouchableOpacity onPress={() => {
                            this._setSelect(rowData);
                        }}>
                            <Text style={{padding: 16}}>{rowData}</Text>
                        </TouchableOpacity>}/>


                <Loading visible={this.state.isLoading}/>
                {this._editDialog()}
            </View>
        )
    }
}
