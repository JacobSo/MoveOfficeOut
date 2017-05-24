/**
 * Created by Administrator on 2017/4/1.
 */
import * as ActionType from "../constant/ActionType";
'user strict';


const WdActions = {

    updateProduct: (product,position) => ({
        type: ActionType.WD_PRODUCT,
        product: product,
        position:position
    }),

};

export {
    WdActions
}