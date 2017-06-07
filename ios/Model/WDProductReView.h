//
//  WDProductReView.h
//  moveoffice
//
//  Created by ZHUOQIN on 16/5/17.
//  Copyright © 2016年 ZHUOQIN. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PlateTrackImgUpload_Request.h"

typedef NS_ENUM(int, WD_Result_Emun) {
    WD_Result_Null = -1,
    WD_Result_Fail = 0,
    WD_Result_Pass = 1
};

@interface WDProductReView : NSObject

@property (nonatomic,copy,readwrite)NSString *pGuid;
@property (nonatomic,assign,readwrite)WD_Result_Emun pResult;
@property (nonatomic,assign,readwrite)WD_Phase_Emun phaseCode;
@property (nonatomic,copy,readwrite)NSString *productProblems;

@end
