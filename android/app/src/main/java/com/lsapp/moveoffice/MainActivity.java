package com.lsapp.moveoffice;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import com.facebook.react.ReactActivity;
import com.facebook.react.common.SystemClock;

public class MainActivity extends ReactActivity {

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
        if (getIntent().hasExtra("user") && getIntent().hasExtra("pwd")) {
        //     Toast.makeText(this,getIntent().getExtras().getString("pwd"),Toast.LENGTH_LONG).show();
            MainApplication.get(this).setSharePwd(getIntent().getExtras().getString("pwd"));
            MainApplication.get(this).setShareUser(getIntent().getExtras().getString("user"));
        }

    }
}
