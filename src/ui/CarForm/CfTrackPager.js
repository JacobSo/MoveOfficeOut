/**
 * Created by Administrator on 2017/3/13.
 *
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity, Image, WebView,
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar';
import ApiService from '../../network/CfApiService';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class CfTrackPager extends Component {

    constructor(props) {
        super(props);
        this.state = {}
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
        ApiService.getGpsHistory("20007378639110152490631632e67e5be6207621293b590baeee1789670000010018010").then((responseJson) => {
            this.refs.webView.postMessage(JSON.stringify(responseJson.data));
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
        console.log(this.props.filePath);
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
            {/*<WebView source={{uri: 'http://192.168.1.113:811'}}/>*/}
            <WebView
                ref='webView'
                source={require('../../assets/index.html')}/>
            <View>
                <Text/>
            </View>
        </View>;
    }
}


