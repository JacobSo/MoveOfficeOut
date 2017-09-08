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
            items: [],
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
            (this.props.mode === 0 ? ApiService.getSupplierList() : ApiService.getExceptionList(this.props.mode - 1))
                .then((responseJson) => {
                    if (responseJson.status === 0) {
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
            }).done(this.setState({isLoading: false}))
       });
    }

    getItemView(rowData) {
        if (this.props.mode === 0) {
            return <TouchableOpacity onPress={() => {
                this.props.actionFunc(rowData.supplier_name);
                this.props.nav.goBack(null);
            }}>
                <Text style={{padding: 20}}>{"供应商：" + rowData.supplier_name}</Text>
                <Text style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingBottom: 20,
                    borderColor: Color.line,
                    borderBottomWidth: 1
                }}>{"售后专员：" + (rowData.afterservice_salername ? rowData.afterservice_salername : "无")}</Text>
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
        return this.state.items.filter((item) => {
            //console.log(item);
            return item ? (JSON.stringify(item).toLowerCase().indexOf(text.toLowerCase()) > -1) : ("无");
        });
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.backgroundColor
            }}>
                <Toolbar title={[this.props.mode === 0 ? '供应商列表' : (this.props.mode === 1 ? '异常原因' :  (this.props.mode === 2?'异常类型':"处罚金额"))]}
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