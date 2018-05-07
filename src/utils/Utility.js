/**
 * Created by Administrator on 2017/6/1.
 */
export  default  class ApiService {

    static replaceT(time){
        return new Date(time).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
    }

    static getYyMmDdFormat(time){
        let temp = new Date(time)
        return temp.getFullYear()+"-"+(temp.getMonth()+1)+'-'+temp.getDate();
    }

    static getFullTime(time,addSeconds){
        let temp = new Date();
        temp.setTime(addSeconds?(time*1000):time);
        return temp.getFullYear()+"-"+(temp.getMonth()+1)+'-'+temp.getDate()+" "+temp.getHours()+":"+temp.getMinutes();
    }

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
        return Number(result.toFixed(0));
    }

    static Rad(d) {
        return d * Math.PI / 180;
    }

    static getHourMinute(date){
       // let datetemp = new Date(date);
        let hour = date.getHours();
        let min = date.getMinutes();
        console.log(hour+":"+min);
        return (hour<10?'0'+hour:hour)+":"+(min<10?'0'+min:min);
    }

    static  getTimeStatus(date) {
        let hour = date.getHours();
        let min = date.getMinutes();
        let strTemp = hour + "" + (min < 10 ? "0" + min : min);
        let timeNumber = Number(strTemp);
        console.log(strTemp);
        if (timeNumber <= 845) {
            return "上午上班"
        } else if (timeNumber <= 1245 && timeNumber > 1215 ) {
            return "上午下班"
        } else if (timeNumber <= 1345 && timeNumber > 1245) {
            return "下午上班"
        } else if (timeNumber >= 1815) {//1755
            return "下午下班"
        } else return "时候未到"
    }
    static getVersion(){

    }




}