/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    Alert,
    ListView,
    ScrollView,
    StyleSheet,
    Dimensions, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, Platform, Text, DeviceEventEmitter
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import SnackBar from 'react-native-snackbar-dialog'
import Loading from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
const ImagePicker = require('react-native-image-picker');
const options = {
    quality: 0.2,
    noData: true,
    storageOptions: {
        skipBackup: true,//not icloud
        path: 'images'
    }
};
import SQLite from '../../db/Sqlite';
let sqLite = new SQLite();
export default class QcPostPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product: this.props.product[0],
            pics: [],
            submitContent: {},
            submitPic: [],
            isLoading: false,
            editContent: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            address: '',
            lat: '',
            lng: '',
        }
    }

    componentDidMount() {
        if (this.props.form.submitContent) {
            this.setState({
                pics: this.props.form.submitPic ? this.props.form.submitPic : [],
                dataSource: this.state.dataSource.cloneWithRows(this.props.form.submitPic ? this.props.form.submitPic : []),
                editContent: this.props.form.submitContent.subContent,//
                address: this.props.form.submitContent.address,
                lat: this.props.form.submitContent.lat,
                lng: this.props.form.submitContent.lng,
            });
        }
        if (Platform.OS === 'ios') {
            this.watchID = navigator.geolocation.watchPosition((position) => {
                this.fetchData(position.coords.longitude, position.coords.latitude);
            });
        } else {
            DeviceEventEmitter.addListener('callLocationChange', this.onAndroidLocationChange)
        }
    }

    componentWillUnmount(){
        if (Platform.OS === "android")
            DeviceEventEmitter.removeListener('onRefreshMessage', this.onAndroidLocationChange)
    }

    onAndroidLocationChange = (e) => {
        // SnackBar.show(e.address + ":" + e.lat + ":" + e.lng)
        if (this.state.address !== e.address) {
            this.state.address = e.address;
            this.state.lat = e.lat;
            this.state.lng = e.lng;
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
                this.state.address = responseBody.regeocode.formatted_address;
                this.state.lat = latitude;
                this.state.lng = longitude;

            }).catch((error) => {
            console.log(error);
        })
    };

    pack() {
        let tempContent = {
            index: this.state.product.ProductNoGuid + this.props.form.Guid,
            isPass: this.props.form.isPass,
            subContent: this.state.editContent,
            editDate: new Date().toLocaleString(),
            editAddress: this.state.address,
            lat: this.state.lat,
            lng: this.state.lng
        };

        let tempPics = [];
        this.state.pics.map((data) => {
            if (data.uri)
                tempPics.push({
                    fileName: data.fileName ? data.fileName : data.uri.substring(data.uri.lastIndexOf('/'), data.uri.length),
                    index: this.state.product.ProductNoGuid + this.props.form.Guid,
                    uri: data.uri//.replace('file://', '')
                });
        });
        //console.log(JSON.stringify(tempPics)+'----tempPics');
        //console.log(JSON.stringify(tempContent)+'----tempContent');
        this.state.submitContent = tempContent;
        this.state.submitPic = tempPics;
        this.save()
    }

    save() {
        // console.log(JSON.stringify(this.state.submitContent)+"-----submitContent");
        sqLite.insertQcDraftSingle(this.state.submitContent, this.state.submitPic)
            .then((result) => {
                SnackBar.show(result, {duration: 3000});
                this.props.appendFunc(this.state.submitContent, this.state.submitPic);
                this.props.nav.goBack(null);
            }).done();
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <Toolbar
                    elevation={2}
                    title={[this.props.form.qualityItem, '批注']}
                    color={Color.colorIndigo}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={["保存"]}
                    functionArray={[
                        () => this.props.nav.goBack(null),
                        () => {
                            this.pack();
                        },

                    ]}
                />
                <KeyboardAvoidingView behavior={'padding'}>
                    <ScrollView>
                        <View>
                            <TextInput
                                ref={(inputView) => {
                                    this.inputView = inputView;
                                }}
                                style={styles.textInput}
                                placeholder="请输入评审内容"
                                defaultValue={this.state.editContent}
                                multiline={true}
                                returnKeyType={'done'}
                                autoFocus={true}
                                blurOnSubmit={true}
                                underlineColorAndroid="transparent"
                                onChangeText={(text) => this.setState({editContent: text})}/>
                            <TouchableOpacity
                                style={{
                                    height: 35,
                                    flexDirection: 'row',
                                    width: width,
                                    alignItems: 'center'
                                }}
                                onPress={() => {
                                    ImagePicker.launchImageLibrary(options, (response) => {
                                        if (!response.didCancel) {
                                            this.state.pics.push(response);
                                            this.setState({dataSource: this.state.dataSource.cloneWithRows(this.state.pics),});
                                            //  console.log(JSON.stringify(this.state.pics));
                                        }
                                    });
                                }}>
                                <Image
                                    resizeMode="contain"
                                    style={{height: 25}}
                                    source={require('../../drawable/post_cam.png')}
                                />
                                <Text>拍照</Text></TouchableOpacity>
                            <View style={{height: 1, width: width, backgroundColor: Color.line}}/>


                            <ListView
                                dataSource={this.state.dataSource}
                                style={{marginBottom: 80}}
                                removeClippedSubviews={false}
                                enableEmptySections={true}
                                renderRow={(rowData, rowID, sectionID) =>
                                    <View >
                                        <Image
                                            resizeMode="contain"
                                            style={{height: 200, margin: 16}}
                                            source={{uri: rowData.uri}}/>
                                        <TouchableOpacity
                                            style={{position: 'absolute', right: 8,}}
                                            onPress={() => {
                                                //  console.log(rowID + ":" + sectionID);
                                                this.state.pics.splice(sectionID, 1);
                                                // console.log("delete:" + JSON.stringify(this.state.pics));
                                                this.setState(
                                                    {
                                                        dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.pics))),
                                                    });
                                                //   console.log(JSON.stringify(this.state.dataSource))
                                            }}>
                                            <Image
                                                resizeMode="contain"
                                                style={{height: 30, width: 30,}}
                                                source={require('../../drawable/close_post_label.png')}/>
                                        </TouchableOpacity>

                                    </View>
                                }/>
                        </View>
                    </ScrollView>
                    <Loading visible={this.state.isLoading}/>
                </KeyboardAvoidingView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    textInput: {
        width: width,
        height: 200,
        borderColor: Color.line,
        borderBottomWidth: 1,
        textAlign: "left",
        textAlignVertical: "top"
    },
});
