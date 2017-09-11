package com.zuni.library.utils;

import android.app.Activity;
import android.content.Context;

/**
 * Created by Jacob So on 2015/12/4.
 */
public class zDisplayUtil {
    private static android.util.DisplayMetrics dm;

    private static android.util.DisplayMetrics display(Context context) {

        dm = new android.util.DisplayMetrics();
        ((Activity) context).getWindowManager().getDefaultDisplay().getMetrics(dm);

        return dm;
    }

    public static int getWidthPixel(Context context) {
        if (dm == null) {
            dm = display(context);
        }
        return dm.widthPixels;
    }

    public static int getHeightPixel(Context context) {
        if (dm == null) {
            dm = display(context);
        }
        return dm.heightPixels;
    }
    public static int getDpi(Context context) {
        if (dm == null) {
            dm = display(context);
        }
        return dm.densityDpi;
    }

    public static float getXDpi(Context context) {
        if (dm == null) {
            dm = display(context);
        }
        return dm.xdpi;
    }
    public static float getYDpi(Context context) {
        if (dm == null) {
            dm = display(context);
        }
        return dm.ydpi;
    }
}
