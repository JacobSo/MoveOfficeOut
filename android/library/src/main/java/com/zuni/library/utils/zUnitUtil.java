package com.zuni.library.utils;

import android.content.Context;
import android.content.res.Resources;
import android.util.DisplayMetrics;

/**
 * Created by Jacob So on 2015/12/4.
 */
public class zUnitUtil {
    public static int dp2px(Context context, float dipValue) {
        if (context != null) {
            if (-1.0F == dipValue) {
                return -1;
            }
            if (-2.0F == dipValue) {
                return -2;
            }
            float scale = context.getResources().getDisplayMetrics().density;
            return (int) (dipValue * scale + 0.5F);
        }
        return (int) dipValue;
    }

    public static int px2sp(float pxValue, Context context) {
        return (int) (pxValue / context.getResources().getDisplayMetrics().scaledDensity + 0.5F);
    }

    public static int sp2px(float spValue, Context context) {
        return (int) (spValue * context.getResources().getDisplayMetrics().scaledDensity + 0.5F);
    }

    public static int px2dp(Context context, float pxValue) {
        if (context != null) {
            float scale = context.getResources().getDisplayMetrics().density;
            return (int) (pxValue / scale + 0.5F);
        }
        return (int) pxValue;
    }
}

