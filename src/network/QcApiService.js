/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
//let BASE_URL = "http://119.145.166.182:8806/MoveOffice/";
//npmlet BASE_URL = "http://119.145.166.182:8806/moveofficeTest/";
import App from '../constant/Application';
let BASE_URL = 'http://119.145.166.182:8806/moveofficeTest/';
//let BASE_URL = 'http://192.168.1.190:8806/moveofficeTest/';
export  default  class ApiService {

    static getBaseUrl(){
        return BASE_URL
    }

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
    }

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
    }

    static submitImage(itemId,pid,name,image) {
        let method = 'SubmitQualityImage';
        let param = JSON.stringify({
            itemGuid: itemId,
            fentityID: pid,
            fileName: name,
            imageSrc: image
        });
        return this.postRequest(method, param);
    }

    static arrivalSign(address, way, lat, lng) {
        let method = 'QCSign';
        let param = JSON.stringify({
            UserName: App.account,
            Address: address,
            Type: way,
            Latitude: lat,
            Longitude: lng,
        });
        return this.postRequest(method, param);
    }
    static submitQualityContent(productId,state, contentJ, totalContent, lat, lng) {
        let method = 'SubmitQualityFeedback';
        let param = JSON.stringify({
            userName: App.account,
            fentityID: productId,
            stage: state,
            contentJson: contentJ,
            totalContent: totalContent,
            Latitude: lat,
            Longitude: lng,
        });
        return this.postRequest(method, param);
    }
    static submitTask(productId,state) {
        let method = 'SubmitQualityStatus';
        let param = JSON.stringify({
            userName: App.account,
            purchaseNo: productId,
            status: state
        });
        return this.postRequest(method, param);
    }

    static getSignHistory(type, startTimestamp, endTimestamp) {
        let method = 'QCSignQuery?userName=' + App.account + '&type=' + type+ '&startTimestamp=' + startTimestamp+ '&endTimestamp=' + endTimestamp;
        return this.getRequest(method);
    }

    static getProductList() {
        let method = 'QualityTaskList?UserName=' + App.account;
        return this.getRequest(method);
    }
    static getFormItems(pid,stage) {
        let method = 'QualityInfo?UserName=' + App.account+ '&fentityID=' + pid+ '&stage=' + stage;
        return this.getRequest(method);
    }
}