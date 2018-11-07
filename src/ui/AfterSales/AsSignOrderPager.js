'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ListView,
    Platform
} from 'react-native';
import AndroidModule from '../../module/AndoridCommontModule'
import IosModule from '../../module/IosCommontModule'
import Color from '../../constant/Color';
import SnackBar from 'react-native-snackbar-dialog'
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import ApiService from '../../network/AsApiService';
import {AsProductEditor} from "../Component/AsProductEditor";
import {CachedImage} from "react-native-img-cache";
import InputDialog from "../Component/InputDialog";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

const ImagePicker = require('react-native-image-picker');
const options = {
    quality: 0.2,
    noData: true,
    cancelButtonTitle: "取消",
    title: "图片来源",
    takePhotoButtonTitle: "相机",
    chooseFromLibraryButtonTitle: "本地图片",
    storageOptions: {
        skipBackup: true,//not icloud
        path: 'images'
    }
};
export default class AsSignOrderPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isDetail: false,
            isEdit: false,
            isModify: false,
            isProduct: false,
            modifyPosition: 0,
            pics: [],
            dataSourcePic: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            dataSourceComment: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            dataSourceProduct: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),

            editContent: '',
            rejectContent: '',

            productList: this.props.order ? this.props.order.abnormal_porducts : [],
            submitForm: null,
            editList: this.props.order ? this.pureEditData() : [],
            productUpdateFlag: '',
            remark: '',

            image: []
        }
    }
    //constant pic merge
    componentWillMount() {
        let tempPic=[];
        if (this.props.order && this.props.order.pic_attachment.length !== 0) {
            tempPic = this.props.order.pic_attachment;
        }
        if (this.props.order && this.props.order.attachment ) {
            let tempAtt = this.props.order.attachment.split(',');
            tempAtt.map((data)=>{
                if(['jpg','gif','png','jpeg','bmp'].indexOf(data.substring(data.lastIndexOf('.')+1).toLowerCase())>-1)
                    tempPic.push("http://lsprt.lsmuyprt.com:5050/api/v1/afterservice/download/"+data)
            })
        }
        this.state.image = tempPic

    }
    componentDidMount() {
        this.setState({
            dataSourceComment: this.state.dataSourceComment.cloneWithRows(this.state.editList),
            dataSourceProduct: this.state.dataSourceProduct.cloneWithRows(this.state.productList)
        })
    }

    pureEditData() {
        let temp = [];
        this.props.order.tracks.map((data) => {
            temp.push(data.remark)
        });
        return temp;
    }

    acceptOrder(status) {
        Alert.alert(
            status + "单据",
            "确认" + status + "处理该单据？",
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.submitOrderSimple(this.props.order.id, status === "锁定" ? "done" : "reject")
                        .then((responseJson) => {
                            if (responseJson.status === 0) {
                                SnackBar.show('操作成功');
                                this.props.refreshFunc();
                                this.props.nav.goBack(null);
                            } else {
                                SnackBar.show(responseJson.message);
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            SnackBar.show("出错了，请稍后再试");
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                        }).done();
                }
                },
            ]
        );
    }

    submitOrder() {
        Alert.alert(
            '提交',
            '确认填写无误，提交后不可更改',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    if (this.state.pics.length !== 0) {
                        SnackBar.show('开始上传图片');
                        this.postImage();
                    } else {
                        this.submitContent();
                    }
                }
                },
            ]
        );
    }

    submitContent() {
        let temp = [];
        this.state.editList.map((data) => temp.push({remark: data}));
        ApiService.submitOrder(this.props.order.id, this.state.productList, this.state.submitForm, temp)
            .then((responseJson) => {
                if (responseJson.status === 0) {
                    SnackBar.show('操作成功');
                    this.props.refreshFunc();
                    this.props.nav.goBack(null);
                } else {
                    SnackBar.show(responseJson.message);
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            }).done();
    }

    rejectOrder() {
        if (!this.state.rejectContent) {
            SnackBar.show("一定要填写驳回原因");
            return
        }
        ApiService.rejectOrder(this.props.order.id, this.state.rejectContent)
            .then((responseJson) => {
                if (responseJson.status === 0) {
                    SnackBar.show('操作成功');
                    this.props.refreshFunc();
                    this.props.nav.goBack(null);
                } else {
                    SnackBar.show(responseJson.message);
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            }).done();
    }

    rejectDialog() {
        return <InputDialog
            isMulti={false}
            action={[
                (popupDialog) => {
                    this.popupDialog = popupDialog;
                },
                (text) => {
                    this.setState({rejectContent: text})
                },
                () => {//dismiss
                    this.setState({rejectContent: ''});
                    this.popupDialog.dismiss();
                },
                () => {
                    this.rejectOrder();
                    this.popupDialog.dismiss();
                }
            ]} str={['驳回原因', '备注驳回原因，必填']}/>
    }

    postImage() {
        if (Platform.OS === 'android') {
            this.state.pics.map((data, index) => {
                AndroidModule.getImageBase64(data.uri.replace('file://', ''), (callBackData) => {
                    console.log(data.uri + "," + callBackData);
                    this.postImageReq(data, index, callBackData);
                });
            })
        } else {
            this.state.pics.map((data, index) => {
                IosModule.getImageBase64(data.uri.replace('file://', ''), (callBackData) => {
                    this.postImageReq(data, index, callBackData);
                });
            })
        }
    }

    postImageReq(data, index, callBackData) {
        ApiService.uploadImage(this.props.order.id, data.uri.substring(data.uri.lastIndexOf('/'), data.uri.length), callBackData)
            .then((responseJson) => {
                if (responseJson.status === 0) {
                    if (index === this.state.pics.length - 1)
                        this.submitContent();
                } else {
                    SnackBar.show(responseJson.message, {duration: 3000});
                    if (index === this.state.pics.length - 1) {
                        setTimeout(() => {
                            this.setState({isLoading: false})
                        }, 100);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 3000});
                if (index === this.state.pics.length - 1) {
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
            }).done();
    }

    checkProductComment() {
        let flag = true;
        this.state.productList.map((data) => {
            if (!data.remark) {
                flag = false
            }
        });
        return flag;
    }

    onDetail() {
        if (this.state.isDetail || this.props.order.status === "waitting") {
            return (
                <View style={styles.detailMain}>
                    <View>
                        <View style={styles.detailContainer}>
                            <Text >单据编号</Text>
                            <Text style={styles.detailText}>{this.props.order.serial_number}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text>单据类型</Text>
                            <Text style={styles.detailText}>{this.props.order.type}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text>建单日期</Text>
                            <Text style={styles.detailText}>{this.props.order.created_at}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text>建单人</Text>
                            <Text style={styles.detailText}>{this.props.order.creater_name}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text>发起方</Text>
                            <Text style={styles.detailText}>{this.props.order.accuser_name}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text>客户</Text>
                            <Text style={styles.detailText}>{this.props.order.customer_name}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text>物料编码</Text>
                            <Text style={styles.detailText}>{this.props.order.material_number}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text>售后专员</Text>
                            <Text style={styles.detailText}>{this.props.order.saler}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text>异常描述</Text>
                            <Text style={styles.detailText}>{this.props.order.remark}</Text>
                        </View>

                        <ListView
                            ref="scrollView"
                            dataSource={new ListView.DataSource({rowHasChanged: (row1, row2) => true,}).cloneWithRows( this.state.image)}
                            removeClippedSubviews={false}
                            enableEmptySections={true}
                            contentContainerStyle={{
                                flexDirection: 'row', flexWrap: 'wrap',
                            }}
                            renderRow={(rowData, sectionID, rowID) =>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.nav.navigate("gallery", {
                                            pics:  this.state.image
                                        })
                                    }}>
                                    <CachedImage
                                        resizeMode="contain"
                                        style={{width: 80, height: 80, margin: 16}}
                                        source={{uri: rowData}}/>
                                </TouchableOpacity>
                            }/>
                        <TouchableOpacity style={{width: width - 32, alignItems: "center"}}
                                          onPress={() => this.setState({isDetail: false})}>
                            <Text style={{margin: 10, color: Color.colorAmber}}>收起</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            )
        }
    }

    onEdit() {
        if (this.state.isEdit)
            return (<View style={{alignItems: 'center'}}>
                {
                    (() => {
                        if (this.state.editList.length !== 0)
                            return <View style={{backgroundColor: Color.line, width: width - 32, height: 1}}/>
                    })()
                }
                <ListView
                    dataSource={this.state.dataSourceComment}
                    style={{marginLeft: 16, marginRight: 16, width: width - 32}}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    renderRow={(rowData, sectionID, rowID) =>
                        this.getEditItem(rowData, rowID)
                    }/>
                <View style={{margin: 16, paddingBottom: 16}}>
                    <TextInput style={styles.textInput}
                               multiline={true}
                               defaultValue={this.state.editContent}
                               placeholder="在这里填写跟进情况"
                               returnKeyType={'done'}
                               underlineColorAndroid="transparent"
                               blurOnSubmit={true}
                               onChangeText={(text) => this.setState({editContent: text})}/>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={{
                                alignItems: "center",
                                backgroundColor: 'white',
                                flex: 1,
                                borderColor: Color.line,
                                borderTopWidth: 1,
                            }}
                            onPress={() => this.setState({isEdit: false})}>
                            <Text style={{margin: 10,}}>收起</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{alignItems: "center", backgroundColor: Color.colorAmber, flex: 1}}
                            onPress={() => {
                                if (this.state.editContent) {
                                    if (this.state.isModify)
                                        this.state.editList[this.state.modifyPosition] = this.state.editContent;
                                    else
                                        this.state.editList.push(this.state.editContent);
                                    this.setState({
                                        dataSourceComment: this.state.dataSourceComment.cloneWithRows(this.state.editList),
                                        editContent: '',
                                        isModify: false,
                                    })
                                }
                            }}>
                            <Text style={{margin: 10, color: "white"}}>{this.state.isModify ? '修改' : '新增描述'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>)
    }

    getEditItem(rowData, rowID) {
        return <View style={styles.editItemContainer}>
            <TouchableOpacity
                style={{
                    backgroundColor: this.state.isModify && this.state.modifyPosition === rowID ? Color.line : 'white',
                    padding: 10,
                    width: width - 64 - 32
                }}
                onPress={
                    () => {
                        this.setState({
                            modifyPosition: rowID,
                            isModify: !this.state.isModify,
                            editContent: this.state.isModify ? '' : rowData,//last status not update to date
                        })
                    }
                }>
                <Text style={{color: Color.colorAmber}}>{'第' + (Number(rowID) + 1) + '条跟进描述'}</Text>
                <Text>{rowData}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{padding: 16}}
                onPress={() => {
                    this.state.editList.splice(rowID, 1);
                    this.setState({
                        dataSourceComment: this.state.dataSourceComment.cloneWithRows(this.state.editList)
                    })
                }}>
                <Image source={require('../../drawable/close_post_label.png')}
                       style={{width: 25, height: 25}}/>
            </TouchableOpacity>
        </View>
    }

    onProduct() {
        if (this.state.isProduct)
            return <View style={[styles.detailMain, {marginTop: 0, elevation: 0}]}>
                <View>
                    {
                        (() => {
                            if (this.state.productList.length === 0) {
                                return <Text style={{width: width - 64, textAlign: 'center', margin: 16}}>没有数据</Text>
                            } else {
                                return <ListView
                                    dataSource={this.state.dataSourceProduct}
                                    style={{marginLeft: 16, marginRight: 16, width: width - 32}}
                                    removeClippedSubviews={false}
                                    enableEmptySections={true}
                                    renderRow={(rowData, sectionID, rowID) =>
                                        <AsProductEditor
                                            product={rowData}
                                            saveFunc={(editData, pic) => {
                                                rowData.remark = editData;
                                                rowData.pic = pic;
                                                this.setState({productUpdateFlag: editData})
                                            }}
                                            deleteFunc={() => {
                                                this.state.productList.splice(rowID, 1);
                                                this.setState({dataSourceProduct: this.state.dataSourceProduct.cloneWithRows(this.state.productList)})
                                            }
                                            }
                                        />
                                    }/>
                            }
                        })()
                    }
                    <View style={styles.productBottomButtonContainer}>
                        <TouchableOpacity
                            onPress={() => this.setState({isProduct: false})}>
                            <Text style={{margin: 16, color: Color.content}}>收起</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.nav.navigate('asProduct', {
                            selectFunc: (data) => {
                                // console.log(data);
                                if (this.state.productList.length !== 0) {
                                    let isExist = false;
                                    data.map((newData) => {
                                        this.state.productList.map((existData) => {
                                            // console.log(existData.id + "--" + newData.id)
                                            if (existData.id === newData.id) {
                                                isExist = true;
                                            }
                                        });
                                        if (!isExist) {
                                            this.state.productList.push(newData);
                                            //  console.log("push : " + JSON.stringify(newData));
                                        }

                                    });
                                } else {
                                    this.state.productList = JSON.parse(JSON.stringify(data));
                                }
                                this.setState({dataSourceProduct: this.state.dataSourceProduct.cloneWithRows(this.state.productList)});
                            }
                        })}>
                            <Text style={{margin: 16, color: Color.colorAmber}}>添加</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-55}>
                <View style={{backgroundColor: Color.background, height: height, paddingBottom: 25}}>
                    <Toolbar title={['单据跟踪']}
                             color={Color.colorAmber}
                             elevation={2}
                             isHomeUp={true}
                             isAction={true}
                             isActionByText={true}
                             actionArray={[this.props.order.reject_reason ? "驳回内容" : null]}
                             functionArray={[
                                 () => this.props.nav.goBack(null),
                                 () => {
                                     this.props.nav.navigate("asDetail", {
                                         isReject: true,
                                         order: this.props.order,
                                         refreshFunc: () => {
                                         },
                                     })
                                 }
                             ]}/>

                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>
                        <View style={{
                            backgroundColor: Color.background, flexDirection: 'column',
                        }}>
                            <TouchableOpacity
                                style={[styles.detailTouch, {
                                    borderBottomWidth: 1,
                                    borderColor: Color.line,
                                    paddingBottom: 16
                                }]}
                                onPress={() => this.setState({isDetail: !this.state.isDetail})}>
                                <Text>单据编号</Text>
                                <View style={{flexDirection: "row", alignItems: 'center', height: 20}}>
                                    <Text style={{color: Color.content}}>详细</Text>
                                    <Image source={require("../../drawable/info_icon.png")}
                                           style={{width: 15, height: 15, marginLeft: 10}}/>
                                </View>
                            </TouchableOpacity>
                            {
                                this.onDetail()
                            }

                            {
                                (() => {
                                    if (this.props.order.status !== 'waitting') {
                                        return <View>
                                            {/*产品列表*/}
                                            <TouchableOpacity
                                                style={styles.card}
                                                onPress={() => this.setState({isProduct: !this.state.isProduct})}>
                                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                                    <View style={{
                                                        backgroundColor: this.state.productList.length === 0 || !this.checkProductComment() ? Color.line : Color.colorAmber,
                                                        width: 10,
                                                        height: 55
                                                    }}/>
                                                    <Text style={{marginLeft: 16}}>产品列表</Text>
                                                </View>
                                                <View style={{flexDirection: 'row'}}>
                                                    <Text>{this.state.productList.length}</Text>
                                                    <Image source={require("../../drawable/arrow.png")}
                                                           style={styles.arrowStyle}/>
                                                </View>
                                            </TouchableOpacity>
                                            {
                                                this.onProduct()
                                            }

                                            {/*责任单*/}
                                            <TouchableOpacity
                                                style={styles.card}
                                                onPress={() => this.props.nav.navigate('asForm', {
                                                    formData: this.state.submitForm,
                                                    finishFunc: (data) => {
                                                        this.setState({submitForm: data});
                                                    }
                                                })}>
                                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                                    <View style={{
                                                        backgroundColor: this.state.submitForm ? Color.colorAmber : Color.line,
                                                        width: 10,
                                                        height: 55
                                                    }}/>
                                                    <Text style={{marginLeft: 16}}>责任单</Text>
                                                </View>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Text>{this.state.submitForm ? '已填写' : '未填写'}</Text>
                                                    <Image source={require("../../drawable/arrow.png")}
                                                           style={styles.arrowStyle}/>
                                                </View>

                                            </TouchableOpacity>
                                            {/*跟进进度*/}
                                            <TouchableOpacity
                                                style={styles.card}
                                                onPress={() => this.setState({isEdit: !this.state.isEdit})}>
                                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                                    <View style={{
                                                        backgroundColor: this.state.editList.length === 0 ? Color.line : Color.colorAmber,
                                                        width: 10,
                                                        height: 55
                                                    }}/>
                                                    <Text style={{marginLeft: 16}}>跟进进度</Text>
                                                </View>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Text>{this.state.editList.length}</Text>
                                                    <Image source={require("../../drawable/arrow.png")}
                                                           style={styles.arrowStyle}/>
                                                </View>
                                            </TouchableOpacity>
                                            {
                                                this.onEdit()
                                            }

                                            <TouchableOpacity
                                                style={styles.card}
                                                onPress={() => {
                                                    ImagePicker.showImagePicker(options, (response) => {
                                                        if (!response.didCancel) {
                                                            this.state.pics.push(response);
                                                            this.setState({dataSourcePic: this.state.dataSourcePic.cloneWithRows(this.state.pics),});
                                                        }
                                                    });
                                                }}>
                                                <View style={{flexDirection: 'row', alignItems: "center",}}>
                                                    <View style={{
                                                        backgroundColor: this.state.pics.length === 0 ? Color.line : Color.colorAmber,
                                                        width: 10,
                                                        height: 55
                                                    }}/>
                                                    <Text style={{marginLeft: 16}}>添加图片</Text>
                                                </View>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Text>{this.state.pics.length}</Text>
                                                    <Image source={require("../../drawable/arrow.png")}
                                                           style={styles.arrowStyle}/>
                                                </View>
                                            </TouchableOpacity>

                                            <ListView
                                                dataSource={this.state.dataSourcePic}
                                                style={{marginTop: 16}}
                                                removeClippedSubviews={false}
                                                enableEmptySections={true}
                                                renderRow={(rowData, rowID, sectionID) =>
                                                    <View >
                                                        <Image
                                                            resizeMode="contain"
                                                            style={{height: 200, margin: 16, width: width - 32}}
                                                            source={{uri: rowData.uri}}/>
                                                        <TouchableOpacity
                                                            style={{position: 'absolute', right: 24,}}
                                                            onPress={() => {
                                                                //  console.log(rowID + ":" + sectionID);
                                                                this.state.pics.splice(sectionID, 1);
                                                                // console.log("delete:" + JSON.stringify(this.state.pics));
                                                                this.setState({
                                                                    dataSourcePic: this.state.dataSourcePic.cloneWithRows(JSON.parse(JSON.stringify(this.state.pics))),
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

                                            <TouchableOpacity
                                                onPress={() => this.submitOrder()}
                                                disabled={!(this.state.submitForm && this.checkProductComment())}>
                                                <View style={[styles.button, {
                                                    backgroundColor: (this.state.submitForm && this.checkProductComment()) ?
                                                        Color.colorAmber : Color.line
                                                }]}>
                                                    <Text style={{color: 'white'}}>{"提交"}</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.button, {backgroundColor: 'white'}]}
                                                              onPress={() => {
                                                                  this.acceptOrder("解锁")
                                                              }}>
                                                <Text>{"解锁"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    } else return <View><TouchableOpacity
                                        onPress={() => this.acceptOrder("锁定")}>
                                        <View style={[styles.button,
                                            {backgroundColor: Color.colorAmber}]}>
                                            <Text style={{color: 'white'}}>{"锁定"}</Text>
                                        </View>
                                    </TouchableOpacity>
                                        <TouchableOpacity style={[styles.button, {backgroundColor: 'white'}]}
                                                          onPress={() => {
                                                              this.popupDialog.show()
                                                          }}>
                                            <Text>{"驳回"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                })()
                            }


                        </View>
                    </ScrollView>

                    <Loading visible={this.state.isLoading}/>
                    {this.rejectDialog()}
                </View>
            </KeyboardAvoidingView>
        )
    }
}
const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        height: 55,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        marginLeft: 16,
        marginRight: 16,
        marginTop: 16,
        elevation: 2,
    },
    button: {
        width: width - 32,
        height: 55,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        borderRadius:10

    },
    textInput: {
        width: width - 32,
        height: 65,
        padding: 5,
        backgroundColor: "white",
    },
    detailText: {
        color: Color.drawerColor
        , width: 200,
        textAlign: 'right'
    },
    detailContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
        borderRadius:10
    },
    detailTouch: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: 'center',
        margin: 16
    },
    detailMain: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        marginLeft: 16,
        marginRight: 16,
        marginTop: 16,
        elevation: 2,
    },
    editItemContainer: {
        flexDirection: 'row',
        width: width - 32,
        height: 100,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    buttonContainer: {
        width: width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 2
    },

    productBottomButtonContainer: {
        width: width - 32,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        marginTop: 16,
        borderColor: Color.line
    },
    arrowStyle: {
        width: 10,
        height: 20,
        marginRight: 10,
        marginLeft: 10
    }

});