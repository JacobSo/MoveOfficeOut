/**
 * Created by Administrator on 2017/3/13.
 *
 */
'use strict';
import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    WebView,
} from 'react-native';
import Loading from 'react-native-loading-spinner-overlay';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar';
import ApiService from '../../network/CfApiService';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

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

        var sContent = "出发起点";
        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point); //开启信息窗口
    `;
export default class CfTrackPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isData: false,
            isLoading: true
        }
    }

    componentDidMount() {
        // this.getToken()
        this.getCar();
        //   this.getNow();
        //  this.getDeviceAddress();
    }

    getToken() {
        this.setState({isRefreshing: true});
        ApiService.getGpsToken().then((responseJson) => {
        })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
                this.setState({isRefreshing: false});
            }).done();
    }

    getCar() {
        this.setState({isRefreshing: true});
        ApiService.getGpsHistory("20007378639110152522677532f63c4056f34968ef4598a97735e9912b0000010018010").then((responseJson) => {
            //this.refs.webView.postMessage(JSON.stringify(responseJson.data));
            let temp = 'var data =\'' + JSON.stringify(responseJson.data) + '\';'
            jsCode = temp + jsCode;
            console.log(jsCode);
            this.setState({
                isData: true,
                isLoading: false
            });
        })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
                this.setState({isRefreshing: false});
            }).done();
    }

    getNow() {
        this.setState({isRefreshing: true});
        ApiService.getDevicesNow("20007378639110152490631632e67e5be6207621293b590baeee1789670000010018010").then((responseJson) => {

        })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
                this.setState({isRefreshing: false});
            }).done();
    }

    getDeviceAddress() {
        this.setState({isRefreshing: true});
        ApiService.getAddress("20007378639110152490631632e67e5be6207621293b590baeee1789670000010018010", 112.93823, 22.907767).then((responseJson) => {

        })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
                this.setState({isRefreshing: false});
            }).done();
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

            {
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
            }

            <View style={{
                backgroundColor: 'white',
                margin: 16,
                borderRadius: 10,
                position: 'absolute',
                bottom: 25+16,
                width: width - 32,
                elevation: 5,
            }}>

                <View style={{flexDirection:'row',justifyContent:'space-between',margin: 16}}>
                    <Text style={{color: Color.colorBlue, fontSize: 18, }}>粤X11v71</Text>
                    <Image style={{width:25,height:25}} source={require('../../drawable/info_icon.png')}/>
                </View>

                <View style={{flexDirection:'row',marginLeft: 16}}>
                    <Image style={{width:20,height:20}} source={require('../../drawable/location_green.png')}/>
                    <Text style={{color: Color.colorGreen,}}>当前位置</Text>
                </View>
                <Text style={{marginLeft:16,marginRight:16,marginBottom:16}}>搜狐新闻中心24小时值班电话：010-65102160 转6291或65101378:</Text>
               {/* <Text>定位时间</Text>
                <Text>速度</Text>
                <Text>在线状态</Text>*/}

                <View style={{flexDirection:'row',marginLeft: 16}}>
                    <Image style={{width:20,height:20}} source={require('../../drawable/location_red.png')}/>
                    <Text style={{color: Color.colorRed,}}>起点</Text>
                </View>
                <Text style={{marginLeft:16,marginRight:16,marginBottom:16}}>搜狐新闻中心24小时值班电话：010-65102160 转6291或65101378:</Text>


            </View>

            <Loading visible={this.state.isLoading}/>

        </View>;
    }
}


