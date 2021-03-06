/**
 * 日程工作api
 */
'use strict';
import App from '../constant/Application';
let BASE_URL = 'http://scmprt.linshimuye.com:8806/wssch/';
//let BASE_URL = 'http://lsprt.lsmuyprt.com:8806/wsschtest/';
//let BASE_URL = 'http://113.105.237.98:8806/wsschtest/';
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
            timeout: 60000
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
            timeout: 60000
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

    static getList(filter, member,isAudit) {
        let method = 'ScheduleWork/GetSchedule';
        let param = JSON.stringify({
            account: App.account,
            filter: filter,
            member: isAudit?"":(member?member:App.account)
            //  userttype: type
        });
        return this.postRequest(method, param);
    }

    static createWork(time, content, helper, scheduleId, isSubmit,helpContent,workType) {
        let method = 'ScheduleWork/CreateSchedule';
        let param = JSON.stringify({
            account: App.account,
            content: content,
            helper: helper,
            scheduleId: scheduleId,
            worktime: time,
            issubmit: isSubmit ? 1 : 0,
            helpcontent:helpContent,
            worktype:workType
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

    static auditWork(scheduleId, status, remark,finishDate) {//0submit 1audit 2reject 3finish
        let method = 'ScheduleWork/AuditSchedule';
        let param = JSON.stringify({
            account: App.account,
            scheduleId: scheduleId,
            status: status,
            rejectremark: remark,
            plancompletime:finishDate
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
        let method = 'ScheduleWork/getWorkReport?yearmonth='+date+'&account='+App.account;
        let param = JSON.stringify({});
        return this.getRequest(method, param);
    }
}