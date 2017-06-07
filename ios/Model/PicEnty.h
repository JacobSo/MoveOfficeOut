//
//  PicEnty.h
//  moveoffice
//
//  Created by ZHUOQIN on 16/5/18.
//  Copyright © 2016年 ZHUOQIN. All rights reserved.
//

#import <Foundation/Foundation.h>


typedef NS_ENUM(NSInteger, WD_Phase_Emun) {
//    WD_Phase_NULL = -1,
    WD_Phase_BP,
    WD_Phase_CP,
    WD_Phase_BZ
};

@interface PicEnty : NSObject

@property (nonatomic,copy,readwrite)NSString *imgCode;
@property (nonatomic,copy,readwrite)NSString *fileName;
@property (nonatomic,copy,readwrite)NSString *ParaGuid;
@property (nonatomic,assign,readwrite)WD_Phase_Emun phaseCode;

@end
