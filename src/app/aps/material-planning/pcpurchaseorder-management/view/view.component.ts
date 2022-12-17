import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { _HttpClient,ModalHelper } from '@delon/theme';
//import { ModalHelper } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext, ServiceOptions } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { PcBuyerAuthService } from 'app/modules/generated_module/services/pc-buyerauth-service';
import { fakeAsync } from '@angular/core/testing';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pc-purchaseorder-management-view',
  templateUrl: './view.component.html',
  providers: [QueryService],
})
export class PCPurchaseOrderManagementViewComponent extends CustomBaseContext implements OnInit, AfterViewInit {
  @ViewChild("f", { static: false }) f;
  record: any = {};
  public i: any;  //传入参数
  public viewType:string; //视图类型  view new edit
  Isview :boolean = false;
  Isnew :boolean = false;
  Isedit :boolean = false;
  useroptions: any[] = [];
  employoptions: any[] = [];
  userreltypeoptions: any[] = [];
  title: String = '新增';
  Istrue: boolean = false;
  Isdeleteltrue: boolean = false;
  Isapprovaltrue: boolean = false;
  op_step:number = 0;

  listPlant: any[] = [];
  listDataType: any[] = [{ label: '需求', value: '1' }, { label: '供应', value: '2' }];
  //物料类型
  listItemType: any[] = [];
  //保税类型
  listBondedType: any[] = [];
  listSubinventory:any[] = [];
  //接收地点
  listLocation:any[] = [];
  listOrderType: any[] = [];
    //单位
  listUnitOfMeasure: any[] = [];
  // PR头状态
  listPOStatus: any[] = [];
  listPOLStatus: any[] = [];
  listSourcePlant: any[] = [];
  listScheduleGroup: any[] = [];
  listAuthUsersGroup: any[] = [];
  // 来源字典表
  listPRSourceStatus : any[] = [];
  listYesOrNo: any[] = [{label:'是',value:'Y'},{label:'否',value:'N'}];
  userName: string = ""; //localStorage.getItem('user_name')
  userId:string="";
   //默认当前用户采购员
   defaultbuyer:any;
   //默认当前用户计划员
   defaultplanner:any;
  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'employeeNumber',
      title: '人员编码',
      width: '50'
    },
    {
      field: 'fullName',
      title: '姓名',
      width: '50'
    }
  ];

  dirty = true;
  isRowSelectable(rowNode){
    return !rowNode.gridOptionsWrapper.gridOptions.context.Isview;
  }
  gridHeight = 300;
  columns = [
    {
      colId: 0, cellClass: '', field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true,
      headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      },suppressSizeToFit: true,
    },
    { field: 'plantCode', width: '80',headerName: '工厂', menuTabs: ['filterMenuTab']},
    { field: 'poNumber', width: '100',headerName: '采购订单号', menuTabs: ['filterMenuTab'] },
    { field: 'lineNum', width: '30',headerName: '行号', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', width: '80', headerName: '物料编码', menuTabs: ['filterMenuTab'] ,
    cellClassRules: {
     'boldStyle': function (params) { return params.context.dataRowChange(params.data); },
   }},
   { field: 'itemDescriptions',  width: '100',headerName: '物料描述', menuTabs: ['filterMenuTab'],
   cellClassRules: {
    'boldStyle': function (params) { return params.context.dataRowChange(params.data); },
    }, },
    { field: 'unitOfMeasure',width: '40', headerName: '单位', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,7)' },
    { field: 'canColse',width: '40', headerName: '可关闭', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,4)'},
    { field: 'canChange',width: '40', headerName: '可转单', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,4)'},
    { field: 'buyerName', width: '60', headerName: '采购员', menuTabs: ['filterMenuTab'] },
    { field: 'quantity',width: '60', headerName: '订单数量', menuTabs: ['filterMenuTab']},
    { field: 'canChangeQty',width: '60', headerName: '可转单量', menuTabs: ['filterMenuTab'] },
    { field: 'receivedQty',width: '60', headerName: '接收数量', menuTabs: ['filterMenuTab'] },
    { field: 'canUseQty',width: '60', headerName: '可用量', menuTabs: ['filterMenuTab'] },
    { field: 'vendorNumber',width: '80', headerName: '供应商编码', menuTabs: ['filterMenuTab'] },
    { field: 'vendorName',width: '80', headerName: '供应商名称', menuTabs: ['filterMenuTab'] },
    { field: 'vendorSiteCode', width: '80',headerName: '供应商地点', menuTabs: ['filterMenuTab']},
    { field: 'destinationSubinventory',width: '80',  headerName: '接收子库', menuTabs: ['filterMenuTab'] },
    { field: 'deliverToLocationId',width: '80', headerName: '收货地点', menuTabs: ['filterMenuTab'] },
    { field: 'currencyCode', width: '40',headerName: '币种', menuTabs: ['filterMenuTab'] },
    { field: 'needByDate',width: '60', headerName: '需求日期', menuTabs: ['filterMenuTab']},
    { field: 'creationDate',width: '60', headerName: '下单日期', menuTabs: ['filterMenuTab'] },
    { field: 'poType', width: '60',headerName: '订单类型', menuTabs: ['filterMenuTab'],valueFormatter: 'ctx.optionsFind(value,2)' },
    { field: 'hstatus',width: '60', headerName: '订单状态', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,5)' },
    { field: 'lstatus',width: '60', headerName: '行状态', menuTabs: ['filterMenuTab'] , valueFormatter: 'ctx.optionsFind(value,6)'},
    { field: 'bondedType',width: '60', headerName: '保税类型', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,3)' },
    { field: 'projectNumber',width: '60', headerName: '项目号', menuTabs: ['filterMenuTab'] },
    { field: 'ospNumber', width: '60', headerName: '外协工单编号', menuTabs: ['filterMenuTab'] },
    { field: 'changeToVendor',width: '80', headerName: '转供应商代码', menuTabs: ['filterMenuTab'],},
    { field: 'changeToVendorName',width: '80', headerName: '转供应商名称', menuTabs: ['filterMenuTab']},
    { field: 'changeQty',width: '80', headerName: '转单数量', menuTabs: ['filterMenuTab'] },
    { field: 'unCloseReason',  width: '100',headerName: '不可关闭原因', menuTabs: ['filterMenuTab'] },
    { field: 'unChangeReason', width: '100', headerName: '不可转单原因', menuTabs: ['filterMenuTab'] },
    { field: 'mrpSuggess', width: '100', headerName: 'MRP建议', menuTabs: ['filterMenuTab'] },
     ];

