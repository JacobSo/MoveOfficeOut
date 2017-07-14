/**
 * Created by Administrator on 2017/3/13.
 *
 * loading usage
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
    Switch, Alert,
    KeyboardAvoidingView, BackHandler,Platform
} from 'react-native';
import SnackBar from 'react-native-snackbar-dialog'
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
import App from '../constant/Application';
import {connect} from "react-redux";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const carList = ["公司车辆", "私车公用", "其他"];
const tripList = ["当天来回", "驻厂", "出差"];

class WorkPager extends Component {
    constructor(props) {
        super(props);
        let date = new Date();
        this.dateStr = Moment(date).format('YYYY-MM-DD');

        this.state = {
            isLoading: false,
            date: '',
            tripDate: '',
            isCarVisible: false,
            isTripVisible: false,
            isRemarkVisible: false,
            isDepartmentVisible: false,
            isNeedCar: false,
            isNeedTrip: false,
            carType: carList[0],//default open value
            carMember: '',
            tripType: 0,//
            tripText: tripList[0],//
            remarkStr: '',
            departmentName: (App.dptList ? App.dptList[0].dptname : ''),
            departmentId: (App.dptList ? App.dptList[0].dptid : ''),
            departmentPosition: 0,
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        if (Platform.OS === "android")
            BackHandler.addEventListener('hardwareBackPress', this.onBackAction);
    }

    onBackAction = () => {
        Alert.alert(
            '退出编辑2？',
            '放弃当前填写内容？退出后不可恢复',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => this.goBack()
                },
            ]
        );
        return true
    };

    goBack(){
        if (Platform.OS === "android")
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAction);
        this.props.nav.goBack(null);
    }

    _createWork() {
        if (this.state.items.length === 0) {
            SnackBar.show('请添加工作');
            return;
        }
        if (this.state.date === '') {
            SnackBar.show('请选择对接时间');
            return;
        }
        if (this.state.departmentId === '') {
            SnackBar.show('请选择部门');
            return;
        }

        if (this.state.tripType === 2 && !this.state.tripDate) {
            SnackBar.show("请选择出差结束时间")
            return
        }

        let isHasTrip = false;
        this.state.items.map((data) => {
            if (data.VisitingMode.indexOf("走访") > -1) {
                isHasTrip = true;
            }
        });
        if (!isHasTrip && this.state.isNeedTrip) {
            SnackBar.show('至少添加一个走访工作');
            return;
        }

        if (isHasTrip && !this.state.isNeedTrip) {
            SnackBar.show('需要选择外出类型');
            return;
        }

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
                    ApiService.createWork(
                        this.state.date,
                        this.state.isNeedCar,
                        this.state.isNeedCar ? this.state.carType : '',
                        this.state.carMember,
                        this.state.remarkStr,
                        JSON.stringify(this.state.items),
                        this.state.departmentId,
                        this.state.isNeedTrip ? this.state.tripType : 3,
                        this.state.tripDate
                    )
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                this.props.actions.refreshList(true);
                                SnackBar.show('操作成功');
                                this.goBack()
                            } else {
                                SnackBar.show(responseJson.ErrDesc);
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            SnackBar.show("出错了，请稍后再试");
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                        }).done();
                }
                },
            ]
        )
    }

    _carView() {
        if (this.state.isCarVisible) {
            return (
                <View>
                    <View style={{flexDirection: 'row', width: width, justifyContent: 'space-between',}}>
                        <Text style={{margin: 16, paddingLeft: 16, color: 'white', textAlign: "center"}}>申请车辆</Text>
                        <Switch
                            style={{marginRight: 32}}
                            onValueChange={(value) => {
                                this.setState({isNeedCar: value});
                                if (!value) {
                                    this.state.carMember = '';
                                }
                            }}
                            onTintColor={Color.colorAccent}
                            tintColor  ={Color.colorBlueGrey}
                            thumbTintColor ={"white"}
                            value={this.state.isNeedCar}/>
                    </View>
                    <RadioForm
                        buttonColor={this.state.isNeedCar ? Color.colorAccent : Color.content}
                        labelStyle={{color: 'white', margin: 10}}
                        radio_props={ [
                            {label: carList[0], value: 0},
                            {label: carList[1], value: 1},
                            {label: carList[2], value: 2},
                        ]}
                        initial={0}
                        formHorizontal={false}
                        onPress={(value) => this.setState({carType: carList[value]})}
                        style={{marginLeft: 32, marginBottom: 16, height: 100, width: width - 64}}
                        disabled={!this.state.isNeedCar}/>

                    <TextInput style={styles.textRemark}
                               placeholder="陪同人"
                               placeholderTextColor={Color.background}
                               onChangeText={(text) => this.setState({carMember: text})}
                               editable={this.state.isNeedCar}
                               multiline={true}
                               underlineColorAndroid="transparent"
                               returnKeyType={'done'}
                               blurOnSubmit={true}
                               value={this.state.carMember}/>
                </View>
            )
        } else {
            return ( null)
        }
    }

    _tripView() {
        if (this.state.isTripVisible) {
            return (
                <View style={{paddingBottom: 16}}>
                    <View style={{flexDirection: 'row', width: width, justifyContent: 'space-between',}}>
                        <Text style={{margin: 16, paddingLeft: 16, color: 'white', textAlign: "center"}}>是否外出</Text>
                        <Switch
                            style={{marginRight: 32}}
                            onValueChange={(value) => {
                                this.setState({isNeedTrip: value,});
                            }}
                            onTintColor={Color.colorAccent}
                            tintColor  ={Color.colorBlueGrey}
                            thumbTintColor ={"white"}
                            value={this.state.isNeedTrip}/>
                    </View>
                    <RadioForm
                        buttonColor={this.state.isNeedTrip ? Color.colorAccent : Color.content}
                        labelStyle={{color: 'white', margin: 10}}
                        radio_props={ [
                            {label: tripList[0], value: 0},
                            {label: tripList[1], value: 1},
                            {label: tripList[2], value: 2},
                        ]}
                        initial={0}
                        formHorizontal={false}
                        onPress={(value) => {
                            this.setState({
                                tripType: value,
                                tripText: tripList[value]
                            })
                        }}
                        style={{marginLeft: 32, marginBottom: 16, height: 100, width: width - 64}}
                        disabled={!this.state.isNeedTrip}
                    />
                    {
                        (() => {
                            if (this.state.tripType === 2 && this.state.isNeedTrip) {
                                return (
                                    <DatePicker
                                        style={{
                                            backgroundColor: Color.trans,
                                            position: 'absolute',
                                            right: 32,
                                            bottom: 0,
                                        }}
                                        date={this.state.tripDate}
                                        mode="date"
                                        placeholder="出差结束时间"
                                        format="YYYY-MM-DD"
                                        minDate={this.dateStr}
                                        confirmBtnText="确认"
                                        cancelBtnText="取消"
                                        showIcon={false}
                                        onDateChange={(date) => {
                                            this.setState({tripDate: date})
                                        }}
                                    />
                                )
                            } else {
                                return null
                            }
                        })()
                    }
                </View>
            )
        } else {
            return ( null)
        }
    }

    _remarkView() {
        if (this.state.isRemarkVisible) {
            return (
                <TextInput style={styles.textRemark}
                           placeholder="备注"
                           placeholderTextColor={Color.background}
                           onChangeText={(text) => this.setState({remarkStr: text})}
                           multiline={true}
                           value={this.state.remarkStr}
                           underlineColorAndroid="transparent"
                           returnKeyType={'done'}
                           blurOnSubmit={true}
                />
            )
        } else {
            return ( null)
        }
    }

    _departmentView() {
        if (this.state.isDepartmentVisible) {
            // console.log(JSON.stringify(App.dptList));
            let dataArray = [];
            App.dptList.map((x, index) => {
                dataArray.push({label: App.dptList[index].dptname, value: index});
            });
            //  console.log(JSON.stringify(dataArray));
            return (
                <View style={{height: 55 * dataArray.length, width: width - 64, justifyContent: 'space-between',}}>
                    <RadioForm
                        buttonColor={Color.colorAccent}
                        labelStyle={{color: 'white', margin: 10}}
                        radio_props={dataArray}
                        initial={this.state.departmentPosition}
                        onPress={(value) => {
                            this.setState({
                                departmentId: App.dptList[value].dptid,
                                departmentName: App.dptList[value].dptname,
                                isDepartmentVisible: !this.state.isDepartmentVisible,
                                departmentPosition: value,
                            });
                        }}
                        style={{marginTop: 16,}}
                    />
                </View>)
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-20}>
                <View style={{backgroundColor: Color.background, height: height}}>
                    <Toolbar title={['外出申请']}
                             color={Color.colorCyanDark}
                             elevation={2}
                             isHomeUp={true}
                             isAction={true}
                             isActionByText={true}
                             actionArray={['提交']}
                             functionArray={[
                                 () => {
                                     if (this.state.items.length === 0) {
                                          this.goBack()
                                     } else this.onBackAction()
                                 },
                                 () => this._createWork()
                             ]}/>

                    <ScrollView>
                        <View style={{
                            backgroundColor: Color.background
                        }}>


                            <ScrollView>
                                <View style={{
                                    flexDirection: 'column',
                                    backgroundColor: Color.colorCyanDark,
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
                                    {
                                        (() => {
                                            if (App.dptList !== '' && App.dptList.length > 1) {
                                                return (
                                                    <TouchableOpacity onPress={() => {
                                                        this.setState({isDepartmentVisible: !this.state.isDepartmentVisible})
                                                    }}>
                                                        <View style={styles.control}>
                                                            <Image style={styles.ctrlIcon}
                                                                   source={require('../drawable/department.png')}/>
                                                            <Text numberOfLines={1}
                                                                  style={{
                                                                      color: 'white',
                                                                      width: 200,
                                                                  }}>{this.state.departmentName === '' ? '选择部门' : this.state.departmentName}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        })()
                                    }

                                    {this._departmentView()}
                                    <TouchableOpacity onPress={() => {
                                        this.setState({isCarVisible: !this.state.isCarVisible});
                                    }}>
                                        <View style={styles.control}>
                                            <Image style={styles.ctrlIcon} source={require('../drawable/car.png')}/>
                                            <Text numberOfLines={1}
                                                  style={{color: 'white', width: 200}}>
                                                {this.state.isNeedCar ? (this.state.carType + '  ' + this.state.carMember) : '不申请车辆'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    {
                                        this._carView()
                                    }
                                    <TouchableOpacity onPress={() => {
                                        this.setState({isTripVisible: !this.state.isTripVisible});
                                    }}>
                                        <View style={styles.control}>
                                            <Image style={styles.ctrlIcon}
                                                   source={require('../drawable/calendar.png')}/>
                                            <Text numberOfLines={1}
                                                  style={{color: 'white', width: 200}}>
                                                {this.state.isNeedTrip ? (this.state.tripType === 2 ? ( this.state.tripText + "，" + this.state.tripDate) : this.state.tripText) : '不需外出'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    {
                                        this._tripView()
                                    }
                                    <TouchableOpacity onPress={() => {
                                        this.setState({isRemarkVisible: !this.state.isRemarkVisible});
                                    }}>
                                        <View style={styles.control}>
                                            <Image style={styles.ctrlIcon} source={require('../drawable/remark.png')}/>
                                            <Text numberOfLines={1}
                                                  style={{
                                                      color: 'white',
                                                      width: 200,
                                                  }}>{this.state.remarkStr === '' ? '备注' : this.state.remarkStr}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {this._remarkView()}

                                </View>

                                <ListView
                                    style={{marginBottom: 25}}
                                    dataSource={this.state.dataSource}
                                    enableEmptySections={true}
                                    renderRow={ (rowData, sectionID, rowID) =>
                                        <WorkItem
                                            work={rowData}
                                            func={() => {
                                                this.props.nav.navigate(
                                                    'add',
                                                    {
                                                        addWork: (array) => {
                                                            //    console.log(array);
                                                            this.state.items[rowID] = array[0];
                                                            //   console.log(JSON.stringify(array[0]));
                                                            // console.log(JSON.stringify(this.state.items));

                                                            this.setState({dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),});
                                                        },
                                                        existData: rowData,
                                                        deleteData: () => {
                                                            this.state.items.splice(rowID, 1);
                                                            this.setState({dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),});

                                                        }
                                                    },
                                                )
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
                                            },
                                            existData: {
                                                SupplierName: "",
                                                Series: '',
                                                WorkContent: '',
                                                VisitingMode: '',
                                                wayCall: false,
                                                wayQQ: false,
                                                wayMeet: false,
                                            },
                                            deleteData: () => {

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
                    </ScrollView></View></KeyboardAvoidingView>
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
            backgroundColor: Color.colorCyan,
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
            width: width - 64,
            height: 45,
            marginLeft: 32,
            marginRight: 32,
            marginTop: 16,
            color: 'white',
            borderColor: Color.colorAccent,
            borderBottomWidth: 2,
            marginBottom: 10,

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