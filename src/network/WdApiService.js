/**
 * 软体板木研发api
 */
'use strict';
//let BASE_URL = "http://119.145.166.182:8806/MoveOffice/";
let BASE_URL = "http://lsprt.lsmuyprt.com:8806/moveofficeTest/";
let BASE_URL2 = 'http://lsprt.lsmuyprt.com:8806/outapply/';

//let BASE_URL = "http://192.168.2.3:8806/moveofficeTest/";
import App from '../constant/Application';
let newFetch = function (input, opts) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, opts.timeout);
        fetch(input, opts).then(resolve, reject);
    });
};
export  default  class ApiService {

    static postRequest(method, param, otherUrl) {
        console.log('method:' + BASE_URL + method + '\nparam:' + param);

        return newFetch((otherUrl ? otherUrl : BASE_URL) + method, {
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


    static getSeries() {
        let method = 'PlateTrackSeries?FacEngineer=' + App.account;
        return this.getRequest(method);
    }

    static submitStatus(id) {
        let method = 'PlateTrackSeriesState';
        let param = JSON.stringify({
            SeriesGuid: id,
            State: 2,
        });
        return this.postRequest(method, param);
    }

    static submitProduct(data) {
        let method = 'PlateTrackReviewResult';
        let param = JSON.stringify({
            account: App.account,
            fileName: data,
        });
        return this.postRequest(method, param);
    }

    static postImg(data) {
        let method = 'PlateTrackImgUpload';
        let param = JSON.stringify({
            account: App.account,
            listPicJson: data,
        });
        return this.postRequest(method, param);
    }

    static searchSeries(series, factory) {
        let method = 'ReviewBillN/GetReviewBillSerch';
        let param = JSON.stringify({
            series: series,
            facname: factory,
            state: 3,
        });
        return this.postRequest(method, param,BASE_URL2);
    }

}