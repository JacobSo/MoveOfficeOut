/**
 * Created by Administrator on 2017/3/13.
 *
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    WebView,
} from 'react-native';
import Loading from 'react-native-loading-spinner-overlay';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar';
import ApiService from '../../network/CfApiService';

const Dimensions = require('Dimensions');
let jsCode = `
        var data = 'myLocationData';
        var map = new BMap.Map("allmap");
        var formatData = JSON.parse(data);
        var point = new BMap.Point(formatData.data[0].lng, formatData.data[0].lat);
        map.centerAndZoom(point, 10);
        var pois = [];
        formatData.data.map(function (temp) {
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
            let temp  = 'var data ="'+ JSON.stringify(responseJson.data)+'";'
            jsCode = temp +jsCode
            console.log(jsCode)
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
                elevation={2}
                title={['用车详细']}
                color={Color.colorBlueGrey}
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
                            ref='webView'
                            source={require('../../assets/index.html')}
                            injectedJavaScript={jsCode}
                            javaScriptEnabledAndroid={true}
                        />
                    }
                })()
            }

            <Loading visible={this.state.isLoading}/>

        </View>;
    }
}


