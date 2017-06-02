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
    Text,
    StyleSheet,
    Dimensions, TouchableOpacity,
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';
import Color from '../../constant/Color';
import {WdProductItem} from "../Component/WdProductItem";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Toast from 'react-native-root-toast';
import ApiService from '../../network/WpApiService';
import {CachedImage, CustomCachedImage, ImageCache} from "react-native-img-cache";

const {width, height} = Dimensions.get('window');

import {WdActions} from "../../actions/WdAction";
import Utility from "../../utils/Utility";
export default class WpProductListPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.task.productlist,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isSearch: false,
            isHeader: true,
        }
    }

    componentDidMount() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
        });
    }

    componentWillReceiveProps(newProps) {

    }


    getHeaderView() {
        if (this.state.isHeader) {
            return (<View style={{backgroundColor: 'white'}}>
                <View style={styles.headerContainer}>
                    <View style={styles.itemText}>
                        <Text>{'评审时间'}</Text>
                        <Text
                            style={{color: Color.black_semi_transparent}}>{Utility.getTime(this.props.task.ReviewDate)}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text>{'供应商'}</Text>
                        <Text style={{color: Color.black_semi_transparent}}>{this.props.task.FacName}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text>{'系列'}</Text>
                        <Text style={{color: Color.black_semi_transparent}}>{this.props.task.Series}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text>{'陪同人'}</Text>
                        <Text style={{color: Color.black_semi_transparent}}>{ this.props.task.FollowPeson}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text>{'是否申请车辆'}</Text>
                        <Text
                            style={{color: Color.black_semi_transparent}}>{ this.props.task.IsApplyCar ? '是' : '否'}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text>{'创建时间'}</Text>
                        <Text
                            style={{color: Color.black_semi_transparent}}>{Utility.getTime(this.props.task.CreateTime)}</Text>
                    </View>
                    <View style={styles.itemText}>
                        <Text>{'评审类型'}</Text>
                        <Text
                            style={{color: Color.black_semi_transparent}}>{this.props.ReviewType===1?'软体':'板木'}</Text>
                    </View>
                </View>
            </View>)
        }
    }

    async  _search(text) {
        return this.state.items.filter((item) => item.ItemName.toLowerCase().indexOf(text.toLowerCase()) > -1);
    }

    render() {
        console.log("product list render")
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={2}
                    title={["产品列表"]}
                    color={Color.colorPurple}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['搜索']}
                    functionArray={[
                        () => {
                            if (this.state.isSearch) {
                                this.setState({
                                    isSearch: !this.state.isSearch,
                                    isHeader: true
                                })
                            } else
                                this.props.nav.goBack(null)
                        },
                        () => {
                            this.setState({
                                isSearch: !this.state.isSearch,
                                isHeader: false
                            })
                        },

                    ]}
                    isSearch={this.state.isSearch}
                    searchFunc={(text) => {
                        this._search(text).then((array) => {
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(array),
                            });
                        })
                    }}
                />

                <ListView
                    ref="scrollView"
                    style={styles.tabView}
                    dataSource={this.state.dataSource}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    renderHeader={() => this.getHeaderView()}
                    renderRow={(rowData, rowID, sectionID) =>
                        <TouchableOpacity
                            style={{flexDirection: 'row', backgroundColor: 'white', elevation: 2, margin: 16}}
                            onPress={() => {
                                if(rowData.FacPicPath){
                                    let temp = rowData.FacPicPath.split(',');
                                    let pics = [];
                                    temp.map((data)=>{
                                        pics.push(ApiService.getBaseUrl()+data)
                                    })
                                    this.props.nav.navigate('gallery',{
                                        pics:pics
                                    })
                                }else Toast.show('没有工厂图片')

                            }}>
                            <View style={{width: 100, height: 100, backgroundColor: Color.line, margin: 5}}>
                                <CachedImage
                                    resizeMode="contain"
                                    style={{width: 100, height: 100,}}
                                    source={{uri:rowData.PicPath}}/>
                            </View>
                            <View>
                                <Text style={{
                                    color: Color.black_semi_transparent,
                                    margin: 5,
                                    width: 200
                                }}>{ rowData.ItemName}</Text>
                                <Text style={{margin: 5, width: 200}}>{ rowData.ItemRemark}</Text>
                                <Text style={{margin: 5, width: 200}}>{'评审阶段:'+ rowData.ReviewStage}</Text>
                                <Text style={{margin: 5, width: 200}}>{'图片:'+ (rowData.FacPicPath?rowData.FacPicPath.split(',').length:'0')+'张'}</Text>
                            </View>
                        </TouchableOpacity>
                    }/>

            </View>
        )
    }
}
const styles = StyleSheet.create(
    {
        headerContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: width - 32,
            margin: 16,
        },
        itemText: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: width - 32,
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10
        },
        tabView: {
            backgroundColor: Color.trans,
            width: width,
            marginBottom:32
        },
        card: {
            borderWidth: 1,
            backgroundColor: 'white',
            borderColor: Color.trans,
            margin: 16,
            height: 55,
            padding: 15,
            shadowColor: Color.background,
            shadowOffset: {width: 2, height: 2,},
            shadowOpacity: 0.5,
            shadowRadius: 3,
            alignItems: 'center',
            elevation: 2
        },
        topButton: {
            flex: 1,
            width: 100,
            height: 35,
            left: width / 2 - 50,
            top: 0,
            position: 'absolute',
            elevation: 5,
            marginTop: 16,
            backgroundColor: Color.colorPrimary_semi_transparent,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
        },
        panelContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: 1
        },


        iconCircle: {
            flex: 1,
            width: 55,
            height: 55,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: Color.line
        },
        layoutContainer: {
            width: width - 32,
            height: 50 * 4,
            backgroundColor: 'white'
        },
    });
