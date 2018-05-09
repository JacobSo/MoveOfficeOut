/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    ListView,
} from 'react-native';
import Toolbar from '../Component/Toolbar';
import Color from '../../constant/Color';

import App from '../../constant/Application';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import CfListView from "./CfListView";


export default class CfListPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            isRefreshing: false,
        }
    }

    componentDidMount() {
    }


    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>
                <Toolbar
                    elevation={App.workType === '保安' ? 5 : 0}
                    title={["我的用车"]}
                    color={Color.colorBlueGrey}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={[]}
                    functionArray={[
                        () => this.props.nav.goBack(null),
                    ]}/>
                {
                    (() => {
                        if (App.workType === '保安') {
                            return <CfListView nav={this.props.nav} type={'2,3'}/>
                        } else if (App.workType === '人事部') {
                            return <CfListView tabLabel='审核' nav={this.props.nav} type={'0'}/>
                        } else {
                            return <ScrollableTabView
                                initialPage={0}
                                tabBarBackgroundColor={Color.colorBlueGrey}
                                tabBarActiveTextColor='white'
                                locked={false}
                                tabBarInactiveTextColor={Color.background}
                                tabBarUnderlineStyle={{backgroundColor: 'white',}}
                                onChangeTab={({i}) => this.setState({floatButtonVisible: (i === 0)}) }>
                                <CfListView tabLabel='申请' nav={this.props.nav} type={'0,1,2,3'}/>
                                <CfListView tabLabel='审核' nav={this.props.nav} type={'0'}/>
                                <CfListView tabLabel='结束' nav={this.props.nav} type={'4,5,6,7'}/>
                            </ScrollableTabView>
                        }
                    })()
                }

            </View>

        )
    }
}
