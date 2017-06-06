//
//  WDProduct.h
//  moveoffice
//
//  Created by ZHUOQIN on 16/5/17.
//  Copyright © 2016年 ZHUOQIN. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WDProductReView.h"
#import "PlateTrackImgUpload_Request.h"


typedef NS_ENUM(NSInteger, WD_isPrint_Emun) {
    WD_NO_PRINT_BP = 0,
    WD_YES_PRINT_CP
};

@interface WDProduct : NSObject

@property (nonatomic,readwrite,copy)NSString *ItemGuid;
/*20160618新增 用于判断每一个阶段的评审状态*/
@property (nonatomic,readwrite,copy)NSString *pResultList;
@property (nonatomic,readwrite,copy)NSString *pImage;
@property (nonatomic,readwrite,copy)NSString *ItemName;
@property (nonatomic,readwrite,copy)NSString *ProjectNo;
@property (nonatomic,readwrite,copy)NSString *pSize;
@property (nonatomic,readwrite,copy)NSString *ItemRemark;

@property (nonatomic,readwrite,copy)NSMutableArray <NSString *> *pStatusPicA;
@property (nonatomic,readwrite,copy)NSMutableArray <NSString *> *pStatusPicB;
@property (nonatomic,readwrite,copy)NSMutableArray <NSString *> *pStatusPicC;

@property (nonatomic,readwrite,copy)NSString *pStatusResultA;
@property (nonatomic,readwrite,copy)NSString *pStatusResultB;
@property (nonatomic,readwrite,copy)NSString *pStatusResultC;

@property (nonatomic,assign,readwrite)WD_Result_Emun pStatusPass;

@property (nonatomic,assign,readwrite)WD_Phase_Emun pStatus;


@property (nonatomic,assign,readwrite)WD_isPrint_Emun isPrint;

@property (nonatomic,assign) NSInteger stage;
/**
 check为true时为打印，为false，不打印
 */
@property (nonatomic,readwrite,assign) BOOL check;

@end

