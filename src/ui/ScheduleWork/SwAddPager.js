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
    ListView, FlatList, Platform, TextInput, ScrollView, KeyboardAvoidingView
} from 'react-native';
import Toolbar from "../Component/Toolbar";
import InputDialog from "../Component/InputDialog";
import Loading from 'react-native-loading-spinner-overlay';
import ApiService from '../../network/SwApiService';
import DatePicker from "../Component/DatePicker";
import * as ImageOptions from "../../constant/ImagePickerOptions"
import ImageList from "../Component/ImageList";
import AndroidModule from '../../module/AndoridCommontModule'
import IosModule from '../../module/IosCommontModule'
import SnackBar from 'react-native-snackbar-dialog'
import SwMemberList from "../Component/SwMemberList";
import {CachedImage} from "react-native-img-cache";
import App from '../../constant/Application';

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
            confirmRemark: '',
            helpContent: this.props.item ? this.props.item.helpContent : ''
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

    confirmDialog() {
        return (
            <InputDialog
                isMulti={false}
                action={[
                    (popupDialog) => this.popupDialog = popupDialog,
                    (text) => {
                        this.setState({confirmRemark: text});
                    },
                    () => {
                        this.setState({confirmRemark: ''});
                        this.popupDialog.dismiss();
                    },
                    () => {
                        if (this.state.confirmRemark) {
                            this.confirmFunc(2);

                        } else {
                            SnackBar.show("必须填写驳回理由");

                        }

                    }
                ]} str={["驳回工作", "必须填写驳回理由"]}/>)
    }

    confirm(flag) {
        Alert.alert(
            flag === 0 ? '提交工作？' : "审核通过",
            flag === 0 ? '提交后进入审核流程，不可更改' : "审核通过，工作马上开展",
            [{
                text: '取消', onPress: () => {
                }
            }, {text: '确定', onPress: () => this.confirmFunc(flag)},]
        );
    }

    deleteWork() {
        Alert.alert(
            "删除工作",
            "删除后不可恢复",
            [{
                text: '取消', onPress: () => {
                }
            }, {
                text: '确定', onPress: () => {
                    this.setState({isLoading: true,});
                    ApiService.deleteWork(this.props.item.scId)
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                this.props.refreshFunc();
                                this.props.nav.goBack(null)
                                SnackBar.show("删除成功");
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
            },]
        );
    }

    submit() {
        if (!this.state.date || !this.state.remark) {
            SnackBar.show("请填写日期和工作");
            return
        }
        Alert.alert(
            this.props.item ? '修改工作' : "创建工作",
            '创建或修改工作后需要提交，提交前你还可以修改工作，提交后不可更改',
            [
                {
                    text: '取消', onPress: () => null
                },
                {
                    text: this.props.item ? '仅修改' : '仅创建', onPress: () => this.submitFunc(false)
                },
                {
                    text: this.props.item ? '修改并提交' : '创建并提交', onPress: () => this.submitFunc(true)
                },
            ]
        );
    }

    submitFunc(isBoth) {
        let membersStr = '';
        this.state.members.map((data) => {
            membersStr = data.name + "," + membersStr
        });
        this.setState({isLoading: true,});
        ApiService.createWork(this.state.date, this.state.remark, membersStr.substring(0, membersStr.length - 1), this.props.item ? this.props.item.scId : null, isBoth, this.state.helpContent)
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

    confirmFunc(flag) {
        this.setState({isLoading: true,});
        ApiService.auditWork(this.props.item.scId, flag, this.state.confirmRemark)
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

    postImage(mainId, isBoth) {
        if (Platform.OS === 'android') {
            this.state.pics.map((data, index) => {
                AndroidModule.getImageBase64(data.path, (callBackData) => {
                    this.postImgReq(data, index, callBackData, mainId, isBoth);
                });
            })
        } else {
            this.state.pics.map((data, index) => {
                //  SnackBar.show(JSON.stringify(data));
                //  SnackBar.show(mainId);
                IosModule.getImageBase64(data.uri.replace('file://', ''), (callBackData) => {
                    // console.log(data)
                    //   console.log(callBackData)
                    this.postImgReq(data, index, callBackData, mainId, isBoth);


                })
            });
        }
    }

    postImgReq(data, index, callBackData, mainId, isBoth) {

        //
        ApiService.uploadImage(
            mainId,
            data.fileName ? data.fileName : data.uri.substring(data.uri.lastIndexOf('/'), data.uri.length),
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

    getMenu() {
        if (this.props.item) {//已创建
            if ((this.props.item.scCreator === App.account) && (this.props.item.scStatus === 0 || this.props.item.scStatus === 3)) {//创建人//待提交//已驳回
                return ["删除", "操作"]
            } else if ((this.props.memberType.indexOf("1") > -1) && (this.props.item.scStatus === 1)) {//审核人//待审核
                return ["驳回", "通过"]
            } else return []
        } else return ["创建"]
    }

    getMenuFunc() {
        if (this.props.item) {//已创建
            if ((this.props.item.scCreator === App.account) && (this.props.item.scStatus === 0 || this.props.item.scStatus === 3)) {//创建人//待提交//已驳回
                return [
                    () => this.props.nav.goBack(null),
                    () => this.deleteWork(),
                    () => this.submit(),//修改
                ]
            } else if ((this.props.memberType.indexOf("1") > -1) && (this.props.item.scStatus === 1)) {//审核人//待审核
                return [() => this.props.nav.goBack(null),
                    () => this.popupDialog.show(),//驳回
                    () => this.confirm(1)]//通过
            } else return [() => this.props.nav.goBack(null),]//noting
        } else return [() => this.props.nav.goBack(null), () => this.submit(),]//新增

    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={["新创建日程",
                        this.props.item ? ( this.props.item.scCreator === App.account ? "我的工作" //创建人查看
                            : (this.props.memberType.indexOf('1') > -1 ? "审核"//审核人
                                : "查看"))//其他
                            : '我的工作']}//创建
                    color={Color.colorGreen}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={this.getMenu()}
                    functionArray={this.getMenuFunc()}
                />
                <ScrollView>
                    <View style={{marginBottom: 110}}>
                        <View style={styles.cardContainer}>
                            <DatePicker
                                disabled={
                                    (this.props.item !== undefined && this.props.item.scStatus === 1 && this.props.memberType.indexOf('0') > -1) ||
                                    (this.props.item !== undefined && this.props.item.scCreator !== App.account)//非本人
                                }
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
                                editable={
                                    !(this.props.item !== undefined && this.props.item.scStatus === 1 && this.props.memberType.indexOf('0') > -1) &&
                                    !(this.props.item !== undefined && this.props.item.scCreator !== App.account)//非本人
                                }
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
                            <TextInput
                                editable={
                                    !(this.props.item !== undefined && this.props.item.scStatus === 1 && this.props.memberType.indexOf('0') > -1) &&
                                    !(this.props.item !== undefined && this.props.item.scCreator !== App.account)//非本人
                                }
                                style={styles.inputStyle}
                                multiline={true}
                                placeholder="请填写需要协助的内容"
                                returnKeyType={'done'}
                                underlineColorAndroid="transparent"
                                blurOnSubmit={true}
                                defaultValue={this.state.helpContent}
                                onChangeText={(text) => this.setState({helpContent: text})}/>
                            <View style={{backgroundColor: Color.line, width: width - 64, height: 1}}/>

                            <SwMemberList
                                items={this.state.members}
                                isHasBackground={false}
                                disable={
                                    (this.props.item !== undefined && this.props.item.scStatus === 1 && this.props.memberType.indexOf('0') > -1) ||
                                    (this.props.item !== undefined && this.props.item.scCreator !== App.account)//非本人
                                }
                                addFunc={() => {
                                    this.props.nav.navigate('swParam', {
                                        finishFunc: (members) => {
                                            console.log(members)
                                            console.log(this.state.members)
                                            if(this.state.members.length===0){
                                                this.setState({members: members})
                                            }else{
                                                let flag = false;
                                                this.state.members.map((data1) => {
                                                    members.map((data2) => flag = (data1.name === data2.name));
                                                    if (!flag){
                                                        members.push(data1)
                                                    }
                                                    flag = false;
                                                });
                                                this.setState({members: members})

                                            }

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
                            <TouchableOpacity
                                disabled={
                                    (this.props.item !== undefined && this.props.item.scStatus === 1 && this.props.memberType.indexOf('0') > -1) ||//非创建+已审核+普通人
                                    (this.props.item !== undefined && this.props.item.scCreator !== App.account)//非本人
                                }
                                onPress={() => {
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
                                            keyExtractor={(item, index) => item}
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
                {this.confirmDialog()}

                <Loading visible={this.state.isLoading}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
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
