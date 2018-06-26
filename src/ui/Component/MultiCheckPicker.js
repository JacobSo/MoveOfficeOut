'use strict';
import React, {Component, } from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity,  StyleSheet, Dimensions, ListView} from 'react-native';
import Color from "../../constant/Color"
import PopupDialog from 'react-native-popup-dialog';
import CheckBox from "../../ui/Component/CheckBox";

const {width, height} = Dimensions.get('window');

export default class MultiCheckPicker extends Component {

    static propTypes = {
        arrayStr: PropTypes.array.isRequired,
        titleStr: PropTypes.string.isRequired,
        actionFunc: PropTypes.any.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            array: this.props.arrayStr,
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
        this.setState({dataSource: this.state.dataSource.cloneWithRows(nextProps.arrayStr)})


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
                    <Text style={{margin: 16, fontSize: 18}}>{this.props.titleStr}</Text>
                    <ListView
                        style={styles.tabView}
                        dataSource={this.state.dataSource}
                        removeClippedSubviews={false}
                        enableEmptySections={true}
                        renderRow={(rowData, rowID, sectionID) =>
                            <CheckBox
                                style={{padding: 10}}
                                isChecked={this.state.array[sectionID].IsGetIn===1}
                                onClick={() => {
                                    this.state.array[sectionID].IsGetIn = (!(this.state.array[sectionID].IsGetIn===1))?1:0

                                }}
                                rightText={rowData.title}/>
                        }/>
                    <TouchableOpacity
                        style={{width: width - 32, padding:16,alignItems: 'center'}}
                        onPress={()=>this.props.actionFunc.selectFunc(this.state.array)}>
                        <Text>确定</Text>
                    </TouchableOpacity>
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