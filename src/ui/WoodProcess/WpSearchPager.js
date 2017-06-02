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
    StyleSheet, Button,
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';
import {CachedImage, CustomCachedImage, ImageCache} from "react-native-img-cache";
import ApiService from '../../network/WpApiService';
import {WpProductItem} from "../Component/WpProductItem";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class PasswordPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            keyword: ""

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
        ApiService.getProduct(keyword,this.props.isWood?0:1)
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
                if (!responseJson.IsErr) {
                    this.setState({
                        items: responseJson.list,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.list)
                    })
                } else Toast.show(responseJson.ErrDesc)
            })
            .catch((error) => {
                console.log(error);
                Toast.show("出错了，请稍后再试");
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
                         actionArray={[]}
                         functionArray={[
                             () => {
                                 this.props.nav.goBack(null)
                             },
                         ]}/>
                <View style={{flexDirection: "row"}}>

                    <View style={styles.borderBottomLine}>
                        <TextInput style={styles.textInput}
                                   placeholder="输入产品关键字"
                                   returnKeyType={'done'}
                                   blurOnSubmit={true}
                                   underlineColorAndroid="transparent"
                                   onChangeText={(text) => {
                                       this.state.keyword = text
                                   }}/>
                    </View>
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
                        style={{marginBottom: 10, flex: 1}}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        enableEmptySections={true}
                        renderRow={ (rowData, sectionID, rowID) =>
                            <WpProductItem
                                product={rowData}
                                func={(data) => {
                                    this.props.selectFunc(data)
                                    this.props.nav.goBack(null)
                                }}/>
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
    borderBottomLine: {
        borderBottomWidth: 1,
        borderBottomColor: Color.line,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    }
});