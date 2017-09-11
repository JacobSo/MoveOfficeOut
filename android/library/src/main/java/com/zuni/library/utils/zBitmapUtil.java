package com.zuni.library.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Shader;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Environment;
import android.util.Base64;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;

/**
 * Created by Jacob So on 2015/12/4.
 */
public class zBitmapUtil {

    /**
     * 将下载好的图片存放到文件中
     */
    public static boolean setBitmapToFile(String path, Context context, String imageName, Bitmap bitmap) {
        String real_path;
        try {
            if (zFileUtil.hasSDCard()) {
                real_path = zFileUtil.getExtPath() + (path != null && path.startsWith("/") ? path : "/" + path);
            } else {
                real_path = zFileUtil.getPackagePath(context) + (path != null && path.startsWith("/") ? path : "/" + path);
            }
            File file = new File(real_path, imageName);
            if (!file.exists()) {
                File file2 = new File(real_path + "/");
                file2.mkdirs();
            }
            file.createNewFile();
            FileOutputStream fos;
            if (zFileUtil.hasSDCard()) {
                fos = new FileOutputStream(file);
            } else {
                fos = context.openFileOutput(imageName, Context.MODE_PRIVATE);
            }

            if (imageName != null && (imageName.contains(".png") || imageName.contains(".PNG"))) {
                bitmap.compress(Bitmap.CompressFormat.PNG, 90, fos);
            } else {
                bitmap.compress(Bitmap.CompressFormat.JPEG, 90, fos);
            }
            fos.flush();
            if (fos != null)
                fos.close();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static Bitmap decodeFile(String imageFilePath, int imageUpperLimitPix) {
        try {
            BitmapFactory.Options o = new BitmapFactory.Options();
            o.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(imageFilePath, o);

            int width_tmp = o.outWidth;
            int height_tmp = o.outHeight;
            int scale = 1;
            while ((width_tmp / 2 >= imageUpperLimitPix) || (height_tmp / 2 >= imageUpperLimitPix)) {
                width_tmp /= 2;
                height_tmp /= 2;
                scale *= 2;
            }
            BitmapFactory.Options o2 = new BitmapFactory.Options();
            o2.inSampleSize = scale;
            return BitmapFactory.decodeFile(imageFilePath, o2);
        } catch (Exception localException) {
        }
        return null;
    }

    public static Bitmap drawable2bitmap(Drawable d) {
        return d != null ? ((BitmapDrawable) d).getBitmap() : null;
    }

    public static Bitmap layerdrawable2bitmap(Drawable drawable) {
        int w = drawable.getIntrinsicWidth();
        int h = drawable.getIntrinsicHeight();
        Bitmap.Config config = drawable.getOpacity() != -1 ? Bitmap.Config.ARGB_8888 : Bitmap.Config.RGB_565;
        Bitmap bitmap_util = Bitmap.createBitmap(w, h, config);

        Canvas canvas = new Canvas(bitmap_util);
        drawable.setBounds(0, 0, w, h);
        drawable.draw(canvas);
        return bitmap_util;
    }

    public static Drawable bitmap2drawable(Bitmap b) {
        return b != null ? new BitmapDrawable(b) : null;
    }

    public static Bitmap createReflectedBitmap(Bitmap originalImage, Integer instanceColor) {
        int reflectionGap = 4;

        int width = originalImage.getWidth();
        int height = originalImage.getHeight();

        Matrix matrix = new Matrix();
        matrix.preScale(1.0F, -1.0F);

        Bitmap reflectionImage = Bitmap.createBitmap(originalImage, 0, height / 2, width, height / 2, matrix, false);
        Bitmap bitmapWithReflection = Bitmap.createBitmap(width, height + height / 5, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmapWithReflection);
        canvas.drawBitmap(originalImage, 0.0F, 0.0F, null);

        Paint deafaultPaint = new Paint();
        if (instanceColor != null) {
            deafaultPaint.setColor(instanceColor.intValue());
        } else {
            deafaultPaint.setColor(-1);
        }
        canvas.drawRect(0.0F, height, width, height + 4, deafaultPaint);
        canvas.drawBitmap(reflectionImage, 0.0F, height + 4, null);

        Paint paint = new Paint();
        LinearGradient shader = new LinearGradient(0.0F, originalImage.getHeight(), 0.0F, bitmapWithReflection.getHeight() + 4, 1895825407, 16777215,
                Shader.TileMode.CLAMP);
        paint.setShader(shader);
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_IN));
        canvas.drawRect(0.0F, height, width, bitmapWithReflection.getHeight() + 4, paint);
        return bitmapWithReflection;
    }

