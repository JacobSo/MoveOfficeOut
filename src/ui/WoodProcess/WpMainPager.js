/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet, Dimensions, ScrollView, RefreshControl, ListView, Text, TouchableOpacity,

} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/WpApiService';
import Color from '../../constant/Color';
import FloatButton from "../Component/FloatButton";
import Toast from 'react-native-root-toast';
import Utility from "../../utils/Utility";
import RefreshEmptyView from "../Component/RefreshEmptyView";
import WpMainItem from "../Component/WpMainItem";

const {width, height} = Dimensions.get('window');

export default class WpMainPager extends Component {
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
        ApiService.getList(0)
            .then((responseJson) => {
                console.log(responseJson);
                if (!responseJson.IsErr) {
                    console.log(responseJson);
                    this.setState({
                        items: responseJson.list,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.list),
                        isRefreshing: false,
                    });
                } else{
                    this.setState({  isRefreshing: false,});
                    Toast.show(responseJson.ErrDesc);
                }
            })
            .catch((error) => {
                this.setState({  isRefreshing: false,});
                console.log(error);
                Toast.show("出错了，请稍后再试");
            }).done();
    }

    _getView() {
        if (this.state.items && this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                this._onRefresh()
            } }/>)
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
                        <WpMainItem rowData={rowData} action={ () => {
                            this.props.nav.navigate('wpWork', {
                                task:rowData,
                                refreshFunc: () => {
                                    this._onRefresh()
                                }
                            });
                        }}/>}/>
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
                    title={["评审单"]}
                    color={Color.colorPurple}
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
                    color={Color.colorOrange}
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
    });
