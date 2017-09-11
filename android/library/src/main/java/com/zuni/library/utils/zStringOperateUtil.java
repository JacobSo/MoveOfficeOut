package com.zuni.library.utils;

/**
 * Created by Jacob So on 2015/12/4.
 */
public class zStringOperateUtil {
    public static String deleteHtmlImgElement(String html)
    {
        String destStr = html.replaceAll("<img.*>.*</img>", "").replaceAll(
                "<img.*/>", "");
        return destStr;
    }

    public static String deltctEmptyStr(String str)
    {
        StringBuilder result = new StringBuilder();

        String match = "[ \\t\\n\\x0B\\f\\r]";
        for (int i = 0; i < str.length(); i++)
        {
            String s = str.substring(i, i + 1);
            if (!s.matches(match)) {
                result.append(s);
            }
        }
        return result.toString();
    }
}
