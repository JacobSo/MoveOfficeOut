/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    TouchableOpacity, Dimensions, FlatList, RefreshControl, Text
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

const {width, height} = Dimensions.get('window');
export default class SwParamPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            items: [],
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
                        disabled={App.account===item.name}
                        style={{padding: 16, backgroundColor: item.isSelect ? Color.line : 'white'}}
                        onPress={() => {
                            console.log(item);
                            item.isSelect = !item.isSelect;
                            this.setState({items: this.state.items})
                        }}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                    }
                />
            )
        }
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
                                if (data.isSelect)
                                    members.push(data)
                            });
                            this.props.finishFunc(members);
                            this.props.nav.goBack(null);
                        }

                    ]}/>

                {this._getView()}


            </View>
        )
    }
}
