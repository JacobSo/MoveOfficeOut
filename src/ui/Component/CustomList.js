/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    ListView,
    View,
    StyleSheet,
    Text,
    RefreshControl,
    InteractionManager,
    Dimensions,
    TouchableOpacity,
    Animated,
    Platform,
    Image,
    Alert,
    DeviceEventEmitter,
} from 'react-native';
import SnackBar from 'react-native-snackbar-dialog'
import {MainItem} from '../Component/MainItem';
import ApiService from '../../network/ApiService';
import Color from '../../constant/Color';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {mainActions} from "../../actions/MainAction";
import Interactable from 'react-native-interactable';
import Loading from 'react-native-loading-spinner-overlay';

import RefreshEmptyView from "./RefreshEmptyView";
import LocationView from "./LocationView";
import Utility from "../../utils/Utility";
const PubSub = require('pubsub-js');
const {width, height} = Dimensions.get('window');
const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 150
};
class CustomList extends Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        nav: PropTypes.any.isRequired
    };

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

            isTodayTask: false,
            todayTask: [],
            todayTaskItem: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),

            address: "未有位置信息",
            lng: "0.0",
            lat: "0.0",
            editContent: "",
            selectGuid: "",
            selectType: "",
            tripType: "",
            endTime: "",
        };

        PubSub.subscribe('finish', (msg, data) => {
            console.log("PubSub:start");
            let isAllFinish = true;
            this.state.editContent = data;
          //  console.log("PubSub:" + JSON.stringify(this.state));
            if (!this.state.editContent && this.state.todayTask[0] && this.state.todayTask[0].list) {
               // console.log("PubSub:if");
                this.state.todayTask[0].list.map((data) => {
                  //  console.log("PubSub:loop");
                    if (data.Signtype !== 2 && data.VisitingMode.indexOf('走访') > -1) {
                        isAllFinish = false;
                        SnackBar.show('没有完成全部签到，必须填写备注说明');
                        return
                    }
                });
            }

            if (isAllFinish)
                this._sign();
        });
    }


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
                this.watchID = navigator.geolocation.watchPosition((position) => {
                    this.fetchData(position.coords.longitude, position.coords.latitude);
                });
            } else {
                DeviceEventEmitter.addListener('callLocationChange', this.onAndroidLocationChange)
            }
        }
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
        DeviceEventEmitter.removeListener('onRefreshMessage', this.onAndroidLocationChange);
        PubSub.clearAllSubscriptions();
    }

    onAndroidLocationChange = (e) => {
      //  console.log((e.address + ":" + e.lat + ":" + e.lng));
        if (this.state.address !== e.address) {
            this.setState({
                address: e.address,
                lat: e.lat,
                lng: e.lng,
            })
        }
    };

    fetchData = (longitude, latitude) => {
        fetch('http://restapi.amap.com/v3/geocode/regeo?output=json&location=' + longitude + ',' + latitude + '&key=129f4ccb1a1709b2a4be5e3d0716b426', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseBody) => {
                console.log(JSON.stringify(responseBody));
                this.setState({
                    address: responseBody.regeocode.formatted_address,
                    lat: latitude,
                    lng: longitude,
                });

            }).catch((error) => {
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
                if (!responseJson.IsErr) {
                    this.setState({
                        items: responseJson.list,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.list),
                        isRefreshing: false,
                        isEndUp: responseJson.list.length === 0,
                        isTopTips: false,
                    });
                } else {
                    this.setState({isRefreshing: false,});
                    SnackBar.show(responseJson.ErrDesc);
                }
                this.props.actions.refreshList(false);
            })
            .catch((error) => {
                console.log(error);
                this.setState({isRefreshing: false,});
                SnackBar.show("出错了，请稍后再试");
            }).done();
        this._todayTask();

    }

    _todayTask() {
        if (this.props.type === '5' || this.props.type === '0,1,2') {
            ApiService.getToday()
                .then((responseJson) => {
                    if (!responseJson.IsErr) {
                        this.setState({
                            isTodayTask: responseJson.list.length !== 0,
                            todayTask: responseJson.list.length !== 0 ? responseJson.list : [],
                            todayTaskItem: this.state.todayTaskItem.cloneWithRows(responseJson.list.length !== 0 ? responseJson.list[0].list : []),
                            isLoading: false
                        })
                    } else SnackBar.show(responseJson.ErrDesc);
                    this.props.actions.refreshList(false);
                })
                .catch((error) => {
                    console.log(error);
                    SnackBar.show("出错了，请稍后再试");
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                })
                .done();
        }
    }

    _onLoad() {
        //console.log('_load');
        if (this.state.items.length >= 10 && !this.state.isEndUp) {
            this.state.page = this.state.page + 1;
            ApiService.getItems(this.state.page, this.props.type).then((responseJson) => {
                if (!responseJson.IsErr) {
                    this.state.items = this.state.items.concat(responseJson.list);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                        isRefreshing: false,
                        isEndUp: responseJson.list.length === 0,
                        isTopTips: true,
                    });
                    if (this.state.isEndUp) {
                        SnackBar.show('已经没有了', {});
                    }

                } else SnackBar.show(responseJson.ErrDesc);
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
        if(this.state.address==="未有位置信息"||!this.state.address||this.state.lat==="0.0"||this.state.lng==="0.0"){
            SnackBar.show("没有位置信息不能签到，请确认开启定位，或尝试后台关闭app重新获取");
            return
        }
        this.setState({isLoading: true});
        ApiService.taskSignNew(
            this.state.selectGuid,
            this.state.lat,
            this.state.lng,
            this.state.address,
            this.state.selectType,
            this.state.editContent,
            this.state.todayTask[0].DailyType,
            this.state.todayTask[0].DailyEndDate ? Utility.getTime(this.state.todayTask[0].DailyEndDate) : '',
            this.state.todayTask[0].Dptid)
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    SnackBar.show("签到完成");
                    this._todayTask();
                    if (this.state.selectType === 3) {
                        this._onRefresh()
                    }
                } else {
                    SnackBar.show(responseJson.ErrDesc);
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
                this.props.actions.refreshList(false);
            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            })
            .done();
    }


    sighLocation(rowData) {
        let isFinish = true;
        this.state.todayTask[0].list.map((data) => {
            if (data.Signtype === 1 && data !== rowData) {
                isFinish = false;
                SnackBar.show('没有完成上一个签到，不可操作')
            }
        });
        if ((this.state.todayTask[0].Signtype === 0 && isFinish)) {
            let plist=[];
            if (rowData.LatitudeLongitudes) {
                let temp = rowData.LatitudeLongitudes.split("|");
              //  let temp = "112.946405,22.864130|113.035598,22.902548".split("|");
                //112.817938660295	22.9814394151572
                //
                temp.map((data) => {
                    console.log(data);
                    SnackBar.show(data);
                    let latlng = data.split(",");
                    let process = Utility.distance(latlng[0], latlng[1], this.state.lat, this.state.lng);
                    plist.push(process);
                });
            }
            this._confirmDialog(rowData.Signtype === -1 ?
                    "到达供应商" : "离开供应商",
                "当前位置：" + this.state.address + "\n" +
                "目标距离：" + Math.min(...plist) + "米");
            this.state.selectGuid = rowData.Guid;
            this.state.selectType = (rowData.Signtype === -1 ? 1 : 2);
        } else SnackBar.show("没完成出发签到")
    }

    render() {
        //  console.log('render');
        if (this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                console.log('刷新');
                this._onRefresh()
            } }/>)
        } else {
            return (
                <View style={{flex: 1, alignItems: 'center',}}>
                    <ListView
                        ref="scrollView"
                        style={styles.tabView}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        onEndReached={() => this._onLoad()}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={() => this._onRefresh()}
                                tintColor={Color.colorBlueGrey}//ios
                                title="刷新中..."//ios
                                titleColor='white'
                                colors={[Color.colorCyan]}
                                progressBackgroundColor="white"
                            />}
                        enableEmptySections={true}
                        renderRow={(rowData, rowID, sectionID) =>
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
                                                inputRange: [0, Screen.height - 100],
                                                outputRange: [0.5, 0],
                                                extrapolateRight: 'clamp'
                                            })
                                        }]}/>
                                        <Interactable.View
                                            verticalOnly={true}
                                            snapPoints={[{y: 40}, {y: Screen.height - 45}, {y: Screen.height - 45}]}
                                            boundaries={{top: 0}}
                                            initialPosition={{y: Screen.height - 45}}
                                            animatedValueY={this._deltaY}>
                                            <View style={styles.panel}>
                                                <Text style={styles.panelTitle}>今日外出签到</Text>
                                                <Text style={styles.panelSubtitle}>{this.state.todayTask[0].list.length}个对接任务</Text>
                                                <View style={styles.panelButtonContainer}>
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
                                                        style={this.state.todayTask[0].Signtype === -1 ? styles.panelButton : styles.panelButtonEnd}
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
                                                            style={{color: 'white'}}>{this.state.todayTask[0].Signtype === -1 ? '出发' : '完成'}
                                                        </Text>
                                                    </TouchableOpacity>

                                                </View>

                                                <View style={styles.locationContainer}>
                                                    <Image style={{width: 25, height: 25, resizeMode: 'contain'}}
                                                           source={require('../../drawable/location_success.png')}/>
                                                    <Text>{this.state.address}</Text>
                                                </View>

                                                <ListView
                                                    horizontal={true}
                                                    dataSource={this.state.todayTaskItem}
                                                    enableEmptySections={true}
                                                    removeClippedSubviews={false}
                                                    renderRow={(rowData, rowID, sectionID) =>
                                                        <LocationView task={rowData}
                                                                      action={() => this.sighLocation(rowData)}/>
                                                    }/>
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
                                        onPress={() => {
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
            height: 1
        },
        panel: {
            height: Screen.height,
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
            backgroundColor: Color.colorCyan,
            alignItems: 'center',
            marginVertical: 10
        },
        panelButtonEnd: {
            flex: 1,
            padding: 16,
            backgroundColor: Color.colorAccent,
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


        panelButtonContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
        locationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            width: width - 64
        }
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