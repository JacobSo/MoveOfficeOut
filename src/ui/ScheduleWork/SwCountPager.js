/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    TouchableOpacity, Dimensions, FlatList, StyleSheet, Text,RefreshControl
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

const {width, height} = Dimensions.get('window')
let myDate = new Date();
export default class SwCountPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            items: [],
            timeFilter: myDate.getFullYear() + "-" + (myDate.getMonth() + 1)
        }
    }

    componentDidMount() {
        this._onRefresh();
    }

    initItems(items) {

        return items
    }

    _onRefresh() {
        this.setState({isRefreshing: true,});
        ApiService.getCount(this.state.timeFilter)
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
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this._onRefresh()}
                            tintColor={Color.colorBlueGrey}//ios
                            title="刷新中..."//ios
                            titleColor='white'
                            colors={[Color.colorPrimary]}
                            progressBackgroundColor="white"
                        />}
                    renderItem={({item}) => <TouchableOpacity

                        onPress={() => {
                            this.props.nav.navigate('swMain',{
                                memberType:this.props.memberType,
                                account:item.UserName
                            });//0normal/1audit/2check
                        }}>
                        <View style={styles.viewContainer}>
                            <View style={{marginBottom: 16, flexDirection: 'row'}}>
                                <View style={[styles.headContainer,{ backgroundColor: ColorGroup.nameColor[item.UserName.charCodeAt()%13],}]}>
                                    <Text style={{color: 'white',}}>{item.UserName.substring(0, 1)}</Text>
                                </View>
                                <View >
                                    <Text style={{color: 'black', fontSize: 18, margin: 10}}>{item.UserName}</Text>
                                    <View style={styles.statusLineContainer}>
                                        <Text >待审核</Text>
                                        <Text style={styles.statusCountContainer}>{item.submited?item.submited:'0'}</Text>
                                    </View>
                                    <View style={styles.statusLineContainer}>
                                        <Text >处理中</Text>
                                        <Text style={styles.statusCountContainer}>{item.processing?item.processing:'0'}</Text>
                                    </View>
                                    <View style={styles.statusLineContainer}>
                                        <Text >待评分</Text>
                                        <Text style={[styles.statusCountContainer,{backgroundColor:item.waitscore?Color.colorAccent:Color.colorBlueGrey,}]}>{item.waitscore?item.waitscore:'0'}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{width: width - 32, height: 1, backgroundColor: Color.line}}/>

                            <View style={{flexDirection: 'row', justifyContent: 'center', margin: 10}}>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{width: 50, height: 3, backgroundColor: item.Scorelist[0]&&item.Scorelist[0].s1?Color.colorRed:Color.line,marginBottom:5}}/>
                                    <Text>不及格</Text>
                                    <Text>{item.Scorelist[0]&&item.Scorelist[0].s1?item.Scorelist[0].s1:"0"}</Text>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{width: 50, height: 3, backgroundColor: item.Scorelist[0]&&item.Scorelist[0].s2?Color.colorYellow:Color.line,marginBottom:5}}/>
                                    <Text>及格</Text>
                                    <Text>{item.Scorelist[0]&&item.Scorelist[0].s2?item.Scorelist[0].s2:"0"}</Text>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{width: 50, height: 3, backgroundColor: item.Scorelist[0]&&item.Scorelist[0].s3?Color.colorOrange:Color.line,marginBottom:5}}/>
                                    <Text>良好</Text>
                                    <Text>{item.Scorelist[0]&&item.Scorelist[0].s3?item.Scorelist[0].s3:"0"}</Text>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{width: 50, height: 3, backgroundColor: item.Scorelist[0]&&item.Scorelist[0].s4?Color.colorLightBlue:Color.line,marginBottom:5}}/>
                                    <Text>优秀</Text>
                                    <Text>{item.Scorelist[0]&&item.Scorelist[0].s4?item.Scorelist[0].s4:"0"}</Text>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{width: 50, height: 3, backgroundColor: item.Scorelist[0]&&item.Scorelist[0].s5?Color.colorGreen:Color.line,marginBottom:5}}/>
                                    <Text>卓越</Text>
                                    <Text>{item.Scorelist[0]&&item.Scorelist[0].s5?item.Scorelist[0].s5:"0"}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    }
                />
            )
        }
    }

    render() {
        return (
            <View style={{
                backgroundColor: Color.background,
            }}>

                <Toolbar
                    elevation={2}
                    title={["监督工作统计"]}
                    color={Color.colorGreen}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                    ]}/>
                {this._getView()}


            </View>
        )
    }
}
const styles = StyleSheet.create({
    viewContainer: {
        margin: 16,
        elevation: 2,
        backgroundColor: 'white',
        borderRadius: 10
    },
    headContainer: {
        borderRadius: 50,
        width: 55,
        height: 55,

        margin: 10,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusLineContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: 250 - 16,
        paddingLeft: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
    statusCountContainer: {
        padding: 3,
        borderRadius: 10,
        width: 45,
        textAlign: 'center',
        backgroundColor: Color.colorBlueGrey,
        color: 'white'
    }


});