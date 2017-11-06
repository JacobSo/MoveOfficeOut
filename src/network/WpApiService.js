/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
//let BASE_URL = "http://119.145.166.182:8806/MoveOffice/";
//npmlet BASE_URL = "http://119.145.166.182:8806/moveofficeTest/";
import App from '../constant/Application';
//let BASE_URL = 'http://192.168.2.3:8806/outapplytest/';
//let BASE_URL = 'http://192.168.2.3:8806/outapply/';
let BASE_URL = 'http://lsprt.lsmuyprt.com:8806/outapply/';
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

            })  }

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

            }) }

    static getList(state) {
        let method = 'ReviewBill/GetReviewBillList';
        let param = JSON.stringify({
            username: App.account,
            state: state,
            uniqueIdentifier: App.session
        });
        return this.postRequest(method, param);
    }

    static createWork(series, car, factory, date, member, type, products,factoryMember) {
        let method = 'ReviewBill/CreateReviewBill';
        let param = JSON.stringify({
            username: App.account,
            series: series,
            isapplycar: car,
            facname: factory,
            reviewdate: date,
            followpeson: member,
            reviewtype: type,
            products: products,
            facuser:factoryMember,
            uniqueIdentifier: App.session
        });
        return this.postRequest(method, param);
    }

    static modifyWork(guid,series, car, factory, date, member, type, products,factoryMember) {
        let method = 'ReviewBill/UpReviewBill';
        let param = JSON.stringify({
            guid: guid,
            username: App.account,
            series: series,
            isapplycar: car,
            facname: factory,
            reviewdate: date,
            followpeson: member,
            reviewtype: type,
            products: products,
            facuser:factoryMember,
            uniqueIdentifier: App.session
        });
        return this.postRequest(method, param);
    }
    static deleteWork(id) {
        let method = 'ReviewBill/Del';
        let param = JSON.stringify({
            guid: id,
            uniqueIdentifier: App.session
        });
        return this.postRequest(method, param);
    }

    static submitWork(id) {
        let method = 'ReviewBill/Submit';
        let param = JSON.stringify({
            guid: id,
            uniqueIdentifier: App.session
        });
        return this.postRequest(method, param);
    }

    static getProduct(keyword, type,series) {
        let method = 'ReviewBill/GetProducts?pname=' + keyword + '&ptype=' + type+'&seriesname='+series;
        return this.getRequest(method);
    }

    static uploadImamge(product, image, name, id) {
        let method = 'ImgUpload/UpImg';
        let param = JSON.stringify({
            id: product,
            imgCode: image,
            fileName: name,
            reviewbillguid: id,
            uniqueIdentifier: App.session
        });
        return this.postRequest(method, param);
    }

    static getFactoryMember() {
        let method = 'FacUser/getfacuesr';
        return this.getRequest(method);
    }
}