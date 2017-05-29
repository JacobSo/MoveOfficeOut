package com.lsapp.moveoffice.data;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by Administrator on 2016/5/13.
 */
public class WDSeries implements Serializable {
    private String SeriesGuid;
    private String SeriesName;
    private String FacName;
    private String sFactoryAdress;
    //uniqueIdentifier
    //Latitude
    //Longitude


    private String Appointtime;
    private String NextCheckedTime;

    private String sQualityText;
    private ArrayList<WDMaterial> sMaterialText;

    private int isFin;
    private String sFactoryCall;
    private ArrayList<WDProduct> Itemlist;
    private int State;

    private int aNum = 0;
    private int bNum = 0;
    private int cNum = 0;

    private int wd_id;

    public int getIsFin() {
        return isFin;
    }

    public void setIsFin(int isFin) {
        this.isFin = isFin;
    }

    public int getWd_id() {
        return wd_id;
    }

    public void setWd_id(int wd_id) {
        this.wd_id = wd_id;
    }

    public String getDefaultNum() {
        return getItemlist().size() + "";
    }

    // a pass
    public String getaNum() {
        aNum = 0;

        for (WDProduct p : Itemlist) {
            switch (p.isStepAPass()) {
                case 0:
                    aNum++;
                    break;
            }
        }
        return aNum + "";
    }

    public void setaNum(int aNum) {
        this.aNum = aNum;
    }

    //b pass
    public String getbNum() {
        bNum = 0;

        for (WDProduct p : Itemlist) {
            switch (p.isStepBPass()) {
                case 0:
                    bNum++;
                    break;
            }
        }
        return bNum + "";
    }

    public void setbNum(int bNum) {
        this.bNum = bNum;
    }

    //c pass
    public String getcNum() {
        cNum = 0;
        for (WDProduct p : Itemlist) {
            switch (p.isStepCPass()) {
                case 0:
                    cNum++;
                    break;
            }
        }
        return cNum + "";
    }

    public void setcNum(int cNum) {
        this.cNum = cNum;
    }




    public String getSeriesGuid() {
        return SeriesGuid;
    }

    public void setSeriesGuid(String seriesGuid) {
        SeriesGuid = seriesGuid;
    }

    public String getSeriesName() {
        return SeriesName;
    }

    public void setSeriesName(String seriesName) {
        SeriesName = seriesName;
    }

    public String getFacName() {
        return FacName;
    }

    public void setFacName(String facName) {
        FacName = facName;
    }

    public int getState() {
        return State;
    }

    public void setState(int state) {
        State = state;
    }

    public String getAppointtime() {
        return Appointtime == null || Appointtime.equals("") ? "-" : Appointtime;
    }

    public void setAppointtime(String appointtime) {
        Appointtime = appointtime;
    }

    public ArrayList<WDProduct> getItemlist() {
        return Itemlist;
    }

    public void setItemlist(ArrayList<WDProduct> itemlist) {
        Itemlist = itemlist;
    }

    public String getsQualityText() {
        return sQualityText == null || sQualityText.equals("") ? "-" : sQualityText;
    }

    public void setsQualityText(String sQualityText) {
        this.sQualityText = sQualityText;
    }

    public ArrayList<WDMaterial> getsMaterialText() {
        return sMaterialText;
    }

    public void setsMaterialText(ArrayList<WDMaterial> sMaterialText) {
        this.sMaterialText = sMaterialText;
    }

    public String getsFactoryAdress() {
        return sFactoryAdress;
    }

    public void setsFactoryAdress(String sFactoryAdress) {
        this.sFactoryAdress = sFactoryAdress;
    }

    public String getNextCheckedTime() {
        return NextCheckedTime == null || NextCheckedTime.equals("") ? "-" : NextCheckedTime;
    }

    public void setNextCheckedTime(String nextCheckedTime) {
        NextCheckedTime = nextCheckedTime;
    }

    public String getsFactoryCall() {
        return sFactoryCall;
    }

    public void setsFactoryCall(String sFactoryCall) {
        this.sFactoryCall = sFactoryCall;
    }

}
