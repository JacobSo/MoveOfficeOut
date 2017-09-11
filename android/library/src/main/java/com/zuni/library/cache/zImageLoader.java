package com.zuni.library.cache;

/**
 * Created by Jacob So on 2015/12/4.
 */

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import com.zuni.library.listener.zImageLoaderListener;
import com.zuni.library.utils.zBitmapUtil;
import com.zuni.library.utils.zFileUtil;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.WeakHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class zImageLoader {
    private static zImageMemoryCache memoryCache;
    private static ExecutorService executorService;
    zImageFileCache fileCache;
    Map<View, String> views = Collections.synchronizedMap(new WeakHashMap());
    ArrayList<String> urlORpathList = new ArrayList();
    zImageLoaderListener fdImageLoaderListener;
    Context context;
    Integer defaultImage = null;
    Bitmap defaultBitmap;

    private zImageLoader(Context context) {
        this.context = context;
    }

    public static zImageLoader getInstance(Context context) {
        if (memoryCache == null) {
            memoryCache = new zImageMemoryCache();
        }
        if (executorService == null) {
            executorService = Executors.newFixedThreadPool(10);
        }
        return new zImageLoader(context);
    }

    public static zImageMemoryCache getzImageMemoryCache() {
        if (memoryCache == null) {
            memoryCache = new zImageMemoryCache();
        }
        return memoryCache;
    }

    public void setzImageLoaderListener(zImageLoaderListener fdImageLoaderListener) {
        this.fdImageLoaderListener = fdImageLoaderListener;
    }

    String imageSubDirInSDCard = "z";

    public void setImageSubDirInSDCard(String imageSubDirInSDCard) {
        this.imageSubDirInSDCard = imageSubDirInSDCard;
        this.fileCache = new zImageFileCache(this.context, imageSubDirInSDCard);
    }

    int imageUpperLimitPix = 200;
    private boolean isRound;

    public void setImageUpperLimitPix(int imageUpperLimitPix) {
        this.imageUpperLimitPix = imageUpperLimitPix;
    }

    public void setDefaultImage(int defaultImage) {
        this.defaultImage = Integer.valueOf(defaultImage);
        if (this.isRound) {
            this.defaultBitmap = zBitmapUtil.createRoundCornerBitmap(BitmapFactory.decodeResource(this.context.getResources(), defaultImage), this.pixels);
        } else if (this.isFrame) {
            this.defaultBitmap = zBitmapUtil.createFrameBitmap(BitmapFactory.decodeResource(this.context.getResources(), defaultImage), this.frameRes, this.context);
        } else if (this.isReflected) {
            this.defaultBitmap = zBitmapUtil.createReflectedBitmap(BitmapFactory.decodeResource(this.context.getResources(), defaultImage), Integer.valueOf(this.instanceColor));
        } else {
            this.defaultBitmap = BitmapFactory.decodeResource(this.context.getResources(), defaultImage);
        }
    }

    private int pixels = 0;
    int instanceColor;
    boolean isReflected;
    int[] frameRes;
    boolean isFrame;
    boolean isBitmap;

    public void setRound(int pixels) {
        this.isRound = true;
        this.pixels = pixels;
        if (this.defaultImage != null) {
            this.defaultBitmap = zBitmapUtil.createRoundCornerBitmap(BitmapFactory.decodeResource(this.context.getResources(), this.defaultImage.intValue()), pixels);
        }
    }

    public void setReflected(int instanceColor) {
        this.isReflected = true;
        this.instanceColor = instanceColor;
        if (this.defaultImage != null) {
            this.defaultBitmap = zBitmapUtil.createReflectedBitmap(BitmapFactory.decodeResource(this.context.getResources(), this.defaultImage.intValue()), Integer.valueOf(instanceColor));
        }
    }

    public void setFrame(int[] frameRes) {
        this.frameRes = frameRes;
        this.isFrame = true;
        if (this.defaultImage != null) {
            this.defaultBitmap = zBitmapUtil.createFrameBitmap(BitmapFactory.decodeResource(this.context.getResources(), this.defaultImage.intValue()), frameRes, this.context);
        }
    }

    public void setBitmapShow(boolean isBitmap) {
        this.isBitmap = isBitmap;
    }

    public void displayImage(String url_OR_filepath, View view) {
        if (this.fileCache == null) {
            Log.e("FastDevelop", "file cache is null!");
            return;
        }
        view.setTag(url_OR_filepath);

        this.views.put(view, url_OR_filepath);

        Bitmap bitmap = memoryCache.get(url_OR_filepath);
        if (bitmap != null) {
            if (this.fdImageLoaderListener != null) {
                this.fdImageLoaderListener.bitmap(bitmap, view);
            } else if ((this.isBitmap) && ((view instanceof ImageView))) {
                ((ImageView) view).setImageBitmap(bitmap);
            } else {
                view.setBackgroundDrawable(zBitmapUtil.bitmap2drawable(bitmap));
            }
        } else {
            if (this.defaultImage != null) {
                if ((this.isBitmap) && ((view instanceof ImageView))) {
                    if ((this.isReflected) || (this.isFrame) || (this.isRound)) {
                        ((ImageView) view).setImageBitmap(this.defaultBitmap);
                    } else {
                        ((ImageView) view).setImageResource(this.defaultImage.intValue());
                    }
                } else if ((this.isReflected) || (this.isFrame) || (this.isRound)) {
                    view.setBackgroundDrawable(zBitmapUtil.bitmap2drawable(this.defaultBitmap));
                } else {
                    view.setBackgroundResource(this.defaultImage.intValue());
                }
            }
            queuePhoto(url_OR_filepath, view);
        }
    }

    public void displayDefaultImage(View view) {
        if (this.defaultImage != null) {
            if ((this.isBitmap) && ((view instanceof ImageView))) {
                ((ImageView) view).setImageBitmap(this.defaultBitmap);
            } else {
                view.setBackgroundResource(this.defaultImage.intValue());
            }
        } else if ((this.isBitmap) && ((view instanceof ImageView))) {
            ((ImageView) view).setImageBitmap(null);
        } else {
            view.setBackgroundDrawable(null);
        }
    }

    private void queuePhoto(String url, View view) {
        PhotoToLoad p = new PhotoToLoad(url, view);
        executorService.submit(new PhotosLoader(p));
    }

    public void displayBitmap(String url_OR_filepath) {
        Bitmap bitmap = memoryCache.get(url_OR_filepath);
        if (bitmap != null) {
            if (this.fdImageLoaderListener != null) {
                this.fdImageLoaderListener.bitmap(bitmap, url_OR_filepath);
            }
            return;
        }
        executorService.submit(new PhotosLoaderForNoView(url_OR_filepath));
    }

    public String getPath(String imageUrl) {
        String name = String.valueOf(imageUrl.hashCode());

        File file = new File(zFileUtil.getFileCacheDir(this.context, this.imageSubDirInSDCard), name);
        return file.getAbsolutePath();
    }

    private Bitmap getBitmap(String url, View view) {
        File f = this.fileCache.getFile(url);

        Bitmap b = decodeFile(f);
        if (b != null) {
            if (this.isFrame) {
                return zBitmapUtil.createFrameBitmap(b, this.frameRes, this.context);
            }
            if (this.isReflected) {
                return zBitmapUtil.createReflectedBitmap(b, Integer.valueOf(this.instanceColor));
            }
            if (this.isRound) {
                return zBitmapUtil.createRoundCornerBitmap(b, this.pixels);
            }
            return b;
        }
        if (url.startsWith("http")) {
            if (this.urlORpathList.contains(url)) {
                return null;
            }
            this.urlORpathList.add(url);
            try {
                Bitmap bitmap = null;
                URL imageUrl = new URL(url);
                HttpURLConnection conn = (HttpURLConnection) imageUrl.openConnection();
                conn.setConnectTimeout(30000);
                conn.setReadTimeout(30000);

                InputStream is = conn.getInputStream();
                OutputStream os = new FileOutputStream(f);
                CopyStream(is, os);
                os.close();
                is.close();
                conn.disconnect();
                if (this.urlORpathList.contains(url)) {
                    this.urlORpathList.remove(url);
                }
                bitmap = decodeFile(f);
                if (bitmap != null) {
                    if (this.isFrame) {
                        return zBitmapUtil.createFrameBitmap(bitmap, this.frameRes, this.context);
                    }
                    if (this.isReflected) {
                        return zBitmapUtil.createReflectedBitmap(bitmap, Integer.valueOf(this.instanceColor));
                    }
                    if (this.isRound) {
                        return zBitmapUtil.createRoundCornerBitmap(bitmap, this.pixels);
                    }
                    return bitmap;
                }
            } catch (Exception ex) {
                ex.printStackTrace();
                if (view != null) {
                    displayDefaultImage(view);
                }
                return null;
            }
        }
        return null;
    }

    private Bitmap decodeFile(File f) {
        try {
            BitmapFactory.Options o = new BitmapFactory.Options();
            o.inJustDecodeBounds = true;
            BitmapFactory.decodeStream(new FileInputStream(f), null, o);

            int width_tmp = o.outWidth;
            int height_tmp = o.outHeight;
            int scale = 1;
            while ((width_tmp / 2 >= this.imageUpperLimitPix) || (height_tmp / 2 >= this.imageUpperLimitPix)) {
                width_tmp /= 2;
                height_tmp /= 2;
                scale *= 2;
            }
            BitmapFactory.Options o2 = new BitmapFactory.Options();
            o2.inSampleSize = scale;
            return BitmapFactory.decodeStream(new FileInputStream(f), null, o2);
        } catch (FileNotFoundException localFileNotFoundException) {
        }
        return null;
    }

    private class PhotoToLoad {
        public String url;
        public View view;

        public PhotoToLoad(String u, View i) {
            this.url = u;
            this.view = i;
        }
    }

    class PhotosLoader implements Runnable {
        zImageLoader.PhotoToLoad photoToLoad;

        PhotosLoader(zImageLoader.PhotoToLoad photoToLoad) {
            this.photoToLoad = photoToLoad;
        }

        public void run() {
            if (zImageLoader.this.imageViewReused(this.photoToLoad)) {
                return;
            }
            Bitmap bmp = zImageLoader.this.getBitmap(this.photoToLoad.url, this.photoToLoad.view);
            zImageLoader.memoryCache.put(this.photoToLoad.url, bmp);
            if (zImageLoader.this.imageViewReused(this.photoToLoad)) {
                return;
            }
            zImageLoader.BitmapDisplayer bd = new zImageLoader.BitmapDisplayer(bmp, this.photoToLoad);

            Activity a = (Activity) this.photoToLoad.view.getContext();
            a.runOnUiThread(bd);
        }
    }

    class PhotosLoaderForNoView
            implements Runnable {
        String url_OR_filepath;

        public PhotosLoaderForNoView(String url_OR_filepath) {
            this.url_OR_filepath = url_OR_filepath;
        }

        public void run() {
            Bitmap bmp = zImageLoader.this.getBitmap(this.url_OR_filepath, null);
            if ((bmp != null) &&
                    (zImageLoader.this.fdImageLoaderListener != null)) {
                zImageLoader.this.fdImageLoaderListener.bitmap(bmp, this.url_OR_filepath);
            }
        }
    }

    boolean imageViewReused(PhotoToLoad photoToLoad) {
        String tag = (String) this.views.get(photoToLoad.view);
        if ((tag == null) || (!tag.equals(photoToLoad.url))) {
            return true;
        }
        return false;
    }

    class BitmapDisplayer
            implements Runnable {
        Bitmap bitmap;
        zImageLoader.PhotoToLoad photoToLoad;

        public BitmapDisplayer(Bitmap b, zImageLoader.PhotoToLoad p) {
            this.bitmap = b;
            this.photoToLoad = p;
        }

        public void run() {
            if (zImageLoader.this.imageViewReused(this.photoToLoad)) {
                return;
            }
            Object obj = this.photoToLoad.view.getTag();
            if ((this.bitmap != null) && (obj != null) && (obj.toString().equals(this.photoToLoad.url))) {
                if (zImageLoader.this.fdImageLoaderListener != null) {
                    zImageLoader.this.fdImageLoaderListener.bitmap(this.bitmap, this.photoToLoad.view);
                } else if ((zImageLoader.this.isBitmap) && ((this.photoToLoad.view instanceof ImageView))) {
                    ((ImageView) this.photoToLoad.view).setImageBitmap(this.bitmap);
                } else {
                    this.photoToLoad.view.setBackgroundDrawable(zBitmapUtil.bitmap2drawable(this.bitmap));
                }
            }
        }
    }

    public void clearMemoryCache() {
        memoryCache.clear();
    }

    public void clearFileCache() {
        this.fileCache.clear();
    }

    public static void CopyStream(InputStream is, OutputStream os) {
        int buffer_size = 1024;
        try {
            byte[] bytes = new byte['?'];
            for (; ; ) {
                int count = is.read(bytes, 0, 1024);
                if (count == -1) {
                    break;
                }
                os.write(bytes, 0, count);
            }
        } catch (Exception localException) {
        }
    }

    public void releaseImage(String url_or_filepath) {
        memoryCache.releaseImage(url_or_filepath);
    }
}
