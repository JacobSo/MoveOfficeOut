'user strict';

import React, {Component} from 'react';
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    TouchableOpacity, Image, Text,
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import {CachedImage} from "react-native-img-cache";
const {width, height} = Dimensions.get('window');

export default class WdReviewPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }

    componentDidMount() {
        if (this.props.step === 0) {
       //     console.log(JSON.stringify(this.props.product.pStatusPicA))
            this.setState({
                content: this.props.product.pStatusResultA,
                items: this.props.product.pStatusPicA,
                dataSource: this.state.dataSource.cloneWithRows(this.props.product.pStatusPicA),
            });
        } else if (this.props.step === 1) {
            this.setState({
                content: this.props.product.pStatusResultB,
                items: this.props.product.pStatusPicB,
                dataSource: this.state.dataSource.cloneWithRows(this.props.product.pStatusPicB),
            });
        } else {
            this.setState({
                content: this.props.product.pStatusResultC,
                items: this.props.product.pStatusPicC,
                dataSource: this.state.dataSource.cloneWithRows(this.props.product.pStatusPicC),
            });
        }

      //  console.log(JSON.stringify(this.state.items))
        //   this.countNumber();
    }


    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={2}
                    title={[this.props.title, "评审结果"]}
                    color={Color.colorDeepOrange}
                    isHomeUp={true}
                    isAction={false}
                    isActionByText={true}
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                    ]}
                />
                <Text style={{margin: 16}}>{this.state.content}</Text>
                <ListView
                    ref="scrollView"
                    style={styles.tabView}
                    dataSource={this.state.dataSource}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    contentContainerStyle={styles.listStyle}
                    renderRow={(rowData) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.nav.navigate('gallery',{
                                        pics:this.state.items
                                    })
                                }}>
                                <CachedImage
                                    resizeMode="contain"
                                    style={{width: 100, height: 100, margin: 10}}
                                    source={{uri: rowData?rowData:'-'}}/>
                            </TouchableOpacity>)
                    }
                    }/>
            </View>
        )
    }
}
const styles = StyleSheet.create(
    {
        listStyle: {
            flexDirection: 'row', //改变ListView的主轴方向
            flexWrap: 'wrap', //换行
        },

        tabView: {
            backgroundColor: Color.trans,
            width: width,
        },


    });
