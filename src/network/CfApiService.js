/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import App from '../constant/Application';
let GPS_URL = 'http://api.gpsoo.net/1/';
let BASE_URL = 'http://192.168.1.190:8806/LsCarApply/';
let md5 = require('js-md5');
let newFetch = function (input, opts) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, opts.timeout);
        fetch(input, opts).then(resolve, reject);
    });
};
export  default  class CfApiService {
    static getBaseUrl() {
        return BASE_URL
    }

    static postRequest(url, method, param) {
        console.log('method:' + url + method + '\nparam:' + param);

        return newFetch(url + method, {
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

    static getRequest(url, method, param) {
        console.log('method:' + url + method + '\nparam:' + param);

        return newFetch(url + method, {
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


    static getGpsToken() {
        let time = Date.parse(new Date()).toString().substr(0, 10);
        let method = 'auth/access_token?' +
            'account=18126633069' +
            '&time=' + time +
            '&signature=' + md5(md5("123456") + time);
        return this.getRequest(GPS_URL, method);
    }

    static getGpsHistory(token) {
        let begin = Date.parse(new Date("2018/04/07 14:15:05")).toString().substr(0, 10);
        let end = Date.parse(new Date()).toString().substr(0, 10);
        let method = 'devices/history?' +
            'access_token=' + token +
            '&map_type=BAIDU' +
            '&account=18126633069' +
            '&imei=868120184180922' +
            //   '&time=' + App.account +
            '&begin_time=' + begin +
            '&end_time=' + end;
        return this.getRequest(GPS_URL, method);
    }

    static getList(status) {
        let method = 'CarApply/GetBill?' +
            'account=' + App.account +
            '&workOrder=' + "" +
            '&status=' + status;
        return this.getRequest(BASE_URL, method);
    }

    static requestCar(params) {
        let targets = ''
        params.locations.map((str)=>{
            targets=targets+str+','
        })
        let method = 'CarApply/Apply';
        let param = JSON.stringify({
            account: App.account,
            workNum: "",
            tripMember: params.members,
            carType: params.selection,
            carNum: params.privateCar,
            carPower: params.privateFeature,
            tripArea:params.tripArea,
            tripDistance: params.distance,
            needCard: params.card,
            tripTime: params.useTime,
            tripTarget:  targets.substring(0,targets.length-1),
            remark: params.remark,
        });
        return this.postRequest(BASE_URL, method, param);
    }

    static setDistance(order, text, image, type) {
        let method = 'CarApply/TripRegister';
        let param = JSON.stringify({
            billNo: order,
            point: text,
            pic: image,
            type: type,
        });
        return this.postRequest(BASE_URL, method, param);
    }

    static dismissOrder(order) {
        let method = 'CarApply/GiveUpCar';
        let param = JSON.stringify({
            billNo: order,
        });
        return this.postRequest(BASE_URL, method, param);
    }
}