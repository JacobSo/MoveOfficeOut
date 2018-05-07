/**
 * Created by Administrator on 2017/3/13.
 *
 */
'use strict';
import React, {Component} from 'react';
import {
    Image,
    Text, TouchableOpacity,
    Alert,
    View,
    WebView,
} from 'react-native';
import Loading from 'react-native-loading-spinner-overlay';
import {MapView, MapTypes, MapModule, Geolocation} from 'react-native-baidu-map';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar';
import ApiService from '../../network/CfApiService';
import SnackBar from 'react-native-snackbar-dialog'
import Utility from "../../utils/Utility";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const statusText = ['待审核', '待分配', '未出车', '已出车', '已结束', '审核失败', '分配失败', '放弃用车'];
//SQVgE6NAxt5sfvPZkCWVAceRC5GVcEyS
let jsCode = `
        var formatData = JSON.parse(data);

        var map = new BMap.Map("allmap");
        var point = new BMap.Point(formatData[0].lng, formatData[0].lat);
        map.centerAndZoom(point, 10);
        var pois = [];
        formatData.map(function (temp) {
            pois.push(new BMap.Point(temp.lng, temp.lat))
        });

        var polyline = new BMap.Polyline(pois, {
            enableEditing: false,//是否启用线编辑，默认为false
            enableClicking: true,//是否响应点击事件，默认为true
            //  icons: [icons],
            strokeWeight: '8',//折线的宽度，以像素为单位
            strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
            strokeColor: "#18a45b" //折线颜色
        });
        map.addOverlay(polyline);          //增加折线

        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中
        map.centerAndZoom(point, 15);


    `;
