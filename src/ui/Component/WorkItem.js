'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';

const {width, height} = Dimensions.get('window');

export class WorkItem extends Component {
    static propTypes = {
        work: PropTypes.any.isRequired,
        func: PropTypes.func.isRequired,
    };

    _qq() {
        if (this.props.work.wayQQ) {
            return (
                <View style={[styles.iconCircle, {backgroundColor: Color.colorTeal}]}>
                    <Image style={{width: 25, height: 25, resizeMode: 'contain'}}
                           source={require('../../drawable/way_qq.png')}/>
                </View>)
        } else return null;

    }

    _call() {
        if (this.props.work.wayCall) {
            return (
                <View style={[styles.iconCircle, {backgroundColor: Color.colorIndigo}]}>
                    <Image style={{width: 25, height: 25, resizeMode: 'contain'}}
                           source={require('../../drawable/way_call.png')}/>
                </View>)
        } else return null;
    }

    _meet() {
        if (this.props.work.wayMeet) {
            return (
                <View style={[styles.iconCircle, {backgroundColor: Color.colorBlueGrey}]}>
                    <Image style={{width: 25, height: 25, resizeMode: 'contain'}}
                           source={require('../../drawable/way_meet.png')}/>
                </View>)
        } else return null;
    }

    render() {
        return (

            <TouchableOpacity onPress={this.props.func}>
                <View
                    style={styles.card}>
                    <View style={{flexDirection: 'row', width: width, justifyContent: 'space-around'}}>
                        {this._qq()}
                        {this._call()}
                        {this._meet()}

                    </View>
                    <View style={styles.line}/>
                    <View style={{flexDirection: 'column', width: width - 48, }}>
                        <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
                            <Text style={{marginBottom: 16,}}>系列</Text>
                            <Text style={{marginBottom: 16, textAlign: 'right', width: 200}}>{this.props.work.Series}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
                        <Text style={{marginBottom: 16}}>供应商</Text>
                            <Text style={{marginBottom: 16, textAlign: 'right', width: 200}}>{this.props.work.SupplierName}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
                            <Text>对接内容</Text>
                            <Text style={{textAlign: 'right', width: 200}}>{this.props.work.WorkContent}</Text>
                        </View>
                    </View>

                </View>

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create(
    {
        card: {
            flex: 1,
            borderWidth: 1,
            backgroundColor: 'white',
            borderColor: Color.trans,
            margin: 16,
            padding: 15,
            shadowColor: Color.background,
            shadowOffset: {width: 2, height: 2,},
            shadowOpacity: 0.5,
            shadowRadius: 3,
            alignItems: 'center',
            elevation: 2,
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius:10

        },
        iconCircle: {
            width: 55,
            height: 55,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center'
        },
        line: {
            backgroundColor: Color.line,
            width: width - 32,
            height: 1,
            marginTop: 16,
            marginBottom: 16,

        }
    });
