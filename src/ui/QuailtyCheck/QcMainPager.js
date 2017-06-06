/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet, Dimensions,  RefreshControl, ListView, Text, TouchableOpacity,

} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/QcApiService';
import Color from '../../constant/Color';
import FloatButton from "../Component/FloatButton";
import Toast from 'react-native-root-toast';
import Utility from "../../utils/Utility";
import RefreshEmptyView from "../Component/RefreshEmptyView";

const {width, height} = Dimensions.get('window');

export default class QcMainPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isRefreshing: false,
        }
    }

    componentDidMount() {
        this._onRefresh();
    }

    _onRefresh() {
        this.setState({isRefreshing: true,})
        ApiService.getProductList()
            .then((responseJson) => {
                console.log(responseJson);
                if (!responseJson.IsErr) {
                    console.log(responseJson);
                     this.setState({
                     items: responseJson.data,
                     dataSource: this.state.dataSource.cloneWithRows(responseJson.data),
                     isRefreshing: false,
                     });
                } else Toast.show(responseJson.ErrDesc);
            })
            .catch((error) => {
                console.log(error);
                Toast.show("出错了，请稍后再试");
            }).done();
    }

    _getView() {
        if (this.state.items && this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={()=>{this._onRefresh()} } />)
        } else {
            return (
                <ListView
                    ref="scrollView"
                    style={styles.tabView}
                    dataSource={this.state.dataSource}
                    removeClippedSubviews={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this._onRefresh()}
                            tintColor={Color.colorBlueGrey}//ios
                            title="刷新中..."//ios
                            titleColor='white'
                            colors={[Color.colorPrimary]}
                            progressBackgroundColor="white"
                        />}
                    enableEmptySections={true}
                    renderRow={(rowData, rowID, sectionID) =>
                        <TouchableOpacity
                            onPress={() => {
      /*                          this.props.nav.navigate('wpWork', {
                                    task: rowData,
                                    refreshFunc: () => {
                                        this._onRefresh()
                                    }
                                });*/
                            }}
                            style={styles.itemCard}>
                            <View style={styles.itemText}>
                                <Text>{'采购单'}</Text>
                                <Text
                                    style={{color: Color.black_semi_transparent}}>{rowData.purchaseNo}
                                </Text>
                            </View>
                            <View style={styles.itemText}>
                                <Text>{'供应商'}</Text>
                                <Text style={{color: Color.black_semi_transparent}}>{rowData.supplier}</Text>
                            </View>

                            <View style={styles.itemText}>
                                <Text>{'分配时间'}</Text>
                                <Text style={{color: Color.black_semi_transparent}}>{rowData.lockTime}</Text>
                            </View>
                        </TouchableOpacity>
                    }/>
            )
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar
                    elevation={0}
                    title={["常规质检"]}
                    color={Color.colorIndigo}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },

                    ]}/>
                {this._getView()}
                <FloatButton
                    color={Color.colorPink}
                    drawable={require('../../drawable/add.png')}
                    action={() => {
                        this.props.nav.navigate('wpWork', {
                            refreshFunc: () => {
                                this._onRefresh()
                            }
                        });
                    }}/>
            </View>
        )
    }
}
const styles = StyleSheet.create(
    {
        tabView: {
            backgroundColor: Color.trans,
            width: width,
            height: height - 25 - 55 * 2
        },


        itemCard: {
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            elevation: 2,
            marginBottom: 32,
            marginLeft: 16,
            marginRight: 16,
            marginTop: 10,
            paddingBottom: 10
        },
        itemText: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: width - 32,
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10
        }
    });
