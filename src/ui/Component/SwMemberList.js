'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import Color from "../../constant/Color";
import {View, FlatList, TouchableOpacity, Text, Dimensions} from 'react-native';
import * as ColorGroup from "../../constant/ColorGroup";
const {width, height} = Dimensions.get('window');

export default class SwMemberList extends Component {
    static propTypes = {
        items: PropTypes.any.isRequired,
        isHasBackground: PropTypes.bool.isRequired,
        addFunc: PropTypes.func.isRequired,
        editFunc: PropTypes.func.isRequired,
        disable: PropTypes.bool.isRequired,
    };

    componentWillReceiveProps(nextProps) {
    //    console.log(JSON.stringify(nextProps));

      //  this.setState({items: nextProps});
      //  console.log(this.state.items)

    }
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    render() {
        return (
            this.props.disable && this.props.items.length === 0 ? <View style={ this.props.isHasBackground ? {
                backgroundColor: 'white',
                width: width - 32,
                height: 55,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 2,
                borderRadius: 10,
                margin: 16
            } : {margin: 16}}><Text>没有协助人员</Text></View> :
                <FlatList
                    horizontal={true}
                    keyExtractor={(item, index) => item.name}
                    data={this.props.items}
                    extraData={this.state}
                    style={[{width: width - 32},
                        this.props.isHasBackground ? {
                            height: 55 + 16 + 16 + 16,
                            backgroundColor: 'white',
                            paddingLeft: 16,
                            elevation: 2,
                            borderRadius: 50,
                        } : {}
                    ]}
                    ListHeaderComponent={
                        this.props.disable ? null :
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity
                                    disabled={this.props.disable}
                                    onPress={() => this.props.addFunc()}
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 16,
                                    }}>
                                    <View style={{
                                        borderRadius: 50,
                                        width: 45,
                                        height: 45,
                                        backgroundColor: Color.content,
                                        margin: 10,
                                        elevation: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{color: 'white',}}>+</Text>
                                    </View>

                                    <Text>新增</Text></TouchableOpacity>
                            </View>}

                    renderItem={({item, index}) =>
                        <TouchableOpacity
                            disabled={this.props.disable}
                            onPress={() => {
                                this.props.editFunc(item, index);
                            }}>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 16}}>
                                <View style={{
                                    borderRadius: 50,
                                    width: 45,
                                    height: 45,
                                    backgroundColor: ColorGroup.nameColor[item.name.charCodeAt() % 13],
                                    margin: 10,
                                    elevation: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{color: 'white',}}>{item.name.substring(0, 1)}</Text>
                                </View>
                                <Text>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                />


        )
    }
}
