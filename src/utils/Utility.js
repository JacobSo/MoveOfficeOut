/**
 * Created by Administrator on 2017/6/1.
 */
export  default  class ApiService {

    static getTime(ReviewDate) {
        let date = new Date(parseInt(ReviewDate.replace("/Date(", "").replace(")/", ""), 10));
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return date.getFullYear() + "-" + month + "-" + currentDate;
    }

}