query() {
    super.query();
    this.commonQuery();
  }
commonQuery() {
    // console.log(this.queryParams.values.IS_QUERY_DEMAND);
    // console.log(this.queryParams.values.IS_QUERY_SUPPLY);
     this.queryService.loadGridView(this.queryService.purchaseOrderManagementQuery, this.getQueryParams(), this.context);
  }
formatDate(date?: Date): string {
    if (!date) return '';
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  getQueryParams(isExport?: boolean) {
    return {
      plantCode: this.i.plantCode,
      poType: this.i.poType,
      poNumber:  this.i.poNumber,
      itemCode: "",
      itemDescriptions: "",
      buyer: "",
      projectNumber:"",
      vendorNumber: "",
      hstatus: "",
      lstatus: "",
      demandSupplyDateS: null,
      demandSupplyDateT: null,
      creationDateS: null,
      creationDateT: null,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: isExport
    };
  }

  dataRowChange(dataItem:any){
    return false;
  }
  constructor(
    private modal: NzModalRef,
    private modalhelper: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appConfig: AppConfigService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appTranslate: AppTranslationService,
    private appGridStateService: AppGridStateService,
    private modalService: NzModalService,
    public pro: BrandService,
    private pcBuyerAuthService: PcBuyerAuthService,
  ){
    super(<ServiceOptions>{ appTranslationSrv: appTranslate, msgSrv: msgSrv, appConfigSrv: appConfig, pro: pro });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    //设置当前页面状态
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
    this.LoadData();
    this.reflashGrid();

  }

  ngAfterViewInit() {
    console.log(this.f);
  }

  abc(){
    console.log(this.f);
  }
  //刷新当前页面
  reflashGrid(){
    this.queryService.GetPurchaseOrderById(this.i.id).subscribe(res => {
      if(res && res.data)
      {
          this.i = res.data;
          if (this.i.hstatus === "NEW"  || this.i.hstatus === "REAPPROVE" || this.i.hstatus === "REJECT" )
          {
            this.Isapprovaltrue = true;
          }
          else
          {
            this.Isapprovaltrue = false;
          }
          if(this.i.hstatus === "NEW"  || this.i.hstatus === "REJECT" )
          {
            this.Isdeleteltrue = true;
          }
           else
          {
            this.Isdeleteltrue = false;
          }
      }
      else
      {

       this.Isedit = false;
       this.Istrue = false;
       this.Isdeleteltrue = false;
      }
       this.query();
      });
  }

  LoadData() {

    this.queryService.GetLookupByType('PS_ITEM_UNIT').subscribe(result => {
      result.Extra.forEach(d => {
        this.listUnitOfMeasure.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.queryService.GetLookupByType('PC_PO_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.listPOStatus.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    this.queryService.GetLookupByType('PC_POL_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.listPOLStatus.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    // 订单类型

    this.queryService.GetLookupByType('PC_PO_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.listOrderType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    // 供应类型
    this.queryService.GetLookupByType('PS_ITEM_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.listItemType.push({
          label: d.meaning + '-' + d.lookupCode ,
          value: d.lookupCode,
        });
      });
    });
    // 保税类型
    this.queryService.GetLookupByType('PC_BONDED_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.listBondedType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  // 加载工厂
  this.userId = this.appConfig.getUserId();
  this.userName = this.appConfig.getUserName();
  this.queryService.GetUserPlant().subscribe(result => {
    // this.plantOptions.length = 0;
    result.Extra.forEach(d => {
      this.listPlant.push({ value: d.plantCode, label: d.plantCode });
    });
  });
  // this.query();
  this.pcBuyerAuthService.GetAuthUserByUserName(this.userName,"0").subscribe(result=>{
    this.listAuthUsersGroup = result.data;
     //默认当前用户采购员
     this.defaultbuyer  = this.getDefaultUser("1");
     //默认当前用户计划员
     this.defaultplanner = this.getDefaultUser("2");
     //判断是否是当前授权人
     if( this.isAuthBuyer(this.i))
     {
       this.Istrue = true;
     }
     else
     {
       this.Istrue = false;
     }

     //this.queryParams.values.BUYER={text:this.defaultbuyer.AUTHORIZEE_NUMBER,value: this.defaultbuyer.AUTHORIZEE_NUMBER}
     //this.queryParams.values.PLANNER={text:this.defaultplanner.AUTHORIZEE_NUMBER,value: this.defaultplanner.AUTHORIZEE_NUMBER}
  });
}
// 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#MrpPlanWorkbenchGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
       // if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
       //   dom.setAttribute('style', 'color: #FFA500');
      //  }
      });
    }
  }

  public isAuthBuyer(dataItem: any ){
    if(dataItem.buyer && dataItem.buyer !== "" &&  this.listAuthUsersGroup)
    {
        let authuser=  this.listAuthUsersGroup.find(x=> x.userRelType === "1" &&(x.authorizeeName === dataItem.buyer || x.authorizeeNumber === dataItem.buyer) );
        if( authuser && authuser.authorizeeNumber)
        {
         return true;
        }
        else
        {
      return false;
     }
    }
    return false;
  }
  public loadGridDataCallback(result) {
    this.onVirtualColumnsChanged(result);
  }
  getDefaultUser( user_rel_type: string ){
    const buyer = this.listAuthUsersGroup.find(p=>p.authorizeeType==='1' && p.userRelType === user_rel_type )
   if( buyer && buyer.authorizeeNumber){
     return buyer;
   }
   else return {};
  }
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1: // 物料类型
      options = this.listItemType;
      break;
    case 2: // 订单类型
      options = this.listOrderType;
      break;
    case 3: // 保税类型
      options = this.listBondedType;
      break;
      case 4: // 是否类型
      options = this.listYesOrNo;
      break;
      case 5: // 订单状态
      options = this.listPOStatus;
      break;
      case 6: // 订单行状态
      options = this.listPOLStatus;
      break;
      case 7: // 单位
      options = this.listUnitOfMeasure;
      break;
    }
    const obj = options.find(x => x.value === value) || { label: value };
    return obj ? obj.label : null;
  }

  close() {
    this.modal.destroy({DataChange: this.op_step > 0});
  }

  removerows() {
      if (this.gridData === null || this.gridData.length === 0) {
        return;
      }
      const dtRemove = this.gridApi.getSelectedRows();
      if (dtRemove.length === 0) {
        const msg = this.appTranslate.translate('请勾选数据！');
        this.msgSrv.info(msg);
        return;
      }
      this.op_step++;
      this.queryService.RemoveBathPurchaseOrder(dtRemove)
        .subscribe(res => {
          if (res.code==200) {
            this.msgSrv.success(this.appTranslate.translate('删除成功'));
            this.reflashGrid();
          } else {
            this.msgSrv.error(this.appTranslate.translate(res.msg));
          }
        });
  }


//提交审批
approval(){
  if (this.gridData === null || this.gridData.length === 0) {
    this.msgSrv.error(this.appTranslate.translate("没有可供审批的信息"));
    return;
  }
  this.op_step++;
  this.queryService.ApprovalPurchaseOrder(this.i)
        .subscribe(res => {
          if (res.code==200) {
            this.msgSrv.success(this.appTranslate.translate('审批成功'));
            this.reflashGrid();
            this.Isview = true;
          } else {
            this.msgSrv.error(this.appTranslate.translate(res.msg));
          }
        });
}

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}

