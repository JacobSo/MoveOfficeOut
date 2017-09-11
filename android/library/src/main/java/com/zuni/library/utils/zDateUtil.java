package com.zuni.library.utils;

/**
 * Created by Jacob So on 2015/12/4.
 */

import android.annotation.SuppressLint;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class zDateUtil {
    public static Calendar getCalendar() {
        return Calendar.getInstance();
    }

    public static boolean isEmptyString(String str) {
        boolean flag = false;
        if ((str == null) || ("".equals(str))) {
            flag = true;
        }
        return flag;
    }

    //"yyyy-MM-dd HH:mm"
    public static String getNowDate(String format) {
        Date date = new Date();//取时间
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(calendar.DATE, 1);//把日期往后增加一天.整数往后推,负数往前移动
        date = calendar.getTime(); //这个时间就是日期往后推一天的结果
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        return formatter.format(date);
    }

    public static String getDateTime() {
        Date date = new Date(System.currentTimeMillis());
        SimpleDateFormat dateFormat = new SimpleDateFormat(
                "yyyy-MM-dd HH:mm");
        //2014-04-10 14:10
        return dateFormat.format(date);
    }
    @SuppressLint({"SimpleDateFormat"})
    public static boolean isToday(String date) {
        SimpleDateFormat format1 = new SimpleDateFormat("yyyyMMdd");
        SimpleDateFormat format2 = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat format3 = new SimpleDateFormat("yyyy/MM/dd");
        Date today = new Date();
        String todayStr1 = format1.format(today);
        String todayStr2 = format2.format(today);
        String todayStr3 = format3.format(today);
        return (todayStr1.equals(date)) || (todayStr2.equals(date)) || (todayStr3.equals(date));
    }

    public static boolean isEmail(String email) {
        boolean tag = true;
        String pattern1 = "\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
        Pattern pattern = Pattern.compile("\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
        Matcher mat = pattern.matcher(email);
        if (!mat.find()) {
            tag = false;
        }
        return tag;
    }

    public static boolean isPhoneNumber(String phoneNumber) {
        boolean isValid = false;

        String expression = "((^(13|15|18)[0-9]{9}$)|(^0[1,2]{1}\\d{1}-?\\d{8}$)|(^0[3-9] {1}\\d{2}-?\\d{7,8}$)|(^0[1,2]{1}\\d{1}-?\\d{8}-(\\d{1,4})$)|(^0[3-9]{1}\\d{2}-? \\d{7,8}-(\\d{1,4})$))";
        CharSequence inputStr = phoneNumber;

        Pattern pattern = Pattern.compile(expression);

        Matcher matcher = pattern.matcher(inputStr);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }

    public static boolean isDigit(String number, int count) {
        boolean isValid = false;
        if (number == null) {
            return isValid;
        }
        String expression = "[0-9]{" + count + "}";
        if (count <= 0) {
            expression = "[0-9]+";
        }
        CharSequence inputStr = number;

        Pattern pattern = Pattern.compile(expression);

        Matcher matcher = pattern.matcher(inputStr);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }

    public static boolean isLetter(String letter, int count) {
        boolean isValid = false;

        String expression = "[a-zA-Z]{" + count + "}";
        if (count <= 0) {
            expression = "[a-zA-Z]+";
        }
        CharSequence inputStr = letter;

        Pattern pattern = Pattern.compile(expression);

        Matcher matcher = pattern.matcher(inputStr);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }

    public static boolean isLetterAndDigit(String letterAndDigit, int count) {
        boolean isValid = false;

        String expression = "[a-zA-Z_0-9]{" + count + "}";
        if (count <= 0) {
            expression = "[a-zA-Z_0-9]+";
        }
        CharSequence inputStr = letterAndDigit;
        Pattern pattern = Pattern.compile(expression);
        Matcher matcher = pattern.matcher(inputStr);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }

    public static boolean isBeforeNow(String date) {
        //  System.out.println(date);
        java.util.Date nowdate = new java.util.Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.CHINA);
        try {
            Date d = sdf.parse(date);
            if (d.before(nowdate))
                return true;
            else
                return false;
        } catch (ParseException e) {
            e.printStackTrace();
            return true;
        }

    }

    public static boolean compareDate(String DATE1, String DATE2) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date dt1 = df.parse(DATE1);
            Date dt2 = df.parse(DATE2);
            if (dt1.getTime() > dt2.getTime()) {
                return false;
            } else if (dt1.getTime() < dt2.getTime()) {
                return true;
            } else {
                return false;
            }
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
    }

    public static boolean isValidDate(String str,String format) {
        boolean convertSuccess = true;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        try {
            simpleDateFormat.setLenient(false);
            simpleDateFormat.parse(str);
        } catch (ParseException e) {
            convertSuccess = false;
        }
        return convertSuccess;
    }

}
