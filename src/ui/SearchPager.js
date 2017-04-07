/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Button,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    Switch,
    ListView
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Toast from 'react-native-root-toast';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Moment from 'moment';
import DatePicker from '../ui/Component/DatePicker';
import ApiService from "../network/ApiService";
import {MainItem} from "./Component/MainItem";
import StarSeek from "./Component/StarSeek";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class SearchPager extends Component {

    constructor(props) {
        super(props);
        let date = new Date();
        this.dateStr = Moment(date).format('YYYY-MM-DD');

        this.state = {
            isTimeSelect: false,
            beginTime: '',
            endTime: '',
            supply: '',
            series: '',
            type: 0,//0,1
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            page: 1,
            isRefreshing: true,
            isEndUp: false,

            star: 0
        };

    }

    _onRefresh() {
      //  console.log('_refresh');
        this.state.page = 1;
        ApiService.searchItems(this.state.page, this.state.type, this.state.supply, this.state.series, this.state.beginTime, this.state.endTime)
            .then((responseJson) => {
                this.state.items = responseJson.list;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                    isRefreshing: false,
                    isEndUp: responseJson.list.length === 0
                });
                this._setList()
            }).done()
    }

    _onLoad() {
      //  console.log('_load');
        this.setState({
            //  isRefreshing: true,
            page: this.state.page + 1
        });
        ApiService.searchItems(this.state.page, this.state.type, this.state.supply, this.state.series, this.state.beginTime, this.state.endTime)
            .then((responseJson) => {
                // console.log(responseJson);
                this.state.items = this.state.items.concat(responseJson.list);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                    isRefreshing: false,
                    isEndUp: responseJson.list.length === 0
                });
                if (this.state.isEndUp) {
                    Toast.show('已经没有了', {});
                }
            }).done()
    }

    _setList() {
        if (this.state.items.length === 0) {
            return (<View
                    style={styles.card}>
                    <Text>没有数据</Text>
                </View>
            );
        } else {
            return <ListView
                dataSource={this.state.dataSource}
                //  pageSize={2}
                onEndReached={() => this._onLoad()}
                enableEmptySections={true}
                renderRow={ (rowData) => <MainItem task={rowData} func={() => {
                    this.props.nav.navigate('detail', {task: rowData,})
                }}/>
                }/>
        };
    }

    _timeSelect() {
        if (this.state.isTimeSelect) {
            return (<View
                style={{flexDirection: 'row', width: width - 32, justifyContent: 'space-around'}}>

                <DatePicker
                    date={this.state.beginTime}
                    maxDate={this.state.endTime===''?'2047-7-1':this.state.endTime}
                    mode="date"
                    placeholder="开始日期"
                    format="YYYY-MM-DD"
                    confirmBtnText="确认"
                    cancelBtnText="取消"
                    showIcon={false}
                    onDateChange={(date) => {
                        this.setState({beginTime: date});
                        if (this.state.beginTime !== '' && this.state.endTime !== '') {
                            this.setState({isTimeSelect: !this.state.isTimeSelect});
                        }
                    }}
                />
                <DatePicker
                    date={this.state.endTime}
                    minDate={this.state.beginTime===''?'1997-7-1':this.state.beginTime}
                    mode="date"
                    placeholder="结束日期"
                    format="YYYY-MM-DD"
                    confirmBtnText="确认"
                    cancelBtnText="取消"
                    showIcon={false}
                    onDateChange={(date) => {
                        this.setState({endTime: date});
                        if (this.state.beginTime !== '' && this.state.endTime !== '') {
                            this.setState({isTimeSelect: !this.state.isTimeSelect});
                        }
                    }}
                />
            </View>);
        } else return null
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar title={['']}
                         color={Color.colorPrimaryDark}
                         elevation={0}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={['搜索']}
                         functionArray={[
                             () => this.props.nav.goBack(null),
                             () => this._onRefresh(),
                         ]}/>
                <ScrollView>
                    <View style={{
                        flexDirection: 'column',
                        backgroundColor: Color.colorPrimaryDark,
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity onPress={() => {
                            this.setState({isTimeSelect: !this.state.isTimeSelect});
                            if (this.state.beginTime === '' || this.state.endTime === '') {
                                this.setState({beginTime: '', endTime: ''});
                            }
                        }}>
                            <View style={styles.control}>
                                <Image style={styles.ctrlIcon} source={require('../drawable/clock.png')}/>
                                <Text
                                    style={{color: 'white'}}>{this.state.beginTime !== '' && this.state.endTime !== '' ?
                                    (this.state.beginTime + '到' + this.state.endTime) : '选择日期'}</Text>
                                <TouchableOpacity style={{
                                    right: 0,
                                    position: 'absolute',
                                    width: 55,
                                    height: 55,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} onPress={() => {
                                    this.setState({beginTime: '', endTime: ''});
                                }}>
                                    <Image source={require('../drawable/close_white.png')}
                                           style={{width: 15, height: 15,}}/>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                        {this._timeSelect()}
                        <TouchableOpacity onPress={() => {
                            this.props.nav.navigate('param',
                                {
                                    title: '选择供应商',
                                    type: 0,//supply
                                    searchKey: this.state.series,//if key
                                    setSelect: (select) => {
                                        this.setState({supply: select})
                                    }
                                },
                            );
                        }}>
                            <View style={styles.control}>
                                <Text style={{color: 'white', marginLeft: 16, marginRight: 16}}>供应商</Text>
                                <Text
                                    style={{color: 'white'}}>{this.state.supply === '' ? '选择供应商' : this.state.supply}</Text>
                                <TouchableOpacity style={{
                                    right: 0,
                                    position: 'absolute',
                                    width: 55,
                                    height: 55,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} onPress={() => {
                                    this.setState({supply: ''})
                                }}>
                                    <Image source={require('../drawable/close_white.png')}
                                           style={{width: 15, height: 15,}}/>
                                </TouchableOpacity>

                            </View></TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            this.props.nav.navigate('param',
                                {
                                    title: '选择系列',
                                    type: 1,//series
                                    searchKey: this.state.supply,//if key
                                    setSelect: (select) => {
                                        this.setState({series: select})
                                    }
                                },
                            );
                        }}>
                            <View style={styles.control}>
                                <Text style={{color: 'white', marginLeft: 16, marginRight: 32}}>系列</Text>
                                <Text
                                    style={{color: 'white'}}>{this.state.series === '' ? '选择系列' : this.state.series}</Text>
                                <TouchableOpacity style={{
                                    right: 0,
                                    position: 'absolute',
                                    width: 55,
                                    height: 55,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} onPress={() => {
                                    this.setState({series: ''})
                                }}>
                                    <Image source={require('../drawable/close_white.png')}
                                           style={{width: 15, height: 15,}}/>
                                </TouchableOpacity>
                            </View></TouchableOpacity>
                        <RadioForm
                            buttonColor={Color.colorAccent }
                            labelStyle={{color: 'white', marginRight: 36}}
                            radio_props={[{label: '进行中', value: 0}, {label: '已完结', value: 1}]}
                            initial={0}
                            formHorizontal={true}
                            onPress={(value) => this.setState({type: value})}
                            style={{margin: 16, width: width - 32}}

                        />
                    </View>
                    {this._setList()}

                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        card: {
            borderWidth: 1,
            backgroundColor: 'white',
            borderColor: Color.trans,
            margin: 16,
            padding: 15,
            shadowColor: Color.background,
            shadowOffset: {width: 2, height: 2,},
            shadowOpacity: 0.5,
            shadowRadius: 3,
            alignItems: 'center',
            elevation: 2,
            flexDirection: 'column',

        },
        control: {
            width: width - 32,
            height: 55,
            backgroundColor: Color.colorPrimary,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            marginTop: 8,
        },
        ctrlIcon: {
            width: 25,
            height: 25,
            marginLeft: 16,
            marginRight: 32,
            resizeMode: 'contain'
        }
    });
