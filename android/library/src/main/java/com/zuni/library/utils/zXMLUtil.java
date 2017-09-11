package com.zuni.library.utils;

/**
 * Created by Jacob So on 2015/12/4.
 */

import android.content.Context;
import android.util.Xml;

import com.zuni.library.listener.zNetworkExceptionListener;

import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.HashMap;

import org.xmlpull.v1.XmlPullParser;

public class zXMLUtil {
    private static XmlPullParser parser1;
    private static boolean flag;
    private static boolean flag_only_one;
    static HttpURLConnection conn;

    public static Object parseXMLForWay1(Context context, String url, String[] postKeys, String[] postValues, ArrayList<Object> tagNameList, boolean isHaveSubTag, Integer connectionTime, zNetworkExceptionListener fdNetworkExceptionListener) {
        Object obj = null;

        parser1 = getXmlPullParser(context, url, postKeys, postValues, connectionTime, fdNetworkExceptionListener);
        if (parser1 == null) {
            return null;
        }
        switch (getHowmanyLevel(tagNameList)) {
            case 1:
                obj = parseLevel1(url, tagNameList.get(0).toString(), Boolean.valueOf(isHaveSubTag));
                break;
            case 2:
                obj = parseLevel2ForWay1(url, tagNameList.get(0).toString(), tagNameList.get(1).toString(), Boolean.valueOf(isHaveSubTag));
                break;
            case 3:
                Object temObj = tagNameList.get(2);
                String[] thirdLevelTags = null;
                if (isString(temObj)) {
                    thirdLevelTags = new String[]{temObj.toString()};
                } else {
                    thirdLevelTags = arrayList2StrArray((ArrayList) temObj);
                }
                obj = parseLevel3ForWay1(url, tagNameList.get(0).toString(), tagNameList.get(1).toString(), thirdLevelTags, Boolean.valueOf(isHaveSubTag));
                break;
            case 4:
                Object temObj1 = tagNameList.get(2);
                String[] thirdLevelTags1 = null;
                if (isString(temObj1)) {
                    thirdLevelTags1 = new String[]{temObj1.toString()};
                } else {
                    thirdLevelTags1 = arrayList2StrArray((ArrayList) temObj1);
                }
                obj = parseLevel4ForWay1(url, tagNameList.get(0).toString(), tagNameList.get(1).toString(), thirdLevelTags1, tagNameList.get(3).toString(),
                        Boolean.valueOf(isHaveSubTag));
        }
        closeConnection();
        return obj;
    }

    public static Object parseXMLForWay2(Context context, String url, String[] postKeys, String[] postValues, ArrayList<Object> tagNameList, boolean isHaveSubTag, Integer connectionTime, zNetworkExceptionListener fdNetworkExceptionListener) {
        Object obj = null;

        parser1 = getXmlPullParser(context, url, postKeys, postValues, connectionTime, fdNetworkExceptionListener);
        if (parser1 == null) {
            return null;
        }
        switch (getHowmanyLevel(tagNameList)) {
            case 1:
                obj = parseLevel1(url, tagNameList.get(0).toString(), Boolean.valueOf(isHaveSubTag));
                break;
            case 2:
                Object temObj = tagNameList.get(1);
                String[] secondLevelTags = null;
                if (isString(temObj)) {
                    secondLevelTags = new String[]{temObj.toString()};
                } else {
                    secondLevelTags = arrayList2StrArray((ArrayList) temObj);
                }
                obj = parseLevel2ForWay2(url, tagNameList.get(0).toString(), secondLevelTags);
                break;
            case 3:
                Object temObj1 = tagNameList.get(1);
                String[] secondLevelTags1 = null;
                if (isString(temObj1)) {
                    secondLevelTags1 = new String[]{temObj1.toString()};
                } else {
                    secondLevelTags1 = arrayList2StrArray((ArrayList) temObj1);
                }
                obj = parseLevel3ForWay2(url, tagNameList.get(0).toString(), secondLevelTags1, tagNameList.get(2).toString(), Boolean.valueOf(isHaveSubTag));
        }
        closeConnection();
        return obj;
    }

    private static boolean isString(Object obj) {
        return obj instanceof String;
    }

    private static String[] arrayList2StrArray(ArrayList<String> list) {
        String[] strs = new String[list.size()];
        for (int i = 0; i < list.size(); i++) {
            strs[i] = ((String) list.get(i));
        }
        return strs;
    }

    private static int getHowmanyLevel(ArrayList<Object> tagNameList) {
        return tagNameList.size();
    }

