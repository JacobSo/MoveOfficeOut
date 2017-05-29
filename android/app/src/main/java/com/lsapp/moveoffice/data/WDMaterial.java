package com.lsapp.moveoffice.data;

import java.io.Serializable;

/**
 * Created by Administrator on 2016/5/13.
 */
public class WDMaterial implements Serializable {
    private String mTitle;
    private String mContent;

    public String getmTitle() {
        return mTitle;
    }

    public void setmTitle(String mTitle) {
        this.mTitle = mTitle;
    }

    public String getmContent() {
        return mContent;
    }

    public void setmContent(String mContent) {
        this.mContent = mContent;
    }
}
