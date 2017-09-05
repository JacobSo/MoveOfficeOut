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
    Platform,
    TextInput,
    StyleSheet, Button,
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import SnackBar from 'react-native-snackbar-dialog'
import ApiService from '../../network/AsApiService';
import {WpProductItem} from "../Component/WpProductItem";
import {AsProductItem} from "../Component/AsProductItem";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class AsProductSearchPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectItems: 0,
            selectItemsId: [],
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            keyword: "",
        }
    }

    componentDidMount() {

    }

    getData(keyword) {
        this.setState({isLoading: true});
        ApiService.getProductList(keyword)
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
                if (responseJson.status===0) {
                    responseJson.data.map((data) => {
                        data.check = false
                    });
                    this.setState({
                        items: responseJson.data,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.data)
                    })
                } else SnackBar.show(responseJson.message)
            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            })
            .done()
    }


    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar title={["搜索产品"]}
                         color={Color.colorAmber}
                         elevation={2}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={["全选", "完成(" + this.state.selectItems + ")"]}
                         functionArray={[
                             () => {
                                 this.props.nav.goBack(null)
                             },
                             () => {
                             if(this.state.items){
                                 let flag = this.state.items[0].check;
                                 this.state.items.map((data) => {
                                     data.check = !flag;
                                 });
                                 this.setState({
                                     selectItems: flag ? 0 : this.state.items.length,
                                     dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),
                                 });
                             }
                             },
                             () => {
                                 let temp = [];
                                 this.state.items.map((data) => {
                                     if (data.check) {
                                         //data.selectStep = this.state.select;
                                         temp.push(data);
                                     }
                                     data.check = false;
                                 });
                                 if (temp.length !== 0) {
                                     this.props.selectFunc(temp);

                                     this.setState({//set default
                                        // select: [false, false, false],
                                         dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),
                                         selectItems: 0
                                     })
                                 } else  this.props.nav.goBack(null)


                             }
                         ]}/>
                <View style={{flexDirection: "row"}}>
                    <TextInput style={styles.textInput}
                               placeholder="输入产品关键字"
                               returnKeyType={'done'}
                               blurOnSubmit={true}
                               underlineColorAndroid="transparent"
                               onChangeText={(text) => {
                                   this.state.keyword = text
                               }}/>
                    <TouchableOpacity
                        style={styles.searchStyle}
                        onPress={() => {
                            this.getData(this.state.keyword);
                        }}>
                        <Text style={{color: "white"}}>搜索</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <ListView
                        style={{marginBottom: 10, flex: 1, height: height - 25 - 55 * 2}}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        enableEmptySections={true}
                        renderRow={ (rowData, sectionID, rowID) =>
                            <View
                                style={{backgroundColor: rowData.check ? Color.colorPrimary : Color.trans,}}>
                                <AsProductItem
                                    product={rowData}
                                    func={() => {
                                        let temp = this.state.selectItems;
                                        this.state.items[rowID].check = !this.state.items[rowID].check;
                                        if (this.state.items[rowID].check)
                                            ++temp;
                                        else --temp;
                                        this.setState({
                                            selectItems: temp,
                                            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),
                                        });
                                    }}/></View>
                        }/>
                </View>
                <Loading visible={this.state.isLoading}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        width: width - 100,
        height: 45,
        marginLeft: 16,
        marginRight: 16,
        borderColor: Color.line,
        borderBottomWidth: 1,
    },

    stepButton: {
        flex: 1,
        margin: 8,
        justifyContent: "center",
        padding: 10,
        borderRadius: 10
    },
    searchStyle:{
        backgroundColor: Color.colorAmber,
        margin: 8,
        justifyContent: "center",
        padding: 10,
        borderRadius: 10
    }
});