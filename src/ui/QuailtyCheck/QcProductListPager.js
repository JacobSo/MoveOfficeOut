/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet, Dimensions, RefreshControl, ListView, Text, TouchableOpacity,

} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/QcApiService';
import Color from '../../constant/Color';
import FloatButton from "../Component/FloatButton";
import Toast from 'react-native-root-toast';
import Utility from "../../utils/Utility";
import RefreshEmptyView from "../Component/RefreshEmptyView";
import QcProductItem from "../Component/QcProductItem";

const {width, height} = Dimensions.get('window');

export default class QcProductListPager extends Component {
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

        this.setState({
            items: this.props.task.data,
            dataSource: this.state.dataSource.cloneWithRows(this.props.task.data)
        })

    }


    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={0}
                    title={['产品列表', this.props.task.purchaseNo]}
                    color={Color.colorIndigo}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['完成']}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        () => {

                        }

                    ]}/>
                <ListView
                    ref="scrollView"
                    style={styles.tabView}
                    dataSource={this.state.dataSource}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    renderRow={(rowData, rowID, sectionID) =>
                        <QcProductItem product={rowData} func={() => {
                            this.props.nav.navigate('qcDetail',
                                {
                                    product: rowData
                                })
                        }}/>
                    }/>
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
