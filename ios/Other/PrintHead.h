//
//  PrintHead.h
//  CreatPDF_demo
//
//  Created by ZHUOQIN on 16/5/6.
//  Copyright © 2016年 ZHUOQIN. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface PrintHead : UIPrintPageRenderer

@property (nonatomic,strong)NSString *docName;
@property (nonatomic,assign)NSInteger pageSum;

@property (nonatomic,assign)BOOL isBPPS;

@end
