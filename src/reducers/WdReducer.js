/**
 * Created by Administrator on 2017/4/1.
 */


import * as ActionType from "../constant/ActionType";

const initState = {
    product: {},
    position:0,
};

export  default  function wdReducer(state = initState, action) {
    switch (action.type) {
        case ActionType.WD_PRODUCT:
            return {
                ...state,
                product:action.product,
                position: action.position,
            };
        default:
            return state;
    }
}