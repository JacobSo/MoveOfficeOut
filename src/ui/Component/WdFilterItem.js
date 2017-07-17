/**
 * Created by Administrator on 2017/3/14.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import Color from '../../constant/Color';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {WdActions} from "../../actions/WdAction";
import {CachedImage} from "react-native-img-cache";
import App from '../../constant/Application';

const {width, height} = Dimensions.get('window');

export class WdFilterItem extends Component {
    static propTypes = {
        product: PropTypes.any.isRequired,
        func: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            statusText: "未开始",
            statusColor: Color.content,
        }

    }

    componentDidMount() {
        this.setStatus();
    }

    componentWillReceiveProps(newProps) {
        //console.log(JSON.stringify(newProps) + '-------------------------')
        this.setStatus();
    }

    setStatus() {
        let color;
        let text;
        if (this.props.product.pResultList) {
            text = "未开始";
            color = Color.content;
            if (this.props.step === 1) {
                if (this.props.product.pResultList.indexOf("0-1") > -1) {
                    color = Color.colorGreen;
                    text = (App.workType === "板木驻厂工程师" ? "白胚" : "木架") + "-通过";
                } else if (this.props.product.pResultList.indexOf("0-0") > -1) {
                    color = Color.colorRed;
                    text = (App.workType === "板木驻厂工程师" ? "白胚" : "木架") + "-不通过";
                }
            }
            else if (this.props.step === 2) {
                if (this.props.product.pResultList.indexOf("1-1") > -1) {
                    color = Color.colorGreen;
                    text = "成品-通过"
                } else if (this.props.product.pResultList.indexOf("1-0") > -1) {
                    color = Color.colorRed;
                    text = "成品-不通过"
                }
            }
            else if (this.props.step === 3) {
                if (this.props.product.pResultList.indexOf("2-1") > -1) {
                    color = Color.colorGreen;
                    text = "包装-通过"
                } else if (this.props.product.pResultList.indexOf("2-0") > -1) {
                    color = Color.colorRed;
                    text = "包装-不通过"
                }
            }

            this.setState({
                statusText: text,
                statusColor: color
            })
        }


    }

    render() {
        //   console.log(JSON.stringify(this.props.task));
        return (
            <TouchableOpacity
                onPress={
                    this.props.func
                }
                style={[styles.mainContainer]}>
                <Text style={{
                    width: width / 3 - 10,
                    backgroundColor: this.state.statusColor,
                    color: 'white',
                    textAlign: 'center'
                }}>{this.state.statusText}</Text>

                <View style={{width: 100, height: 100}}>
                    <CachedImage
                        resizeMode="contain"
                        style={{width: 100, height: 100,}}
                        source={{uri: this.props.product.pImage ? this.props.product.pImage : '-'}}/>
                </View>
                <Text style={{
                    margin: 10,
                    fontSize: 15,
                    width: 90,
                    textAlign: 'center',
                }}>{this.props.product.ItemName}
                </Text>
                <Text
                    style={{
                        marginLeft: 10,
                        marginRight: 10,
                        width: 90,
                        height: 35,
                        textAlign: 'center'
                    }}>{this.props.product.ItemRemark}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create(
    {
        mainContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            height: 200,
            width: width / 3 - 10,
            elevation: 2,
            margin: 5,
        },
    });

const mapStateToProps = (state) => {
    return {
        product: state.wdStore.product,
        position: state.wdStore.position
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(WdActions, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(WdFilterItem);