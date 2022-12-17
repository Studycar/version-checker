import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { differenceInDays  } from 'date-fns';

import { QueryService } from '../query.service';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { PcBuyerAuthService } from 'app/modules/generated_module/services/pc-buyerauth-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pcrequisition-management-line-edit',
  templateUrl: './line_edit.component.html',
  providers: [QueryService],
})
export class PcRequisitionManagementLineEditComponent implements OnInit, AfterViewInit {
  @ViewChild("f", { static: false }) f;
  record: any = {};
  today:Date= new Date();
  public i: any;  //传入参数
  public viewType:string; //视图类型  view new edit
  Isview :boolean = false;
  Isnew :boolean = false;
  //是否客指
  requiredCD:boolean = false;
  //是否是可编辑状态
  Isedit: boolean=false;
  useroptions: any[] = [];
  employoptions: any[] = [];
  userreltypeoptions: any[] = [];
  title: String = '新增';
  Istrue: boolean;
  listScheduleGroup: any[] = [];
  listAuthUsersGroup: any[] = [];
  //接收地点
  listLocation: any[] = [];
  //供应商地点
  listVendorSite : any[] = [];
  listItemVendorSite : any[] = [];
  //供应商
  listVendor: any[] = [];
  //单位
  listUnitOfMeasure: any[] = [];
  //子库
  listSubinventory: any[] = [];
  listYesOrNo: any[] = [{label:'是',value:'Y'},{label:'否',value:'N'}];
  userName: string = ""; //localStorage.getItem('user_name')
  userId:string="";
   //默认当前用户采购员
   defaultbuyer:any;
   //默认当前用户计划员
   defaultplanner:any;

  gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
   // 物料
   public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    },
    {
      field: 'unitOfMeasure',
      title: '单位',
      width: '40'
    }
  ];

  dirty = false;

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private queryservice: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private appTranslationService: AppTranslationService,
    private pcBuyerAuthService: PcBuyerAuthService,
  ) { }

  ngOnInit(): void {
    switch(this.viewType)
    {
     case 'view':
      this.Isview=true;
      break;
      case 'edit':
      this.Isedit=true;
      break;
      case 'new':
      this.Isnew=true;
       break;
    }
    if (this.i.id !== null) {
      this.Istrue = true;
      this.queryservice.GetById(this.i.id).subscribe(res => {
        this.i = res.data;
        this.itemoptionChange(this.i.itemCode);
      });
    } else {
    // this.
    }

    this.LoadData();
  }

  ngAfterViewInit() {
    console.log(this.f);
  }

  abc(){
    console.log(this.f);
  }

  LoadData() {

     //采购头状态
  this.queryservice.GetLookupByType('PS_ITEM_UNIT').subscribe(result => {
    result.Extra.forEach(d => {
      this.listUnitOfMeasure.push({
        label: d.meaning,
        value: d.lookupCode,
      });
    });
  });
    this.queryservice.GetDeliverLocation(this.i.plantCode).subscribe(res => {
      res.data.forEach(element => {
        this.listLocation.push({
          label: element.description,
          value: element.deliveryRegionCode,
        });
      });
    });

   this.queryservice.GetSubinventory(this.i.plantCode).subscribe(res => {
      res.data.forEach(element => {
        this.listSubinventory.push({
          label: element.subinventoryDescription,
          value: element.subinventoryCode,
        });
      });
    });

    this.userId = this.appconfig.getUserId();
    this.userName = this.appconfig.getUserName();
    // this.query();
    this.pcBuyerAuthService.GetAuthUserByUserName(this.userName,"0").subscribe(result=>{
      this.listAuthUsersGroup = result.data;
       //默认当前用户采购员
       this.defaultbuyer  = this.getDefaultUser("1");
       //默认当前用户计划员
       this.defaultplanner = this.getDefaultUser("2");
       //this.queryParams.values.BUYER={text:this.defaultbuyer.AUTHORIZEE_NUMBER,value: this.defaultbuyer.AUTHORIZEE_NUMBER}
       //this.queryParams.values.PLANNER={text:this.defaultplanner.AUTHORIZEE_NUMBER,value: this.defaultplanner.AUTHORIZEE_NUMBER}
    });
  }
  getDefaultUser( user_rel_type: string ){
    const buyer = this.listAuthUsersGroup.find(p=>p.authorizeeType==='1' && p.userRelType === user_rel_type )
   if( buyer && buyer.authorizeeNumber){
     return buyer;
   }
   else return {};
  }
  save() {
    if (this.i.id !== null) {
      this.queryservice.EditData(this.i).subscribe(res => {
        if (res.code==200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.queryservice.SaveForNew(this.i).subscribe(res => {
        if (res.code==200) {
          this.msgSrv.success('保存成功');
          this.modal.close({success:true , data: res.data});
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  close() {
    this.modal.destroy({success:false});
  }

  ngCustomerDesignatedChange(e:any){
    this.dirty = true;
    if(this.i.customerDesignated === "Y"   ){
     this.requiredCD =true;
    }else{
      this.requiredCD =false;
    }

  }




  searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.plantCode,this.userName,e.SearchValue, PageIndex, e.PageSize);
  }
  changeItems({ sender, event, Text }) {
    const value = this.i.itemCode || '';
    if (value !== '') {
        const _result= this.gridViewItems.data.find(x => x.itemCode === Text);
        if ( _result &&  _result.itemCode) {
          this.i.itemDescriptions = _result.descriptionsCn;
          this.i.itemId            = _result.itemId;
          this.i.unitOfMeasure            = _result.unitOfMeasure;
          this.dirty = true;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料编号无效,请重新选择!'));
          this.i.itemDescriptions = '';
          this.i.itemId = '';
          this.i.unitOfMeasure = '';
          this.dirty = false;
        }
    }
  }
  public loadItems(plantCode:string,userName:string,SearchValue: string, PageIndex: number, PageSize: number) {
    // 加载业务员
    this.queryservice.QueryPlantItemByUserAuth(plantCode,userName,SearchValue || '',PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  itemoptionChange( itemCode:string){
    //获取物料对应的供应商地点
     //获取物料对应的供应商
  this.listVendor.length = 0;
  this.i.vendorNumber = null;
  this.listVendorSite.length = 0;
  this.i.vendorSiteCode = null;
  this.queryservice.GetVendorByPlantItem(this.i.plantCode,itemCode).subscribe(res => {
    res.data.forEach(element => {
      this.listVendor.push({
        label: element.vendorNumber +'-'+element.vendorName,
        value: element.vendorNumber,
      });
    });
    if(this.listVendor.length === 1 ){
      this.i.vendorNumber = this.listVendor[0].value;
    }
    this.queryservice.GetVendorSiteByPlantItem(this.i.plantCode,itemCode).subscribe(res => {
      this.listItemVendorSite = res.data;
     const filterVendorSite = this.listItemVendorSite.filter(p=> p.vendorNumber ===  this.i.vendorNumber);
     if( filterVendorSite && filterVendorSite.length >0){
          filterVendorSite.forEach(element => {
             this.listVendorSite.push({
               label: element.vendorSiteCode + '-' + element.vendorSiteName ,
               value: element.vendorSiteCode,
               });
           });
         if(this.listVendorSite.length === 1 ){
            this.i.vendorSiteCode = this.listVendorSite[0].value;
          }
       }
     });
  });
 }


 valueChanged(value:any){
  this.dirty = true;
 }

 valueVendorNumberChanged(value:any){
  this.listVendorSite.length = 0;
  this.i.vendorSiteCode = null;
  const filterVendorSite = this.listItemVendorSite.filter(p=> p.vendorNumber ===  this.i.vendorNumber);
  if( filterVendorSite && filterVendorSite.length >0){
       filterVendorSite.forEach(element => {
          this.listVendorSite.push({
            label: element.vendorSiteCode + '-' + element.vendorSiteName ,
            value: element.vendorSiteCode,
            });
        });
      if(this.listVendorSite.length === 1 ){
         this.i.vendorSiteCode = this.listVendorSite[0].value;
       }
    }
  this.dirty = true;
 }



  itemChange(value: any) {
    const value1 = this.i.itemCode || '';
    if (value1 !== '') {
        const _result= this.gridViewItems.data.find(x => x.itemCode === value1);
        if ( _result &&  _result.itemCode) {
          console.log("---------------")
          console.log(_result)
          this.i.itemDescriptions = _result.descriptionsCn;
          this.i.itemId = _result.itemId;
          this.i.unitOfMeasure = _result.unitOfMeasure;
          this.dirty = true;
         this.itemoptionChange(value1);
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料编号无效,请重新选择!'));
          this.i.itemDescriptions = '';
          this.i.itemId = '';
          this.i.unitOfMeasure = '';
          this.dirty = false;
        }
    }
  }
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return  differenceInDays (this.today,current) > 0;
  };
  reltypeChange(value: any) {
    this.changeItems({ sender:{pageSize :10}, event:null, Text:this.i.employeeNumber || '' });
  }

  clear() {
    if (this.i.Id != null) {
      this.queryservice.GetById(this.i.Id).subscribe(res => {
        this.i = res.data;
      });
    }

  }
}

