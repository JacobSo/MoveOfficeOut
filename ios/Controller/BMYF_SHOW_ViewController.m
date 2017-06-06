//
//  BMYF_SHOW_ViewController.m
//  moveoffice
//
//  Created by ZHUOQIN on 16/5/19.
//  Copyright © 2016年 ZHUOQIN. All rights reserved.
//

#import "BMYF_SHOW_ViewController.h"
#import "PrintHead.h"
#import "ALAssetsLibrary+CustomPhotoAlbum.h"
#import "LSHtmlModel.h"
#import "LSPopView.h"
#import "UIImage+Resize.h"
#import "UIImage+PDF.h"
#import "BMYF_NOT_Line_ViewController.h"
#import "LSService.h"




@interface BMYF_SHOW_ViewController ()<UIPopoverPresentationControllerDelegate,UIDocumentInteractionControllerDelegate>{
@private
    NSMutableArray <UIImage *> *resultImage;
     MBProgressHUD *mbPHUD;
}

@property (nonatomic,strong)NSString *titleStr;
@property (nonatomic,strong)NSString *typeStr;

@property (nonatomic,strong)NSDictionary *views;
@property (nonatomic,strong)UIBarButtonItem *barbutton_Close;
@property (nonatomic,strong)UIBarButtonItem *barbutton_Print;
@property (nonatomic,strong)UIWebView *lsWebView;
@property (nonatomic,strong)UILabel *lable_message;

@property (nonatomic,strong)LSHtmlModel *htmlModel;
@property (nonatomic,strong)NSString *titleStr_Html;
@property (nonatomic,strong)NSString *bodyStr_Html;
@property (nonatomic,strong)NSString *footStr_Html;

@property (nonatomic,strong)NSString *htmlString;

@property (nonatomic,strong)UIViewPrintFormatter *viewFormatter;
@property (nonatomic,strong)PrintHead *render;

@property (nonatomic,strong)LSPopView *popMeumView;

//@property (nonatomic,strong)NSMutableArray <UIImage *> *resultImage;


@property (nonatomic,strong)NSString *strDocPath;

@property (nonatomic,strong)UIDocumentInteractionController *documentController;
@property (nonatomic,strong)LSService *service;

@end

static NSString *kStrPDFName = @"评审文档.pdf";


@implementation BMYF_SHOW_ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self lsInitView];
}

- (void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        
        [self lsCreateHtmlInWeb];
        dispatch_async(dispatch_get_main_queue(), ^{
            
            [self.lable_message setHidden:YES];
            
            NSString *path = [[NSBundle mainBundle] bundlePath];
            NSLog(@"%@",path);
            
            NSString *dd = [[LSCacheData lsPath_SaveproductImg] stringByAppendingString:@"/"];
                            NSLog(@"%@",dd);
            
            [self.lsWebView loadHTMLString:self.htmlString baseURL:[NSURL URLWithString:path]];
            [self.navigationItem setRightBarButtonItem:self.barbutton_Print];
        });
 
    });
}

-(void)viewDidDisappear:(BOOL)animated{
//    self.barbutton_Close = nil;
//    self.barbutton_Print = nil;
//    self.viewFormatter = nil;
//    self.lable_message = nil;
//    self.titleStr_Html = nil;
//    self.bodyStr_Html = nil;
//    self.htmlString = nil;
//    self.htmlModel = nil;
//    self.lsWebView = nil;
//    self.titleStr = nil;
//    self.typeStr = nil;
//    self.render = nil;
//    self.views = nil;
}


/*
 
 */





- (void)showHUD{
    mbPHUD = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    mbPHUD.mode = MBProgressHUDModeIndeterminate;
    mbPHUD.labelText = @"打印处理中……";
}
- (void)dissPHUD{
    [mbPHUD hide:YES];
    mbPHUD = nil;
    
}




/*递归存储照片到相册*/



