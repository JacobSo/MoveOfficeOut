/**
 * Created by Administrator on 2017/3/14.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, Platform, TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';
import {CachedImage, ImageCache} from "react-native-img-cache";
const {width, height} = Dimensions.get('window');
export class WdProductItem extends Component {
    static propTypes = {
        product: PropTypes.any.isRequired,
        func: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            statusText: "未开始",
            statusColor: Color.content,
            isAllFinish: false,
        }
    }

    componentDidMount() {
        this.setStatus();
        this.getImageLocalPath();
    }

    componentWillReceiveProps(newProps) {
        console.log(JSON.stringify(newProps) + '---------product----------------');
        this.setStatus();

    }

    setStatus() {
        let color;
        let text;
        let finish = false;
        if (this.props.product.pResultList) {
            finish = ((this.props.product.pResultList.indexOf("0-1") > -1)
            && (this.props.product.pResultList.indexOf("1-1") > -1)
            && (this.props.product.pResultList.indexOf("2-1") > -1));
            if (this.props.product.pStatus === 0) {
                color = Color.colorOrange;
                text = (this.props.product.pResultList.indexOf("0-1") > -1) ? "白胚-通过" : "白胚-不通过";
            }
            else if (this.props.product.pStatus === 1) {
                color = Color.colorBlue;
                text = (this.props.product.pResultList.indexOf("1-1") > -1) ? "成品-通过" : "成品-不通过";
            }
            else if (this.props.product.pStatus === 2) {
                color = Color.colorGreen;
                text = (this.props.product.pResultList.indexOf("2-1") > -1) ? "包装-通过" : "包装-不通过";
            }

            this.setState({
                statusText: text,
                statusColor: color,
                isAllFinish: finish
            })
        }
    }

    getImageLocalPath(){
            const immutable = true;
            const observer = (path) => {
                console.log(path);
            };
            const uri = {uri: this.props.product.pImage};
            ImageCache.get().on(uri, observer, immutable);
    }

    render() {
        //   console.log(JSON.stringify(this.props.task));
        return (
            <TouchableOpacity
                onPress={this.props.func}>
                <View style={styles.mainContainer}>
                    <Text style={{
                        width: width - 32,
                        backgroundColor: this.state.statusColor,
                        color: 'white',
                        textAlign: 'center'
                    }}>{this.state.statusText}</Text>
                    <View style={{flexDirection: 'row',}}>

                        <View style={{width: 100, height: 100}}>
                            <CachedImage
                                resizeMode="contain"
                                indicator={require('../../drawable/empty_image.png')}
                                style={{width: 100, height: 100, margin: 5}}
                                source={{uri: this.props.product.pImage?this.props.product.pImage:'-'}}/>
                        </View>

                        <View style={{flexDirection: 'column'}}>
                            <Text style={{
                                margin: 10,
                                fontSize: 15,
                                color: 'black'
                            }}>{'名称：' + this.props.product.ItemName}</Text>
                            <Text style={{marginLeft: 10, marginRight: 10}}>{'描述：' + this.props.product.ItemRemark}</Text>
                        </View>
                    </View>
                    {
                        (() => {
                            if (this.state.isAllFinish) {
                                return <Image
                                    resizeMode="contain"
                                    style={{width: 100, position: 'absolute', right: 0, bottom: 0}}
                                    source={require('../../drawable/pass_flag.png')}
                                />
                            }
                        })()
                    }

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
    });

