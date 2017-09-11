package com.zuni.library.utils;

/**
 * Created by Jacob So on 2015/12/4.
 */

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.NumberFormat;

public class zValueUtil {
    public static String getPercent(double a,double b){
        double percent = a / b;
        NumberFormat nt = NumberFormat.getPercentInstance();
        //设置百分数精确度2即保留两位小数
        nt.setMinimumFractionDigits(2);
        return nt.format(percent);
    }
    public static String double2Persent(double d, int fraction) {
        NumberFormat nt = NumberFormat.getPercentInstance();

        nt.setMinimumFractionDigits(fraction);

        return nt.format(d);
    }

    public static String str2Percent(String digit, int fraction) {
        if (zDateUtil.isEmptyString(digit)) {
            return "";
        }
        double d = Double.parseDouble(digit);

        NumberFormat nt = NumberFormat.getPercentInstance();

        nt.setMinimumFractionDigits(fraction);

        return nt.format(d);
    }

    public static Double double2Double(Double d, int fraction) {
        BigDecimal bd = new BigDecimal(d.doubleValue());
        BigDecimal bd1 = bd.setScale(fraction, 4);
        d = Double.valueOf(bd1.doubleValue());
        return d;
    }

    public static String string2String(String d, int fraction) {
        if (zDateUtil.isEmptyString(d)) {
            return d;
        }
        String parten = "#0";
        if (fraction > 0) {
            parten = parten + ".";
            for (int i = 0; i < fraction; i++) {
                parten = parten + "0";
            }
        }
        DecimalFormat df = new DecimalFormat(parten);
        String result = df.format(Double.parseDouble(d));
        return result;
    }

    public static String getFormatNumber(String num,String format){
        if(num!=null&&!num.equals("")&&!num.equals("null")){
            NumberFormat nf = new DecimalFormat(format);
            Double d = Double.valueOf(num);
            return nf.format(d);
        }else{
            return "0";
        }

    }
    public static String getFormatPresent(String num,String format){
        NumberFormat nf = new DecimalFormat(format);
        Double d = Double.valueOf(num);
        return nf.format(d*100)+"%";
    }

    public static String getFloatPresent(Float value){
        Double d = Double.valueOf(value);
        NumberFormat nt = NumberFormat.getPercentInstance();
        nt.setMinimumFractionDigits(2);
        return nt.format(d);
    }
}
