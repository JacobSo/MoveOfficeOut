/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
//let BASE_URL = "http://119.145.166.182:8806/MoveOffice/";
//npmlet BASE_URL = "http://119.145.166.182:8806/moveofficeTest/";
import App from '../constant/Application';
let BASE_URL = 'http://192.168.3.172:5050/api/v1/afterservice/';
//let BASE_URL = 'http://192.168.1.190:8806/moveofficeTest/';
export  default  class ApiService {

    static getBaseUrl(){
        return BASE_URL
    }

    static putRequest(method, param) {
        console.log('method:' + BASE_URL + method + '\nparam:' + param);

        return fetch(BASE_URL + method, {
            method: 'PUT',
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
            /// body: param
        })
            .then((response) => {
                console.log(response);
                return response;
            })
            .then((response) => response.json())
    }

    static getOrderList() {
        let method = 'orders';// + App.account;
        return this.getRequest(method);
    }

    static getCustomerList() {
        let method = 'orders';
        return this.getRequest(method);
    }

    static createOrder() {
        let method = 'orders';
        let param = JSON.stringify({
            customer_name: App.account,

        });
        return this.postRequest(method, param);
    }

    static upadteOrder() {
        let method = 'orders';
        let param = JSON.stringify({
            customer_name: App.account,

        });
        return this.postRequest(method, param);
    }

    static submitOrder() {
        let method = 'orders';
        let param = JSON.stringify({
            customer_name: App.account,

        });
        return this.postRequest(method, param);
    }

    static commentOrder() {
        let method = 'orders';
        let param = JSON.stringify({
            customer_name: App.account,

        });
        return this.postRequest(method, param);
    }

    static finishOrder() {
        let method = 'orders';
        let param = JSON.stringify({
            customer_name: App.account,

        });
        return this.postRequest(method, param);
    }
}