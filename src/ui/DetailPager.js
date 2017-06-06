/**
 * Created by Administrator on 2017/3/13.
 *
 * loading usage
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    ScrollView,
    ListView,
    Text,
    Image,
    InteractionManager,
    Alert
} from 'react-native';
import Color from '../constant/Color';
import Toolbar from './Component/Toolbar'
import Moment from 'moment';
import ApiService from '../network/ApiService';
import  App from '../constant/Application'
import Toast from 'react-native-root-toast';
import Loading from 'react-native-loading-spinner-overlay';
import {DetailItem} from "./Component/DetailItem";
import InputDialog from "./Component/InputDialog";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {mainActions} from "../actions/MainAction";
import Utility from "../utils/Utility";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');


 class DetailPager extends Component {

    constructor(props) {
        super(props);
        let date = new Date();
        this.dateStr = Moment(date).format('YYYY-MM-DD');

        this.state = {
            isLoading: false,
            isCarVisible: false,
            isNeedCar: false,
            isRemarkVisible: false,
            items: this.props.task.list,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            rejectContent: '',
            carNumber: this.props.task.CarNumber,
            tripText:""
        };

    }

    componentDidMount() {
     //   InteractionManager.runAfterInteractions(() => {
        //    console.log('----------detail componentDidMount-----------------');
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.state.items),
            });



     //   });

    }

    _getTypeString(){
        let temp;
        if(this.props.task.DailyType===0){
            temp = "当天来回"
        }else if(this.props.task.DailyType===1){
            temp = "驻厂"

        }else if(this.props.task.DailyType===2){
            temp = "出差，结束时间："+(this.props.task.DailyEndDate?Utility.getTime(this.props.task.DailyEndDate):'无')

        }else{
            temp = "不需要外出"
        }
        return temp;
    }

    _setList() {
        return <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            style={{marginBottom:25}}
            renderRow={ (rowData, rowID, sectionID) =>
                <DetailItem
                    status={this.props.task.DailyRecordState}
                    work={rowData}
                    func={() => {

                        if (this.props.task.DailyRecordState === 2 && App.account === this.props.task.Creator) {
                            //sign work
                            this.props.nav.navigate('sign',{
                                position: sectionID,
                                task: this.props.task,
                                content:rowData.WorkResult,
                                commentWork: (resultArray) => {
                                    this.state.items = JSON.parse(JSON.stringify(resultArray));
                                    // console.log('-----------------update'+JSON.stringify( this.state.items));

                                    this.setState({
                                        dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                                    });

                                }
                            });

                        } else {
                            let type = -1;
                            if (this.props.task.DailyRecordState === 3 && App.workType.indexOf('项目专员') > -1 && App.account !== this.props.task.Creator) {
                                type = 1;
                            } else if (this.props.task.DailyRecordState === 3 && App.workType.indexOf('数据专员') > -1) {
                                type = 0;
                            } else Toast.show('当前你不需要操作本工作');

                            if (type !== -1) {
                                this.props.nav.navigate('comment',{
                                    type: type,//1 full star
                                    position: sectionID,
                                    task: this.props.task,
                                    commentWork: (resultArray) => {
                                        this.state.items = JSON.parse(JSON.stringify(resultArray));
                                        //    console.log('-----------------update'+JSON.stringify( this.state.items));
                                        this.setState({
                                            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
                                        });
                                    }
                                },);

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
        if (this.props.task.CarType === '') {
            Toast.show('不需要车牌');
        } else {
            this.props.nav.navigate('param',{
                title: '选择车牌',
                type: 2,//2 car
                searchKey: this.props.task.Guid,
                setSelect: (select) => {
                    this.setState({carNumber: select})
                }},);
        }


    }

    _deleteDialog() {
        Alert.alert(
            '删除',
            '是否删除当前任务？',
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
        let allSign = true;
        this.props.task.list.map((work, index) => {
            if (!work.WorkResult) {
                allFinish = false;
            }
            if(work.VisitingMode.indexOf("走访")>-1&& this.props.task.Signtype!==3){
                allSign = false;
            }
        });

        if (!allFinish) {
            Toast.show('还有未对接内容');
            return;
        }

/*        if(!allSign){
            Toast.show('还没完成签到');
            return;
        }*/
        if ((this.props.task.CarType === '公司车辆' || this.props.task.CarType === '私车公用') && !this.props.task.CarNumber) {
            Toast.show('请先联系助理，填写公司车牌号码');
            return;
        }
        Alert.alert(
            allSign?'完结':'未完成签到',
            allSign?'是否完结当前任务？':'你的签到还没完成，是否坚持提交？',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '提交', onPress: () => {
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
                        this.popupDialog.dismiss();
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
                   // this.props.nav.pop();
                    this.props.actions.refreshList(true);
                    this.props.nav.goBack(null);
                } else {
                    Toast.show(responseJson.ErrDesc);
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
            })
            .catch((error) => {
                console.log(error);
                Toast.show("出错了，请稍后再试");
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            })
            .done();
    }

    _delete() {
        this.setState({isLoading: true});
        ApiService.deleteWork(this.props.task.Guid)
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    Toast.show('操作成功');
                    //this.props.nav.pop();
                    this.props.actions.refreshList(true);
                    this.props.nav.goBack(null);
                } else {
                    Toast.show(responseJson.ErrDesc);
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
            })
            .catch((error) => {
                console.log(error);
                Toast.show("出错了，请稍后再试");
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
            })
            .done();
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>

                <Toolbar title={['对接内容', this.props.task.DailyRecordStateName]}
                         color={Color.colorCyan}
                         elevation={2}
                         isHomeUp={true}
                         isAction={true}
                         isActionByText={true}
                         actionArray={this._getActionStr()}
                         functionArray={[
                             () => {
                                 this.props.nav.goBack();
                             }
                         ].concat(this._getActionFunc())}/>
                <ScrollView>
                    <View style={{
                        flexDirection: 'column',
                        backgroundColor: Color.colorCyan,
                        padding: 16,
                    }}>
                        <Text style={{color: 'white', marginBottom: 5}}>{'对接时间：' + this.props.task.DockingDate}</Text>
                        <Text style={{color: 'white', marginBottom: 5}}>{'车辆类型：' + this.props.task.CarType}</Text>
                        <Text style={{color: 'white', marginBottom: 5}}>{'车牌号码：' + this.state.carNumber}</Text>
                        <Text style={{color: 'white', marginBottom: 5}}>{'陪同人：' + this.props.task.FollowPeson}</Text>
                        <Text style={{color: 'white', marginBottom: 5}}>{'备注：' + this.props.task.Remark}</Text>
                        <Text style={{color: 'white'}}>{'申请人：' + this.props.task.Creator}</Text>
                        <Text style={{color: 'white'}}>{'外出类型：' + this._getTypeString()}</Text>

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

const mapStateToProps = (state) => {
 //   console.log(JSON.stringify(state));

    return {
        refreshList: state.mainStore.refreshList
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(DetailPager);
