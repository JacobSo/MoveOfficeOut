/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <CloudPushSDK/CloudPushSDK.h>
#import <PgySDK/PgyManager.h>
#import <PgyUpdate/PgyUpdateManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  
#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
    jsCodeLocation = [CodePush bundleURL];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"MoveOfficeOut"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [self initCloudPush];
  
  [self registerAPNS:application];
  [self registerMessageReceive];
  [CloudPushSDK sendNotificationAck:launchOptions];
  
  [self pgyUpdateSEL];
  return YES;
}


-(BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  NSString *canshu = url.absoluteString;
  NSString *ceShiString = [canshu substringFromIndex:9];
  NSString *strA = [ceShiString stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
  NSArray *array = [strA componentsSeparatedByString:@"?"];
  
//username
  NSString *username = array[0];
  NSString *password = array.lastObject;
  
  NSLog(@"%@-%@",username,password);
  self.userName = username;
  self.password = password;
  
  
  self.arrays = [NSMutableArray arrayWithObjects:username,password,nil];
  
  return NO;
}



-(void)pgyUpdateSEL
{
  [[PgyManager sharedPgyManager]startManagerWithAppId:@"662cbac6fcc48aca832a63511afdc0bc"];
 
  [[PgyManager sharedPgyManager]setEnableFeedback:NO];
  //update
   [[PgyUpdateManager sharedPgyManager]startManagerWithAppId:@"662cbac6fcc48aca832a63511afdc0bc"];
  [[PgyUpdateManager sharedPgyManager]checkUpdate];
}


- (void)initCloudPush {
  // SDK初始化
  [CloudPushSDK asyncInit:@"23667939" appSecret:@"a52a91a03ca77a0fa35f88b90cc6746f" callback:^(CloudPushCallbackResult *res) {
    if (res.success) {
      NSLog(@"Push SDK init success, deviceId: %@.", [CloudPushSDK getDeviceId]);
    } else {
      NSLog(@"Push SDK init failed, error: %@", res.error);
    }
  }];
}


/**
 *    注册苹果推送，获取deviceToken用于推送
 *
 *    @param     application
 */
- (void)registerAPNS:(UIApplication *)application {
  if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
    // iOS 8 Notifications
    [application registerUserNotificationSettings:
     [UIUserNotificationSettings settingsForTypes:
      (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge)
                                       categories:nil]];
    [application registerForRemoteNotifications];
  }
  else {
    // iOS < 8 Notifications
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
     (UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound)];
  }
  application.applicationIconBadgeNumber = 0;

}


/*
 *  苹果推送注册成功回调，将苹果返回的deviceToken上传到CloudPush服务器
 */
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [CloudPushSDK registerDevice:deviceToken withCallback:^(CloudPushCallbackResult *res) {
    if (res.success) {
      NSLog(@"Register deviceToken success.");
    } else {
      NSLog(@"Register deviceToken failed, error: %@", res.error);
    }
  }];
}


/*
 *  苹果推送注册失败回调
 */
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"didFailToRegisterForRemoteNotificationsWithError %@", error);
}


/**
 *    注册推送消息到来监听
 */
- (void)registerMessageReceive {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(onMessageReceived:)
                                               name:@"CCPDidReceiveMessageNotification"
                                             object:nil];
}


/**
 *    处理到来推送消息
 *
 *    @param     notification
 */
- (void)onMessageReceived:(NSNotification *)notification {
  CCPSysMessage *message = [notification object];
  NSString *title = [[NSString alloc] initWithData:message.title encoding:NSUTF8StringEncoding];
  NSString *body = [[NSString alloc] initWithData:message.body encoding:NSUTF8StringEncoding];
  NSLog(@"Receive message title: %@, content: %@.", title, body);
}


/*
 *  App处于启动状态时，通知打开回调
 */
- (void)application:(UIApplication*)application didReceiveRemoteNotification:(NSDictionary*)userInfo {
  NSLog(@"Receive one notification.");
  // 取得APNS通知内容
  NSDictionary *aps = [userInfo valueForKey:@"aps"];
  // 内容
  NSString *content = [aps valueForKey:@"alert"];
  // badge数量
//  NSInteger badge = 0;//[[aps valueForKey:@"badge"] integerValue];
  // 播放声音
  NSString *sound = [aps valueForKey:@"sound"];
  // 取得Extras字段内容
  NSString *Extras = [userInfo valueForKey:@"Extras"]; //服务端中Extras字段，key是自己定义的
  NSLog(@"content = [%@], sound = [%@], Extras = [%@]", content, sound, Extras);
  // iOS badge 清0
  application.applicationIconBadgeNumber = 0;
  // 通知打开回执上报
  // [CloudPushSDK handleReceiveRemoteNotification:userInfo];(Deprecated from v1.8.1)
  [CloudPushSDK sendNotificationAck:userInfo];
}


@end
