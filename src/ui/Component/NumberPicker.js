'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity,  StyleSheet, Dimensions, ListView} from 'react-native';
import Color from "../../constant/Color"
import PopupDialog from 'react-native-popup-dialog';

const {width, height} = Dimensions.get('window');

export default class NumberPicker extends Component {

    static propTypes = {
        arrayNumber: PropTypes.array.isRequired,
        titleStr: PropTypes.string.isRequired,
        actionFunc: PropTypes.any.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
        }


    }

    componentDidMount() {
     //   console.log(this.props.arrayNumber+'------------')
      //  this.setState({dataSource: this.state.dataSource.cloneWithRows([0])})
    }

    componentWillReceiveProps(nextProps) {
    //    console.log("^^^^^^^^^^^^^^^^"+JSON.stringify(nextProps))
        this.setState({dataSource: this.state.dataSource.cloneWithRows(nextProps.arrayNumber)})


    }
    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }
    render() {
        return (
            <PopupDialog
                ref={this.props.actionFunc.refFunc}
                width={width - 32}
                height={300}>
                <View style={styles.layoutContainer}>
                    <Text style={{margin: 16,fontSize:18}}>{this.props.titleStr}</Text>
                    <ListView
                        style={styles.tabView}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        enableEmptySections={true}
                        renderRow={(rowData, rowID, sectionID) =>
                            <TouchableOpacity
                                onPress={()=>this.props.actionFunc.selectFunc(rowData)}>
                                <Text style={{padding: 16}}>{rowData}</Text>
                            </TouchableOpacity>}/>
                </View>
            </PopupDialog>
        )
    }
}

const styles = StyleSheet.create({
    layoutContainer: {
        width: width - 32,
        flexDirection: 'column',
        height: 300,
        backgroundColor: 'white'
    },

    tabView: {
        backgroundColor: Color.trans,
        width: width,
        height: height - 25 - 55 * 2

    },
});