/**
 * Created by Administrator on 2017/5/18.
 */
import React, {Component} from 'react';

export let TABLE_PIC = "pic";
let PIC_ID = "pic_id";
let PIC_TYPE = "pic_type";//wood / product
let PIC_INDEX = "pic_index";//task id
let PIC_PATH = "pic_path";
let PIC_NAME = "pic_name";

/**
 * 板木 系列列表
 */
export let TABLE_W_D = "wood_develop";
let W_D_ID = "wd_id";
let W_D_SERIES_GUID = "SeriesGuid";
let W_D_SERIES_NAME = "SeriesName";
let W_D_PASS = "isFin";
let W_D_STATE = "State";
let W_D_FACTORY = "FacName";
let W_D_FACTORY_CALL = "sFactoryCall";
let W_D_FACTORY_ADRESS = "sFactoryAdress";
let W_D_APPOINT_TIME = "Appointtime";
let W_D_CURRENT_BOOKING = "NextCheckedTime";
let W_D_QUALITY_TEXT = "sQualityText";
let W_D_MATERIAL_LIST = "sMaterialText";
/**
 * 板木 产品列表
 */
export let TABLE_W_D_P = "wood_develop_product";
let W_D_P_ID = "wdp_id";
let W_D_P_INDEX = "wdp_index";//series id
let W_D_P_ITEM_GUID = "ItemGuid";
let W_D_P_ITEM_NAME = "ItemName";
let W_D_P_PROJECT_NO = "ProjectNo";
let W_D_P_SIZE = "pSize";
let W_D_P_IMAGE = "pImage";
let W_D_P_ITEM_REMARK = "ItemRemark";
let W_D_P_STATUS_PASS = "pStatusPass";
let W_D_P_STATUS = "pStatus";
let W_D_P_STATUS_RESULT_A = "pStatusResultA";
let W_D_P_STATUS_RESULT_B = "pStatusResultB";
let W_D_P_STATUS_RESULT_C = "pStatusResultC";
let W_D_P_STATUS_PIC_A = "pStatusPicA";
let W_D_P_STATUS_PIC_B = "pStatusPicB";
let W_D_P_STATUS_PIC_C = "pStatusPicC";
let W_D_P_RESULT_LIST = "pResultList";
let W_D_P_STAGE = "stage";
/**
 * 板木 评审草稿
 */
export let TABLE_W_D_Q = "wood_develop_quality";
let W_D_Q_ID = "wdq_id";
let W_D_Q_INDEX = "wdq_index";//product id
let W_D_Q_REVIEW_TYPE = "wdq_ReviewType";//step
let W_D_Q_PASS = "wdq_isPass";
let W_D_Q_CONTENT = "wdq_content";
export  default  class Sqlite extends Component {
    render() {
        return null;
    }

    static PIC_KEYS = PIC_TYPE + ',' + PIC_INDEX + ',' + PIC_PATH + ',' + PIC_NAME;
    static Pic_Create = "CREATE  TABLE  if not exists pic (" +
        "pic_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL , " +
        "pic_type INTEGER," +
        "pic_index VARCHAR," +
        "pic_path VARCHAR," +
        "pic_name VARCHAR" +
        ")";

    static W_D_KEYS = W_D_SERIES_GUID + ',' + W_D_SERIES_NAME + ',' + W_D_PASS + ',' + W_D_STATE + ',' + W_D_FACTORY + ',' + W_D_FACTORY_CALL + ',' +
        W_D_FACTORY_ADRESS + ',' + W_D_APPOINT_TIME + ',' + W_D_CURRENT_BOOKING + ',' + W_D_QUALITY_TEXT + ',' + W_D_MATERIAL_LIST;
    static Wood_Develop_Create = "CREATE  TABLE  if not exists " + TABLE_W_D + " (" +
        W_D_ID + " INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL , " +
        W_D_SERIES_GUID + " VARCHAR," +
        W_D_SERIES_NAME + " VARCHAR," +
        W_D_PASS + " BOOLEAN," +
        W_D_STATE + " INTEGER," +
        W_D_FACTORY + " VARCHAR," +
        W_D_FACTORY_CALL + " VARCHAR," +
        W_D_FACTORY_ADRESS + " VARCHAR," +
        W_D_APPOINT_TIME + " VARCHAR," +
        W_D_CURRENT_BOOKING + " VARCHAR," +
        W_D_QUALITY_TEXT + " VARCHAR," +
        W_D_MATERIAL_LIST + " VARCHAR" +
        ")";

    static W_D_P_KEYS =
        W_D_P_INDEX + ',' +
        W_D_P_ITEM_GUID + ',' +
        W_D_P_ITEM_NAME + ',' +
        W_D_P_PROJECT_NO + ',' +
        W_D_P_SIZE + ',' +
        W_D_P_IMAGE + ',' +
        W_D_P_ITEM_REMARK + ',' +
        W_D_P_STATUS_PASS + ',' +
        W_D_P_STATUS + ',' +
        W_D_P_STATUS_RESULT_A + ',' +
        W_D_P_STATUS_RESULT_B + ',' +
        W_D_P_STATUS_RESULT_C + ',' +
        W_D_P_STATUS_PIC_A + ',' +
        W_D_P_STATUS_PIC_B + ',' +
        W_D_P_STATUS_PIC_C + ',' +
        W_D_P_RESULT_LIST + ',' +
        W_D_P_STAGE
    ;
    static Wood_Develop_Product_Create = "CREATE  TABLE  if not exists " + TABLE_W_D_P + " (" +
        W_D_P_ID + " INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL , " +
        W_D_P_INDEX + " VARCHAR," +
        W_D_P_ITEM_GUID + " VARCHAR," +
        W_D_P_ITEM_NAME + " VARCHAR," +
        W_D_P_PROJECT_NO + " VARCHAR," +
        W_D_P_SIZE + " VARCHAR," +
        W_D_P_IMAGE + " VARCHAR," +
        W_D_P_ITEM_REMARK + " VARCHAR," +
        W_D_P_STATUS_PASS + " BOOLEAN," +
        W_D_P_STATUS + " INTEGER," +
        W_D_P_STATUS_RESULT_A + " VARCHAR," +
        W_D_P_STATUS_RESULT_B + " VARCHAR," +
        W_D_P_STATUS_RESULT_C + " VARCHAR," +
        W_D_P_STATUS_PIC_A + " TEXT," +
        W_D_P_STATUS_PIC_B + " TEXT," +
        W_D_P_STATUS_PIC_C + " TEXT," +
        W_D_P_RESULT_LIST + " VARCHAR," +
        W_D_P_STAGE + " INTEGER" +
        ")";

    static W_D_Q_KEYS = W_D_Q_INDEX + ',' +W_D_Q_REVIEW_TYPE + ',' + W_D_Q_PASS + ',' + W_D_Q_CONTENT;
    static Wood_Develop_Quality_Create = "CREATE  TABLE  if not exists " + TABLE_W_D_Q + " (" +
        W_D_Q_ID + " INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL , " +
        W_D_Q_INDEX + " VARCHAR," +
        W_D_Q_REVIEW_TYPE + " INTEGER," +
        W_D_Q_PASS + " BOOLEAN," +
        W_D_Q_CONTENT + " VARCHAR" +
        ")";


}