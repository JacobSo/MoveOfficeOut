/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
let BASE_URL = 'http://192.168.1.190:8806/outapply/';
import App from '../constant/Application';

export  default  class ApiService extends Component {

    static _request(method, param) {
        console.log('method:' + BASE_URL + method + '\nparam:' + param);

        return fetch(BASE_URL + method, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: param
        })
            .then((response) => {
                console.log(response);
                return response;
            })
            .then((response) => response.json())
            .catch((error) => console.error(error));
    }


    static loginFuc(name, pwd) {
        let method = 'User/ToLogin';
        let param = JSON.stringify({
            username: name,
            pwd: pwd,
        });

        return this._request(method, param);
    }

    static getItems(page, type) {
        let method = 'DailyRecord/GetDailyRecord'
        let param = JSON.stringify({
            UserName: App.account,
            uniqueIdentifier: App.session,
            datatype: type,
            curpage: page,
            worktype: App.workType,
            SupplierName: '',
            Series: '',
            applydate: '',
            endapplydate: '',

        });
        return this._request(method, param);
    }

    static searchItems(page, type, supply, series, start, end) {
        let method = 'DailyRecord/GetDailyRecord';
        let param = JSON.stringify({
            UserName: App.account,
            uniqueIdentifier: App.session,
            datatype: type === 0 ? "0,1,2" : "3,4",
            curpage: page,
            worktype: App.workType,
            SupplierName: supply,
            Series: series,
            applydate: start,
            endapplydate: end,

        });

        return this._request(method, param);

    }

    static setPassword(old, pwd) {
        let method = 'User/UpPwd';
        let param = JSON.stringify({
            username: App.account,
            pwd: old,
            newpwd: pwd,
            uniqueIdentifier: App.session
        });

        return this._request(method, param);

    }

    static createWork(date, isCar, catSrc, member, remark, work) {
        let method = 'DailyRecord/CreateDailyRecord';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
            Creator: App.account,
            DockingDate: date,
            IsApplyCar: isCar,
            CarType: catSrc,
            FollowPeson: member,
            Remark: remark,
            listWorkDetail: work
        });

        return this._request(method, param);

    }

    static sighWork(guid, result) {
        let method = 'DailyRecord/AddDailyRecordResult';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
            DetailGuid: guid,
            WorkResult: result
        });

        return this._request(method, param);
    }

    static finishWork(guid, state, reject) {
        let method = 'DailyRecord/CreateDailyRecord';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
            Guid: guid,
            State: state,
            UpdateUser: App.account,
            RejectMark: reject
        });

        return this._request(method, param);
    }

    static searchParam(type, series, supplier) {
        let method = 'DailyRecord/Fuzzysearch';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
            searchtext: '',
            searchtype: type,
            series: series,
            supplier: supplier
        });

        return this._request(method, param);
    }

    static addCar(guid, car) {
        let method = 'DailyRecord/updateCarNumber';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
            recordguid: guid,
            carNumber: car,
        });

        return this._request(method, param);
    }

    static deleteWork(guid) {
        let method = 'DailyRecord/delRecord';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
            recordguid: guid,
        });

        return this._request(method, param);
    }

    static getCarList() {
        let method = 'DailyRecord/getCarNumberList';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
        });

        return this._request(method, param);
    }

    static addScore(guid, score, detailGuid, suggest, type) {
        let method = 'DailyRecord/delRecord';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
            recordguid: guid,
            score: score,
            detailguid: detailGuid,
            suggest: suggest,
            scoretype: type,
        });

        return this._request(method, param);
    }
}