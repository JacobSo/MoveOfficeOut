/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Color from "../../constant/Color"
export default class StarSeek extends Component {
    static propTypes = {
        onSelect: PropTypes.func.isRequired,//
    };
    constructor(props) {
        super(props);
        this.state = {
            star: 0
        };
    }

    render() {
        return (
            <View style={{flexDirection: 'row',marginLeft:10}}>
                <TouchableOpacity onPress={() => {
                    this.setState({star: (this.state.star > 0 ? 0 : 1)});
                    this.props.onSelect(this.state.star > 0 ? 0 : 1);
                }}><Image
                    source={this.state.star > 0 ? require('../../drawable/star_color.png') : require('../../drawable/star_blank.png')}
                    style={{resizeMode: "contain", width: 35, height: 35, margin: 5}}/></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.setState({star: (2)});
                    this.props.onSelect(2);
                }}><Image
                    source={this.state.star > 1 ? require('../../drawable/star_color.png') : require('../../drawable/star_blank.png')}
                    style={{resizeMode: "contain", width: 35, height: 35, margin: 5}}/></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.setState({star: (3)});
                    this.props.onSelect(3);
                }}><Image
                    source={this.state.star > 2 ? require('../../drawable/star_color.png') : require('../../drawable/star_blank.png')}
                    style={{resizeMode: "contain", width: 35, height: 35, margin: 5}}/></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.setState({star: (4)});
                    this.props.onSelect(4);
                }}><Image
                    source={this.state.star > 3 ? require('../../drawable/star_color.png') : require('../../drawable/star_blank.png')}
                    style={{resizeMode: "contain", width: 35, height: 35, margin: 5}}/></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.setState({star: (5)});
                    this.props.onSelect(5);
                }}><Image
                    source={this.state.star > 4 ? require('../../drawable/star_color.png') : require('../../drawable/star_blank.png')}
                    style={{resizeMode: "contain", width: 35, height: 35, margin: 5}}/></TouchableOpacity>
            </View>
        )
    }
}

