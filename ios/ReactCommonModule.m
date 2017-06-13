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

#import "WDSeries.h"
#import "LSHtmlModel.h"
#import "PrintHead.h"
#import "MJExtension.h"
#import "Utils.h"
#import "UIImage+Resizes.h"
#import "SDImageCache.h"
#import "NSString+sha1.h"


@interface ReactCommonModule ()<UIWebViewDelegate>

@property (nonatomic,strong)UIWebView *lsWebView;
@property (nonatomic,strong)UILabel *lable_message;

@property (nonatomic,strong)LSHtmlModel *htmlModel;
@property (nonatomic,strong)NSString *titleStr_Html;
@property (nonatomic,strong)NSString *bodyStr_Html;
@property (nonatomic,strong)NSString *footStr_Html;

@property (nonatomic,strong)NSString *htmlString;

@property (nonatomic,strong)UIViewPrintFormatter *viewFormatter;
@property (nonatomic,strong)PrintHead *render;

@property (nonatomic,strong) WDSeries *serice;

@property (nonatomic,strong)NSString *strDocPath;
@property (nonatomic,strong)NSString *titleStr;
@property (nonatomic,strong)NSString *typeStr;
@property (nonatomic,assign) int code;
@property (nonatomic,strong)NSString *SeriesName;


@end

static NSString *kStrPDFName = @"评审文档.pdf";

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
  NSArray *arrays = [NSArray arrayWithObjects:encodedImageStr,nil];
  callback(arrays);
  
}


RCT_EXPORT_METHOD(logoutShareAccount){
  ((AppDelegate *)[UIApplication sharedApplication].delegate).userName = nil;
 ((AppDelegate *)[UIApplication sharedApplication].delegate).password = nil;
}

RCT_EXPORT_METHOD(outputReportAction:(NSString *)pdfJson code:(int)code:(RCTResponseSenderBlock)callback)
{
  
  WDSeries *serice = [WDSeries mj_objectWithKeyValues:pdfJson];
  
  
  /*选择需要生成文档的产品。*/
  self.strDocPath = nil;
  self.viewFormatter = nil;
  self.lable_message = nil;
  self.titleStr_Html = nil;
  self.bodyStr_Html = nil;
  self.htmlString = nil;
  self.htmlModel = nil;
//  self.lsWebView = nil;
  self.titleStr = nil;
  self.typeStr = nil;
//  self.render = nil;
  
  

  self.serice = serice;
  self.code = code;
  self.SeriesName = serice.SeriesName;
  dispatch_async(dispatch_get_global_queue(0, 0), ^{
    
    [self lsCreateHtmlInWeb];
    dispatch_async(dispatch_get_main_queue(), ^{
      
      NSString *path = [[NSBundle mainBundle] bundlePath];
      NSLog(@"%@",path);
      
      [self.lsWebView loadHTMLString:self.htmlString baseURL:[NSURL URLWithString:path]];
    });
  });
  
  
  dispatch_async(dispatch_get_global_queue(0, 0), ^{
    
    while (1) {
      if (self.strDocPath != nil) {
        NSArray *arrays = [NSArray arrayWithObjects:self.strDocPath,nil];
        callback(arrays);
        break;
      }
    }
    
  });
  
  
}

RCT_EXPORT_METHOD(getAllPrint:(RCTResponseSenderBlock)callback:(RCTResponseSenderBlock)error)
{
  NSString *path =  NSTemporaryDirectory();
  NSArray *pdfArray = [[NSFileManager defaultManager]subpathsOfDirectoryAtPath:path error:nil];
  
  
  NSLog(@"完整地址：%@",pdfArray);
  
  
//  NSString *pdfString = [pdfArray mj_JSONString];
  
  
  
  NSMutableArray *PDFArr = [[NSMutableArray alloc]init];
  
  for (int i=0; i<pdfArray.count; i++) {
    
    NSLog(@"完整==========地址：%@",[path stringByAppendingPathComponent:pdfArray[i]]);
    
    
    [PDFArr addObject:[path stringByAppendingPathComponent:pdfArray[i]]];
    
  }
  
  
  
  
  NSLog(@"******************8%@",PDFArr);
  
  NSString *pdf = [PDFArr mj_JSONString];
  
  NSArray *arrays = [NSArray arrayWithObjects:pdf,nil];
  
  callback(arrays);
  
  
}






///Users/ls/Library/Developer/CoreSimulator/Devices/B4F31F4D-123C-435B-B96C-E30E20A860EE/data/Containers/Data/Application/DD3C41EA-7B2E-4BFA-9F9E-B96F1FC0B1B1/Library/Caches/react-native-img-cache/70a03366edfd053ce4e1226a7817a86ce8a42dda.jpg

