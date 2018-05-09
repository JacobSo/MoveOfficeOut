/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View, StyleSheet, Dimensions, Platform, ListView, Text, TouchableOpacity, Alert,
    FlatList, Image, TextInput, ScrollView, KeyboardAvoidingView, Switch
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import ApiService from '../../network/CfApiService';
import Color from '../../constant/Color';
import Loading from 'react-native-loading-spinner-overlay'
import SnackBar from 'react-native-snackbar-dialog'
import DatePicker from '../../ui/Component/DatePicker';
import InputDialog from "./../Component/InputDialog";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import {MenuProvider} from 'react-native-popup-menu';
const {width, height} = Dimensions.get('window');
const areaParams = ["佛山市内", "佛山市外"];
export default class CfCreatePager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            useTime: '',
            locations: [],

            tripArea: 0,
            distance: 0,

            privateCar: "",
            privateFeature: "",

            members: "",
            remark: "",
            card: false,

            editContent: '',
            myCar: '',
            selection: 0,
            carType: '公司车辆',
        }
    }

    componentDidMount() {
    }

    requestCar() {
        if (!this.state.useTime) {
            SnackBar.show("必须选择用车日期");
            return
        }
        if (!this.state.locations || this.state.locations.length === 0) {
            SnackBar.show("必须选择目的地");
            return
        }
        if (this.state.distance === 0) {
            SnackBar.show("必须填写里程信息");
            return
        }
        if (this.state.carType === "私车公用" && !this.state.privateCar && !this.state.privateFeature) {
            SnackBar.show("必须填写私车信息");
            return
        }

        Alert.alert(
            '用车申请确认',
            '',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});
                    ApiService.requestCar(this.state)
                        .then((responseJson) => {
                            if (!responseJson.IsErr) {
                                this.props.nav.goBack(null);
                                this.props.finishFunc();
                                SnackBar.show("申请已提交，等待分配");
                            } else {
                                SnackBar.show(responseJson.ErrDesc);
                                setTimeout(() => {
                                    this.setState({isLoading: false})
                                }, 100);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            SnackBar.show("出错了，请稍后再试", {duration: 1500});
                            setTimeout(() => {
                                this.setState({isLoading: false})
                            }, 100);
                        }).done();
                }
                },
            ]
        )


    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white',
            }}>
                    <Toolbar
                        elevation={5}
                        title={["车辆申请"]}
                        color={Color.colorBlueGrey}
                        isHomeUp={true}
                        isAction={true}
                        isActionByText={false}
                        actionArray={[]}
                        functionArray={[
                            () => {
                                this.props.nav.goBack(null)
                            },
                        ]}/>
                    <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-55}>
                        <ScrollView>
                            <View style={{
                                paddingBottom: 100
                            }}>
                                <View style={{
                                    width: width - 32,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    margin: 16,
                                }}>
                                    <Image style={{alignContent: 'center'}}
                                           source={require('../../drawable/car_gray.png')}/>
                                </View>
                                <View style={{
                                    width: width - 32,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: 16
                                }}>
                                    <Text style={{color: Color.black_semi_transparent, fontSize: 18}}>车辆申请</Text>
                                    <Text>外出车辆申请审核后才可以用车</Text>
                                </View>


                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: "space-around",
                                    marginTop: 16
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({selection: 0, carType: "公司车辆"})
                                    }}>
                                        <Text>公司车辆</Text>
                                        <View style={[styles.selection, {
                                            backgroundColor: this.state.selection === 0 ? Color.colorAccent : Color.line,
                                        }]}/>
                                    </TouchableOpacity>
                                    <View style={{backgroundColor: Color.line, width: 1, height: 25}}/>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({selection: 1, carType: "私车公用"})
                                    }}>
                                        <Text>私车公用</Text>
                                        <View style={[styles.selection, {
                                            backgroundColor: this.state.selection === 1 ? Color.colorAccent : Color.line,
                                        }]}/>
                                    </TouchableOpacity>
                                </View>

                                <Text style={{color: Color.colorAccent, margin: 16}}>基本信息</Text>
                                <View style={styles.itemStyle}>
                                    <DatePicker
                                        customStyles={ {
                                            placeholderText: {
                                                color: 'black',
                                                textAlign: 'right'
                                            },
                                            dateText: {color: 'black', textAlign: 'right'},
                                        }}
                                        date={this.state.useTime}
                                        mode="datetime"
                                        placeholder="选择"
                                        format="YYYY-MM-DD HH:mm"
                                        confirmBtnText="确认"
                                        cancelBtnText="取消"
                                        showIcon={true}
                                        onDateChange={(date) => {
                                            this.setState({useTime: date});
                                         //   SnackBar.show(date)
                                        }}
                                    />
                                    <Text style={{position: 'absolute', left: 16,color:'black'}}>用车时间</Text>

                                </View>

                                <FlatList
                                    horizontal={false}
                                    numColumns={2}
                                    // keyExtractor={(item, index) => item.name}
                                    data={this.state.locations}
                                    extraData={this.state}
                                    ListHeaderComponent={
                                        <View style={{flexDirection: 'row'}}>
                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 20,
                                                    borderColor: Color.line,
                                                    borderWidth: 1,
                                                    margin: 16
                                                }}
                                                onPress={
                                                    () => this.props.nav.navigate(
                                                        'param',
                                                        {
                                                            title: '选择供应商',
                                                            type: 0,//SupplierName
                                                            searchKey: this.state.Series,//if key
                                                            setSelect: (select) => {
                                                                this.setState({locations: select.split(",")})
                                                            },
                                                            isMulti: true,
                                                            existData: []
                                                        }
                                                    )
                                                }>
                                                <Text style={styles.textSubStyle}>选择目的地</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    borderRadius: 20,
                                                    borderColor: Color.line,
                                                    borderWidth: 1,
                                                    margin: 16
                                                }}
                                                onPress={
                                                    () => this.popupDialog.show()
                                                }>
                                                <Text style={styles.textSubStyle}>填写目的地</Text>
                                            </TouchableOpacity>
                                        </View>}
                                    renderItem={({item, index}) =>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: Color.colorAccent,
                                                borderRadius: 20,
                                                elevation: 5,
                                                margin: 16
                                            }}
                                            onPress={() => {
                                                this.state.locations.splice(index, 1);
                                                this.setState({})
                                            }
                                            }>
                                            <Text style={{color: "white", margin: 10}}>{item}</Text></TouchableOpacity>}
                                />


                                <Text style={{color: Color.colorAccent, margin: 16}}>路线信息</Text>
                                <MenuProvider>

                                <Menu onSelect={value => this.setState({tripArea: value})}>
                                    <MenuTrigger >
                                        <View style={styles.itemStyle}>
                                            <Text style={styles.textSubStyle}>{"外出范围"}</Text>
                                            <Text
                                                style={[styles.textSubStyle, {color: 'black'}]}>{areaParams[this.state.tripArea]}</Text>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions >
                                        <MenuOption value={0}>
                                            <View style={styles.textStyle}>
                                                <Text style={styles.textSubStyle}>{areaParams[0]}</Text>
                                            </View>
                                        </MenuOption>
                                        <MenuOption value={1}>
                                            <View style={styles.textStyle}>
                                                <Text style={styles.textSubStyle}>{areaParams[1]}</Text>
                                            </View>
                                        </MenuOption>

                                    </MenuOptions>
                                </Menu>
                                </MenuProvider>

                                <View style={styles.itemStyle}>
                                    <Text style={{marginLeft: 16}}>预计里程</Text>
                                    <TextInput style={styles.textInput}
                                               placeholder="预计里程"
                                               returnKeyType={'done'}
                                               keyboardType={'numeric'}
                                               blurOnSubmit={true}
                                               underlineColorAndroid="transparent"
                                               onChangeText={(text) => this.setState({distance: text})}/>
                                </View>


                                {
                                    (() => {
                                        if (this.state.selection === 1)
                                            return <View>
                                                <Text style={{color: Color.colorAccent, margin: 16}}>私车信息</Text>

                                                <View style={styles.itemStyle}>
                                                    <Text style={{marginLeft: 16}}>私车车牌</Text>
                                                    <TextInput style={styles.textInput}
                                                               placeholder="请输入私车车牌"
                                                               returnKeyType={'done'}
                                                               blurOnSubmit={true}
                                                               underlineColorAndroid="transparent"
                                                               onChangeText={(text) => this.setState({privateCar: text})}/>
                                                </View>
                                                <View style={styles.itemStyle}>
                                                    <Text style={{marginLeft: 16}}>排量</Text>
                                                    <TextInput style={styles.textInput}
                                                               placeholder="排量"
                                                               returnKeyType={'done'}
                                                               blurOnSubmit={true}
                                                               underlineColorAndroid="transparent"
                                                               onChangeText={(text) => this.setState({privateFeature: text})}/>
                                                </View>
                                            </View>
                                    })()
                                }


                                <Text style={{color: Color.colorAccent, margin: 16}}>其他信息</Text>
                                <View style={styles.itemStyle}>
                                    <Text style={{marginLeft: 16}}>随行人员</Text>
                                    <TextInput style={styles.textInput}
                                               placeholder="随行人员"
                                               returnKeyType={'done'}
                                               blurOnSubmit={true}
                                               underlineColorAndroid="transparent"
                                               onChangeText={(text) => this.setState({members: text})}/>
                                </View>
                                <View style={styles.itemStyle}>
                                    <Text style={{marginLeft: 16}}>备注</Text>
                                    <TextInput style={styles.textInput}
                                               placeholder="请填写备注"
                                               returnKeyType={'done'}
                                               blurOnSubmit={true}
                                               underlineColorAndroid="transparent"
                                               onChangeText={(text) => this.setState({remark: text})}/>
                                </View>

                                <View style={{height: 1, width: width, backgroundColor: Color.line}}/>

                                <View style={[styles.textStyle, {width: width, marginTop: 16, marginBottom: 32}]}>
                                    <Text style={{fontSize: 15}}>加油卡</Text>
                                    <Switch
                                        style={{marginRight: 32}}
                                        onValueChange={(value) => {
                                            this.setState({card: value});
                                        }}
                                        onTintColor={Color.colorAccent}
                                        tintColor={Color.colorBlueGrey}
                                        thumbTintColor={"white"}
                                        value={this.state.card}/>
                                </View>

                                <TouchableOpacity onPress={() => this.requestCar()}>
                                    <View style={styles.button}>
                                        <Text
                                            style={{color: 'white'}}>我要车!</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <Loading visible={this.state.isLoading}/>
                <InputDialog
                    isMulti={false}
                    action={[
                        (popupDialog) => {
                            this.popupDialog = popupDialog;
                        },
                        (text) => {
                            this.setState({editContent: text})
                        },
                        () => {
                            this.setState({editContent: ''});
                            this.popupDialog.dismiss();
                        },
                        () => {
                            this.setState({editContent: ''});
                            this.state.locations.push(this.state.editContent);
                            this.setState({});
                            this.popupDialog.dismiss();
                        }
                    ]} str={['填写目的地', '如果在供应商列表没有的目的地，请此填写']}/>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    button: {
        width: width - 32,
        height: 45,
        backgroundColor: Color.colorAccent,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        elevation: 5
    },
    textInput: {
        width: width / 2,
        marginRight: 10,
        textAlign: 'right',
    },

    selection: {
        width: 55,
        height: 5,
        marginTop: 16,
        marginBottom: 16
    },
    textSubStyle: {
        margin: 13,
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'center',
        fontSize: 15
    },
    textStyle: {
        flexDirection: 'row',
        width: width - 32,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 16 + 8,
    },
    itemStyle: {
        margin: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        height: 55,
        borderColor: Color.line,
    },

    datePickerContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Color.line,
        marginTop: 16,
        width: width - 32
    }
});
