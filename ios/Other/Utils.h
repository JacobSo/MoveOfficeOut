//
//  Utils.h
//  moveoffice
//
//  Created by ZHUOQIN on 15/9/19.
//  Copyright (c) 2015年 ZHUOQIN. All rights reserved.
//

#import <Foundation/Foundation.h>
//#import "LSUser.h"
//#import "Common.h"

@interface Utils : NSObject

+ (NSMutableArray *)sortByItem:(NSString *)item
                 initDataScore:(NSMutableArray *)dataScore
                   isAscending:(BOOL)isAscending;

+ (NSString *)numberToString:(NSNumber *)value;

+ (NSNumber *)stringToNumber:(NSString *)stringValue;

+ (NSString *)arrayToString:(NSArray *)arrayValue;

+ (NSString*)objectToJsonString:(id)object;

+ (NSString *)kStringToEscapes:(NSString *)firstString;

+ (NSString *)getFilePath:(NSString *)fileName;

+ (NSString*)DataTOjsonString:(id)object;

+ (BOOL)isAuthorizedLogin;
//+ (BOOL)saveLoginUser:(LSUser *)user;
+ (void)removeUserInfo;
+ (NSString *)kLoginUserName;
+ (NSString *)kPassword;
+ (NSString *)kRealName;
+ (NSString *)kDptName;
+ (NSString *)WorkType;

+ (NSString *)kNowTime;

+ (NSString *)kImageName;

+ (NSString *)kNSDateToString:(NSDate*)date;

//修改本地密码(理应不应当在本地存密码的啊喂)
+ (BOOL)updataPassword:(NSString *)newPassword;

//用户退出时，清空所有本地信息
+ (void)cleanALLUserInfoWhenOut;

+ (BOOL)saveReviewDataByKey:(NSString *)saveKey saveData:(NSString *)data;
+ (NSString *)getReviewDataByKey:(NSString *)saveKey;
+ (BOOL)removeReviewDataByKey:(NSString *)key;


+ (BOOL)dataBaseVersionIsChang;
+ (BOOL)saveDataBaseVersion;


@end


/*
 //出现
 -(void)viewWillAppear:(BOOL)animated{
 }
 //出现后
 -(void)viewDidAppear:(BOOL)animated{
 }
 
 //覆盖
 -(void)viewWillDisappear:(BOOL)animated{
 }
 
 //被覆盖后
 -(void)viewDidDisappear:(BOOL)animated{
}
 */