- (void)saveImagesInPhotos:(ALAssetsLibrary *)library{
    if (resultImage.count >0) {
        UIImage *image = [resultImage objectAtIndex:0];
        [library saveImage:image toAlbum:self.titleStr completion:^(NSURL *assetURL, NSError *error) {
            if (error) {
                NSLog(@"保存失败");
            }else{
                [resultImage removeObjectAtIndex:0];
                [self saveImagesInPhotos:library];
                NSLog(@"保存成功");
            }
        } failure:^(NSError *error) {
            NSLog(@"保存失败");
        }];
    }else{
        [self dissPHUD];
        
        UIAlertView * alert = [[UIAlertView alloc]initWithTitle:@"现在，您可以用数据线连接iPhone或iPad到电脑。在我的电脑-(iPad/iPhone)图标－进入相册。打印评审文档的图片，注意报告的张数。"
                                                        message:@"如果您的iPad/iPhone提示:是否信任这台电脑……请务必按确认！务必按确认！务必按确认！……要不然就打印不了了。"
                                                       delegate:self
                                              cancelButtonTitle:@"很好"
                                              otherButtonTitles:nil, nil];
        [alert show];

    }
}


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
        
        switch (self.phaseType){
            case PhaseType_BP:
                render.isBPPS = YES;
                break;
            case PhaseType_CP:
            case PhaseType_BZ:
                render.isBPPS = NO;
                break;
            default:
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
    productList = self.selectSeries.Itemlist;
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
        //横向：
//        CGRect page = CGRectMake(0, 0, 792, 612);
//        CGRect pageHead = CGRectMake(0, 10, 792, 41);
//        CGRect pageCenter = CGRectMake(0, 50, 792, 532);
//        CGRect pageFoot = CGRectMake(0, 592, 792, 15);

        //纵向
//         CGRect page = CGRectMake(0, 0, 612, 792);
//         CGRect pageHead = CGRectMake(0, 10, 612,23);
//         CGRect pageCenter = CGRectMake(0, 50, 612, 712);
//         CGRect pageFoot = CGRectMake(0, 772, 612, 15);
        
        
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
        
        
        NSString *path =  NSTemporaryDirectory();
        self.strDocPath = [path stringByAppendingPathComponent:kStrPDFName];
        
        
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:self.strDocPath message:nil preferredStyle:UIAlertControllerStyleAlert];
        
        
        UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleDefault handler:nil];
        
        //    [alert addAction:photography];
        [alert addAction:cancel];
        
        [self presentViewController:alert animated:YES completion:nil];
        
        
        
        
        
        
        
        
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
            title = [NSString stringWithFormat:self.htmlModel.HeadS,self.titleStr,self.selectSeries.FacName,[NSString stringWithFormat:@"评审时间：%@",kNowDetilTime]];
            
//        }
//        else{
//            title = [NSString stringWithFormat:self.htmlModel.HeadS2,self.titleStr,self.selectSeries.FacName,kNowDetilTime];
//        }
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
            [self.selectSeries.Itemlist enumerateObjectsUsingBlock:^(WDProduct * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                obj.check = YES;
                /*这里可以加个全部打印或者部分打印*/
//                if (obj.isPrint ==  WD_YES_PRINT_CP)
                if (obj.check ==  YES)
                    @autoreleasepool {
                        
                        [itemCountArr addObject:@""];
                        /*选取不同阶段的评审项*/
                        NSString *problemS;
                        switch (self.phaseType){
                            case PhaseType_BP:
                                problemS = obj.pStatusResultA;
                                break;
                            case PhaseType_CP:
                                problemS = obj.pStatusResultB;
                                break;
                            case PhaseType_BZ:
                                problemS = obj.pStatusResultC;
                                break;
                            default:
                                break;
                        }
                        NSArray *array = [problemS componentsSeparatedByString:@"|"];
                        NSInteger countProduct = array.count;

                        /*填写了评审记录时*/
//                        else{
                            UIImage *cachedImage = [[SDImageCache sharedImageCache] imageFromDiskCacheForKey:obj.pImage];
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
//                            NSString *style = [NSString stringWithFormat:@"规格:%@",obj.pSize];
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
//                    }
            }];
//        }
        


        _bodyStr_Html = body;
    }
    return _bodyStr_Html;
}

