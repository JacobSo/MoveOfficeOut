/**
 * Created by Administrator on 2017/3/14.
 */
'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions, ListView} from 'react-native';
import Color from '../../constant/Color';
import {CachedImage} from "react-native-img-cache";
const {width, height} = Dimensions.get('window');
const ImagePicker = require('react-native-image-picker');
const options = {
    quality: 0.2,
    noData: true,
    storageOptions: {
        skipBackup: true,//not icloud
        path: 'images'
    }
};
export class AsProductEditor extends Component {
    static propTypes = {
        product: PropTypes.any.isRequired,
        saveFunc: PropTypes.func.isRequired,
        deleteFunc: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
/*            pics:this.props.product.pic?this.props.product.pic:[],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),*/
            isInfo: false,
            editContent: this.props.product.remark,
        }
    }
    componentDidMount(){
        //this.setState({dataSource: this.state.dataSource.cloneWithRows(this.state.pics),});

    }

    render() {
        return (
            <View>
                <View style={styles.productItemContainer}>
                    <Text>{this.props.product.item_name}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
{/*                        <TouchableOpacity
                            onPress={() => {
                                ImagePicker.showImagePicker(options, (response) => {
                                    if (!response.didCancel) {
                                        this.state.pics.push(response);
                                        this.setState({dataSource: this.state.dataSource.cloneWithRows(this.state.pics),});
                                    }
                                });
                            }}>
                            <Image source={require('../../drawable/post_cam.png')}
                                   style={{width: 22, height: 22}}/>
                        </TouchableOpacity>*/}
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isInfo: !this.state.isInfo})
                            }}>
                            <Image source={require('../../drawable/info_icon.png')}
                                   style={{width: 22, height: 22,marginLeft: 16}}/>
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
                                    style={{width: 100, height: 100,margin: 5}}
                                    source={{uri: this.props.product.img_path ? this.props.product.img_path : '-'}}/>
                                <View>
                                    <Text style={{margin: 5, width: width/2}}>{"材料编码：" + this.props.product.skuCode}</Text>
                                    <Text style={{margin: 5, width: width/2}}>{"材料描述："+this.props.product.SkuName}</Text>

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
                               this.props.saveFunc(text,this.state.pics)
                           }}
                           onBlur={() => {
                           }}/>
             {/*   <ListView
                    dataSource={this.state.dataSource}
                    style={{width: width-63}}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    renderRow={(rowData, rowID, sectionID) =>
                        <View >
                            <Image
                                resizeMode="contain"
                                style={{height: 200, margin: 16,width:width-96}}
                                source={{uri: rowData.uri}}/>
                            <TouchableOpacity
                                style={{position: 'absolute', right: 8,}}
                                onPress={() => {
                                    //  console.log(rowID + ":" + sectionID);
                                    this.state.pics.splice(sectionID, 1);
                                    // console.log("delete:" + JSON.stringify(this.state.pics));
                                    this.setState(
                                        {
                                            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.pics))),
                                        });
                                    //   console.log(JSON.stringify(this.state.dataSource))
                                }}>
                                <Image
                                    resizeMode="contain"
                                    style={{height: 30, width: 30,}}
                                    source={require('../../drawable/close_post_label.png')}/>
                            </TouchableOpacity>
                        </View>
                    }/>*/}
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

