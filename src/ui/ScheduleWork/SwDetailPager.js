"use strict";
import React, {Component} from 'react';
import Color from '../../constant/Color';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ListView, FlatList, SectionList, TextInput, ScrollView, KeyboardAvoidingView
} from 'react-native';
import Toolbar from "../Component/Toolbar";
import Sae from "react-native-textinput-effects/lib/Sae";
import {Akira, Hoshi, Jiro, Kaede, Madoka} from "react-native-textinput-effects";
import Moment from 'moment';
import DatePicker from "../Component/DatePicker";
const {width, height} = Dimensions.get('window');


export default class SwDetailPager extends Component<{}> {

    constructor(props) {
        super(props);
        //   this.dateStr = Moment(date).format('YYYY-MM-DD');

        this.state = {
            isLoading: false,
            date: "",
            remark: ''
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-55}>
                <View style={{backgroundColor: Color.background,marginBottom:155}}>
                    <Toolbar
                        elevation={2}
                        title={["日程工作"]}
                        color={Color.colorGreen}
                        isHomeUp={true}
                        isAction={true}
                        isActionByText={true}
                        actionArray={['完结']}
                        functionArray={[
                            () => {
                                this.props.nav.goBack(null)
                            },
                            () => {

                            }
                        ]}
                    />
                    <ScrollView>
                        <View style={{
                            marginBottom: 55, alignItems: 'center',
                        }}>

                            <View style={styles.iconContainer}>
                                <Text style={{
                                    color: 'white',
                                    backgroundColor: Color.colorBlueGrey,
                                    textAlign: 'center',
                                    borderTopRightRadius: 10,
                                    borderTopLeftRadius: 10,
                                    padding: 5,
                                }}>审核中</Text>

                                <Text style={{
                                    margin: 16,
                                    fontWeight: 'bold'
                                }}>{'我们协会是以存在主义为核心的协会，当你们慢慢扩宽你们的哲学视野之后，你会对所有事物都会有更深层次的理解'}</Text>
                                <View
                                    style={[styles.itemText, {
                                        borderTopWidth: 1,
                                        borderColor: Color.line,
                                        paddingTop: 10
                                    }]}>
                                    <Text>{'工作日期'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>2017-1-1</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'更新时间'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>2017-1-1</Text>
                                </View>
                                <View
                                    style={styles.itemText}>
                                    <Text>{'创建日期'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>2017-1-1</Text>
                                </View>
                                <View style={styles.itemText}>
                                    <Text>{'创建人'}</Text>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>孙仔</Text>
                                </View>

                                <View style={styles.itemText}>
                                    <View/>
                                    <View style={{flexDirection: "row"}}>
                                        <TouchableOpacity onPress={() => {
                                        }} style={{marginRight: 16, marginTop: 16, marginBottom: 6}}>
                                            <Text>收起</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                        }} style={{marginTop: 16, marginBottom: 6, marginLeft: 16}}>

                                            <Text style={{color: Color.colorGreen}}>查看图片</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.titleContainer}><Text style={{fontSize: 18,   fontWeight: 'bold',}}>协同工作</Text></View>
                            <View style={{
                                width: width - 32,
                                height: 55 + 16 + 16 + 16,
                                backgroundColor: 'white',
                                margin: 16,
                                paddingLeft: 16,
                                elevation: 2,
                                borderRadius: 50,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{
                                        borderRadius: 50,
                                        width: 45,
                                        height: 45,
                                        backgroundColor: Color.content,
                                        margin: 10,
                                        elevation: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{color: 'white',}}>+</Text>
                                    </View>
                                    <Text>新增</Text>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{
                                        borderRadius: 50,
                                        width: 45,
                                        height: 45,
                                        backgroundColor: Color.colorAmber,
                                        margin: 10,
                                        elevation: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{color: 'white',}}>蒋</Text>
                                    </View>
                                    <Text>蒋介石</Text>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{
                                        borderRadius: 50,
                                        width: 45,
                                        height: 45,
                                        backgroundColor: Color.colorCyanDark,
                                        margin: 10,
                                        elevation: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{color: 'white',}}>孙</Text>
                                    </View>
                                    <Text>孙中山</Text>
                                </View>
                            </View>


                            <View style={styles.titleContainer}><Text style={{fontSize: 18,   fontWeight: 'bold',}}>处理工作流</Text></View>
                            <View style={styles.iconContainer}>
                                <Text style={{
                                    color: 'white',
                                    backgroundColor: Color.colorTeal,
                                    textAlign: 'center',
                                    borderTopRightRadius: 10,
                                    borderTopLeftRadius: 10,
                                    padding: 5,
                                }}>协助处理</Text>

                                <Text style={{
                                    margin: 16,
                                    fontWeight: 'bold'
                                }}>{'我们协会是以存在主义为核心的协会，当你们慢慢扩宽你们的哲学视野之后，你会对所有事物都会有更深层次的理解'}</Text>
                                <View style={{width: 55, height: 55, backgroundColor: Color.content, margin: 16}}/>

                                <View
                                    style={[styles.itemText, {
                                        borderTopWidth: 1,
                                        borderColor: Color.line,
                                        paddingTop: 10
                                    }]}>
                                    <View/>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>蒋介石 于 1948-1-1 提交</Text>
                                </View>
                            </View>
                            <View style={styles.iconContainer}>
                                <Text style={{
                                    color: 'white',
                                    backgroundColor: Color.colorDeepPurple,
                                    textAlign: 'center',
                                    borderTopRightRadius: 10,
                                    borderTopLeftRadius: 10,
                                    padding: 5,
                                }}>主理人</Text>

                                <Text style={{
                                    margin: 16,
                                    fontWeight: 'bold'
                                }}>{'我们协会是以存在主义为核心的协会，当你们慢慢扩宽你们的哲学视野之后，你会对所有事物都会有更深层次的理解'}</Text>

                                <View style={{width: 55, height: 55, backgroundColor: Color.content, margin: 16}}/>
                                <View
                                    style={[styles.itemText, {
                                        borderTopWidth: 1,
                                        borderColor: Color.line,
                                        paddingTop: 10
                                    }]}>
                                    <View/>
                                    <Text
                                        style={{color: Color.black_semi_transparent}}>孙中山 于 2017-1-1 提交</Text>
                                </View>
                            </View>

                            <View style={styles.titleContainer}><Text style={{fontSize: 18,   fontWeight: 'bold',}}>新增处理</Text></View>
                            <View style={[styles.iconContainer, {
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]}>
                                <Text style={{margin: 16, color: 'black'}}>工作处理</Text>
                                <TextInput
                                    style={{
                                        width: width - 64,
                                        height: 100,
                                        marginRight: 10,
                                        textAlign: 'center',
                                        borderTopWidth: 1,
                                        borderTopColor: Color.line
                                    }}
                                    multiline={true}
                                    placeholder="在这里填写"
                                    returnKeyType={'done'}
                                    underlineColorAndroid="transparent"

                                    blurOnSubmit={true}
                                    onChangeText={(text) => this.setState({remark: text})}/>
                            </View>
                            <View style={[styles.iconContainer, {
                                alignItems: 'center',
                                justifyContent: 'center',
                            }]}>
                                <Text style={{margin: 16, color: 'black',}}>附加照片</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                    }}
                                    style={{
                                        backgroundColor: 'white',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 10
                                    }}>
                                    <View style={{  padding: 16, width: width - 64, borderTopWidth: 1,
                                        borderTopColor: Color.line,}}>
                                    <Text style={{
                                        color: Color.colorGreen,
                                        textAlign: 'center'
                                    }}>拍照</Text></View>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={[styles.iconContainer, {
                                height: 55,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: Color.colorGreen
                            }]}>
                                <Text style={{color: 'white'}}>新增工作处理</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                </View></KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    itemText: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width - 32,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    iconContainer: {
        width: width - 32,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 16,
        elevation: 2,
        overflow:'hidden'

    },
    titleContainer: {

        borderBottomWidth: 3,
        borderBottomColor: Color.colorGreen,
        margin: 16,
    }
});
