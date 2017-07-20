/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {View,  ScrollView, StyleSheet, RefreshControl,Text} from 'react-native';
import Color from "../../constant/Color"
export default class RefreshEmptyView extends Component {
    static propTypes = {
        onRefreshFunc: PropTypes.func.isRequired,
        isRefreshing:PropTypes.any.isRequired
    };


    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.isRefreshing}
                        onRefresh={this.props.onRefreshFunc}
                        tintColor={Color.colorBlueGrey}//ios
                        title="Loading..."//ios
                        titleColor='white'
                        colors={[Color.colorPrimary]}
                        progressBackgroundColor="white"
                    />
                }>
                <View
                    style={styles.card}>
                    <Text>没有数据</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
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
});