/**
 * Created by Administrator on 2017/4/1.
 */

import {combineReducers} from "redux";
import mainReducer from '../reducers/MainReducer'
import wdReducer from '../reducers/WdReducer'

export default combineReducers({
    mainStore:mainReducer,
    wdStore:wdReducer,
})