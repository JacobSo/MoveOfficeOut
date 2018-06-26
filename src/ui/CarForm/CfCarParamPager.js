'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions, ListView, RefreshControl
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/CfApiService';
import Color from '../../constant/Color';
import Loading from 'react-native-loading-spinner-overlay'
import SnackBar from 'react-native-snackbar-dialog'
import RefreshEmptyView from "../Component/RefreshEmptyView";
import CfCarItem from "../Component/CfCarItem";

const {width, height} = Dimensions.get('window');

export default class CfListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isRefreshing: false,
        }
    }

    componentDidMount() {
        this.getCar();
    }

    getCar() {
        this.setState({isRefreshing: true});
        ApiService.getList('0,1,2,3').then((responseJson) => {
            this.setState({isRefreshing: false});
            if (!responseJson.isErr) {
                this.setState({
                    items: responseJson.data,
                    dataSource: this.state.dataSource.cloneWithRows(responseJson.data)
                });
            } else {
                SnackBar.show(responseJson.errDesc);
            }
        })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
                this.setState({isRefreshing: false});
            }).done();
    }

    getView() {
        if (this.state.items && this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                this.getCar()
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
                            onRefresh={() => this.getCar()}
                            tintColor={Color.colorBlueGrey}//ios
                            title="刷新中..."//ios
                            titleColor='white'
                            colors={[Color.colorPrimary]}
                            progressBackgroundColor="white"
                        />}
                    enableEmptySections={true}
                    renderRow={(rowData, rowID, sectionID) => {
                        return <CfCarItem carInfo={rowData} actionText={"选择"} actionFunc={() => {
                            this.props.finishFunc(rowData.billNo);
                            this.props.nav.goBack(null);
                        }}/>
                    }

                    }/>
            )
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>
                <Toolbar
                    isWhiteBar={true}
                    elevation={5}
                    title={["我的用车申请单"]}
                    color={'white'}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['创建']}
                    functionArray={[
                        () => this.props.nav.goBack(null),
                        () => this.props.nav.navigate("cfCreate", {
                            finishFunc: () => {
                                this.getCar()
                            }
                        })

                    ]}/>
                {this.getView()}
                <Loading visible={this.state.isLoading}/>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    button: {
        width: width - 32,
        height: 45,
        backgroundColor: Color.colorAccent,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        width: width - 32,
        marginRight: 10,
        borderColor: Color.colorAccent,
        borderBottomWidth: 1,
    },
    selection: {
        width: 55,
        height: 5,
        marginTop: 16,
        marginBottom: 16
    }
});