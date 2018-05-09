/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions, ListView, Text, TouchableOpacity, Alert,
    Platform, Image, TextInput, ScrollView, KeyboardAvoidingView, RefreshControl
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/CfApiService';
import Color from '../../constant/Color';
import Loading from 'react-native-loading-spinner-overlay'
import SnackBar from 'react-native-snackbar-dialog'
import IosModule from '../../module/IosCommontModule'
import AndroidModule from '../../module/AndoridCommontModule'
const ImagePicker = require('react-native-image-picker');
const options = {
    quality: 0.2,
    noData: true,
    storageOptions: {
        skipBackup: true,//not icloud
        path: 'images'
    }
};
const {width, height} = Dimensions.get('window');

export default class CfSignPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            distance: "",
            submitPic: null,
        }
    }

    componentDidMount() {
    }


    setDistance() {
        if (!this.state.distance) {
            SnackBar.show('请填写里程');
            return
        }
        if (!this.state.submitPic) {
            SnackBar.show('请拍照记录里程');
            return
        }
        Alert.alert(
            this.props.carInfo.beginPoint ? '结束里程记录' : '起始里程记录',
            '本次记录里程：' + this.state.distance,
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    if (Platform.OS === 'android') {
                        AndroidModule.getImageBase64(this.state.submitPic.path, (callBackData) => this.sign(callBackData))
                    } else {
                        IosModule.getImageBase64(this.state.submitPic.uri.replace('file://', ''), (callBackData) => this.sign(callBackData));
                    }
                }
                },
            ]
        )


    }

    sign(data) {
        this.setState({isLoading: true});
        ApiService.setDistance(this.props.carInfo.billNo, this.state.distance, data, this.props.carInfo.beginPoint ? 'end' : 'begin').then((responseJson) => {
            this.setState({isLoading: false});
            if (!responseJson.isErr) {
                this.props.finishFunc();
                this.props.nav.goBack(null);
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


    capFunc() {
        ImagePicker.launchCamera(options, (response) => {
            console.log(JSON.stringify(response));
            if (!response.didCancel) {
                this.setState({
                    submitPic: response,
                })
            }
        });
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>
                <KeyboardAvoidingView behavior='position'>

                    <Toolbar
                        elevation={5}
                        title={["我的用车"]}
                        color={Color.colorBlueGrey}
                        isHomeUp={true}
                        isAction={true}
                        isActionByText={true}
                        actionArray={['提交']}
                        functionArray={[
                            () => this.props.nav.goBack(null),
                            () => this.setDistance()
                        ]}/>
                    <ScrollView >
                        <View>
                            <View style={{
                                margin: 16,
                                backgroundColor:this.props.carInfo.beginPoint ?Color.colorTeal: Color.colorIndigo,
                                borderRadius: 10,
                                elevation: 5,
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    color: 'white',
                                    margin: 16
                                }}>{this.props.carInfo.carNum}</Text>
                                <Text style={{margin: 16, color: 'white'}}>{'用车人：' + this.props.carInfo.account}</Text>

                                <View style={{
                                    backgroundColor: 'white',
                                    borderBottomLeftRadius: 10,
                                    borderBottomRightRadius: 10,
                                    padding: 16
                                }}>
                                    <Text>{'起始里程：' + (this.props.carInfo.beginPoint ? this.props.carInfo.beginPoint : '未填写')}</Text>
                                    <Text style={{marginTop:8,}}>{'结束里程：' + (this.props.carInfo.endPoint ? this.props.carInfo.endPoint : '未填写')}</Text>
                                </View>
                                <Image style={{position: 'absolute', alignContent: 'center', right: -55, top: 0}}
                                       source={this.props.carInfo.beginPoint ?require('../../drawable/car_image.png'):require('../../drawable/car_red.png')}/>
                            </View>

                            <View style={{
                                margin: 16,
                                backgroundColor: 'white',
                                borderRadius: 20,
                                elevation: 5,
                                alignItems: 'center'
                            }}>
                                <TextInput style={{width: width - 32, height:55,textAlign: 'center'}}
                                           placeholder="填写里程"
                                           returnKeyType={'done'}
                                           keyboardType={'numeric'}
                                           blurOnSubmit={true}
                                           underlineColorAndroid="transparent"
                                           onChangeText={(text) => this.setState({distance: text})}/>
                                <View style={{backgroundColor: Color.line, width: width - 32, height: 1}}/>
                                <TouchableOpacity onPress={() => this.capFunc()}
                                                  style={{width: width - 32, alignItems: 'center'}}>

                                    <Image style={{width: 25, height: 25, margin: 16}}
                                           source={require('../../drawable/post_cam.png')}/>
                                </TouchableOpacity>
                            </View>
                            {
                                (() => {
                                    if (this.state.submitPic)
                                        return <Image
                                            style={{
                                                height: 200,
                                                margin: 16,
                                                width: width - 32,
                                            }}
                                            source={{uri: this.state.submitPic.uri}}/>
                                })()
                            }

                        </View>
                    </ScrollView>
                    <Loading visible={this.state.isLoading}/>
                </KeyboardAvoidingView>

            </View>
        )
    }
}
