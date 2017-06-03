//
//  ReactCommonModule.m
//  MoveOfficeOut
//
//  Created by ls on 2017/3/30.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ReactCommonModule.h"
#import <CloudPushSDK/CloudPushSDK.h>
#import <PgySDK/PgyManager.h>
#import <PgyUpdate/PgyUpdateManager.h>

#import "AppDelegate.h"


@implementation ReactCommonModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(bindPushAccount:(NSString *)account)
{
//  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
 
  [CloudPushSDK bindAccount:account
               withCallback:^(CloudPushCallbackResult *res){
                 NSLog(@"绑定成功%@",account);
               }];
}


RCT_EXPORT_METHOD(unbindPushAccount:(NSString *)un)
{
  //  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);

  
  [CloudPushSDK unbindAccount:^(CloudPushCallbackResult *res) {
     NSLog(@"解绑成功");
  }];
  
}


RCT_EXPORT_METHOD(checkUpdate:(NSString *)un)
{
  NSLog(@"check update");
 // [[PgyUpdateManager sharedPgyManager]startManagerWithAppId:@"662cbac6fcc48aca832a63511afdc0bc"];
  [[PgyUpdateManager sharedPgyManager]checkUpdate];
 // [[PgyUpdateManager sharedPgyManager] checkUpdateWithDelegete:self selector:@selector(updateMethod:)];
  
}



RCT_EXPORT_METHOD(getVersionName:(RCTResponseSenderBlock)callback)
{
  NSString *appCurVersion = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];

  NSLog(@"当前应用软件版本:%@",appCurVersion);
 callback(@[appCurVersion]);
}

RCT_EXPORT_METHOD(getShareUser:(RCTResponseSenderBlock)callback)
{

  NSString *user = ((AppDelegate *)[UIApplication sharedApplication].delegate).userName;
  NSString *pwd = ((AppDelegate *)[UIApplication sharedApplication].delegate).password;
  NSArray *arrays = [NSArray arrayWithObjects:user,pwd,nil];
  callback(arrays);

}

RCT_EXPORT_METHOD(getImageBase64:(NSString *)path:(RCTResponseSenderBlock)callback)
{
  //NSString *path2 = [[NSHomeDirectory() stringByAppendingPathComponent:@"Documents"]stringByAppendingPathComponent:@"headimg.png"];
  //NSLog(@"图片:%@",path2);
  NSLog(@"图片:%@",path);
   //UIImage图片转成Base64字符串：
  NSData *data = [NSData dataWithContentsOfFile:path];
  UIImage *img = [UIImage imageWithData:data];
  NSData *pic = UIImageJPEGRepresentation(img, 0.3f);
  NSString *encodedImageStr = [pic base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
 // NSLog(@"encodedImageStr==%@",encodedImageStr);
  NSArray *arrays = [NSArray arrayWithObjects:encodedImageStr,nil];
  callback(arrays);
  
}


RCT_EXPORT_METHOD(logoutShareAccount){
  ((AppDelegate *)[UIApplication sharedApplication].delegate).userName = nil;
 ((AppDelegate *)[UIApplication sharedApplication].delegate).password = nil;

  
}

@end



