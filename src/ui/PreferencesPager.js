/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import PreferencesTextItem from './Component/PreferencesTextItem'
import App from '../constant/Application';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
import PopupDialog, {SlideAnimation} from 'react-native-popup-dialog';
export default class PreferencesPager extends Component {

    constructor(props) {
        super(props);
    }

    onActionSelected() {

    }

        render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar title={['设置']}
                         color={Color.colorPrimary}
                         elevation={2}
                         isHomeUp={true}
                         isAction={false}
                         isActionByText={false}
                         actionArray={[]}
                         functionArray={[() => {
                             this.props.nav.pop()
                         }]}/>
                <ScrollView  >
                    <View>
                        <PreferencesTextItem
                            group="常规"
                            items={[
                                [App.account, App.department + '-' + App.workType],
                                ['修改密码', '点击修改密码'],
                                ['检查更新', '当前版本：']
                            ]}
                            functions={[
                                () => {
                                    Alert.alert(
                                        '注销',
                                        '注销当前账号，返回登录页面',
                                        [
                                            {text: '取消', onPress: () =>{}},
                                            {text: '确定', onPress: () =>  this.props.nav.push({id: 'login',})},
                                        ]
                                    )
                                },
                                () => {
                                    this.props.nav.push({id: 'password',})
                                },
                                () => {
                                }]}/>

                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    toolbar: {
        height: 55,
        backgroundColor: Color.colorPrimary,
        alignItems: 'center',
        justifyContent: 'center',
    }
});