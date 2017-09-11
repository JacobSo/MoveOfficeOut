package com.zuni.library.utils;

/**
 * Created by Jacob So on 2015/12/4.
 */

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

public class zMD5Util {
    public static String getMD5(String content) {
        try {
            MessageDigest digest = MessageDigest.getInstance("MD5");
            digest.update(content.getBytes());
            return getHashString(digest);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }
    public static String getSH1(String content) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA1");
            digest.update(content.getBytes());
            return getHashString(digest);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static String getHashString(MessageDigest digest) {
        StringBuilder builder = new StringBuilder();
        byte[] arrayOfByte;
        int j = (arrayOfByte = digest.digest()).length;
        for (int i = 0; i < j; i++) {
            byte b = arrayOfByte[i];
            builder.append(Integer.toHexString(b >> 4 & 0xF));
            builder.append(Integer.toHexString(b & 0xF));
        }
        return builder.toString();
    }

    public static String getUUID(){
        String uid = UUID.randomUUID().toString();
        //uid.replace("-", "a");
        return uid;
    }
}

