'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableOpacity, Text, Dimensions} from 'react-native';

import Color from "../../constant/Color";
import * as ColorGroup from "../../constant/ColorGroup";
const {width, height} = Dimensions.get('window');

export default class SwCountItem extends Component {
    static propTypes = {
        item: PropTypes.any.isRequired,
        action: PropTypes.func.isRequired
    };


    render() {
        return (
            <TouchableOpacity onPress={() => this.props.action()}>
                <View style={styles.viewContainer}>
                    <View style={{marginBottom: 16, flexDirection: 'row'}}>
                        <View
                            style={[styles.headContainer, {backgroundColor: ColorGroup.nameColor[this.props.item.UserName.charCodeAt() % 13],}]}>
                            <Text style={{color: 'white',}}>{this.props.item.UserName.substring(0, 1)}</Text>
                        </View>
                        <View >
                            <Text style={{color: 'black', fontSize: 18, margin: 10}}>{this.props.item.UserName}</Text>
                            <View style={styles.statusLineContainer}>
                                <Text >待审核</Text>
                                <View style={[styles.statusCountContainer, {backgroundColor: this.props.item.submited ? Color.colorAccent : Color.colorGrey,}]}>
                                    <Text style={{color: "white"}}>{this.props.item.submited ? this.props.item.submited : '0'}</Text></View>
                            </View>
                            <View style={styles.statusLineContainer}>
                                <Text >处理中</Text>
                                <View style={[styles.statusCountContainer, {backgroundColor: this.props.item.processing ? Color.colorAccent : Color.colorGrey,}]}>
                                    <Text style={{color: "white"}}>{this.props.item.processing ? this.props.item.processing : '0'}</Text></View>
                            </View>

                            <View style={styles.statusLineContainer}>
                                <Text >待评分</Text>
                                <View style={[styles.statusCountContainer, {backgroundColor: this.props.item.waitscore ? Color.colorAccent : Color.colorGrey,}]}>
                                    <Text style={{color: "white"}}>{this.props.item.waitscore ? this.props.item.waitscore : '0'}</Text>
                                </View>
                            </View>
                            <View style={styles.statusLineContainer}>
                                <Text >协助工作</Text>
                                <View style={[styles.statusCountContainer, {backgroundColor: this.props.item.assisting ? Color.colorAccent : Color.colorGrey,}]}>
                                    <Text style={{color: "white"}}>{this.props.item.assisting ? this.props.item.assisting : '0'}</Text></View>
                            </View>
                        </View>
                    </View>

                    <View style={{width: width - 32, height: 1, backgroundColor: Color.line}}/>

                    <View style={{flexDirection: 'row', justifyContent: 'center', margin: 10}}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{
                                width: 50,
                                height: 3,
                                backgroundColor: this.props.item.Scorelist[0] && this.props.item.Scorelist[0].s1 ? Color.colorRed : Color.line,
                                marginBottom: 5
                            }}/>
                            <Text>不及格</Text>
                            <Text>{this.props.item.Scorelist[0] && this.props.item.Scorelist[0].s1 ? this.props.item.Scorelist[0].s1 : "0"}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{
                                width: 50,
                                height: 3,
                                backgroundColor: this.props.item.Scorelist[0] && this.props.item.Scorelist[0].s2 ? Color.colorYellow : Color.line,
                                marginBottom: 5
                            }}/>
                            <Text>及格</Text>
                            <Text>{this.props.item.Scorelist[0] && this.props.item.Scorelist[0].s2 ? this.props.item.Scorelist[0].s2 : "0"}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{
                                width: 50,
                                height: 3,
                                backgroundColor: this.props.item.Scorelist[0] && this.props.item.Scorelist[0].s3 ? Color.colorOrange : Color.line,
                                marginBottom: 5
                            }}/>
                            <Text>良好</Text>
                            <Text>{this.props.item.Scorelist[0] && this.props.item.Scorelist[0].s3 ? this.props.item.Scorelist[0].s3 : "0"}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{
                                width: 50,
                                height: 3,
                                backgroundColor: this.props.item.Scorelist[0] && this.props.item.Scorelist[0].s4 ? Color.colorLightBlue : Color.line,
                                marginBottom: 5
                            }}/>
                            <Text>优秀</Text>
                            <Text>{this.props.item.Scorelist[0] && this.props.item.Scorelist[0].s4 ? this.props.item.Scorelist[0].s4 : "0"}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{
                                width: 50,
                                height: 3,
                                backgroundColor: this.props.item.Scorelist[0] && this.props.item.Scorelist[0].s5 ? Color.colorGreen : Color.line,
                                marginBottom: 5
                            }}/>
                            <Text>卓越</Text>
                            <Text>{this.props.item.Scorelist[0] && this.props.item.Scorelist[0].s5 ? this.props.item.Scorelist[0].s5 : "0"}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    viewContainer: {
        margin: 16,
        elevation: 2,
        backgroundColor: 'white',
        borderRadius: 10
    },
    headContainer: {
        borderRadius: 50,
        width: 55,
        height: 55,

        margin: 10,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusLineContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width / 3 * 2,
        paddingLeft: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
    statusCountContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 10,
        width: 40,
        backgroundColor: Color.colorGrey,
    }

});