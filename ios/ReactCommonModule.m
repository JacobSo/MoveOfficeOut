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

@end



