'user strict';

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    Alert,
    ListView,
    Text,
    Image,
    TouchableOpacity,
    Switch,
    TextInput,
    Platform,
    BackHandler

} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/WpApiService';
import Color from '../../constant/Color';
import Loading from 'react-native-loading-spinner-overlay';
import DatePicker from "../Component/DatePicker";
import {WpProductItem} from "../Component/WpProductItem";
import AndroidModule from '../../module/AndoridCommontModule'
import IosModule from '../../module/IosCommontModule'
import Utility from "../../utils/Utility";
import SnackBar from 'react-native-snackbar-dialog'
import RadioForm from 'react-native-simple-radio-button';
const {width, height} = Dimensions.get('window');

export default class WpWorkPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModify: false,//modify mode
            isChange: false,//in modify mode which is data change flag
            isLoading: false,
            isCarVisible: false,
            isWood: false,
            Series: "",
            SupplierName: "",
            date: "",
            memberText: "",
            isNeedCar: false,
            items: {},
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),

            submitPic: [],
            submitProduct: [],
            //check box data
            factoryMember: [],
            selectMember: '',
            isShowMember: false,
            selectValue: 0
        }
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        if (Platform.OS === "android")
            BackHandler.addEventListener('hardwareBackPress', this.onBackAction);
    }

    componentDidMount() {//001-1,010-2,011-3,100-4,101-5,110-6,111-7
        if (this.props.task) {
            this.props.task.productlist.map((data) => {
                let temp = [];
                switch (data.Stage) {
                    case 1:
                        temp = [false, false, true];
                        break;
                    case 2:
                        temp = [false, true, false];
                        break;
                    case 3:
                        temp = [false, true, true];
                        break;
                    case 4:
                        temp = [true, false, false];
                        break;
                    case 5:
                        temp = [true, false, true];
                        break;
                    case 6:
                        temp = [true, true, false];
                        break;
                    case 7:
                        temp = [true, true, true];
                        break;
                }
                data.selectStep = temp;
                this.state.items[data.poldid] = data;
            });


            this.setState({
                isModify: true,
                isWood: this.props.task.ReviewType === 0,
                date: Utility.getTime(this.props.task.ReviewDate),
                isNeedCar: this.props.task.IsApplyCar,
                memberText: this.props.task.FollowPeson,
                Series: this.props.task.Series,
                SupplierName: this.props.task.FacName,
                dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items))),
                selectMember: this.props.task.Executor,
                selectValue: 0,
            })
        }
    }

    onBackAction = () => {
        Alert.alert(
            '退出创建？',
            '放弃当编辑的工作？退出后不可恢复',
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
        return true;
    };

    goBack() {
        this.props.nav.goBack(null);
        if (Platform.OS === "android")
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAction);
    }

    pack() {
        let isAllFinish = true;
        let temp = [];
        let picTemp = [];
        for (let Id in this.state.items) {
            let data = this.state.items[Id];
            // console.log(JSON.stringify(data));
            if (data.selectStep && (data.selectStep.indexOf(true) > -1)) {
                temp.push({
                    id: data.poldid ? data.poldid : data.Id,//poldid 存在，已有产品//不存在则新增
                    stage: JSON.stringify(data.selectStep)
                })
            } else {
                isAllFinish = false
            }


            if (data.pics && data.pics.length !== 0) {
                data.pics.map((pic) => {
                    //console.log(JSON.stringify(pic));
                    picTemp.push({
                        path: pic.uri.replace('file://', ''),
                        id: data.poldid ? data.poldid : data.Id,
                        imgCode: '',
                        fileName: pic.fileName ? pic.fileName : pic.uri.substring(pic.uri.lastIndexOf('/'), pic.uri.length),
                        reviewbillguid: '',
                        poldid: data.poldid,
                    })
                })
            } else {//no photo ，check existed photo
                if (!data.FacPicPath)
                    isAllFinish = false;
            }
        }
        /* this.state.items.map((data) => {

         });*/
        if (isAllFinish) {
            //   console.log(JSON.stringify(temp));
            this.state.submitProduct = temp;
            this.state.submitPic = picTemp;

        }
        return isAllFinish
    }

    postDialog() {
        // console.log(JSON.stringify(this.state.items));
        if (!Object.getOwnPropertyNames(this.state.items).length) {
            SnackBar.show("请选择评审产品");
            return
        }

        if (!this.state.date) {
            SnackBar.show("请选择评审时间");
            return
        }

        if (!this.state.isWood && !this.state.SupplierName) {
            SnackBar.show("请选择供应商");
            return
        }

        if (this.state.isWood && !this.state.selectMember) {
            SnackBar.show("请选择评审人");
            return
        }
        if (this.state.isWood && (!this.state.Series || !this.state.SupplierName)) {
            SnackBar.show("请选择系列和供应商");
            return
        }

        if (!this.pack()) {
            SnackBar.show("每个产品都需要添加阶段和图片");
            return
        }

        Alert.alert(
            this.state.isModify ? '确认修改' : '确认上传',
            (this.state.isModify ? '确认修改' : '确认上传') + '，包含图片共' + this.state.submitPic.length + "张",
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    // console.log(JSON.stringify(this.state.items))
                    this.pack();
                    this.postText();
                }
                },
            ]
        )
    }

    postText() {
        this.setState({isLoading: true});
        this.createOrModifyReq().then((responseJson) => {
            if (!responseJson.IsErr) {
                if (this.state.submitPic.length !== 0)
                    this.postImage(responseJson.ReviewBillGuid);
                else {
                    SnackBar.show("提交成功");
                    this.props.refreshFunc();
                    this.goBack()
                }
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
            })
            .done()
    }

    getMember() {
        if (this.state.factoryMember.length !== 0) {
            this.setState({isShowMember: !this.state.isShowMember});
        } else {
            this.setState({isLoading: true});
            ApiService.getFactoryMember().then((responseJson) => {
                if (!responseJson.IsErr) {
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                    let temp = [];
                    responseJson.list.map((data, index) => {
                        temp.push({
                            label: data,
                            value: index
                        })
                    });
                    this.state.factoryMember = temp;
                    this.setState({isShowMember: !this.state.isShowMember});

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
                })
                .done()
        }

    }


    createOrModifyReq() {
        if (this.state.isModify) {
            return ApiService.modifyWork(
                this.props.task.Guid,
                this.state.Series,
                this.state.isNeedCar ? 1 : 0,
                this.state.SupplierName,
                this.state.date,
                this.state.memberText,
                this.state.isWood ? 0 : 1,
                JSON.stringify(this.state.submitProduct),
                this.state.selectMember)
        } else {
            return ApiService.createWork(this.state.Series,
                this.state.isNeedCar ? 1 : 0,
                this.state.SupplierName,
                this.state.date,
                this.state.memberText,
                this.state.isWood ? 0 : 1,
                JSON.stringify(this.state.submitProduct),
                this.state.selectMember)
        }
    }

    postImage(mainId) {
        if (Platform.OS === 'android') {
            this.state.submitPic.map((data, index) => {
                AndroidModule.getImageBase64(data.path, (callBackData) => {

                    this.postImgReq(data, index, callBackData, mainId);
                });
            })
        } else {
            this.state.submitPic.map((data, index) => {
                IosModule.getImageBase64(data.path, (callBackData) => {
                    //SnackBar.show(mainId+','+index+','+JSON.stringify(data));
                    this.postImgReq(data, index, callBackData, mainId);
                })
            });
        }
    }

    postImgReq(data, index, callBackData, mainId) {
        ApiService.uploadImamge(
            data.id,
            callBackData,
            data.fileName,
            this.state.isModify ? this.props.task.Guid : mainId)
            .then((responseJson) => {
                if (!responseJson.IsErr) {
                    if (index === this.state.submitPic.length - 1) {
                        SnackBar.show("提交成功");
                        this.props.refreshFunc();
                        this.goBack()
                    }
                } else {
                    SnackBar.show(responseJson.ErrDesc);
                    if (index === this.state.submitPic.length - 1) {
                        setTimeout(() => {
                            this.setState({isLoading: false})
                        }, 100);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                SnackBar.show("出错了，请稍后再试");
                if (index === this.state.submitPic.length - 1) {
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                }
            }).done();
    }

    submitWork() {
        Alert.alert(
            '确认提交',
            '提交后不可修改',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.submitWork(this.props.task.Guid)
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                SnackBar.show("提交成功");
                                this.props.refreshFunc();
                                this.goBack()
                            } else {
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                                SnackBar.show(responseJson.ErrDesc);

                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                            SnackBar.show("出错了，请稍后再试");
                        }).done();
                }
                },
            ]
        )
    }

    deleteWork() {
        Alert.alert(
            '删除',
            '删除后不可恢复',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.deleteWork(this.props.task.Guid)
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                SnackBar.show("删除成功");
                                this.props.refreshFunc();
                                this.goBack()
                            } else {
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                                SnackBar.show(responseJson.ErrDesc);

                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                            SnackBar.show("出错了，请稍后再试");
                        }).done();
                }
                },
            ]
        )
    }

    _carView() {
        if (this.state.isCarVisible && this.state.isWood) {
            return (
                <View>
                    <View style={{flexDirection: 'row', width: width, justifyContent: 'space-between',}}>
                        <Text style={{margin: 16, paddingLeft: 16, color: 'white', textAlign: "center"}}>申请车辆</Text>
                        <Switch
                            style={{marginRight: 32}}
                            onValueChange={(value) => this.setState({isNeedCar: value})}
                            onTintColor={Color.colorAccent}
                            tintColor={Color.colorBlueGrey}
                            thumbTintColor={"white"}
                            value={this.state.isNeedCar}/>
                    </View>

                    <TextInput style={styles.textRemark}
                               placeholder="陪同人"
                               placeholderTextColor={Color.background}
                               onChangeText={(text) => this.setState({memberText: text})}
                               multiline={true}
                               underlineColorAndroid="transparent"
                               returnKeyType={'done'}
                               blurOnSubmit={true}
                               value={this.state.memberText}/>
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
                <Toolbar
                    elevation={0}
                    title={["评审申请"]}
                    color={Color.colorPurpleDark}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={this.state.isModify ? ["修改", "提交"] : ["创建"]}
                    functionArray={[
                        () => {
                            this.onBackAction();
                        },
                        () => {
                            this.postDialog();
                        },
                        () => {
                            if (this.state.isModify && this.state.isChange) {
                                SnackBar.show("请先点击【修改】，才可【提交】")
                            } else {
                                this.submitWork();
                            }
                        }
                    ]}/>
                <ScrollView >
                    <View style={{
                        backgroundColor: Color.background
                    }}>
                        <ScrollView>
                            <View style={{
                                flexDirection: 'column',
                                backgroundColor: Color.colorPurpleDark,
                                alignItems: 'center',
                                elevation: 2
                            }}>
                                <View style={[styles.control, {justifyContent: 'space-between'}]}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image style={styles.ctrlIcon} source={require('../../drawable/switch.png')}/>
                                        <Text style={ {
                                            color: 'white',
                                        }}>{this.state.isWood ? '板木评审' : '软体评审'}</Text>
                                    </View>
                                    <Switch
                                        style={{marginRight: 16,}}
                                        onValueChange={(value) => {
                                            if (Object.getOwnPropertyNames(this.state.items).length) {
                                                Alert.alert(
                                                    '切换评审',
                                                    '你已经选择了产品，切换会清空已选产品，是否继续？',
                                                    [
                                                        {
                                                            text: '取消', onPress: () => {
                                                        }
                                                        },
                                                        {
                                                            text: '确定', onPress: () => {
                                                            this.state.items = {};
                                                            this.setState({
                                                                isWood: value,
                                                                // isCarVisible:false,
                                                                dataSource: this.state.dataSource.cloneWithRows([])
                                                            })
                                                        }
                                                        },
                                                    ]
                                                )
                                            } else this.setState({isWood: value})
                                        }}
                                        onTintColor={Color.colorAccent}
                                        tintColor={Color.colorBlueGrey}
                                        thumbTintColor={"white"}
                                        value={this.state.isWood}/>
                                </View>
                                <View style={styles.control}>
                                    <Image style={styles.ctrlIcon} source={require('../../drawable/clock.png')}/>
                                    <DatePicker
                                        date={this.state.date}
                                        mode="date"
                                        placeholder="预约评审时间"
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
                                        if (this.state.isWood) {
                                            return (<TouchableOpacity style={styles.control} onPress={() => {
                                                this.setState({isCarVisible: !this.state.isCarVisible});
                                            }}>
                                                <Image style={styles.ctrlIcon}
                                                       source={require('../../drawable/car.png')}/>
                                                <Text numberOfLines={1}
                                                      style={{color: 'white', width: 200}}>
                                                    {(this.state.isNeedCar ? "需要车辆" : '不申请车辆') + " - " + (this.state.memberText ? this.state.memberText : '无陪同人')}
                                                </Text>
                                            </TouchableOpacity>);
                                        }
                                    })()

                                }
                                {
                                    this._carView()
                                }

                                <TouchableOpacity style={styles.control} onPress={() => {
                                    this.props.nav.navigate(
                                        'param',
                                        {
                                            title: '选择供应商',
                                            type: 0,//SupplierName
                                            searchKey: this.state.Series,//if key
                                            setSelect: (select) => {
                                                this.setState({SupplierName: select})
                                            },
                                            isMulti: false,
                                            existData: this.state.SupplierName ? this.state.SupplierName.split(',') : []
                                        },
                                    );
                                }}>
                                    <Image style={styles.ctrlIcon} source={require('../../drawable/remark.png')}/>
                                    <Text numberOfLines={1}
                                          style={{
                                              color: 'white',
                                              width: 200,
                                          }}>{this.state.SupplierName === '' ? '供应商' : this.state.SupplierName}</Text>
                                    <TouchableOpacity style={styles.closeStyle}
                                                      onPress={() => this.setState({SupplierName: ''})}>
                                        <Image source={require('../../drawable/close_white.png')}
                                               style={{width: 15, height: 15,}}/>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                                {
                                    (() => {
                                        if (this.state.isWood) {
                                            return (
                                                <View>
                                                    <TouchableOpacity style={styles.control} onPress={() => {
                                                        this.props.nav.navigate(
                                                            'param',
                                                            {
                                                                title: '选择系列',
                                                                type: 1,//Series
                                                                searchKey: this.state.SupplierName,//if key
                                                                setSelect: (select) => {
                                                                    this.setState({Series: select})
                                                                },
                                                                isMulti: true,
                                                                existData: this.state.Series ? this.state.Series.split(',') : []
                                                            },
                                                        );
                                                    }}>
                                                        <Image style={styles.ctrlIcon}
                                                               source={require('../../drawable/remark.png')}/>
                                                        <Text numberOfLines={1}
                                                              style={{
                                                                  color: 'white',
                                                                  width: 200,
                                                              }}>{this.state.Series === '' ? '系列' : this.state.Series}</Text>
                                                        <TouchableOpacity style={styles.closeStyle}
                                                                          onPress={() => this.setState({Series: ''})}>
                                                            <Image source={require('../../drawable/close_white.png')}
                                                                   style={{width: 15, height: 15,}}/>
                                                        </TouchableOpacity>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={styles.control} onPress={() => {
                                                        this.getMember()
                                                    }}>
                                                        <Image style={styles.ctrlIcon}
                                                               source={require('../../drawable/remark.png')}/>
                                                        <Text numberOfLines={1}
                                                              style={{
                                                                  color: 'white',
                                                                  width: 200,
                                                              }}>{this.state.selectMember ?  this.state.selectMember:'评审人' }</Text>

                                                    </TouchableOpacity>
                                                    {
                                                        (() => {
                                                            if (this.state.isShowMember) {
                                                                return <RadioForm
                                                                    buttonColor={Color.colorAccent}
                                                                    labelStyle={{color: "white", margin: 10}}
                                                                    radio_props={this.state.factoryMember}
                                                                    initial={this.state.selectValue}
                                                                    formHorizontal={false}
                                                                    style={styles.radioStyle}
                                                                    onPress={(value) => {
                                                                        this.setState({
                                                                            selectMember: this.state.factoryMember[value].label,
                                                                            isShowMember: !this.state.isShowMember,
                                                                            selectValue: value
                                                                        })
                                                                    }}
                                                                />
                                                            }
                                                        })()

                                                    }

                                                </View>)
                                        }
                                    })()
                                }
                            </View>

                            <ListView
                                style={{marginBottom: 25}}
                                dataSource={this.state.dataSource}
                                enableEmptySections={true}
                                renderRow={ (rowData, sectionID, rowID) =>
                                    <WpProductItem
                                        isWood={this.state.isWood}
                                        product={rowData}
                                        func={() => {
                                            this.props.nav.navigate(
                                                'wpDetail',
                                                {
                                                    isWood: this.state.isWood,
                                                    product: rowData,
                                                    delFunc: () => {
                                                        this.state.isChange = true;
                                                        delete this.state.items[rowData.poldid];
                                                        this.setState({
                                                            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))
                                                        });
                                                    },
                                                    finishFunc: (modifyData) => {
                                                        this.state.isChange = this.state.items[rowID] !== modifyData;
                                                        this.state.items[rowID] = modifyData;
                                                        this.setState({
                                                            dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))
                                                        });
                                                    }
                                                },
                                            )
                                        }
                                        }/>
                                }/>
                            <TouchableOpacity onPress={() => {
                                if (this.state.isWood) {
                                    if (!this.state.Series) {
                                        SnackBar.show('请先选择系列');
                                        return
                                    }
                                }
                                this.props.nav.navigate(
                                    'wpSearch',
                                    {
                                        isWood: this.state.isWood,
                                        series: this.state.Series,
                                        selectFunc: (data) => {
                                            this.state.isChange = true;
                                            let exist = 0, add = 0;
                                            data.map((d) => {
                                                if (this.state.items[d.poldid] && (d.poldid === this.state.items[d.poldid].poldid)) {
                                                    exist++;
                                                } else {
                                                    this.state.items[d.poldid] = d;
                                                    add++;
                                                }
                                                // console.log(JSON.stringify(this.state.items));
                                            });
                                            // this.state.items =  this.state.items.concat(data);
                                            SnackBar.show("添加产品 " + add + " 件" + (exist === 0 ? "" : ("，重复 " + exist + " 件")));

                                            this.setState({
                                                dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.items)))
                                            });
                                        }
                                    },
                                );
                            }}>
                                <View
                                    style={styles.addCard}>
                                    <Image style={styles.ctrlIcon} source={require('../../drawable/pin_add.png')}/>
                                    <Text style={{fontSize: 15}}>添加评审产品</Text>
                                </View>

                            </TouchableOpacity>
                        </ScrollView>
                        <Loading visible={this.state.isLoading}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create(
    {
        addCard: {
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
            borderRadius:10,
        },
        control: {
            width: width - 32,
            height: 55,
            backgroundColor: Color.colorPurple,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            marginTop: 8,
            borderRadius:10
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
        closeStyle: {
            right: 0,
            position: 'absolute',
            width: 55,
            height: 55,
            alignItems: 'center',
            justifyContent: 'center'
        },
        radioStyle: {
            marginBottom: 16,
            width: width - 32,
            paddingTop: 16,
            paddingLeft: 16
        },
    });
