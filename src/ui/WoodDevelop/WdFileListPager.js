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
    TouchableOpacity, Image, Text, Button,
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import AndroidModule from '../../module/AndoridCommontModule'
import IosModule from '../../module/IosCommontModule'
import {WdFilterItem} from "../Component/WdFilterItem";
import SQLite from '../../db/Sqlite';
let sqLite = new SQLite();
const {width, height} = Dimensions.get('window');

export default class WdFileListPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            isSearch :false

        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        AndroidModule.getAllPrint((result) => {
                this.state.items = JSON.parse(result);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(JSON.parse(result)),
                });
            },
            (err) => {
            })


    }

    async  _search(text) {
        return this.state.items.filter((item) => item.toLowerCase().indexOf(text.toLowerCase()) > -1);
    }
    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
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
                                margin: 32
                            }}
                            onPress={() => {
                                AndroidModule.openPrintFile(rowData)
                            }}>
                            <Text>{rowData.substring(rowData.lastIndexOf('/')+1,rowData.length)}</Text>
                            <Button style={{position: 'absolute', right: 0}} title={"发送"} onPress={() => {
                                AndroidModule.shereFile(rowData)
                            }}/>
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
