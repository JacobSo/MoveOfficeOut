/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import App from '../constant/Application';
let BASE_URL = 'http://113.105.237.98:8806/wssch/';
let newFetch = function (input, opts) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, opts.timeout);
        fetch(input, opts).then(resolve, reject);
    });
};
export  default  class SwApiService {

    static getBaseUrl() {
        return BASE_URL
    }

    static postRequest(method, param) {
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

    static getRequest(method, param) {
        console.log('method:' + BASE_URL + method + '\nparam:' + param);

        return newFetch(BASE_URL + method, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000
            /// body: param
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

    static getList(name,filter, member) {
        let method = 'ScheduleWork/GetSchedule';
        let param = JSON.stringify({
            account: name===null?App.account:name,
            filter: filter,
            member: member,
            //  userttype: type
        });
        return this.postRequest(method, param);
    }

    static createWork(time, content, helper, scheduleId, isSubmit,helpContent) {
        let method = 'ScheduleWork/CreateSchedule';
        let param = JSON.stringify({
            account: App.account,
            content: content,
            helper: helper,
            scheduleId: scheduleId,
            worktime: time,
            issubmit: isSubmit ? 1 : 0,
            helpcontent:helpContent
        });
        return this.postRequest(method, param);
    }

    static deleteWork(scheduleId) {
        let method = 'ScheduleWork/delwork';
        let param = JSON.stringify({
            scheduleId: scheduleId,
        });
        return this.postRequest(method, param);
    }

    static auditWork(scheduleId, status, remark) {//0submit 1audit 2reject 3finish
        let method = 'ScheduleWork/AuditSchedule';
        let param = JSON.stringify({
            account: App.account,
            scheduleId: scheduleId,
            status: status,
            rejectremark: remark
        });
        return this.postRequest(method, param);
    }

    static submitFeedback(scheduleId, content) {
        let method = 'ScheduleWork/SubmitFeedback';
        let param = JSON.stringify({
            account: App.account,
            scheduleId: scheduleId,
            content: content,
        });
        return this.postRequest(method, param);
    }

    static callHelper(scheduleId, helper,content) {
        let method = 'ScheduleWork/CallHelper';
        let param = JSON.stringify({
            account: App.account,
            scheduleId: scheduleId,
            helper: helper,
            helpcontent:content
        });
        return this.postRequest(method, param);
    }


    static uploadImage(uploadId, fileName, imageStr) {
        let method = 'ImgUpload/UpImg';
        let param = JSON.stringify({
            imageStr: imageStr,
            uploadId: uploadId,
            fileName: fileName,
        });
        return this.postRequest(method, param);
    }

    static setResult(scheduleId, result,comment) {
        let method = 'ScheduleWork/WorkResultSet';
        let param = JSON.stringify({
            account: App.account,
            scheduleId: scheduleId,
            result: result,
            scoreremark:comment
        });
        return this.postRequest(method, param);
    }

    static getMembers() {
        let method = 'User/getAssistUsers';
        let param = JSON.stringify({});
        return this.getRequest(method, param);
    }

    static initWorkType() {
        let method = 'User/getworktypes?account=' + App.account;
        let param = JSON.stringify({});
        return this.getRequest(method, param);
    }

    static getCount(date) {
        let method = 'ScheduleWork/getWorkReport?yearmonth='+date;
        let param = JSON.stringify({});
        return this.getRequest(method, param);
    }
}