/**
 * 售后api
 */
'use strict';
//let BASE_URL = "http://119.145.166.182:8806/MoveOffice/";
//npmlet BASE_URL = "http://119.145.166.182:8806/moveofficeTest/";
import App from '../constant/Application';
let BASE_URL = 'http://lsprt.lsmuyprt.com:5050/api/v1/afterservice/';

//let BASE_URL = 'http://192.168.1.190:8806/moveofficeTest/';
let newFetch = function (input, opts) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, opts.timeout);
        fetch(input, opts).then(resolve, reject);
    });
};
export  default  class ApiService {

    static getBaseUrl() {
        return BASE_URL
    }

    static putRequest(method, param) {
        console.log('method:' + BASE_URL + method + '\nparam:' + param);

        return newFetch(BASE_URL + method, {
            method: 'PUT',
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

    static deleteRequest(method) {
        console.log('method:' + BASE_URL + method + '\nparam:');

        return newFetch(BASE_URL + method, {
            method: 'DELETE',
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

    static postRequest(method, param) {
        let temp = method.indexOf("http://") > -1 ? method : (BASE_URL + method);
        console.log('method:' + temp + '\nparam:' + param);

        return newFetch(temp, {
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
        let temp = method.indexOf("http://") > -1 ? method : (BASE_URL + method);
        console.log('method:' + temp + '\nparam:' + param);

        return newFetch(temp, {
            method: 'GET',
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

    static getOrderList(status) {
        let method = 'orders?' +
            (status === 'waitting' || status === 'service_approving' ? 'saler_name' : status === 'service_approved' ? 'leader_name' : 'creater_name') +
            '=' + App.account + (status === "" ? "&workflow_status=in_progress" : ( '&status=' + status));
        return this.getRequest(method);
    }

    static getExceptionList(flag) {
        let temp = (flag === 0 ? "reasonrank" : (flag === 1 ? "typerank" : "compensationrank"));
        let method = 'dutyreports/' + temp;
        return this.getRequest(method);
    }

    static getSupplierList(type) {
        let method = 'supplier_user_matcher?role=' + type;//成品商,材料商
        return this.getRequest(method);
    }


    static createOrder(reason, customer_name, remark, accuser_name, addType, person) {
        let method = 'orders';
        let param = JSON.stringify({
            creater_name: App.account,
            reason: reason,
            customer_name: customer_name,
            accuser_name: accuser_name,
            type: addType,
            remark: remark,
            saler_name: person
        });
        return this.postRequest(method, param);
    }

    static updateOrder(id, reason, customer_name, remark, operation, accuser_name, addType, person) {
        let method = 'orders/' + id;
        if (operation) {
            let param = JSON.stringify({
                creater_name: App.account,
                operator_name: App.account,
                type: addType,
                customer_name: customer_name,//switch
                accuser_name: accuser_name,//switch
                reason: reason,
                remark: remark,
                saler_name: person,
                operation: operation,
            });
            return this.putRequest(method, param);
        } else {
            let param = JSON.stringify({
                creater_name: App.account,
                operator_name: App.account,
                type: addType,
                customer_name: customer_name,//switch
                accuser_name: accuser_name,//switch
                reason: reason,
                remark: remark,
                saler_name: person
            });
            return this.putRequest(method, param);
        }
    }

    static deleteOrder(id) {
        let method = 'orders/' + id;
        return this.deleteRequest(method);
    }

    static submitOrder(id, products, form, comment) {
        let method = 'orders/' + id;
        let param = JSON.stringify({
            abnormal_products: products,
            duty_report: form,
            tracks: comment,
            operator_name: App.account,
            operation: "done",
            saler_name: App.account
        });
        return this.putRequest(method, param);
    }

    static rejectOrder(id, content) {
        let method = 'orders/' + id;
        let param = JSON.stringify({
            operator_name: App.account,
            operation: "reject",
            reject_reason: content,
        });
        return this.putRequest(method, param);
    }

    static getProductList(keyword) {
        let method = 'http://lsprt.lsmuyprt.com:8806/shorder/ShMaterial/get_all_material?key_word=' + keyword;
        return this.getRequest(method);
    }

    static getProblemType() {
        let method = "http://lsprt.lsmuyprt.com:8806/shorder/ShMaterial/get_aftertypes";
        return this.getRequest(method);
    }

    static submitOrderSimple(id, status, data,remark) {
        let method = 'orders/' + id;
        let temp = {
            operator_name: App.account,
            operation: status,
            submitType: 'PC',
            quality: data[0],
            delivery_date: data[1],
            not_allow: data[2],
            loss: data[3],
            initiative: data[4],
            remark:remark,
        };
        let param = JSON.stringify(temp);
        return this.putRequest(method, param);
    }

    static uploadImage(id, fileName, imgCode) {
        let method = "http://lsprt.lsmuyprt.com:8806/shorder/ShImgUpload/UpImg";
        let param = JSON.stringify({
            id: id,
            imgCode: imgCode,
            fileName: fileName
        });
        return this.postRequest(method, param);
    }

}