    public static XmlPullParser getXmlPullParser(Context context, String url, String[] postKeys, String[] postValues, Integer connectionTime, zNetworkExceptionListener fdNetworkExceptionListener) {
        if ((url != null) && (!"".equals(url.trim()))) {
            XmlPullParser parser = null;
            try {
                if ((postKeys != null) && (postValues != null)) {
                    zNetUtil fdNetUtil = new zNetUtil();
                    conn = fdNetUtil.postDataForHttpURLConnection(context, postKeys, postValues, url, connectionTime, fdNetworkExceptionListener);
                } else {
                    zNetUtil fdNetUtil = new zNetUtil();
                    conn = fdNetUtil.getHttpURLConnection(context, url, connectionTime, fdNetworkExceptionListener);
                }
                if (conn != null) {
                    parser = Xml.newPullParser();

                    parser.setInput(zStreamOperateUtil.inputStream2InputStream(conn.getInputStream()), "utf-8");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return parser;
        }
        return null;
    }

    private static Object parseLevel1(String url, String firstLevelTag, Boolean isHaveSubTagForFirst) {
        String result = "";
        HashMap<String, Object> map = null;
        try {
            XmlPullParser parser = parser1;
            int eventType = parser.getEventType();
            String startTag = null;
            if (isHaveSubTagForFirst.booleanValue()) {
                map = new HashMap();
                while (eventType != 1) {
                    if (eventType == 2) {
                        startTag = parser.getName();
                    } else if (eventType == 4) {
                        String text = parser.getText();
                        if ((startTag != null) && (!firstLevelTag.trim().equals(startTag)) && (map != null)) {
                            map.put(startTag, text);
                        }
                    } else if (eventType == 3) {
                        startTag = null;
                    }
                    eventType = parser.next();
                }
            } else {
                while (eventType != 1) {
                    if (eventType == 4) {
                        String text = parser.getText();
                        result = text;
                    }
                    eventType = parser.next();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (isHaveSubTagForFirst.booleanValue()) {
            return map;
        }
        return result;
    }

    private static Object parseLevel2ForWay1(String url, String firstLevelTag, String secondLevelTag, Boolean isHaveSubTagForSecond) {
        ArrayList<String> list1 = new ArrayList();
        ArrayList<HashMap<String, String>> list2 = new ArrayList();
        HashMap<String, String> map = null;
        try {
            XmlPullParser parser = parser1;

            int eventType = parser.getEventType();
            String startTag = null;
            while (eventType != 1) {
                if (isHaveSubTagForSecond.booleanValue()) {
                    if (eventType == 2) {
                        startTag = parser.getName();
                        if (secondLevelTag.trim().equals(startTag)) {
                            map = new HashMap();
                        }
                    } else if (eventType == 4) {
                        String text = parser.getText();
                        if ((startTag != null) && (!firstLevelTag.trim().equals(startTag)) && (!secondLevelTag.trim().equals(startTag)) && (map != null)) {
                            map.put(startTag, text);
                        }
                    } else if (eventType == 3) {
                        startTag = null;
                        if ((parser.getName().equals(secondLevelTag.trim())) && (list2 != null)) {
                            list2.add(map);
                        }
                    }
                } else if (eventType == 2) {
                    startTag = parser.getName();
                } else if (eventType == 4) {
                    String text = parser.getText();
                    if ((startTag != null) && (startTag.equals(secondLevelTag.trim())) && (list1 != null)) {
                        list1.add(text);
                    }
                } else if (eventType == 3) {
                    startTag = null;
                }
                eventType = parser.next();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (isHaveSubTagForSecond.booleanValue()) {
            return list2;
        }
        return list1;
    }

    private static ArrayList<Object> parseLevel3ForWay1(String url, String firstLevelTag, String secondLevelTag, String[] thirdLevelTags, Boolean isHaveSubTagForThird) {
        ArrayList<Object> list = new ArrayList();
        HashMap<String, Object> map = null;
        ArrayList<Object> list1 = null;
        int length = thirdLevelTags.length;
        try {
            XmlPullParser parser = parser1;
            int eventType = parser.getEventType();
            String startTag = null;

            String endTag = null;
            while (eventType != 1) {
                if (eventType == 2) {
                    startTag = parser.getName();
                    if (startTag.equals(secondLevelTag.trim())) {
                        map = new HashMap();
                    }
                    for (int i = 0; i < length; i++) {
                        if (startTag.equals(thirdLevelTags[i].trim())) {
                            list1 = new ArrayList();
                            flag = true;
                        }
                    }
                } else if (eventType == 4) {
                    String text = parser.getText();

                    flag_only_one = true;
                    for (int i = 0; i < length; i++) {
                        if ((flag) && (startTag != null) && (!startTag.equals(thirdLevelTags[i]))) {
                            if ((flag_only_one) && (list1 != null)) {
                                list1.add(text);
                                flag_only_one = false;
                            }
                        } else if ((startTag != null) && (startTag != firstLevelTag.trim()) && (startTag != secondLevelTag) &&
                                (!startTag.equals(thirdLevelTags[i].trim())) && (map != null)) {
                            map.put(startTag, text);
                        }
                    }
                } else if (eventType == 3) {
                    startTag = null;
                    if ((parser.getName().equals(secondLevelTag.trim())) && (list != null)) {
                        list.add(map);
                    }
                    for (int i = 0; i < length; i++) {
                        if ((parser.getName().equals(thirdLevelTags[i].trim())) && (map != null)) {
                            map.put(thirdLevelTags[i].trim(), list1);
                            flag = false;
                        }
                    }
                }
                eventType = parser.next();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    private static ArrayList<Object> parseLevel4ForWay1(String url, String firstLevelTag, String secondLevelTag, String[] thirdLevelTags, String fourthLevelTag, Boolean isHaveSubTagForFourth) {
        ArrayList<Object> list = new ArrayList();
        HashMap<String, Object> map = null;
        ArrayList<Object> list1 = null;
        HashMap<String, String> map1 = null;
        int length = thirdLevelTags.length;
        try {
            XmlPullParser parser = parser1;
            int eventType = parser.getEventType();
            String startTag = null;
            String endTag = null;
            if (isHaveSubTagForFourth.booleanValue()) {
                while (eventType != 1) {
                    if (eventType == 2) {
                        startTag = parser.getName();
                        if (startTag.equals(secondLevelTag.trim())) {
                            map = new HashMap();
                        } else if (startTag.equals(fourthLevelTag.trim())) {
                            map1 = new HashMap();
                        }
                        for (int i = 0; i < length; i++) {
                            if (startTag.equals(thirdLevelTags[i].trim())) {
                                list1 = new ArrayList();
                                flag = true;
                            }
                        }
                    } else if (eventType == 4) {
                        String text = parser.getText();
                        for (int i = 0; i < length; i++) {
                            if ((flag) && (startTag != null) && (!startTag.equals(thirdLevelTags[i])) && (map1 != null)) {
                                map1.put(startTag, text);
                            } else if ((startTag != null) && (!firstLevelTag.trim().equals(startTag)) && (!secondLevelTag.trim().equals(startTag)) &&
                                    (!thirdLevelTags[i].trim().equals(startTag)) && (map != null)) {
                                map.put(startTag, text);
                            }
                        }
                    } else if (eventType == 3) {
                        startTag = null;
                        if ((parser.getName().equals(secondLevelTag.trim())) && (list != null)) {
                            list.add(map);
                        } else if ((parser.getName().equals(fourthLevelTag.trim())) && (list1 != null)) {
                            list1.add(map1);
                        }
                        for (int i = 0; i < length; i++) {
                            if ((parser.getName().equals(thirdLevelTags[i].trim())) && (map != null)) {
                                map.put(thirdLevelTags[i].trim(), list1);
                                flag = false;
                            }
                        }
                    }
                    eventType = parser.next();
                }
            } else {
                while (eventType != 1) {
                    if (eventType == 2) {
                        startTag = parser.getName();
                        if (startTag.equals(secondLevelTag.trim())) {
                            map = new HashMap();
                        } else if (startTag.equals(fourthLevelTag.trim())) {
                            flag = true;
                        }
                        for (int i = 0; i < length; i++) {
                            if (startTag.equals(thirdLevelTags[i].trim())) {
                                list1 = new ArrayList();
                            }
                        }
                    } else if (eventType == 4) {
                        String text = parser.getText();

                        flag_only_one = true;
                        for (int i = 0; i < length; i++) {
                            if ((startTag != null) && (flag)) {
                                if ((flag_only_one) && (list1 != null)) {
                                    list1.add(text);
                                    flag_only_one = false;
                                }
                            } else if ((startTag != null) && (!firstLevelTag.trim().equals(startTag)) && (!secondLevelTag.equals(startTag)) &&
                                    (!thirdLevelTags[i].trim().equals(startTag)) && (map != null)) {
                                map.put(startTag, text);
                            }
                        }
                    } else if (eventType == 3) {
                        endTag = parser.getName();
                        startTag = null;
                        if ((endTag.equals(secondLevelTag.trim())) && (list != null)) {
                            list.add(map);
                        } else if (endTag.equals(fourthLevelTag.trim())) {
                            flag = false;
                        }
                        for (int i = 0; i < length; i++) {
                            if ((endTag.equals(thirdLevelTags[i].trim())) && (map != null)) {
                                map.put(thirdLevelTags[i].trim(), list1);
                            }
                        }
                    }
                    eventType = parser.next();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    private static Object parseLevel2ForWay2(String url, String firstLevelTag, String[] secondLevelTags) {
        HashMap<String, Object> map = new HashMap();
        ArrayList<Object> list = null;
        int length = secondLevelTags.length;
        try {
            XmlPullParser parser = parser1;
            int eventType = parser.getEventType();
            String startTag = null;
            while (eventType != 1) {
                if (eventType == 2) {
                    startTag = parser.getName();
                    for (int i = 0; i < length; i++) {
                        if (startTag.equals(secondLevelTags[i].trim())) {
                            list = new ArrayList();
                            flag = true;
                        }
                    }
                } else if (eventType == 4) {
                    String text = parser.getText();
                    if ((startTag != null) && (flag) && (list != null)) {
                        list.add(text);
                    }
                } else if (eventType == 3) {
                    startTag = null;
                    for (int i = 0; i < length; i++) {
                        if ((parser.getName().equals(secondLevelTags[i].trim())) && (map != null)) {
                            map.put(secondLevelTags[i].trim(), list);
                            flag = false;
                        }
                    }
                }
                eventType = parser.next();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }

    private static Object parseLevel3ForWay2(String url, String firstLevelTag, String[] secondLevelTags, String thirdLevelTag, Boolean isHaveSubTagForThird) {
        HashMap<String, Object> map = new HashMap();
        ArrayList<Object> list = null;
        HashMap<String, String> map1 = null;
        int length = secondLevelTags.length;
        try {
            XmlPullParser parser = parser1;
            int eventType = parser.getEventType();
            String startTag = null;
            if (isHaveSubTagForThird.booleanValue()) {
                while (eventType != 1) {
                    if (eventType == 2) {
                        startTag = parser.getName();
                        for (int i = 0; i < length; i++) {
                            if (startTag.equals(secondLevelTags[i].trim())) {
                                list = new ArrayList();
                            }
                        }
                        if (startTag.equals(thirdLevelTag)) {
                            map1 = new HashMap();
                            flag = true;
                        }
                    } else if (eventType == 4) {
                        String text = parser.getText();
                        for (int i = 0; i < length; i++) {
                            if ((flag) && (startTag != null) && (startTag != thirdLevelTag) && (map1 != null)) {
                                map1.put(startTag, text);
                            } else if ((startTag != null) && (!startTag.equals(firstLevelTag.trim())) && (!startTag.equals(secondLevelTags[i].trim())) &&
                                    (!startTag.equals(thirdLevelTag.trim())) && (map != null)) {
                                map.put(startTag, text);
                            }
                        }
                    } else if (eventType == 3) {
                        startTag = null;
                        flag_only_one = true;
                        for (int i = 0; i < length; i++) {
                            if ((parser.getName().equals(secondLevelTags[i].trim())) && (map != null)) {
                                map.put(parser.getName(), list);
                            } else if (parser.getName().equals(thirdLevelTag.trim())) {
                                if ((flag_only_one) && (list != null)) {
                                    list.add(map1);
                                    flag_only_one = false;
                                }
                                flag = false;
                            }
                        }
                    }
                    eventType = parser.next();
                }
            } else {
                while (eventType != 1) {
                    if (eventType == 2) {
                        startTag = parser.getName();
                        if (startTag.equals(thirdLevelTag.trim())) {
                            flag = true;
                        }
                        for (int i = 0; i < length; i++) {
                            if (startTag.equals(secondLevelTags[i].trim())) {
                                list = new ArrayList();
                            }
                        }
                    } else if (eventType == 4) {
                        String text = parser.getText();
                        if ((startTag != null) && (flag) && (list != null)) {
                            list.add(text);
                        }
                        for (int i = 0; i < length; i++) {
                            if ((startTag != null) && (!startTag.equals(firstLevelTag.trim())) && (!startTag.equals(secondLevelTags[i].trim())) &&
                                    (!startTag.equals(thirdLevelTag.trim())) && (map != null)) {
                                map.put(startTag, text);
                            }
                        }
                    } else if (eventType == 3) {
                        startTag = null;
                        for (int i = 0; i < length; i++) {
                            if ((parser.getName().equals(secondLevelTags[i].trim())) && (map != null)) {
                                map.put(secondLevelTags[i].trim(), list);
                            } else if (parser.getName().equals(thirdLevelTag.trim())) {
                                flag = false;
                            }
                        }
                    }
                    eventType = parser.next();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }

    public static void closeConnection() {
        if (conn != null) {
            conn.disconnect();
            conn = null;
        }
    }
}
