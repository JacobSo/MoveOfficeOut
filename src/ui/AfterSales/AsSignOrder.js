/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import Color from '../../constant/Color';
import Toolbar from './../Component/Toolbar'
import Loading from 'react-native-loading-spinner-overlay';
import SnackBar from 'react-native-snackbar-dialog'
import {NavigationActions,} from 'react-navigation';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class AsSignOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar title={['单据跟踪']}
                         color={Color.colorAmber}
                         elevation={2}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={['提交']}
                         functionArray={[
                             () => this.props.nav.goBack(null),
                             () => {
                             }
                         ]}/>

                <KeyboardAvoidingView behavior='position'>
                    <ScrollView
                        style={{
                            backgroundColor: Color.background,
                        }}>
                        <View style={{backgroundColor: Color.background, flexDirection: 'column', margin: 16}}>
                            <View style={{justifyContent:"space-between",flexDirection:"row",height:55}}>
                                <Text>单据编号</Text>
                                <Text>单据详细</Text>

                            </View>
                            <View style={styles.card}>
                                <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                <Text style={{marginLeft: 16}}>原料供应商</Text>
                            </View>
                            <View style={styles.card}>
                                <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                <Text style={{marginLeft: 16}}>产品列表</Text>
                            </View>
                            <View style={styles.card}>
                                <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                <Text style={{marginLeft: 16}}>责任单</Text>
                            </View>
                            <View style={styles.card}>
                                <View style={{backgroundColor: Color.line, width: 10, height: 55}}/>
                                <Text style={{marginLeft: 16}}>跟进进度</Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <Loading visible={this.state.isLoading}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        height: 55,
        backgroundColor: "white",
        alignItems: "center",
        margin: 16,
        elevation: 2,
    },
    textInput: {
        width: width - 32,
        height: 65,
        marginRight: 10,
        borderColor: Color.line,
        borderBottomWidth: 1,
    },

});