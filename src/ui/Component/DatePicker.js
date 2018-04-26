import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    Modal,
    TouchableOpacity,
    DatePickerAndroid,
    TimePickerAndroid,
    DatePickerIOS,
    Platform,
    Animated,
    StyleSheet,Dimensions
} from 'react-native';
import Moment from 'moment';
const {width, height} = Dimensions.get('window');

const FORMATS = {
    'date': 'YYYY-MM-DD',
    'datetime': 'YYYY-MM-DD HH:mm',
    'time': 'HH:mm'
};

const SUPPORTED_ORIENTATIONS = ["portrait", "portrait-upside-down", "landscape", "landscape-left", "landscape-right"];

export default class DatePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: this.getDate(),
            modalVisible: false,
            animatedHeight: new Animated.Value(0)
        };

        this.datePicked = this.datePicked.bind(this);
        this.onPressDate = this.onPressDate.bind(this);
        this.onPressCancel = this.onPressCancel.bind(this);
        this.onPressConfirm = this.onPressConfirm.bind(this);
        this.onDatePicked = this.onDatePicked.bind(this);
        this.onTimePicked = this.onTimePicked.bind(this);
        this.onDatetimePicked = this.onDatetimePicked.bind(this);
        this.onDatetimeTimePicked = this.onDatetimeTimePicked.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
    }

    componentWillMount() {
        // ignore the warning of Failed propType for date of DatePickerIOS, will remove after being fixed by official
        console.ignoredYellowBox = [
            'Warning: Failed propType'
            // Other warnings you don't want like 'jsSchedulingOverhead',
        ];
    }

    setModalVisible(visible) {
        const {height, duration} = this.props;

        // slide animation
        if (visible) {
            this.setState({modalVisible: visible});
            Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: height,
                    duration: duration
                }
            ).start();
        } else {
            Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: 0,
                    duration: duration
                }
            ).start(() => {
                this.setState({modalVisible: visible});
            });
        }
    }

    onStartShouldSetResponder(e) {
        return true;
    }

    onMoveShouldSetResponder(e) {
        return true;
    }

    onPressCancel() {
        this.setModalVisible(false);

        if (typeof this.props.onCloseModal === 'function') {
            this.props.onCloseModal();
        }
    }

    onPressConfirm() {
        this.datePicked();
        this.setModalVisible(false);

        if (typeof this.props.onCloseModal === 'function') {
            this.props.onCloseModal();
        }
    }

    getDate(date = this.props.date) {
        const {mode, minDate, maxDate, format = FORMATS[mode]} = this.props;

        // date默认值
        if (!date) {
            let now = new Date();
            if (minDate) {
                let _minDate = this.getDate(minDate);

                if (now < _minDate) {
                    return _minDate;
                }
            }

            if (maxDate) {
                let _maxDate = this.getDate(maxDate);

                if (now > _maxDate) {
                    return _maxDate;
                }
            }

            return now;
        }

        if (date instanceof Date) {
            return date;
        }

        return Moment(date, format).toDate();
    }

    getDateStr(date = this.props.date) {
        const {mode, format = FORMATS[mode]} = this.props;

        if (date instanceof Date) {
            return Moment(date).format(format);
        } else {
            return Moment(this.getDate(date)).format(format);
        }
    }

    datePicked() {
        if (typeof this.props.onDateChange === 'function') {
            this.props.onDateChange(this.getDateStr(this.state.date), this.state.date);
        }
    }

    getTitleElement() {
        const {date, placeholder, customStyles} = this.props;

        if (!date && placeholder) {
            return (<Text style={[Style.placeholderText, customStyles.placeholderText]}>{placeholder}</Text>);
        }
        return (<Text style={[Style.dateText, customStyles.dateText]}>{this.getDateStr()}</Text>);
    }

    onDatePicked({action, year, month, day}) {
        if (action !== DatePickerAndroid.dismissedAction) {
            this.setState({
                date: new Date(year, month, day)
            });
            this.datePicked();
        }
    }

    onTimePicked({action, hour, minute}) {
        if (action !== DatePickerAndroid.dismissedAction) {
            this.setState({
                date: Moment().hour(hour).minute(minute).toDate()
            });
            this.datePicked();
        }
    }

    onDatetimePicked({action, year, month, day}) {
        const {mode, format = FORMATS[mode], is24Hour = !format.match(/h|a/)} = this.props;

        if (action !== DatePickerAndroid.dismissedAction) {
            let timeMoment = Moment(this.state.date);

            TimePickerAndroid.open({
                hour: timeMoment.hour(),
                minute: timeMoment.minutes(),
                is24Hour: is24Hour
            }).then(this.onDatetimeTimePicked.bind(this, year, month, day));
        }
    }

    onDatetimeTimePicked(year, month, day, {action, hour, minute}) {
        if (action !== DatePickerAndroid.dismissedAction) {
            this.setState({
                date: new Date(year, month, day, hour, minute)
            });
            this.datePicked();
        }
    }

    onPressDate() {
        if (this.props.disabled) {
            return true;
        }

        // reset state
        this.setState({
            date: this.getDate()
        });

        if (Platform.OS === 'ios') {
            this.setModalVisible(true);
        } else {

            const {mode, format = FORMATS[mode], minDate, maxDate, is24Hour = !format.match(/h|a/)} = this.props;

            // 选日期
            if (mode === 'date') {
                DatePickerAndroid.open({
                    date: this.state.date,
                    minDate: minDate && this.getDate(minDate),
                    maxDate: maxDate && this.getDate(maxDate)
                }).then(this.onDatePicked);
            } else if (mode === 'time') {
                // 选时间

                let timeMoment = Moment(this.state.date);

                TimePickerAndroid.open({
                    hour: timeMoment.hour(),
                    minute: timeMoment.minutes(),
                    is24Hour: is24Hour
                }).then(this.onTimePicked);
            } else if (mode === 'datetime') {
                // 选日期和时间

                DatePickerAndroid.open({
                    date: this.state.date,
                    minDate: minDate && this.getDate(minDate),
                    maxDate: maxDate && this.getDate(maxDate)
                }).then(this.onDatetimePicked);
            }
        }

        if (typeof this.props.onOpenModal === 'function') {
            this.props.onOpenModal();
        }
    }

    render() {
        const {
            mode,
            style,
            customStyles,
            disabled,
            showIcon,
            iconSource,
            minDate,
            maxDate,
            minuteInterval,
            timeZoneOffsetInMinutes,
            cancelBtnText,
            confirmBtnText
        } = this.props;

        const dateInputStyle = [
            Style.dateInput, customStyles.dateInput,
            disabled && Style.disabled,
            disabled && customStyles.disabled
        ];

        return (
            <TouchableOpacity
                style={[{width: this.props.myWidth?this.props.myWidth:(width-32),}, style]}
                underlayColor={'transparent'}
                onPress={this.onPressDate}
            >
                <View style={[Style.dateTouchBody, customStyles.dateTouchBody]}>
                    <View style={dateInputStyle}>
                        {this.getTitleElement()}
                    </View>
                    {showIcon && <Image
                        style={[Style.dateIcon, customStyles.dateIcon]}
                        source={iconSource}
                    />}
                    {Platform.OS === 'ios' && <Modal
                        transparent={true}
                        animationType="none"
                        visible={this.state.modalVisible}
                        supportedOrientations={SUPPORTED_ORIENTATIONS}
                        onRequestClose={() => {
                            this.setModalVisible(false);
                        }}
                    >
                        <View
                            style={{flex: 1}}
                        >
                            <TouchableOpacity
                                style={Style.datePickerMask}
                                activeOpacity={1}
                                underlayColor={'#00000077'}
                                onPress={this.onPressCancel}
                            >
                                <TouchableOpacity
                                    underlayColor={'#fff'}
                                    style={{flex: 1}}
                                >
                                    <Animated.View
                                        style={[Style.datePickerCon, {height: this.state.animatedHeight}, customStyles.datePickerCon]}
                                    >
                                        <DatePickerIOS
                                            date={this.state.date}
                                            mode={mode}
                                            minimumDate={minDate && this.getDate(minDate)}
                                            maximumDate={maxDate && this.getDate(maxDate)}
                                            onDateChange={(date) => this.setState({date: date})}
                                            minuteInterval={minuteInterval}
                                            timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
                                            style={[Style.datePicker, customStyles.datePicker]}
                                        />
                                        <TouchableOpacity
                                            underlayColor={'transparent'}
                                            onPress={this.onPressCancel}
                                            style={[Style.btnText, Style.btnCancel, customStyles.btnCancel]}
                                        >
                                            <Text
                                                style={[Style.btnTextText, Style.btnTextCancel, customStyles.btnTextCancel]}
                                            >
                                                {cancelBtnText}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            underlayColor={'transparent'}
                                            onPress={this.onPressConfirm}
                                            style={[Style.btnText, Style.btnConfirm, customStyles.btnConfirm]}
                                        >
                                            <Text
                                                style={[Style.btnTextText, customStyles.btnTextConfirm]}>{confirmBtnText}</Text>
                                        </TouchableOpacity>
                                    </Animated.View>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    </Modal>}
                </View>
            </TouchableOpacity>
        );
    }
}

