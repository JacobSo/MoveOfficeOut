package com.zuni.library.utils;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.webkit.MimeTypeMap;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by Jacob So on 2015/12/4.
 */
public class zFileUtil {
    // url = file path or whatever suitable URL you want.
    public static String getMimeType(String url) {
        String type = null;
        String extension = MimeTypeMap.getFileExtensionFromUrl(url);
        if (extension != null) {
            type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        }
        return type;
    }

    public static File getFileCacheDir(Context context, String imageSubDirInSDCard) {
        File cacheDir = null;
        if (imageSubDirInSDCard == null) {
            imageSubDirInSDCard = "FastDevelop";
        }
        if (Environment.getExternalStorageState().equals("mounted")) {
            cacheDir = new File(Environment.getExternalStorageDirectory(), imageSubDirInSDCard);
        } else {
            cacheDir = context.getCacheDir();
        }

        if (!cacheDir.exists()) {
            cacheDir.mkdirs();
        }

        return cacheDir;
    }

    public static String getRootPath(Context context) {
        File fileDir = context.getFilesDir();
        File sdcardDir = Environment.getExternalStorageDirectory();
        String path;
        if (Environment.getExternalStorageState().equals("removed")) {
            path = fileDir.getParent() + File.separator + fileDir.getName();
        } else {
            path = sdcardDir.getParent() + "/" + sdcardDir.getName();
        }
        return path;
    }

    public static String getExtPath() {
        String path = "";
        if (hasSDCard()) {
            path = Environment.getExternalStorageDirectory().getPath();
        }
        return path;
    }

    public static boolean hasSDCard() {
        boolean b = false;
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())) {
            b = true;
        }
        return b;
    }

    public static void copyFile(File fromFile, File toFile, Boolean rewrite) {
        if (!fromFile.exists()) {
            return;
        }
        if (!fromFile.isFile()) {
            return;
        }
        if (!fromFile.canRead()) {
            return;
        }
        if (!toFile.getParentFile().exists()) {
            toFile.getParentFile().mkdirs();
        }
        if ((toFile.exists()) && (rewrite.booleanValue())) {
            toFile.delete();
        }
        try {
            FileInputStream fosfrom = new FileInputStream(fromFile);

            FileOutputStream fosto = new FileOutputStream(toFile);

            byte[] bt = new byte['?'];
            int c;
            while ((c = fosfrom.read(bt)) > 0) {
                fosto.write(bt, 0, c);
            }
            fosfrom.close();
            fosto.close();
        } catch (Exception ex) {
            Log.e("readfile", "");
        }
    }


    public static void writeFileToText(String str, String name) {
        try {
            File file = new File(Environment.getExternalStorageDirectory(),
                    name);
            if (!file.exists()) {
                file.createNewFile();
            }
            byte bytes[];
            bytes = str.getBytes();
            int b = str.length();
            FileOutputStream fos = new FileOutputStream(file);
            fos.write(bytes, 0, b);
            fos.close();
            System.out.println("write to text success");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static boolean fileIsExists(String path) {
        System.out.println(path);
        try {
            File f = new File(path);
            if (f.exists()) {
                return true;
            } else {
                return false;
            }

        } catch (Exception e) {
            // TODO: handle exception
            return false;
        }
    }

    public static File getImageFile(String dir) {
        File file = new File(Environment.getExternalStorageDirectory(),
                dir);
        if (!file.exists()) {
            file.mkdirs();
        }
        String name = System.currentTimeMillis() + ".jpg";
        File img = new File(file, name);
        //  System.out.println("photo:"+img.getAbsolutePath());
        return img;
    }

    public static boolean delSingleFile(String path) {
        try {
            File file = new File(path);
            file.delete();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 删除文件夹里面的所有文件
     *
     * @param path String 文件夹路径 如 c:/fqf
     */
    public static boolean delAllFile(String path) {
        File file = new File(path);
        if (!file.exists()) {
            return false;
        }
        if (!file.isDirectory()) {
            return false;
        }
        String[] tempList = file.list();
        File temp = null;
        for (int i = 0; i < tempList.length; i++) {
            if (path.endsWith(File.separator)) {
                temp = new File(path + tempList[i]);
            } else {
                temp = new File(path + File.separator + tempList[i]);
            }
            if (temp.isFile()) {
                temp.delete();
            }
            if (temp.isDirectory()) {
                delAllFile(path + "/" + tempList[i]);//先删除文件夹里面的文件
                delFolder(path + "/" + tempList[i]);//再删除空文件夹
            }
        }
        return true;
    }

    /**
     * 删除文件夹
     *
     * @param folderPath 文件夹路径
     * @return
     */
    public static void delFolder(String folderPath) {
        try {
            delAllFile(folderPath); //删除完里面所有内容
            String filePath = folderPath;
            filePath = filePath.toString();
            java.io.File myFilePath = new java.io.File(filePath);
            myFilePath.delete(); //删除空文件夹

        } catch (Exception e) {
            //  System.out.println("删除文件夹操作出错");
            e.printStackTrace();
        }
    }

    /**
     * 得到/data/data/目录
     */
    public static String getPackagePath(Context c) {
        return c.getFilesDir().toString();
    }

    /**
     * 得到/data/data/目录
     */
    public static String getCachePath(Context c) {
        return c.getCacheDir().toString();
    }

    /**
     * 根据url得到文件名
     *
     * @param url 地址
     * @return
     */
    public static String getFileName(String url, boolean withLastFlag) {
        String fileName = "";
        if(withLastFlag){
            if (url != null)
                fileName = url.substring(url.lastIndexOf("/") + 1);
        }else{
            if (url!=null)
                fileName = url.substring(url.lastIndexOf("/"), url.lastIndexOf("."));
        }
        System.out.println("file:" + fileName);
        return fileName;
    }

    public static String getRealPathFromURI(Context context, Uri contentURI) throws Exception {
        String result;
        Cursor cursor = context.getContentResolver().query(contentURI, null, null, null, null);
        if (cursor == null) {
            return null;
        } else {
            cursor.moveToFirst();
            int idx = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
            result = cursor.getString(idx);
            cursor.close();
        }
        return result;
    }

    public static File getFile(String dir, String dot) {
        File file = new File(Environment.getExternalStorageDirectory(),
                dir);
        if (!file.exists()) {
            file.mkdirs();
        }
        String name = System.currentTimeMillis() + dot;
        File img = new File(file, name);
        //  System.out.println("photo:"+img.getAbsolutePath());
        return img;
    }


}
