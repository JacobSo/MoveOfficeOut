//
//  Utils.m
//  moveoffice
//
//  Created by ZHUOQIN on 15/9/19.
//  Copyright (c) 2015年 ZHUOQIN. All rights reserved.
//

#import "Utils.h"

@implementation Utils



//对象排序
+ (NSMutableArray *)sortByItem:(NSString *)item
                 initDataScore:(NSMutableArray *)dataScore
                   isAscending:(BOOL)isAscending{
    
    NSMutableArray *result = [[NSMutableArray alloc]init];
    @try {
        NSSortDescriptor *sortByKey = [NSSortDescriptor sortDescriptorWithKey:item ascending:isAscending];
        result = [[NSMutableArray alloc]initWithArray:[dataScore sortedArrayUsingDescriptors:[NSArray arrayWithObject:sortByKey]]];
    }
    @catch (NSException *exception) {
        return nil;
    }
    @finally {
        return result;
    }
}

#pragma mark 数据类型转换相关
+ (NSString *)numberToString:(NSNumber *)value{
    NSString *result = [[NSString alloc]init];
    @try {
        NSNumberFormatter* numberFormatter = [[NSNumberFormatter alloc] init];
        result = [numberFormatter stringFromNumber:value];
    }
    @catch (NSException *exception) {
        return @"0";
    }
    @finally {
        return result;
    }
}

+ (NSNumber *)stringToNumber:(NSString *)stringValue{
    NSNumber *result = [[NSNumber alloc]init];
    @try {
        NSNumberFormatter* numberFormatter = [[NSNumberFormatter alloc] init];
        id number = [numberFormatter numberFromString:stringValue];
        result = number;
    }
    @catch (NSException *exception) {
        result = nil;
    }
    @finally {
        return result;
    }
}

+ (NSString *)arrayToString:(NSArray *)arrayValue{
    NSString *result = [[NSString alloc]initWithFormat:@"%@",arrayValue];
    return result;
}

+ (NSString*)objectToJsonString:(id)object{
    NSString *jsonString = nil;
    @try {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object
                                                           options:NSJSONWritingPrettyPrinted
                                                             error:nil];

        jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

    }
    @catch (NSException *exception) {
        jsonString = nil;
    }
    @finally {
        return jsonString;
    }

}

+ (NSString *)getFilePath:(NSString *)fileName{
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *docDir = [paths objectAtIndex:0];
    NSString *filePath = [docDir stringByAppendingPathComponent:fileName];
    return filePath;
}


+ (NSString*)DataTOjsonString:(id)object{
    NSString *result = @"";
    @try {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object
                                                           options:NSJSONWritingPrettyPrinted
                                                             error:nil];
        if (jsonData!=nil)
            result = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    @catch (NSException *exception) {
        
    }
    @finally {
        return result;
    }
}

+ (NSString *)kStringToEscapes:(NSString *)firstString{
    NSString *result;
    @try {
            result = (__bridge NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(__bridge CFStringRef)firstString,NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8);
    }
    @catch (NSException *exception) {
        result= @"String to Escapes has false.";
    }
    @finally {
        return  result;
    }
}

#pragma mark 时间类型相关
+ (NSString *)kNowTime{
    NSString *result = [[NSString alloc]init];
    @try {
        NSDateFormatter * yyyyMM = [[NSDateFormatter alloc] init ];
        yyyyMM.dateFormat = @"yyyy-MM-dd HH:mm:ss";
        NSTimeInterval sec = [[NSDate date] timeIntervalSinceNow];
        NSDate *nowDay = [[NSDate alloc] initWithTimeIntervalSinceNow:sec];
        result = [yyyyMM stringFromDate:nowDay];
//        LSDebug(result);
    }
    @catch (NSException *exception) {
        
    }
    @finally {
        return result;
    }
}

