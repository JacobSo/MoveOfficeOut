/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    Alert,
    Button,
    ListView,
    RefreshControl,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions, TouchableOpacity, Image, KeyboardAvoidingView, TextInput,
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import CheckBox from "../../ui/Component/CheckBox";
import ApiService from '../../network/WdApiService';
import Loading from 'react-native-loading-spinner-overlay';
import App from '../../constant/Application';
import Toast from 'react-native-root-toast';
import {WdActions} from "../../actions/WdAction";
import {WdMainItem} from "../Component/WdMainItem";
import {WdProductItem} from "../Component/WdProductItem";
import AndroidModule from '../../module/AndoridCommontModule'
import IosModule from '../../module/IosCommontModule'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
const {width, height} = Dimensions.get('window');
const ImagePicker = require('react-native-image-picker');
const options = {
    title: 'Select Avatar',
    customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
    ],
    quality: 0.2,
    noData: true,
    storageOptions: {
        skipBackup: true,//not icloud
        path: 'images'
    }
};
import SQLite from '../../db/Sqlite';
let sqLite = new SQLite();
class WdPostPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product: this.props.product,
            pics: [],
            submitContent: {},
            submitPic: [],

            isLoading: false,

            isPass: true,
            editContent: '1.',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
        }
    }

    componentDidMount() {
        sqLite.getWdDraftContent(this.props.product.ItemGuid, this.props.step)
            .then((result) => {
                if (result)
                    this.setState({editContent: result.wdq_content.split("|").join("\n∝\n")})
            }).done();
        sqLite.getWdDraftPic(this.props.product.ItemGuid, this.props.step)
            .then((result) => {
                if (result) {
                    console.log(JSON.stringify(result));

                    this.setState({
                        pics: result,
                        dataSource: this.state.dataSource.cloneWithRows(result)
                    });
                    console.log(JSON.stringify(this.state.dataSource));

                }
            }).done()
    }

    componentWillUnmount() {
        //sqLite.close();
    }


    formatString() {
        let temp = this.state.editContent.split('\n').join('');
        temp = temp.split("∝").join("|");
        console.log(temp);
        return temp
    }

    pack() {
        let tempContent = {
            phaseCode: this.props.step,
            pGuid: this.props.product.ItemGuid,
            pResult: this.state.isPass ? 1 : 0,
            productProblems: this.formatString(),
        };

        let tempPics = [];
        this.state.pics.map((data) => {
            tempPics.push({
                fileName: data.fileName,
                phaseCode: this.props.step,
                paraGuid: this.props.product.ItemGuid,
                path: data.path
            });
        });
        this.state.submitContent = tempContent;
        this.state.submitPic = tempPics;
    }

    confirmDialog() {
        Alert.alert(
            '确认上传',
            '是否提交，包含图片共' + this.state.submitPic.length + "张",
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.postText();
                }
                },
            ]
        )
    }

    postText() {
        this.setState({isLoading: true});
        let content = [];
        content.push(this.state.submitContent);
        ApiService.submitProduct(JSON.stringify(content))
            .then((responseJson) => {
                if (!responseJson.IsErr) {


                    if (this.state.submitPic.length !== 0)
                        this.postImage();
                    else {
                        this.updateStatus();
                        Toast.show("提交成功");
                        this.props.nav.goBack(null)

                    }
                } else {
                    Toast.show(responseJson.ErrDesc);
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
            })
            .catch((error) => {
                console.log(error);
                Toast.show("出错了，请稍后再试");
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            }).done();
    }

    postImage() {
        this.state.submitPic.map((data, index) => {
            AndroidModule.getImageBase64(data.path, (callBackData) => {
                data.imgCode = callBackData;
                let imageData = [];
                imageData.push(data);
                ApiService.postImg(JSON.stringify(imageData))
                    .then((responseJson) => {
                        console.log(JSON.stringify(responseJson));
                        if (!responseJson.IsErr) {
                            if (index === this.state.submitPic.length - 1) {
                                Toast.show("提交成功");
                                this.updateStatus();
                                this.props.nav.goBack(null)
                            }
                        } else {
                            Toast.show(responseJson.ErrDesc);
                            if (index === this.state.submitPic.length - 1) {
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        Toast.show("出错了，请稍后再试");
                        if (index === this.state.submitPic.length - 1) {
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                        }
                    }).done();
            });

        })

    }

    updateStatus() {
        let result = this.props.step + "-" + (this.state.isPass ? 1 : 0);

        this.state.product.pStatus = this.props.step;
        this.state.product.pStatusPass = this.state.isPass;

        if (!this.state.product.pResultList) {
            this.state.product.pResultList = result;
        } else if (this.state.product.pResultList.indexOf(this.props.step + "-0") > -1) {
            this.state.product.pResultList = this.state.product.pResultList.replace(this.props.step + "-0", result)
        } else if (this.state.product.pResultList.indexOf(this.props.step + "-1") > -1) {
            console.log('3:' + this.state.product.pResultList)
            this.state.product.pResultList = this.state.product.pResultList.replace(this.props.step + "-1", result)
            console.log('3:' + this.state.product.pResultList)
        } else {
            this.state.product.pResultList += result;
        }

        let tempPicsPath = [];
        this.state.pics.map((data) => {
            tempPicsPath.push(data.path);
        });

        if (this.props.step === 0) {
            this.state.product.pStatusResultA = this.formatString();
            this.state.product.pStatusPicA = tempPicsPath;
        } else if (this.props.step === 1) {
            this.state.product.pStatusResultB = this.formatString();
            this.state.product.pStatusPicB = tempPicsPath;
        } else if (this.props.step === 2) {
            this.state.product.pStatusResultC = this.formatString();
            this.state.product.pStatusPicC = tempPicsPath;
        }


        // console.log(result)
        ///  console.log(this.state.product.pResultList)
            sqLite.updateProductStatus(this.state.submitContent,tempPicsPath,this.state.product.pResultList );
        this.props.actions.updateProduct(JSON.parse(JSON.stringify(this.state.product)), this.props.position);
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: "white",

            }}>
                <Toolbar
                    elevation={0}
                    title={[this.props.title]}
                    color={Color.colorDeepOrange}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={["保存", "提交"]}
                    functionArray={[
                        () => this.props.nav.goBack(null),
                        () => {
                            this.pack();
                            sqLite.insertWdDraft(this.state.submitContent, this.state.submitPic)
                                .then((result) => Toast.show(result)).done();

                        },
                        () => {
                            this.pack();
                            this.confirmDialog();
                        },
                    ]}
                />
                <KeyboardAvoidingView behavior={'padding'}>
                    <ScrollView>
                        <View>
                            <TextInput style={styles.textInput}
                                       placeholder="请输入评审内容"
                                       defaultValue={this.state.editContent}
                                       multiline={true}
                                       returnKeyType={'done'}
                                       autoFocus={true}
                                       blurOnSubmit={true}
                                       underlineColorAndroid="transparent"
                                       onChangeText={(text) => this.setState({editContent: text})}/>
                            <View style={{flexDirection: 'row', padding: 5}}>
                                <TouchableOpacity style={{flex: 1, height: 25, alignItems: 'center'}} onPress={() => {
                                    ImagePicker.launchCamera(options, (response) => {
                                        //   console.log(JSON.stringify(response));
                                        if (!response.didCancel) {
                                            this.state.pics.push(response);
                                            this.setState({dataSource: this.state.dataSource.cloneWithRows(this.state.pics),});
                                            console.log(JSON.stringify(this.state.pics));
                                        }
                                    });

                                }}>
                                    <Image
                                        resizeMode="contain"
                                        style={{height: 25}}
                                        source={require('../../drawable/post_cam.png')}
                                    /></TouchableOpacity>
                                <TouchableOpacity style={{flex: 1, height: 25, alignItems: 'center'}} onPress={() => {
                                    ImagePicker.launchImageLibrary(options, (response) => {
                                        console.log(JSON.stringify(response));
                                        if (!response.didCancel) {
                                            this.state.pics.push({fileName: response.fileName, path: response.path});
                                            this.setState({dataSource: this.state.dataSource.cloneWithRows(this.state.pics),});
                                            console.log(JSON.stringify(this.state.pics));
                                        }
                                    });
                                }}>
                                    <Image
                                        resizeMode="contain"
                                        style={{height: 25,}}
                                        source={require('../../drawable/post_gallery.png')}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity style={{flex: 1, height: 25, alignItems: 'center'}} onPress={() => {
                                    let temp = this.state.editContent.split("∝");
                                    this.setState({
                                        editContent: (this.state.editContent += ("\n∝\n" + (temp.length + 1) + "."))
                                    })


                                }}>
                                    <Image
                                        resizeMode="contain"
                                        style={{height: 25,}}
                                        source={require('../../drawable/add_grey.png')}
                                    />
                                </TouchableOpacity>

                            </View>
                            <View style={{height: 1, width: width, backgroundColor: Color.line}}/>
                            <CheckBox
                                style={{padding: 10}}
                                isChecked={this.state.isPass}
                                onClick={() => this.setState({isPass: !this.state.isPass})}
                                rightText={'通过评审'}/>

                            <ListView
                                dataSource={this.state.dataSource}
                                removeClippedSubviews={false}
                                enableEmptySections={true}
                                renderRow={(rowData, rowID, sectionID) =>
                                    <View >
                                        <TouchableOpacity
                                            style={{position: 'absolute', right: 16,}}
                                            onPress={() => {
                                                //  console.log(rowID + ":" + sectionID);
                                                this.state.pics.splice(sectionID, 1);
                                                console.log("delete:" + JSON.stringify(this.state.pics));
                                                this.setState(
                                                    {
                                                        dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.pics))),
                                                    });
                                                //   console.log(JSON.stringify(this.state.dataSource))
                                            }}>
                                            <Image
                                                resizeMode="contain"
                                                style={{height: 25, width: 25,}}
                                                source={require('../../drawable/close_post_label.png')}/>
                                        </TouchableOpacity>
                                        <Image
                                            resizeMode="contain"
                                            style={{height: 200, margin: 16}}
                                            source={{uri: 'file:/' + rowData.path}}/></View>
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
    textStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: width - 32,
        marginRight: 16,
        marginLeft: 16,
        marginTop: 16,

    },
    iconCircle: {
        width: 150,
        height: 55,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        margin: 16
    },
    textInput: {
        width: width,
        height: 200,
        borderColor: Color.line,
        borderBottomWidth: 1,
        textAlign: "left",
        textAlignVertical: "top"
    },
});
const mapStateToProps = (state) => {
    return {
        product: state.wdStore.product,
        position: state.wdStore.position
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(WdActions, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(WdPostPager);