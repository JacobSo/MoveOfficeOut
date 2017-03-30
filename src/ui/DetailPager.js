/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    ListView,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Moment from 'moment';
import DatePicker from '../ui/Component/DatePicker';
import ApiService from '../network/ApiService';
import PopupDialog, {DialogTitle, SlideAnimation}from 'react-native-popup-dialog';
import  App from '../constant/Application'
import Toast from 'react-native-root-toast';
import Loading from 'react-native-loading-spinner-overlay';
import {DetailItem} from "./Component/DetailItem";
import InputDialog from "./Component/InputDialog";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');


export default class SearchPager extends Component {

    constructor(props) {
        super(props);
        let date = new Date();
        this.dateStr = Moment(date).format('YYYY-MM-DD');

        this.state = {
            isLoading: false,
            isCarVisible: false,
            isNeedCar: false,
            isRemarkVisible: false,
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            rejectContent: '',
            carNumber: this.props.task.CarNumber
        };

    }

    componentDidMount() {
        this.state.items = this.props.task.list;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
        });
    }

    _setList() {
        return <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderRow={ (rowData, rowID, sectionID) =>
                <DetailItem
                    status={this.props.task.DailyRecordState}
                    work={rowData}
                    func={() => {

                        if (this.props.task.DailyRecordState === 2 && App.account === this.props.task.Creator) {
                            //sign work
                            this.props.nav.push({
                                id: 'sign',
                                params: {
                                    position: sectionID,
                                    task: this.props.task,
                                    commentWork: (resultArray) => {
                                        this.setState({
                                            dataSource: this.state.dataSource.cloneWithRows(resultArray),
                                        });
                                    }
                                },
                            });
                        } else {
                            let type = -1;
                            if (this.props.task.DailyRecordState === 3 && App.workType.indexOf('项目专员') > -1 && App.account !== this.props.task.Creator) {
                                type = 1;
                            } else if (this.props.task.DailyRecordState === 3 && App.workType.indexOf('数据专员') > -1) {
                                type = 0;
                            } else Toast.show('当前你不需要操作本工作');

                            if (type !== -1) {
                                this.props.nav.push({
                                    id: 'comment',
                                    params: {
                                        type: type,//1 full star
                                        position: sectionID,
                                        task: this.props.task,
                                        commentWork: (resultArray) => {
                                            this.setState({
                                                dataSource: this.state.dataSource.cloneWithRows(resultArray),
                                            });
                                        }
                                    },
                                });
                            }

                        }

                    }}/>
            }/>
    }

    _setReject() {
        if (this.props.task.DailyRecordState === 0) {
            return (<View style={{
                backgroundColor: Color.black_semi_transparent,
                width: width - 32,
                alignItems: 'center',
                margin: 16
            }}>

                <Image source={require('../drawable/task_warn.png')}
                       style={{width: 25, height: 25, resizeMode: 'contain', marginTop: 16}}/>
                <Text style={{color: 'white'}}>驳回</Text>
                <Text style={{color: 'white', margin: 10,}}>{this.props.task.RejectMark}</Text>
            </View>)
        } else return null;

    }

    _getActionStr() {
        if (this.props.task.Creator === App.account) {
            if (this.props.task.DailyRecordState === 1 || this.props.task.DailyRecordState === 0) {
                return ['删除']
            } else if (this.props.task.DailyRecordState === 2) {
                return ['完成']
            } else return [];
        } else if (App.workType.indexOf('项目专员') > -1 && this.props.task.Creator !== App.account) {
            if (this.props.task.DailyRecordState === 1) {
                return ['审核', '驳回']
            } else return [];
        } else if (App.workType.indexOf('助理') > -1) {
            if (this.props.task.DailyRecordState === 2) {
                return ['填写车牌', '删除']
            } else if (this.props.task.DailyRecordState === 1 || this.props.task.DailyRecordState === 3) {
                return ['填写车牌']
            } else return [];
        } else return [];
    }

    _getActionFunc() {
        if (this.props.task.Creator === App.account) {
            if (this.props.task.DailyRecordState === 1 || this.props.task.DailyRecordState === 0) {
                return [() => {
                    this._deleteDialog();
                }]//delete
            } else if (this.props.task.DailyRecordState === 2) {
                return [() => {
                    this._finishDialog();
                }]
            } else return [];
        } else if (App.workType.indexOf('项目专员') > -1 && this.props.task.Creator !== App.account) {
            if (this.props.task.DailyRecordState === 1) {
                return [
                    () => {
                        this._passDialog();
                    },
                    () => {
                        this.popupDialog.show();
                    }]
            } else return [];
        } else if (App.workType.indexOf('助理') > -1) {
            if (this.props.task.DailyRecordState === 2) {
                return [
                    () => {
                        this._carSelect();
                    },
                    () => {
                        this._deleteDialog()
                    }]
            } else if (this.props.task.DailyRecordState === 1 || this.props.task.DailyRecordState === 3) {
                return [() => {
                    this._carSelect();
                }]
            } else return [];
        } else return [];
    }

    _carSelect() {
        this.props.nav.push(
            {
                id: 'param',
                params: {
                    title: '选择车牌',
                    type: 2,//2 car
                    searchKey: this.props.task.Guid,
                    setSelect: (select) => {
                        this.setState({carNumber: select})
                    }
                },
            }
        );
    }

    _deleteDialog() {
        Alert.alert(
            '删除',
            '是否删除当前未审核任务？',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this._delete();
                }
                },
            ]
        )
    }

    _finishDialog() {
        let allFinish = true;
        this.props.task.list.map((work, index) => {
            if (!work.WorkResult) {

                allFinish = false;
            }

        });

        if (!allFinish) {
            Toast.show('还有未对接内容');
            return;
        }
        if ((this.props.task.CarType === '公司车辆' || this.props.task.CarType === '私车公用') && !this.props.task.CarNumber) {
            Toast.show('请先联系助理，填写公司车牌号码');
            return;
        }
        Alert.alert(
            '完结',
            '是否完结当前任务？',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this._finish(2)
                }
                },
            ]
        )
    }

    _passDialog() {
        Alert.alert(
            '通过审核',
            '是否审核通过？',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this._finish(0);
                }
                },
            ]
        )
    }

    _rejectDialog() {
        return (
            <InputDialog
                action={[
                    (popupDialog) => {
                        this.popupDialog = popupDialog;
                    },
                    (text) => {//input listen
                        this.setState({rejectContent: text})
                    },
                    () => {//dismiss
                        this.setState({rejectContent: ''});
                        this.popupDialog.dismiss();
                    },
                    () => {
                        this._finish(1);
                    }
                ]} str={['驳回', '驳回内容']}/>
        )
    }


    _finish(flag) {
        this.setState({isLoading: true});
        ApiService.finishWork(this.props.task.Guid, flag, this.state.rejectContent)
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    Toast.show('操作成功');
                    this.props.nav.pop();
                } else {
                    Toast.show(responseJson.ErrDesc)
                }
            }).done(this.setState({isLoading: false}));
    }

    _delete() {
        this.setState({isLoading: true});
        ApiService.deleteWork(this.props.task.Guid)
            .then((responseJson) => {
                this.setState({isLoading: false});
                if (!responseJson.IsErr) {
                    Toast.show('操作成功');
                    this.props.nav.pop();
                } else {
                    Toast.show(responseJson.ErrDesc)
                }
            })
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar title={['对接内容', this.props.task.DailyRecordStateName]}
                         color={Color.colorPrimary}
                         elevation={0}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={this._getActionStr()}
                         functionArray={[
                             () => {
                                 this.props.nav.pop()
                             }
                         ].concat(this._getActionFunc())}/>
                <ScrollView>
                    <View style={{
                        flexDirection: 'column',
                        backgroundColor: Color.colorPrimary,
                        padding: 16,
                    }}>
                        <Text style={{color: 'white', marginBottom: 5}}>{'对接时间：' + this.props.task.DockingDate}</Text>
                        <Text style={{color: 'white', marginBottom: 5}}>{'车辆类型：' + this.props.task.CarType}</Text>
                        <Text style={{color: 'white', marginBottom: 5}}>{'车牌号码：' + this.state.carNumber}</Text>
                        <Text style={{color: 'white', marginBottom: 5}}>{'陪同人：' + this.props.task.FollowPeson}</Text>
                        <Text style={{color: 'white', marginBottom: 5}}>{'备注：' + this.props.task.Remark}</Text>
                        <Text style={{color: 'white'}}>{'申请人：' + this.props.task.Creator}</Text>
                    </View>
                    {this._setReject()}
                    {this._setList()}
                </ScrollView>
                {this._rejectDialog()}
                <Loading visible={this.state.isLoading}/>
            </View>
        )
    }
}


