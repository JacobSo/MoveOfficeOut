/**
 * Created by Administrator on 2017/3/16.
 */

import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
export  default  class Application extends Component {
    static session;
    static account;
    static workType;
    static department;

    static initAccount(callback) {
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                    let key = store[i][0];
                    let value = store[i][1];
                    console.log("---"+key+"---"+value)

                    if(key==="session")this.session=value;
                    if(key==="account")this.account=value;
                    if(key==="workType")this.workType=value;
                    if(key==="department")this.department=value;
                });
            }).then(callback).done();
        });
    }

    static saveAccount(session, account, department, workType,check) {
        this.session = session;
        this.account = account;
        this.department = department;
        this.workType = workType;
        console.log("---"+session+"---"+account+"---"+department+"---"+workType)
        if(check){
            AsyncStorage.multiSet([['session', session], ['account', account], ['department', department], ['workType', workType]])
                .then(() => {
                        console.log("save success!");
                    },
                ).catch((error) => {
                console.log("save failed!");
            });
        }
    }
}