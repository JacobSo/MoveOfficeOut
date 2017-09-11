package com.zuni.library.utils;

import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.app.Dialog;
import android.content.Context;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.view.Gravity;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;
import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;
import android.widget.ProgressBar;
import android.widget.TextView;
/**
 * Created by Jacob So on 2015/12/4.
 */
public class zDialogUtil {

        public static Dialog create(Context context, Object tipText, Object color, Integer frameBgImage, Integer loadingImage, int orientation)
        {
            Dialog dialog = new AlertDialog.Builder(context).create();
            dialog.setCanceledOnTouchOutside(false);
            LinearLayout view = new LinearLayout(context);
            if (orientation == 2) {
                view.setOrientation(LinearLayout.VERTICAL);
            } else {
                view.setOrientation(LinearLayout.HORIZONTAL);
            }
            if (frameBgImage != null) {
                view.setBackgroundResource(frameBgImage.intValue());
            }
            ProgressBar progressBar = new ProgressBar(context);
            if (loadingImage != null)
            {
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-2, -2);
                int margin = zUnitUtil.dp2px(context, 10.0F);
                params.bottomMargin = margin;
                params.topMargin = margin;
                params.leftMargin = margin;
                params.rightMargin = margin;
                progressBar.setLayoutParams(params);
                BitmapDrawable drawable = new BitmapDrawable(BitmapFactory.decodeResource(context.getResources(), loadingImage.intValue()));
                progressBar.setIndeterminateDrawable(drawable);
                RotateAnimation rotateAnimation = new RotateAnimation(0.0F, 360.0F, 1, 0.5F, 1, 0.5F);
                rotateAnimation.setDuration(2000L);
                rotateAnimation.setInterpolator(new LinearInterpolator());
                rotateAnimation.setRepeatCount(Integer.MAX_VALUE);
                progressBar.setAnimation(rotateAnimation);
            }
            view.addView(progressBar);
            if ((tipText != null) && (!"".equals(tipText)))
            {
                LinearLayout.LayoutParams tvLayoutParams = new LinearLayout.LayoutParams(-2, -2);
                if (orientation == 2) {
                    tvLayoutParams.gravity = Gravity.CENTER_HORIZONTAL;
                } else {
                    tvLayoutParams.gravity =  Gravity.CENTER_VERTICAL;
                }
                TextView tv = new TextView(context);
                tv.setLayoutParams(tvLayoutParams);
                if ((color != null) && (parseColor(context, color) != null)) {
                    tv.setTextColor(parseColor(context, color).intValue());
                }
                tv.setText(parse(context, tipText));
                view.addView(tv);
            }
            dialog.show();
            dialog.setContentView(view);
            return dialog;
        }

        private static String parse(Context context, Object text)
        {
            if ((text instanceof Integer)) {
                return context.getString(((Integer)text).intValue());
            }
            if ((text instanceof String)) {
                return text.toString();
            }
            return null;
        }

        private static Integer parseColor(Context context, Object color)
        {
            if ((color instanceof Integer)) {
                return (Integer)color;
            }
            if ((color instanceof String)) {
                return Integer.valueOf(Color.parseColor(color.toString()));
            }
            return null;
        }
    }

