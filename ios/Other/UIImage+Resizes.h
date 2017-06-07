//
//  UIImage+Resizes.h
//  MoveOfficeOut
//
//  Created by ls on 2017/6/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIImage (Resizes)

-(UIImage*)resizedImageToSize:(CGSize)dstSize;
-(UIImage*)resizedImageToFitInSize:(CGSize)boundingSize scaleIfSmaller:(BOOL)scale;

@end
