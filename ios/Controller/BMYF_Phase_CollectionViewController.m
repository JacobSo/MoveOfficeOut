//
//  BMYF_Phase_CollectionViewController.m
//  moveoffice
//
//  Created by ZHUOQIN on 16/5/12.
//  Copyright © 2016年 ZHUOQIN. All rights reserved.
//

#import "BMYF_Phase_CollectionViewController.h"
#import "ProductPsStateCell.h"
#import "BMYF_Phase_Detil_ViewController.h"
#import "LSPopView.h"
#import "BMYF_SHOW_ViewController.h"
#import "ProductPsStateHeadNew.h"

@interface BMYF_Phase_CollectionViewController ()<UIPopoverPresentationControllerDelegate,UISearchDisplayDelegate,UISearchBarDelegate>{
@private
    NSString *_pageTitle;
    NSMutableArray <WDProduct *> *showProductlist;
    NSMutableArray <WDProduct *> *allProductlist;
    NSMutableArray <WDProduct *> *passProductlist;
    NSMutableArray <WDProduct *> *noProductlist;
    NSMutableArray <WDProduct *> *nullProductlist;
    
    NSMutableArray <WDProduct *> *searchProductlist;
    
    WDSeries *serice;
    MBProgressHUD *mbPHUD;
    UISearchBar *searchBar_search;
}

@property (nonatomic,strong)UICollectionViewFlowLayout *flowLayout;
@property (nonatomic,strong)UIBarButtonItem  *barbutton_P;

@property (nonatomic,strong)NSString *savePath;

@property (nonatomic,strong)BMYF_SHOW_ViewController  *showPage;
@property (nonatomic,strong)UINavigationController *itemNav ;
@property (nonatomic,strong)LSPopView *popMeumView;


@end

@implementation BMYF_Phase_CollectionViewController




- (instancetype)init{
    self.flowLayout = [[UICollectionViewFlowLayout alloc]init];
    [self.flowLayout setScrollDirection:UICollectionViewScrollDirectionVertical];
    self = [super initWithCollectionViewLayout:self.flowLayout];
    if (!self) {
        return nil;
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    [self lsInitNav];
    [self lsInitCollection];
    
    
    showProductlist = self.selectProductlist;
    
 //   allProductlist = [[NSMutableArray <WDProduct *> alloc]init];
    passProductlist = [[NSMutableArray <WDProduct *> alloc]init];
    noProductlist = [[NSMutableArray <WDProduct *> alloc]init];
    nullProductlist = [[NSMutableArray <WDProduct *> alloc]init];
}

- (void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    

    
}

//刷新状态
-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    self.showPage = nil;
    self.itemNav = nil;
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        
        dispatch_async(dispatch_get_main_queue(), ^{
            NSString *path = [NSString stringWithFormat:self.savePath,self.serictGuid];
            NSDictionary *dic = [LSCacheData lsRead:path];
            if (dic) {
                passProductlist = [[NSMutableArray <WDProduct *> alloc]init];
                noProductlist = [[NSMutableArray <WDProduct *> alloc]init];
                nullProductlist = [[NSMutableArray <WDProduct *> alloc]init];
                
                serice = [WDSeries mj_objectWithKeyValues:dic];
                showProductlist = [serice.Itemlist mutableCopy];
                allProductlist = [serice.Itemlist mutableCopy];
                
                /* 20160720手工强制排序 */
                showProductlist = [Utils sortByItem:@"ItemName" initDataScore:serice.Itemlist  isAscending:YES];
                allProductlist = [Utils sortByItem:@"ItemName" initDataScore:serice.Itemlist  isAscending:YES];
                
                
                /* 这里需要区分不同状态 */
                [serice.Itemlist enumerateObjectsUsingBlock:^(WDProduct * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                    switch (obj.pStatusPass) {
                        case WD_Result_Null:
                            [nullProductlist addObject:obj];
                            break;
                        case WD_Result_Fail:
                            [noProductlist addObject:obj];
                            break;
                        case WD_Result_Pass:
                            [passProductlist addObject:obj];
                            break;
                        default:
                            break;
                    }
                }];

                [self.collectionView reloadData];
            }
        });
        
    });


}

