/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    TouchableOpacity, Dimensions, FlatList, TextInput, Text
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/SwApiService';
import Color from '../../constant/Color';
import App from '../../constant/Application';
import SnackBar from 'react-native-snackbar-dialog'
import RefreshEmptyView from "../Component/RefreshEmptyView";
import WpMainItem from "../Component/WpMainItem";
import RadioForm from 'react-native-simple-radio-button';
import SwMainItem from "../Component/SwMainItem";
import * as ColorGroup from "../../constant/ColorGroup";

const {width, height} = Dimensions.get('window');
export default class SwParamPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            items: [],
            itemsBackup: [],
            selectItems: []
        }
    }

    componentDidMount() {
        this._onRefresh();
    }

    initItems(items) {
        let list = [];
        items.map((item, index) => {
            list.push({name: item, key: Math.random(), isSelect: false})
        });
        return list
    }

    _onRefresh() {
        this.setState({isRefreshing: true,});
        ApiService.getMembers()
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    this.setState({
                        items: this.initItems(responseJson.list),
                        itemsBackup: this.initItems(responseJson.list),
                        isRefreshing: false,
                    });
                } else {
                    this.setState({isRefreshing: false,});
                    SnackBar.show(responseJson.ErrDesc);
                }
            })
            .catch((error) => {
                this.setState({isRefreshing: false,});
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
            }).done();
    }

    _getView() {
        if (this.state.items && this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                this._onRefresh()
            } }/>)
        } else {
            return (
                <FlatList
                    data={this.state.items}
                    extraData={this.state}
                    ListFooterComponent={<View style={{height: 75}}/>}
                    renderItem={({item}) => <TouchableOpacity
                        disabled={App.account === item.name}
                        style={{
                            padding: 16,
                            backgroundColor: item.isSelect ? Color.line : 'white',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            console.log(item);
                            item.isSelect = !item.isSelect;
                            this.setState({items: this.state.items});
                        }}>
                        <View style={{
                            borderRadius: 50,
                            width: 45,
                            height: 45,
                            backgroundColor: ColorGroup.nameColor[item.name.charCodeAt() % 13],
                            margin: 10,
                            elevation: 2,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{color: 'white',}}>{item.name.substring(0, 1)}</Text>
                        </View>

                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                    }
                />
            )
        }
    }

    async  _search(text) {
        console.log(text)
        return this.state.itemsBackup.filter((item) => {
            console.log(item);
            return item ? (item.name.toLowerCase().indexOf(text.toLowerCase()) > -1) : ("无");
        });
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>

                <Toolbar
                    elevation={2}
                    title={["人员列表"]}
                    color={Color.colorGreen}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['完成']}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        () => {
                            let members = [];
                            this.state.items.map((data) => {
                                if (data.isSelect) {
                                    members.push(data)
                                    // console.log(data)
                                }
                            });
                            this.props.finishFunc(members);
                            this.props.nav.goBack(null);
                        }
                    ]}/>
                <TextInput style={{
                    width: width,
                    height: 55,
                    paddingLeft: 16,
                    paddingRight: 16,
                    // textAlign:'center',
                    borderColor: Color.line,
                    borderBottomWidth: 1,
                }}
                           placeholder="搜索"
                           returnKeyType={'done'}
                           blurOnSubmit={true}
                           underlineColorAndroid="transparent"
                           onChangeText={(text) => {
                               this._search(text).then((array) => {
                                   //       console.log(array);
                                   this.setState({items: array})
                               })
                           }}/>
                {this._getView()}


            </View>
        )
    }
}