- (NSString *)footStr_Html{
    if(!_footStr_Html){
    
        __block NSString *materialList = @"";
        NSString *fb;
//        if (self.phaseType == PhaseType_BP) {
            [self.selectSeries.sMaterialText enumerateObjectsUsingBlock:^(WDMaterial * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                NSString *title = obj.mTitle.length > 0 ? obj.mTitle :@"&nbsp;";
                NSString *content = obj.mContent.length > 0 ? obj.mContent: @"&nbsp;";
                NSString *itemMater = [NSString stringWithFormat:self.htmlModel.FootA,title,content];
                materialList = [materialList stringByAppendingString:itemMater];
            }];
            fb = [NSString stringWithFormat:self.htmlModel.FootB,self.selectSeries.sQualityText,self.htmlModel.FootB_Explain];
            NSLog(@"%@",self.selectSeries.sQualityText);
             _footStr_Html = [NSString stringWithFormat:self.htmlModel.FootF,materialList,fb];
    
    }
    return _footStr_Html;
}




#pragma mark Create UI
- (void)lsInitView{
    [self.view setBackgroundColor:[UIColor whiteColor]];
    [self.navigationItem setLeftBarButtonItem:self.barbutton_Close];
    [self setTitle:@"评审报告预览"];
    [self.view addSubview:self.lsWebView];
    ZQAddCS(self.view, @"H:|[webView]|", self.views);
    ZQAddCS(self.view, @"V:|[webView]|", self.views);
}

- (NSString *)titleStr{
    if (!_titleStr) {
        NSString *titleStr = [NSString stringWithFormat:@"（%@）%@评审报告",self.selectSeries.SeriesName,self.typeStr];
        _titleStr = titleStr;
    }
    return _titleStr;
}

- (NSString *)typeStr{
    if (!_typeStr) {
        switch (self.phaseType) {
            case PhaseType_BP:
                _typeStr = @"白胚";
                break;
            case PhaseType_CP:
                _typeStr = @"成品";
                break;
            case PhaseType_BZ:
                _typeStr = @"包装";
                break;
            default:
                break;
        }
    }
    return _typeStr;
}

- (NSDictionary *)views{
    if (!_views) {
        NSDictionary *views = @{
                                @"main_view" :self.view,
                                @"webView"   :_lsWebView
                                };
        _views = views;
    }
    return _views;
}

- (UIWebView *)lsWebView{
    if (!_lsWebView) {
        UIWebView *webView = [[UIWebView alloc]init];
        [webView setTranslatesAutoresizingMaskIntoConstraints:NO];
        webView.scalesPageToFit = YES;
        [webView addSubview:self.lable_message];
        NSDictionary *views = @{
                                @"web_main"      :webView,
                                @"lable_message" :_lable_message
                                };
        ZQAddCS(webView, @"H:|[lable_message]|", views);
        ZQAddCS(webView, @"V:|[lable_message]|", views);
        
        _lsWebView = webView;
    }
    return _lsWebView;
}

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

- (LSPopView *)popMeumView{
    _popMeumView = [[LSPopView alloc]initData:@[@"无线打印",@"有线打印",@"其它打印"]];
    _popMeumView.modalPresentationStyle = UIModalPresentationPopover;
    _popMeumView.popoverPresentationController.barButtonItem = self.navigationItem.rightBarButtonItem;
    _popMeumView.popoverPresentationController.permittedArrowDirections = UIPopoverArrowDirectionUp;
    _popMeumView.popoverPresentationController.delegate = self;
    
    _popMeumView.chooseSubject = [RACSubject subject];
    [_popMeumView.chooseSubject subscribeNext:^(id x) {
        [_popMeumView dismissViewControllerAnimated:YES completion:nil];
        switch ([x integerValue]) {
            case 0:
                [self lsPrintInWifi];
                break;
            case 1:
                [self lsPrintInImg];
                break;
            case 2:
                [self lsPrintInOtherApplication];
                break;
            default:
                break;
        }
    }];
    return _popMeumView;
}
-(UIModalPresentationStyle)adaptivePresentationStyleForPresentationController:(UIPresentationController *)controller{
    return  UIModalPresentationNone;
}

