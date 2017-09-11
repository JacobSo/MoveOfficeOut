package com.zuni.library.utils;

/**
 * Created by Jacob So on 2015/12/4.
 */

import android.content.Context;
import android.content.SharedPreferences;

public class zSharedPreferencesUtil {
    public static SharedPreferences getSharedPreferences(Context context, String sp_name) {
        return context.getSharedPreferences(sp_name, 0);
    }

    public static SharedPreferences.Editor getEditor(Context context, String sp_name) {
        return getSharedPreferences(context, sp_name).edit();
    }

    public static void clear(Context context, String sp_name) {
        SharedPreferences.Editor editor = getSharedPreferences(context, sp_name).edit();
        editor.clear();
        editor.commit();
    }

    public static void save(Context context, String sp_name, String key, String value) {
        SharedPreferences.Editor editor = getSharedPreferences(context, sp_name).edit();
        editor.putString(key, value);
        editor.commit();
    }

    public static String get(Context context, String sp_name, String key) {
        return getSharedPreferences(context, sp_name).getString(key, "");
    }
}
