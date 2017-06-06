/**
 * Created by Administrator on 2017/3/14.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, Platform, TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';
import {CachedImage, ImageCache} from "react-native-img-cache";
const {width, height} = Dimensions.get('window');
export default class QcProductItem extends Component {
    static propTypes = {
        product: PropTypes.any.isRequired,
        func: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            statusText: "待质检",
            statusColor: Color.content,
            isAllFinish: false,

        }
    }

    componentDidMount() {
        this.setStatus();
    }

    setStatus() {

    }



    render() {
        //   console.log(JSON.stringify(this.props.task));
        return (
            <TouchableOpacity
                onPress={this.props.func}>
                <View style={styles.mainContainer}>

                </View>
            </TouchableOpacity>
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
            width: width,
            height: 1,
            marginTop: 16,
            marginBottom: 16,
            marginLeft: -32
        }

    });

