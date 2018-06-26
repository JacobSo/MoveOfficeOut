'user strict';

import React, {Component} from 'react';
import {
    View,
    InteractionManager,
    ListView,
    RefreshControl,
    Dimensions,
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
let sqLite = new SQLite();
const {width, height} = Dimensions.get('window');

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
        //console.log(JSON.stringify(this.state.items) + '------------WdMainPager-------------');
        //  this.state.items.Itemlist[newProps.position] = newProps.product;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
        })
    }

    _onRefresh() {
        this.setState({isRefreshing: true});
        sqLite.clearWdData();
        ApiService.getSeries()
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    this.setState({
                        items: responseJson.Serieslist,
                        dataSource: this.state.dataSource.cloneWithRows(responseJson.Serieslist),
                        isRefreshing: false,
                    });
                    sqLite.insertWdData(responseJson.Serieslist);//db save
                    SnackBar.show("同步数据完成")
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

    getDataLocal() {
        this.setState({isRefreshing: true});
        sqLite.getWdData().then((results) => {
            this.setState({isRefreshing: false});
            if (results.length !== 0) {
              //  console.log("****************************" + JSON.stringify(results));
                this.setState({
                    items: results,
                    dataSource: this.state.dataSource.cloneWithRows(results),
                    isRefreshing: false,
                });
                SnackBar.show("本地数据")
            } else {
                this._onRefresh();
            }
        }).catch((err) => {
            this.setState({isRefreshing: false});
            SnackBar.show("出错了，请稍后再试");
        }).done();
    }

    _getView() {
        if (this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                this._onRefresh()
            } }/>)
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
                                    {
                                        task: rowData,
                                        finishFunc: () => {
                                            sqLite.clearWdSeries(rowData.SeriesGuid);
                                            this.state.items.splice(sectionID, 1);
                                            this.setState({
                                                dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),
                                            });
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
                    title={[App.workType.indexOf("板木驻厂工程师")>-1 ? "板木研发" : "软体研发"]}
                    color={Color.colorDeepOrange}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../../drawable/search.png")]}
                    functionArray={[
                        () => {
                         /*   if (this.state.isSearch) {
                                this.setState({
                                    isSearch: !this.state.isSearch,
                                    isHeader: true
                                })
                            } else this.props.nav.goBack(null)*/
                            this.props.nav.goBack(null)
                        },
                        () => {
                            this.props.nav.navigate('wdSearch')
                        },
                    ]}
                /*    isSearch={this.state.isSearch}
                    searchFunc={(text) => {
                        this._search(text).then((array) => {
                            //       console.log(array);
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(array),
                            });
                        })
                    }}
*/
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