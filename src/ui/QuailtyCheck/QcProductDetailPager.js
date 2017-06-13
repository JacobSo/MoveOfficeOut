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
import SnackBar from 'react-native-snackbar-dialog'
import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import Drawer from 'react-native-drawer'
import {CachedImage} from "react-native-img-cache";
import RNFetchBlob from "react-native-fetch-blob";
import AndroidModule from '../../module/AndoridCommontModule'
import Loading from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
const drawerStyles = {
    main: {backgroundColor: 'black', shadowColor: "black", shadowOpacity: 0.8, shadowRadius: 3},
};
let dirs = RNFetchBlob.fs.dirs;
export default  class QcProductDetailPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading:false,
            improveFile: this.props.product.improveFiles,
            dataSourceI: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            aFiles: this.props.product.materialFiles,
            dataSourceA: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            bFiles: this.props.product.techFiles,
            dataSourceB: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            cFiles: this.props.product.proFiles,
            dataSourceC: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }

    componentDidMount() {
        this.setState({
            dataSourceI: this.state.dataSourceI.cloneWithRows(this.state.improveFile),
            dataSourceA: this.state.dataSourceI.cloneWithRows(this.state.aFiles),
            dataSourceB: this.state.dataSourceI.cloneWithRows(this.state.bFiles),
            dataSourceC: this.state.dataSourceI.cloneWithRows(this.state.cFiles),
        })

    }

    getStatus(flag) {
        if (this.props.product.state && this.props.product.state.length === 3) {
            if (this.props.product.state.substring(flag - 1, flag) === "1")
                return 1;
            else
                return 0;
        } else return 0;

    }

    closeControlPanel = () => {
        this._drawer.close()
    };

    openControlPanel = () => {
        this._drawer.open()
    };

    getFileList(dataSource) {
        return <ListView
            horizontal={false}
            dataSource={dataSource}
            enableEmptySections={true}
            removeClippedSubviews={false}
            renderRow={(rowData, rowID, sectionID) =>
                <TouchableOpacity style={{flexDirection: 'row', margin: 5}} onPress={() => {
                    this.downloadFile(rowData)
                }}>
                    <Image style={{width: 25, height: 25,}} source={this.getImage(rowData)}/>
                    <Text style={{
                        width: width / 2,
                        marginLeft: 10
                    }}>{rowData.substring(rowData.lastIndexOf('/') + 1, rowData.length)}</Text>
                </TouchableOpacity>
            }/>
    }


    getImage(rowData) {
        if (rowData.indexOf('.pdf') > -1)
            return require('../../drawable/pdf_img.png');
        else if (rowData.indexOf('.doc') > -1 || rowData.indexOf('.docx') > -1)
            return require('../../drawable/word_img.png');
        else if (rowData.indexOf('.xls') > -1 || rowData.indexOf('.xlsx') > -1)
            return require('../../drawable/excel_img.png');
        else
            return require('../../drawable/file_img.png')
    }

    downloadFile(url) {
        let filePath = dirs.DocumentDir + '/' + url.substring(url.lastIndexOf('/') + 1, url.length);
        if (!RNFetchBlob.fs.exists(filePath)) {
            this.setState({isLoading:true});
            RNFetchBlob
                .config({
                    fileCache: false,
                    path: filePath
                })
                .fetch('GET', url, {})
                .progress({count: 10}, (received, total) => {
                    console.log('progress', received / total)
                })
                .then((res) => {
                    console.log('The file saved to ', res.path());
                    this.setState({isLoading:false});
                    AndroidModule.openOfficeFile(res.path());
                })

        } else {
            AndroidModule.openOfficeFile(filePath);
        }


    }


    drawerLayout() {
        return (
            <View style={{flex: 1, backgroundColor: "white",}}>
                <ScrollView style={{margin: 16}}>
                    <Text style={{color: Color.black_semi_transparent}}>改善方案</Text>
                    {
                        this.getFileList(this.state.dataSourceI)
                    }
                </ScrollView>
                <View style={{width: width * 0.8, height: 1, backgroundColor: Color.line}}/>
                <ScrollView style={{margin: 16}}>
                    <Text style={{color: Color.black_semi_transparent}}>材料附件</Text>
                    {
                        this.getFileList(this.state.dataSourceA)
                    }
                </ScrollView>
                <View style={{width: width * 0.8, height: 1, backgroundColor: Color.line}}/>
                <ScrollView style={{margin: 16}}>
                    <Text style={{color: Color.black_semi_transparent}}>工艺附件</Text>
                    {
                        this.getFileList(this.state.dataSourceB)
                    }
                </ScrollView>
                <View style={{width: width * 0.8, height: 1, backgroundColor: Color.line}}/>
                <ScrollView style={{margin: 16}}>
                    <Text style={{color: Color.black_semi_transparent}}>成品附件</Text>
                    {
                        this.getFileList(this.state.dataSourceC)
                    }
                </ScrollView>

            </View>)
    }

    render() {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                content={this.drawerLayout()}
                type="overlay"
                tapToClose={true}
                side="right"
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                closedDrawerOffset={-3}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    main: {opacity: (2 - ratio) / 2}
                })}>
                <View style={{flex: 1, backgroundColor: "white",}}>
                    <Toolbar
                        elevation={2}
                        title={["产品详情"]}
                        color={Color.colorIndigo}
                        isHomeUp={true}
                        isAction={true}
                        isActionByText={true}
                        actionArray={[]}
                        functionArray={[() => this.props.nav.goBack(null)]}
                    />
                    <ScrollView>
                        <View style={{alignItems: "center", marginBottom: 16}}>
                            <TouchableOpacity style={{width: width, height: 150,}} onPress={() => {
                                this.props.nav.navigate('gallery', {
                                    pics: this.props.product.productImages
                                })
                            }}>
                                <CachedImage
                                    resizeMode="contain"
                                    style={{width: width, height: 150,}}
                                    source={{uri: this.props.product.productImages ? this.props.product.productImages[0] : '-'}}/>
                            </TouchableOpacity>

                            <View style={styles.textStyle}>
                                <Text >型号</Text>
                                <Text style={{color: Color.black_semi_transparent}}>{this.props.product.itemName}</Text>
                            </View>
                            <View style={styles.textStyle}>
                                <Text >类型</Text>
                                <Text style={{color: Color.black_semi_transparent}}>{this.props.product.type}</Text>
                            </View>
                            <View style={styles.textStyle}>
                                <Text >数目</Text>
                                <Text style={{color: Color.black_semi_transparent}}>{this.props.product.qty}</Text>
                            </View>
                            <View style={styles.textStyle}>
                                <Text >规格编码</Text>
                                <Text style={{color: Color.black_semi_transparent}}>{this.props.product.skuCode}</Text>
                            </View>
                            <View style={styles.textStyle}>
                                <Text >描述</Text>
                                <Text style={{
                                    width: 200,
                                    textAlign: 'right',
                                    color: Color.black_semi_transparent
                                }}>{this.props.product.skuName}</Text>
                            </View>
                            <View style={styles.textStyle}>
                                <Text >交货时间</Text>
                                <Text style={{
                                    width: 200,
                                    textAlign: 'right',
                                    color: Color.black_semi_transparent
                                }}>{this.props.product.deliverDate}</Text>
                            </View>
                            <View style={styles.textStyle}>
                                <Text >改善方案</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.props.product.improveFiles.length !== 0 ||
                                            this.props.product.materialFiles.length !== 0 ||
                                            this.props.product.proFiles.length !== 0 ||
                                            this.props.product.techFiles.length !== 0) {
                                            this.openControlPanel();
                                        } else SnackBar.show('没有改善方案或附件', {duration: 3000})
                                    }}>
                                    <Text style={{color: Color.colorAccent}}>查看</Text>
                                </TouchableOpacity>

                            </View>
                            <Text style={{width: width - 32, margin: 16}}>质检流程</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={[styles.mainButton, {borderColor: this.getStatus(1) ? Color.colorAccent : Color.content}]}
                                    onPress={() => {
                                        if (this.props.product.materialFiles.length !== 0) {
                                            this.openControlPanel();
                                        } else SnackBar.show('材料没有附件', {duration: 3000})
                                    }}>
                                    <Text
                                        style={{color: this.getStatus(1) ? Color.colorAccent : Color.content}}>材料质检</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={[styles.mainButton, {borderColor: this.getStatus(2) ? Color.colorAccent : Color.content}]}
                                    onPress={() => {
                                        if (this.props.product.proFiles.length !== 0) {
                                            this.openControlPanel();
                                        } else SnackBar.show('成品没有附件', {duration: 3000})
                                    }}>
                                    <Text
                                        style={{color: this.getStatus(2) ? Color.colorAccent : Color.content}}>工艺质检</Text>

                                </TouchableOpacity>

                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={[styles.mainButton, {borderColor: this.getStatus(3) ? Color.colorAccent : Color.content}]}
                                    onPress={() => {

                                    }}>
                                    <Text
                                        style={{color: this.getStatus(3) ? Color.colorAccent : Color.content}}>成品质检</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </ScrollView>
                    <Loading visible={this.state.isLoading}/>

                </View>
            </Drawer>
        )
    }
}
const styles = StyleSheet.create({
    textStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        width: width - 32,
        marginRight: 16,
        marginLeft: 16,
        marginTop: 16,
        marginBottom: 8,

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

});
