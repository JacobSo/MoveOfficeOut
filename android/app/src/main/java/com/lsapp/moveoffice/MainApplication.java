package com.lsapp.moveoffice;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.alibaba.sdk.android.push.CloudPushService;
import com.alibaba.sdk.android.push.CommonCallback;
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory;
import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.wix.interactable.Interactable;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.microsoft.codepush.react.CodePush;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.lsapp.moveoffice.react.ReactModulePackage;

import org.pgsqlite.SQLitePluginPackage;

import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication {
    private final static String TAG = "MainApplication";
    private CloudPushService pushService;
    private Double geoLat = 0.0;
    private Double geoLng = 0.0;
    private String address = null;
    private static final ReactModulePackage reactModulePackage = new ReactModulePackage();

    public static MainApplication get(Context context) {
        return (MainApplication) context.getApplicationContext();
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNFSPackage(),
                    new RNFetchBlobPackage(),
                    new Interactable(),
                    new ImagePickerPackage(),
                    new SQLitePluginPackage(),
                    new CodePush("4_1U9ihAk6abg5rOTxiavyQWmimHNJYO7qa3M", getApplicationContext(), BuildConfig.DEBUG),
                    reactModulePackage
            );
        }
        //product: 4_1U9ihAk6abg5rOTxiavyQWmimHNJYO7qa3M
        //stage:h6osdCgokeQ3JHV73bVaP222Cbk-NJYO7qa3M
    };

    public static ReactModulePackage getReactPackage() {
        return reactModulePackage;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }


    @Override
    public void onCreate() {
        super.onCreate();
        //     PgyCrashManager.register(this);

        SoLoader.init(this, /* native exopackage */ false);
        initCloudChannel();
    }


    /**
     * 初始化云推送通道
     */
    public void initCloudChannel() {
        try {
            PushServiceFactory.init(this);
            pushService = PushServiceFactory.getCloudPushService();
            pushService.register(this, new CommonCallback() {
                @Override
                public void onSuccess(String response) {
                    Log.d(TAG, "init cloudchannel success:" + response);
                }

                @Override
                public void onFailed(String errorCode, String errorMessage) {
                    Log.d(TAG, "init cloudchannel failed -- errorcode:" + errorCode + " -- errorMessage:" + errorMessage);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void initCloudAccount(String platform) {
        if (pushService != null) {
            pushService.bindAccount(platform, new CommonCallback() {
                @Override
                public void onSuccess(String s) {
                    Log.d(TAG, "bindAccount success：" + s);
                }

                @Override
                public void onFailed(String s, String s1) {
                    Log.d(TAG, "bindAccount onFailed" + s + s1);
                }
            });
        }
    }

    public void unbindCloudAccount() {
        if (pushService != null) {
            pushService.unbindAccount(new CommonCallback() {
                @Override
                public void onSuccess(String s) {
                    Log.d(TAG, "onSuccess: unbind");
                }

                @Override
                public void onFailed(String s, String s1) {
                    Log.d(TAG, "onFailed: unbind");
                }
            });
        }
    }

    public Double getGeoLat() {
        return geoLat;
    }

    public void setGeoLat(Double geoLat) {
        this.geoLat = geoLat;
    }

    public Double getGeoLng() {
        return geoLng;
    }

    public void setGeoLng(Double geoLng) {
        this.geoLng = geoLng;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
