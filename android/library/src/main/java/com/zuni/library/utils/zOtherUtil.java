package com.zuni.library.utils;

/**
 * Created by Jacob So on 2015/12/4.
 */

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.telephony.TelephonyManager;
import android.util.SparseArray;

public class zOtherUtil {


    public static void openURLByBrowser(String url, Context context) {
        if ((url != null) && (url.startsWith("http"))) {
            Uri uri = Uri.parse(url);
            Intent it = new Intent("android.intent.action.VIEW", uri);
            context.startActivity(it);
        }
    }

    public static void email(Context context, String email, String subject, String body) {
        if (email != null) {
            Intent i = new Intent("android.intent.action.SEND");

            i.setType("message/rfc822");
            i.putExtra("android.intent.extra.EMAIL", new String[]{email});
            if (subject != null) {
                i.putExtra("android.intent.extra.SUBJECT", subject);
            }
            if (body != null) {
                i.putExtra("android.intent.extra.TEXT", body);
            }
            context.startActivity(Intent.createChooser(i, "Select email application."));
        }
    }

    public static void dial(Context context, String phone) {
        if (phone != null) {
            Intent intent = new Intent("android.intent.action.CALL", Uri.parse("tel:" + phone));
            context.startActivity(intent);
        }
    }

    public static void dialDirectly(Context context, String phone) {
        if (phone != null) {
            Intent intent = new Intent("android.intent.action.CALL", Uri.parse("tel:" + phone));
            context.startActivity(intent);
        }
    }

    public static String getWifiMacAddress(Context context) {
        WifiManager wm = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        String m_szWLANMAC = wm.getConnectionInfo().getMacAddress();
        return m_szWLANMAC;
    }

    public static String getPhoneNumber(Context context){
        TelephonyManager tm = (TelephonyManager)
                context.getSystemService(Context.TELEPHONY_SERVICE);
        String phoneNumber = tm.getLine1Number();
        if(phoneNumber != null && !phoneNumber.equals("")){
            if(phoneNumber.indexOf("+86") != -1){
                phoneNumber = phoneNumber.substring(3);
            }
        }
        return phoneNumber;


    }
}
