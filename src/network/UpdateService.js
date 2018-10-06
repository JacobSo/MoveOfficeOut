/**
 * 蒲公英更新api
 */
'use strict';
import React, {Component} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import ApiService from "./ApiService";
import SnackBar from 'react-native-snackbar-dialog'
export  default  class UpdateService {

    static update(isNotice) {
        let iosKey = "662cbac6fcc48aca832a63511afdc0bc";
        let androidKey = "37afc1bd768906cf61bc6cd873fdf09a";
        let iosCode = 13;//201810929 update
        let androidCode = 13;//20171023
        if(isNotice)
            SnackBar.show("检查中...",{duration:3000});
        ApiService.pgyerApiCheck(Platform.OS === 'ios' ? iosKey : androidKey)
            .then((responseJson) => {
                if (responseJson.code === 0) {
                    if (Number(responseJson.data[responseJson.data.length-1].appBuildVersion) <= (Platform.OS === "ios" ? iosCode : androidCode)) {
                        console.log('pgyerApiCheck:up to date:'+responseJson.data[responseJson.data.length-1].appBuildVersion);
                        if (isNotice)
                            SnackBar.show("已经是最新版本",{duration:1500})
                    } else {
                        Alert.alert(
                            '发现新版本-' + responseJson.data[responseJson.data.length - 1].appVersion,
                            "新版本：" + responseJson.data[responseJson.data.length - 1].appUpdateDescription,
                            [
                                {
                                    text: '取消', onPress: () => {
                                }
                                },
                                {
                                    text: '前往更新', onPress: () => {
                                        Linking.openURL("http://www.pgyer.com/apiv1/app/install?_api_key=6dadcbe3be5652aec70a3d56f153bfb4&aKey=" +
                                            responseJson.data[responseJson.data.length - 1].appKey);
                  /*                      Linking.openURL("itms-services://?action=download-manifest&url=https://www.pgyer.com/app/plist/" +
                                            responseJson.data[responseJson.data.length - 1].appKey);*/
                                }
                                },


                                {
                                    cancelable: false
                                }
                            ]
                        )
                    }
                } else {
                    console.log('pgyerApiCheck:failed');
                    if (isNotice)
                        SnackBar.show("检查更新服务错误，请稍后再试",{duration:3000})
                }
            })
            .catch((error) => {
                console.log('pgyerApiCheck:error');
                console.log(error);
                if (isNotice)
                    SnackBar.show("检查更新失败，请稍后再试",{duration:3000})
            }).done();
    }


}