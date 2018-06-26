'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions,  ListView,
    Alert,
    RefreshControl
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/QcApiService';
import Color from '../../constant/Color';
import Loading from 'react-native-loading-spinner-overlay'
import SnackBar from 'react-native-snackbar-dialog'
import RefreshEmptyView from "../Component/RefreshEmptyView";
import QcCarItem from "../Component/QcCarItem";

const {width, height} = Dimensions.get('window');

export default class QcCarPager extends Component {
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
        ApiService.getCarInfo().then((responseJson) => {
            this.setState({isRefreshing: false});
            if (!responseJson.IsErr) {
                this.setState({
                    items: responseJson.list,
                    dataSource: this.state.dataSource.cloneWithRows(responseJson.list)
                });
            } else {
                SnackBar.show(responseJson.ErrDesc);
            }
        })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试", {duration: 1500});
                this.setState({isRefreshing: false});
            }).done();
    }

    deleteCar(guid) {
        Alert.alert(
            '取消用车',
            '是否取消用车，删除本申请',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.deleteCar(guid)
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                this.props.nav.goBack(null);
                                SnackBar.show("删除成功");
                            } else {
                                SnackBar.show(responseJson.ErrDesc);
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            SnackBar.show("出错了，请稍后再试");
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                        }).done();
                }
                },
            ]
        )
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
                    renderRow={(rowData, rowID, sectionID) =>{
                        console.log(JSON.stringify(rowData));
                        return         <QcCarItem carInfo={rowData} deleteCar={() => {
                            this.deleteCar(rowData.Guid)
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
                    elevation={0}
                    title={["我的用车"]}
                    color={Color.colorIndigo}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['创建']}
                    functionArray={[
                        () => this.props.nav.goBack(null),
                        () => this.props.nav.navigate("qcCarCreate",{
                            finishFunc:()=>{
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