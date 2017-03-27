/**
 * Created by Administrator on 2017/3/14.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View, Alert, Text, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';
import App from '../../constant/Application'
const {width, height} = Dimensions.get('window');
const titleColor = {
    0: Color.colorRed,
    1: Color.colorOrange,
    2: Color.colorTeal,
    3: Color.colorIndigo,
    4: Color.colorGreen
};

export class DetailItem extends Component {
    static propTypes = {
        status: PropTypes.number.isRequired,
        work: PropTypes.any.isRequired,
        func: PropTypes.func.isRequired,
    };

    _getTitle() {
        let title;
        switch (this.props.status) {
            case 0:
                title = App.account === this.props.work.Creator ? '已驳回，请删除重建' : '已驳回';
                break;
            case 1:
                title = App.account === this.props.work.Creator ? '未审核，不能填写' : '待审核';
                break;
            case 2:
                title = App.account === this.props.work.Creator ? '已审核，点击填写' : '已审核，待填写';
                break;
            case 3:
                title = (App.workType.indexOf("项目") > -1 || App.workType.indexOf("数据") > -1)
                && !App.account === this.props.work.Creator ? "已填写，点击评分" : "已填写，待评分";
                break;
            case 4:
                title = '已完结';
                break;

        }
        return (
            <View style={{backgroundColor: titleColor[this.props.status], width: width-32, alignItems: 'center'}}>
                <Text style={{color: 'white', margin: 5}}>{title}</Text>
            </View>)
    }

    _getResult() {
        if (this.props.work.WorkResult) {
            return (
                <View><View style={{backgroundColor: Color.black_semi_transparent, width: width-32, }}>
                    <Text style={{color: 'white', padding: 10}}>对接结果</Text>
                    <Text style={{color: 'white', padding: 10}}>{this.props.work.WorkResult}</Text></View>
                    <View style={styles.line}/>
                </View>
            )
        } else
            return null;
    }

    _getDataResult(){
        if(this.props.work.ShuJuScore){
            return (
                <View>
                <View style={{backgroundColor: Color.black_semi_transparent, width: width-32,}}>
                    <Text style={{color: 'white', padding: 10}}>数据专员评分</Text>
                    <View style={{width:width-32,justifyContent:'space-between',flexDirection:'row'}}>
                        <Text style={{color: 'white', padding: 10}}>进度详细程度</Text>
                        <Text style={{color: 'white', padding: 10}}>{this.props.work.ShuJuScore.substring(4,5)}</Text>
                    </View>
                    <Text style={{width:width-32,color: 'white', padding: 10}}>{this.props.work.ShuJuSuggest}</Text></View>
                <View style={styles.line}/>
            </View>)
        }else return null;
    }

    _getProjectResult(){
        if(this.props.work.ZhuanYuanScore){
            return( <View>
                <View style={{backgroundColor: Color.black_semi_transparent, width: width-32,}}>
                    <Text style={{color: 'white', padding: 10}}>项目专员评分</Text>
                    <View style={{width:width-32,justifyContent:'space-between',flexDirection:'row'}}>
                        <Text style={{color: 'white', padding: 10}}>工作效率:结果质量:进度详细</Text>
                        <Text style={{color: 'white', padding: 10}}>{this.props.work.ZhuanYuanScore}</Text>
                    </View>
                    <Text style={{width:width-32,color: 'white', padding: 10}}>{this.props.work.ZhuanYuanSuggest}</Text></View>
                <View style={styles.line}/>
            </View>)
        }else return null;
    }

    render() {
        return (
            <TouchableOpacity
                onPress={ this.props.func}>
                <View style={styles.mainContainer}>
                    {this._getTitle()}
                    <View style={styles.textStyle}>
                        <Text >系列</Text>
                        <Text style={styles.mainText}>{this.props.work.Series}</Text>
                    </View>
                    <View style={styles.textStyle}>
                        <Text >供应商</Text>
                        <Text style={styles.mainText}>{this.props.work.SupplierName}</Text>
                    </View>
                    <View style={styles.textStyle}>
                        <Text >对接方式</Text>
                        <Text style={styles.mainText}>{this.props.work.VisitingMode}</Text>
                    </View>
                    <View style={styles.textStyle}>
                        <Text >对接内容</Text>
                        <Text style={styles.mainText}>{this.props.work.WorkContent}</Text>
                    </View>
                    {this._getResult()}
                    {this._getDataResult()}
                    {this._getProjectResult()}



                </View></TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create(
    {
        mainContainer: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundColor: 'white',
            elevation: 2,
            margin: 16,
        },

        textStyle: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: width - 52,
            marginLeft: 10,
            marginBottom: 5,
            marginTop: 5
        },

        mainText:{
            color: Color.black_semi_transparent,
            width:width-200,
            textAlign:'right'
        },

        line: {
            backgroundColor: Color.line,
            width: width - 32,
            height: 1,

        },
    });
