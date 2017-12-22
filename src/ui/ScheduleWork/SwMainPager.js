/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet, Dimensions, FlatList, RefreshControl, ListView, Text, TouchableOpacity,

} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/WpApiService';
import Color from '../../constant/Color';
import FloatButton from "../Component/FloatButton";
import SnackBar from 'react-native-snackbar-dialog'
import Utility from "../../utils/Utility";
import RefreshEmptyView from "../Component/RefreshEmptyView";
import WpMainItem from "../Component/WpMainItem";

const {width, height} = Dimensions.get('window');

export default class SwMainPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            items: [{key: "a"}, {key: "b"}],
        }
    }

    componentDidMount() {
        // this._onRefresh();
    }

    _onRefresh() {
        this.setState({isRefreshing: true,});
        /* ApiService.getList(0)
         .then((responseJson) => {
         if (!responseJson.IsErr) {
         this.setState({
         items: responseJson.list,
         dataSource: this.state.dataSource.cloneWithRows(responseJson.list),
         isRefreshing: false,
         });
         } else{
         this.setState({  isRefreshing: false,});
         SnackBar.show(responseJson.ErrDesc);
         }
         })
         .catch((error) => {
         this.setState({  isRefreshing: false,});
         console.log(error);
         SnackBar.show("出错了，请稍后再试");
         }).done();*/
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
                    renderItem={({item}) =>
                        <TouchableOpacity
                            style={styles.iconContainer}
                            onPress={() => {
                                this.props.nav.navigate("swDetail")
                            }}>
                            <Text style={{
                                color: 'white',
                                backgroundColor: Color.colorBlueGrey,
                                textAlign: 'center',
                                borderTopRightRadius: 10,
                                borderTopLeftRadius: 10,
                                padding: 5,
                            }}>审核中</Text>

                            <Text style={{margin:16,fontWeight :'bold'}}>{'我们协会是以存在主义为核心的协会，当你们慢慢扩宽你们的哲学视野之后，你会对所有事物都会有更深层次的理解'}</Text>
                            <View style={[styles.itemText,{borderTopWidth:1,borderColor:Color.line,paddingTop:10}]}>
                                <Text>{'工作日期'}</Text>
                                <Text
                                    style={{color: Color.black_semi_transparent}}>2017-1-1</Text>
                            </View>
                            <View style={styles.itemText}>
                                <Text>{'更新时间'}</Text>
                                <Text
                                    style={{color: Color.black_semi_transparent}}>2017-1-1</Text>
                            </View>
                            <View style={styles.itemText}>
                                <Text>{'创建人'}</Text>
                                <Text
                                    style={{color: Color.black_semi_transparent}}>孙仔</Text>
                            </View>
                            <View style={styles.itemText}>
                                <Text>{'协助人员'}</Text>
                                <Text
                                    style={{color: Color.black_semi_transparent}}>孙中山</Text>
                            </View>
                        </TouchableOpacity>}
                />
            )
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar
                    elevation={2}
                    title={["我的日程工作"]}
                    color={Color.colorGreen}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },

                    ]}/>
                {this._getView()}
                <FloatButton
                    color={Color.colorOrange}
                    drawable={require('../../drawable/add.png')}
                    action={() => {
                        this.props.nav.navigate('swAdd', {
                            refreshFunc: () => {
                                this._onRefresh()
                            }
                        });
                    }}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    iconContainer: {
        width: width - 32,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 16,
        elevation: 2,
    },
    itemText: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width - 32,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
});