export default class CfTrackPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isData: false,
            isLoading: true,
            token: '',
            carInfo: {},
            beginPoint: null,
            beginAddress: '',
            nowPoint: null,
            endAddress: '',
            nowTime:'',



            locationEnable: false,
            mayType: MapTypes.NONE,
            zoom: 15,
            center: {
                longitude: 113.981718,
                latitude: 22.542449
            },
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            mLocation: {
                longitude: 0.0,
                latitude: 0.0
            }

        }
    }

    componentDidMount() {
        // this.getToken()
        this.getCar();
        //   this.getNow();
        //  this.getDeviceAddress();
    }

    getCar() {
        console.log(this.props.carOrder);
        this.setState({isLoading: true});
        ApiService.getDetail(this.props.carOrder).then((responseJson) => {
            this.setState({isLoading: false});
            if (!responseJson.isErr) {
                this.setState({
                    carInfo: responseJson.data[0],
                });
                //  if (responseJson.data[0] && responseJson.data[0].iemiCode) {
                this.getToken()
                //   }

            } else {
                SnackBar.show(responseJson.errDesc);
            }
        })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
                this.setState({isLoading: false});
            }).done();
    }

    getToken() {
        ApiService.getGpsToken().then((responseJson) => {
            if (responseJson.ret === 0) {
                this.state.token = responseJson.access_token;
                this.getTrack(responseJson.access_token,)
            } else {
                SnackBar.show('获取轨迹失败')
            }
        })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
            }).done();
    }


    //868120184180922

    getTrack() {
        ApiService.getGpsHistory(this.state.token, "868120184180922")//this.state.carInfo.imeiCode
            .then((responseJson) => {
                //this.refs.webView.postMessage(JSON.stringify(responseJson.data));
                if (responseJson.ret === 0) {
                    let temp = 'var data =\'' + JSON.stringify(responseJson.data) + '\';'
                    jsCode = temp + jsCode;
                    //  console.log(jsCode);
                    this.setState({
                        beginPoint: responseJson.data[0],
                        isData: true,
                    });
                    this.getDeviceAddress(this.state.beginPoint);
                }

            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
            }).done();
    }

    getDeviceAddress(point) {
        ApiService.getAddress(this.state.token, point.lng, point.lat).then((responseJson) => {
            if (responseJson.ret === 0) {
                if (point === this.state.beginPoint){
                    this.getNow();
                    this.setState({beginAddress: responseJson.address})
                } else
                    this.setState({endAddress: responseJson.address});
            }
        }).catch((error) => {
            console.log(error);
            SnackBar.show("出错了，请稍后再试", {duration: 1500});
        }).done();
    }

    getNow() {
        ApiService.getDevicesNow(this.state.token, "868120184180922").then((responseJson) => {
            if (responseJson.ret===0) {
                this.setState({nowPoint: responseJson.data[0],
                    nowTime:Utility.getFullTime(responseJson.data[0].gps_time,true)})
                this.getDeviceAddress(this.state.nowPoint)
            }
        }).catch((error) => {
            console.log(error);
            SnackBar.show("出错了，请稍后再试", {duration: 1500});
        }).done();
    }


    detailView() {
        Alert.alert(
            '用车详细',

            '用车单号：' + this.state.carInfo.billNo + '\n' +
            '状态：' + statusText[this.state.carInfo.status] + '\n' +
            '车辆类型：' + (this.state.carInfo.carType === 0 ? "公司车辆" : "私人车辆") + '\n\n' +

            '申请时间：' + Utility.replaceT(this.state.carInfo.createTime) + '\n' +
            '用车日期：' + Utility.replaceT(this.state.carInfo.tripTime) + '\n' +
            '申请人：' + this.state.carInfo.account + '\n\n' +

            '目的地：' + this.state.carInfo.tripTarget + '\n' +
            '外出范围：' + (this.state.carInfo.tripArea ? "佛山外" : "佛山内") + '\n' +
            '预计里程：' + this.state.carInfo.tripDistance + '\n' +

            (this.state.carInfo.carPower ? ('排量：' + this.state.carInfo.carPower) : '') + '\n' +
            '随行人员：' + (this.state.carInfo.tripMember ? this.state.carInfo.tripMember : '') + '\n' +
            '加油卡：' + (this.state.carInfo.needCard ? "需要" : "不需要") + '\n' +
            '备注：' + (this.state.carInfo.remark ? this.state.carInfo.remark : '') + '\n\n' +

            '起始里程：' + (this.state.carInfo.beginPoint ? this.state.carInfo.beginPoint : '') + '\n' +
            '结束里程：' + (this.state.carInfo.endPoint ? this.state.carInfo.endPoint : '') + '\n',

            //  '工号：'+this.state.carInfo.workNum+'\n',
            [
                {
                    text: '确认', onPress: () => {
                }
                },
            ]
        )
    }

    render() {
        return <View style={{
            flex: 1,
            backgroundColor: Color.background
        }}>
            <Toolbar
                isWhiteBar={true}
                elevation={2}
                title={['用车详细']}
                color={'white'}
                isHomeUp={true}
                isAction={false}
                isActionByText={true}
                actionArray={[]}
                functionArray={[
                    () => {
                        this.props.nav.goBack(null)
                    },
                ]}
            />

{/*            {
                (() => {
                    if (this.state.isData) {
                        return <WebView
                            style={{backgroundColor: Color.background}}
                            ref='webView'
                            source={require('../../assets/index.html')}
                            injectedJavaScript={jsCode}
                            javaScriptEnabledAndroid={true}
                        />
                    }
                })()
            }*/}
            <MapView
                trafficEnabled={this.state.trafficEnabled}
                baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                zoom={this.state.zoom}
                mapType={this.state.mapType}
                center={this.state.center}
                style={{height: height, width: width, backgroundColor: Color.colorBlue, elevation: 5}}
            />
            <View style={{
                backgroundColor: 'white',
                margin: 16,
                borderRadius: 10,
                position: 'absolute',
                bottom: 25 + 16,
                width: width - 32,
                elevation: 5,
            }}>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 16}}>
                    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                        <Text style={{
                            color: Color.colorBlue,
                            fontSize: 18,
                        }}>{this.state.carInfo ? this.state.carInfo.carNum : '未分配车辆'}</Text>
                        <Text style={{
                            marginLeft: 10,
                            marginBottom: 2
                        }}>{  this.state.carInfo&&this.state.carInfo.imeiCode ? '等待状态获取' : ''}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.detailView()
                        }
                        }>

                        <Image style={{width: 25, height: 25}} source={require('../../drawable/info_icon.png')}/>
                    </TouchableOpacity>
                </View>

                {
                    (() => {
                        //if (this.state.carInfo.imeiCode) {
                          if(1===1){
                            return<View>
                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 16,
                                    marginRight: 16,
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Image style={{width: 20, height: 20}}
                                               source={require('../../drawable/location_green.png')}/>
                                        <Text style={{color: Color.colorGreen,}}>当前位置</Text>
                                    </View>
                                    <Text>{this.state.nowTime}</Text>
                                </View>
                                <Text style={{marginLeft: 16, marginRight: 16, marginBottom: 16, marginTop: 5}}>{this.state.endAddress}</Text>


                                <View style={{flexDirection: 'row', marginLeft: 16}}>
                                    <Image style={{width: 20, height: 20}}
                                           source={require('../../drawable/location_red.png')}/>
                                    <Text style={{color: Color.colorRed,}}>起点</Text>
                                </View>
                                <Text style={{
                                    marginLeft: 16,
                                    marginRight: 16,
                                    marginBottom: 16,
                                    marginTop: 5
                                }}>{this.state.beginAddress}</Text>
                            </View>
                        } else {
                            return <View>
                                <Text style={{margin: 16}}>没有位置信息</Text>
                            </View>
                        }
                    })()
                }


            </View>

            <Loading visible={this.state.isLoading}/>

        </View>;
    }
}


