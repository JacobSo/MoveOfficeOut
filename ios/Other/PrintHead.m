//
//  PrintHead.m
//  CreatPDF_demo
//
//  Created by ZHUOQIN on 16/5/6.
//  Copyright © 2016年 ZHUOQIN. All rights reserved.
//

#import "PrintHead.h"
#import "Utils.h"


@interface PrintHead()

@property (nonatomic,strong)NSString *dataString;

@property (nonatomic,strong)NSString *deviceID;

@end


@implementation PrintHead

//- (void)drawHeaderForPageAtIndex:(NSInteger)pageIndex inRect:(CGRect)headerRect{
//    if(pageIndex != 0){
//        NSString *imageName = _isBPPS ? @"Title_H1":@"Title_H2";
//        UIImage *image = [UIImage imageNamed:imageName];
//        [image drawInRect:headerRect];
//    }
////    else{
////        CGRect pageHead = CGRectMake(30, 10, 94, 30);
////        UIImage *image = [UIImage imageNamed:@"logo_ls"];
////        [image drawInRect:pageHead];
////    }
//}


- (void)drawFooterForPageAtIndex:(NSInteger)pageIndex inRect:(CGRect)footerRect{
    NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc]init];
    style.alignment = NSTextAlignmentCenter;
    
    
    NSDictionary *nameAttributes = @{
                                     NSFontAttributeName : [UIFont systemFontOfSize:10],
                                     NSForegroundColorAttributeName:[UIColor grayColor],
                                     NSParagraphStyleAttributeName: style};
    NSString *footTxt = [NSString stringWithFormat:@"第%ld页 共%ld页",pageIndex + 1,(long)self.pageSum];
    [footTxt drawInRect:footerRect withAttributes:nameAttributes];
}

- (NSString *)dataString{
    if (!_dataString) {
        self.dataString = [Utils kNowTime];
    }
    return _dataString;
}

- (NSString *)deviceID{
    if (!_deviceID) {
        NSString *uuID = [UIDevice currentDevice].identifierForVendor.UUIDString;
        _deviceID = uuID;
    }
    return _deviceID;
}

@end
