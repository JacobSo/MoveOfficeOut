package com.zuni.library.utils;

import android.content.Context;
import android.util.Log;

import com.zuni.library.listener.zNetworkExceptionListener;
import com.zuni.library.listener.zOnJsonListener;

import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Jacob So on 2015/12/4.
 */
public class zJsonUtil {


    private static final String DEBUG_TAG = "zJsonUtil";
    JSONObject rootJsonObject;
    JSONArray rootJsonArray;
    zNetUtil fdNetUtil;
    zOnJsonListener fdOnJsonListener;

    public Object parseJson(Context context, String[] keys, String[] values, String url, Integer connectionTime, zNetworkExceptionListener fdNetworkExceptionListener) {
        String json = getJsonString(context, keys, values, url, connectionTime, fdNetworkExceptionListener);
        System.out.println("json:::" + json);
        switch (getRootType(json)) {
            case 1:
                return parseJSONObject(this.rootJsonObject);
            case 2:
                return parseJSONArray(this.rootJsonArray);
            case 3:
                return null;
        }
        return null;
    }

    public Object parseJson(String json) {
        System.out.println("json:::" + json);
        switch (getRootType(json)) {
            case 1:
                return parseJSONObject(this.rootJsonObject);
            case 2:
                return parseJSONArray(this.rootJsonArray);
            case 3:
                return null;
        }
        return null;
    }

    private String getJsonString(Context context, String[] keys, String[] values, String url, Integer connectionTime, zNetworkExceptionListener fdNetworkExceptionListener) {
        String json = "zJsonUtil";
        this.fdNetUtil = new zNetUtil();
        String result = null;
        if ((keys == null) || (values == null)) {
            result = this.fdNetUtil.getString(context, url, connectionTime, fdNetworkExceptionListener);
        } else {
            result = this.fdNetUtil.postDataForString(context, keys, values, url, connectionTime, fdNetworkExceptionListener);
        }
        if (result != null) {
            json = result;
        }
        return json;
    }

    private int getRootType(String json) {
        int flag = 1;
        try {
            this.rootJsonObject = new JSONObject(json);
            flag = 1;
        } catch (JSONException e) {
            e.printStackTrace();
            Log.e("zJsonUtil", "not JSONObject");
            try {
                this.rootJsonArray = new JSONArray(json);
                flag = 2;
            } catch (JSONException e1) {
                e1.printStackTrace();
                Log.e("zJsonUtil", "not JSON format String");
                if (this.fdOnJsonListener != null) {
                    this.fdOnJsonListener.onJsonStringError(json);
                }
                flag = 3;
            }
        }
        return flag;
    }

    private ArrayList<Object> parseJSONArray(JSONArray jsonArray) {
        ArrayList<Object> list = new ArrayList();
        int length = jsonArray.length();
        for (int i = 0; i < length; i++) {
            try {
                Object value = jsonArray.get(i);
                if ((value instanceof JSONArray)) {
                    list.add(parseJSONArray((JSONArray) value));
                } else if ((value instanceof JSONObject)) {
                    list.add(parseJSONObject((JSONObject) value));
                } else if (value != null) {
                    list.add(value);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return list;
    }

    private HashMap<String, Object> parseJSONObject(JSONObject jsonObject) {
        HashMap<String, Object> map = new HashMap();
        Iterator iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            Object next = iterator.next();
            try {
                String key = next.toString();

                Object value = jsonObject.get(key);
                if ((value instanceof JSONObject)) {
                    map.put(key, parseJSONObject((JSONObject) value));
                } else if ((value instanceof JSONArray)) {
                    map.put(key, parseJSONArray((JSONArray) value));
                } else if ((value == null) || (value.equals("null")) || (value.equals("null"))) {
                    map.put(key, "");
                } else {
                    map.put(key, value);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return map;
    }

    public void closeConnection() {
        if (this.fdNetUtil != null) {
            this.fdNetUtil.closeConnection();
        }
    }

    public void setzOnJsonListener(zOnJsonListener fdOnJsonListener) {
        this.fdOnJsonListener = fdOnJsonListener;
    }
}

