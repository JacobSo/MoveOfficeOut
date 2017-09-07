/**
 * Created by Administrator on 2017/3/14.
 */
'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import Color from '../../constant/Color';
import {CachedImage} from "react-native-img-cache";
const {width, height} = Dimensions.get('window');

export class AsProductEditor extends Component {
    static propTypes = {
        product: PropTypes.any.isRequired,
        saveFunc: PropTypes.func.isRequired,
        deleteFunc: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isInfo: false,
            editContent: this.props.product.comment,
        }
    }

    render() {
        return (
            <View>
                <View style={styles.productItemContainer}>
                    <Text>{this.props.product.item_name}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isInfo: !this.state.isInfo})
                            }}>
                            <Image source={require('../../drawable/info_icon.png')}
                                   style={{width: 22, height: 22}}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.props.deleteFunc()
                            }>
                            <Image source={require('../../drawable/close_post_label.png')}
                                   style={{width: 25, height: 25, marginLeft: 16}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    (() => {
                        if (this.state.isInfo) {
                            return <View style={{
                                flexDirection: 'row',
                                marginBottom: 16
                            }}>
                                <CachedImage
                                    resizeMode="contain"
                                    style={{width: 100, height: 100,}}
                                    source={{uri: this.props.product.img_path ? this.props.product.img_path : '-'}}/>
                                <View>
                                    <Text style={{
                                        margin: 5,
                                        width: 165
                                    }}>{"编码：" + this.props.product.item_code}</Text>
                                    <Text style={{margin: 5, width: 165}}>{this.props.product.SkuName}</Text>
                                </View>
                            </View>
                        }
                    })()
                }

                <TextInput style={styles.productEdit}
                           multiline={true}
                           defaultValue={this.state.editContent}
                           placeholder={this.props.product.item_name + "的异常描述"}
                           returnKeyType={'done'}
                           underlineColorAndroid="transparent"
                           placeholderTextColor={'white'}
                           blurOnSubmit={true}
                           onChangeText={(text) => {
                               this.setState({editContent: text});
                               this.props.saveFunc(text)

                           }}
                           onBlur={() => {
                           }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    productItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width - 64,
        marginTop: 16,
        marginBottom: 16,
    },
    productEdit: {
        width: width - 64,
        height: 65,
        padding: 5,
        borderRadius: 10,
        textAlign: 'center',
        backgroundColor: Color.line,
    }
});

