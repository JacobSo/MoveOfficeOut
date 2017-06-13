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
            if (this.props.step === 1) {
                color = (this.props.product.pResultList.indexOf("0-1") > -1) ? Color.colorGreen : Color.colorRed;
                text = (this.props.product.pResultList.indexOf("0-1") > -1) ? "白胚-通过" : "白胚-不通过";
            }
            else if (this.props.step === 2) {
                color = (this.props.product.pResultList.indexOf("1-1") > -1) ? Color.colorGreen : Color.colorRed;
                text = (this.props.product.pResultList.indexOf("1-1") > -1) ? "成品-通过" : "成品-不通过";
            }
            else if (this.props.step === 3) {
                color = (this.props.product.pResultList.indexOf("2-1") > -1) ? Color.colorGreen : Color.colorRed;
                text = (this.props.product.pResultList.indexOf("2-1") > -1) ? "包装-通过" : "包装-不通过";
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
                    textAlign: 'center'
                }}>{this.props.product.ItemName}
                </Text>
                <Text
                    style={{
                        marginLeft: 10, marginRight: 10, width: 90,
                        textAlign: 'center'
                    }}>{ this.props.product.ItemRemark}</Text>
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
            height: 180,
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