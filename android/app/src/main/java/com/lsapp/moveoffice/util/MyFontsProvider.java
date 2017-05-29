package com.lsapp.moveoffice.util;

import com.itextpdf.text.Font;
import com.itextpdf.tool.xml.XMLWorkerFontProvider;

/**
 * Created by Administrator on 2016/6/14.
 */
public class MyFontsProvider extends XMLWorkerFontProvider {
    public MyFontsProvider() {
        super(null, null);
    }

    @Override
    public Font getFont(final String fontName, String encoding, float size, final int style) {
        return super.getFont("assets/simhei.ttf", "UniGB-UTF8-V", size, style);
    }
}