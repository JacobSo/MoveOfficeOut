/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    Alert,
    Button,
    ListView,
    Text,
    StyleSheet,
    Dimensions, TouchableOpacity,
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';
import Color from '../../constant/Color';
import {WdProductItem} from "../Component/WdProductItem";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
const {width, height} = Dimensions.get('window');

import {WdActions} from "../../actions/WdAction";
class WdProductListPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.task.Itemlist,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isSearch: false,
            isHeader: true,
            aNum: 0,
            bNum: 0,
            cNum: 0,
        }
    }

    componentDidMount() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
        });
        this.countNumber();
    }

    componentWillReceiveProps(newProps) {
        this.countNumber();
        //console.log("product:componentWillReceiveProps")
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
        });
        /*        this.state.items[newProps.position] = newProps.product;
         console.log(JSON.stringify( this.state.items) + '-------------------------')*/

    }

    countNumber() {
        let aNum = 0;
        let bNum = 0;
        let cNum = 0;

        this.props.task.Itemlist.map((data) => {
            if (data.pResultList.indexOf("0-1") > -1) {
                aNum++;
            }
            if (data.pResultList.indexOf("1-1") > -1) {
                bNum++;
            }
            if (data.pResultList.indexOf("2-1") > -1) {
                cNum++;
            }
        });

        this.setState({
            aNum: aNum,
            bNum: bNum,
            cNum: cNum,
        })
    }

    printSelection() {
        return (
            <PopupDialog
                ref={(popupDialog) => {
                    this.popupDialog = popupDialog;
                }}
                width={width - 32}
                height={55*4}>
                <View style={styles.layoutContainer}>
                    <TouchableOpacity onPress={() => {
                        this.popupDialog.dismiss();

                    }}>
                        <Text style={{margin: 16}}>查看生成报表</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {

                        this.popupDialog.dismiss();
                    }}>
                        <Text style={{margin: 16}}>白胚评审报表</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {

                        this.popupDialog.dismiss();
                    }}>
                        <Text style={{margin: 16}}>成品评审报表</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {

                        this.popupDialog.dismiss();
                    }}>
                        <Text style={{margin: 16}}>包装评审报表</Text>
                    </TouchableOpacity>
                </View>

            </PopupDialog>
        )
    }

    getHeaderView() {
        if (this.state.isHeader) {
            return (<View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.nav.navigate(
                                'wdFilter',
                                {
                                    task: this.props.task,
                                    step: 1, stepName: '白胚评审进度'
                                },
                            );
                        }}
                        style={{alignItems: 'center'}}>
                        <View style={styles.iconCircle}>
                            <Text>{this.state.aNum}</Text></View>
                        <Text >白胚</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.nav.navigate(
                            'wdFilter',
                            {task: this.props.task, step: 2, stepName: '成品评审进度'},
                        );
                    }} style={{alignItems: 'center'}}>
                        <View style={styles.iconCircle}>
                            <Text>{this.state.bNum}</Text></View>
                        <Text>成品</Text></TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.props.nav.navigate(
                            'wdFilter',
                            {task: this.props.task, step: 3, stepName: '包装评审进度'},
                        );
                    }} style={{alignItems: 'center'}}>
                        <View style={styles.iconCircle}>
                            <Text>{this.state.cNum}</Text></View>
                        <Text>包装</Text></TouchableOpacity>


                </View>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 10, alignItems: 'center'}}>

                    <TouchableOpacity
                        onPress={() => {
                            let temp = "";
                            if (this.props.task.sMaterialText) {
                                this.props.task.sMaterialText.map((data) => {
                                    temp += ('\n' + data.mContent + ':' + data.mTitle + '\n')
                                })
                            }
                            Alert.alert(
                                this.props.task.SeriesName,
                                "预约评审时间：" + this.props.task.SeriesName + '\n' +
                                "工厂：" + this.props.task.FacName + '\n' +
                                "电话：" + this.props.task.sFactoryCall + '\n' +
                                "地址：" + this.props.task.sFactoryAdress + '\n' +
                                "整体要求：" + this.props.task.sQualityText + '\n' +
                                "材料：" + temp + '\n',

                                [
                                    {
                                        text: '确认', onPress: () => {
                                    }
                                    },
                                ]
                            )
                        }}>
                        <Text style={{margin: 16}}>系列信息
                        </Text></TouchableOpacity>
                    <Button style={{marginRight: 10, marginLeft: 10}}
                            title="生成报告"
                            onPress={
                                () => this.popupDialog.show()
                            }
                            color={Color.colorAccent}/>
                </View>
            </View>)
        }
    }

    async  _search(text) {
        return this.state.items.filter((item) => item.ItemName.toLowerCase().indexOf(text.toLowerCase()) > -1);
    }

    render() {
        console.log("product list render")
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={0}
                    title={[this.props.task.SeriesName, "产品列表"]}
                    color={Color.colorDeepOrange}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={["搜索", "完成"]}
                    functionArray={[
                        () => {
                            if (this.state.isSearch) {
                                this.setState({
                                    isSearch: !this.state.isSearch,
                                    isHeader: true
                                })
                            } else
                                this.props.nav.goBack(null)
                        },
                        () => {
                            this.setState({
                                isSearch: !this.state.isSearch,
                                isHeader: false
                            })
                        },
                        () => {

                        },
                    ]}
                    isSearch={this.state.isSearch}
                    searchFunc={(text) => {
                        this._search(text).then((array) => {
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
                    renderHeader={() => this.getHeaderView()}
                    renderRow={(rowData, rowID, sectionID) =>
                        <WdProductItem
                            key={sectionID}
                            product={rowData}
                            func={() => {
                                this.props.actions.updateProduct(rowData, sectionID);
                                this.props.nav.navigate(
                                    'wdDetail',
                                    {
                                        product: rowData,
                                        position: sectionID
                                    },
                                );
                            }}
                        />
                    }/>
                {this.printSelection()}
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
        },
        panelContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: 1
        },
        iconContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: width - 32,
            margin: 16,
        },

        iconCircle: {
            flex: 1,
            width: 55,
            height: 55,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: Color.line
        },
        layoutContainer: {
            width: width - 32,
            height: 55*4,
            backgroundColor: 'white'
        },
    });
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
export default connect(mapStateToProps, mapDispatchToProps)(WdProductListPager);