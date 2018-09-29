"use strict";
import React, {Component} from 'react';
import Color from '../../constant/Color';
import {
    Platform,
    Alert,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ListView, FlatList, TextInput, ScrollView, KeyboardAvoidingView
} from 'react-native';
import Toolbar from "../Component/Toolbar";
import Loading from 'react-native-loading-spinner-overlay';
import App from '../../constant/Application';
import StarSeek from "../Component/StarSeek";
import * as ImageOptions from "../../constant/ImagePickerOptions"
import ImageList from "../Component/ImageList";
import SwFeedbackItem from "../Component/SwFeedbackItem";
import SwMemberList from "../Component/SwMemberList";
import SnackBar from 'react-native-snackbar-dialog'
import ApiService from '../../network/SwApiService';
import AndroidModule from '../../module/AndoridCommontModule'
import IosModule from '../../module/IosCommontModule'
import * as ColorGroup from "../../constant/ColorGroup";
import * as StatusGroup from "../../constant/StatusGroup";
const ImagePicker = require('react-native-image-picker');
const {width, height} = Dimensions.get('window');

export default class SwDetailPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isShowDetail: false,
            isShowConfirmMember: false,

            members: this.props.item && this.props.item.scMembers ? this.initItems() : [],
            feedback: '',

            date: "",
            remark: '',
            starA: 0,
            pics: [],
            dataSourcePic: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            image: [],
            helpContent: this.props.item && this.props.item.helpContent,
            resultComment: ''
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

    updateMember() {
        let membersStr = '';
        this.state.members.map((data) => {
            membersStr = data.name + "," + membersStr
        });
        Alert.alert(
            "修改协助人员？",
            "可添加或删除协助人员",
            [{
                text: '取消', onPress: () => {
                }
            }, {
                text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.callHelper(this.props.item.scId, membersStr.substring(0, membersStr.length - 1), this.state.helpContent)
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                this.props.refreshFunc();
                                this.props.nav.goBack(null);
                                SnackBar.show('更新成功');
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
            }]);
    }

    submitContent() {
        if (!this.state.feedback) {
            SnackBar.show("请填写工作内容");
            return
        }
        Alert.alert(
            "添加工作处理内容",
            "工作内容可以多次添加",
            [{
                text: '取消', onPress: () => {
                }
            }, {
                text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.submitFeedback(this.props.item.scId, this.state.feedback)
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                if (this.state.pics.length !== 0) {
                                    this.postImage(responseJson.uploadId)
                                } else {
                                    this.props.refreshFunc();
                                    this.props.nav.goBack(null)
                                    SnackBar.show('添加成功');

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
            },]
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
                IosModule.getImageBase64(data.uri.replace('file://', ''), (callBackData) => {
                    //SnackBar.show(mainId+','+index+','+JSON.stringify(data));
                    this.postImgReq(data, index, callBackData, mainId);
                })
            });
        }
    }

    postImgReq(data, index, callBackData, mainId) {
        ApiService.uploadImage(
            mainId,
            data.fileName ? data.fileName : data.uri.substring(data.uri.lastIndexOf('/'), data.uri.length),
            callBackData)
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    if (index === this.state.pics.length - 1) {
                        SnackBar.show("添加成功");
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

    finishSchedule() {
        if (this.props.item.ScheduleFeedbackList && this.props.item.ScheduleFeedbackList.length === 0) {
            SnackBar.show("至少添加一项工作处理才可以完结");
            return;
        }
        Alert.alert(
            "完成工作？",
            "完成工作后进入审核人针对你的工作进行评分的阶段",
            [{
                text: '取消', onPress: () => {
                }
            }, {
                text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.auditWork(this.props.item.scId, 3)
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                this.props.refreshFunc();
                                this.props.nav.goBack(null);
                                SnackBar.show('操作成功');
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

    setStar() {
        if (this.state.starA === 0) {
            SnackBar.show("必须选择分数");
            return;
        }
        Alert.alert(
            "给予评价：" + StatusGroup.swStarDesc[this.state.starA],
            "评分完成后，工作结束",
            [{
                text: '取消', onPress: () => {
                }
            }, {
                text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.setResult(this.props.item.scId, this.state.starA, this.state.resultComment)
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                this.props.refreshFunc();
                                this.props.nav.goBack(null);
                                SnackBar.show('操作成功');
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

    workDetail() {
        if (this.state.isShowDetail)
            return <View>
                <View
                    style={[styles.itemText, {
                        borderTopWidth: 1,
                        borderColor: Color.line,
                        paddingTop: 10
                    }]}>
                    <Text>{'工作开始日期'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.item.scWorkTime}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'工作类别'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.item.workType}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'审核时间'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.item.aduitTime}</Text>
                </View>
                <View
                    style={styles.itemText}>
                    <Text>{'创建日期'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.item.scCreateTime}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'创建人'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.item.scCreator}</Text>
                </View>
                <View style={styles.itemText}>
                    <Text>{'预计完成时间'}</Text>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.item.scCreator}</Text>
                </View>
            </View>
        else return null
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-75}>
                <View style={{backgroundColor: Color.background, marginBottom: 155}}>
                    <Toolbar
                        elevation={2}
                        title={["日程工作", this.props.item.scCreator === App.account ? "我的工作" :
                            (this.props.item.scMembers.indexOf(App.account) > -1 ? '协助' : '查看')]}
                        color={Color.colorGreen}
                        isHomeUp={true}
                        isAction={true}
                        isActionByText={true}
                        actionArray={this.props.item.scStatus === 2 && this.props.item.scCreator === App.account ? ['完成'] : []}
                        functionArray={
                            this.props.item.scStatus === 2 && this.props.item.scCreator === App.account ?
                                [
                                    () => this.props.nav.goBack(null),
                                    () => this.finishSchedule()
                                ]:[ () => this.props.nav.goBack(null)]}
                    />
                    <ScrollView>
                        <View style={{
                            marginBottom: 55, alignItems: 'center',
                        }}>

                            <View style={styles.iconContainer}>
                                <Text style={{
                                    color: 'white',
                                    backgroundColor: ColorGroup.swColor[this.props.item.scStatus],
                                    textAlign: 'center',
                                    borderTopRightRadius: 10,
                                    borderTopLeftRadius: 10,
                                    padding: 5,
                                }}>{StatusGroup.swItemStatus[this.props.item.scStatus]}</Text>

                                <Text style={{
                                    margin: 16,
                                    fontWeight: 'bold'
                                }}>{this.props.item.scContent}</Text>
                                {
                                    this.workDetail()
                                }

                                <View style={styles.itemText}>
                                    <View/>
                                    <View style={{flexDirection: "row"}}>
                                        <TouchableOpacity
                                            onPress={() => this.setState({isShowDetail: !this.state.isShowDetail})}
                                            style={{marginRight: 16, marginTop: 16, marginBottom: 6}}>
                                            <Text>{this.state.isShowDetail ? '收起' : '展开'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            //scImages
                                            if (this.props.item.scImages)
                                                this.props.nav.navigate('gallery', {
                                                    pics: this.props.item.scImages.split(',')
                                                });
                                            else SnackBar.show('没有图片')
                                        }} style={{marginTop: 16, marginBottom: 6, marginLeft: 16}}>
                                            <Text style={{color: Color.colorGreen}}>查看图片</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {
                                (() => {
                                    if (this.props.item.scStatus === 5) {
                                        return <View style={{alignItems: 'center'}}>
                                            <View style={styles.titleContainer}>
                                                <Text style={{fontSize: 18, fontWeight: 'bold',}}>工作评分</Text>
                                            </View>
                                            <View style={[styles.starContainer, {paddingTop: 16}]}>
                                                <StarSeek
                                                    onSelect={() => {
                                                    }}
                                                    defaultStar={this.props.item.scWorkResult} disable={true}/>
                                                <Text>{StatusGroup.swStarDesc[this.props.item.scWorkResult]}</Text>
                                                <View style={{
                                                    width: width - 64,
                                                    height: 1,
                                                    backgroundColor: Color.line,
                                                    marginTop: 16
                                                }}/>
                                                <Text
                                                    style={{margin: 16}}>{this.props.item.scoreRemark ? this.props.item.scoreRemark : "无评价"}</Text>
                                            </View>
                                        </View>
                                    }
                                })()
                            }

                            <View style={styles.titleContainer}>
                                <Text style={{fontSize: 18, fontWeight: 'bold',}}>协同工作</Text>
                            </View>
                            <View style={[styles.iconContainer, {
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]}>
                                {
                                    (() => {
                                        if ((this.props.item && this.props.item.scStatus === 2 && this.props.memberType.indexOf('0') > -1) &&
                                            (this.props.item && this.props.item.scCreator === App.account)) {
                                            return <TextInput
                                                editable={
                                                    (this.props.item && this.props.item.scStatus === 2 && this.props.memberType.indexOf('0') > -1) &&
                                                    (this.props.item && this.props.item.scCreator === App.account)
                                                    //非本人
                                                }
                                                style={styles.inputStyle}
                                                multiline={true}
                                                placeholder="请填写需要协助的内容"
                                                returnKeyType={'done'}
                                                underlineColorAndroid="transparent"
                                                blurOnSubmit={true}
                                                defaultValue={this.state.helpContent}
                                                onChangeText={(text) => this.setState({
                                                    helpContent: text,
                                                    isShowConfirmMember: true
                                                })}/>
                                        } else {
                                            return <Text
                                                style={{margin: 16}}>{ this.props.item.helpContent ? this.props.item.helpContent : "无内容"}</Text>

                                        }
                                    })()
                                }

                                <View style={{backgroundColor: Color.line, width: width - 64, height: 1}}/>
                                <SwMemberList
                                    disable={(!(this.props.memberType.indexOf("0") > -1)) || this.props.item.scStatus !== 2 || (this.props.item && this.props.item.scCreator !== App.account)}
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
                                                this.setState({
                                                    members: members,
                                                    isShowConfirmMember: true
                                                })
                                            }
                                        });
                                    }}
                                    editFunc={(item, index) => {
                                        this.state.members.splice(index, 1);
                                        this.setState({
                                            members: this.state.members,
                                            isShowConfirmMember: true
                                        })

                                    }}/>
                            </View>
                            {
                                (() => {
                                    if (this.state.isShowConfirmMember) {
                                        return <TouchableOpacity
                                            style={[styles.iconContainer, styles.greenBtnStyle]}
                                            onPress={() => this.updateMember()}>
                                            <Text style={{color: 'white'}}>确认更新人员</Text>
                                        </TouchableOpacity>
                                    }
                                })()
                            }


                            <View style={styles.titleContainer}><Text
                                style={{fontSize: 18, fontWeight: 'bold',}}>处理工作流</Text></View>

                            {//已填写工作
                                (() => {
                                    if (this.props.item.ScheduleFeedbackList.length === 0) {
                                        return ( <View style={styles.emptyText}><Text>还没有添加工作处理</Text></View>)
                                    } else {
                                        return <FlatList
                                            keyExtractor={(item, index) => item.fbId}
                                            data={this.props.item.ScheduleFeedbackList}
                                            renderItem={({item}) =>
                                                <SwFeedbackItem
                                                    data={item}
                                                    host={this.props.item.scCreator}
                                                    galleryFunc={() => {
                                                        this.props.nav.navigate('gallery', {
                                                            pics: item.scImages.split(',')
                                                        });
                                                    }}/>}
                                        />
                                    }
                                })()
                            }

                            {//普通填写
                                (() => {
                                    if (this.props.item.scStatus === 2 &&
                                        this.props.memberType.indexOf('0') > -1 &&
                                        (this.props.item.scMembers.indexOf(App.account) > -1 ||
                                        this.props.item.scCreator.indexOf(App.account) > -1)) {
                                        return <View style={{alignItems: 'center',}}>
                                            <View style={styles.titleContainer}>
                                                <Text style={{fontSize: 18, fontWeight: 'bold',}}>新增处理</Text>
                                            </View>

                                            <View style={[styles.iconContainer, {
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }]}>
                                                <Text style={{margin: 16, color: 'black'}}>工作处理</Text>
                                                <View style={{
                                                    backgroundColor: Color.line,
                                                    height: 1,
                                                    width: width - 64
                                                }}/>
                                                <TextInput
                                                    style={styles.inputStyle}
                                                    multiline={true}
                                                    placeholder="在这里填写"
                                                    returnKeyType={'done'}
                                                    underlineColorAndroid="transparent"
                                                    blurOnSubmit={true}
                                                    onChangeText={(text) => this.setState({feedback: text})}/>
                                            </View>

                                            <View style={[styles.iconContainer, {
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }]}>
                                                <Text style={{margin: 16, color: 'black',}}>附加照片</Text>
                                                <ImageList dataSourcePic={this.state.dataSourcePic} action={(index) => {
                                                    this.state.pics.splice(index, 1);
                                                    this.setState({
                                                        dataSourcePic: this.state.dataSourcePic.cloneWithRows(JSON.parse(JSON.stringify(this.state.pics))),
                                                    });
                                                }}/>
                                                <TouchableOpacity
                                                    style={styles.camStyle}
                                                    onPress={() => {
                                                        ImagePicker.showImagePicker(ImageOptions.options, (response) => {
                                                            if (!response.didCancel) {
                                                                this.state.pics.push(response);
                                                                this.setState({dataSourcePic: this.state.dataSourcePic.cloneWithRows(this.state.pics),});
                                                            }
                                                        });
                                                    }}>
                                                    <Text
                                                        style={{color: Color.colorGreen, textAlign: 'center'}}>拍照</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity
                                                style={[styles.iconContainer, styles.greenBtnStyle]}
                                                onPress={
                                                    () => this.submitContent()
                                                }>
                                                <Text style={{color: 'white'}}>新增工作处理</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                })()
                            }

                            {//审核人评分this.props.memberType.indexOf("2") > -1
                                //2018-9 update:创建人评分n
                                (() => {
                                    if (this.props.item.scCreator === App.account && this.props.item.scStatus === 4) {
                                        return <View style={{alignItems: 'center',}}>
                                            <View style={styles.titleContainer}>
                                                <Text style={{fontSize: 18, fontWeight: 'bold',}}>工作评分</Text>
                                            </View>
                                            <View style={styles.starContainer}>
                                                <StarSeek onSelect={(select) => this.setState({starA: select})}
                                                          defaultStar={0}/>
                                                <Text>{StatusGroup.swStarDesc[this.state.starA]}</Text>
                                                <View style={{backgroundColor: Color.line, height: 1, width: width - 64}}/>
                                                <TextInput
                                                    style={styles.inputStyle}
                                                    multiline={true}
                                                    placeholder="填写评价"
                                                    returnKeyType={'done'}
                                                    underlineColorAndroid="transparent"
                                                    blurOnSubmit={true}
                                                    onChangeText={(text) => this.setState({resultComment: text})}/>
                                            </View>

                                            <TouchableOpacity
                                                style={[styles.iconContainer, styles.greenBtnStyle]}
                                                onPress={
                                                    () => this.setStar()
                                                }>
                                                <Text style={{color: 'white'}}>完成评分</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                })()
                            }
                        </View>
                    </ScrollView>
                    <Loading visible={this.state.isLoading}/>

                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    itemText: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width - 32,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    iconContainer: {
        width: width - 32,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 16,
        elevation: 2,
        overflow: 'hidden'

    },
    titleContainer: {
        borderBottomWidth: 3,
        borderBottomColor: Color.colorGreen,
        margin: 16,
    },
    starContainer: {
        width: width - 32,
        backgroundColor: 'white',
        margin: 16,
        elevation: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    greenBtnStyle: {
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.colorGreen
    },
    camStyle: {
        padding: 16,
        width: width - 64,
        borderTopWidth: 1,
        borderTopColor: Color.line,
    },
    inputStyle: {
        width: width - 64,
        marginRight: 10,
        height: 100,
        textAlign: 'center',
        fontSize: 15
    },
    emptyText: {
        width: width - 32,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 2,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 16
    }

});
