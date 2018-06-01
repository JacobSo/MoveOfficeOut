/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    InteractionManager,
    ListView,
    RefreshControl,
    Dimensions,
    TextInput, TouchableOpacity, Text
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import ApiService from '../../network/WdApiService';
import Color from '../../constant/Color';
import App from '../../constant/Application';
import SnackBar from 'react-native-snackbar-dialog'
import {WdMainItem} from "../Component/WdMainItem";
import {WdActions} from "../../actions/WdAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import RefreshEmptyView from "../Component/RefreshEmptyView";
import SQLite from '../../db/Sqlite';
import Loading from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');

class WdSearchPager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isRefreshing: false,
            isSearch: false,
            keyword:''
        }
    }

    componentDidMount() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
        })
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
        })
    }

    onSearch() {
        this.setState({isRefreshing: true});
        ApiService.searchSeries(this.state.keyword,"")
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    this.setState({
                        items: responseJson.Serieslist,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.Serieslist),
                        isRefreshing: false,
                    });
                } else {
                    SnackBar.show(responseJson.ErrDesc);
                    this.setState({
                        items: [],
                        dataSource: this.state.dataSource.cloneWithRows([]),
                        isRefreshing: false,
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    items: [],
                    dataSource: this.state.dataSource.cloneWithRows([]),
                    isRefreshing: false,
                });
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
            }).done();
    }


    _getView() {
        if (this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {

            } }/>)
        } else {
            return (
                <ListView
                    ref="scrollView"
                    style={{
                        backgroundColor: Color.trans,
                        width: width,
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={()=>{}}
                            tintColor={Color.colorBlueGrey}//ios
                            title="Loading..."//ios
                            titleColor='white'
                            colors={[Color.colorPrimary]}
                            progressBackgroundColor="white"
                        />
                    }
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData, rowID, sectionID) =>
                        <WdMainItem
                            key={sectionID}
                            task={rowData}
                            func={() => {
                                this.props.nav.navigate(
                                    'wdProduct',
                                    {
                                        task: rowData,
                                        isSearch:true,
                                        finishFunc: () => {

                                        }
                                    },
                                );
                            }}
                        />
                    }/>
            )
        }
    }

    async  _search(text) {
        return this.state.items.filter((item) => (item.SeriesName.toLowerCase().indexOf(text.toLowerCase()) > -1) || (item.FacName.indexOf(text) > -1));
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={2}
                    title={['历史评审单']}
                    color={Color.colorDeepOrange}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null);
                        },
                    ]}
                />

                <View style={{flexDirection: "row"}}>

                    <TextInput style={{
                        width: width - 100,
                        height: 45,
                        marginLeft: 16,
                        marginRight: 16,
                        borderColor: Color.line,
                        borderBottomWidth: 1,
                    }}
                               placeholder="输入系列"
                               returnKeyType={'done'}
                               blurOnSubmit={true}
                               underlineColorAndroid="transparent"
                               onChangeText={(text) => {
                                   this.state.keyword = text
                               }}/>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Color.colorDeepOrange,
                            margin: 8,
                            justifyContent: "center",
                            padding: 10,
                            borderRadius: 10
                        }}
                        onPress={() => {
                            this.onSearch();
                        }}>
                        <Text style={{color: "white"}}>搜索</Text>
                    </TouchableOpacity>
                </View>
                {
                    this._getView()
                }
            </View>
        )
    }
}

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
export default connect(mapStateToProps, mapDispatchToProps)(WdSearchPager);