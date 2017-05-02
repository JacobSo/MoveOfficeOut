/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    ListView,
    View,
    StyleSheet,
    Text,
    RefreshControl,
    InteractionManager,
    ScrollView,
    Dimensions, TouchableWithoutFeedback, TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-root-toast';
import {MainItem} from '../Component/MainItem';
import ApiService from '../../network/ApiService';
import Color from '../../constant/Color';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {mainActions} from "../../actions/MainAction";
const {width, height} = Dimensions.get('window');

class CustomList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            page: 1,
            isRefreshing: true,
            isEndUp: false,
            isTopTips: false,
        };

    }

    static propTypes = {
        type: PropTypes.string.isRequired,
        nav: PropTypes.any.isRequired
    };

    componentWillReceiveProps(newProps) {
        //    console.log(JSON.stringify(newProps) + '-------------------------')
        InteractionManager.runAfterInteractions(() => {
            if (newProps.refreshList)
                this._onRefresh()
        });

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._onRefresh();

        });
    }

    _onRefresh() {
        //  console.log('_refresh');
        this.setState({
            isRefreshing: !this.state.isTopTips,
            isTopTips: false,
        });
        this.state.page = 1;
        ApiService.getItems(this.state.page, this.props.type).then((responseJson) => {
            //  console.log(responseJson);
            if (!responseJson.IsErr) {
                this.setState({
                    items: responseJson.list,
                    dataSource: this.state.dataSource.cloneWithRows(responseJson.list),
                    isRefreshing: false,
                    isEndUp: responseJson.list.length === 0
                });
            } else Toast.show(responseJson.ErrDesc);
            this.props.actions.refreshList(false);
        }).done()
    }

    _onLoad() {
        //console.log('_load');
        if (this.state.items.length >= 10 && !this.state.isEndUp) {
            /*            this.setState({
             //  isRefreshing: true,
             page: this.state.page + 1
             });*/
            this.state.page = this.state.page + 1;
            ApiService.getItems(this.state.page, this.props.type).then((responseJson) => {
                // console.log(responseJson);
                if (!responseJson.IsErr) {
                    this.state.items = this.state.items.concat(responseJson.list);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                        isRefreshing: false,
                        isEndUp: responseJson.list.length === 0,
                        isTopTips: true,
                    });
                    if (this.state.isEndUp) {
                        Toast.show('已经没有了', {});
                    }

                } else Toast.show(responseJson.ErrDesc);
                this.props.actions.refreshList(false);
            }).done()
        }
    }

    render() {
        if (this.state.items.length === 0) {
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this._onRefresh()}
                            tintColor={Color.colorBlueGrey}//ios
                            title="Loading..."//ios
                            titleColor='white'
                            colors={[Color.colorPrimary]}
                            progressBackgroundColor="white"
                        />
                    }
                >
                    <View
                        style={styles.card}>
                        <Text>没有数据</Text>
                    </View></ScrollView>
            );
        } else {
            return (
                <View style={{flex: 1, alignItems: 'center'}}>

                    <ListView
                        ref="scrollView"
                        style={styles.tabView}
                        dataSource={this.state.dataSource}
                        //  pageSize={2}
                        onEndReached={
                            () => {
                                this._onLoad()
                            }
                        }
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
                        renderRow={ (rowData, rowID, sectionID) =>
                            <MainItem key={sectionID} task={rowData}
                                      func={() => {
                                          this.props.actions.refreshList(false);
                                          this.props.nav.navigate(
                                              'detail',
                                              {task: rowData,},
                                          );
                                      }}/>
                        }/>
                    {
                        (() => {
                            if (this.state.isTopTips) {
                                return (
                                    <TouchableOpacity
                                        style={styles.topButton}
                                        onPress={
                                            () => {
                                                this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true});
                                                this._onRefresh()
                                            }
                                        }>
                                        <Text style={{color: 'white',}}>返回顶部</Text>
                                    </TouchableOpacity>
                                );
                            }
                        })()
                    }
                </View>
            )
        }
    }
}

const styles = StyleSheet.create(
    {
        tabView: {
            backgroundColor: Color.trans,
            width: width
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
        }
    });

const mapStateToProps = (state) => {
    return {
        refreshList: state.mainStore.refreshList
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomList);