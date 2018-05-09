//
//  WDSeries.m
//  moveoffice
//
//  Created by ZHUOQIN on 16/5/17.
//  Copyright © 2016年 ZHUOQIN. All rights reserved.
//

#import "WDSeries.h"

@implementation WDSeries

+ (NSDictionary *)objectClassInArray{
    return  @{
              @"Itemlist":@"WDProduct",
              @"sMaterialText":@"WDMaterial"
              };
}

@end
