/**
 * Created by Administrator on 2017/3/13.
 * pause on 6/16:submit location info
 */
'user strict';

import {StyleSheet, View, ListView, Text, Dimensions, TouchableOpacity, Image} from 'react-native';
import React, {Component} from 'react';
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import {CachedImage} from "react-native-img-cache";
import Drawer from 'react-native-drawer'
import ApiService from '../../network/QcApiService';

import Toast from 'react-native-root-toast';
import {WdActions} from "../../actions/WdAction";
import SnackBar from 'react-native-snackbar-dialog'
import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import SQLite from '../../db/Sqlite';
import InputDialog from "../Component/InputDialog";
import QcInputDialog from "../Component/QcInputDialog";
let sqLite = new SQLite();
const {width, height} = Dimensions.get('window');

export default class QcFormPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            formItems: this.props.formItems,
            items: [],
            pagerView: [],
            pagerIndex: 0,
            editContent: '',
            countArray: [0, 0, 0],
            submitItems: [],
        }
    }

    componentWillMount() {
        sqLite.fetchQcDraft(this.state.formItems, this.props.product.fentityID)
            .then((result) => {
                this.setState({editContent: result[0].submitContent.totalContent});
                this.setState({
                    formItems: result
                })
            }).done()
    }

    componentDidMount() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.props.formItems)
        })
    }

    getPager() {
        let pagerView = [];
        this.state.formItems.map((data, index) => {
            if (data.isPass === undefined)
                data.isPass = 2;
            pagerView.push(<View key={index}>
                <View style={{flexDirection: 'row', margin: 16, alignItems: 'center'}}>
                    <Text style={{color: Color.colorIndigo, fontSize: 18,}}>{data.qualityItem}</Text>
                    {
                        (() => {
                            if (data.isPass === 1) {
                                return <Image style={{width: 15, height: 15}}
                                              source={require('../../drawable/pass_ico.png')}/>
                            } else if (data.isPass === 0) {
                                return <Image style={{width: 15, height: 15}}
                                              source={require('../../drawable/fail_ico.png')}/>
                            } else return null
                        })()
                    }
                </View>
                <Text style={{marginLeft: 16, marginRight: 16}}>{data.qualityContent}</Text>
                <ListView
                    style={{width: width, margin: 16}}
                    dataSource={new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}).cloneWithRows(data.qualityPic)}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}
                    renderRow={(rowData, sectionID, rowID) =>
                        <TouchableOpacity style={{width: 100, height: 100}} onPress={() => {
                            this.props.nav.navigate('gallery', {
                                pics: data.qualityPic
                            })
                        }}>
                            <Image
                                resizeMode="contain"
                                style={{width: 100, height: 100,}}
                                source={{uri: rowData}}/>
                        </TouchableOpacity>
                    }/>
            </View>)
        });
        // console.log(pagerView.toString());
        return <IndicatorViewPager
            ref={'viewPager'}
            style={{height: height - 135}}
            onPageSelected={(p) => {
                this.state.pagerIndex = p.position
            }}
            initialPage={this.state.pagerIndex}
            indicator={<PagerDotIndicator pageCount={this.state.formItems.length}/>}
        >{pagerView}
        </IndicatorViewPager>
    }

    setResult(isPass) {
        if (this.state.pagerIndex !== this.state.formItems.length - 1) {
            this.state.pagerIndex++;
        }
        this.state.formItems[this.state.pagerIndex].isPass = isPass;
        this.setState({
            formItems: JSON.parse(JSON.stringify(this.state.formItems)),
            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.formItems)))
        });
        this.refs["viewPager"].setPage(this.state.pagerIndex)
    }

    closeControlPanel = () => {
        this._drawer.close()
    };

    openControlPanel = () => {
        this._drawer.open()
    };

    drawerLayout() {
        return (
            <View style={{flex: 1, backgroundColor: Color.black_semi_transparent,}}>
                <ListView
                    dataSource={this.state.dataSource}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    renderRow={(rowData, rowID, sectionID) =>
                        <TouchableOpacity style={{flexDirection: 'row', margin: 16, alignItems: 'center'}}
                                          onPress={() => {
                                              this.closeControlPanel();
                                              this.refs["viewPager"].setPage(Number(sectionID))
                                          }}>
                            <Text style={{color: 'white'}}>{rowData.qualityItem}</Text>
                            {
                                (() => {
                                    if (rowData.isPass === 1) {
                                        return <Image style={{width: 15, height: 15}}
                                                      source={require('../../drawable/pass_ico.png')}/>
                                    } else if (rowData.isPass === 0) {
                                        return <Image style={{width: 15, height: 15}}
                                                      source={require('../../drawable/fail_ico.png')}/>
                                    } else return null
                                })()
                            }
                        </TouchableOpacity>}/>
            </View>)
    }

    finishDialog() {
        return (
            <QcInputDialog
                action={[
                    (popupDialog) => {//0 ref
                        this.popupDialog = popupDialog;
                    },
                    (text) => {//1 edit text
                        this.setState({editContent: text})
                    },
                    () => {//2 save
                        this.totalSave();
                        this.popupDialog.dismiss();
                    },
                    () => {//3 dismiss
                        this.setState({editContent: ''});
                        this.popupDialog.dismiss();
                    },
                    () => {//4 submit
                        this.totalSubmit();
                        this.popupDialog.dismiss();
                    }
                ]}
                defaultStr={this.state.editContent}
                countArray={this.state.countArray}/>)
    }

    count() {
        let tempPass = 0, tempFail = 0, tempPic = 0;
        let isAllFill = true;
        let tempSubmit = [];
        this.state.formItems.map(
            (data) => {
                tempPic = tempPic + (data.submitPic ? data.submitPic.length : 0);
                if (data.isPass === 1) {
                    tempPass++;
                } else if (data.isPass === 0) {
                    tempFail++;
                } else {
                    isAllFill = false

                }
                tempSubmit.push({
                    infoGuid: data.Guid,
                    qualityContent: data.submitContent ? data.submitContent.subContent : "",
                    isPass: data.isPass,
                    subDate: data.submitContent ? data.submitContent.editDate : new Date().toLocaleString(),
                    subAddress: data.submitContent ? data.submitContent.editAddress : '',
                    latitude: data.submitContent ? data.submitContent.lat : '',
                    longitude: data.submitContent ? data.submitContent.lng : '',
                })
            }
        );
        if (isAllFill) {
            this.setState({
                countArray: [tempPass, tempFail, tempPic],
                submitItems: tempSubmit
            });
            this.popupDialog.show()
        } else
            Toast.show('还有没有完成的项目')
    }

    totalSave() {
        sqLite.insertQcDraftAll(this.state.formItems, this.props.product.fentityID, this.state.editContent)
            .then((result) => {
                Toast.show(result);
                this.props.nav.goBack(null);
            }).done()
    }

    totalSubmit() {
        ApiService.submitQualityContent(this.props.product.fentityID,this.props.stage,JSON.stringify(this.state.submitItems),this.state.editContent,)
    }

    render() {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                content={this.drawerLayout()}
                type="static"
                tapToClose={true}
                side="right"
                openDrawerOffset={0.2}
                panCloseMask={0.2}>
                <View style={{flex: 1, backgroundColor: "white",}}>
                    <Toolbar
                        elevation={2}
                        title={[this.props.stage === 0 ? '材料质检' : (this.props.stage === 1 ? '工艺质检' : '成品质检')]}
                        color={Color.colorIndigo}
                        isHomeUp={true}
                        isAction={true}
                        isActionByText={true}
                        actionArray={['目录', '提交']}
                        functionArray={[
                            () => this.props.nav.goBack(null),
                            () => {
                                this.openControlPanel();
                            },
                            () => {
                                this.count();

                            }
                        ]}
                    />
                    {
                        this.getPager()
                    }
                    <View style={{position: 'absolute', bottom: 25, width: width,}}>
                        <View style={{width: width, height: 1, backgroundColor: Color.line,}}/>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', padding: 16}}>
                            <TouchableOpacity onPress={() => {
                                this.props.nav.navigate('qcPost', {
                                        product: this.props.product,
                                        form: this.state.formItems[this.state.pagerIndex],
                                        appendFunc: (submitContent, submitPic) => {
                                            this.state.formItems[this.state.pagerIndex].submitContent = submitContent;
                                            this.state.formItems[this.state.pagerIndex].submitPic = submitPic;
                                        }
                                    }
                                )
                            }}>
                                <Image style={{width: 25, height: 25}}
                                       source={require('../../drawable/pen_unwrite.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.setResult(0)
                            }}>
                                <Image style={{width: 25, height: 25}}
                                       source={require('../../drawable/fail_ico.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.setResult(1)
                            }}>
                                <Image style={{width: 25, height: 25}}
                                       source={require('../../drawable/pass_ico.png')}/>
                            </TouchableOpacity>
                        </View></View>
                    {this.finishDialog()}
                </View>
            </Drawer>
        );
    }

}