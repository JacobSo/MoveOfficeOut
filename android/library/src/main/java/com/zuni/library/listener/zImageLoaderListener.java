package com.zuni.library.listener;

import android.graphics.Bitmap;
import android.view.View;

/**
 * Created by Jacob So on 2015/12/4.
 */
public interface zImageLoaderListener {
    void bitmap(Bitmap paramBitmap, View paramView);

     void bitmap(Bitmap paramBitmap, String paramString);
}
