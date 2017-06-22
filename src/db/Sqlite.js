/**
 * Created by Administrator on 2017/5/18.
 */
import React, {Component} from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';
import DBConst from '../db/DBConst';
import Toast from 'react-native-root-toast';

import {TABLE_PIC, TABLE_Q_S, TABLE_Q_S_DRAFT, TABLE_Q_S_PRODUCT, TABLE_W_D, TABLE_W_D_P, TABLE_W_D_Q} from "./DBConst";
let database_name = "moveoffice.db";
let database_version = "1.0";
let database_displayname = "MySQLite";
let database_size = -1;
let db;
SQLiteStorage.DEBUG(false);

export  default  class Sqlite extends Component {
    render() {
        return null;
    }

    componentWillUnmount() {
        if (db) {
            console.log("SQLiteStorage close success");
            db.close();
        } else {
            console.log("SQLiteStorage not open");
        }
    }

    open() {
        db = SQLiteStorage.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
            () => {
                console.log("SQLiteStorage open success");
            },
            (err) => {
                console.log("SQLiteStorage open error:" + JSON.stringify(err));
            });
    }

    drop(table) {
        if (!db)
            this.open();

        db.executeSql("DROP TABLE " + table + " ;",
            () => {
                console.log("drop success");
            },
            (err) => {
                console.log("drop fail" + JSON.stringify(err));
            });
    }

    close() {
        if (db) {
            console.log("SQLiteStorage close success");
            db.close();
        } else {
            console.log("SQLiteStorage not open");
        }
        db = null;
    }

    clearTable(table) {
        if (!db)
            this.open();

        db.executeSql("DELETE FROM " + table + " ;",
            () => {
                console.log("delete1 success");
            },
            (err) => {
                console.log("delete1 fail" + JSON.stringify(err));
            });
        db.executeSql("DELETE FROM sqlite_sequence;",
            () => {
                console.log("delete2 success");
            },
            (err) => {
                console.log("delete2 fail" + JSON.stringify(err));
            });
    }

    existTableJudge(table) {
        if (!db) {
            this.open();
        }

        db.executeSql("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='" + table + "'"
            , [], () => {
                console.log("---SQLiteStorage--- create pic success");
            }, (err) => {
                console.log("---SQLiteStorage--- create pic fail:");
            });
    }

    createWdTable() {
        if (!db) {
            this.open();
        }

        db.executeSql(DBConst.Pic_Create
            , [], () => {
                console.log("---SQLiteStorage--- create pic success");
            }, (err) => {
                console.log("---SQLiteStorage--- create pic fail:");
            });
        db.executeSql(DBConst.Wood_Develop_Create
            , [], () => {
                console.log("---SQLiteStorage--- create Wood_Develop_Create success");
            }, (err) => {
                console.log("---SQLiteStorage--- create Wood_Develop_Create fail:");
            });
        db.executeSql(DBConst.Wood_Develop_Product_Create
            , [], () => {
                console.log("---SQLiteStorage--- create Wood_Develop_Product_Create success");
            }, (err) => {
                console.log("---SQLiteStorage--- create Wood_Develop_Product_Create fail:");
            });
        db.executeSql(DBConst.Wood_Develop_Quality_Create
            , [], () => {
                console.log("---SQLiteStorage--- create Wood_Develop_Quality_Create success");
            }, (err) => {
                console.log("---SQLiteStorage--- create Wood_Develop_Quality_Create fail:");
            });
    }

    createQcTable() {
        if (!db) {
            this.open();
        }

        db.executeSql(DBConst.Quality_Store_Create
            , [], () => {
                console.log("---SQLiteStorage--- create Quality_Store_Create success");
            }, (err) => {
                console.log("---SQLiteStorage--- create Quality_Store_Create fail:");
            });
        db.executeSql(DBConst.Quality_Store_Product_Create
            , [], () => {
                console.log("---SQLiteStorage--- create Quality_Store_Product_Create success");
            }, (err) => {
                console.log("---SQLiteStorage--- create Quality_Store_Product_Create fail:");
            });
        db.executeSql(DBConst.Quality_Store_Draft_Create
            , [], () => {
                console.log("---SQLiteStorage--- create Quality_Store_Draft_Create success");
            }, (err) => {
                console.log("---SQLiteStorage--- create Quality_Store_Draft_Create fail:");
            });
    }


    insertWdData(wdData) {
        // console.log('----------'+JSON.stringify(wdData))
        if (!db) {
            this.open();
        }
        if (wdData && wdData.length !== 0) {
            let i = 0;
            db.transaction((tx) => {
                this.clearTable(TABLE_W_D);
                this.clearTable(TABLE_W_D_P);
                wdData.map((series) => {
                    // console.log('----------'+JSON.stringify(series))
                    db.executeSql(
                        'INSERT INTO ' + TABLE_W_D + ' (' + DBConst.W_D_KEYS + ') VALUES(?,?,?,?,?,?,?,?,?,?,?)',
                        [
                            series.SeriesGuid,
                            series.SeriesName,
                            series.isFin,
                            series.State,
                            series.FacName,
                            series.sFactoryCall,
                            series.sFactoryAdress,
                            series.Appointtime,
                            series.NextCheckedTime,
                            series.sQualityText,
                            JSON.stringify(series.sMaterialText)
                        ],
                        () => console.log('series save success'),
                        (err) => console.log('series save fail:')
                    );

                    series.Itemlist.map((product) => {
                        // console.log('----------'+JSON.stringify(product))
                        db.executeSql(
                            'INSERT INTO ' + TABLE_W_D_P + ' (' + DBConst.W_D_P_KEYS + ') VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                            [
                                series.SeriesGuid,
                                product.ItemGuid,
                                product.ItemName,
                                product.ProjectNo,
                                product.pSize,
                                product.pImage,
                                product.ItemRemark,
                                (product.pStatusPass),
                                product.pStatus,
                                product.pStatusResultA,
                                product.pStatusResultB,
                                product.pStatusResultC,
                                JSON.stringify(product.pStatusPicA),
                                JSON.stringify(product.pStatusPicB),
                                JSON.stringify(product.pStatusPicC),
                                product.pResultList,
                                product.stage
                            ],
                            () => Toast.show('保存数据中，不要在后台关闭app：' + i++),
                            (err) => console.log('product save fail:')
                        );
                    })
                });
            }, (err) => {
                console.log('insert transaction:');
            }, () => {
                console.log('insert transaction: success');
            })
        } else {
            this.clearTable(TABLE_W_D);
            this.clearTable(TABLE_W_D_P);
        }
    }

    getWdData() {
        return new Promise((resolve, reject) => {
            if (!db) {
                this.open();
            }

            db.executeSql('SELECT * FROM ' + TABLE_W_D + ';', [],
                (results) => {
                    let len = results.rows.length;
                    let datas = [];
                    if (len === 0) {
                        resolve(datas)
                    } else {
                        for (let i = 0; i < len; i++) {
                            results.rows.item(i).sMaterialText = JSON.parse(results.rows.item(i).sMaterialText);
                            datas.push(results.rows.item(i));
                            //     console.log("get product success:" + JSON.stringify(results.rows.item(i)));
                        }
                        //     console.log("get success:" + JSON.stringify(datas));
                        //product select
                        for (let i = 0; i < datas.length; i++) {
                            let product = [];
                            db.executeSql('SELECT * FROM ' + TABLE_W_D_P + ' where wdp_index = \"' + datas[i].SeriesGuid + '\";', [],
                                (results1) => {
                                    let len = results1.rows.length;
                                    for (let i = 0; i < len; i++) {
                                        results1.rows.item(i).pStatusPicA = JSON.parse(results1.rows.item(i).pStatusPicA);
                                        results1.rows.item(i).pStatusPicB = JSON.parse(results1.rows.item(i).pStatusPicB);
                                        results1.rows.item(i).pStatusPicC = JSON.parse(results1.rows.item(i).pStatusPicC);
                                        //     console.log("get product success:" + JSON.stringify(results1.rows.item(i)));
                                        product.push(results1.rows.item(i));
                                    }
                                    datas[i].Itemlist = product;
                                    if (i === datas.length - 1) {
                                        //     console.log("get product success:"+JSON.stringify(datas));
                                        resolve(datas)
                                    }

                                }, (err) => {
                                    reject(err);
                                    console.log("get product error:");
                                });
                            //  console.log("get series success:" + JSON.stringify(product));
                        }
                    }

                }, (err) => {
                    reject(err);
                    console.log("get series error:");
                });
        })
    }

    insertWdDraft(draftData, picData) {
        return new Promise((resolve, reject) => {
            if (!db) {
                this.open();
            }
            db.executeSql('SELECT * FROM ' + TABLE_W_D_Q + " where wdq_index = '" + draftData.pGuid + "' AND wdq_ReviewType='" + draftData.phaseCode + "';", [],
                (results) => {
                    if (results.rows.length !== 0) {//have data
                        db.executeSql("UPDATE " + TABLE_W_D_Q +
                            " SET wdq_content = '" + draftData.productProblems +
                            "' WHERE wdq_index = '" + draftData.pGuid +
                            "' AND wdq_ReviewType ='" + draftData.phaseCode + "';", [],
                            (results) => {
                                if (picData.length === 0) resolve("保存成功")
                                //   console.log("draft content update!")
                            }, (err) => console.log("insertWdDraft content update err:" + JSON.stringify(err)))
                    } else {//create
                        db.executeSql('INSERT INTO ' + TABLE_W_D_Q + ' (' + DBConst.W_D_Q_KEYS + ') VALUES(?,?,?,?)',
                            [
                                draftData.pGuid,
                                draftData.phaseCode,
                                draftData.pResult,
                                draftData.productProblems,
                            ],
                            (results) => {
                                // console.log("draft content save!")
                                if (picData.length === 0) resolve("保存成功")
                            }, (err) => console.log("insertWdDraft content create err:" + JSON.stringify(err)))
                    }
                }, (err) => console.log("insertWdDraft count err:" + JSON.stringify(err)));

            db.executeSql("DELETE FROM " + TABLE_PIC + " WHERE pic_index = '" + draftData.pGuid + "' AND pic_type='" + draftData.phaseCode + "';", [],
                (results) => {
                    console.log("draft pic clear!")
                }, (err) => console.log("insertWdDraft pic delete err:" + JSON.stringify(err)));
            picData.map((data, index) => {
                db.executeSql('INSERT INTO ' + TABLE_PIC + ' (' + DBConst.PIC_KEYS + ') VALUES(?,?,?,?)',
                    [
                        data.phaseCode,
                        data.paraGuid,
                        data.uri,
                        data.fileName,
                    ],
                    (results) => {
                        console.log("draft pic save!")
                        if (index === picData.length - 1) {
                            resolve("保存成功")
                        }
                    }, (err) => console.log("insertWdDraft pic insert err:" + JSON.stringify(err)))
            })
        })
    }

    getWdDraftContent(index, step) {
        return new Promise((resolve, reject) => {
            if (!db) {
                this.open();
            }//
            db.executeSql('SELECT * FROM ' + TABLE_W_D_Q + " where wdq_index = '" + index + "' AND wdq_ReviewType=" + step + ";",
                [],
                (results) => {
                    let temp = null;
                    if (results.rows.item(0)) {
                        temp = results.rows.item(0);
                    }
                    resolve(temp);
                    console.log("getWdDraftContent:" + JSON.stringify(results.rows.item(0)))
                }, (err) => console.log("getWdDraftContent  err:" + JSON.stringify(err)));
        })
    }


    getWdDraftPic(index, step) {
        return new Promise((resolve, reject) => {
            if (!db) {
                this.open();
            }//
            let temp = [];
            db.executeSql('SELECT * FROM ' + TABLE_PIC + " where pic_index = '" + index + "' AND pic_type=" + step + ";",
                [],
                (results) => {
                    if (results.rows.length === 0) {
                        resolve(temp)
                    } else {//
                        for (let i = 0; i < results.rows.length; i++) {
                            temp.push({
                                fileName: results.rows.item(i).pic_name,
                                phaseCode: results.rows.item(i).pic_type,
                                paraGuid: results.rows.item(i).pic_index,
                                uri: results.rows.item(i).pic_path
                            });
                        }
                        resolve(temp);

                    }
                    console.log("getWdDraftContent:" + JSON.stringify(temp))
                }, (err) => console.log("getWdDraftContent  err:" + JSON.stringify(err)));
        })
    }

    updateWdStatus(data, pics, result) {
        return new Promise((resolve, reject) => {
            let paramContent, paramPics;
            if (data.phaseCode === 0) {
                paramContent = "pStatusResultA";
                paramPics = "pStatusPicA";
            } else if (data.phaseCode === 1) {
                paramContent = "pStatusResultB";
                paramPics = "pStatusPicB";
            } else {
                paramContent = "pStatusResultC";
                paramPics = "pStatusPicC";
            }

            if (!db) {
                this.open();
            }//
            let temp = [];
            db.executeSql("UPDATE " + TABLE_W_D_P +
                " SET " +
                " pStatus = '" + data.phaseCode + "', " +
                " pStatusPass = '" + data.pResult + "', " +
                paramContent + " = '" + data.productProblems + "', " +
                paramPics + " = '" + JSON.stringify(pics) + "', " +
                "pResultList = '" + result +
                "' WHERE ItemGuid = '" + data.pGuid + "';", [],
                (results) => {
                    resolve();
                }, (err) => {
                    console.log("updateProductStatus content update err:" + JSON.stringify(err))
                })
        })
    }

    /**
     *  QC part
     **/

    insertQcData(qcData) {
        // console.log('----------'+JSON.stringify(wdData))
        if (!db) {
            this.open();
        }
        if (qcData && qcData.length !== 0) {
            let i = 0;
            db.transaction((tx) => {
                this.clearTable(TABLE_Q_S_PRODUCT);
                this.clearTable(TABLE_Q_S);
                qcData.map((series) => {
                    // console.log('----------'+JSON.stringify(series))
                    db.executeSql(
                        'INSERT INTO ' + TABLE_Q_S + ' (' + DBConst.Q_S_KEYS + ') VALUES(?,?,?,?)',
                        [
                            series.purchaseNo,
                            series.supplier,
                            series.status,
                            series.lockTime,
                        ],
                        () => console.log('series save success'),
                        (err) => console.log('series save fail:')
                    );

                    series.data.map((product) => {
                        // console.log('----------'+JSON.stringify(product))
                        db.executeSql(
                            'INSERT INTO ' + TABLE_Q_S_PRODUCT + ' (' + DBConst.Q_S_PRODUCT_KEYS + ') VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                            [
                                series.purchaseNo,//
                                product.itemName,
                                product.fentityID,
                                product.type,
                                product.qty,
                                product.skuCode,
                                product.skuName,
                                product.state,
                                product.remark,
                                product.batch,
                                product.feedback,
                                product.IsHot,
                                product.deliverDate,
                                JSON.stringify(product.productImages),
                                JSON.stringify(product.improveFiles),
                                JSON.stringify(product.techFiles),
                                JSON.stringify(product.materialFiles),
                                JSON.stringify(product.proFiles)
                            ],
                            () => Toast.show('保存数据中，不要在后台关闭app：' + i++),
                            (err) => console.log('product save fail:' + JSON.stringify(err))
                        );
                    })
                });
            }, (err) => {
                console.log('insert transaction:' + JSON.stringify(err));
            }, () => {
                console.log('insert transaction: success');
            })
        } else {
            this.clearTable(TABLE_Q_S);
            this.clearTable(TABLE_Q_S_PRODUCT);
        }
    }

    getQcData() {
        return new Promise((resolve, reject) => {
            if (!db) {
                this.open();
            }

            db.executeSql('SELECT * FROM ' + TABLE_Q_S + ';', [],
                (results) => {
                    console.log(JSON.stringify(results));
                    let len = results.rows.length;
                    let datas = [];
                    if (len === 0) {
                        resolve(datas)
                    } else {
                        for (let i = 0; i < len; i++) {
                            console.log((JSON.stringify(results.rows.item(i))))
                            datas.push(results.rows.item(i));
                        }
                        //product select
                        for (let i = 0; i < datas.length; i++) {
                            let product = [];
                            db.executeSql('SELECT * FROM ' + TABLE_Q_S_PRODUCT + ' where productindex = \"' + datas[i].purchaseNo + '\";', [],
                                (results1) => {
                                    let len = results1.rows.length;
                                    for (let i = 0; i < len; i++) {
                                        results1.rows.item(i).productImages = JSON.parse(results1.rows.item(i).productImages);
                                        results1.rows.item(i).improveFiles = JSON.parse(results1.rows.item(i).improveFiles);
                                        results1.rows.item(i).techFiles = JSON.parse(results1.rows.item(i).techFiles);
                                        results1.rows.item(i).materialFiles = JSON.parse(results1.rows.item(i).materialFiles);
                                        results1.rows.item(i).proFiles = JSON.parse(results1.rows.item(i).proFiles);
                                        console.log("get product success:" + JSON.stringify(results1.rows.item(i)));
                                        product.push(results1.rows.item(i));
                                    }
                                    datas[i].data = product;
                                    if (i === datas.length - 1) {
                                        console.log("get product success:" + JSON.stringify(datas));
                                        resolve(datas)
                                    }

                                }, (err) => {
                                    reject(err);
                                    console.log("get product error:" + JSON.stringify(err));
                                });
                            console.log("get series success:" + JSON.stringify(product));
                        }
                    }

                }, (err) => {
                    reject(err);
                    console.log("get series error:");
                });
        })
    }

    insertQcDraftAll(draftList, productId, mainContent) {
        return new Promise((resolve, reject) => {
            if (!db) {
                this.open();
            }

            draftList.map((draftData) => {
                db.executeSql('SELECT * FROM ' + TABLE_Q_S_DRAFT + " where draft_index = '" + productId + draftData.Guid + "';", [],
                    (results) => {
                        if (results.rows.length !== 0) {//have data
                            db.executeSql("UPDATE " + TABLE_Q_S_DRAFT +
                                " SET " +
                                "draft_index = '" + productId + draftData.Guid +
                                "',subContent = '" +(draftData.submitContent? draftData.submitContent.subContent:'')+
                                "',totalContent = '" + mainContent +
                                "',isPass = '" + draftData.isPass +
                                "',editDate = '" +(draftData.submitContent? draftData.submitContent.editDate:new Date().toLocaleString() )+
                                "',editAddress = '" + (draftData.submitContent?draftData.submitContent.editAddress:'') +
                                "',lat = '" + (draftData.submitContent?draftData.submitContent.lat:'') +
                                "',lng = '" + (draftData.submitContent?draftData.submitContent.lng:'') +
                                "' WHERE draft_index = '" +  productId +draftData.Guid + "';", [],
                                (results) => {
                                    resolve("保存成功")
                                }, (err) => console.log("insertWdDraft content update err:" + JSON.stringify(err)))
                        } else {//create
                            db.executeSql('INSERT INTO ' + TABLE_Q_S_DRAFT + ' (' + DBConst.QS_DRAFT_KEYS + ') VALUES(?,?,?,?,?,?,?,?)',
                                [
                                    productId + draftData.Guid,
                                    (draftData.submitContent? draftData.submitContent.subContent:''),
                                    mainContent,
                                    draftData.isPass,
                                    (draftData.submitContent? draftData.submitContent.editDate:new Date().toLocaleString() ),
                                    (draftData.submitContent?draftData.submitContent.editAddress:'') ,
                                    (draftData.submitContent?draftData.submitContent.lat:''),
                                    (draftData.submitContent?draftData.submitContent.lng:''),
                                ],
                                (results) => {
                                    resolve("保存成功")
                                }, (err) => console.log("insertWdDraft content create err:" + JSON.stringify(err)))
                        }
                    }, (err) => console.log("insertWdDraft count err:" + JSON.stringify(err)));

            });
        })
    }

    insertQcDraftSingle(draftData, picData) {
        return new Promise((resolve, reject) => {
            if (!db) {
                this.open();
            }
            db.executeSql('SELECT * FROM ' + TABLE_Q_S_DRAFT + " where draft_index = '" + draftData.index + "';", [],
                (results) => {
                    if (results.rows.length !== 0) {//have data
                        db.executeSql("UPDATE " + TABLE_Q_S_DRAFT +
                            " SET " +
                            "draft_index = '" + draftData.index +
                            "',subContent = '" + draftData.subContent +
                            "',totalContent = '" + results.rows.item(0).totalContent +
                            "',isPass = '" + draftData.isPass +
                            "',editDate = '" + draftData.editDate +
                            "',editAddress = '" + draftData.editAddress +
                            "',lat = '" + draftData.lat +
                            "',lng = '" + draftData.lng +
                            "' WHERE draft_index = '" + draftData.index + "';", [],
                            (results) => {
                                if (picData.length === 0) resolve("保存成功")
                                //   console.log("draft content update!")
                            }, (err) => console.log("insertQcDraftSingle content update err:" + JSON.stringify(err)))
                    } else {//create
                        db.executeSql('INSERT INTO ' + TABLE_Q_S_DRAFT + ' (' + DBConst.QS_DRAFT_KEYS + ') VALUES(?,?,?,?,?,?,?,?)',
                            [
                                draftData.index,
                                draftData.subContent,
                                "",
                                draftData.isPass,
                                draftData.editDate,
                                draftData.editAddress,
                                draftData.lat,
                                draftData.lng,
                            ],
                            (results) => {
                                 console.log("draft content save!")
                                if (picData.length === 0) resolve("保存成功")
                            }, (err) => console.log("insertQcDraftSingle content create err:" + JSON.stringify(err)))
                    }
                }, (err) => console.log("insertQcDraftSingle count err:" + JSON.stringify(err)));

            db.executeSql("DELETE FROM " + TABLE_PIC + " WHERE pic_index = '" + draftData.index + "';", [],
                (results) => {
                    console.log("draft pic clear!")
                }, (err) => console.log("insertQcDraftSingle pic delete err:" + JSON.stringify(err)));
            picData.map((data, index) => {
                db.executeSql('INSERT INTO ' + TABLE_PIC + ' (' + DBConst.PIC_KEYS + ') VALUES(?,?,?,?)',
                    [
                        '-',
                        data.index,
                        data.uri,
                        data.fileName,
                    ],
                    (results) => {
                        console.log("draft pic save!")
                        if (index === picData.length - 1) {
                            resolve("保存成功")
                        }
                    }, (err) => console.log("insertQcDraftSingle pic insert err:" + JSON.stringify(err)))
            })
        })
    }

    fetchQcDraft(formItems, pid) {
        return new Promise((resolve, reject) => {
            if (!db) {
                this.open();
            }//

            formItems.map((form, i) => {
                db.executeSql('SELECT * FROM ' + TABLE_Q_S_DRAFT + " where draft_index = '" + pid + form.Guid + "';",
                    [],
                    (results) => {
                        if (results.rows.item(0)) {
                            form.submitContent = results.rows.item(0);
                            form.isPass= form.submitContent.isPass;
                            db.executeSql('SELECT * FROM ' + TABLE_PIC + " where pic_index = '" + pid + form.Guid + "';",
                                [],
                                (results) => {
                                    if (results.rows.length !== 0) {
                                        let temp = [];
                                        for (let i = 0; i < results.rows.length; i++) {
                                            temp.push({
                                                fileName: results.rows.item(i).pic_name,
                                                phaseCode: results.rows.item(i).pic_type,
                                                paraGuid: results.rows.item(i).pic_index,
                                                uri: results.rows.item(i).pic_path
                                            });
                                        }
                                        form.submitPic = temp;

                                    }


                                }, (err) => console.log("fetchQcDraft_pic  err:" + JSON.stringify(err)));

                        }
                        if (i === formItems.length - 1) {
                            console.log(JSON.stringify(formItems) + '--------------------')
                            resolve(formItems)
                        }
                    }, (err) => console.log("fetchQcDraft  err:" + JSON.stringify(err)));
            });

        })
    }

}

