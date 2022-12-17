import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext, ServiceOptions } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { PcBuyerAuthService } from 'app/modules/generated_module/services/pc-buyerauth-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from './query.service';
//import { MrpPlanningExceptionComponent } from './view/planning-exception.component';
import { PcRequisitionManagementEditComponent } from './view/edit.component';
import { ResultComponent } from '@delon/abc';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PcRequisitionManagementLineEditComponent } from './view/line_edit.component';
import { PcRequisitionManagementCancelConfireComponent } from './view/cancelconfirm.component';
//import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pc-requisition-management',
  templateUrl: './pcrequisition-management.component.html',
  providers: [QueryService],
  encapsulation: ViewEncapsulation.None,
  styles: [`.boldStyle {font-weight:bold ;}`]
})
export class PcRequisitionManagementComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private appTranslate: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfig: AppConfigService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService,
    private queryService: QueryService,
    private pcBuyerAuthService: PcBuyerAuthService,
  ) {
    super(<ServiceOptions>{ appTranslationSrv: appTranslate, msgSrv: msgSrv, appConfigSrv: appConfig, pro: pro });
    this.headerNameTranslate(this.columns);
  }

  inputParam: any;
  isPopShow = false; // 是否其他页面弹出
  isFormLoad = true;
  listPlant: any[] = [];
  listDataType: any[] = [{ label: '需求', value: '1' }, { label: '供应', value: '2' }];
  //物料类型
  listItemType: any[] = [];
  //保税类型
  listBondedType: any[] = [];
  //子库
  listSubinventory:any[] = [];
  //接收地点
  listLocation:any[] = [];
  listOrderType: any[] = [];
  listYesOrNo: any[] = [{label:'是',value:'Y'},{label:'否',value:'N'}];
  //单位
  listUnitOfMeasure: any[] = [];
  // PR头状态
  listPRStatus: any[] = [];
  listPRLStatus: any[] = [];
  listSourcePlant: any[] = [];
  listScheduleGroup: any[] = [];
  listAuthUsersGroup: any[] = [];
  listDocumentNum: any[] = [];//申请编号列表
  LatestPlanVersion:string ="";
  userName: string = ""; //localStorage.getItem('user_name')
  userId:string="";
  context = this;
  now = new Date();
  isModalVisible:boolean = false;
  //默认当前用户采购员
  defaultbuyer:any;
  //默认当前用户计划员
  defaultplanner:any;
   // 物料
   public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };

  //供应商
  public gridViewVendors: GridDataResult = {
    data: [],
    total: 0
  };

  //收货地点
  public gridViewLocation: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsLocation: any[] = [
    {
      field: 'deliveryRegionCode',
      title: '收货地点编码',
      width: '100'
    },
    {
      field: 'description',
      title: '收货地点描述',
      width: '100'
    }
  ];

