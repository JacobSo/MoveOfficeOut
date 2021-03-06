
'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';
import App from '../../constant/Application';

const {width, height} = Dimensions.get('window');

export class WdMainItem extends Component {
    static propTypes = {
        task: PropTypes.any.isRequired,
        func: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            aNum: 0,
            bNum: 0,
            cNum: 0,
        }
    }

    componentDidMount() {
     //   console.log("componentDidMount");
        this.countNumber(this.props.task.Itemlist);//init

    }

    componentWillReceiveProps(newProps) {
     //   console.log("componentWillReceiveProps:"+JSON.stringify(newProps));
       this.countNumber(newProps.task.Itemlist);
    }
    componentDidUpdate(preProps, preState) {
      //  console.log("componentDidUpdate");
    }
    componentWillUpdate(nextProps, nextState) {
      //  console.log("componentWillUpdate");
    }
    countNumber(list) {
        let aNum = 0;
        let bNum = 0;
        let cNum = 0;
        if (list) {
            list.map((data) => {
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
    }

    render() {
        //   console.log(JSON.stringify(this.props.task));
        return (
            <TouchableOpacity
                onPress={ this.props.func}>
                <View style={styles.mainContainer}>
                    <View style={styles.iconContainer}>
                        <View
                            style={{alignItems: 'center'}}>
                            <View style={styles.iconCircle}>
                                <Text>{this.state.aNum}</Text></View>
                            <Text>{App.workType.indexOf("板木驻厂工程师")>-1?'白胚':'木架'}</Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <View style={styles.iconCircle}>
                                <Text>{this.state.bNum}</Text></View>
                            <Text>成品</Text></View>

                        <View style={{alignItems: 'center'}}>
                            <View style={styles.iconCircle}>
                                <Text>{this.state.cNum}</Text></View>
                            <Text>包装</Text></View>

                    </View>
                    <View style={styles.line}/>
                    {
                        (() => {
                            if (App.workType.indexOf("板木驻厂工程师")>-1) {
                                return <View style={styles.textStyle}>
                                    <Text >系列</Text>
                                    <Text style={{
                                        backgroundColor: Color.colorAccent,
                                        color: 'white'
                                    }}>{this.props.task.SeriesName}</Text>
                                </View>
                            }
                        })()

                    }

                    <View style={styles.textStyle}>
                        <Text >工厂</Text>
                        <Text >{this.props.task.FacName}</Text>
                    </View>
                    <View style={styles.textStyle}>
                        <Text >预约时间</Text>
                        <Text >{this.props.task.Appointtime}</Text>
                    </View>

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
            marginBottom: 32,
            marginLeft: 16,
            marginRight: 16,
            marginTop: 10,
            paddingTop: 10,
            borderRadius:10
        },

        iconContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: width - 32,
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


        textStyle: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: width - 48,
            marginLeft: 8,
            marginBottom: 10
        },
        line: {
            backgroundColor: Color.line,
            width: width - 32,
            height: 1,
            marginTop: 16,
            marginBottom: 16,
        }

    });
