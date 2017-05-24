/**
 * Created by Administrator on 2017/4/1.
 */
import * as ActionType from "../constant/ActionType";
import ApiService from "../network/ApiService";
'user strict';


const mainActions = {
    floatButtonVisible: (visible) => ({
        type: ActionType.MAIN_FLOAT_VISIBLE,
        floatVisible: visible
    }),

    refreshList: (refresh) => ({
        type: ActionType.MAIN_REFRESH,
        refreshList: refresh
    }),

};

export {
    mainActions
}