+ (NSString *)kNSDateToString:(NSDate*)date{
    NSString *result = [[NSString alloc]init];
    @try {
        NSDateFormatter * yyyyMM = [[NSDateFormatter alloc] init ];
        yyyyMM.dateFormat = @"yyyy-MM-dd";
        NSDate *dateData = date;
        result = [yyyyMM stringFromDate:dateData];
//        LSDebug(result);
    }
    @catch (NSException *exception) {
        
    }
    @finally {
        return result;
    }
}

//图片命名
+ (NSString *)kImageName{
    NSString *result = [[NSString alloc]init];
    @try {
        NSDateFormatter * yyyyMM = [[NSDateFormatter alloc] init ];
        yyyyMM.dateFormat = @"yyyyMMdd_HHmmss_SSS";
        NSTimeInterval sec = [[NSDate date] timeIntervalSinceNow];
        NSDate *nowDay = [[NSDate alloc] initWithTimeIntervalSinceNow:sec];
        result = [[yyyyMM stringFromDate:nowDay] stringByAppendingString:@".jpg"];
//        LSDebug(result);
    }
    @catch (NSException *exception) {
        
    }
    @finally {
        return result;
    }
}



#pragma mark NSUserDefaults本地存储相关
+ (BOOL)isAuthorizedLogin{
    BOOL result = NO;
    @try {
        NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
        NSString *_LoginUserName = [userDefaults objectForKey:@"LoginUserName"];
        NSString *_Password = [userDefaults objectForKey:@"Password"];
        NSString *_RealName = [userDefaults objectForKey:@"RealName"];
        NSString *_DptName = [userDefaults objectForKey:@"DptName"];
        NSString *_WorkType = [userDefaults objectForKey:@"WorkType"];
        
        if (_LoginUserName != nil && _Password != nil && _RealName != nil && _DptName != nil && _WorkType != nil)
            result = YES;
        else
            result = NO;

    }
    @catch (NSException *exception) {
        return NO;
    }
    @finally {
        return result;
    }
}

//+(BOOL)saveLoginUser:(LSUser *)user{
//    BOOL result = NO;
//    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
//    [userDefaults setObject:user.UserName forKey:@"LoginUserName"];
//    [userDefaults setObject:user.passWord forKey:@"Password"];
//    [userDefaults setObject:user.RealName forKey:@"RealName"];
//    [userDefaults setObject:user.DptName forKey:@"DptName"];
//    [userDefaults setObject:user.WorkType forKey:@"WorkType"];
//    
//    //密码需要
//    [userDefaults synchronize];
//    
//    NSString *_LoginUserName = [userDefaults objectForKey:@"LoginUserName"];
//    NSString *_Password = [userDefaults objectForKey:@"Password"];
//    NSString *_RealName = [userDefaults objectForKey:@"RealName"];
//    NSString *_DptName = [userDefaults objectForKey:@"DptName"];
//    NSString *_WorkType = [userDefaults objectForKey:@"WorkType"];
//    
//    
//    if ([_LoginUserName isEqual:user.UserName ]&&
//        [_Password isEqual: user.passWord] &&
//        [_RealName isEqual: user.RealName] &&
//        [_DptName isEqual: user.DptName] &&
//        [_WorkType isEqual: user.WorkType]) {
//        result = YES;
//    }
//    
//    return result;
//}

//+ (void)removeUserInfo{
//    NSUserDefaults * userDefaults = [NSUserDefaults standardUserDefaults];
//    NSDictionary * dict = [userDefaults dictionaryRepresentation];
//    for (id key in dict) {
//        if (![key isEqual: kAPP_DATABASE_SAVE_KEY]){
//            [userDefaults removeObjectForKey:key];
//            LSDebug(key);
//        }
//    }
//    [userDefaults synchronize];
//
//}
+(NSString *)kLoginUserName{
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    NSString *_LoginUserName = [userDefaults objectForKey:@"LoginUserName"];
    return _LoginUserName;
}
+(NSString *)kPassword{
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    NSString *_Password = [userDefaults objectForKey:@"Password"];
    return _Password;
}
+ (BOOL)updataPassword:(NSString *)newPassword{
    BOOL result = NO;
    @try {
        NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
        NSString *oldPassword = [userDefaults objectForKey:@"Password"];
        [userDefaults setObject:newPassword forKey:@"Password"];
        NSString *nowPassWord = [userDefaults objectForKey:@"Password"];
        if (oldPassword != nowPassWord)
            result = YES;
        
    }
    @catch (NSException *exception) {
        result = NO;
    }
    @finally {
        return result;
    }
}
+(NSString *)kRealName{
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    NSString *_RealName = [userDefaults objectForKey:@"RealName"];
    return _RealName;
}
+(NSString *)kDptName{
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    NSString *_DptName = [userDefaults objectForKey:@"DptName"];
    return _DptName;
}
+(NSString *)WorkType{
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    NSString *_WorkType = [userDefaults objectForKey:@"WorkType"];
    return _WorkType;
}

