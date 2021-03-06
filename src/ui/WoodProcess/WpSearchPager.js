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
import {CachedImage, CustomCachedImage, ImageCache} from "react-native-img-cache";
import ApiService from '../../network/WpApiService';
import {WpProductItem} from "../Component/WpProductItem";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class PasswordPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            select: [false, false, false],
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
        // InteractionManager.runAfterInteractions(() => {
        //     });
    }


    _getData(keyword) {
        this.setState({
            isLoading: true
        });
        ApiService.getProduct(keyword, this.props.isWood ? 0 : 1, this.props.series)
            .then((responseJson) => {
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
                if (!responseJson.IsErr) {
                    responseJson.list.map((data) => {
                        data.check = false
                    });
                    this.setState({
                        items: responseJson.list,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.list)
                    })
                } else SnackBar.show(responseJson.ErrDesc)
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
                         color={Color.colorPurple}
                         elevation={2}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={[this.props.isWood?"全选":null,"完成(" + this.state.selectItems + ")"]}
                         functionArray={[
                             () => {
                                 this.props.nav.goBack(null)
                             },
                             this.props.isWood?()=>{
                                 let flag = this.state.items[0].check;

                                 this.state.items.map((data)=>{
                                    data.check = !flag ;
                                 });

                                 this.setState({
                                     selectItems: flag?0: this.state.items.length,
                                     dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),
                                 });
                             }:null,
                             () => {
                                 let temp = [];
                                 this.state.items.map((data) => {
                                     if (data.check) {
                                         data.selectStep = this.state.select;
                                         data.poldid =data.Id;
                                         temp.push(data);
                                     }
                                     data.check = false;
                                 });
                                 if (temp.length!==0) {
                                     this.props.selectFunc(temp);

                                     this.setState({//set default
                                         select: [false, false, false],
                                         dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),
                                         selectItems: 0
                                     })
                                 } else
                                     this.props.nav.goBack(null)


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
                        style={{
                            backgroundColor: Color.colorPurple,
                            margin: 8,
                            justifyContent: "center",
                            padding: 10,
                            borderRadius: 10
                        }}
                        onPress={() => {
                            this._getData(this.state.keyword);
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
                                <WpProductItem
                                    isWood={this.props.isWood}
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
                {
                    (() => {
                        if (this.state.selectItems > 0) {
                            return (
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    position: 'absolute',
                                    bottom: Platform.OS === 'android' ? 25 : 0,
                                    backgroundColor: 'white',
                                    elevation: 2
                                }}>
                                    <TouchableOpacity
                                        style={[styles.stepButton, {backgroundColor: (this.state.select[0] ? Color.colorPurple : Color.line)},]}
                                        onPress={() => {
                                            this.state.select[0] = !this.state.select[0];
                                            this.setState({select: this.state.select})
                                        }}>
                                        <Text style={{
                                            color: "white",
                                            textAlign: "center"
                                        }}>{this.props.isWood ? '白胚' : '木架'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.stepButton, {backgroundColor: (this.state.select[1] ? Color.colorPurple : Color.line)},]}
                                        onPress={() => {
                                            this.state.select[1] = !this.state.select[1];
                                            this.setState({select: this.state.select})
                                        } }>
                                        <Text style={{color: "white", textAlign: "center"}}>成品</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.stepButton, {backgroundColor: (this.state.select[2] ? Color.colorPurple : Color.line)},]}
                                        onPress={() => {
                                            this.state.select[2] = !this.state.select[2];
                                            this.setState({select: this.state.select})
                                        }}>
                                        <Text style={{color: "white", textAlign: "center"}}>包装</Text>
                                    </TouchableOpacity>
                                </View>)
                        }
                    })()
                }

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
    }
});