/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import {StyleSheet, View, ListView, Text, Dimensions, TouchableOpacity, Image} from 'react-native';
import React, {Component} from 'react';
import {PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import {CachedImage} from "react-native-img-cache";

import Toast from 'react-native-root-toast';
import {WdActions} from "../../actions/WdAction";
import SnackBar from 'react-native-snackbar-dialog'
import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import SQLite from '../../db/Sqlite';
let sqLite = new SQLite();
const {width, height} = Dimensions.get('window');

export default class QcFormPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formItems: this.props.formItems,
            items: [],
            pagerView: [],
            pagerIndex: 0
        }
    }

    componentWillMount() {
        sqLite.fetchQcDraft(this.state.formItems, this.props.product.fentityID).then((result) => {
            this.setState({
                formItems:result
            })
        }).done()
    }

    componentDidMount() {

    }

    getPager() {
        let pagerView = [];
        this.state.formItems.map((data) => {
            pagerView.push(<View>
                <Text style={{color: Color.colorIndigo, fontSize: 18, margin: 16}}>{data.qualityItem}</Text>
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
                        }
                        }>
                            <Image
                                resizeMode="contain"
                                style={{width: 100, height: 100,}}
                                source={{uri: rowData}}/>
                        </TouchableOpacity>
                    }/>
            </View>)
        });
        console.log(pagerView.toString());
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
        if (this.state.pagerIndex !== this.state.formItems.length) {
            this.state.pagerIndex++;
        }
        this.refs["viewPager"].setPage(this.state.pagerIndex)
    }

    render() {
        return (
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
                        },
                        () => {
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
                            this.setResult(false)
                        }}>
                            <Image style={{width: 25, height: 25}}
                                   source={require('../../drawable/fail_ico.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setResult(true)
                        }}>
                            <Image style={{width: 25, height: 25}}
                                   source={require('../../drawable/pass_ico.png')}/>
                        </TouchableOpacity>
                    </View></View>
            </View>
        );
    }

}