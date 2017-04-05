/**
 * Created by Administrator on 2017/4/1.
 */


import * as ActionType from "../constant/ActionType";

const initState = {
    floatVisible: true,
    refreshList: true,
};

export  default  function mainReducer(state = initState, action) {
    switch (action.type) {
        case ActionType.MAIN_FLOAT_VISIBLE:
            return {
                ...state,
                floatVisible: action.floatVisible,
            };
        case ActionType.MAIN_REFRESH:
            return {
                ...state,
                refreshList: action.refreshList,
            };
        default:
            return state;
    }
}