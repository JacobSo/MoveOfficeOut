package com.lsapp.moveoffice.util;

import android.content.Context;
import android.os.Environment;

import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Image;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfWriter;
import com.lsapp.moveoffice.Const;

public class HeaderFooter extends PdfPageEventHelper {
    Context context;
    int code = 0;
    MyFontsProvider fontProvider;
    String info;

    public HeaderFooter(Context context, int flag, String info,MyFontsProvider fontProvider) {
        this.context = context;
        code = flag;
        this.fontProvider = fontProvider;
        this.info = info;
        if(code==0){
            this.info = info+"（白胚）";
        }else {
            this.info = info+(code==1?"（成品）":"（包装）");
        }
    }

    @Override
    public void onStartPage(PdfWriter writer, Document document) {
        super.onStartPage(writer, document);
        try {
            if (code==0) {
                if (writer.getPageNumber() != 1) {
                    Rectangle rect = writer.getBoxSize("art");
                    Image img = Image.getInstance(Environment.getExternalStorageDirectory() + "/" + Const.DOWNLOAD_IMG_PATH + Const.WD_STEP1_TITLE);
                    img.scaleToFit(585, 100);
                    img.setAbsolutePosition(9, rect.getTop() - 10);
                    img.setAlignment(Element.ALIGN_LEFT);
                    writer.getDirectContent().addImage(img);
                }
            } else {
                if (writer.getPageNumber() != 1) {
                    Rectangle rect = writer.getBoxSize("art");
                    Image img = Image.getInstance(Environment.getExternalStorageDirectory() + "/" + Const.DOWNLOAD_IMG_PATH + Const.WD_STEP23_TITLE);
                    img.scaleToFit(584, 100);
                    img.setAbsolutePosition(9, rect.getTop() - 10);
                    img.setAlignment(Element.ALIGN_LEFT);
                    writer.getDirectContent().addImage(img);
                }
            }
        } catch (Exception x) {
            x.printStackTrace();
        }

    }

    public void onEndPage(PdfWriter writer, Document document) {
        Rectangle rect = writer.getBoxSize("art");
/*        ColumnText.showTextAligned(writer.getDirectContent(),
                Element.ALIGN_RIGHT, new Phrase("even header"),
                rect.getRight(), rect.getTop(), 0);*/


        ColumnText.showTextAligned(writer.getDirectContent(),
                Element.ALIGN_CENTER,  new Phrase(String.format(info+"/第 %d 页", writer.getPageNumber()),fontProvider.getFont("assets/simhei.ttf")),
                (rect.getLeft() + rect.getRight()) / 2, rect.getBottom() - 50, 0);
    }
}