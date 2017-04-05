/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    TextInput,
    Switch, Alert
} from 'react-native';
import Toast from 'react-native-root-toast';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import ApiService from '../network/ApiService';
import {WorkItem} from './Component/WorkItem'
import RadioForm from 'react-native-simple-radio-button';
import Moment from 'moment';
import Loading from 'react-native-loading-spinner-overlay';
import DatePicker from '../ui/Component/DatePicker';
import {bindActionCreators} from "redux";
import {mainActions} from "../actions/MainAction";
import {connect} from "react-redux";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
 class WorkPager extends Component {

    constructor(props) {
        super(props);
        let date = new Date();
        this.dateStr = Moment(date).format('YYYY-MM-DD');

        this.state = {
            isLoading: false,
            date: '',
            isCarVisible: false,
            isRemarkVisible: false,
            isNeedCar: false,
            carType: '',
            carMember: '',
            remarkStr: '',
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };

    }

    componentDidMount() {

    }

    _createWork() {
        if (this.state.items.length === 0) {
            Toast.show('请添加工作');
        } else if (this.state.date === '') {
            Toast.show('请选择对接时间');
        } else {
            Alert.alert(
                '创建工作',
                '是否创建工作？',
                [
                    {
                        text: '取消', onPress: () => {
                    }
                    },
                    {
                        text: '确定', onPress: () => {
                        this.setState({isLoading: true});
                        ApiService.createWork(this.state.date, this.state.isNeedCar, this.state.carType, this.state.carMember, this.state.remarkStr, JSON.stringify(this.state.items))
                            .then((responseJson) => {
                                this.setState({isLoading: false});
                                if (!responseJson.IsErr) {
                                    this.props.actions.refreshList(true);
                                    Toast.show('操作成功');
                                    this.props.nav.goBack(null);
                                } else Toast.show(responseJson.ErrDesc);
                            })
                            .done();
                    }
                    },
                ]
            )
        }

    }

    _carView() {
        if (this.state.isCarVisible) {
            return (
                <View>
                    <View style={{flexDirection: 'row', width: width, justifyContent: 'space-between',}}>
                        <Text style={{margin: 16, color: 'white'}}>申请车辆</Text>
                        <Switch
                            style={{margin: 16}}
                            onValueChange={(value) => {
                                this.setState({isNeedCar: value});
                                if (!value) {
                                    this.state.carMember = '';
                                }
                            }}
                            onTintColor={Color.colorAccent}
                            value={this.state.isNeedCar}/>
                    </View>
                    <RadioForm
                        buttonColor={this.state.isNeedCar ? Color.colorAccent : Color.content}
                        labelStyle={{color: 'white', marginRight: 36}}
                        radio_props={ [
                            {label: '公司车辆', value: 0},
                            {label: '私车公用', value: 1}
                        ]}
                        initial={0}
                        formHorizontal={true}
                        onPress={(value) => this.setState({carType: (value === 0 ? '公司车辆' : '私车公用')})}
                        style={{margin: 16}}
                        disabled={!this.state.isNeedCar}
                    />

                    <TextInput style={{width: width - 32, height: 65, marginLeft: 10, marginRight: 10, color: 'white'}}
                               placeholder="陪同人"
                               placeholderTextColor={Color.background}
                               onChangeText={(text) => this.setState({carMember: text})}
                               editable={this.state.isNeedCar}
                               value={this.state.carMember}>
                    </TextInput>
                </View>
            )
        } else {
            return ( null)

        }
    }

    _remarkView() {
        if (this.state.isRemarkVisible) {
            return (
                <View>
                    <TextInput style={styles.textRemark}
                               placeholder="备注"
                               placeholderTextColor={Color.background}
                               onChangeText={(text) => this.setState({remarkStr: text})}/>
                </View>
            )
        } else {
            return ( null)
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar title={['外出申请']}
                         color={Color.colorPrimaryDark}
                         elevation={0}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={['提交']}
                         functionArray={[
                             () => this.props.nav.goBack(null),
                             () => this._createWork()
                         ]}/>
                <ScrollView>
                    <View style={{
                        flexDirection: 'column',
                        backgroundColor: Color.colorPrimaryDark,
                        alignItems: 'center',
                    }}>

                        <View style={styles.control}>
                            <Image style={styles.ctrlIcon} source={require('../drawable/clock.png')}/>
                            <DatePicker
                                date={this.state.date}
                                mode="date"
                                placeholder="对接时间"
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
                        <TouchableOpacity onPress={() => {
                            this.setState({isCarVisible: !this.state.isCarVisible});
                        }}>
                            <View style={styles.control}>
                                <Image style={styles.ctrlIcon} source={require('../drawable/car.png')}/>
                                <Text style={{color: 'white'}}>
                                    {this.state.isNeedCar ? (this.state.carType + '  ' + this.state.carMember) : '不申请车辆'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {
                            this._carView()
                        }
                        <TouchableOpacity onPress={() => {
                            this.setState({isRemarkVisible: !this.state.isRemarkVisible});
                        }}>
                            <View style={styles.control}>
                                <Image style={styles.ctrlIcon} source={require('../drawable/remark.png')}/>
                                <Text numberOfLines={1}
                                      style={{color: 'white',}}>{this.state.remarkStr === '' ? '备注' : this.state.remarkStr}</Text>
                            </View></TouchableOpacity>
                        {this._remarkView()}

                    </View>

                    <ListView
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        renderRow={ (rowData) => <WorkItem work={rowData} func={() => {
                        }}/>}/>


                    <TouchableOpacity onPress={() => {
                        this.props.nav.navigate(
                            'add',
                            {
                                addWork: (array) => {
                                //    console.log(array);
                                    this.state.items = this.state.items.concat(array);
                                  //  console.log(this.state.items);
                                    this.setState({dataSource: this.state.dataSource.cloneWithRows(this.state.items),});
                                }
                            },
                        )
                    }}>
                        <View
                            style={styles.card}>
                            <Image style={styles.ctrlIcon} source={require('../drawable/pin_add.png')}/>
                            <Text style={{fontSize: 15}}>添加工作</Text>
                            <Text style={{fontSize: 12}}>添加外出工作事项，可添加多项</Text>
                        </View>

                    </TouchableOpacity>
                </ScrollView>
                <Loading visible={this.state.isLoading}/>

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
            marginRight: 16,
            resizeMode: 'contain'
        },
        textRemark: {
            width: width - 32,
            height: 65,
            marginLeft: 10,
            marginRight: 10,
            color: 'white',
            marginBottom: 16
        },

    });

const mapStateToProps = (state) => {
  //  console.log(JSON.stringify(state));

    return {
        refreshList: state.mainStore.refreshList
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(WorkPager);