package com.lsapp.moveoffice.react;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorker;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.itextpdf.tool.xml.html.CssAppliers;
import com.itextpdf.tool.xml.html.CssAppliersImpl;
import com.itextpdf.tool.xml.html.Tags;
import com.itextpdf.tool.xml.parser.XMLParser;
import com.itextpdf.tool.xml.pipeline.css.CSSResolver;
import com.itextpdf.tool.xml.pipeline.css.CssResolverPipeline;
import com.itextpdf.tool.xml.pipeline.end.PdfWriterPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipelineContext;
import com.lsapp.moveoffice.Const;
import com.lsapp.moveoffice.MainApplication;
import com.lsapp.moveoffice.data.WDProblem;
import com.lsapp.moveoffice.data.WDProduct;
import com.lsapp.moveoffice.data.WDSeries;
import com.lsapp.moveoffice.util.HeaderFooter;
import com.lsapp.moveoffice.util.ImageTagProcessor;
import com.lsapp.moveoffice.util.MyFontsProvider;
import com.pgyersdk.crash.PgyCrashManager;
import com.pgyersdk.javabean.AppBean;
import com.pgyersdk.update.PgyUpdateManager;
import com.pgyersdk.update.UpdateManagerListener;
import com.zuni.library.utils.zBitmapUtil;
import com.zuni.library.utils.zDateUtil;
import com.zuni.library.utils.zFileUtil;
import com.zuni.library.utils.zMD5Util;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.w3c.tidy.Tidy;

import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
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

    /**
     * common module
     */
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
        PgyUpdateManager.register(getCurrentActivity(), "lshome",
                new UpdateManagerListener() {

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
    public void getLocation(Callback callback) {
        callback.invoke(MainApplication.get(getCurrentActivity()).getAddress(),
                MainApplication.get(getCurrentActivity()).getGeoLat(),
                MainApplication.get(getCurrentActivity()).getGeoLng());
    }


    public void callLocationChange(String address, String lat, String lng) {
        WritableMap params = Arguments.createMap();
        params.putString("address", address);
        params.putString("lat", lat);
        params.putString("lng", lng);
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("callLocationChange", params);
    }

    @ReactMethod
    public void getImageBase64(String path, Callback callback) {
        callback.invoke(zBitmapUtil.bitmapToString(path, 30));
    }

    /**
     * wood develop module
     */
    @ReactMethod
    private void outputReportAction(String seriesJson,int woodOrSoft, int code, Callback callback, Callback errorCall) {
        createDir();
        Context context = getCurrentActivity();
        String TAG = "WD Print";
        Gson gson = new GsonBuilder().create();
        Log.d(TAG, seriesJson);
        try {
            String icoPath = Environment.getExternalStorageDirectory() + "/" + Const.DOWNLOAD_IMG_PATH + "ico.jpg";
            if (!zFileUtil.fileIsExists(icoPath)) {
                putImgToStorage(icoPath, "ico.jpg");
            }
            org.jsoup.nodes.Document doc;
            //  doc = Jsoup.parse(context.getResources().getAssets().open(code == 0 ? "baipi.html" : "chengp.html"), "UTF-8", "http://example.com/");
            doc = Jsoup.parse(context.getResources().getAssets().open("baipi.html"), "UTF-8", "http://example.com/");
            WDSeries series = gson.fromJson(seriesJson, WDSeries.class);
            ArrayList<WDProduct> selectList = new ArrayList<>();

            for (int i = 0; i < series.getItemlist().size(); i++) {
                if (series.getItemlist().get(i).getCheck()==1) {
                    selectList.add(series.getItemlist().get(i));
                }
            }

            Element title = doc.getElementById("title");
            Element time = doc.getElementById("time");
            Element factory = doc.getElementById("factory");
            Element product = doc.getElementById("product");
            Element material = doc.getElementById("material");
            Element quality = doc.getElementById("total_quality");
            //     Element nextTime = doc.getElementById("next_time");

            //     nextTime.html(series.getNextCheckedTime());
            String step = "";
            if (code == 0) step = woodOrSoft==1?"白胚评审":"木架";
            else if (code == 1) step = "成品评审";
            else step = "包装评审";
            title.html((woodOrSoft==1?series.getSeriesName():series.getFacName()) + step + "报告");
            time.html("评审时间：" + zDateUtil.getDateTime());
            factory.html(woodOrSoft==1?series.getFacName():"");
            quality.html(series.getsQualityText());

            //product builder
            StringBuilder productBuilder = new StringBuilder();
            int i = 1;
            for (WDProduct p : selectList) {
                //problems get
                WDProblem content = p.getProblem();
                String[] contentList = new String[]{};
                if (content == null) {
                    switch (code) {
                        case 0:
                            if (p.getpStatusResultA() != null) {
                                if (p.getpStatusResultA().contains("|"))
                                    contentList = p.getpStatusResultA().split("\\|");
                                else
                                    contentList = new String[]{p.getpStatusResultA()};
                            } else {
                                contentList = new String[]{"-"};
                            }

                            Log.d(TAG, "outputReport: APP：" + p.getpStatusResultA());
                            break;
                        case 1:
                            if (p.getpStatusResultB() != null) {
                                if (p.getpStatusResultB().contains("|"))
                                    contentList = p.getpStatusResultB().split("\\|");
                                else
                                    contentList = new String[]{p.getpStatusResultB()};
                            } else {
                                contentList = new String[]{"-"};
                            }
                            Log.d(TAG, "outputReport: APP：" + p.getpStatusResultB());
                            break;
                        case 2:
                            if (p.getpStatusResultC() != null) {
                                if (p.getpStatusResultC().contains("|"))
                                    contentList = p.getpStatusResultC().split("\\|");
                                else
                                    contentList = new String[]{p.getpStatusResultC()};
                            } else {
                                contentList = new String[]{"-"};
                            }
                            Log.d(TAG, "outputReport: APP：" + p.getpStatusResultC());
                            break;
                    }
                } else {
                    contentList = content.getProductProblems().split(Const.WD_DASH);
                    Log.d(TAG, "outputReport: db：" + content.getProductProblems());
                }
                productBuilder.append("<tr><td rowspan='" + (contentList.length) + "' align=\"center\">" + i + "</td>");             //number
                productBuilder.append("<td rowspan='" + (contentList.length) + "'><span style=\"font-size:12px;\">" + p.getItemName() + "</span></td>");                    //name
                String path = (p.getpImage() == null ?
                        icoPath :
                        (zFileUtil.getCachePath(getCurrentActivity())) + Const.CACHE_FILE_PATH + zMD5Util.getSH1(p.getpImage()) + ".jpg");
                Log.d(TAG, path);
                productBuilder.append("<td rowspan='" + (contentList.length) + "'><span style=\"font-size:12px;\">" + p.getItemRemark() + "</span></td>");//style

                productBuilder.append("<td rowspan='" + contentList.length + "'><img width=\"65\" height=\"65\" alt=\"\"src=\"data:image/png;base64,"//img
                        + zBitmapUtil.bitmapToString(path, 30) + "\"/></td>");

                //problems output
                boolean pass;
                if (code == 0)
                    pass = p.isStepAPass() == 0;
                else if (code == 1)
                    pass = p.isStepBPass() == 0;
                else
                    pass = p.isStepCPass() == 0;
                for (int j = 0; j < contentList.length; j++) {
                    if (j == 0)
                        productBuilder.append("<td><span style=\"font-size:12px;\">" + (contentList[j].length() > 2 ? contentList[j] : "-") + "</span></td>" +
                                "<td rowspan='" + (contentList.length) + "'></td>" +
                                "<td rowspan='" + (contentList.length) + "' align=\"center\">" + (pass ? "通过" : "不通过") + "</td>" +
                                "<td rowspan='" + (contentList.length) + "'></td>" +
                                //    (code == 0 ? "" : "<td rowspan='" + (contentList.length ) + "'></td>") +
                                "</tr>");
                    else
                        productBuilder.append("<tr><td><span style=\"font-size:12px;\">" + contentList[j] + "</span></td></tr>");
                }

                i++;
            }
            product.html(productBuilder.toString());

            String outputPath = Environment.getExternalStorageDirectory() + "/" + Const.DOWNLOAD_FILE_PATH + (woodOrSoft==1?series.getSeriesName():series.getFacName())+ "_" + step + ".html";
            File outputFile = new File(outputPath);
            BufferedWriter htmlWriter = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outputFile), "UTF-8"));
            htmlWriter.write(doc.html());
            htmlWriter.flush();
            htmlWriter.close();
            String finalFile = tidy(series.getSeriesName(), outputPath, code);
            System.out.println(finalFile + "**********************************************");
            callback.invoke(finalFile);
        } catch (Exception e) {
            e.printStackTrace();
            PgyCrashManager.reportCaughtException(context, e);
            errorCall.invoke("出错了！！");
        }
    }

    private String tidy(String seriesName, String path, int code) throws Exception {
        String sourcePath = Environment.getExternalStorageDirectory() + "/" + Const.DOWNLOAD_FILE_PATH + zFileUtil.getFileName(path);
        String xhtmlPath = Environment.getExternalStorageDirectory() + "/" + Const.DOWNLOAD_FILE_PATH + "temp_" + zFileUtil.getFileName(path);
        String pdfPath = Environment.getExternalStorageDirectory() + "/" + Const.DOWNLOAD_FILE_PATH + zFileUtil.getFileName(path) + ".pdf";
        String header2Path = Environment.getExternalStorageDirectory() + "/" + Const.DOWNLOAD_IMG_PATH + Const.WD_STEP1_TITLE;
        String header3Path = Environment.getExternalStorageDirectory() + "/" + Const.DOWNLOAD_IMG_PATH + Const.WD_STEP23_TITLE;


        if (!zFileUtil.fileIsExists(header2Path)) {
            putImgToStorage(header2Path, Const.WD_STEP1_TITLE_ASSETS);
        }
        if (!zFileUtil.fileIsExists(header3Path)) {
            putImgToStorage(header3Path, Const.WD_STEP23_TITLE_ASSETS);
        }

        //xhtml
        Tidy tidy = new Tidy();
        tidy.setXHTML(true);
        tidy.setHideComments(true);
        tidy.setOutputEncoding("utf-8");
        tidy.setInputEncoding("utf-8");

        File outFile = new File(xhtmlPath);

        FileOutputStream fos = new FileOutputStream(outFile);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        org.w3c.dom.Document doc = tidy.parseDOM(new FileInputStream(sourcePath), null);
        tidy.pprint(doc, out);
        fos.write(out.toByteArray());
        out.close();

        //pdf
        MyFontsProvider fontProvider = new MyFontsProvider();
        fontProvider.setUseUnicode(true);//万国编码unicode

        Document document = new Document(PageSize.A4, 10, 10, 65, 20);
        PdfWriter writer = PdfWriter.getInstance(document,
                new FileOutputStream(pdfPath));
        writer.setPdfVersion(PdfWriter.PDF_VERSION_1_7);
        Rectangle rect = new Rectangle(36, 54, 559, 788);
        rect.setBorderColor(BaseColor.BLACK);
        writer.setBoxSize("art", rect);
        HeaderFooter header = new HeaderFooter(getCurrentActivity(), code, seriesName, fontProvider);
        writer.setPageEvent(header);

        document.open();
        CssAppliers cssAppliers = new CssAppliersImpl(fontProvider);//字体
        CSSResolver cssResolver =
                XMLWorkerHelper.getInstance().getDefaultCssResolver(true);
        HtmlPipelineContext htmlContext = new HtmlPipelineContext(cssAppliers);
        htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());
        htmlContext.setImageProvider(new ImageTagProcessor());

        PdfWriterPipeline pdf = new PdfWriterPipeline(document, writer);
        HtmlPipeline htmlPipeline = new HtmlPipeline(htmlContext, pdf);
        CssResolverPipeline css = new CssResolverPipeline(cssResolver, htmlPipeline);

        XMLWorker worker = new XMLWorker(css, true);
        XMLParser p = new XMLParser(worker);
        File html = new File(xhtmlPath);
        p.parse(new InputStreamReader(new FileInputStream(html), "UTF-8"));
        document.close();
      //  zFileUtil.delSingleFile(xhtmlPath);
        File htmlFile = new File(sourcePath);
        boolean f1 = outFile.delete();
        boolean f2 = htmlFile.delete();
        System.out.println("PDF Created!");
        return pdfPath;
    }

    private void putImgToStorage(String path, String title) throws Exception {
        byte[] buffer = new byte[512];
        int numberRead;
        File outputFile = new File(path);
        FileOutputStream os = new FileOutputStream(outputFile);
        InputStream is = getCurrentActivity().getResources().getAssets().open(title);
        while ((numberRead = is.read(buffer)) != -1) {
            os.write(buffer, 0, numberRead);
        }
        os.close();
        is.close();
    }

    private void createDir() {
        File dPath = new File(Environment.getExternalStorageDirectory(), Const.DOWNLOAD_FILE_PATH);
        File iPath = new File(Environment.getExternalStorageDirectory(), Const.DOWNLOAD_IMG_PATH);
        File sPath = new File(Environment.getExternalStorageDirectory(), Const.IMAGE_SOURCE_PATH);
        if (!dPath.exists()) {
            dPath.mkdirs();
        }
        if (!iPath.exists()) {
            iPath.mkdirs();
        }
        if (!sPath.exists()) {
            sPath.mkdirs();
        }
    }

    @ReactMethod
    public void getAllPrint(Callback callback, Callback error) {
        String filePath = Environment.getExternalStorageDirectory() + "/" + Const.DOWNLOAD_FILE_PATH;
        Gson gson = new Gson();
        try {
            ArrayList<String> paths = new ArrayList<>();
            File f = new File(filePath);
            File[] files = f.listFiles();// 列出所有文件
            if (files != null) {
                for (File file : files) {
                    paths.add(file.getPath());
                }
            }
            callback.invoke(gson.toJson(paths));
        } catch (Exception e) {
            e.printStackTrace();
            error.invoke("出错了！");
        }
    }

    @ReactMethod
    public void openOfficeFile(String path) {
        Uri uri = Uri.fromFile(new File(path));
        String extension = android.webkit.MimeTypeMap.getFileExtensionFromUrl(uri.toString());
        String mimetype = android.webkit.MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        Intent intent = new Intent("android.intent.action.VIEW");
        intent.addCategory("android.intent.category.DEFAULT");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (extension.equalsIgnoreCase("") || mimetype == null) {
            intent.setDataAndType(uri, "text/*");
        } else {
            intent.setDataAndType(uri, mimetype);
        }
        getCurrentActivity().startActivity(Intent.createChooser(intent, "打开方式"));
    }

    @ReactMethod
    public void shereFile(String path) {
        Uri uri = Uri.fromFile(new File(path));
        Intent share = new Intent(Intent.ACTION_SEND);
        share.putExtra(Intent.EXTRA_STREAM, uri);
        share.setType("*/*");
        getCurrentActivity().startActivity(Intent.createChooser(share, path));
    }


    //demo
    @ReactMethod
    public void show() {
        Toast.makeText(getCurrentActivity(), "test", Toast.LENGTH_SHORT).show();
    }
}
