package com.zuni.library.listener;

import android.graphics.Bitmap;
import android.widget.ImageView;
/**
 * Created by Jacob So on 2015/12/4.
 */

public interface zOnImageDownload {
	 void onDownloadSucc(Bitmap bitmap, ImageView imageView, String path);
	// void onDownloadSucc(Bitmap bitmap, ImageView imageView);
}
