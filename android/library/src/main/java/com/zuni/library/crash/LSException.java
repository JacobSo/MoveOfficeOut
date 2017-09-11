package com.zuni.library.crash;

/**
 * Created by Administrator on 2016/4/26.
 */
public class LSException extends Exception{
    public LSException(Throwable throwable) {
        super(throwable);
    }

    public LSException(String detailMessage, Throwable throwable) {
        super(detailMessage, throwable);
    }

    public LSException() {
        super();
    }

    public LSException(String detailMessage) {
        super(detailMessage);
    }
}