///Users/ls/Library/Developer/CoreSimulator/Devices/B4F31F4D-123C-435B-B96C-E30E20A860EE/data/Containers/Data/Application/C552DC0A-E5E5-4738-B9BE-7B6CF75363DE/Library/Caches

///Users/ls/Library/Developer/CoreSimulator/Devices/B4F31F4D-123C-435B-B96C-E30E20A860EE/data/Containers/Data/Application/069B7B35-30DB-41F6-A016-5B83DA938507/Documents


#pragma mark –webViewDelegate
-(void)webViewDidStartLoad:(UIWebView *)webView
{
  //开始加载网页调用此方法
//  [self showHUD];
}

-(void)webViewDidFinishLoad:(UIWebView *)webView
{
//  [self dissPHUD];
  //网页加载完成调用此方法
  [self lsPrintInWifi];
  

  
  
  NSLog(@"*****");
}

-(void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error
{
  //网页加载失败 调用此方法
  NSLog(@"*****");
}





#pragma mark --- 测试阶段


- (NSString *)htmlString{
  if (!_htmlString) {
    NSString *html = [NSString stringWithFormat:@"%@%@%@%@",
                      self.htmlModel.Head,
                      self.titleStr_Html,
                      self.bodyStr_Html,
                      self.footStr_Html];
    _htmlString = html;
  }
  return _htmlString;
}

- (PrintHead *)render{
  if (!_render) {
    PrintHead *render = [[PrintHead alloc]init];
    
    switch (self.code){
      case 0:
        render.isBPPS = YES;
        break;
      default:
        render.isBPPS = NO;
        break;
    }
    _render = render;
  }
  return _render;
}



- (UIViewPrintFormatter *)viewFormatter{
  if (!_viewFormatter) {
    UIViewPrintFormatter *viewFormatter = [self.lsWebView viewPrintFormatter];
    _viewFormatter = viewFormatter;
  }
  return _viewFormatter;
}



//创建文件路径
- (void)lsCreateHtmlInWeb{
  NSMutableArray<WDProduct *> *productList = [[NSMutableArray<WDProduct *> alloc]init];
  productList = self.serice.Itemlist;
  //写入文件
  NSArray *paths=NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,   NSUserDomainMask, YES);
  NSString *saveDirectory=[paths objectAtIndex:0];
  NSString *saveFileName=@"myHTML.html";
  NSString *filepath=[saveDirectory stringByAppendingPathComponent:saveFileName];
  if ([self.htmlString  writeToFile:filepath atomically:YES encoding:NSUTF8StringEncoding error:nil]) {
    
  }
}


- (void)lsCreatePdfFromWeb:(void(^)(void))ok
                        no:(void(^)(void))no{
  
  //防止再次点击时生成空文档
  if(!self.strDocPath){
    [self.render addPrintFormatter:self.viewFormatter startingAtPageAtIndex:0];
    
    CGRect page = CGRectMake(0, 0, 612, 866);
    CGRect pageHead = CGRectMake(0, 10, 612,23);
    CGRect pageCenter = CGRectMake(0, 50, 612, 786);
    CGRect pageFoot = CGRectMake(0, 846, 612, 15);
    
    
    CGRect printable = pageCenter;
    [self.render setValue:[NSValue valueWithCGRect:page] forKey:@"paperRect"];
    [self.render setValue:[NSValue valueWithCGRect:printable] forKey:@"printableRect"];
    NSMutableData *pdfData = [[NSMutableData alloc]init];
    
    UIGraphicsBeginPDFContextToData(pdfData,page,nil);
    NSInteger pageCount = [self.render numberOfPages];
    self.render.pageSum = pageCount;
    self.render.docName = self.titleStr;
    for (NSInteger i = 0; i< pageCount; i++) {
      UIGraphicsBeginPDFPage();
      [self.render drawHeaderForPageAtIndex:i inRect:pageHead];
      
      [self.render drawPageAtIndex:i inRect:pageCenter];
      
      [self.render drawFooterForPageAtIndex:i inRect:pageFoot];
    }
    UIGraphicsEndPDFContext();
    
    NSString *PDFName = @"";
    switch (self.code) {
      case 0:
        PDFName = @"白胚";
        break;
      case 1:
        PDFName = @"成品";
        break;
      case 2:
        PDFName = @"包装";
        break;
      default:
        break;
    }
    
    
    NSString *path =  NSTemporaryDirectory();
    self.strDocPath = [path stringByAppendingPathComponent:[NSString stringWithFormat:@"%@-%@评审报告.pdf",self.SeriesName,PDFName]];
    
    NSLog(@"PDF地址*****%@",self.strDocPath);
    

    if ([pdfData writeToFile:self.strDocPath atomically:YES]) {
      NSLog(@"%@",self.strDocPath);
      ok();
    }else{
      self.strDocPath = nil;
      no();
    }
    
  }else{
    ok();
  }
  
  
}


