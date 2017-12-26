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
import StarSeek from "../Component/StarSeek";
import * as ImageOptions from "../../constant/ImagePickerOptions"
import ImageList from "../Component/ImageList";
import SwFeedbackItem from "../Component/SwFeedbackItem";
import SwMemberList from "../Component/SwMemberList";
const ImagePicker = require('react-native-image-picker');

const {width, height} = Dimensions.get('window');


export default class SwDetailPager extends Component<{}> {

    constructor(props) {
        super(props);
        //   this.dateStr = Moment(date).format('YYYY-MM-DD');

        this.state = {
            isLoading: false,
            isShowDetail: false,
            date: "",
            remark: '',
            starA: 0,
            pics: [],
            dataSourcePic: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            image: [],
            items: [{key: "a"}, {key: "b"}],
        };
    }

    componentDidMount() {

    }

    workDetail() {
        if (this.state.isShowDetail)
            return <View>
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
            </View>
        else return null
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-55}>
                <View style={{backgroundColor: Color.background, marginBottom: 155}}>
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
                                {
                                    this.workDetail()
                                }

                                <View style={styles.itemText}>
                                    <View/>
                                    <View style={{flexDirection: "row"}}>
                                        <TouchableOpacity
                                            onPress={() => this.setState({isShowDetail: !this.state.isShowDetail})}
                                            style={{marginRight: 16, marginTop: 16, marginBottom: 6}}>
                                            <Text>{this.state.isShowDetail ? '收起' : '展开'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                        }} style={{marginTop: 16, marginBottom: 6, marginLeft: 16}}>

                                            <Text style={{color: Color.colorGreen}}>查看图片</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.titleContainer}>
                                <Text style={{fontSize: 18, fontWeight: 'bold',}}>协同工作</Text>
                            </View>
                            <SwMemberList/>
                            <View style={styles.titleContainer}><Text
                                style={{fontSize: 18, fontWeight: 'bold',}}>处理工作流</Text></View>
                            <FlatList
                                data={this.state.items}
                                renderItem={({item}) => <SwFeedbackItem/>}
                            />
                            <View style={styles.titleContainer}>
                                <Text style={{fontSize: 18, fontWeight: 'bold',}}>新增处理</Text>
                            </View>
                            <View style={[styles.iconContainer, {alignItems: 'center', justifyContent: 'center'}]}>
                                <Text style={{margin: 16, color: 'black'}}>工作处理</Text>
                                <TextInput
                                    style={styles.inputStyle}
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
                                <ImageList dataSourcePic={this.state.dataSourcePic} action={(index) => {
                                    this.state.pics.splice(index, 1);
                                    this.setState({
                                        dataSourcePic: this.state.dataSourcePic.cloneWithRows(JSON.parse(JSON.stringify(this.state.pics))),
                                    });
                                }}/>
                                <TouchableOpacity
                                    style={styles.camStyle}
                                    onPress={() => {
                                        ImagePicker.showImagePicker(ImageOptions.options, (response) => {
                                            if (!response.didCancel) {
                                                this.state.pics.push(response);
                                                this.setState({dataSourcePic: this.state.dataSourcePic.cloneWithRows(this.state.pics),});
                                            }
                                        });
                                    }}>
                                    <Text style={{color: Color.colorGreen, textAlign: 'center'}}>拍照</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={[styles.iconContainer, styles.greenBtnStyle]}>
                                <Text style={{color: 'white'}}>新增工作处理</Text>
                            </TouchableOpacity>

                            <View style={styles.titleContainer}>
                                <Text style={{fontSize: 18, fontWeight: 'bold',}}>工作评分</Text></View>
                            <View style={styles.starContainer}>
                                <StarSeek onSelect={(select) => this.setState({starA: select})}/>
                                <Text>优秀</Text>
                            </View>
                        </View>
                    </ScrollView>

                </View>
            </KeyboardAvoidingView>
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
        overflow: 'hidden'

    },
    titleContainer: {
        borderBottomWidth: 3,
        borderBottomColor: Color.colorGreen,
        margin: 16,
    },
    starContainer: {
        width: width - 32,
        height: 55 + 32,
        backgroundColor: 'white',
        margin: 16,
        elevation: 2,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    greenBtnStyle: {
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.colorGreen
    },
    camStyle: {
        padding: 16,
        width: width - 64,
        borderTopWidth: 1,
        borderTopColor: Color.line,
    },
    inputStyle: {
        width: width - 64,
        height: 100,
        marginRight: 10,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: Color.line
    }
});