////+ (void)cleanALLUserInfoWhenOut{
////    [self removeUserInfo];
////    [[SDImageCache sharedImageCache] clearDisk];
////    [[SDImageCache sharedImageCache] clearMemory];
////    
////    LSDataBase *database = [[LSDataBase alloc]init];
////    NSManagedObjectContext *context1 = [[NSManagedObjectContext alloc]init];
////    context1 = [database connectData];
////    
////    NSManagedObjectContext *context2 = [[NSManagedObjectContext alloc]init];
////    context2 = [database connectDataBMYF];
////    
////    if([database coverLoadConData:context1])
////        LSDebug(@"常规质检—质检单数据源清空成功！");
////    if ([database coverProductLoadConData:context1])
////        LSDebug(@"木架成品质检－质检单清空成功！");
////    if ([database coverPlateTrackSeriesDataBMYF:context2])
////        LSDebug(@"板木研发—系列单数据源清空成功！");
////    if ([database coverPlateReviewItemDataBMYF:context2]) {
////        LSDebug(@"板木研发-评审项数据源清空成功！");
////    }
////}
//
//#pragma mark DataBaseLocation 板木研发
//+ (BOOL)saveReviewDataByKey:(NSString *)saveKey saveData:(NSString *)data{
//    BOOL result = NO;
//    @try {
//        NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
//        [userDefaults setObject:data forKey:saveKey];
//         result = YES;
//    }
//    @catch (NSException *exception) {
//        result = NO;
//    }
//    @finally {
//        return result;
//    }
//}
//
//+ (NSString *)getReviewDataByKey:(NSString *)saveKey{
//    NSString * result = @"";
//    @try {
//        NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
//        result = [userDefaults objectForKey:saveKey];
//    }
//    @catch (NSException *exception) {
//        result = @"";
//    }
//    @finally {
//        return result;
//    }
//}
//
//+ (BOOL)removeReviewDataByKey:(NSString *)key{
//    BOOL result = NO;
//    @try {
//        NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
//        [userDefaults removeObjectForKey:key];
//        if ([self getReviewDataByKey:key] == nil)
//            result = YES;
//    }
//    @catch (NSException *exception) {
//        result = NO;
//    }
//    @finally {
//        return result;
//    }
//}
//
//
//+ (BOOL)dataBaseVersionIsChang{
//    BOOL result = NO;
//    @try {
//        NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
//        NSString *oldVersion = [userDefaults objectForKey:kAPP_DATABASE_SAVE_KEY];
//        
//        if([oldVersion integerValue]!= [kAPP_DATABASE_VERSION integerValue])
//            result = YES;
//    }
//    @catch (NSException *exception) {
//        result = YES;
//    }
//    @finally {
//        if ([self saveDataBaseVersion])
//            LSDebug(@"Save DataBase Version Success!");
//        return result;
//    }
//}
//+ (BOOL)saveDataBaseVersion{
//    BOOL result = NO;
//    @try {
//        NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
//        [userDefaults setObject:kAPP_DATABASE_VERSION forKey:kAPP_DATABASE_SAVE_KEY];
//        result = YES;
//    }
//    @catch (NSException *exception) {
//        return NO;
//    }
//    @finally {
//        return result;
//    }
//}



@end
