package com.zuni.library.utils;

/**
 * Created by Jacob So on 2015/12/4.
 */

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class zStreamOperateUtil {
    public static byte[] inputStream2Bytes(InputStream in) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int len = 0;
        byte[] buffer = new byte['?'];
        try {
            while ((len = in.read(buffer)) > 0) {
                out.write(buffer, 0, len);
            }
            out.close();
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return out.toByteArray();
    }

    public static InputStream string2InputStream(String string) {
        ByteArrayInputStream tInputStringStream = null;
        if ((string != null) && (!string.trim().equals(""))) {
            tInputStringStream = new ByteArrayInputStream(string.getBytes());
        }
        return tInputStringStream;
    }

    public static InputStream bytes2InputStream(byte[] bytes) {
        ByteArrayInputStream tInputStringStream = null;
        if (bytes != null) {
            tInputStringStream = new ByteArrayInputStream(bytes);
        }
        return tInputStringStream;
    }

    public static InputStream inputStream2InputStream(InputStream in) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int len = 0;
        byte[] buffer = new byte['?'];
        try {
            while ((len = in.read(buffer)) > 0) {
                out.write(buffer, 0, len);
            }
            out.close();
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return bytes2InputStream(out.toByteArray());
    }
}
