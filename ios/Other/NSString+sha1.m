//
//  NSString+sha1.m
//  MoveOfficeOut
//
//  Created by ls on 2017/6/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "NSString+sha1.h"

@implementation NSString (sha1)

- (NSString*) sha1
{
  const char *cstr = [self cStringUsingEncoding:NSUTF8StringEncoding];
  NSData *data = [NSData dataWithBytes:cstr length:self.length];
  
  uint8_t digest[CC_SHA1_DIGEST_LENGTH];
  
  CC_SHA1(data.bytes, data.length, digest);
  
  NSMutableString* output = [NSMutableString stringWithCapacity:CC_SHA1_DIGEST_LENGTH * 2];
  
  for(int i = 0; i < CC_SHA1_DIGEST_LENGTH; i++)
    [output appendFormat:@"%02x", digest[i]];
  
  return output;
}

@end
