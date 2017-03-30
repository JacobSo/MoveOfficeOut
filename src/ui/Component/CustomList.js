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
    InteractionManager, ScrollView,
} from 'react-native';
import Toast from 'react-native-root-toast';
import {MainItem} from '../Component/MainItem';
import ApiService from '../../network/ApiService';
import Color from '../../constant/Color';
export default class CustomList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            page: 1,
            isRefreshing: true,
            isEndUp: false
        };
        this.listener = this.props.nav.navigationContext.addListener('didfocus', (event) => {
            console.log(event.target._currentRoute.id);
            if (event.target._currentRoute.id === 'main') {
                this._onRefresh();

            }
        });
    }

    static propTypes = {
        type: PropTypes.string.isRequired,
        nav: PropTypes.any.isRequired
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._onRefresh()
        });
    }

    _onRefresh() {
        console.log('_refresh');
        this.state.page = 1;
        this.state.isRefreshing = true;
        ApiService.getItems(this.state.page, this.props.type).then((responseJson) => {
            //  console.log(responseJson);
            this.state.items = responseJson.list;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                isRefreshing: false,
                isEndUp: responseJson.list.length === 0
            });

        }).done()
    }

    _onLoad() {
        console.log('_load');
        if (this.state.items.length >= 10) {
            this.setState({
                //  isRefreshing: true,
                page: this.state.page + 1
            });
            ApiService.getItems(this.state.page, this.props.type).then((responseJson) => {
                // console.log(responseJson);
                this.state.items = this.state.items.concat(responseJson.list);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                    isRefreshing: false,
                    isEndUp: responseJson.list.length === 0
                });
                if (this.state.isEndUp) {
                    Toast.show('已经没有了', {});
                }
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
                        />}>
                    <View
                        style={styles.card}>
                        <Text>没有数据</Text>
                    </View></ScrollView>
            );
        } else {
            return (
                <ListView
                    style={styles.tabView}
                    dataSource={this.state.dataSource}
                    //  pageSize={2}
                    onEndReached={() => {
                        this._onLoad()
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this._onRefresh()}
                            tintColor={Color.colorBlueGrey}//ios
                            title="Loading..."//ios
                            titleColor='white'
                            colors={[Color.colorPrimary]}
                            progressBackgroundColor="white"
                        />}
                    enableEmptySections={true}
                    renderRow={ (rowData, rowID, sectionID) => <MainItem key={sectionID} task={rowData} func={() => {

                        this.props.nav.push({
                            id: 'detail',
                            params: {
                                task: rowData,
                            }
                        })
                    }}/>
                    }/>)
        }
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }
}

const styles = StyleSheet.create(
    {
        tabView: {
            flex: 1,
            backgroundColor: Color.trans,
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
    });