package com.zuni.library.cache;

/**
 * Created by Jacob So on 2015/12/4.
 */

import android.graphics.Bitmap;
import android.util.Log;

import java.lang.ref.SoftReference;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

public class zImageMemoryCache {
    private static final String TAG = "MemoryCache";
    private Map<String, SoftReference<Bitmap>> cache = Collections.synchronizedMap(new LinkedHashMap(
            10, 1.5F, true));
    private long size = 0L;
    private long limit = 1000000L;

    public zImageMemoryCache() {
        setLimit(Runtime.getRuntime().maxMemory() / 8L);
    }

    public void setLimit(long new_limit) {
        this.limit = new_limit;
        Log.i("MemoryCache", "MemoryCache will use up to " + this.limit / 1024.0D / 1024.0D + "MB");
    }

    public Bitmap get(String id) {
        try {
            if (!this.cache.containsKey(id)) {
                return null;
            }
            SoftReference<Bitmap> softReference = (SoftReference) this.cache.get(id);
            return (Bitmap) softReference.get();
        } catch (NullPointerException ex) {
        }
        return null;
    }

    public void put(String id, Bitmap bitmap) {
        try {
            if (this.cache.containsKey(id)) {
                this.size -= getSizeInBytes((Bitmap) ((SoftReference) this.cache.get(id)).get());
            }
            this.cache.put(id, new SoftReference(bitmap));
            this.size += getSizeInBytes(bitmap);
            checkSize();
        } catch (Throwable th) {
            th.printStackTrace();
        }
    }

    private void checkSize() {
        Log.i("MemoryCache", "cache size=" + this.size + " length=" + this.cache.size());
        Log.i("MemoryCache", "cache limit=======" + this.limit);
        if (this.size > this.limit) {
            Iterator<Map.Entry<String, SoftReference<Bitmap>>> iter = this.cache
                    .entrySet().iterator();
            while (iter.hasNext()) {
                Map.Entry<String, SoftReference<Bitmap>> entry = (Map.Entry) iter.next();
                this.size -= getSizeInBytes((Bitmap) ((SoftReference) entry.getValue()).get());
                iter.remove();
                if (this.size <= this.limit) {
                    break;
                }
            }
            Log.i("MemoryCache", "Clean cache. New size " + this.cache.size());
        }
    }

    public void clear() {
        this.cache.clear();
    }

    long getSizeInBytes(Bitmap bitmap) {
        if (bitmap == null) {
            return 0L;
        }
        return bitmap.getRowBytes() * bitmap.getHeight();
    }

    public void releaseImage(String path) {
        if (this.cache.containsKey(path)) {
            SoftReference<Bitmap> reference = (SoftReference) this.cache.get(path);

            Bitmap bitmap = (Bitmap) reference.get();
            if (bitmap != null) {
                bitmap.recycle();
            }
            this.cache.remove(path);
        }
    }
}
