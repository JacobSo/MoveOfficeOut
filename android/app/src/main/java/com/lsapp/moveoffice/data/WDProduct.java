package com.lsapp.moveoffice.data;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by Administrator on 2016/5/13.
 */
public class WDProduct implements Serializable {
    private String ItemGuid;
    private String ItemName;
    private String ProjectNo;
    private String ItemRemark;
    private String pSize;
    private String pImage;
    private boolean pStatusPass;
    private int pStatus;
    private String pStatusResultA;
    private String pStatusResultB;
    private String pStatusResultC;
    private ArrayList<String> pStatusPicA;
    private ArrayList<String> pStatusPicB;
    private ArrayList<String> pStatusPicC;
    private String pResultList;//step-code,step-code,step-code
    private int stage;//001-1,010-2,011-3,100-4,101-5,110-6,111-7
    //react param
    private int check;
    private int wdp_id;
    private String wdp_index;

    public String getWdp_index() {
        return wdp_index;
    }

    public void setWdp_index(String wdp_index) {
        this.wdp_index = wdp_index;
    }

    public boolean ispStatusPass() {
        return pStatusPass;
    }

    public void setpStatusPass(boolean pStatusPass) {
        this.pStatusPass = pStatusPass;
    }

    public int getWdp_id() {
        return wdp_id;
    }

    public void setWdp_id(int wdp_id) {
        this.wdp_id = wdp_id;
    }

    private WDProblem problem;

    public WDProblem getProblem() {
        return problem;
    }

    public void setProblem(WDProblem problem) {
        this.problem = problem;
    }


    public int getCheck() {
        return check;
    }

    public void setCheck(int check) {
        this.check = check;
    }

    public String getpResultList() {
        return pResultList;
    }

    public void setpResultList(String pResultList) {
        this.pResultList = pResultList;
    }

    public String getStatusName(int status) {
        if (status == 0)
            return "白胚评审";
        else if (status == 1)
            return "成品评审";
        else if (status == 2)
            return "包装评审";
        else {
            return "-";
        }
    }

    public boolean isBegin() {
        return pResultList != null && !pResultList.equals("");
    }

    //0:pass,1:fail,2:un
    public int isStepCPass() {
        if (isBegin()) {
            if (pResultList.contains("2-1"))
                return 0;
            else if (pResultList.contains("2-0"))
                return 1;
            else
                return 2;
        } else
            return 2;

        // return ispStatusPass()&&getpStatus()==2;
    }

    public boolean isAllFinish() {
        if (pResultList != null) {
            if (stage == 7) {//all
                String[] temp = pResultList.split(",");
                return temp.length == 3;
            } else if (stage == 6) {//a,b
                return isStepAPass() == 0 && isStepBPass() == 0;
            } else if (stage == 5) {//a,c
                return isStepAPass() == 0 && isStepCPass() == 0;
            } else if (stage == 4) {//a
                return isStepAPass() == 0;
            } else if (stage == 3) {//b,c
                return isStepCPass() == 0 && isStepBPass() == 0;
            } else if (stage == 2) {//b
                return isStepBPass() == 0;
            } else if (stage == 1) {//c
                return isStepCPass() == 0;
            } else return false;

        } else return false;
    }

    public int isStepAPass() {
        if (isBegin()) {
            if (pResultList.contains("0-1")) {
                return 0;
            } else if (pResultList.contains("0-0")) {
                return 1;
            } else return 2;
        } else
            return 2;
        //  return (ispStatusPass() && getpStatus() == 0) || getpStatus() > 0;
    }

    public int isStepBPass() {
        if (isBegin()) {
            if (pResultList.contains("1-1")) {
                return 0;
            } else if (pResultList.contains("1-0")) {
                return 1;
            } else {
                return 2;
            }
        } else {
            return 2;
        }
        // return (ispStatusPass() && getpStatus() == 1) || getpStatus() > 1;
    }

    public boolean isAllPass() {
        return isStepAPass() == 0 && isStepBPass() == 0 && isStepCPass() == 0;
    }

/*    public String getNextName() {
        if (!isStepAPass())
            return "白胚评审";
        else {//A PASS
            if (!isStepBPass())
                return "成品评审";
            else//C PASS
                return "包装评审";
        }
    }

    public int getNextNameCode() {
        if (!isStepAPass())
            return 0;
        else {
            if (!isStepBPass())
                return 1;
            else
                return 2;
        }
    }*/

    public String getpSize() {
        return pSize;
    }

    public void setpSize(String pSize) {
        this.pSize = pSize;
    }

    public String getItemGuid() {
        return ItemGuid;
    }

    public void setItemGuid(String itemGuid) {
        ItemGuid = itemGuid;
    }

    public String getItemName() {
        return ItemName;
    }

    public void setItemName(String itemName) {
        ItemName = itemName;
    }

    public String getProjectNo() {
        return ProjectNo;
    }

    public void setProjectNo(String projectNo) {
        ProjectNo = projectNo;
    }

    public String getItemRemark() {
        return ItemRemark;
    }

    public void setItemRemark(String itemRemark) {
        ItemRemark = itemRemark;
    }

    public String getpImage() {
        return pImage;
    }

    public void setpImage(String pImage) {
        this.pImage = pImage;
    }


    public int getpStatus() {
        return pStatus;
    }

    public void setpStatus(int pStatus) {
        this.pStatus = pStatus;
    }

    public String getpStatusResultA() {
        return pStatusResultA == null ? "" : pStatusResultA;
    }

    public void setpStatusResultA(String pStatusResultA) {
        this.pStatusResultA = pStatusResultA;
    }

    public String getpStatusResultB() {
        return pStatusResultB == null ? "" : pStatusResultB;
    }

    public void setpStatusResultB(String pStatusResultB) {
        this.pStatusResultB = pStatusResultB;
    }

    public String getpStatusResultC() {
        return pStatusResultC == null ? "" : pStatusResultC;
    }

    public void setpStatusResultC(String pStatusResultC) {
        this.pStatusResultC = pStatusResultC;
    }

    public ArrayList<String> getpStatusPicA() {
        return pStatusPicA;
    }

    public void setpStatusPicA(ArrayList<String> pStatusPicA) {
        this.pStatusPicA = pStatusPicA;
    }

    public ArrayList<String> getpStatusPicB() {
        return pStatusPicB;
    }

    public void setpStatusPicB(ArrayList<String> pStatusPicB) {
        this.pStatusPicB = pStatusPicB;
    }

    public ArrayList<String> getpStatusPicC() {
        return pStatusPicC;
    }

    public void setpStatusPicC(ArrayList<String> pStatusPicC) {
        this.pStatusPicC = pStatusPicC;
    }


    public int getStage() {
        return stage;
    }

    public void setStage(int stage) {
        this.stage = stage;
    }
}
