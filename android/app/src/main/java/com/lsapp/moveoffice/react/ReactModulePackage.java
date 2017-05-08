package com.lsapp.moveoffice.react;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by Administrator on 2017/3/28.
 */

public class ReactModulePackage implements ReactPackage{
    public CommonModule commonModule;
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        commonModule = new CommonModule(reactContext);
        List<NativeModule> modules = new ArrayList<>();
        modules.add(commonModule);
        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