- (UIBarButtonItem *)barbutton_Close{
    if (!_barbutton_Close) {
        UIBarButtonItem *barButton = [[UIBarButtonItem alloc]initWithImage:[UIImage imageNamed:@"Nav_close"]
                                                                     style:UIBarButtonItemStyleDone
                                                                    target:self
                                                                    action:@selector(lsBarOnClick_Close:)];
        _barbutton_Close = barButton;
    }
    return _barbutton_Close;
}

- (UIBarButtonItem *)barbutton_Print{
    if (!_barbutton_Print) {
        UIBarButtonItem *barButton = [[UIBarButtonItem alloc]initWithImage:[UIImage imageNamed:@"Nav_Print"]
                                                                     style:UIBarButtonItemStyleDone
                                                                    target:self
                                                                    action:@selector(lsBarOnClick_CreatPdf:)];
        _barbutton_Print = barButton;
    }
    return _barbutton_Print;
}

- (void)lsBarOnClick_Close:(UIBarButtonItem *)seg{
    [self dismissViewControllerAnimated:YES completion:nil];
}


- (void)lsCreatePdf{
    
    NSURL *pdfDocumentUrl = [NSURL fileURLWithPath:self.strDocPath];
    CGPDFDocumentRef fromPDFDoc = CGPDFDocumentCreateWithURL((CFURLRef) pdfDocumentUrl);
    size_t pages = CGPDFDocumentGetNumberOfPages(fromPDFDoc);
    resultImage = [[NSMutableArray <UIImage *> alloc]init];
    
    /*生成方式1 分辨率棒棒的*/
    int i = 1;
    CGSize imgSize = CGSizeMake(612, 866);
    for (i = 1; i <= pages; i++) {
        UIImage *img = [UIImage imageWithPDFURL:pdfDocumentUrl atSize:imgSize atPage:i];
        if (img)[resultImage addObject:img];
    }

    /*生成方式2 分辨率很低弃用*/
//    int i = 1;
//    for (i = 1; i <= pages; i++) {
//        CGPDFPageRef pageRef = CGPDFDocumentGetPage(fromPDFDoc, i);
//        CGPDFPageRetain(pageRef);
//        CGRect pageRect = CGPDFPageGetBoxRect(pageRef, kCGPDFMediaBox);
//        CGRect pageRectX = pageRect;//CGRectMake(0,0,pageRect.size.width*2,pageRect.size.height*2);
//        UIGraphicsBeginImageContext(pageRectX.size );
//        CGContextRef imgContext = UIGraphicsGetCurrentContext();
//        CGContextSaveGState(imgContext);
//        CGContextTranslateCTM(imgContext, 0.0, pageRectX.size.height);
//        CGContextScaleCTM(imgContext, 1.0, -1.0);
//        CGContextSetInterpolationQuality(imgContext, kCGInterpolationDefault);
//        CGContextSetRenderingIntent(imgContext, kCGRenderingIntentDefault);
//        CGContextDrawPDFPage(imgContext, pageRef);
//        CGContextRestoreGState(imgContext);
//        
//        UIImage *tempImage = UIGraphicsGetImageFromCurrentImageContext();
//        UIGraphicsEndImageContext();
//        
//        CGPDFPageRelease(pageRef);
//        
//        [resultImage addObject:tempImage];
//        
//    }
//    CGPDFDocumentRelease(fromPDFDoc);
    
    /*
     目前3种打印方式使用方式：
     1、无线打印。（需要连上局域网。然后在浏览器输入提示的地址，即可用浏览器打印）
     2、有线打印。（生成图片在手机相册。）
     3、分享到其它应用，或用支持苹果airprint的打印机打印。
     
     建议首选第一种方式，
     第二种的话对打印机的要求比较高，用专门打印图片的打印机才会得到清晰的报告。而且打印时要注意设置图片的dpi，以及占用纸张的位置。
     第三种，方便存档或者共享报告。
     
     1，3不挑打印机，打印出来的报告质量最高
     */
    

    ALAssetsLibrary *library = [[ALAssetsLibrary alloc] init];
    [self saveImagesInPhotos:library];
}