DatePicker.defaultProps = {
    mode: 'date',
    date: '',
    // component height: 216(DatePickerIOS) + 1(borderTop) + 42(marginTop), IOS only
    height: 259,

    // slide animation duration time, default to 300ms, IOS only
    duration: 300,
    confirmBtnText: '确定',
    cancelBtnText: '取消',

    customStyles: {},

    // whether or not show the icon
    showIcon: true,
    disabled: false,
    placeholder: '',
    modalOnResponderTerminationRequest: e => true
};

DatePicker.propTypes = {
    mode: PropTypes.oneOf(['date', 'datetime', 'time']),
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    format: PropTypes.string,
    minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    height: PropTypes.number,
    duration: PropTypes.number,
    confirmBtnText: PropTypes.string,
    cancelBtnText: PropTypes.string,
    iconSource: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    customStyles: PropTypes.object,
    showIcon: PropTypes.bool,
    disabled: PropTypes.bool,
    onDateChange: PropTypes.func,
    onOpenModal: PropTypes.func,
    onCloseModal: PropTypes.func,
    placeholder: PropTypes.string,
    modalOnResponderTerminationRequest: PropTypes.func,
    is24Hour: PropTypes.bool
};
const Style = StyleSheet.create({

    dateTouchBody: {
        flexDirection: 'row',
        height: 40,
    },
    dateIcon: {
        width: 32,
        height: 32,
        marginLeft: 5,
        marginRight: 5
    },
    dateInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: 'transparent',
        justifyContent: 'center',
    },
    dateText: {
        paddingRight:16,

        color: 'white',

    },
    placeholderText: {

        paddingRight:16,
        color: 'white',

    },
    datePickerMask: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: '#00000077'
    },
    datePickerCon: {
        backgroundColor: '#fff',
        height: 0,
        overflow: 'hidden'
    },
    btnText: {
        position: 'absolute',
        top: 0,
        height: 42,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTextText: {
        fontSize: 16,
        color: '#46cf98'
    },
    btnTextCancel: {
        color: '#666'
    },
    btnCancel: {
        left: 0
    },
    btnConfirm: {
        right: 0
    },
    datePicker: {
        marginTop: 42,
        borderTopColor: '#ccc',
        borderTopWidth: 1
    },
    disabled: {
        backgroundColor: '#eee'
    }
});
