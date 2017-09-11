package com.zuni.library.cache;

/**
 * Created by Jacob So on 2015/12/4.
 */

        import android.content.Context;
        import android.os.Environment;
        import java.io.File;

public class zImageFileCache
{
    private File cacheDir;

    public zImageFileCache(Context context, String imageSubDirInSDCard)
    {
        if (imageSubDirInSDCard == null) {
            imageSubDirInSDCard = "FastDevelop";
        }
        if (Environment.getExternalStorageState().equals("mounted")) {
            this.cacheDir = new File(Environment.getExternalStorageDirectory(), imageSubDirInSDCard);
        } else {
            this.cacheDir = context.getCacheDir();
        }
        if (!this.cacheDir.exists()) {
            this.cacheDir.mkdirs();
        }
    }

    public File getCacheDir()
    {
        return this.cacheDir;
    }

    public File getFile(String url)
    {
        if (!url.startsWith("http")) {
            return new File(url);
        }
        String filename = String.valueOf(url.hashCode());

        File f = new File(this.cacheDir, filename);
        return f;
    }

    public void clear()
    {
        File[] files = this.cacheDir.listFiles();
        if (files == null) {
            return;
        }
        File[] arrayOfFile1;
        int j = (arrayOfFile1 = files).length;
        for (int i = 0; i < j; i++)
        {
            File f = arrayOfFile1[i];
            f.delete();
        }
    }
}
