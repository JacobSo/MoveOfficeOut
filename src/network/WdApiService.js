/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
//let BASE_URL = "http://119.145.166.182:8806/MoveOffice/";
let BASE_URL = "http://113.105.237.98:8806/moveofficeTest/";
//let BASE_URL = "http://192.168.1.190:8806/moveofficeTest/";
import App from '../constant/Application';

export  default  class ApiService {

    static postRequest(method, param) {
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
            .then((responseJson) => {
                console.log(responseJson);
                return responseJson;

            }) }

    static getRequest(method, param) {
        console.log('method:' + BASE_URL + method + '\nparam:' + param);

        return fetch(BASE_URL + method, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
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

            }) }


    static getSeries() {
        let method = 'PlateTrackSeries?FacEngineer=' + App.account;
        return this.getRequest(method);
    }

    static submitStatus(id) {
        let method = 'PlateTrackSeriesState'
        let param = JSON.stringify({
            SeriesGuid: id,
            State: 2,
        });
        return this.postRequest(method, param);
    }

    static submitProduct(data) {
        let method = 'PlateTrackReviewResult'
        let param = JSON.stringify({
            account: App.account,
            fileName: data,
        });
        return this.postRequest(method, param);
    }

    static postImg(data) {
        let method = 'PlateTrackImgUpload'
        let param = JSON.stringify({
            account: App.account,
            listPicJson: data,
        });
        return this.postRequest(method, param);
    }

}