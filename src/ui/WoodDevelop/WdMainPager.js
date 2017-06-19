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
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import ApiService from '../../network/WdApiService';
import Color from '../../constant/Color';
import App from '../../constant/Application';
import Toast from 'react-native-root-toast';
import {WdMainItem} from "../Component/WdMainItem";
const {width, height} = Dimensions.get('window');
import {WdActions} from "../../actions/WdAction";
import SQLite from '../../db/Sqlite';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import RefreshEmptyView from "../Component/RefreshEmptyView";
let sqLite = new SQLite();
class WdMainPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isRefreshing: true,
            isSearch: false,
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            sqLite.createWdTable();
            this.getDataLocal();
        //    this._onRefresh();
        });
    }

    componentWillReceiveProps(newProps) {
            console.log(JSON.stringify(newProps) + '-------------------------')
            this.state.items[newProps.position] = newProps.product;
         this.setState({
         dataSource: this.state.dataSource.cloneWithRows(this.state.items),
         })
    }

    _onRefresh() {
        this.setState({isRefreshing: true});
        ApiService.getSeries()
            .then((responseJson) => {
                console.log(responseJson);
                if (!responseJson.IsErr) {
                    sqLite.insertWdData(responseJson.Serieslist);//save in db
                    this.setState({
                        items: responseJson.Serieslist,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.Serieslist),
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

    getDataLocal() {
        this.setState({isRefreshing: true});
        sqLite.getWdData().then((results) => {
            this.setState({isRefreshing: false});
            if (results.length !== 0) {
                this.setState({
                    items: results,
                    dataSource: this.state.dataSource.cloneWithRows(results),
                    isRefreshing: false,
                });
            } else {
                this._onRefresh();
            }
        }).catch((err) => {
            this.setState({isRefreshing: false});
            Toast.show("出错了，请稍后再试");
        }).done();
    }

    _getView() {
        if (this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={()=>{this._onRefresh()} } />)
        } else {
            return (
                <ListView
                    ref="scrollView"
                    style={{
                        backgroundColor: Color.trans,
                        width: width,
                    }}
                    dataSource={this.state.dataSource}
                    //removeClippedSubviews={false}
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
                        <WdMainItem
                            key={sectionID}
                            task={rowData}
                            func={() => {
                                this.props.nav.navigate(
                                    'wdProduct',
                                    {task: rowData,},
                                );
                            }}
                        />
                    }/>
            )
        }
    }

    async  _search(text) {
        return this.state.items.filter((item) => (item.SeriesName.toLowerCase().indexOf(text.toLowerCase()) > -1)|| (item.FacName.indexOf(text) > -1));
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar
                    elevation={2}
                    title={["板木研发"]}
                    color={Color.colorDeepOrange}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../../drawable/search.png")]}
                    functionArray={[
                        () => {
                            if (this.state.isSearch) {
                                this.setState({
                                    isSearch: !this.state.isSearch,
                                    isHeader: true
                                })
                            }else this.props.nav.goBack(null)
                        },
                        () => {
                            this.setState({isSearch: !this.state.isSearch})
                        },
                    ]}
                    isSearch={this.state.isSearch}
                    searchFunc={(text) => {
                        this._search(text).then((array) => {
                            //       console.log(array);
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(array),
                            });
                        })
                    }}

                />
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
export default connect(mapStateToProps, mapDispatchToProps)(WdMainPager);