#pragma mark Create HTML
- (LSHtmlModel *)htmlModel{
  if (!_htmlModel) {
    /*
     LZDataString_H.plist 竖模版
     LZDataString.plist   横模版
     */
    
    LSHtmlModel *htmlModel = [[LSHtmlModel alloc]init];
    NSDictionary *dictionary = [[NSDictionary alloc]initWithContentsOfFile:[[NSBundle mainBundle]pathForResource:@"LZDataString_H.plist" ofType:nil]];
    htmlModel = [LSHtmlModel mj_objectWithKeyValues:dictionary];
    _htmlModel = htmlModel;
  }
  return _htmlModel;
}

- (NSString *)titleStr_Html{
  if (!_titleStr_Html) {
    NSString *title;
    //        if (self.phaseType == PhaseType_BP) {
    title = [NSString stringWithFormat:self.htmlModel.HeadS,self.titleStr,self.serice.FacName,[NSString stringWithFormat:@"评审时间：%@",[Utils kNowTime]]];
    
    _titleStr_Html = title;
  }
  return _titleStr_Html;
}

- (NSString *)bodyStr_Html{
  if (!_bodyStr_Html) {
    NSMutableArray *itemCountArr = [[NSMutableArray alloc]init];
    __block NSString *body;
    
    /*白胚*/
    //        if (self.phaseType == PhaseType_BP){
    body = self.htmlModel.Enpty;
    [self.serice.Itemlist enumerateObjectsUsingBlock:^(WDProduct * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      
//      obj.check = YES;
      /*这里可以加个全部打印或者部分打印*/
      //                if (obj.isPrint ==  WD_YES_PRINT_CP)
      if (obj.check ==  1)
        @autoreleasepool {
          
          [itemCountArr addObject:@""];
          /*选取不同阶段的评审项*/
          NSString *problemS;
          switch (self.code){
            case 0:
              problemS = obj.pStatusResultA;
              break;
            case 1:
              problemS = obj.pStatusResultB;
              break;
            case 2:
              problemS = obj.pStatusResultC;
              break;
            default:
              break;
          }
          NSArray *array = [problemS componentsSeparatedByString:@"|"];
          NSInteger countProduct = array.count;
          
          
          NSString *imageName = [obj.pImage sha1];
          
          NSLog(@"#########%@.jpg",imageName);
          
          NSString *addresss = [[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES)lastObject]stringByAppendingPathComponent:@"react-native-img-cache"];
          
          NSString *imageNames=[NSString stringWithFormat:@"%@/%@.jpg",addresss,imageName];
          
          UIImage *cachedImage=[[UIImage alloc]initWithContentsOfFile:imageNames];
          
          
//          NSArray *filesNameArray = [[NSFileManager defaultManager]subpathsOfDirectoryAtPath:addresss error:nil];
//          
//          NSLog(@"%ld",(unsigned long)filesNameArray.count);
//          
//          for(int i=0;i<filesNameArray.count;i++)
//          {
//            NSLog(@"%@",filesNameArray[i]);
//          }
//          if (<#condition#>) {
//            <#statements#>
//          }
          
          
          
          
          /*填写了评审记录时*/
          //                        else{
//          UIImage *cachedImage = [[SDImageCache sharedImageCache] imageFromDiskCacheForKey:obj.pImage];
          
//          NSString *address = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)lastObject];
//          
//          NSLog(@"******************%@",address);
//          
//          
//          
//          NSLog(@"******************%@",addresss);
          
          
          
          
          
          
          
          
          
          
          if (!cachedImage) {
            cachedImage = [UIImage imageNamed:@"loading_Image"];
          }
          CGSize fram = CGSizeMake(200, 123.6);
          UIImage* scaledImg = [cachedImage resizedImageToFitInSize:fram scaleIfSmaller:YES];
          NSData *imgData =  UIImageJPEGRepresentation(scaledImg, 1);
          NSString *imgBase64str = [imgData base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
          
          NSString *isAccess;
          switch (obj.pStatusPass) {
            case WD_Result_Null:
              isAccess = @"";
              break;
            case WD_Result_Fail:
              isAccess = @"不通过";
              break;
            case WD_Result_Pass:
              isAccess = @"通过";
              break;
            default:
              break;
          }
          NSString *pop = @"";
          @autoreleasepool {
            for (NSInteger i = 1; i <= countProduct - 1; i++) {
              @autoreleasepool {
                NSString *itemSS = [[NSString alloc]initWithFormat:self.htmlModel.Itss,[NSString stringWithFormat:@"%@、%@",[@(i+1) stringValue],array[i]]];
                pop = [pop stringByAppendingString:itemSS];
              }
            }
          }
          NSString *product =  [NSString stringWithFormat:self.htmlModel.Middle,
                                countProduct+1,
                                [@(itemCountArr.count) stringValue],
                                countProduct+1,
                                obj.ItemName,
                                obj.ItemRemark,
                                countProduct+1,
                                imgBase64str,
                                array[0],
                                countProduct+1,
                                countProduct+1,
                                isAccess,
                                countProduct+1,
                                pop
                                //                                                  ,
                                //                                                  style,
                                //                                                  self.htmlModel.Enpty
                                ];
          body = [body stringByAppendingString:product];
          pop = nil;
          cachedImage = nil;
          imgData = nil;
          imgBase64str = nil;
          product = nil;
        }
    }];
    
    
    
    
    
    
    _bodyStr_Html = body;
  }
  return _bodyStr_Html;
}





