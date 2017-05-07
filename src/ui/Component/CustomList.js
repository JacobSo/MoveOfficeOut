/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    ListView,
    View,
    StyleSheet,
    Text,
    RefreshControl,
    InteractionManager,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Animated,
    Platform, Image, Alert,
} from 'react-native';
import Toast from 'react-native-root-toast';
import {MainItem} from '../Component/MainItem';
import ApiService from '../../network/ApiService';
import Color from '../../constant/Color';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {mainActions} from "../../actions/MainAction";
import Interactable from 'react-native-interactable';
import Loading from 'react-native-loading-spinner-overlay';

import AndroidModule from '../../module/AndoridCommontModule'
const PubSub = require('pubsub-js');
const {width, height} = Dimensions.get('window');
const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 150
};


class CustomList extends Component {

    constructor(props) {
        super(props);
        this._deltaY = new Animated.Value(Screen.height - 55);

        this.state = {
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            page: 1,
            isRefreshing: true,
            isEndUp: false,
            isTopTips: false,
            isLoading: false,

            initialPosition: 'unknown',
            lastPosition: 'unknown',


            isTodayTask: false,
            todayTask: [],
            todayTaskItem: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),

            address: "未有位置信息",
            lat: "0.0",
            lng: "0.0",
            editContent: "",
            selectGuid: "",
            selectType: "",

        };
        PubSub.subscribe( 'finish', (msg,data)=>{
            this.state.editContent = data;
            this._sign();
        } );
    }

    static propTypes = {
        type: PropTypes.string.isRequired,
        nav: PropTypes.any.isRequired
    };

    componentWillReceiveProps(newProps) {
        //    console.log(JSON.stringify(newProps) + '-------------------------')
        InteractionManager.runAfterInteractions(() => {
            if (newProps.refreshList)
                this._onRefresh()
        });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._onRefresh();
        });

        if (this.props.type === '5' || this.props.type === '0,1,2') {//page need location
            if (Platform.OS === 'ios') {
/*                navigator.geolocation.getCurrentPosition(
                    (position) => {
                      //  let longitude = JSON.stringify(position.coords.longitude);//精度
                       // let latitude = JSON.stringify(position.coords.latitude);//纬度
                       // console.log(longitude + latitude);

                      //  let initialPosition = JSON.stringify(position);
                      //  this.setState({initialPosition});
                     //   this._confirmDialog("title",initialPosition);
                    },
                    (error) => this.setState({address: "未有位置信息",}),
                    {enableHighAccuracy: false, timeout: 30000}
                );*/
                this.watchID = navigator.geolocation.watchPosition((position) => {
                    //let lastPosition = JSON.stringify(position);
                   // this.setState({lastPosition});
                    this.fetchData(position.coords.longitude,position.coords.latitude);
                   // Toast.show(lastPosition)
                });
            } else {
                AndroidModule.getLocation((address, lat, lng) => {
                    if (address)
                        this.setState({
                            address: address,
                            lat: lat,
                            lng: lng,
                        })
                });
            }
        }


    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }


    fetchData=(longitude,latitude)=>{
        fetch('http://restapi.amap.com/v3/geocode/regeo?output=json&location='+longitude+','+latitude+'&key=129f4ccb1a1709b2a4be5e3d0716b426',{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },

        })
            .then((response)=>response.json())
            .then((responseBody)=>{
                console.log(JSON.stringify(responseBody));
                this.setState({
                    address: responseBody.regeocode.formatted_address,
                    lat: latitude,
                    lng: longitude,
                });

            }).catch((error)=>{
            console.log(error);
        })
    };


    _onRefresh() {
        //  console.log('_refresh');
        this.setState({
            isRefreshing: !this.state.isTopTips,
            isTopTips: false,
        });
        this.state.page = 1;
        ApiService.getItems(this.state.page, this.props.type)
            .then((responseJson) => {
                console.log(responseJson);
                if (!responseJson.IsErr) {
                    this.setState({
                        items: responseJson.list,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.list),
                        isRefreshing: false,
                        isEndUp: responseJson.list.length === 0,
                        isTopTips: false,
                    });
                } else Toast.show(responseJson.ErrDesc);
                this.props.actions.refreshList(false);
            }).done();
        this._todayTask();

    }

    _todayTask() {
        if (this.props.type === '5' || this.props.type === '0,1,2') {
            ApiService.getToday()
                .then((responseJson) => {
                    console.log(responseJson);
                    if (!responseJson.IsErr) {
                        if(responseJson.list.length!==0){
                            this.setState({
                                isTodayTask: responseJson.list.length !== 0,
                                todayTask: responseJson.list,
                                todayTaskItem: this.state.todayTaskItem.cloneWithRows(responseJson.list[0].list),
                            })
                        }


                    } else Toast.show(responseJson.ErrDesc);
                    this.props.actions.refreshList(false);
                }).done();
        }
    }

    _onLoad() {
        //console.log('_load');
        if (this.state.items.length >= 10 && !this.state.isEndUp) {
            /*            this.setState({
             //  isRefreshing: true,
             page: this.state.page + 1
             });*/
            this.state.page = this.state.page + 1;
            ApiService.getItems(this.state.page, this.props.type).then((responseJson) => {
                // console.log(responseJson);
                if (!responseJson.IsErr) {
                    this.state.items = this.state.items.concat(responseJson.list);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                        isRefreshing: false,
                        isEndUp: responseJson.list.length === 0,
                        isTopTips: true,
                    });
                    if (this.state.isEndUp) {
                        Toast.show('已经没有了', {});
                    }

                } else Toast.show(responseJson.ErrDesc);
                this.props.actions.refreshList(false);
            }).done()
        }
    }

    _confirmDialog(title, content) {
        Alert.alert(
            title,
            content,
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this._sign();
                }
                },
            ]
        )
    }



    _sign() {
        this.setState({isLoading:true});
        ApiService.taskSign(this.state.selectGuid, this.state.lat, this.state.lng, this.state.address, this.state.selectType, this.state.editContent)
            .then((responseJson) => {
                console.log("--------" + responseJson);
                if (!responseJson.IsErr) {
                    this.setState({isLoading:false});
                    Toast.show("签到完成");
                    this._todayTask();
                } else Toast.show(responseJson.ErrDesc);
                this.props.actions.refreshList(false);
            }).done();
    }

    render() {
        if (this.state.items.length === 0) {
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this._onRefresh()}
                            tintColor={Color.colorBlueGrey}//ios
                            title="Loading..."//ios
                            titleColor='white'
                            colors={[Color.colorPrimary]}
                            progressBackgroundColor="white"
                        />
                    }
                >
                    <View
                        style={styles.card}>
                        <Text>没有数据</Text>
                    </View></ScrollView>
            );
        } else {
            return (
                <View style={{flex: 1, alignItems: 'center',}}>
                    <ListView
                        ref="scrollView"
                        style={styles.tabView}
                        dataSource={this.state.dataSource}
                        //  pageSize={2}
                        onChangeVisibleRows={(visibleRows, changedRows) => {
                            console.log('visibleRows:' + visibleRows + ',changedRows:' + changedRows)
                        }}
                        onEndReached={
                            () => {
                                this._onLoad()
                            }
                        }
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
                        enableEmptySections={true}
                        renderRow={ (rowData, rowID, sectionID) =>
                            <MainItem key={sectionID} task={rowData}
                                      func={() => {
                                          this.props.actions.refreshList(false);
                                          this.props.nav.navigate(
                                              'detail',
                                              {task: rowData,},
                                          );
                                      }}/>
                        }/>

                    {
                        (() => {
                            if (this.state.isTodayTask && this.state.todayTask[0].Signtype !== 3) {
                                return (
                                    <View style={styles.panelContainer}>


                                        <Animated.View style={[styles.panelContainer, {
                                            backgroundColor: 'black',
                                            opacity: this._deltaY.interpolate({
                                                inputRange: [0, Screen.height-100],
                                                outputRange: [0.5, 0],
                                                extrapolateRight: 'clamp'
                                            })
                                        }]} />
                                        <Interactable.View

                                            verticalOnly={true}
                                            snapPoints={[{y: 40}, {y: Screen.height - 45}, {y: Screen.height - 45}]}
                                            boundaries={{top: -300}}
                                            initialPosition={{y: Screen.height - 45}}
                                            animatedValueY={this._deltaY}>
                                            <View style={styles.panel}>

                                                <Text style={styles.panelTitle}>今日外出签到</Text>
                                                <Text style={styles.panelSubtitle}>{this.state.todayTask[0].list.length}个对接任务</Text>

                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-around',
                                                }}>
                                                    <TouchableOpacity
                                                        style={styles.panelButtonWhite}
                                                        onPress={() => {
                                                            this.props.nav.navigate(
                                                                'detail',
                                                                {task: this.state.todayTask[0]})
                                                        }}>
                                                        <Text>查看详情</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.panelButton}
                                                        onPress={() => {
                                                            this.state.selectGuid = this.state.todayTask[0].Guid;
                                                            if (this.state.todayTask[0].Signtype === -1) {
                                                                this._confirmDialog("出发签到", "是否开始外出工作,当前位置：" + this.state.address);
                                                                this.state.selectType = 0;
                                                            } else {
                                                                this.props.finishFunc();
                                                                this.state.selectType = 3;
                                                            }
                                                        }}>
                                                        <Text
                                                            style={styles.panelButtonTitle}>{this.state.todayTask[0].Signtype === -1 ? '出发' : '完成'}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    width: width - 64
                                                }}>
                                                    <Image style={{width: 25, height: 25, resizeMode: 'contain'}}
                                                           source={require('../../drawable/location_success.png')}/>
                                                    <Text>{this.state.address}</Text>
                                                </View>
                                                <ListView horizontal={true}
                                                          dataSource={this.state.todayTaskItem}
                                                          renderRow={(rowData, rowID, sectionID) =>
                                                              <View style={{
                                                                  margin: 16,
                                                                  padding: 16,
                                                                  backgroundColor: 'white',
                                                                  borderRadius: 10,
                                                                  elevation: 5,
                                                              }}>
                                                                  <Text>系列：{rowData.Series}</Text>
                                                                  <Text>供应商：{rowData.QSupplierName}</Text>
                                                                  <Text>对接内容：{rowData.WorkContent}</Text>
                                                                  {
                                                                      (() => {
                                                                          if (rowData.VisitingMode.indexOf('走访') > -1)
                                                                              if(rowData.Signtype===2){
                                                                              return (<Text               style={{
                                                                                  padding: 16,
                                                                                  backgroundColor: Color.line,
                                                                                  alignItems: 'center',
                                                                                  textAlign:'center',
                                                                                  marginVertical: 10,
                                                                                  color:'white'
                                                                              }}>已完成</Text>)
                                                                              }else{
                                                                                  return (
                                                                                      <TouchableOpacity
                                                                                          style={{
                                                                                              padding: 16,
                                                                                              backgroundColor: Color.colorPrimary,
                                                                                              alignItems: 'center',
                                                                                              marginVertical: 10
                                                                                          }}
                                                                                          onPress={() => {
                                                                                              if (this.state.todayTask[0].Signtype === 0) {
                                                                                                  this._confirmDialog(rowData.Signtype === -1 ? "到达供应商" : "离开供应商", "当前位置：" + this.state.address,);
                                                                                                  this.state.selectGuid = rowData.Guid;
                                                                                                  this.state.selectType = (rowData.Signtype === -1 ? 1 : 2);
                                                                                              } else {
                                                                                                  Toast.show("请先点击出发")
                                                                                              }

                                                                                          }}>
                                                                                          <Text
                                                                                              style={styles.panelButtonTitle}>{rowData.Signtype === -1 ? '到达' : '完成'}</Text>
                                                                                      </TouchableOpacity>
                                                                                  )
                                                                              }

                                                                      })()

                                                                  }

                                                              </View>}
                                                />

                                            </View>

                                        </Interactable.View>

                                    </View>)
                            }
                        })()
                    }

                    {
                        (() => {
                            if (this.state.isTopTips) {
                                return (
                                    <TouchableOpacity
                                        style={styles.topButton}
                                        onPress={
                                            () => {
                                                this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true});
                                                this._onRefresh()
                                            }
                                        }>
                                        <Text style={{color: 'white',}}>返回顶部</Text>
                                    </TouchableOpacity>
                                );
                            }
                        })()
                    }
                    <Loading visible={this.state.isLoading}/>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create(
    {
        tabView: {
            backgroundColor: Color.trans,
            width: width,
        },
        card: {
            borderWidth: 1,
            backgroundColor: 'white',
            borderColor: Color.trans,
            margin: 16,
            height: 55,
            padding: 15,
            shadowColor: Color.background,
            shadowOffset: {width: 2, height: 2,},
            shadowOpacity: 0.5,
            shadowRadius: 3,
            alignItems: 'center',
            elevation: 2
        },
        topButton: {
            flex: 1,
            width: 100,
            height: 35,
            left: width / 2 - 50,
            top: 0,
            position: 'absolute',
            elevation: 5,
            marginTop: 16,
            backgroundColor: Color.colorPrimary_semi_transparent,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
        },


        panelContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
           height:1
           // bottom:0,
           // top:0
        },
        panel: {
            height: Screen.height + 300,
            padding: 16,
            backgroundColor: '#f7f5eee8',
        },

        panelTitle: {
            fontSize: 18,
        },
        panelSubtitle: {
            fontSize: 15,
            color: 'gray',
        },
        panelButton: {
            flex: 1,
            padding: 16,
            backgroundColor: Color.colorPrimary,
            alignItems: 'center',
            marginVertical: 10
        },
        panelButtonWhite: {
            flex: 1,
            padding: 16,
            backgroundColor: 'white',
            alignItems: 'center',
            marginVertical: 10
        },
        panelButtonTitle: {
            fontWeight: 'bold',
            color: 'white'
        },

        /*        panelHandle: {
         width: 40,
         height: 8,
         borderRadius: 4,
         backgroundColor: '#00000040',
         marginBottom: 10
         },
         panelHeader: {
         alignItems: 'center'
         },*/
    });

const mapStateToProps = (state) => {
    return {
        refreshList: state.mainStore.refreshList
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomList);