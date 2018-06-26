/**
 * 外出工作api
 */
'use strict';
//let BASE_URL = 'http://192.168.2.3:8806/outapply/';
let BASE_URL = 'http://lsprt.lsmuyprt.com:8806/outapply/';
//let BASE_URL = 'http://192.168.1.190:8806/outapplytest/';
import App from '../constant/Application';
let newFetch = function (input, opts) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, opts.timeout);
        fetch(input, opts).then(resolve, reject);
    });
};
export  default  class ApiService {
    static _request(method, param) {
        console.log('method:' + BASE_URL + method + '\nparam:' + param);
        return newFetch(BASE_URL + method, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: param,
            timeout: 30000
        })
            .then((response) => {
                console.log(response);
                return response;
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                return responseJson;

            })

    }

    static pgyerApiCheck(key) {
        //   console.log("pgyerApiCheck");
        return fetch("http://www.pgyer.com/apiv1/app/viewGroup", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;',
            },
            body: "aId=" + key + "&_api_key=6dadcbe3be5652aec70a3d56f153bfb4"
        })
            .then((response) => {
                console.log(response);
                return response;
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                return responseJson;

            })
    }

    static pgyerApiInstall(akey) {
        console.log("pgyerApiInstall");
        return fetch("http://www.pgyer.com/apiv1/app/install?_api_key=6dadcbe3be5652aec70a3d56f153bfb4&aKey=" + akey, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log(response);
                return response;
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                return responseJson;

            })
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
            //    worktype: App.workType,
            SupplierName: '',
            Series: '',
            applydate: '',
            endapplydate: '',
            jobtype: App.jobType

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

    static createWork(date,  remark, work, dpt, trip, tripBack,order) {
        let method = 'DailyRecord/CreateDailyRecord';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
            Creator: App.account,
            DockingDate: date,
            IsApplyCar: 1,
            CarType: "",
            FollowPeson: "",
            Remark: remark,
            listWorkDetail: work,
            Dptid: dpt,
            DailyType: trip,
            DailyEndDate: tripBack,
            CarNO:order
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
        let method = 'DailyRecord/UpdateDailyRecordState';
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
        let method = 'DailyRecord/DailyRecordScore';
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

    static getToday() {
        let method = 'Sign/getTodayTask';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
            username: App.account
        });
        return this._request(method, param);
    }

    static taskSign(guid, lat, lng, address, type, remark) {
        let method = 'Sign/punchclock';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
            username: App.account,
            recordordetailguid: guid,
            latitude: lat,
            longitude: lng,
            Address: address,
            remark: remark,
            signtype: type,
        });
        return this._request(method, param);
    }

    static taskSignNew(guid, lat, lng, address, type, remark, tripType, finishTime, departmentId) {
        let method = 'Sign/punchclockn';
        let param = JSON.stringify({
            uniqueIdentifier: App.session,
            username: App.account,
            recordordetailguid: guid,
            latitude: lat,
            longitude: lng,
            Address: address,
            remark: remark,
            signtype: type,
            dailytype: tripType,
            dailyenddate: finishTime,
            punchclockn: departmentId,
        });
        return this._request(method, param);
    }

    static addLocation(shortName, address) {
        let method = 'LogisticSupplier/CheckSupplier';
        let param = JSON.stringify({
            shortname: shortName,
            adress: address,
            username: App.account
        });
        return this._request(method, param);
    }

}