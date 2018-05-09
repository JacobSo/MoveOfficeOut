//
//  NSString+sha1.h
//  MoveOfficeOut
//
//  Created by ls on 2017/6/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <CommonCrypto/CommonDigest.h>

@interface NSString (sha1)

- (NSString*) sha1;
@end
