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
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import AndroidModule from '../../module/AndoridCommontModule'
import Loading from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';
import {WdFilterItem} from "../Component/WdFilterItem";
import SQLite from '../../db/Sqlite';
let sqLite = new SQLite();
const {width, height} = Dimensions.get('window');

export default class WdProductFilterPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.task.Itemlist,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            isSearch: false,
            isHeader: true,
            allSelect: false,
            isLoading: false,

            problemList: []
        };
    }

    componentDidMount() {
        this.state.items.map((data) => {
            data.check = false;
        });
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
        });
        this.getProblemLocal();
        //   this.countNumber();
    }

    getProblemLocal() {
        this.props.task.Itemlist.map((data) => {
            sqLite.getWdDraftContent(data.ItemGuid, this.props.step)
                .then((result) => {
                    this.state.problemList.push(result);
                }).done();
        });
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={2}
                    title={[this.props.stepName, this.props.task.SeriesName,]}
                    color={Color.colorDeepOrange}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={this.props.selectMode ? ["全选", "打印"] : []}
                    functionArray={
                        this.props.selectMode ?
                            [
                                () => {
                                    this.props.nav.goBack(null)
                                },
                                () => {
                                    this.state.allSelect = !this.state.allSelect;
                                    this.state.items.map((data) => {
                                        data.check = this.state.allSelect;
                                    });
                                    this.setState({
                                        dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),
                                    })
                                },
                                () => {

                                    if (this.state.problemList.length === this.props.task.Itemlist.length) {
                                        let selectCount = 0;
                                        this.state.items.map((data,index) => {
                                            if (data.check)
                                                selectCount++;
                                            data.problem = this.state.problemList[index];
                                        });
                                        if (selectCount === 0) {
                                            Toast.show("请选择一个产品打印");
                                            return
                                        }
                                        this.setState({isLoading: true});
                                        let tempSeries = this.props.task;
                                        tempSeries.Itemlist = this.state.items;
                                        console.log(JSON.stringify(tempSeries));
                                        AndroidModule.outputReportAction(
                                            JSON.stringify(tempSeries),
                                            this.props.step-1,
                                            (result) => {
                                                setTimeout(() => {
                                                    this.setState({isLoading: false})
                                                }, 100);
                                                Toast.show(result)
                                            },
                                            (error)=>{
                                                setTimeout(() => {
                                                    this.setState({isLoading: false})
                                                }, 100);
                                                Toast.show(error)
                                            })
                                    } else Toast.show('正在获取填写内容，请稍后')
                                }
                            ] :
                            [
                                () => {
                                    this.props.nav.goBack(null)
                                },
                            ]}
                />

                <ListView
                    ref="scrollView"
                    style={styles.tabView}
                    dataSource={this.state.dataSource}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    contentContainerStyle={styles.listStyle}
                    renderRow={(rowData, sectionID, rowID) =>
                        <View
                            style={{backgroundColor: rowData.check ? Color.colorDeepOrangeDark : Color.trans}}>
                            < WdFilterItem
                                key={sectionID}
                                step={this.props.step}
                                product={rowData}
                                selectMode={this.props.selectMode}
                                func={() => {
                                    if (this.props.selectMode) {
                                        this.state.items[rowID].check = !this.state.items[rowID].check;
                                        this.setState({
                                            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),
                                        });
                                    } else {
                                        this.props.nav.navigate(
                                            'wdDetail',
                                            {product: rowData,},
                                        );

                                    }

                                }}
                            /></View>
                    }/>
                <Loading visible={this.state.isLoading}/>
            </View>
        )
    }
}
const styles = StyleSheet.create(
    {
        listStyle: {
            flexDirection: 'row', //改变ListView的主轴方向
            flexWrap: 'wrap', //换行
        },

        tabView: {
            backgroundColor: Color.trans,
            width: width,
        },


    });
