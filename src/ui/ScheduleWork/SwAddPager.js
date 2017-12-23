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
    ListView, FlatList, SectionList, TextInput, ScrollView
} from 'react-native';
import Toolbar from "../Component/Toolbar";
import Sae from "react-native-textinput-effects/lib/Sae";
import {Akira, Hoshi, Jiro, Kaede, Madoka} from "react-native-textinput-effects";
import Moment from 'moment';
import DatePicker from "../Component/DatePicker";
import * as ImageOptions from "../../constant/ImagePickerOptions"
import ImageList from "../Component/ImageList";
const {width, height} = Dimensions.get('window');
const ImagePicker = require('react-native-image-picker');


export default class SwAddPager extends Component<{}> {

    constructor(props) {
        super(props);
        //   this.dateStr = Moment(date).format('YYYY-MM-DD');

        this.state = {
            isLoading: false,
            date: "",
            remark: '',

            pics: [],
            dataSourcePic: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            image: []
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={["创建日程"]}
                    color={Color.colorGreen}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['提交']}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        () => {

                        }
                    ]}
                />
                <ScrollView>
                    <View style={{marginBottom: 55}}>
                        <View style={styles.cardContainer}>
                            <DatePicker
                                customStyles={{
                                    placeholderText: {
                                        color: 'black',
                                        textAlign: 'center',
                                        width: width / 4,
                                    },
                                    dateText: {
                                        color: Color.content, textAlign: 'center', width: width / 4,
                                    }
                                }}
                                date={this.state.date}
                                mode="date"
                                placeholder="工作日期"
                                format="YYYY-MM-DD"
                                minDate={this.dateStr}
                                confirmBtnText="确认"
                                cancelBtnText="取消"
                                showIcon={false}
                                onDateChange={(date) => {
                                    this.setState({date: date})
                                }}
                            />
                        </View>
                        <View style={styles.cardContainer}>
                            <Text style={{margin: 16, color: 'black'}}>日程工作描述</Text>
                            <TextInput
                                style={styles.inputStyle}
                                multiline={true}
                                placeholder="在这里填写"
                                returnKeyType={'done'}
                                underlineColorAndroid="transparent"
                                blurOnSubmit={true}
                                onChangeText={(text) => this.setState({remark: text})}/>
                        </View>

                        <View style={styles.cardContainer}>
                            <Text style={{margin: 16, color: 'black'}}>附加照片</Text>
                            <ImageList dataSourcePic={this.state.dataSourcePic} action={(sectionID) => {
                                this.state.pics.splice(sectionID, 1);
                                this.setState({
                                    dataSourcePic: this.state.dataSourcePic.cloneWithRows(JSON.parse(JSON.stringify(this.state.pics))),
                                });
                            }}/>
                            <TouchableOpacity onPress={() => {
                                ImagePicker.showImagePicker(ImageOptions.options, (response) => {
                                    if (!response.didCancel) {
                                        this.state.pics.push(response);
                                        this.setState({dataSourcePic: this.state.dataSourcePic.cloneWithRows(this.state.pics),});
                                    }
                                });
                            }}
                                              style={styles.buttonStyle}>

                                <Text style={{color: 'white', margin: 16}}>拍照</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cardContainer}>
                            <Text style={{margin: 16, color: 'black'}}>协助人员</Text>
                            <TouchableOpacity onPress={() => {
                            }}
                                              style={styles.buttonStyle}>
                                <Text style={{color: 'white', margin: 16}}>添加</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Color.background,
    },

    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 2,
        margin: 16,
        width: width - 32,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputStyle:{
        width: width - 64,
        height: 100,
        marginRight: 10,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: Color.line
    },
    buttonStyle:{
        backgroundColor: Color.colorGreen,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        width: width - 32
    }

});
