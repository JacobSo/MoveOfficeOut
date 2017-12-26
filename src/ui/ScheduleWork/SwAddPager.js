"use strict";
import React, {Component} from 'react';
import Color from '../../constant/Color';
import {
    Image,
    Alert,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ListView, FlatList, Platform, TextInput, ScrollView
} from 'react-native';
import Toolbar from "../Component/Toolbar";
import Sae from "react-native-textinput-effects/lib/Sae";
import {Akira, Hoshi, Jiro, Kaede, Madoka} from "react-native-textinput-effects";
import Loading from 'react-native-loading-spinner-overlay';
import Moment from 'moment';
import ApiService from '../../network/SwApiService';
import DatePicker from "../Component/DatePicker";
import * as ImageOptions from "../../constant/ImagePickerOptions"
import ImageList from "../Component/ImageList";
import AndroidModule from '../../module/AndoridCommontModule'
import IosModule from '../../module/IosCommontModule'
import SnackBar from 'react-native-snackbar-dialog'
import SwMemberList from "../Component/SwMemberList";
import {CachedImage} from "react-native-img-cache";

const {width, height} = Dimensions.get('window');
const ImagePicker = require('react-native-image-picker');


export default class SwAddPager extends Component<{}> {

    constructor(props) {
        super(props);
        //   this.dateStr = Moment(date).format('YYYY-MM-DD');

        this.state = {
            isLoading: false,
            date: this.props.item ? this.props.item.scWorkTime : "",
            remark: this.props.item ? this.props.item.scContent : "",

            members: this.props.item && this.props.item.scMembers ? this.initItems() : [],
            pics: [],
            submittedPics: this.props.item && this.props.item.scImages ? this.props.item.scImages.split(',') : [],
            dataSourcePic: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),

        };

    }

    componentDidMount() {
    }

    initItems() {
        let list = [];
        let temp = this.props.item.scMembers.split(',');
        temp.map((item, index) => {
            list.push({name: item, key: Math.random(), isSelect: false})
        });
        return list
    }

    confirm() {
        Alert.alert(
            '提交工作？',
            '提交后进入审核流程，不可更改。',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true,});
                    ApiService.auditWork(this.props.item.scId, 0)
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                this.props.refreshFunc();
                                this.props.nav.goBack(null)
                            } else {
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                                SnackBar.show(responseJson.ErrDesc);
                            }
                        })
                        .catch((error) => {
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                            console.log(error);
                            SnackBar.show("出错了，请稍后再试");
                        }).done();
                }
                },
            ]
        );
    }


    submit() {
        let membersStr = '';
        this.state.members.map((data) => {
            membersStr = data.name + "," + membersStr
        });


        if (!this.state.date || !this.state.remark) {
            SnackBar.show("请填写日期和工作");
            return
        }
        Alert.alert(
            '创建或修改工作？',
            '创建或修改工作后需要提交，提交前你还可以修改工作，提交后不可更改',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true,});
                    ApiService.createWork(this.state.date, this.state.remark, membersStr.substring(0, membersStr.length - 1), this.props.item ? this.props.item.scId : null)
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                if (this.state.pics.length !== 0) {
                                    this.postImage(responseJson.uploadId)
                                } else {
                                    this.props.refreshFunc();
                                    this.props.nav.goBack(null)
                                }
                            } else {
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                                SnackBar.show(responseJson.ErrDesc);
                            }
                        })
                        .catch((error) => {
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                            console.log(error);
                            SnackBar.show("出错了，请稍后再试");
                        }).done();
                }
                },
            ]
        );

    }

    postImage(mainId) {
        if (Platform.OS === 'android') {
            this.state.pics.map((data, index) => {
                AndroidModule.getImageBase64(data.path, (callBackData) => {
                    this.postImgReq(data, index, callBackData, mainId);
                });
            })
        } else {
            this.state.pics.map((data, index) => {
                IosModule.getImageBase64(data.path, (callBackData) => {
                    //SnackBar.show(mainId+','+index+','+JSON.stringify(data));
                    this.postImgReq(data, index, callBackData, mainId);
                })
            });
        }
    }

    postImgReq(data, index, callBackData, mainId) {
        ApiService.uploadImage(
            mainId,
            data.fileName,
            callBackData)
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    if (index === this.state.pics.length - 1) {
                        SnackBar.show("提交成功");
                        this.props.refreshFunc();
                        this.props.nav.goBack(null)
                    }
                } else {
                    SnackBar.show(responseJson.ErrDesc);
                    if (index === this.state.pics.length - 1) {
                        setTimeout(() => {
                            this.setState({isLoading: false})
                        }, 100);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
                if (index === this.state.pics.length - 1) {
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
            }).done();
    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={["创建日程"]}
                    color={Color.colorGreen}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={this.props.item ? ["修改", "最终提交"] : ['创建']}
                    functionArray={[
                        () => this.props.nav.goBack(null),
                        () => this.submit(),
                        () => this.confirm()
                    ]}
                />
                <ScrollView>
                    <View style={{marginBottom: 55}}>
                        <View style={styles.cardContainer}>
                            <DatePicker
                                customStyles={{
                                    placeholderText: {
                                        color: 'black',
                                        textAlign: 'center',
                                        width: width / 4,
                                    },
                                    dateText: {
                                        color: Color.content, textAlign: 'center', width: width / 4,
                                    }
                                }}
                                date={this.state.date}
                                mode="date"
                                placeholder="工作日期"
                                format="YYYY-MM-DD"
                                minDate={this.dateStr}
                                confirmBtnText="确认"
                                cancelBtnText="取消"
                                showIcon={false}
                                onDateChange={(date) => {
                                    this.setState({date: date})
                                }}
                            />
                        </View>
                        <View style={styles.cardContainer}>
                            <Text style={{margin: 16, color: 'black'}}>日程工作描述</Text>
                            <TextInput
                                style={styles.inputStyle}
                                multiline={true}
                                placeholder="在这里填写"
                                returnKeyType={'done'}
                                underlineColorAndroid="transparent"
                                blurOnSubmit={true}
                                defaultValue={this.state.remark}
                                onChangeText={(text) => this.setState({remark: text})}/>
                        </View>

                        <View style={styles.cardContainer}>
                            <Text style={{margin: 16, color: 'black'}}>协助人员</Text>
                            <View style={{backgroundColor: Color.line, width: width - 64, height: 1}}/>
                            <SwMemberList
                                items={this.state.members}
                                isHasBackground={false}
                                addFunc={() => {
                                    this.props.nav.navigate('swParam', {
                                        finishFunc: (members) => {
                                            let flag = false;
                                            this.state.members.map((data1) => {
                                                members.map((data2) => flag = (data1.name === data2.name));
                                                if (!flag)
                                                    members.push(data1)
                                            });
                                            this.setState({members: members})
                                        }
                                    });
                                }}

                                editFunc={(item, index) => {
                                    this.state.members.splice(index, 1);
                                    this.setState({members: this.state.members})
                                }}/>
                        </View>


                        <View style={styles.cardContainer}>
                            <Text style={{margin: 16, color: 'black'}}>附加照片</Text>
                            <ImageList dataSourcePic={this.state.dataSourcePic} action={(sectionID) => {
                                this.state.pics.splice(sectionID, 1);
                                this.setState({
                                    dataSourcePic: this.state.dataSourcePic.cloneWithRows(JSON.parse(JSON.stringify(this.state.pics))),
                                });
                            }}/>
                            <TouchableOpacity onPress={() => {
                                ImagePicker.showImagePicker(ImageOptions.options, (response) => {
                                    if (!response.didCancel) {
                                        this.state.pics.push(response);
                                        this.setState({dataSourcePic: this.state.dataSourcePic.cloneWithRows(this.state.pics),});
                                    }
                                });
                            }} style={styles.buttonStyle}>
                                <Text style={{color: 'white', margin: 16}}>拍照</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            (() => {
                                if (this.state.submittedPics.length !== 0)
                                    return <View style={[styles.cardContainer, {marginBottom: 55}]}>
                                        <Text style={{margin: 16, color: 'black'}}>已添加照片</Text>
                                        <View style={{backgroundColor: Color.line, width: width - 64, height: 1}}/>
                                        <FlatList
                                            data={this.state.submittedPics}
                                            extraData={this.state}
                                            renderItem={({item}) => {
                                                console.log(item);
                                                return <CachedImage
                                                    resizeMode="contain"
                                                    style={{width: width - 32, height: 200, marginBottom: 16}}
                                                    source={{uri: item}}/>
                                            }}
                                        />
                                    </View>
                            })()
                        }
                    </View>
                </ScrollView>
                <Loading visible={this.state.isLoading}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Color.background,
    },

    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 2,
        margin: 16,
        width: width - 32,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputStyle: {
        width: width - 64,
        height: 100,
        marginRight: 10,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: Color.line
    },
    buttonStyle: {
        backgroundColor: Color.colorGreen,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        width: width - 32
    }

});
