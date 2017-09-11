package com.zuni.library.utils;

/**
 * Created by Jacob So on 2015/12/4.
 */

import android.content.Context;
import android.support.design.widget.Snackbar;
import android.view.View;
import android.widget.Toast;

public class zToastUtil {
    public static void showSnack(View v,String str){
        Snackbar.make(v, str, Snackbar.LENGTH_LONG).show();
    }

    public static void showSnackWithButton(View v, String str, View.OnClickListener listener){
        Snackbar.make(v, str, Snackbar.LENGTH_LONG).setAction("确认", listener).show();
    }
    public static void show(Context context, Object message) {
        Toast.makeText(context, parseString(context, message), Toast.LENGTH_LONG).show();
    }

    public static String parseString(Context context, Object obj) {
        if (obj != null) {
            if ((obj instanceof String)) {
                return obj.toString();
            }
            if ((obj instanceof Integer)) {
                return context.getString(((Integer) obj).intValue());
            }
        }
        return null;
    }
}