- (NSString *)savePath{
    if (!_savePath) {
        switch (self.phaseType) {
            case PhaseType_BP:
                _savePath = LSPath_CS_CL1(@"%@");
                break;
            case PhaseType_CP:
                _savePath = LSPath_CS_CL2(@"%@");
                break;
            case PhaseType_BZ:
                _savePath = LSPath_CS_CL3(@"%@");
                break;
            default:
                break;
        }
    }
    return _savePath;
}


- (LSPopView *)popMeumView{
    _popMeumView = [[LSPopView alloc]initData:@[@"预览报告",@"上传评审"]];
    _popMeumView.modalPresentationStyle = UIModalPresentationPopover;
    _popMeumView.popoverPresentationController.barButtonItem = self.navigationItem.rightBarButtonItem;
    _popMeumView.popoverPresentationController.permittedArrowDirections = UIPopoverArrowDirectionUp;
    _popMeumView.popoverPresentationController.delegate = self;
    
    _popMeumView.chooseSubject = [RACSubject subject];
    [_popMeumView.chooseSubject subscribeNext:^(id x) {
        [_popMeumView dismissViewControllerAnimated:YES completion:nil];
        switch ([x integerValue]) {
            case 0:
                [self lsCreatBG];
                break;
            case 1:
                [self lsUploadPS];
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


- (UIBarButtonItem *)barbutton_P{
    if (!_barbutton_P) {
        UIBarButtonItem *barButton = [[UIBarButtonItem alloc]initWithImage:[UIImage imageNamed:@"P_PP"]
                                                                     style:UIBarButtonItemStyleDone
                                                                    target:self
                                                                    action:@selector(lsBarOnClick_Print:)];
        _barbutton_P = barButton;
    }
    return _barbutton_P;
}

- (void)lsBarOnClick_Print:(UIBarButtonItem *)seg{
    [self presentViewController:self.popMeumView animated:YES completion:nil];
}

- (void)lsCreatBG{
    
    /*选择需要生成文档的产品。*/
    
    
    self.showPage = [[BMYF_SHOW_ViewController alloc]init];
    [self.showPage setSelectSeries:serice];
    [self.showPage setPhaseType:self.phaseType];
    self.itemNav = [[UINavigationController alloc]initWithRootViewController:self.showPage];
    [self presentViewController:self.itemNav animated:YES completion:nil];
}

- (void)lsUploadPS{

    __block NSInteger _null = 0;
    
    [showProductlist enumerateObjectsUsingBlock:^(WDProduct * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        switch (obj.pStatusPass) {
            case WD_Result_Null:
                _null ++;
                break;
            default:
                break;
        }
    }];
#warning 去掉限制

//    if (_null != 0) {
//        NSString *text = [NSString stringWithFormat:@"评审完整个阶段的产品才能上传哦！\n现在还有 %ld 个产品未评审！",(long)_null];
//        [Common lsWarnningMessage:text tagView:self];
//        return;
//    }
    
    
    
    [LSNet lsCheckNetOnline:^{
        
        
        

        
        //弹个框提示要上传什么了
        
        //遍历目录中的待上传的评审项

        //取出要上传的评审
        
        //获取要上传的评审有没有图片
        
        //上传评审项目
        
        
        //上传图片
        
        //获取那么
        
        //不同评审项的修改
        
        //加载需要上传的任务
        [self showHUD_1];
        NSMutableArray <WDProductReView *> *productDatas = [[NSMutableArray <WDProductReView *> alloc]init];
        NSMutableArray <PicEnty *> *ImgDatas = [[NSMutableArray <PicEnty *> alloc]init];
        [showProductlist enumerateObjectsUsingBlock:^(WDProduct * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            
            /*评审过的产品，需要点击通过或者不通过才算哦*/
            if (obj.pStatusPass != WD_Result_Null) {
                
                NSString *path = [NSString stringWithFormat:self.savePath,obj.ItemGuid];
                NSDictionary *dic = [LSCacheData lsRead:path];
                if (dic) {
                    WDProductReView *data = [WDProductReView mj_objectWithKeyValues:dic];
                    if (data)[productDatas addObject:data];

                    /*产品评审图片*/
                    NSString *psPath = LSPath_PS(obj.ItemGuid, self.phaseType);
                    NSDirectoryEnumerator *dir=[[NSFileManager defaultManager] enumeratorAtPath:psPath];
                    NSString *path=[NSString new];
                    while ((path=[dir nextObject])!=nil) {
                        @autoreleasepool {
                            UIImage *savedImage = [[UIImage alloc] initWithContentsOfFile:[psPath stringByAppendingPathComponent:path]];
                            if (savedImage) {
                                NSData *imgData =  UIImageJPEGRepresentation(savedImage, 0.1);
                                NSString *imgBase64str = [imgData base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
                                PicEnty *pic = [[PicEnty alloc]init];
                                [pic setImgCode:imgBase64str];
                                [pic setFileName:path];
                                [pic setPhaseCode:self.phaseType];
                                [pic setParaGuid:obj.ItemGuid];
                                [ImgDatas addObject:pic];
                            }
                        }
                    }
                }
            }
        }];
        
        //判定有多少个上传任务
        if (productDatas.count >0) {
            //[self showHUD_1];
            
            NSArray *productList = [WDProductReView mj_keyValuesArrayWithObjectArray:productDatas];
            PlateTrackReviewResult_Request *request = [[PlateTrackReviewResult_Request alloc]init];
            [request setAccount: [Utils kLoginUserName]];
            [request setFileName:ObjectToJsonString(productList)];
            [LSNet ls_LSAPI_PlateTrackReviewResult:request success:^(PlateTrackReviewResult_Response *result) {
                
                if (ImgDatas.count >0){
                    [self showHUD_3];
                    [ImgDatas enumerateObjectsUsingBlock:^(PicEnty * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                        NSMutableArray *arr = [[NSMutableArray alloc]init];
                        [arr addObject:obj];
                        NSArray *imgArr = [PicEnty mj_keyValuesArrayWithObjectArray:arr];
                        PlateTrackImgUpload_Request *request = [[PlateTrackImgUpload_Request alloc]init];
                        [request setAccount:[Utils kLoginUserName]];
                        [request setListPicJson:ObjectToJsonString(imgArr)];
                        
                        [LSNet ls_LSAPI_PlateTrackImgUpload:request success:^(BOOL result) {
                            
                            if (ImgDatas.count == idx+1) {
                                [self dissPHUD];
                                [ Common lsSuccessMessage:@"评审图片上传成功！" tagView:self];
                            }

                            
                        } failure:^(LsErrorResult *error) {
                            [self dissPHUD];
                            [Common lsErrorMessage:error.ErrDesc tagView:self requestJson:@""];
                        }];
                        
                    }];
                }
                [self dissPHUD];
                [ Common lsSuccessMessage:@"评审上传成功！" tagView:self];
                
            } failure:^(LsErrorResult *error) {
                [self dissPHUD];
                [Common lsErrorMessage:error.ErrDesc tagView:self requestJson:@""];
            }];
        }
        else{
            [self dissPHUD];
            [Common lsWarnningMessage:@"没有可上传的任务！" tagView:self];
        
        }

    } Offline:^{
        [self dissPHUD];
        [Common lsWarnningMessage:@"没有网络哦！打开网络再上传吧" tagView:self];
    }];

}


#pragma mark Create UI
- (void)lsInitNav{
    
    [self.navigationItem setRightBarButtonItem:self.barbutton_P];
    switch (self.phaseType) {
        case PhaseType_BP:
            _pageTitle = @"白胚评审";
            break;
        case PhaseType_CP:
            _pageTitle = @"成品评审";
            break;
        case PhaseType_BZ:
            _pageTitle = @"包装评审";
            break;
        default:
            break;
    }
    [self setTitle:_pageTitle];
    //[self setTitle:@"评审详情"];
}

- (void)lsInitCollection{
    [self.collectionView setBackgroundColor:[UIColor whiteColor]];
    
    [self.flowLayout setHeaderReferenceSize:CGSizeMake(CGRectGetWidth(self.collectionView.frame), 264)];
    
    UINib *productPsNib = [UINib nibWithNibName:[ProductPsStateCell cellNibName] bundle:nil];
    [self.collectionView registerNib:productPsNib forCellWithReuseIdentifier:[ProductPsStateCell cellIdentifier]];
    
//    UINib *productHeadNib = [UINib nibWithNibName:[ProductPsStateHead cellNibName] bundle:nil];
//    [self.collectionView registerNib:productHeadNib
//          forSupplementaryViewOfKind:UICollectionElementKindSectionHeader
//                 withReuseIdentifier:[ProductPsStateHead cellIdentifier]];
    
    UINib *productHeadNib = [UINib nibWithNibName:[ProductPsStateHeadNew cellNibName] bundle:nil];
    [self.collectionView registerNib:productHeadNib
          forSupplementaryViewOfKind:UICollectionElementKindSectionHeader
                 withReuseIdentifier:[ProductPsStateHeadNew cellIdentifier]];
}



#pragma mark UISearchBar
- (void)searchBarSearchButtonClicked:(UISearchBar *)searchBar{
    [searchBar resignFirstResponder]; 
}
- (void)searchBar:(UISearchBar *)searchBar textDidChange:(NSString *)searchText{
    if (searchText != nil && searchText.length > 0) {
        searchProductlist= [[NSMutableArray <WDProduct *> alloc]init];
        [allProductlist enumerateObjectsUsingBlock:^(WDProduct * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            if ([obj.ItemName rangeOfString:searchText options:NSCaseInsensitiveSearch].length >0 )
                [searchProductlist addObject:obj];
            else if ([obj.ItemRemark rangeOfString:searchText options:NSCaseInsensitiveSearch].length >0)
                [searchProductlist addObject:obj];
        }];
        showProductlist = searchProductlist;
        [self.collectionView reloadData];
    }
    else{
        showProductlist = allProductlist;
        [self.collectionView reloadData];
    }
}
- (void)scrollViewDidScroll:(UIScrollView *)scrollView{
    [searchBar_search resignFirstResponder];
}




#pragma mark <UICollectionViewDataSource>
- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return showProductlist.count;
}



- (UICollectionReusableView *)collectionView:(UICollectionView *)collectionView viewForSupplementaryElementOfKind:(NSString *)kind atIndexPath:(NSIndexPath *)indexPath{

    
    ProductPsStateHeadNew *pHead = [collectionView dequeueReusableSupplementaryViewOfKind:UICollectionElementKindSectionHeader
                                                                      withReuseIdentifier:[ProductPsStateHeadNew cellIdentifier]
                                                                             forIndexPath:indexPath];
    
    /*注意这里不能用 showProductlist*/
    [pHead lsLoadData:allProductlist psType:self.phaseType];
    pHead.searchBar_search.delegate = self;
    pHead.searchBar_search.returnKeyType = UIReturnKeyDone;
    searchBar_search =  pHead.searchBar_search;
    
    /*筛选不同显示状态*/
    pHead.button_pass_count.rac_command = [[RACCommand alloc]initWithSignalBlock:^RACSignal *(id input) {
        showProductlist = allProductlist;
        [self.collectionView reloadData];
        return [RACSignal empty];
    }];
    pHead.button_OK_count.rac_command = [[RACCommand alloc]initWithSignalBlock:^RACSignal *(id input) {
        showProductlist = passProductlist;
        [self.collectionView reloadData];
        return [RACSignal empty];
    }];
    pHead.button_NO_count.rac_command = [[RACCommand alloc]initWithSignalBlock:^RACSignal *(id input) {
        showProductlist = noProductlist;
        [self.collectionView reloadData];
        return [RACSignal empty];
    }];
    pHead.button_NULL_count.rac_command = [[RACCommand alloc]initWithSignalBlock:^RACSignal *(id input) {
        showProductlist = nullProductlist;
        [self.collectionView reloadData];
        return [RACSignal empty];
    }];
    return pHead;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    
    ProductPsStateCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:[ProductPsStateCell cellIdentifier] forIndexPath:indexPath];
    cell.viewModel = showProductlist[indexPath.row];
    return cell;
}

- (void)collectionView:(UICollectionView *)collectionView willDisplayCell:(UICollectionViewCell *)cell forItemAtIndexPath:(NSIndexPath *)indexPath{
    
    
    [(ProductPsStateCell *)cell lsCellLodaData:showProductlist[indexPath.row]];
    
    ((ProductPsStateCell *)cell).button_print.rac_command = [[RACCommand alloc]initWithSignalBlock:^RACSignal *(id input) {
        
        WDProduct *product = showProductlist[indexPath.row];

        /*修改打印选项并保存*/
        NSString *path2 = [NSString stringWithFormat:self.savePath,self.serictGuid];
        NSDictionary *dic = [LSCacheData lsRead:path2];
        WDSeries *sericeHis = [WDSeries mj_objectWithKeyValues: dic];
        [sericeHis.Itemlist enumerateObjectsUsingBlock:^(WDProduct * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            if ([obj.ItemGuid isEqualToString:product.ItemGuid]) {
                switch (obj.isPrint) {
                    case WD_NO_PRINT_BP:
                        obj.isPrint = WD_YES_PRINT_CP;
                        product.isPrint = WD_YES_PRINT_CP;
                        break;
                        
                    default:
                        obj.isPrint = WD_NO_PRINT_BP;
                        product.isPrint = WD_NO_PRINT_BP;
                        break;
                }
                *stop = YES;
            }
        }];
        [LSCacheData lsSave:serice.mj_keyValues path:path2];
        
        /*打印显示黄色，不打印显示白色*/
        switch (product.isPrint) {
            case WD_NO_PRINT_BP:
                [((ProductPsStateCell *)cell).button_print setImage:[UIImage imageNamed:@"img_CANT_PRINT"] forState:UIControlStateNormal];
                break;
            default:
                [((ProductPsStateCell *)cell).button_print setImage:[UIImage imageNamed:@"img_CAN_PRINT"] forState:UIControlStateNormal];
                break;
        }
        return [RACSignal empty];
    }];
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath{
    CGFloat height = (CGRectGetWidth(self.collectionView.frame) - 40) / 3;
    return CGSizeMake(height, height);
}

- (UIEdgeInsets)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout insetForSectionAtIndex:(NSInteger)section{
    return UIEdgeInsetsMake(10, 10, 10, 10);
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
    
    //        self.selectDataScore.State  = [NSNumber numberWithInt:0];
    
    WDProduct *products = showProductlist[indexPath.row];
    if (products.stage == 1 && (self.phaseType == PhaseType_BP || self.phaseType == PhaseType_CP)) {
        [Common lsWarnningMessage:@"当前产品不用评审" tagView:self];
        return;
    }else if (products.stage == 2 && (self.phaseType == PhaseType_BP || self.phaseType == PhaseType_BZ)){
        [Common lsWarnningMessage:@"当前产品不用评审" tagView:self];
        return;
    }else if (products.stage == 3 && self.phaseType == PhaseType_BP){
        [Common lsWarnningMessage:@"当前产品不用评审" tagView:self];
        return;
    }else if (products.stage == 4 && (self.phaseType == PhaseType_CP || self.phaseType == PhaseType_BZ)){
        [Common lsWarnningMessage:@"当前产品不用评审" tagView:self];
        return;
    }else if (products.stage == 5 && self.phaseType == PhaseType_CP){
        [Common lsWarnningMessage:@"当前产品不用评审" tagView:self];
        return;
    }else if (products.stage == 6 && self.phaseType == PhaseType_BZ){
        [Common lsWarnningMessage:@"当前产品不用评审" tagView:self];
        return;
    }
    
    BMYF_Phase_Detil_ViewController *phaseDetil = [[BMYF_Phase_Detil_ViewController alloc]init];
    [phaseDetil setTitle:_pageTitle];
    [phaseDetil setSelectProduct:showProductlist[indexPath.row]];
    [phaseDetil setSerictGuid:self.serictGuid];
    [phaseDetil setPhaseType:self.phaseType];
    UINavigationController *masterNav = [[UINavigationController alloc]initWithRootViewController:phaseDetil];
    [self presentViewController:masterNav animated:YES completion:nil];
}


#pragma mark PHUD
- (void)showHUD_1{
    mbPHUD = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    mbPHUD.mode = MBProgressHUDModeIndeterminate;
    mbPHUD.labelText = @"正在加载任务……";
}

- (void)showHUD_2{
//    mbPHUD = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
//    mbPHUD.mode = MBProgressHUDModeIndeterminate;
    mbPHUD.labelText = @"正在上传评审项……";
}
- (void)showHUD_3{
//    mbPHUD = [MBProgressHUD showHUDAddedTo:self.view animated:YES];
//    mbPHUD.mode = MBProgressHUDModeIndeterminate;
    mbPHUD.labelText = @"正在上传评审图片……";
}
- (void)dissPHUD{
    [mbPHUD hide:YES];
    mbPHUD = nil;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end





















