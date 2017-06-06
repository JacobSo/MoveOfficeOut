/**
 * Created by Administrator on 2017/3/16.
 */

import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import Color from '../constant/Color';

export  default  class Application extends Component {
    static session;
    static account = '';
    static workType = '';
    static department;
    static check;
    static dptList = "";
    static pwd = '';
    static jobType = '0';

    static initAccount(callback) {
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                    let key = store[i][0];
                    let value = store[i][1];
                    //console.log("---" + key + "---" + value);

                    if (key === "session") this.session = value;
                    if (key === "account") this.account = value;
                    if (key === "workType") this.workType = value;
                    if (key === "department") this.department = value;
                    if (key === "check") this.check = value === '1';
                    if (key === "pwd") this.pwd = value;
                    if (key === "jobType") this.jobType = value;
                    if (key === "dptList" && value && !value.includes('[object'))
                        this.dptList = JSON.parse(value);
                });
            }).then(callback).done();
        });
    }

    static saveAccount(session, account, department, workType, check, dptList, pwd, jobType) {
        this.session = session;
        this.account = account;
        this.department = department;
        this.workType = workType;
        this.check = check;
        this.dptList = dptList;
        this.pwd = pwd;
        this.jobType = jobType;
        // console.log("---" + session + "---" + account + "---" + department + "---" + workType+'------'+JSON.stringify(dptList)+'-----'+pwd);
        AsyncStorage.multiSet(
            [
                ['session', check ? session : ''],
                ['account', check ? account : ''],
                ['department', check ? department : ''],
                ['workType', check ? workType : ''],
                ['check', check ? '1' : '0'],
                ['dptList', check ? JSON.stringify(dptList) + '' : ''],
                ['pwd', check ? pwd : ''],
                ['jobType', check ? jobType : ''],
            ])
            .then(() => {
                    console.log("save success!");
                },
            ).catch(() => {
            //      console.log("save failed!");
        });
    }
}