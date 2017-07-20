/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity, Image, StyleSheet, TextInput,} from 'react-native';
import Color from "../../constant/Color"
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default class Toolbar extends Component {
    static propTypes = {
        title: PropTypes.array.isRequired,//[title subtitle]
        color: PropTypes.string.isRequired,
        elevation: PropTypes.number.isRequired,
        isHomeUp: PropTypes.bool.isRequired,
        isAction: PropTypes.bool.isRequired,
        isActionByText: PropTypes.bool.isRequired,
        actionArray: PropTypes.array.isRequired,
        functionArray: PropTypes.array.isRequired,//[home up,action1,action1]
    };

    constructor(props) {
        super(props);

    }

    _getHomeUp() {
        if (this.props.isHomeUp || this.props.isSearch) {
            return (
                <TouchableOpacity onPress={this.props.functionArray[0]}
                                  style={{paddingTop: 16, paddingRight: 32, paddingBottom: 16}}>
                    <Image style={styles.home}
                           source={ require('../../drawable/action_back.png')}/></TouchableOpacity>)
        }
    }

    getDrawer() {
        if (this.props.isDrawer) {
            return (
                <TouchableOpacity onPress={this.props.drawerFunc}
                                  style={{paddingTop: 16, paddingRight: 32, paddingBottom: 16}}>
                    <Image style={styles.home}
                           source={ require('../../drawable/draw_menu.png')}/></TouchableOpacity>)
        }
    }


    _getTitle() {
        if (!this.props.isSearch) {
            if (this.props.title.length === 1) {
                return (<Text style={styles.title}>{this.props.title[0]}</Text>)
            } else {
                return (
                    <View style={styles.multiTitle}>
                        <Text style={styles.title}>{this.props.title[0]}</Text>
                        <Text style={styles.subtitle}>{this.props.title[1]}</Text>

                    </View>

                )
            }
        }

    }

    _getAction() {
        if (this.props.isAction && !this.props.isSearch) {
            if (this.props.isActionByText) {//text menu
                return (
                    <View style={styles.actionBackground}>
                        <TouchableOpacity onPress={this.props.functionArray[1]}>
                            <Text style={styles.actionText}>{this.props.actionArray[0]}</Text></TouchableOpacity>
                        {(() => {
                            if (this.props.actionArray.length === 2) {
                                return (
                                    <TouchableOpacity onPress={this.props.functionArray[2]}>
                                        <Text
                                            style={styles.actionText}>{this.props.actionArray[1]}</Text></TouchableOpacity>
                                )
                            }
                        })()}
                    </View>)
            } else {//icon menu
                return (
                    <View style={styles.actionBackground}>
                        <TouchableOpacity onPress={this.props.functionArray[1]}>
                            <Image style={styles.actionIcon}
                                   source={ this.props.actionArray[0]}/></TouchableOpacity>
                        {(() => {
                            if (this.props.actionArray.length === 2) {
                                return (
                                    <TouchableOpacity onPress={this.props.functionArray[2]}>
                                        <Image style={styles.actionIcon}
                                               source={ this.props.actionArray[1]}/></TouchableOpacity>
                                )
                            }
                        })()}
                    </View>)
            }
        }
    }

    getSearchView() {
        if (this.props.isSearch) {
            return ( <TextInput style={styles.textInput}
                                placeholder="搜索"
                                returnKeyType={'done'}
                                blurOnSubmit={true}
                                placeholderTextColor={'white'}
                                selectionColor={'white'}
                                underlineColorAndroid="transparent"
                                onChangeText={(text)=>this.props.searchFunc(text)}/>)
        }
    }

    render() {
        return (
            <View style={[styles.common, {elevation: this.props.elevation, backgroundColor: this.props.color,}]}>
                { this._getHomeUp()}
                { this._getTitle()}
                {this._getAction()}
                {this.getSearchView()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    common: {
        height: 55,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        padding: 16,

        width: width,
    },

    multiTitle: {
        flexDirection: 'column',
    },
    title: {
        color: 'white',
        fontSize: 18,
    },
    subtitle: {
        color: Color.background,
        fontSize: 15,
    },

    home: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },

    actionBackground: {
        right: 0,
        height: 55,
        position: 'absolute',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionText: {
        color: 'white',
        padding: 10
    },
    actionIcon: {
        width: 25,
        height: 25,
        margin: 13,
    },
    textInput: {
        width: width - 32,
        height: 45,
        marginLeft: 16,
        marginRight: 16,
        paddingBottom:16,
        borderColor: Color.line,
        borderBottomWidth: 1,
        color:'white'
    },
});