//依赖编号查询列表
public gridViewDocumentNum: GridDataResult = {
    data: [],
    total: 0
 };
 public columnsDocumentNum: any[] = [
  {
    field: 'documentNum',
    title: '依赖编号',
    width: '120'
  },
  {
    field: 'createdBy',
    title: '创建人',
    width: '60'
  }
];



 //子库
 public gridViewSubinventory: GridDataResult = {
  data: [],
  total: 0
};
public columnsSubinventory: any[] = [
  {
    field: 'subinventoryCode',
    title: '子库编码',
    width: '100'
  },
  {
    field: 'subinventoryDescription',
    title: '子库描述',
    width: '100'
  }
];
  // 物料
  public columnsVendors: any[] = [
    {
      field: 'vendorNumber',
      title: '供应商编号',
      width: '100'
    },
    {
      field: 'vendorName',
      title: '供应商名称',
      width: '180'
    },
    {
      field: 'vendorShortName',
      title: '供应商简称',
      width: '150'
    },
    {
      field: 'vendorSiteCode',
      title: '供应商地点代码',
      width: '100'
    },
    {
      field: 'vendorSiteName',
      title: '供应商地点名称',
      width: '150'
    }
  ];
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
    }
  ];


  public gridViewBuyer: GridDataResult = {
    data: [],
    total: 0
  };

  public columnsBuyer: any[] = [
    {
      field: 'employeeNumber',
      title: '业务员编码',
      width: '100'
    },
    {
      field: 'fullName',
      title: '业务员姓名',
      width: '100'
    }
  ];
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.listPlant, ngModelChange: this.onPlantChange }, required: true },
    //{ field: 'DOCUMENT_NUM', title: '申请编号',  ui: { type: UiType.select, options: this.listDocumentNum }},
      { field: 'documentNum', title: '申请编号', ui: {
        type: UiType.popupSelect, valueField: 'documentNum', textField: 'documentNum', gridView: this.gridViewDocumentNum, columns: this.columnsDocumentNum,
        eventNo: 5
      }},
      { field: 'poType', title: '订单类型', ui: { type: UiType.select, options: this.listOrderType ,ngModelChange: this.onPoTypeChange } },
      { field: 'buyer', title: '采购员', ui: {
        type: UiType.popupSelect, valueField: 'employeeNumber', textField: 'employeeNumber', gridView: this.gridViewBuyer, columns: this.columnsBuyer,
        eventNo: 2
      }},
      { field: 'planner', title: '计划员',  ui: {
        type: UiType.popupSelect, valueField: 'employeeNumber', textField: 'employeeNumber', gridView: this.gridViewBuyer, columns: this.columnsBuyer,
        eventNo: 4
      }},
      { field: 'itemCode', title: '物料编号',  ui: {
        type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems,
        eventNo: 1
      }},
      { field: 'itemDescriptions', title: '物料描述', ui: { type: UiType.text } },

      { field: 'projectNumber', title: '项目号', ui: {
        type: UiType.text
      }},
      { field: 'vendorNumber', title: '供应商', ui: {
        type: UiType.popupSelect, valueField: 'vendorNumber', textField: 'vendorNumber', gridView: this.gridViewVendors, columns: this.columnsVendors,
        eventNo: 3
      }},
      { field: 'status', title: '行状态', ui: { type: UiType.select, options: this.listPRLStatus } },
      { field: 'creationDate', title: '创建日期', ui: { type: UiType.dateRange } },
      { field: 'demandSupplyDate', title: '需求日期', ui: { type: UiType.dateRange } },

 ],
    values: {
      plantCode: this.appConfig.getPlantCode(),
      poType: null,
      documentNum: { value: '', text: '' },
      itemCode: { value: '', text: '' },
      itemDescriptions: null,
      buyer: { value: '', text: '' },
      projectNumber: null,
      vendorNumber: { value: '', text: '' },
      planner: { value: '', text: '' },
      demandSupplyDate: [],
      status: null,
      creationDate: [this.queryService.addDays(this.now, -7), this.now],
    }
  };

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;



  isRowSelectable(rowNode){
    return rowNode.gridOptionsWrapper.gridOptions.context.dataRowEdit(rowNode.data);
  }

