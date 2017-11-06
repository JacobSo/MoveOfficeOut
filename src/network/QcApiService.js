/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
//let BASE_URL = "http://119.145.166.182:8806/MoveOffice/";
import App from '../constant/Application';
let BASE_URL = 'http://lsprt.lsmuyprt.com:8806/moveofficeTest/';
//let BASE_URL =" http://192.168.2.3:8806/moveofficeTest/";
//let BASE_URL = 'http://192.168.1.190:8806/moveofficeTest/';
let newFetch = function (input, opts) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, opts.timeout);
        fetch(input, opts).then(resolve, reject);
    });
};
export  default  class ApiService {

    static getBaseUrl(){
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

            })   }

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

            })    }

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

    static arrivalSign(image,fileName,remark,address,lat, lng) {
        let method = 'QCSign';
        let param = JSON.stringify({
            UserName: App.account,
            Address: address,
            Type: 1,
            Latitude: lat,
            Longitude: lng,
            fileName:fileName,
            remark:remark,
            imgCode:image
        });
        return this.postRequest(method, param);
    }

    static getSignHistory() {
        let method = 'QCSignList?UserName=' + App.account;
        return this.getRequest(method);
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

    static getProductList() {
        let method = 'QualityTaskList?UserName=' + App.account;
        return this.getRequest(method);
    }
    static getFormItems(pid,stage) {
        let method = 'QualityInfo?UserName=' + App.account+ '&fentityID=' + pid+ '&stage=' + stage;
        return this.getRequest(method);
    }

    ///////////////
    static getProductListOld() {
        let method = 'ConventionalQuality?QualityUser=' + App.account;
        return this.getRequest(method);
    }
    static submitTaskOld(qcCheck,productList,qcNum,passNum,storeNum,percent,totalComment,qcResult,lat,lng) {
        let method = 'ConventionalQualityResultN';
        let param = JSON.stringify({
            UserName: App.account,
            QualityNoGuid: qcCheck,
            pnliststr: productList,
            QualityQty: qcNum,
            PassQty: passNum,
            PassPercent: percent,
            ImprovementMeasures: totalComment,
            qcliststr: qcResult,
            GetInQuantity: storeNum,
            Latitude: lat,
            Longitude: lng,
        });
        return this.postRequest(method, param);
    }
    static uploadImageOld(pid,fid,name,img) {
        let method = 'ConventionalQualityImgUpload';
        let param = JSON.stringify({
            imgCode: img,
            fileName: name,
            ProductNoGuidListStr: pid,
            ReviewItemGuid: fid,
        });
        return this.postRequest(method, param);
    }
    static finishTaskOld(id,lat,lng) {
        let method = 'ConventionalQualityState';
        let param = JSON.stringify({
            UserName: App.account,
            QualityNoGuid: id,
            state: 2,
            Latitude: lat,
            Longitude: lng,
        });
        return this.postRequest(method, param);
    }

    static getCarInfo() {
        let method = 'Quality_CarRequest/getMyCarRequest';
        let param = JSON.stringify({
            UserName: App.account,
        });
        return this.postRequest(method, param);
    }


    static requestCar(remark,myCar,type,date,flag) {
        let method = 'Quality_CarRequest/createCarRequest';
        let param = JSON.stringify({
            UserName: App.account,
            QualityDate: date,
            IsApplyCar: flag,
            CarType: type,
            CarNumber: myCar,
            Remark: remark,
        });
        return this.postRequest(method, param);
    }
    static deleteCar(guid) {
        let method = 'Quality_CarRequest/del';
        let param = JSON.stringify({
            Guid: guid,
        });
        return this.postRequest(method, param);
    }
}