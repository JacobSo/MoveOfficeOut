/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    TouchableOpacity, Platform, Text, Share, Alert
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import AndroidModule from '../../module/AndoridCommontModule'
import IosModule from '../../module/IosCommontModule'
import SnackBar from 'react-native-snackbar-dialog'
import RefreshEmptyView from "../Component/RefreshEmptyView";

const {width, height} = Dimensions.get('window');
const RNFS = require('react-native-fs');
export default class WdFileListPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            isSearch: false
        };
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            AndroidModule.getAllPrint((result) => {
                    this.state.items = JSON.parse(result);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(JSON.parse(result)),
                    });
                },
                (err) => {
                })
        } else {
            IosModule.getAllPrint((result) => {
                    //console.log(result)
                    // SnackBar.show(result)
                    if (result) {
                        this.state.items = JSON.parse(result);
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(result)),
                        });
                    } else this.props.nav.goBack(null)

                },
                (err) => {
                })
        }
    }

    async  _search(text) {
        return this.state.items.filter((item) => item.toLowerCase().indexOf(text.toLowerCase()) > -1);
    }

    render() {
        return (
            <View style={{
                flex: 1,
            }}>
                <Toolbar
                    elevation={2}
                    title={['报表']}
                    color={Color.colorDeepOrange}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require("../../drawable/search.png")]}
                    functionArray={
                        [
                            () => {
                                if (this.state.isSearch) {
                                    this.setState({
                                        isSearch: !this.state.isSearch,
                                    })
                                } else
                                    this.props.nav.goBack(null)
                            },
                            () => {
                                this.setState({
                                    isSearch: !this.state.isSearch,
                                })
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
                    (() => {
                        if (this.state.items.length === 0) {
                            return (<RefreshEmptyView isRefreshing={false} onRefreshFunc={() => {
                            }}/>)
                        }
                    })()
                }

                <ListView
                    ref="scrollView"
                    style={styles.tabView}
                    dataSource={this.state.dataSource}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    renderRow={(rowData, sectionID, rowID) =>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                height: 65,
                                marginRight: 16,
                                marginLeft: 16,

                            }}
                            onPress={() => {
                                // SnackBar.show(rowData)
                                if (Platform.OS === 'android') {
                                    // AndroidModule.openOfficeFile(rowData);
                                    AndroidModule.shereFile(rowData)
                                } else {
                                    //   console.log(rowData);
                                    /*   this.props.nav.navigate('web', {
                                     filePath: rowData
                                     })*/
                                    Share.share({
                                            url: rowData,
                                            title: 'React Native'
                                        },
                                        {
                                            dialogTitle: 'Share React Native website',
                                            excludedActivityTypes: [
                                                'com.apple.UIKit.activity.PostToTwitter'
                                            ],
                                            tintColor: 'green'
                                        })
                                    // .then(this._showResult)
                                        .catch((error) => this.setState({result: 'error: ' + error.message}));
                                }
                            }}>
                            <Text style={{                width:width/3*2}}>{rowData.substring(rowData.lastIndexOf('/') + 1, rowData.length)}</Text>
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    backgroundColor: Color.line,
                                    padding: 10,
                                    borderRadius: 10
                                }}
                                onPress={() => {
                                    return RNFS.unlink(rowData)
                                        .then(() => {
                                            Alert.alert(
                                                '删除？',
                                                "删除"+rowData.substring(rowData.lastIndexOf('/') + 1, rowData.length),
                                                [
                                                    {
                                                        text: '取消', onPress: () => {
                                                    }
                                                    },
                                                    {
                                                        text: '确定', onPress: () => {
                                                        console.log('FILE DELETED');
                                                        this.state.items.splice(rowID, 1);
                                                        this.setState({dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))});
                                                        SnackBar.show("删除成功");
                                                    }
                                                    },
                                                ]
                                            );
                                        })
                                        .catch((err) => {
                                            console.log(err.message);
                                            SnackBar.show("删除失败");
                                        });
                                }}>
                                <Text style={{color: 'white'}}>删除</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
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
        },
    });