    public static Bitmap createRoundCornerBitmap(Bitmap bitmap, int pixels) {
        Bitmap output = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(output);
        Paint paint = new Paint();
        Rect rect = new Rect(0, 0, bitmap.getWidth(), bitmap.getHeight());
        RectF rectF = new RectF(rect);
        float roundPx = pixels;
        paint.setAntiAlias(true);
        canvas.drawARGB(0, 0, 0, 0);
        paint.setColor(Color.BLACK);
        canvas.drawRoundRect(rectF, roundPx, roundPx, paint);
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        canvas.drawBitmap(bitmap, rect, rect, paint);
        return output;
    }

    public static Bitmap createFrameBitmap(Bitmap bm, int[] res, Context context) {
        Bitmap bmp = decodeBitmap(res[1], context);
        Bitmap bmp1 = decodeBitmap(res[3], context);

        int smallW = bmp.getWidth();
        int smallH = bmp1.getHeight();

        int bigW = bm.getWidth();
        int bigH = bm.getHeight();

        int wCount = (int) Math.ceil(bigW * 1.0D / smallW);
        int hCount = (int) Math.ceil(bigH * 1.0D / smallH);

        int newW = bigW + 2;
        int newH = bigH + 2;

        Bitmap newBitmap = Bitmap.createBitmap(newW, newH, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(newBitmap);
        Paint p = new Paint();
        p.setColor(0);
        canvas.drawRect(new Rect(0, 0, newW, newH), p);

        Rect rect = new Rect(smallW, smallH, newW - smallW, newH - smallH);
        Paint paint = new Paint();
        paint.setColor(-1);
        canvas.drawRect(rect, paint);

        canvas.drawBitmap(bm, (newW - bigW - 2 * smallW) / 2 + smallW, (newH - bigH - 2 * smallH) / 2 + smallH, null);

        int startW = newW - smallW;
        int startH = newH - smallH;
        if (res[0] != 0) {
            Bitmap leftTopBm = decodeBitmap(res[0], context);
            canvas.drawBitmap(leftTopBm, 0.0F, 0.0F, null);

            leftTopBm.recycle();
            leftTopBm = null;
        }
        if (res[2] != 0) {
            Bitmap leftBottomBm = decodeBitmap(res[2], context);
            canvas.drawBitmap(leftBottomBm, 0.0F, startH, null);
            leftBottomBm.recycle();
            leftBottomBm = null;
        }
        if (res[4] != 0) {
            Bitmap rightBottomBm = decodeBitmap(res[4], context);
            canvas.drawBitmap(rightBottomBm, startW, startH, null);
            rightBottomBm.recycle();
            rightBottomBm = null;
        }
        if (res[6] != 0) {
            Bitmap rightTopBm = decodeBitmap(res[6], context);
            canvas.drawBitmap(rightTopBm, startW, 0.0F, null);
            rightTopBm.recycle();
            rightTopBm = null;
        }
        Bitmap leftBm = decodeBitmap(res[1], context);
        Bitmap rightBm = decodeBitmap(res[5], context);
        int i = 0;
        for (int length = hCount; i < length; i++) {
            int h = smallH * (i + 1);
            canvas.drawBitmap(leftBm, 0.0F, h, null);
            canvas.drawBitmap(rightBm, startW, h, null);
        }
        leftBm.recycle();
        leftBm = null;
        rightBm.recycle();
        rightBm = null;

        Bitmap bottomBm = decodeBitmap(res[3], context);
        Bitmap topBm = decodeBitmap(res[7], context);
        i = 0;
        for (int length = wCount; i < length; i++) {
            int w = smallW * (i + 1);
            canvas.drawBitmap(bottomBm, w, startH, null);
            canvas.drawBitmap(topBm, w, 0.0F, null);
        }
        bottomBm.recycle();
        bottomBm = null;
        topBm.recycle();
        topBm = null;

        canvas.save(Canvas.ALL_SAVE_FLAG);
        canvas.restore();

        return newBitmap;
    }

    public static Bitmap decodeBitmap(int res, Context context) {
        return BitmapFactory.decodeResource(context.getResources(), res);
    }


    public static Bitmap getResizedBitmap(Bitmap bm, int newHeight, int newWidth, Context context) {
        int width = bm.getWidth();
        int height = bm.getHeight();

        float scaleWidth = newWidth / width;
        float scaleHeight = newHeight / height;

        Matrix matrix = new Matrix();
        matrix.postScale(scaleWidth, scaleHeight);
        Bitmap resizedBitmap = Bitmap.createBitmap(bm, 0, 0, width, height, matrix, false);
        return resizedBitmap;
    }

    /**
     * 把bitmap转换成String
     *
     * @param filePath 路径
     * @return Base64.encodeToString(b, Base64.DEFAULT) 字符串处理图片
     */
    public static String bitmapToString(String filePath, int quality) {//30
        try {
            Bitmap bm = getSmallBitmap(filePath);
            if (bm == null) {
                bm = getSmallBitmap(Environment.getExternalStorageDirectory() + "/lsapp/img/ico.jpg");
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            bm.compress(Bitmap.CompressFormat.JPEG, quality, baos);
            byte[] b = baos.toByteArray();

            return Base64.encodeToString(b, Base64.DEFAULT);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return Base64.encodeToString(null, Base64.DEFAULT);
        }
    }


    public static Bitmap StringToBitmap(String data) {
        Bitmap bitmap = null;
        try {
            byte[] bitmapArray;
            bitmapArray = Base64.decode(data, Base64.DEFAULT);
            bitmap = BitmapFactory.decodeByteArray(bitmapArray, 0, bitmapArray.length);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bitmap;
    }

    /**
     * 根据路径获得图片并压缩，返回bitmap用于显示
     *
     * @param filePath 路径
     * @return BitmapFactory.decodeFile(filePath, options) 压缩图片
     */
    public static Bitmap getSmallBitmap(String filePath) {
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(filePath, options);

        // Calculate inSampleSize
        options.inSampleSize = calculateInSampleSize(options, 480, 800);
        // Decode bitmap with inSampleSize set
        options.inJustDecodeBounds = false;

        return BitmapFactory.decodeFile(filePath, options);
    }

    /**
     * 计算图片的缩放值
     *
     * @param options   bitmap设置参数
     * @param reqWidth  缩放宽
     * @param reqHeight 缩放高
     * @return inSampleSize
     */
    public static int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {
            final int heightRatio = Math.round((float) height / (float) reqHeight);
            final int widthRatio = Math.round((float) width / (float) reqWidth);
            inSampleSize = heightRatio < widthRatio ? heightRatio : widthRatio;
        }
        return inSampleSize;
    }

    /**
     * 将给定图片维持宽高比缩放后，截取正中间的正方形部分。
     *
     * @param imgPath    原图路径
     * @param edgeLength 希望得到的正方形部分的边长
     * @return result 缩放截取正中部分后的位图。失败返回null
     */
    public static Bitmap centerSquareScaleBitmap(String imgPath, int edgeLength) {
        //Logs.v(imgPath);
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = false;
        options.inSampleSize = 10;
        Bitmap bitmap = BitmapFactory.decodeFile(imgPath, options);


        if (null == bitmap || edgeLength <= 0) {
            return null;
        }

        Bitmap result = bitmap;
        int widthOrg = bitmap.getWidth();
        int heightOrg = bitmap.getHeight();

        if (widthOrg > edgeLength && heightOrg > edgeLength) {
            //压缩到一个最小长度是edgeLength的bitmap
            int longerEdge = edgeLength * Math.max(widthOrg, heightOrg) / Math.min(widthOrg, heightOrg);
            int scaledWidth = widthOrg > heightOrg ? longerEdge : edgeLength;
            int scaledHeight = widthOrg > heightOrg ? edgeLength : longerEdge;
            Bitmap scaledBitmap;

            try {
                scaledBitmap = Bitmap.createScaledBitmap(bitmap, scaledWidth, scaledHeight, true);
            } catch (Exception e) {
                return null;
            }

            //从图中截取正中间的正方形部分。
            int xTopLeft = (scaledWidth - edgeLength) / 2;
            int yTopLeft = (scaledHeight - edgeLength) / 2;

            try {
                result = Bitmap.createBitmap(scaledBitmap, xTopLeft, yTopLeft, edgeLength, edgeLength);
                scaledBitmap.recycle();
            } catch (Exception e) {
                return null;
            }
        }

        return result;
    }

    public static Bitmap cropCenter(Bitmap bm, int width, int height) {
        if (bm == null) {
            return bm;
        }
        int startWidth = (bm.getWidth() - width) / 2;
        int startHeight = (bm.getHeight() - height) / 2;
        Rect src = new Rect(startWidth, startHeight, startWidth + width, startHeight + height);
        return cropBitmap(bm, src);
    }

    public static Bitmap cropBitmap(Bitmap bmp, Rect src) {
        int width = src.width();
        int height = src.height();
        Rect des = new Rect(0, 0, width, height);
        Bitmap croppedImage = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565);
        Canvas canvas = new Canvas(croppedImage);
        canvas.drawBitmap(bmp, src, des, null);
        return croppedImage;
    }

    public static void saveMyBitmapByPath(Bitmap mBitmap, String path) {
        File f = new File(path);
        //if (!f.exists()) {
        try {
            FileOutputStream fOut = null;
            fOut = new FileOutputStream(f);
            mBitmap.compress(Bitmap.CompressFormat.JPEG, 100, fOut);
            fOut.flush();
            fOut.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        //   }
    }

}