columns = [
    {
      colId: 'action', field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
      suppressSizeToFit: true,
    },
    {
      colId: '1', cellClass: '', field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true,
      headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      },suppressSizeToFit: true,
    },
    { field: 'plantCode', width: '80',headerName: '工厂', menuTabs: ['filterMenuTab']},
    { field: 'documentNum',width: '80', headerName: '申请编号', menuTabs: ['filterMenuTab'] },
    { field: 'status', width: '60',headerName: '状态', menuTabs: ['filterMenuTab'],valueFormatter: 'ctx.optionsFind(value,4)' },
    { field: 'applyer', width: '60',headerName: '申请人', menuTabs: ['filterMenuTab']},
    { field: 'poType', width: '60',headerName: '订单类型', menuTabs: ['filterMenuTab'],valueFormatter: 'ctx.optionsFind(value,2)' },
    { field: 'comments', width: '30',headerName: '申请备注', menuTabs: ['filterMenuTab'] },
    { field: 'bondedType', width: '60',headerName: '保税类型', menuTabs: ['filterMenuTab'],valueFormatter: 'ctx.optionsFind(value,3)' },
    { field: 'lineNum', width: '30',headerName: '行号', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode',width: '80',  headerName: '物料编码', menuTabs: ['filterMenuTab'] ,
    cellClassRules: {
     'boldStyle': function (params) { return params.context.dataRowChange(params.data); },
   }},
   { field: 'itemDescriptions', width: '100', headerName: '物料名称', menuTabs: ['filterMenuTab'],
   cellClassRules: {
    'boldStyle': function (params) { return params.context.dataRowChange(params.data); },
  }, },
  { field: 'buyerName',width: '60', headerName: '采购员', menuTabs: ['filterMenuTab'] },
  { field: 'plannerName', width: '60',headerName: '计划员', menuTabs: ['filterMenuTab'] },
  { field: 'unitOfMeasure',width: '80', headerName: '计量单位', menuTabs: ['filterMenuTab'],valueFormatter: 'ctx.optionsFind(value,6)'},
  { field: 'quantity',width: '80', headerName: '采购申请量', menuTabs: ['filterMenuTab'] },
  { field: 'orderQuantity', width: '80', headerName: '已下单量', menuTabs: ['filterMenuTab'] },
  { field: 'needByDate',width: '100', headerName: '需求时间', menuTabs: ['filterMenuTab']},
  { field: 'deliverToLocationId',width: '80', headerName: '收货地点', menuTabs: ['filterMenuTab'] },
  { field: 'destinationSubinventory',width: '60', headerName: '子库', menuTabs: ['filterMenuTab'] },
  { field: 'justification', width: '120',headerName: '申请理由', menuTabs: ['filterMenuTab'] },
  { field: 'noteToVendor',width: '80', headerName: '通知供应商', menuTabs: ['filterMenuTab'] },
  { field: 'noteToAgent',width: '80', headerName: '通知采购员', menuTabs: ['filterMenuTab'] },
  { field: 'vendorNumber', width: '80',headerName: '供应商编码', menuTabs: ['filterMenuTab'] },
  { field: 'vendorSiteCode',width: '80', headerName: '供应商地点', menuTabs: ['filterMenuTab'] },
  { field: 'projectNumber',width: '80', headerName: '项目号', menuTabs: ['filterMenuTab'] },
  { field: 'customerDesignated',width: '40', headerName: '客指', menuTabs: ['filterMenuTab'] ,valueFormatter: 'ctx.optionsFind(value,7)'},
  { field: 'closedCode',width: '40', headerName: '行状态', menuTabs: ['filterMenuTab'],valueFormatter: 'ctx.optionsFind(value,5)' },
  ];

  expColumns = [];
  expColumnsOptions: any[] = [
    { field: 'status', options: this.listPRStatus },
    { field: 'poType', options: this.listOrderType },
    { field: 'bondedType', options: this.listBondedType },
    { field: 'closedCode', options: this.listPRLStatus },
    { field: 'unitOfMeasure', options: this.listUnitOfMeasure },
    { field: 'customerDesignated', options: this.listUnitOfMeasure },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

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
      case 4: // 采购头状态
        options = this.listPRStatus;
        break;
      case 5: // 采购行状态
        options = this.listPRLStatus;
        break;
      case 6: // 单位
        options = this.listUnitOfMeasure;
        break;
      case 7: // 是否
        options = this.listYesOrNo;
        break;
    }
    const obj = options.find(x => x.value === value) || { label: value };
    return obj ? obj.label : null;
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadPopParam();
    this.loadInitData();
  }

  // 加载弹出框数据
  loadPopParam() {
    if (this.isPopShow && this.inputParam !== undefined && this.inputParam !== null) {
      // 其他页面弹出
      this.isPopShow = true;
      this.queryParams.values.plantCode = this.inputParam.plantCode;
      this.queryParams.values.poType = this.inputParam.poType;
      this.queryParams.values.documentNum = this.inputParam.documentNum;
      this.queryParams.values.itemCode = this.inputParam.itemCode;
      this.queryParams.values.itemDescriptions = this.inputParam.itemDescriptions;
      this.queryParams.values.buyer = this.inputParam.buyer;
      this.queryParams.values.projectNumber = this.inputParam.projectNumber;
      this.queryParams.values.vendorNumber = this.inputParam.vendorNumber;
      this.queryParams.values.planner = this.inputParam.planner;
      this.queryParams.values.demandSupplyDate = this.inputParam.demandSupplyDate;
      this.queryParams.values.status = this.inputParam.status;
      this.queryParams.values.creationDate = this.inputParam.creationDate;
    }
  }

  loadInitData() {

    this.queryService.GetLookupByType('PS_ITEM_UNIT').subscribe(result => {
      result.Extra.forEach(d => {
        this.listUnitOfMeasure.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  //采购头状态
    this.queryService.GetLookupByType('PC_PR_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.listPRStatus.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
      //采购行状态
      this.queryService.GetLookupByType('PC_PRL_STATUS').subscribe(result => {
        this.listPRLStatus.push({
          label: '全部',
          value: '',
        });
        result.Extra.forEach(d => {
          this.listPRLStatus.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
        this.queryParams.values.status ='';
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
      this.onPlantChange(this.appConfig.getPlantCode());
    });
    // this.query();
    this.pcBuyerAuthService.GetAuthUserByUserName(this.userName,"0").subscribe(result=>{
      this.listAuthUsersGroup = result.data;
       //默认当前用户采购员
       this.defaultbuyer  = this.getDefaultUser("1");
       //默认当前用户计划员
       this.defaultplanner = this.getDefaultUser("2");
       this.queryParams.values.buyer={text:this.defaultbuyer.authorizeeNumber,value: this.defaultbuyer.authorizeeNumber}
       this.queryParams.values.planner={text:this.defaultplanner.authorizeeNumber,value: this.defaultplanner.authorizeeNumber}
      if (this.isFormLoad) {
        this.loadPopParam();
        this.isFormLoad = false;
        this.query();
      }
    });
  }

  getDefaultUser( userRelType: string ){
    const buyer = this.listAuthUsersGroup.find(p=>p.authorizeeType==='1' && p.userRelType === userRelType );
   if( buyer && buyer.authorizeeNumber){
     return buyer;
   }
   else return {};
  }



  onPlantChange(value) {
    this.listDocumentNum.length = 0;
    this.queryParams.values.itemCode =  { value: '', text: '' };
    this.queryParams.values.documentNum = { value: '', text: '' },
    this.queryParams.values.vendorNumber= { value: '', text: '' };
   /* this.queryService.GetDocumentNumByPlant(value,this.queryParams.values.PO_TYPE).subscribe(res => {
     res.Extra.forEach(element => {
       this.listDocumentNum.push({
         label: element.DOCUMENT_NUM,
          value: element.DOCUMENT_NUM,
        });
      });
    });

    this.queryService.GetDeliverLocation(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.listLocation.push({
          label: element.DESCRIPTION,
          value: element.DELIVERY_REGION_CODE,
        });
      });
    });

   this.queryService.GetSubinventory(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.listSubinventory.push({
          label: element.SUBINVENTORY_DESCRIPTION,
          value: element.SUBINVENTORY_CODE,
        });
      });
    });*/

  }
  onPoTypeChange(value) {
    this.listDocumentNum.length = 0;
    this.queryParams.values.documentNum =  { value: '', text: '' };
  /*  this.queryService.GetDocumentNumByPlant(this.queryParams.values.PLANT_CODE,value).subscribe(res => {
      res.Extra.forEach(element => {
        this.listDocumentNum.push({
          label: element.DOCUMENT_NUM,
          value: element.DOCUMENT_NUM,
        });
      });
    });*/
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      plantCode:  this.appConfig.getPlantCode(),
      poType: null,
      documentNum:  { value: '', text: '' },
      itemCode: { value: '', text: '' },
      itemDescriptions: null,
      buyer: {text:this.defaultbuyer.authorizeeNumber,value: this.defaultbuyer.authorizeeNumber},
      projectNumber: null,
      vendorNumber: { value: '', text: '' },
      planner:{text:this.defaultplanner.authorizeeNumber,value: this.defaultplanner.authorizeeNumber},
      demandSupplyDate: [],
      status: null,
      creationDate:[this.queryService.addDays(this.now, -7), this.now],
    };

  }

  commonQuery() {
    // console.log(this.queryParams.values.IS_QUERY_DEMAND);
    // console.log(this.queryParams.values.IS_QUERY_SUPPLY);
     this.queryService.loadGridView(this.queryService.planWorkbenchQuery, this.getQueryParams(), this.context);
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  getQueryParams(isExport?: boolean) {
    return {
      plantCode: this.queryParams.values.plantCode,
      poType: this.queryParams.values.poType,
      documentNum: this.queryParams.values.documentNum.text,
      itemCode: this.queryParams.values.itemCode.text,
      itemDescriptions: this.queryParams.values.itemDescriptions,
      buyer: this.queryParams.values.buyer.text,
      projectNumber: this.queryParams.values.projectNumber,
      vendorNumber: this.queryParams.values.vendorNumber.text,
      planner: this.queryParams.values.planner.text,
      demandSupplyDateS: this.queryParams.values.demandSupplyDate[0],
      demandSupplyDateT: this.queryParams.values.demandSupplyDate[1],
      status:this.queryParams.values.status,
      creationDateS: this.queryParams.values.creationDate[0],
      creationDateT: this.queryParams.values.creationDate[1],
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: isExport
    };
  }

  exportFile() {
    super.export();
    this.queryService.exportAction(this.queryService.planWorkbenchQuery, this.getQueryParams(true), this.excelexport, this.context);
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

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['实际需求日期','采购申请说明','保税方式','收货地点','子库','本次下单量','通知供应商'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#MrpPlanWorkbenchGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #FFA500');
        }
      });
    }
  }

  public loadGridDataCallback(result) {
    this.onVirtualColumnsChanged(result);
  }
 // 判断当前行的采购员是否为授权的业务员
 public isAuthBuyer(dataItem: any ){
  if(dataItem.buyer && dataItem.buyer !== "" &&  this.listAuthUsersGroup)
  {
      let authuser=  this.listAuthUsersGroup.find(x=> x.userRelType === "2" &&(x.authorizeeName === dataItem.buyer || x.authorizeeNumber === dataItem.buyer) );
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
// 判断当前行的采购员是否为授权的业务员
public isAuthPlanner(dataItem: any ){
 if(dataItem.planner && dataItem.planner !== "" &&  this.listAuthUsersGroup)
 {
     let authuser=  this.listAuthUsersGroup.find(x=> x.userRelType === "2" && (x.authorizeeName === dataItem.planner || x.authorizeeNumber === dataItem.planner));
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

  public dataRowEdit(dataItem: any) {
   // return dataItem.DATA_TYPE === '2' && dataItem.PLAN_TYPE === 'PLANNED_ORDER';
     //dataItem.
   return  this.isAuthBuyer(dataItem) && dataItem.status === "NEW" ;
  }

  public dataRowDelete(dataItem: any) {
    // return dataItem.DATA_TYPE === '2' && dataItem.PLAN_TYPE === 'PLANNED_ORDER';
      //dataItem.
    return  this.isAuthBuyer(dataItem) && dataItem.status === "NEW"  ;
   }

   public dataRowCancle(dataItem: any) {
    // return dataItem.DATA_TYPE === '2' && dataItem.PLAN_TYPE === 'PLANNED_ORDER';
      //dataItem.
    return  this.isAuthBuyer(dataItem) && dataItem.status === "APPROVED" && dataItem.closedCode === "OPEN";
   }

  public dataRowChange(dataItem: any) {
    return this.dataRowEdit(dataItem);
  }


  public loadItems(plantCode: string, itemCode: string, pageIndex: number, pageSize: number) {
    // 加载物料
    this.queryService.getUserPlantItemPageList(plantCode || '', itemCode || '', '', pageIndex, pageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const pageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, pageIndex, e.PageSize);
  }

 // 查询子库
 public searchSubinventory(e: any) {
  const rowdata =  this.getFocusedRowData();
  const PageIndex = e.Skip / e.PageSize + 1;
  this.loadSubinventory( rowdata.plantCode,e.SearchValue, PageIndex, e.PageSize);
}
public loadSubinventory( plantCode:string, subinventoryCode: string, PageIndex: number, PageSize: number) {
  // 加载供应商
  this.queryService.QuerySubinventory(plantCode|| '',  subinventoryCode || '', PageIndex, PageSize).subscribe(res => {
    this.gridViewSubinventory.data = res.data.content;
    this.gridViewSubinventory.total = res.data.totalElements;
  });
}
public getFocusedRowData(){
   const currentrowdata =   this.gridApi.getFocusedCell();
  if( currentrowdata ) {
   const rowdata = this.gridApi.getRowNode(currentrowdata.rowIndex.toString()).data;
   return rowdata;
 }
 else
 {
   return null;
   }
}
public rowSelectSubinventory(e: any){
}
public textChangedSubinventory(e: any){
}
public rowSelectLocation(e: any){
}
public textChangedLocation(e: any){
}
 // 查询子库
 public searchLocation(e: any) {
  const rowdata =  this.getFocusedRowData();
  const PageIndex = e.Skip / e.PageSize + 1;
  this.loadLocation( rowdata.plantCode,e.SearchValue, PageIndex, e.PageSize);
}
public loadLocation( plantCode:string, deliverLocationCode: string, PageIndex: number, PageSize: number) {
  // 加载供应商
  this.queryService.QueryDeliverLocation(plantCode|| '',  deliverLocationCode || '', PageIndex, PageSize).subscribe(res => {
    this.gridViewLocation.data = res.data.content;
    this.gridViewLocation.total = res.data.totalElements;
  });
}
public rowSelectNoteToVendor(e: any){
}
public textChangedNoteToVendor(e: any){
}
public searchNoteToVendor(e: any) {
  const rowdata =  this.getFocusedRowData();
  const PageIndex = e.Skip / e.PageSize + 1;
  this.loadVendor(rowdata.plantCode,e.SearchValue, PageIndex, e.PageSize);
}
//校验供应商下单数量是否超过计划数量
public currentQuantityChange(o: any,e:any){
     return;
     //onchange事件无法更新input框的值，选择使用blur方法实现
   /*
  if (this.gridData == null || this.gridData.length === 0) {
    return;
  }
  const dtPublish = this.gridData;
  let  sumQty:number=0;
   dtPublish.forEach(p=> {if(p.ID === e.ID)
      sumQty = sumQty +p.CURRENT_QUANTITY;
  });
  //每个采购申请行为一组，按照合格供方展示多行，用户调整的每家下单量之和不能超过该申请行的未下单量。
  const correntQty = e.QUANTITY - e.ORDER_QUANTITY;
  if( correntQty <  sumQty)
  {
    o.inputElement.nativeElement.style.color= "red";
  }
  else
  {
    o.inputElement.nativeElement.style.color= "black";
  }  */
}

//校验供应商下单数量是否超过计划数量
public currentQuantityBlur(o: any,e:any){
  if (this.gridData == null || this.gridData.length === 0) {
    return;
  }
  const dtPublish = this.gridData;
  let  sumQty:number=0;
   dtPublish.forEach(p=> {if(p.id === e.id)
      sumQty = sumQty +p.currentQuantity;
  });
  //每个采购申请行为一组，按照合格供方展示多行，用户调整的每家下单量之和不能超过该申请行的未下单量。
  const correntQty = e.quantity - e.orderQuantity;
  if( correntQty <  sumQty)
  {
    this.msgSrv.warning(this.appTranslate.translate('分配的总数量')+ sumQty + this.appTranslate.translate('超过计划数量')+ correntQty +"！");
      let newvalue=  e.currentQuantity - (sumQty -  correntQty);
       newvalue = newvalue <0? 0: newvalue;
      e.currentQuantity=  newvalue;
      o.setValue(newvalue);
      o.writeValue(newvalue);
      o.value= newvalue;
      o.actualValue= newvalue;
      o.displayValue= newvalue;
  }
}

   // 供应商弹出查询
   public searchVendor(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor( this.queryParams.values.plantCode,e.SearchValue, PageIndex, e.PageSize);
  }

  public loadVendor( plantCode:string, vendorCode: string, PageIndex: number, PageSize: number) {
    // 加载供应商
    this.queryService.QueryVendor(plantCode|| '',  vendorCode || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewVendors.data = res.data.content;
      this.gridViewVendors.total = res.data.totalElements;
    });
  }
  public searchBuyer(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadBuyer(e.SearchValue, e.SearchValue, PageIndex, e.PageSize);
  }


  public searchDocumentNum(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadDocumentNum(this.queryParams.values.plantCode, this.queryParams.values.poType, e.SearchValue, PageIndex, e.PageSize);
  }

  public loadDocumentNum(plantCode: string, poType: string, searchDocumentNum: string, PageIndex: number, PageSize: number) {
    this.queryService.GetDocumentNumByPlantPage(plantCode || '', poType|| '',searchDocumentNum||'' , PageIndex, PageSize).subscribe(res => {
      this.gridViewDocumentNum.data = res.data.content;
      this.gridViewDocumentNum.total = res.data.totalElements;
    });
  }

  public searchPlanner(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadPlanner(e.SearchValue, e.SearchValue, PageIndex, e.PageSize);
  }
  public loadPlanner(employeeNumber: string, fullName: string, pageIndex: number, pageSize: number) {
    this.pcBuyerAuthService.GetBuyer(employeeNumber || '', '', pageIndex, pageSize).subscribe(res => {
      this.gridViewBuyer.data = res.data.content;
      this.gridViewBuyer.total = res.data.totalElements;
    });
  }
  public loadBuyer(employeeNumber: string, fullName: string, pageIndex: number, pageSize: number) {
    this.pcBuyerAuthService.GetBuyer(employeeNumber || '', '', pageIndex, pageSize).subscribe(res => {
      this.gridViewBuyer.data = res.data.content;
      this.gridViewBuyer.total = res.data.totalElements;
    });
  }
  viewItem(dataItem: any) {
    // this.msgSrv.success('onhand');
    const viewType =   (this.isAuthBuyer(dataItem) && dataItem.status === 'NEW') ? 'edit':'view';
    this.modal.static(PcRequisitionManagementEditComponent, { i: dataItem,viewType:viewType }, 'xl').subscribe(res => {
     if(res && res.DataChange ){
       this.query();
     }
    });
  }

  editItem(dataItem: any) {
    // this.msgSrv.success('pegging');
    this.modal.static(PcRequisitionManagementLineEditComponent, { i: dataItem,viewType:"edit" }, 'lg').subscribe(res => {
      this.query();
    });
  }

  deleteRow(dataItem: any) {
    this.queryService.RemovePcRequisitionOrder(dataItem)
      .subscribe(res => {
        if (res.msg == '删除成功') {
          this.msgSrv.success(this.appTranslate.translate('删除成功'));
        } else {
          this.msgSrv.error(this.appTranslate.translate(res.msg));
        }
        this.query();
      });
  }
  cancleRow(dataItem: any) {
    // this.msgSrv.success('exception');
    this.modal.static(PcRequisitionManagementCancelConfireComponent, { i: dataItem }, 'md').subscribe(res => {
      if(!res.Canceled  && res.data){
        dataItem.closedReason=res.data;
        this.queryService.CanclePcRequisitionOrder(dataItem).subscribe(res => {
          if (res.msg == '取消成功')
             {
                this.msgSrv.success(this.appTranslate.translate('取消成功'));
             }
            else
             {
                 this.msgSrv.error(this.appTranslate.translate(res.msg));
             }
               this.query();
          });
        }
       });
  }

  addnew(){
    this.modal.static(PcRequisitionManagementEditComponent, { i: { id:null ,stasus:"NEW", sourceCode:'MANUAL' , documentNum:"", plantCode: ''},viewType:"new" }, 'xl').subscribe(res => {
      if(res && res.DataChange ){
        this.query();
      }
    });
  }
}
