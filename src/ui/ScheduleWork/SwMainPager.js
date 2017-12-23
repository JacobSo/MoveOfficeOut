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
import RadioForm from 'react-native-simple-radio-button';

const {width, height} = Dimensions.get('window');
const exList = ["全部", "待审核","处理中", "", "已审核"];
export default class SwMainPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isFilter:false,
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
                    actionArray={[require("../../drawable/filter.png")]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        ()=>{
                            this.setState({isFilter:!this.state.isFilter})
                        }

                    ]}/>
                {
                    (()=>{
                        if(this.state.isFilter){
                            return         <RadioForm
                                buttonColor={Color.colorGreen}
                                labelStyle={{color: Color.content, margin: 16}}
                                radio_props={ [
                                    {label: exList[0], value: 0},
                                    {label: exList[1], value: 1},
                                    {label: exList[2], value: 2},
                                    {label: exList[3], value: 3},
                                    {label: exList[4], value: 4},
                                    {label: exList[5], value: 5},
                                ]}
                                initial={this.state.radioValue}
                                formHorizontal={false}
                                style={styles.radioContainer}
                                onPress={(value) => {

                                }}
                            />
                        }else{
                            return null
                        }

                    })()
                }

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
        overflow:'hidden',

    },
    itemText: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width - 32,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,

    },
    radioContainer:{
        marginLeft: 16,
        marginBottom: 16,
        width: width - 32,
        backgroundColor: 'white',
        paddingTop: 16,
        paddingLeft: 16,
        elevation: 2,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10
    }

});