- (void)lsCreatePdfImg:(void(^)(void))ok
                    no:(void(^)(void))no{
    
    if (!self.strDocPath) {
        
        [self lsCreatePdfFromWeb:^{

            [self lsCreatePdf];
            ok();

        } no:^{
            no();
        }];
        
    }else{
        [self lsCreatePdf];
        ok();
    }
}

- (LSService *)service{
    if (!_service) {
        LSService *m = [[LSService alloc] init];
        _service = m;
    }
    return _service;
}


#pragma mark someEven
- (void)lsBarOnClick_CreatPdf:(UIBarButtonItem *)seg{
    [self presentViewController:self.popMeumView animated:YES completion:nil];
}

- (void)lsPrintInWifi{
    [self showHUD];
    
    [LSNet lsCheckNetIsWiFi:^{
        
        [self lsCreatePdfFromWeb:^{
            [self dissPHUD];
            
//            [self test:self.strDocPath];
            
//            BMYF_NOT_Line_ViewController *pageView = [[BMYF_NOT_Line_ViewController alloc]init];
//            [pageView setPathString:self.strDocPath];
//            UINavigationController *itemNav = [[UINavigationController alloc]initWithRootViewController:pageView];
//            [self presentViewController:itemNav animated:YES completion:nil];
        } no:^{
            [self dissPHUD];
            [Common lsWarnningMessage:@"创建文档失败。请重试" tagView:self];
        }];

    } onOther:^{
        [self dissPHUD];
        [Common lsWarnningMessage:@"当前联网方式不是WiFi,请开启WiFi后再试！" tagView:self];
    }];
}



//-(void)test:(NSString *)urlString
//{
//    [self.service startMongooseDaemon];
//    
//    urlString = [NSString stringWithFormat:@"%@%@",self.service.url,@"/tmp/评审文档.pdf"];
//    
//    
//    UIAlertController *alert = [UIAlertController alertControllerWithTitle:urlString message:nil preferredStyle:UIAlertControllerStyleAlert];
//    
//    UIAlertAction *photography = [UIAlertAction actionWithTitle:@"拍照" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
//        
//    }];
//    
//    UIAlertAction *cancel = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleDefault handler:nil];
//    
////    [alert addAction:photography];
//    [alert addAction:cancel];
//    
//    [self presentViewController:alert animated:YES completion:nil];
//}





















- (void)lsPrintInImg{
    [self showHUD];
        [self lsCreatePdfImg:^{
            //[self dissPHUD];
            
        } no:^{
            [self dissPHUD];
            [Common lsWarnningMessage:@"创建打印图片失败。请重试" tagView:self];
        }];
}

- (void)lsPrintInOtherApplication{
    [self showHUD];
    
    [self lsCreatePdfFromWeb:^{
        [self dissPHUD];
        //好无语的说，这几种格式化
        //NSURL *url = [NSURL URLWithString:self.strDocPath];
        //NSURL *fileURL = [NSURL initWithString:self.strDocPath];
        //[self.documentController presentOpenInMenuFromRect:self.view.bounds inView:self.view animated:YES];
        
        if (kDeviceIsiPhone) {
            [self.documentController presentOptionsMenuFromRect:self.view.bounds inView:self.view animated:YES];
        }else{
            CGRect rect = CGRectMake(0.0, 0.0, 0.0, 0.0);
            [self.documentController presentOptionsMenuFromRect:rect inView:self.view animated:YES];
            
            
            //[self presentViewController:self.documentController animated:YES completion:nil];
            
        }
        
        
        
    } no:^{
        [self dissPHUD];
        [Common lsWarnningMessage:@"创建文档失败。请重试!" tagView:self];
    }];
}


- (UIDocumentInteractionController *)documentController{
    if (!_documentController) {
        NSURL *pdfDocumentUrl = [NSURL fileURLWithPath:self.strDocPath];
        UIDocumentInteractionController *documentController =[UIDocumentInteractionController interactionControllerWithURL:pdfDocumentUrl];
        documentController.delegate = self;
        _documentController = documentController;
    }
    return _documentController;
}





- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end
