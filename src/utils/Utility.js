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

    static distance(lat1, lng1,lat2,lng2) {
        let EARTH_RADIUS = 6378137;
        let radLat1 = this.Rad(lng1);
        let radLng1 = this.Rad(lat1);
        let radLat2 = this.Rad(lat2);
        let radLng2 = this.Rad(lng2);
        let a = radLat1 - radLat2;
        let b = radLng1 - radLng2;
        let result = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2))) * EARTH_RADIUS;
        return result.toFixed(0);
    }

    static Rad(d) {
        return d * Math.PI / 180;
    }

    static getHourMinute(date){
        let temp = new Date(date);
        let hour = temp.getHours();
        let min = temp.getMinutes();
        return (hour<10?'0'+hour:hour)+":"+(min<10?'0'+min:min);
    }

    static getVersion(){

    }


}