/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Color from '../../constant/Color'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class PreferencesTextItem extends Component {
    static propTypes = {
        group: PropTypes.string.isRequired,
        items: PropTypes.array.isRequired,//[[title,summary],[title,summary]]
        functions: PropTypes.array.isRequired,//[func,func]
    };



    render() {
        const pages = this.props.items.map((array, index) =>
            <TouchableOpacity key={index} onPress={ this.props.functions[index]}>
                <View>
                    <Text style={styles.title}>{array[0]}</Text>
                    <Text style={styles.summary}>{array[1]}</Text>
                    <View style={{
                        backgroundColor: Color.line,
                        width: width,
                        height: 1,
                        marginTop: 16,
                        marginBottom: 16
                    }}/>
                </View>
            </TouchableOpacity>
        );
        return (
            <View style={styles.container}>
                <Text style={styles.group}>{this.props.group}</Text>
                {pages}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',

    },
    group: {
        margin: 16,
        color: Color.colorPrimary
    },

    title: {
        marginLeft: 16,
        color: 'black'
    },
    summary: {
        marginLeft: 16,
        color: Color.content
    }

});
