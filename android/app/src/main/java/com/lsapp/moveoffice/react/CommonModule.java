package com.lsapp.moveoffice.react;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.lsapp.moveoffice.MainApplication;
import com.pgyersdk.javabean.AppBean;
import com.pgyersdk.update.PgyUpdateManager;
import com.pgyersdk.update.UpdateManagerListener;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by Administrator on 2017/3/28.
 */

public class CommonModule extends ReactContextBaseJavaModule {


    public CommonModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CommonModule";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @ReactMethod
    public void bindPushAccount(String account) {
        MainApplication.get(getReactApplicationContext()).initCloudAccount(account);
    }

    @ReactMethod
    public void unbindPushAccount() {
        MainApplication.get(getReactApplicationContext()).unbindCloudAccount();
    }

    @ReactMethod
    public void checkUpdate() {
        PgyUpdateManager.register(getCurrentActivity(), new UpdateManagerListener() {

            @Override
            public void onUpdateAvailable(final String result) {
                System.out.println(result);
                final AppBean appBean = getAppBeanFromString(result);
                new AlertDialog.Builder(getCurrentActivity())
                        .setTitle("更新")
                        .setMessage("检测到新版本，是否更新")
                        .setNegativeButton("确定", new DialogInterface.OnClickListener() {

                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                startDownloadTask(getCurrentActivity(), appBean.getDownloadURL());
                            }
                        }).show();
            }

            @Override
            public void onNoUpdateAvailable() {
                Toast.makeText(getCurrentActivity(), "现在已是最新版本", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @ReactMethod
    public void getVersionName(Callback callback) {
        try {
            PackageManager packageManager = getCurrentActivity().getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(getCurrentActivity().getPackageName(), 0);
            callback.invoke(packageInfo.versionName);
        } catch (Exception e) {
            e.printStackTrace();
            callback.invoke("获取错误");

        }
    }


    @ReactMethod
    public void getShareUser(Callback callback) {
        callback.invoke(MainApplication.get(getCurrentActivity()).getShareUser(),
                MainApplication.get(getCurrentActivity()).getSharePwd());
    }

    @ReactMethod
    public void logoutShareAccount() {
        MainApplication.get(getCurrentActivity()).setSharePwd(null);
        MainApplication.get(getCurrentActivity()).setShareUser(null);
    }

    @ReactMethod
    public void show() {
        Toast.makeText(getCurrentActivity(), "test", Toast.LENGTH_SHORT).show();
    }
}
