//
//  BMYF_Phase_CollectionViewController.h
//  moveoffice
//
//  Created by ZHUOQIN on 16/5/12.
//  Copyright © 2016年 ZHUOQIN. All rights reserved.
//

#import <UIKit/UIKit.h>


typedef NS_ENUM(NSInteger, PhaseTypeEnum) {
    PhaseType_BP = 0,
    PhaseType_CP,
    PhaseType_BZ
};

@interface BMYF_Phase_CollectionViewController : UICollectionViewController


@property (nonatomic,assign)PhaseTypeEnum phaseType;
@property (nonatomic,readwrite,copy)NSMutableArray <WDProduct *> *selectProductlist;
@property (nonatomic,strong)NSString *serictGuid;

@end
