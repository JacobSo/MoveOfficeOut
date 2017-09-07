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
    static deleteRequest(method) {
        console.log('method:' + BASE_URL + method + '\nparam:' );

        return fetch(BASE_URL + method, {
            method: 'DELETE',

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

    static getOrderList(status) {
        let method = 'orders?'+(status==='service_approving'?'saler_name':'creater_name')+'=' + App.account+'&status='+status;
        return this.getRequest(method);
    }

    static getExceptionList(flag) {
        let temp = (flag===0?"reasonrank":(flag===1?"typerank":"compensationrank"));
        let method = 'dutyreports/'+temp;
        return this.getRequest(method);
    }

    static getSupplierList() {
        let method = 'supplier_user_matcher';
        return this.getRequest(method);
    }
    static createOrder(type,supplierName,remark,causer) {
        let method = 'orders';
        let param = JSON.stringify({
            creater_name: App.account,
            type:type,
            customer_name:supplierName,
            accuser_name:causer,
            reason:remark,
            remark:remark,
        });
        return this.postRequest(method, param);
    }

    static updateOrder(id,type,supplierName,remark,operation,causer) {
        let method = 'orders/'+id;
        if(operation){
            let param = JSON.stringify({
                creater_name: App.account,
                operator_name: App.account,
                type:type,
                customer_name:supplierName,
                accuser_name:causer,
                reason:remark,
                remark:remark,
                operation:operation
            });
            return this.putRequest(method, param);
        }else{
            let param = JSON.stringify({
                creater_name: App.account,
                operator_name: App.account,
                type:type,
                customer_name:supplierName,
                accuser_name:causer,
                reason:remark,
                remark:remark,
            });
            return this.putRequest(method, param);
        }
    }
    static deleteOrder(id) {
        let method = 'orders/'+id;

        return this.deleteRequest(method);
    }
    static submitOrder(id,products,form,comment) {
        let method = 'orders/'+id;
        let param = JSON.stringify({
            abnormal_products: products,
            duty_report: form,
            tracks: comment,
            operator_name: App.account,
            operation:"done"

        });
        return this.putRequest(method, param);
    }

    static getProductList(keyword) {
        let method = 'all-products?key_word='+keyword;
        return this.getRequest(method);
    }

}