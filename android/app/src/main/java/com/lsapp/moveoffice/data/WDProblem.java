package com.lsapp.moveoffice.data;

/**
 * Created by Administrator on 2016/5/23.
 */
public class WDProblem {
    //"fileName":"[\n  {\n    \"phaseCode\" : 0,\n    \"pGuid\" : \"a90251cd-0288-4ab2-ac89-fc239ca26c95\",\n    \"pResult\" : 1,\n    \"productProblems\" : \"1、问题1|2、问题2\"\n  }

    private int phaseCode;
    private String pGuid;
    private int pResult;
    private String productProblems="";

    public WDProblem(int phaseCode, String pGuid, int pResult, String productProblems) {
        this.phaseCode = phaseCode;
        this.pGuid = pGuid;
        this.pResult = pResult;
        this.productProblems = productProblems;
    }

    public int getPhaseCode() {
        return phaseCode;
    }

    public void setPhaseCode(int phaseCode) {
        this.phaseCode = phaseCode;
    }

    public int getpResult() {
        return pResult;
    }

    public void setpResult(int pResult) {
        this.pResult = pResult;
    }

    public String getpGuid() {
        return pGuid;
    }

    public void setpGuid(String pGuid) {
        this.pGuid = pGuid;
    }



    public String getProductProblems() {
        return productProblems;
    }

    public void setProductProblems(String productProblems) {
        this.productProblems = productProblems;
    }
}
