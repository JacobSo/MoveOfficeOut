package com.lsapp.moveoffice;

import android.Manifest;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.facebook.react.ReactActivity;
import com.zuni.library.utils.zContextUtil;
import com.zuni.library.utils.zPermissionUtils;

public class MainActivity extends ReactActivity {
    public static final String TAG = "MainActivity";
    public AMapLocationClientOption mLocationOption = null;
    public AMapLocationClient mLocationClient = null;
    public AMapLocationListener mLocationListener = new AMapLocationListener() {
        @Override
        public void onLocationChanged(AMapLocation aMapLocation) {
            if (aMapLocation.getErrorCode() == 0) {
                MainApplication.get(MainActivity.this).setGeoLat(aMapLocation.getLatitude());
                MainApplication.get(MainActivity.this).setGeoLng(aMapLocation.getLongitude());
                MainApplication.get(MainActivity.this).setAddress(aMapLocation.getAddress());

                Log.d(TAG, ":address " + aMapLocation.getAddress());
                Log.d(TAG, ":lat " + aMapLocation.getLatitude());
                Log.d(TAG, ":lng " + aMapLocation.getLongitude());
                MainApplication.getReactPackage().commonModule.callLocationChange(aMapLocation.getAddress(), aMapLocation.getLatitude() + "", aMapLocation.getLongitude() + "");

           /*     Log.d(TAG, ": " + aMapLocation.getCountry());//中国
                Log.d(TAG, ": " + aMapLocation.getProvince());//省
                Log.d(TAG, ": " + aMapLocation.getCity());//市
                Log.d(TAG, ": " + aMapLocation.getDistrict());//区
                Log.d(TAG, ": " + aMapLocation.getStreet());//路
                Log.d(TAG, aMapLocation.getLatitude() + ": " + aMapLocation.getLongitude());*/
            } else {
                Log.e("AmapError", "location Error, ErrCode:"
                        + aMapLocation.getErrorCode() + ", errInfo:"
                        + aMapLocation.getErrorInfo());
            }
        }
    };


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "MoveOfficeOut";
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkPermission();
        initGaodeLocation();
     //   initLocation();
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "onResume: ");
      //  if (!mLocationClient.isStarted())
            initLocation();

    }

    protected boolean initLocation() {
        Log.i(TAG, "initLocation");
        if (zContextUtil.isLocationFunctionOn(this)) {
            mLocationClient.startLocation();
            return true;
        } else {
            locationDialog();
            return false;
        }
    }

    protected void locationDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("定位没有开启，本系统需要定位支持，现在去开启吗?");
        builder.setPositiveButton("确 定", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                zContextUtil.LocationSetting(MainActivity.this);
            }
        });
        builder.setNegativeButton("取 消", null);
        builder.create().show();
    }

    public void initGaodeLocation() {
        mLocationClient = new AMapLocationClient(getApplicationContext());
        mLocationClient.setLocationListener(mLocationListener);
        mLocationOption = new AMapLocationClientOption();
        mLocationOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);//模式
       // mLocationOption.setOnceLocation(true);//连续定位
      //  mLocationOption.setOnceLocationLatest(true);//3s内最优结果
        mLocationOption.setInterval(3000);//间隔
        mLocationOption.setNeedAddress(true);//地址
        mLocationOption.setLocationCacheEnable(false);//缓存
        mLocationClient.setLocationOption(mLocationOption);
    }

    @Override
    protected void onStop() {
        super.onStop();
        Log.d(TAG, "onStop: ");
        mLocationClient.stopLocation();
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "onPause: ");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy: ");
        mLocationClient.onDestroy();
    }

    protected void checkPermission() {
        if (zPermissionUtils.lacksPermissions(this, new String[]{
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_LOCATION_EXTRA_COMMANDS,
                Manifest.permission.READ_PHONE_STATE

        })) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.ACCESS_COARSE_LOCATION,
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_LOCATION_EXTRA_COMMANDS,
                    Manifest.permission.READ_PHONE_STATE
            }, 0);
        }
    }
}
