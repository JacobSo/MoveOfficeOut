/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions, TouchableOpacity, Image, ListView,
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import Toast from 'react-native-root-toast';
import {WdActions} from "../../actions/WdAction";

import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {CachedImage} from "react-native-img-cache";

const {width, height} = Dimensions.get('window');
const ImagePicker = require('react-native-image-picker');
const options = {
    title: "工厂图片",
    takePhotoButtonTitle: "拍照",
    chooseFromLibraryButtonTitle: "选择照片",
    quality: 0.2,
    noData: true,
    storageOptions: {
        skipBackup: true,//not icloud
        path: 'images'
    }
};
export default class WpProductDetailPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            select: this.props.product.selectStep ? this.props.product.selectStep : [false, false, false],
            myProduct: this.props.product,
            pics: this.props.product.pics ? this.props.product.pics : [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
        }
    }

    componentDidMount() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.pics))),
        });
    }

    componentWillReceiveProps(newProps) {
        console.log(JSON.stringify(newProps) + '-------------------------')
        this.setStatus();
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: "white",
            }}>
                <Toolbar
                    elevation={2}
                    title={["产品详情"]}
                    color={Color.colorPurple}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={["删除", "完成"]}
                    functionArray={[
                        () => this.props.nav.goBack(null),
                        () => {
                            this.props.delFunc();
                            this.props.nav.goBack(null);
                        },
                        () => {
                            this.state.myProduct.selectStep = this.state.select;
                            this.state.myProduct.pics = this.state.pics;
                            this.props.finishFunc(this.state.myProduct);
                            this.props.nav.goBack(null);
                        }]}
                />
                <ScrollView><View style={{alignItems: "center", marginBottom: 16}}>
                    <View style={{width: width, height: 150, backgroundColor: Color.line}}>
                        <CachedImage
                            resizeMode="contain"
                            style={{width: width, height: 150,}}
                            source={{uri: this.props.product.PicPath}}/>
                    </View>

                    <View style={styles.textStyle}>
                        <Text >名称</Text>
                        <Text >{this.props.product.ItemName}</Text>
                    </View>

                    <View style={styles.textStyle}>
                        <Text >描述</Text>
                        <Text style={{width: 200, textAlign: 'right'}}>{this.props.product.ItemRemark}</Text>
                    </View>
                    <View style={styles.textStyle}>
                        <Text >申请评审阶段</Text>
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "space-between", margin: 10}}>
                        <TouchableOpacity
                            style={[styles.stepButton, {backgroundColor: (this.state.select[0] ? Color.colorPurple : Color.line)},]}
                            onPress={() => {
                                this.state.select[0] = !this.state.select[0];
                                this.setState({select: this.state.select})
                            }}>
                            <Text style={{color: "white", textAlign: "center"}}>白胚</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.stepButton, {backgroundColor: (this.state.select[1] ? Color.colorPurple : Color.line)},]}
                            onPress={() => {
                                this.state.select[1] = !this.state.select[1];
                                this.setState({select: this.state.select})
                            } }>
                            <Text style={{color: "white", textAlign: "center"}}>成品</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.stepButton, {backgroundColor: (this.state.select[2] ? Color.colorPurple : Color.line)},]}
                            onPress={() => {
                                this.state.select[2] = !this.state.select[2];
                                this.setState({select: this.state.select})
                            }}>
                            <Text style={{color: "white", textAlign: "center"}}>包装</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: width, height: 1, backgroundColor: Color.line}}/>
                    <View style={styles.textStyle}>
                        <Text>工厂图片</Text>
                        <TouchableOpacity onPress={() => {
                            ImagePicker.showImagePicker(options, (response) => {
                                if (!response.didCancel) {
                                    this.state.pics.push(response);
                                    this.setState({dataSource: this.state.dataSource.cloneWithRows(this.state.pics),});
                                    console.log(JSON.stringify(this.state.pics));
                                }
                            });
                        }}>
                            <Image
                                resizeMode="contain"
                                style={{height: 25, width: 25}}
                                source={require('../../drawable/post_cam.png')}
                            /></TouchableOpacity>
                    </View>
                    <ListView
                        style={{width: width}}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        enableEmptySections={true}
                        renderRow={(rowData, rowID, sectionID) =>
                            <View style={{margin: 16}}>
                                <TouchableOpacity
                                    style={{position: 'absolute', right: 16,}}
                                    onPress={() => {
                                        //  console.log(rowID + ":" + sectionID);
                                        this.state.pics.splice(sectionID, 1);
                                        console.log("delete:" + JSON.stringify(this.state.pics));
                                        this.setState({
                                            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.pics))),
                                        });
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
    mainButton: {
        width: 150,
        height: 55,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        margin: 16
    },
    layoutContainer: {
        width: width - 32,
        height: 100,
        backgroundColor: 'white'
    },
    stepButton: {
        flex: 1,
        margin: 8,
        justifyContent: "center",
        padding: 10,
        borderRadius: 10
    }
});