- (NSString *)footStr_Html{
  if(!_footStr_Html){
    
    __block NSString *materialList = @"";
    NSString *fb;
    [self.serice.sMaterialText enumerateObjectsUsingBlock:^(WDMaterial * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      NSString *title = obj.mTitle.length > 0 ? obj.mTitle :@"&nbsp;";
      NSString *content = obj.mContent.length > 0 ? obj.mContent: @"&nbsp;";
      NSString *itemMater = [NSString stringWithFormat:self.htmlModel.FootA,title,content];
      materialList = [materialList stringByAppendingString:itemMater];
    }];
    fb = [NSString stringWithFormat:self.htmlModel.FootB,self.serice.sQualityText,self.htmlModel.FootB_Explain];
    NSLog(@"%@",self.serice.sQualityText);
    _footStr_Html = [NSString stringWithFormat:self.htmlModel.FootF,materialList,fb];
    
  }
  return _footStr_Html;
}




#pragma mark Create UI
- (NSString *)titleStr{
  if (!_titleStr) {
    NSString *titleStr = [NSString stringWithFormat:@"（%@）%@评审报告",self.serice.SeriesName,self.typeStr];
    _titleStr = titleStr;
  }
  return _titleStr;
}

- (NSString *)typeStr{
  if (!_typeStr) {
    switch (self.code) {
      case 0:
        _typeStr = @"白胚";
        break;
      case 1:
        _typeStr = @"成品";
        break;
      case 2:
        _typeStr = @"包装";
        break;
      default:
        break;
    }
  }
  return _typeStr;
}


- (UIWebView *)lsWebView{
  if (!_lsWebView) {
    UIWebView *webView = [[UIWebView alloc]init];
    [webView setTranslatesAutoresizingMaskIntoConstraints:NO];
    webView.delegate = self;
    webView.scalesPageToFit = YES;
    [webView addSubview:self.lable_message];
    
    
    _lsWebView = webView;
  }
  return _lsWebView;
}
//
- (UILabel *)lable_message{
  if (!_lable_message) {
    UILabel *lable = [[UILabel alloc]init];
    [lable setTranslatesAutoresizingMaskIntoConstraints:NO];
    [lable setFont:[UIFont systemFontOfSize:20]];
    [lable setTextColor:[UIColor grayColor]];
    [lable setTextAlignment:NSTextAlignmentCenter];
    [lable setText:@"正在用力生成报告…"];
    _lable_message = lable;
  }
  return _lable_message;
}


-(UIModalPresentationStyle)adaptivePresentationStyleForPresentationController:(UIPresentationController *)controller{
  return  UIModalPresentationNone;
}





#pragma mark someEven

- (void)lsPrintInWifi{
//  [self showHUD];
  
//  [LSNet lsCheckNetIsWiFi:^{
  
    [self lsCreatePdfFromWeb:^{
//      [self dissPHUD];
      
    } no:^{
//      [self dissPHUD];
//      [Common lsWarnningMessage:@"创建文档失败。请重试" tagView:self];
    }];

}




@end

















































