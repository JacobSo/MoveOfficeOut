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
    Dimensions, TouchableOpacity, Image,
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import SnackBar from 'react-native-snackbar-dialog'
import {WdActions} from "../../actions/WdAction";

import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {CachedImage} from "react-native-img-cache";
import App from '../../constant/Application';
const {width, height} = Dimensions.get('window');

class WdProductDetailPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aFinish: false,
            bFinish: false,
            cFinish: false,
            aPass: false,
            bPass: false,
            cPass: false,
            intentTitle: '',
            intentStep: '',
        }
    }

    componentDidMount() {
       // console.log(JSON.stringify(this.props));
        this.setStatus();
    }

    componentWillReceiveProps(newProps) {
     //   console.log(JSON.stringify(newProps) + '------------WdProductDetailPager-------------')
        this.setStatus();
    }

    setStatus() {
        if (this.props.product.pResultList) {
            this.setState({
                aFinish: (this.props.product.pResultList.indexOf("0-1") > -1) || (this.props.product.pResultList.indexOf("0-0") > -1),
                bFinish: (this.props.product.pResultList.indexOf("1-1") > -1) || (this.props.product.pResultList.indexOf("1-0") > -1),
                cFinish: (this.props.product.pResultList.indexOf("2-1") > -1) || (this.props.product.pResultList.indexOf("2-0") > -1),
                aPass: (this.props.product.pResultList.indexOf("0-1") > -1),
                bPass: (this.props.product.pResultList.indexOf("1-1") > -1),
                cPass: (this.props.product.pResultList.indexOf("2-1") > -1),
            })
        }
    }

    selectDialog() {
        return (
            <PopupDialog
                ref={(popupDialog) => {
                    this.popupDialog = popupDialog;
                }}
                width={width - 32}
                height={100}>
                <View style={styles.layoutContainer}>
                    <TouchableOpacity onPress={() => {
                        let isHasIntent =
                            (this.state.intentStep === 0 && (this.props.product.pStatusResultA || this.props.product.pStatusPicA.length !== 0)) ||
                            (this.state.intentStep === 1 && (this.props.product.pStatusResultB || this.props.product.pStatusPicB.length !== 0)) ||
                            (this.state.intentStep === 2 && (this.props.product.pStatusResultC || this.props.product.pStatusPicC.length !== 0));
                        if (isHasIntent) {
                            this.props.nav.navigate(
                                'wdReview',
                                {
                                    title: this.state.intentTitle,
                                    step: this.state.intentStep,
                                    product: this.props.product,

                                },
                            );
                        } else {
                            SnackBar.show("没有评审内容")
                        }
                        this.popupDialog.dismiss();
                    }}>
                        <Text style={{margin: 16}}>查看</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        let isHasIntent =
                            (this.state.intentStep === 0 && (this.props.product.stage === 7 || this.props.product.stage === 6 || this.props.product.stage === 5 || this.props.product.stage === 4)) ||
                            (this.state.intentStep === 1 && (this.props.product.stage === 7 || this.props.product.stage === 6 || this.props.product.stage === 3 || this.props.product.stage === 2)) ||
                            (this.state.intentStep === 2 && (this.props.product.stage === 7 || this.props.product.stage === 5 || this.props.product.stage === 3 || this.props.product.stage === 1));
                        if (isHasIntent) {
                            this.props.nav.navigate(
                                'wdPost',
                                {
                                    title: this.state.intentTitle,
                                    step: this.state.intentStep,
                                    product: this.props.product,
                                    position: this.props.position
                                },
                            );
                        } else SnackBar.show("本阶段你不需要评审");
                        this.popupDialog.dismiss();
                    }}>
                        <Text style={{margin: 16}}>填写评审</Text>
                    </TouchableOpacity>
                </View>
            </PopupDialog>
        )
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
                    color={Color.colorDeepOrange}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={[]}
                    functionArray={[() => this.props.nav.goBack(null)]}
                />
                <ScrollView><View style={{alignItems: "center", marginBottom: 16}}>
                    <View style={{width: width, height: 150,}}>
                        <CachedImage
                            resizeMode="contain"
                            indicator={require('../../drawable/empty_image.png')}
                            style={{width: width, height: 150,}}
                            source={{uri: this.props.product.pImage ? this.props.product.pImage : '-'}}/>
                    </View>

                    <View style={styles.textStyle}>
                        <Text >型号</Text>
                        <Text >{this.props.product.ItemName}</Text>
                    </View>
                    <View style={styles.textStyle}>
                        <Text >编号</Text>
                        <Text >{this.props.product.ProjectNo}</Text>
                    </View>
                    <View style={styles.textStyle}>
                        <Text >描述</Text>
                        <Text style={{width: 200, textAlign: 'right'}}>{this.props.product.ItemRemark}</Text>
                    </View>
                    <Text style={{width: width - 32, textAlign: 'center', margin: 16}}>评审流程记录</Text>
                    {
                        (() => {
                            if (this.props.product.stage === 7 || this.props.product.stage === 6 || this.props.product.stage === 5 || this.props.product.stage === 4) {
                                return (
                                    <TouchableOpacity
                                        style={[styles.mainButton, {borderColor: this.state.aFinish ? Color.colorRed : Color.content}]}
                                        onPress={() => {
                                            this.state.intentStep = 0;
                                            this.state.intentTitle = App.workType === "板木驻厂工程师" ? '白胚评审' : '木架评审';
                                            this.popupDialog.show();
                                        }}>
                                        <Text> {App.workType === "板木驻厂工程师" ? '白胚评审' : '木架评审'}</Text>
                                        <View style={{
                                            backgroundColor: Color.line,
                                            width: 1,
                                            height: 25,
                                            marginLeft: 16,
                                            marginRight: 16
                                        }}/>
                                        <Text>{this.state.aFinish ? (this.state.aPass ? '通过' : '未通过') : '未提交'}</Text>
                                    </TouchableOpacity>)
                            }
                        })()
                    }
                    {
                        (() => {
                            if (this.props.product.stage === 7 || this.props.product.stage === 6 || this.props.product.stage === 3 || this.props.product.stage === 2) {
                                return (
                                    <TouchableOpacity
                                        style={[styles.mainButton, {borderColor: this.state.bFinish ? Color.colorRed : Color.content}]}
                                        onPress={() => {
                                            this.state.intentStep = 1;
                                            this.state.intentTitle = "成品评审";
                                            this.popupDialog.show();
                                        }}>
                                        <Text> 成品评审</Text>
                                        <View style={{
                                            backgroundColor: Color.line,
                                            width: 1,
                                            height: 25,
                                            marginLeft: 16,
                                            marginRight: 16
                                        }}/>
                                        <Text>{this.state.bFinish ? (this.state.bPass ? '通过' : '未通过') : '未提交'}</Text>
                                    </TouchableOpacity>
                                )

                            }

                        })()
                    }

                    {
                        (() => {
                            if (this.props.product.stage === 7 || this.props.product.stage === 5 || this.props.product.stage === 3 || this.props.product.stage === 1){
                                return (
                                    <TouchableOpacity
                                        style={[styles.mainButton, {borderColor: this.state.cFinish ? Color.colorRed : Color.content}]}
                                        onPress={() => {
                                            this.state.intentStep = 2;
                                            this.state.intentTitle = "包装评审";
                                            this.popupDialog.show();
                                        }}>
                                        <Text> 包装评审</Text>
                                        <View style={{
                                            backgroundColor: Color.line,
                                            width: 1,
                                            height: 25,
                                            marginLeft: 16,
                                            marginRight: 16
                                        }}/>
                                        <Text>{this.state.cFinish ? (this.state.cPass ? '通过' : '未通过') : '未提交'}</Text>
                                    </TouchableOpacity>

                                )
                            }
                        })()
                    }
                </View>
                </ScrollView>
                {this.selectDialog()}
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
export default connect(mapStateToProps, mapDispatchToProps)(WdProductDetailPager);