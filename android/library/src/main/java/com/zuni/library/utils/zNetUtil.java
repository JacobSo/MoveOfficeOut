package com.zuni.library.utils;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.zuni.library.cache.zImageFileCache;
import com.zuni.library.listener.zDownloadListener;
import com.zuni.library.listener.zNetworkExceptionListener;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by Jacob So on 2015/12/4.
 */
public class zNetUtil {
    private HttpURLConnection conn;
    boolean isExcuteCloseConnection;

    public String postDataForString(Context context, String[] keys, String[] values, String url, Integer connectionTime, zNetworkExceptionListener fdNetworkExceptionListener) {
        if (!isConn(context)) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.networkDisable();
            }
            return null;
        }
        String result = null;
        boolean flag = true;
        if ((url == null) || ("".equals(url.trim()))) {
            Log.e("FastDevelop", "param url is null or empty string");
            return result;
        }
        if ((keys == null) || (values == null)) {
            Log.e("FastDevelop", "param keys(or values) is null");
            return result;
        }
        if (keys.length != values.length) {
            Log.e("FastDevelop", "length of param keys is not equal to length of param values");
            return result;
        }
        try {
            URL mURL = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) mURL.openConnection();
            this.conn = conn;
            conn.setRequestMethod("GET");
            if (connectionTime != null) {
                conn.setConnectTimeout(connectionTime.intValue());
            }
            conn.setDoOutput(true);
            StringBuffer params = new StringBuffer();
            int length = keys.length;
            for (int i = 0; i < length; i++) {
                params.append(keys[i]).append("=").append(values[i]);
                if (i < length - 1) {
                    params.append("&");
                }
            }
            byte[] bypes = params.toString().getBytes();
            conn.getOutputStream().write(bypes, 0, bypes.length);
            conn.getOutputStream().flush();
            if (conn.getResponseCode() == 200) {
                InputStream is = conn.getInputStream();
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                byte[] buffer = new byte['?'];
                int len = -1;
                while ((len = is.read(buffer)) > 0) {
                    out.write(buffer, 0, len);
                }
                result = out.toString("utf-8");
                out.close();
                is.close();
                conn.disconnect();
            }
        } catch (ConnectException connectException) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.networkException();
                connectException.printStackTrace();
                flag = false;
            }
        } catch (SocketTimeoutException socketTimeoutException) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.connectionTimeOut();
                socketTimeoutException.printStackTrace();
                flag = false;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if ((flag) && (result == null) &&
                (fdNetworkExceptionListener != null)) {
            fdNetworkExceptionListener.resultIsNull();
        }
        return result;
    }

    public HttpURLConnection postDataForHttpURLConnection(Context context, String[] keys, String[] values, String url, Integer connectionTime, zNetworkExceptionListener fdNetworkExceptionListener) {
        if (!isConn(context)) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.networkDisable();
            }
            return null;
        }
        HttpURLConnection conn = null;
        if ((url == null) || ("".equals(url.trim()))) {
            Log.e("FastDevelop", "param url is null or empty string");
            return conn;
        }
        if ((keys == null) || (values == null)) {
            Log.e("FastDevelop", "param keys(or values) is null");
            return conn;
        }
        if (keys.length != values.length) {
            Log.e("FastDevelop", "length of param keys is not equal to length of param values");
            return conn;
        }
        try {
            URL mURL = new URL(url);
            conn = (HttpURLConnection) mURL.openConnection();
            this.conn = conn;
            conn.setRequestMethod("GET");
            if (connectionTime != null) {
                conn.setConnectTimeout(connectionTime.intValue());
            }
            conn.setDoOutput(true);
            StringBuffer params = new StringBuffer();
            int length = keys.length;
            for (int i = 0; i < length; i++) {
                params.append(keys[i]).append("=").append(values[i]);
                if (i < length - 1) {
                    params.append("&");
                }
            }
            byte[] bypes = params.toString().getBytes();
            conn.getOutputStream().write(bypes, 0, bypes.length);
            conn.getOutputStream().flush();
            if (conn.getResponseCode() == 200) {
                return conn;
            }
        } catch (ConnectException connectException) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.networkException();
            }
            connectException.printStackTrace();
        } catch (SocketTimeoutException socketTimeoutException) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.connectionTimeOut();
            }
            socketTimeoutException.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getString(Context context, String url, Integer connectionTime, zNetworkExceptionListener fdNetworkExceptionListener) {
        if (!isConn(context)) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.networkDisable();
            }
            return null;
        }
        String result = null;
        boolean flag = true;
        if ((url == null) || ("".equals(url.trim()))) {
            Log.e("FastDevelop", "param url is null or empty string");
            return result;
        }
        try {
            URL u = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) u.openConnection();
            this.conn = conn;
            if (connectionTime != null) {
                conn.setConnectTimeout(connectionTime.intValue());
            }
            if (conn.getResponseCode() == 200) {
                InputStream in = conn.getInputStream();
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                byte[] buffer = new byte['?'];
                int len = -1;
                while ((len = in.read(buffer)) > 0) {
                    out.write(buffer, 0, len);
                }
                result = out.toString("utf-8");
                out.close();
                in.close();
                conn.disconnect();
            }
        } catch (ConnectException connectException) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.networkException();
            }
            connectException.printStackTrace();
            flag = false;
        } catch (SocketTimeoutException socketTimeoutException) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.connectionTimeOut();
            }
            socketTimeoutException.printStackTrace();
            flag = false;
        } catch (Exception e) {
            e.printStackTrace();
        }
        if ((flag) && (result == null) && (fdNetworkExceptionListener != null)) {
            fdNetworkExceptionListener.resultIsNull();
        }
        return result;
    }

    public HttpURLConnection getHttpURLConnection(Context context, String url, Integer connectionTime, zNetworkExceptionListener fdNetworkExceptionListener) {
        if (!isConn(context)) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.networkDisable();
            }
            return null;
        }
        HttpURLConnection conn = null;
        if ((url == null) || ("".equals(url.trim()))) {
            Log.e("FastDevelop", "param url is null or empty string");
            return conn;
        }
        try {
            URL mURL = new URL(url);
            conn = (HttpURLConnection) mURL.openConnection();
            this.conn = conn;
            if (connectionTime != null) {
                conn.setConnectTimeout(connectionTime.intValue());
            }
            if (conn.getResponseCode() == 200) {
                return conn;
            }
        } catch (ConnectException connectException) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.networkException();
            }
            connectException.printStackTrace();
        } catch (SocketTimeoutException socketTimeoutException) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.connectionTimeOut();
            }
            socketTimeoutException.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public void closeConnection() {
        this.isExcuteCloseConnection = true;
        if (this.conn != null) {
            this.conn.disconnect();
            this.conn = null;
        }
    }

    public boolean isExcuteCloseConnection() {
        return this.isExcuteCloseConnection;
    }

    public static boolean isConn(Context context) {
        boolean bisConnFlag = false;
        ConnectivityManager conManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo network = conManager.getActiveNetworkInfo();
        if (network != null) {
            bisConnFlag = network.isAvailable();
        }
        return bisConnFlag;
    }

    int downloadProgress = 0;

    public String downloadFileFromInternet(Context context, String[] keys, String[] values, String url, Integer connectionTime, zNetworkExceptionListener fdNetworkExceptionListener, String fileSubDirInSDCard, final zDownloadListener fdDownLoadListener) {
        if (!isConn(context)) {
            if (fdNetworkExceptionListener != null) {
                fdNetworkExceptionListener.networkDisable();
            }
            return null;
        }
        String result = null;
        boolean flag = true;
        if ((url == null) || ("".equals(url.trim()))) {
            Log.e("FastDevelop", "param url is null or empty string");
            return result;
        }
        if ((keys == null) || (values == null)) {
            Log.e("FastDevelop", "param keys(or values) is null");
            return result;
        }
        if (keys.length != values.length) {
            Log.e("FastDevelop", "length of param keys is not equal to length of param values");
            return result;
        }
        Timer timer = null;
        try {
            URL mURL = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) mURL.openConnection();
            this.conn = conn;
            conn.setRequestMethod("GET");
            if (connectionTime != null) {
                conn.setConnectTimeout(connectionTime.intValue());
            }
            if ((keys != null) && (values != null)) {
                conn.setDoOutput(true);
                StringBuffer params = new StringBuffer();
                int length = keys.length;
                for (int i = 0; i < length; i++) {
                    params.append(keys[i]).append("=").append(values[i]);
                    if (i < length - 1) {
                        params.append("&");
                    }
                }
                byte[] bypes = params.toString().getBytes();
                conn.getOutputStream().write(bypes, 0, bypes.length);
                conn.getOutputStream().flush();
            }
            if (conn.getResponseCode() == 200) {
                double fileSize = conn.getContentLength();
                InputStream is = conn.getInputStream();
                File file = new File(new zImageFileCache(context, fileSubDirInSDCard).getCacheDir(), url.substring(url.lastIndexOf("/") + 1));
                FileOutputStream out = new FileOutputStream(file);
                byte[] buffer = new byte['?'];
                int len = -1;
                if (fdDownLoadListener != null) {
                    fdDownLoadListener.startDownLoad();
                }
                if (fdDownLoadListener != null) {
                    timer = new Timer();
                    timer.schedule(new TimerTask() {
                        public void run() {
                            fdDownLoadListener.onDownLoadProgress(zNetUtil.this.downloadProgress);
                        }
                    }, 0L, 100L);
                }
                double downlaodSize = 0.0D;
                while ((len = is.read(buffer)) > 0) {
                    out.write(buffer, 0, len);
                    downlaodSize += len;
                    this.downloadProgress = ((int) (downlaodSize * 100.0D / fileSize));
                }
                out.close();
                is.close();
                conn.disconnect();
                result = file.getAbsolutePath();
                if (fdDownLoadListener != null) {
                    fdDownLoadListener.endDownLoad(result);
                    if (timer != null) {
                        timer.cancel();
                        timer = null;
                    }
                }
                return result;
            }
        } catch (Exception e) {
            if (timer != null) {
                timer.cancel();
                timer = null;
            }
            if (fdDownLoadListener != null) {
                fdDownLoadListener.downLoadFail();
            }
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 判断是否慢网络
     *
     * @return boolean
     */
    public static boolean isSlowNetwork(Context context) {
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo ni = cm.getActiveNetworkInfo();
        int webType = ni.getSubtype();
        switch (webType) {
            case TelephonyManager.NETWORK_TYPE_GPRS:
            case TelephonyManager.NETWORK_TYPE_EDGE:
            case TelephonyManager.NETWORK_TYPE_CDMA:
                return true;

            default:
                return false;
        }
    }

}
