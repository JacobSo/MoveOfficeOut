/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions, Platform, ListView, Text, TouchableOpacity, Alert,
    DeviceEventEmitter, Image
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/QcApiService';
import Color from '../../constant/Color';
import Loading from 'react-native-loading-spinner-overlay'
import SQLite from '../../db/Sqlite';
import SnackBar from 'react-native-snackbar-dialog'
import InputDialog from "../Component/InputDialog";
import AndroidModule from '../../module/AndoridCommontModule'
import IosModule from '../../module/IosCommontModule'
import Utility from "../../utils/Utility";
const {width, height} = Dimensions.get('window');
let sqLite = new SQLite();
const ImagePicker = require('react-native-image-picker');
const options = {
    quality: 0.2,
    noData: true,
    storageOptions: {
        skipBackup: true,//not icloud
        path: 'images'
    }
};
export default class QcSignPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            editContent: '',
            submitPic: null,
            address: "未有位置信息",
            lat: "0.0",
            lng: "0.0",
        }
    }

    componentDidMount() {
        this.getSighToday();
        if (Platform.OS === 'ios') {
            this.watchID = navigator.geolocation.watchPosition((position) => {
                this.fetchData(position.coords.longitude, position.coords.latitude);
            });
        } else {
            DeviceEventEmitter.addListener('callLocationChange', this.onAndroidLocationChange)
        }
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
        DeviceEventEmitter.removeListener('onRefreshMessage', this.onAndroidLocationChange)
    }

    onAndroidLocationChange = (e) => {
        // Toast.show(e.address + ":" + e.lat + ":" + e.lng)
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
                })

            }).catch((error) => {
            console.log(error);
        })
    };


    remarkDialog() {
        return (
            <InputDialog
                isMulti={false}
                action={[
                    (popupDialog) => {
                        this.popupDialog = popupDialog;
                    },
                    (text) => {
                        this.setState({editContent: text})
                    },
                    () => {
                        this.setState({editContent: ''});
                        this.popupDialog.dismiss();
                    },
                    () => {
                        this.popupDialog.dismiss();
                    }
                ]} str={['填写备注', '备注，如无特殊情况，可忽略']}/>)
    }

    recapDialog() {
        Alert.alert(
            '签到图片',
            '查看图片，或者重新再拍一张',
            [
                {
                    text: '查看', onPress: () => {
                    this.props.nav.navigate('gallery', {
                        pics: [this.state.submitPic.uri]
                    })
                }
                },
                {
                    text: '重拍', onPress: () => {
                    this.capFunc();
                }
                },
            ]
        )
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

    signDialog() {
        if (!this.state.submitPic) {
            SnackBar.show("必须拍照才可签到", {duration: 1500});
            return
        }
        this.setState({isLoading: true});
        if (Platform.OS === 'android') {
            AndroidModule.getImageBase64(this.state.submitPic.path, (callBackData) => this.sign(callBackData))
        } else {
            IosModule.getImageBase64(this.state.submitPic.uri.replace('file://', ''), (callBackData) => this.sign(callBackData));
        }
    }

    sign(imageBase) {
        ApiService.arrivalSign(
            imageBase,
            this.state.submitPic.fileName ?
                this.state.submitPic.fileName :
                this.state.submitPic.uri.substring(this.state.submitPic.uri.lastIndexOf('/'), this.state.submitPic.uri.length),
            this.state.editContent,
            this.state.address,
            this.state.lat,
            this.state.lng
        ).then((responseJson) => {
            console.log(JSON.stringify(responseJson));
            if (!responseJson.IsErr) {
                SnackBar.show("签到成功", {duration: 1500});
                this.props.nav.goBack(null);
            } else {
                SnackBar.show(responseJson.ErrDesc, {duration: 1500});
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            }
        })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            }).done();
    }

    getSighToday() {
        ApiService.getSignHistory().then((responseJson) => {
            console.log(JSON.stringify(responseJson));
            if (!responseJson.IsErr) {
                this.setState({
                    items: responseJson.list,
                    dataSource: this.state.dataSource.cloneWithRows(responseJson.list)
                })
            } else {
                SnackBar.show(responseJson.ErrDesc, {duration: 1500});
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            }
        })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            }).done();
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={0}
                    title={[""]}
                    color={Color.colorIndigo}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                    ]}/>
                <View style={styles.topLayout}>
                    <Text style={{color: 'white', fontSize: 25, margin: 10}}>今日签到</Text>
                    <Text style={{
                        color: 'white',
                        width: 200,
                        textAlign: 'center',
                        marginTop: 10
                    }}>{this.state.address}</Text>
                    <View style={styles.signButton}>
                        <TouchableOpacity onPress={
                            () => {
                                this.popupDialog.show();
                            }
                        }>
                            <Image source={require("../../drawable/pen_unwrite.png")}
                                   style={{width: 20, height: 20, margin: 10}}/>
                            {
                                (() => {
                                    if (this.state.editContent)
                                        return <View style={styles.redPoint}/>

                                })()
                            }
                        </TouchableOpacity>
                        <View style={styles.signButtonLine}/>
                        <TouchableOpacity onPress={
                            () => this.signDialog()
                        }>
                            <Text style={styles.signText}>签到</Text>
                        </TouchableOpacity>
                        <View style={styles.signButtonLine}/>
                        <TouchableOpacity onPress={
                            () => {
                                if (this.state.submitPic)
                                    this.recapDialog();
                                else
                                    this.capFunc()
                            }
                        }>
                            <Image source={require("../../drawable/post_cam.png")}
                                   style={{width: 25, height: 25, margin: 10}}/>
                            {
                                (() => {
                                    if (this.state.submitPic)
                                        return <View style={styles.redPoint}/>
                                })()
                            }
                        </TouchableOpacity>
                    </View>
                </View>


                {
                    (() => {
                        if (this.state.items.length === 0) {
                            return <View style={{flexDirection: 'row', paddingLeft: 16,}}>
                                <Text style={{marginTop: 25}}>{Utility.getHourMinute(new Date())}</Text>
                                <View style={{marginRight: 10, marginLeft: 16, alignItems: 'center',}}>
                                    <View style={styles.timeLine}/>
                                    <View style={styles.timeLinePoint}/>
                                </View>
                                <View
                                    style={[styles.signCard, {width: width / 2 + 25}]}>
                                    <Text>今天还没签到</Text>
                                </View>
                            </View>
                        } else {
                            return <ListView
                                ref="scrollView"
                                dataSource={this.state.dataSource}
                                style={{marginBottom: Platform.OS === 'ios' ? 0 : 25}}
                                removeClippedSubviews={false}
                                enableEmptySections={true}
                                renderRow={(rowData, rowID, sectionID) =>
                                    <View style={{flexDirection: 'row', paddingLeft: 10,}}>
                                        <Text style={{
                                            marginTop: 25,
                                            width: 40,
                                            flex: 1,
                                            textAlign: 'center'
                                        }}>{rowData.SignTime.substring(rowData.SignTime.lastIndexOf(" "), rowData.SignTime.lastIndexOf(":"))}</Text>
                                        <View style={{marginRight: 10, marginLeft: 16, alignItems: 'center',}}>
                                            <View style={styles.timeLine}/>
                                            <View style={styles.timeLinePoint}/>
                                        </View>
                                        <TouchableOpacity
                                            style={[styles.signCard, {elevation: 2,}]}
                                            onPress={
                                                () => this.props.nav.navigate('gallery', {
                                                    pics: [rowData.PicPath]
                                                })
                                            }>
                                            <Text>签到详情(点击查看图片)</Text>
                                            <Text style={styles.signCardText}>{rowData.Address}</Text>
                                            <Text style={styles.signCardText}>{rowData.ReMark}</Text>
                                        </TouchableOpacity>
                                    </View>
                                }/>
                        }
                    })()
                }
                <Loading visible={this.state.isLoading}/>
                {this.remarkDialog()}

            </View>
        )
    }
}
const styles = StyleSheet.create({
    signButton: {
        padding: 16,
        backgroundColor: 'white',
        margin: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        height: 55,
        justifyContent: 'space-between'
    },
    signText: {
        color: Color.black_semi_transparent,
        fontSize: 18,
        width: 100,
        textAlign: 'center'
    },
    signButtonLine: {
        height: 20,
        width: 1,
        backgroundColor: Color.line,
        margin: 16
    },
    topLayout: {
        backgroundColor: Color.colorIndigo,
        alignItems: 'center',
        elevation: 2
    },
    timeLine: {
        backgroundColor: Color.line,
        width: 5,
        flex: 1
    },
    timeLinePoint: {
        borderColor: Color.line,
        backgroundColor: 'white',
        borderRadius: 50,
        width: 20,
        height: 20,
        borderWidth: 5,
        top: 25,
        position: 'absolute'
    },
    signCard: {
        flex: 4,

        padding: 16,
        backgroundColor: 'white',
        margin: 10
    },
    signCardText: {
        width: width / 2 + 25,
        color: Color.black_semi_transparent,
        marginTop: 10
    },
    redPoint: {
        backgroundColor: Color.colorAccent,
        width: 10,
        height: 10,
        borderRadius: 50,
        position: 'absolute',
        right: 0,
        top: 5
    }
});
