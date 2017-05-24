/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    ListView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Toolbar from './../Component/Toolbar';
import Color from '../../constant/Color';
import {WdFilterItem} from "../Component/WdFilterItem";
const {width, height} = Dimensions.get('window');

export default class WdProductFilterPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.task.Itemlist,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            isSearch: false,
            isHeader: true,
        }
    }

    componentDidMount() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.items),
        });
     //   this.countNumber();
    }



    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar
                    elevation={0}
                    title={[this.props.stepName,this.props.task.SeriesName, ]}
                    color={Color.colorDeepOrange}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                    ]}
                />

                <ListView
                    ref="scrollView"
                    style={styles.tabView}
                    dataSource={this.state.dataSource}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                    contentContainerStyle={styles.listStyle}
                    renderRow={(rowData, rowID, sectionID) =>
                        <WdFilterItem
                            key={sectionID}
                            step={this.props.step}
                            product={rowData}
                            func={() => {
                                this.props.nav.navigate(
                                    'wdDetail',
                                    {product: rowData,},
                                );
                            }}
                        />
                    }/>
            </View>
        )
    }
}
const styles = StyleSheet.create(
    {
        listStyle:{
            flexDirection:'row', //改变ListView的主轴方向
            flexWrap:'wrap', //换行
        },

        tabView: {
            backgroundColor: Color.trans,
            width: width,
        },


    });
