/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {View, Image, TouchableOpacity, FlatList, Text, Dimensions} from 'react-native';
import Color from "../../constant/Color";
import {CachedImage} from "react-native-img-cache";

const {width, height} = Dimensions.get('window');

export default class SwFeedbackItem extends Component {
    static propTypes = {
        data: PropTypes.any.isRequired,
        host: PropTypes.string.isRequired,
        //     dataSourcePic: PropTypes.any.isRequired,
        galleryFunc: PropTypes.func.isRequired

    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    getDate(tmp) {
        let date = eval('new ' + eval(tmp).source)
        return date.getMonth() + '-' + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    }

    render() {
        console.log(this.props.data)
        return (
            <View style={{
                width: width - 32,
                borderRadius: 10,
                backgroundColor: 'white',
                margin: 16,
                elevation: 2,
                overflow: 'hidden'
            }}>
                <Text style={{
                    color: 'white',
                    backgroundColor:this.props.host === this.props.data.fbCreator ?  Color.colorCyanDark:Color.colorBlueGrey,
                    textAlign: 'center',
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    padding: 5,
                }}>{this.props.host === this.props.data.fbCreator ? '主理人' : '协助人'}</Text>

                <Text style={{
                    margin: 16,
                    fontWeight: 'bold'
                }}>{this.props.data.fbContent}</Text>
                {
                    (() => {
                        if (this.props.data.scImages) {
                            return <FlatList
                                //   keyExtractor={(item, index) => item.fbguid}
                                numColumns={4}
                                data={this.props.data.scImages.split(',')}
                                renderItem={({item}) =>
                                    <TouchableOpacity
                                        onPress={() => this.props.galleryFunc()}>
                                        <CachedImage
                                            resizeMode="contain"
                                            style={{width: 55, height: 55, marginLeft: 16, marginBottom: 16}}
                                            source={{uri: item}}/>
                                    </TouchableOpacity>}/>
                        }
                    })()
                }


                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: width - 32,
                    paddingBottom: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderTopWidth: 1,
                    borderColor: Color.line,
                    paddingTop: 10
                }}>
                    <View/>
                    <Text
                        style={{color: Color.black_semi_transparent}}>{this.props.data.fbCreator + ' 于 ' + this.getDate(this.props.data.fbCreateTime) + ' 提交'}  </Text>
                </View>
            </View>

        )
    }
}
