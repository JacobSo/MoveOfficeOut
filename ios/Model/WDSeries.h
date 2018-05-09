//
//  WDSeries.h
//  moveoffice
//
//  Created by ZHUOQIN on 16/5/17.
//  Copyright © 2016年 ZHUOQIN. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WDProduct.h"
#import "WDMaterial.h"


typedef NS_ENUM(NSInteger, WD_Status_Emun) {
    WD_Status_Begin = 0,
    WD_Status_A,
    WD_Status_B,
    WD_Status_C,
    WD_Status_Finish
};

@interface WDSeries : NSObject

@property (nonatomic,readwrite,assign)BOOL isFin;
@property (nonatomic,readwrite,copy)NSString *sFactoryCall;

@property (nonatomic,readwrite,copy)NSMutableArray <WDProduct *> *Itemlist;

//@property (nonatomic,readwrite,assign)WD_Status_Emun State;
@property (nonatomic,readwrite,copy)NSString *Latitude;
@property (nonatomic,readwrite,copy)NSString *SeriesName;
@property (nonatomic,readwrite,copy)NSString *SeriesGuid;
@property (nonatomic,readwrite,copy)NSString *FacName;
@property (nonatomic,readwrite,copy)NSString *sQualityText;//整体要求
@property (nonatomic,readwrite,copy)NSMutableArray<WDMaterial *> *sMaterialText;//材料信息
@property (nonatomic,readwrite,copy)NSString *Longitude;
@property (nonatomic,readwrite,copy)NSString *uniqueIdentifier;
@property (nonatomic,readwrite,copy)NSString *sFactoryAdress;
@property (nonatomic,readwrite,copy)NSString *Appointtime;
@property (nonatomic,readwrite,copy)NSString *NextCheckedTime;


@property (nonatomic,strong) NSNumber* State;


@end


