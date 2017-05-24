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

                Log.d(TAG, ":11 " + aMapLocation.getAddress());
                MainApplication.getReactPackage().commonModule.callLocationChange(aMapLocation.getAddress(),aMapLocation.getLatitude()+"",aMapLocation.getLongitude()+"");

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
        if (getIntent().hasExtra("user") && getIntent().hasExtra("pwd")) {
            //  Toast.makeText(t"his,getIntent().getExtras().getString("user"),Toast.LENGTH_LONG).show();
            MainApplication.get(this).setShareUser(getIntent().getExtras().getString("user"));
            MainApplication.get(this).setSharePwd(getIntent().getExtras().getString("pwd"));
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkPermission();
        if (getIntent().hasExtra("user") && getIntent().hasExtra("pwd")) {
            //     Toast.makeText(this,getIntent().getExtras().getString("pwd"),Toast.LENGTH_LONG).show();
            MainApplication.get(this).setSharePwd(getIntent().getExtras().getString("pwd"));
            MainApplication.get(this).setShareUser(getIntent().getExtras().getString("user"));
        }
        initGaodeLocation();
    }

    @Override
    protected void onResume() {
        super.onResume();
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
        mLocationOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);
        mLocationOption.setOnceLocation(false);
        mLocationOption.setOnceLocationLatest(false);//一次
        mLocationOption.setInterval(3000);
        mLocationOption.setNeedAddress(true);
        mLocationOption.setLocationCacheEnable(false);
        mLocationClient.setLocationOption(mLocationOption);
    }

    @Override
    protected void onPause() {
        super.onPause();
        mLocationClient.stopLocation();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
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
