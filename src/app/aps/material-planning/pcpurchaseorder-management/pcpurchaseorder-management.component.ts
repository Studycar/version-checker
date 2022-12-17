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
import { ResultComponent } from '@delon/abc';
import { differenceInDays  } from 'date-fns';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { PCPurchaseOrderManagementViewComponent } from './view/view.component';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pc-purchaseorder-management',
  templateUrl: 'pcpurchaseorder-management.component.html',
  providers: [QueryService],
  encapsulation: ViewEncapsulation.None,
  styles: [`.boldStyle {font-weight:bold ;}`]
})
export class PCPurchaseOrderManagementComponent extends CustomBaseContext implements OnInit {

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
  today:Date= new Date();
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
  listYesOrNo: any[] = [{label:'是',value:'Y'},{label:'否',value:'N'}];
  listOrderType: any[] = [];
  listSourcePlant: any[] = [];
  listScheduleGroup: any[] = [];
  listAuthUsersGroup: any[] = [];
  listUnitOfMeasure: any[] = [];
  listPOStatus: any[] = [];//头状态
  listPOLStatus: any[] = [];//行状态
  listPONumber: any[] = [];//申请编号列表
  LatestPlanVersion:string ="";
  userName: string = ""; //localStorage.getItem('user_name')
  userId:string="";
  context = this;
  now = new Date();
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

  public gridViewChangeToVendors: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsChangeToVendors: any[] = [
    {
      field: 'vendorNumber',
      title: '供应商编号',
      width: '80'
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
    },
    {
      field: 'invoiceCurrencyCode',
      title: '币种',
      width: '50'
    }
  ];
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
  public gridPONumbers: GridDataResult = {
    data: [],
    total: 0
  };

  public columnsPONumbers: any[] = [
    {
      field: 'poNumber',
      title: '订单编号',
      width: '150'
    },
    {
      field: 'buyer',
      title: '采购员编号',
      width: '60'
    },
    {
      field: 'vendorNumber',
      title: '供应商编号',
      width: '80'
    }
  ];

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
      //{ field: 'PO_NUMBER', title: '订单编号',  ui: { type: UiType.select, options: this.listPONumber }},
      { field: 'poNumber', title: '订单编号', ui: {
        type: UiType.popupSelect, valueField: 'poNumber', textField: 'poNumber', gridView: this.gridPONumbers, columns: this.columnsPONumbers,
        eventNo:4
      }},
      { field: 'poType', title: '订单类型', ui: { type: UiType.select, options: this.listOrderType ,ngModelChange: this.onPoTypeChange } },
      { field: 'buyer', title: '采购员', ui: {
        type: UiType.popupSelect, valueField: 'employeeNumber', textField: 'employeeNumber', gridView: this.gridViewBuyer, columns: this.columnsBuyer,
        eventNo: 2
      }},
      { field: 'itemCode', title: '物料编号',  ui: {
        type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems,
        eventNo: 1
      }},
      { field: 'itemDescriptions', title: '物料描述', ui: { type: UiType.text } },
      { field: 'hstatus', title: '头状态', ui: { type: UiType.select, options: this.listPOStatus } },
      { field: 'lstatus', title: '行状态', ui: { type: UiType.select, options: this.listPOLStatus } },
      { field: 'projectNumber', title: '项目号', ui: {type: UiType.text}},
      { field: 'vendorNumber', title: '供应商', ui: {
        type: UiType.popupSelect, valueField: 'vendorNumber', textField: 'vendorNumber', gridView: this.gridViewVendors, columns: this.columnsVendors,
        eventNo: 3
      }},
      { field: 'creationDate', title: '创建日期', ui: { type: UiType.dateRange } },
      { field: 'demandSupplyDate', title: '需求日期', ui: { type: UiType.dateRange } },
 ],
    values: {
      plantCode: this.appConfig.getPlantCode(),
      poNumber: { value: '', text: '' },
      poType: null,
      itemCode: { value: '', text: '' },
      itemDescriptions: null,
      buyer: { value: '', text: '' },
      projectNumber: null,
      hstatus:null,
      lstatus:null,
      vendorNumber: { value: '', text: '' },
      demandSupplyDate: [],
      creationDate: [this.queryService.addDays(this.now, -7), this.now],
    }
  };

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplateDate', { static: true }) customTemplateDate: TemplateRef<any>;
  @ViewChild('customTemplateQty', { static: true }) customTemplateQty: TemplateRef<any>;
  //本次下单量
  @ViewChild('customTemplateChangeQty', { static: true }) customTemplateChangeQty: TemplateRef<any>;
  //采购申请说明
  @ViewChild('customTemplateComments', { static: true }) customTemplateComments: TemplateRef<any>;
   //保税类型选择
  @ViewChild('customTemplateBondedTypeSelect', { static: true }) customTemplateBondedTypeSelect: TemplateRef<any>;
  //供应商选择
  @ViewChild('customTemplateVendorPop', { static: true }) customTemplateVendorPop: TemplateRef<any>;

  @ViewChild('customTemplateSubinventoryapppop', { static: true }) customTemplateSubinventoryapppop: TemplateRef<any>;
  //收货地点选择
  @ViewChild('customTemplateLocationapppop', { static: true }) customTemplateLocationapppop: TemplateRef<any>;

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
      colId: 1, cellClass: '', field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
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
    { field: 'quantity',width: '60', headerName: '订单数量', menuTabs: ['filterMenuTab'],
    cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
    cellRendererParams: {
     customTemplate: null
    }},
    { field: 'canChangeQty',width: '60', headerName: '可转单量', menuTabs: ['filterMenuTab'] },
    { field: 'receivedQty',width: '60', headerName: '接收数量', menuTabs: ['filterMenuTab'] },
    { field: 'canUseQty',width: '60', headerName: '可用量', menuTabs: ['filterMenuTab'] },
    { field: 'vendorNumber',width: '80', headerName: '供应商编码', menuTabs: ['filterMenuTab'] },
    { field: 'vendorName',width: '80', headerName: '供应商名称', menuTabs: ['filterMenuTab'] },
    { field: 'vendorSiteCode', width: '80',headerName: '供应商地点', menuTabs: ['filterMenuTab']},
    { field: 'destinationSubinventory',width: '80',  headerName: '接收子库', menuTabs: ['filterMenuTab'] ,
    cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
    cellRendererParams: {
     customTemplate: null
    }},
    { field: 'deliverToLocationId',width: '80', headerName: '收货地点', menuTabs: ['filterMenuTab'] ,
    cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
    cellRendererParams: {
     customTemplate: null
    }},
    { field: 'currencyCode', width: '40',headerName: '币种', menuTabs: ['filterMenuTab'] },
    { field: 'needByDate',width: '60', headerName: '需求日期', menuTabs: ['filterMenuTab'],
    cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
    cellRendererParams: {
     customTemplate: null
    }},
    { field: 'creationDate',width: '60', headerName: '下单日期', menuTabs: ['filterMenuTab'] },
    { field: 'poType', width: '60',headerName: '订单类型', menuTabs: ['filterMenuTab'],valueFormatter: 'ctx.optionsFind(value,2)' },
    { field: 'hstatus',width: '60', headerName: '订单状态', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,5)' },
    { field: 'lstatus',width: '60', headerName: '行状态', menuTabs: ['filterMenuTab'] , valueFormatter: 'ctx.optionsFind(value,6)'},
    { field: 'bondedType',width: '60', headerName: '保税类型', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,3)' },
    { field: 'projectNumber',width: '60', headerName: '项目号', menuTabs: ['filterMenuTab'] },
    { field: 'ospNumber', width: '60', headerName: '外协工单编号', menuTabs: ['filterMenuTab'] },
    { field: 'changeToVendor',width: '80', headerName: '转供应商代码', menuTabs: ['filterMenuTab'] ,
    cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
    cellRendererParams: {
     customTemplate: null
    }},
    { field: 'changeToVendorName',width: '80', headerName: '转供应商名称', menuTabs: ['filterMenuTab']},
    { field: 'changeToVendorSiteCode',width: '80', headerName: '转供应商地点', menuTabs: ['filterMenuTab']},
    { field: 'changeQty',width: '80', headerName: '转单数量', menuTabs: ['filterMenuTab'] ,
    cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
    cellRendererParams: {
     customTemplate: null
    }},
    { field: 'unCloseReason',  width: '100',headerName: '不可关闭原因', menuTabs: ['filterMenuTab'] },
    { field: 'unChangeReason', width: '100', headerName: '不可转单原因', menuTabs: ['filterMenuTab'] },
    { field: 'mrpSuggess', width: '100', headerName: 'MRP建议', menuTabs: ['filterMenuTab'] },
     ];

  expColumns = [];
  expColumnsOptions: any[] = [
    { field: 'unitOfMeasure', options: this.listUnitOfMeasure },
    { field: 'canColse', options: this.listYesOrNo },
    { field: 'canChange', options: this.listYesOrNo },
    { field: 'poType', options: this.listOrderType },
    { field: 'hstatus', options: this.listPOStatus },
    { field: 'lstatus', options: this.listPOLStatus },
    { field: 'bondedType', options: this.listBondedType }
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

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate =  this.customTemplate;
    this.columns[11].cellRendererParams.customTemplate =  this.customTemplateQty;
    this.columns[18].cellRendererParams.customTemplate = this.customTemplateSubinventoryapppop;
    this.columns[19].cellRendererParams.customTemplate  = this.customTemplateLocationapppop;
    this.columns[21].cellRendererParams.customTemplate =  this.customTemplateDate;
    this.columns[29].cellRendererParams.customTemplate =  this.customTemplateVendorPop;
    this.columns[32].cellRendererParams.customTemplate = this.customTemplateChangeQty;
    this.loadPopParam();
    this.loadInitData();
  }

  // 加载弹出框数据
  loadPopParam() {
    if (this.isPopShow && this.inputParam !== undefined && this.inputParam !== null) {
      // 其他页面弹出
      this.isPopShow = true;
      this.queryParams.values.plantCode = this.inputParam.plantCode;
      this.queryParams.values.poNumber = this.inputParam.poNumber;
      this.queryParams.values.poType = this.inputParam.poType;
      this.queryParams.values.itemCode = this.inputParam.itemCode;
      this.queryParams.values.itemDescriptions = this.inputParam.itemDescriptions;
      this.queryParams.values.buyer = this.inputParam.buyer;
      this.queryParams.values.projectNumber = this.inputParam.projectNumber;
      this.queryParams.values.vendorNumber = this.inputParam.vendorNumber;
      this.queryParams.values.hstatus = this.inputParam.hstatus;
      this.queryParams.values.lstatus = this.inputParam.lstatus;
      this.queryParams.values.demandSupplyDate = this.inputParam.demandSupplyDate;
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
      const plantCode=this.appConfig.getPlantCode();
      this.onPlantChange(plantCode);
    });
    // this.query();
    this.pcBuyerAuthService.GetAuthUserByUserName(this.userName,"0").subscribe(result=>{
      this.listAuthUsersGroup = result.data;
       //默认当前用户采购员
       this.defaultbuyer  = this.getDefaultUser("1");
       //默认当前用户计划员
       this.defaultplanner = this.getDefaultUser("2");
       this.queryParams.values.buyer={text:this.defaultbuyer.authorizeeNumber,value: this.defaultbuyer.authorizeeNumber}

      if (this.isFormLoad) {
        this.loadPopParam();
        this.isFormLoad = false;
        this.query();
      }
    });
  }

  getDefaultUser( user_rel_type: string ){
    const buyer = this.listAuthUsersGroup.find(p=>p.authorizeeType==='1' && p.userRelType === user_rel_type )
   if( buyer && buyer.authorizeeNumber){
     return buyer;
   }
   else return {};
  }

  onPlantChange(value) {
    this.listPONumber.length = 0;
    this.queryParams.values.itemCode =  { value: '', text: '' };
    this.queryParams.values.poNumber =  { value: '', text: '' };
    this.queryParams.values.vendorNumber= { value: '', text: '' };
    /*this.queryService.GetPoNumberByPlant(value,this.queryParams.values.PO_TYPE).subscribe(res => {
      res.Extra.forEach(element => {
      this.listPONumber.push({
         label: element.PO_NUMBER,
         value: element.PO_NUMBER,
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
    this.listPONumber.length = 0;
    this.queryParams.values.poNumber =  { value: '', text: '' };
   // this.queryService.GetPoNumberByPlant(this.queryParams.values.PLANT_CODE,value).subscribe(res => {
   //   res.Extra.forEach(element => {
   //     this.listPONumber.push({
    //      label: element.PO_NUMBER,
    //      value: element.PO_NUMBER,
    //    });
    //  });
   // });
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      plantCode:  this.appConfig.getPlantCode(),
      poType: null,
      poNumber: { value: '', text: '' },
      itemCode: { value: '', text: '' },
      itemDescriptions: null,
      buyer: {text:this.defaultbuyer.authorizeeNumber,value: this.defaultbuyer.authorizeeNumber},
      projectNumber: null,
      vendorNumber: { value: '', text: '' },
      lstatus:null,
      hstatus:null,
      demandSupplyDate: [],
      creationDate:[this.queryService.addDays(this.now, -7), this.now],
    };

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
      plantCode: this.queryParams.values.plantCode,
      poType: this.queryParams.values.poType,
      poNumber: this.queryParams.values.poNumber.text,
      itemCode: this.queryParams.values.itemCode.text,
      itemDescriptions: this.queryParams.values.itemDescriptions,
      buyer: this.queryParams.values.buyer.text,
      projectNumber: this.queryParams.values.projectNumber,
      vendorNumber: this.queryParams.values.vendorNumber.text,
      hstatus: this.queryParams.values.hstatus,
      lstatus: this.queryParams.values.lstatus,
      demandSupplyDateS: this.queryParams.values.demandSupplyDate[0],
      demandSupplyDateT: this.queryParams.values.demandSupplyDate[1],
      creationDateS: this.queryParams.values.creationDate[0],
      creationDateT: this.queryParams.values.creationDate[1],
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: isExport
    };
  }

  exportFile() {
    super.export();
    this.queryService.exportAction(this.queryService.purchaseOrderManagementQuery, this.getQueryParams(true), this.excelexport, this.context);
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
  editColumnHeaders = ['订单数量','接收子库','收货地点','需求日期','转供应商代码','转单数量'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#PCPurchaseOrderManagementGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #FFA500');
        }
      });
    }
  }
  //遍历的行号
  lastLineNum:number=0;
  //遍历的采购申请号
  lastDOCUMENT_NUM:string='';
  //列表变化的背景色 ['#F1FAFA','#E8E8FF','#FBFBEA','#D5F3F4','#D7FFF0','#F0DAD2','#DDF3FF']
  lineColor: string[] =['#FBFBEA','#D5F3F4'];
  lastColorindex:number = 0;
  getRowStyle = function (params) {
    console.log(params.node.data.lineNum);
    console.log(params.data.lineNum);
    if (params.node.data.lineNum !== params.context.lastLineNum || params.node.data.documentNum !== params.context.lastDOCUMENT_NUM) {
      params.context.lastColorindex = (params.context.lastColorindex + 1) % params.context.lineColor.length;
    }
    params.context.lastLineNum =params.node.data.lineNum;
    params.context.lastDOCUMENT_NUM=params.node.data.documentNum;
    return { 'background-color': params.context.lineColor[params.context.lastColorindex], color: 'black' };
  };
  public loadGridDataCallback(result) {
    this.onVirtualColumnsChanged(result);
  }
 // 判断当前行的采购员是否为授权的业务员
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
// 判断当前行的计划员是否为授权的业务员
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
   return   this.isAuthBuyer(dataItem);
  }
  //订单行数量编辑
  public dataRowNEWQUANTITYEdit(dataItem: any) {
    return   this.isAuthBuyer(dataItem)&& dataItem.hstatus !== "AWAITING_APPROVAL" && dataItem.lstatus ==="OPEN"  ;
   }

   //是否可转单判断
   public dataRowQuantityChangeEdit(dataItem: any) {
    return   this.isAuthBuyer(dataItem) && dataItem.hstatus === "APPROVED" && dataItem.lstatus ==="OPEN" && dataItem.canChange === 'Y'  ;
   }

  public dataRowCancel(dataItem: any) {
    return   this.isAuthBuyer(dataItem) && ( dataItem.hstatus === "APPROVED" || dataItem.hstatus === "REAPPROVE" ) && dataItem.lstatus ==="OPEN" && dataItem.canColse === "Y";
   }
  //订单行删除
  public dataRowDelete(dataItem: any) {
    return  this.isAuthBuyer(dataItem) && (dataItem.hstatus === 'NEW' || dataItem.hstatus === 'REJECT');
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
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
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

public updateFocusedRowData(dataItem:any){
  const currentrowdata =   this.gridApi.getFocusedCell();
 if( currentrowdata ) {
  const rowNode = this.gridApi.getRowNode(currentrowdata.rowIndex.toString());
  rowNode.setData(dataItem);
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
public textChangedChangeToVendor(e: any,dataItem:any){
  const value = dataItem.changeToVendor || '';
  if (value !== '') {
      const _result= this.gridViewChangeToVendors.data.find(x => x.vendorNumber === value);
      if ( _result &&  _result.vendorNumber) {
        dataItem.changeToVendorName = _result.vendorName;
        dataItem.changeToVendorSiteCode=_result.vendorSiteCode;

      } else {
        this.msgSrv.warning(this.appTranslate.translate('供应商编码无效,请重新选择!'));
        dataItem.changeToVendorName= "";
        dataItem.changeToVendorSiteCode="";
      }
      this.updateFocusedRowData(dataItem);
  }
}
public rowSelectChangeToVendor(e: any,dataItem:any){
 this.textChangedChangeToVendor(e,dataItem);
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
public searchChangeToVendor(e: any) {
  const rowdata =  this.getFocusedRowData();
  const PageIndex = e.Skip / e.PageSize + 1;
  this.loadChangeToVendor(rowdata,rowdata.plantCode,rowdata.itemCode,e.SearchValue, PageIndex, e.PageSize);
}
public loadChangeToVendor(rowdata: any ,plantCode:string, itemCode: string,vendorCode: string, PageIndex: number, PageSize: number) {
  // 加载供应商
  this.queryService.GetVendorByPlantItemPage(plantCode || '', itemCode || '', vendorCode || '', PageIndex, PageSize).subscribe(res => {
    this.gridViewChangeToVendors.data = res.data.content.filter(p=>p.vendorNumber !== rowdata.vendorNumber);
    this.gridViewChangeToVendors.total = res.data.totalElements;
  });
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
public currentNewQuantityChange(o: any,e:any){
  return;
}

public currentNewQuantityBlur(o:any,dataItem:any){
  if (this.gridData == null || this.gridData.length === 0) {
    return;
  }
  //每个采购申请行为一组，按照合格供方展示多行，用户调整的每家下单量之和不能超过该申请行的未下单量。
  if( dataItem.newQuantity <  dataItem.receivedQty || dataItem.newQuantity > dataItem.quantity  )
  {
    this.msgSrv.warning(this.appTranslate.translate('新的数量')+ dataItem.newQuantity +this.appTranslate.translate('超过已接收量')+ dataItem.receivedQty +"！");
      dataItem.newQuantity = dataItem.quantity;
      o.setValue( dataItem.newQuantity);
      o.writeValue( dataItem.newQuantity);
      o.value=  dataItem.newQuantity;
      o.actualValue=  dataItem.newQuantity;
      o.displayValue=  dataItem.newQuantity;
  }
}
//校验供应商下单数量是否超过计划数量
public currentQuantityBlur(o: any,dataItem:any){
  //每个采购申请行为一组，按照合格供方展示多行，用户调整的每家下单量之和不能超过该申请行的未下单量。
  if( dataItem.canChangeQty < dataItem.changeQty)
  {
    this.msgSrv.warning(this.appTranslate.translate('转单量')+  dataItem.changeQty + this.appTranslate.translate('大于可转单量')+ dataItem.canChangeQty +"！");
      dataItem.changeQty=  dataItem.canChangeQty;
      o.setValue(dataItem.changeQty);
      o.writeValue(dataItem.changeQty);
      o.value= dataItem.changeQty;
      o.actualValue= dataItem.changeQty;
      o.displayValue= dataItem.changeQty;
  }
}


  // 供应商弹出查询
  public searchPoNumber(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadPoNumber( this.queryParams.values.plantCode,this.queryParams.values.poType,e.SearchValue, PageIndex, e.PageSize);
  }
  public loadPoNumber( plantCode:string, poType:string, poNumber: string, PageIndex: number, PageSize: number) {
    // 加载供应商
    this.queryService.QueryPoNumberByPlantPage(plantCode|| '',poType|| '',  poNumber || '', PageIndex, PageSize).subscribe(res => {
      this.gridPONumbers.data = res.data.content;
      this.gridPONumbers.total = res.data.totalElements;
    });
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
  public searchPlanner(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadPlanner(e.SearchValue, e.SearchValue, PageIndex, e.PageSize);
  }
  public loadPlanner(employeeNumber: string, fullName: string, PageIndex: number, PageSize: number) {
    this.pcBuyerAuthService.GetBuyer(employeeNumber || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewBuyer.data = res.data.content;
      this.gridViewBuyer.total = res.data.totalElements;
    });
  }
  public loadBuyer(employeeNumber: string, fullName: string, PageIndex: number, PageSize: number) {
    this.pcBuyerAuthService.GetBuyer(employeeNumber || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewBuyer.data = res.data.content;
      this.gridViewBuyer.total = res.data.totalElements;
    });
  }
  viewItem(dataItem: any) {
    // this.msgSrv.success('onhand');
    const viewType =   (this.isAuthBuyer(dataItem) && dataItem.status === 'NEW') ? 'edit':'view';
    this.modal.static(PCPurchaseOrderManagementViewComponent, { i: dataItem,viewType:viewType }, 'xl').subscribe(res => {
       this.query();
    });
  }
  deleteRow(dataItem: any) {
     if(dataItem.hstatus === 'NEW'  || dataItem.hstatus === 'REJECT')
     {
      this.queryService.RemovePcPurchaseOrder(dataItem)
      .subscribe(res => {
        if (res.code==200) {
          this.msgSrv.success(this.appTranslate.translate('删除成功'));
        } else {
          this.msgSrv.error(this.appTranslate.translate(res.msg));
        }
        this.query();
      });
   }
  }
  //转单
  exchange() {
    if (this.gridData === null || this.gridData.length === 0) {
      return;
    }

    const dtExchange = this.gridApi.getSelectedRows();

    if (dtExchange.length === 0) {
      const msg = this.appTranslate.translate('请勾选数据！');
      this.msgSrv.info(msg);
      return;
    }

    if (dtExchange.filter(p => p.changeQty === null || p.changeQty ==="" || p.changeQty === 0
      ||  p.changeToVendor === null || p.changeToVendor === '' ).length > 0) {
      const msg = this.appTranslate.translate('转单数量或供应商数量未填写');
      this.msgSrv.info(msg);
      return;
    }

    this.queryService.ExchangePcPurchaseOrder(dtExchange)
      .subscribe(res => {
        if (res.code=200) {
          this.msgSrv.success(this.appTranslate.translate('转单成功'));
        } else {
          this.msgSrv.error(this.appTranslate.translate(res.msg));
        }
        this.query();
      });
  }


   //取消
   cancel() {
    if (this.gridData === null || this.gridData.length === 0) {
      return;
    }

    const dtCancel = this.gridApi.getSelectedRows();
    if (dtCancel.length === 0) {
      const msg = this.appTranslate.translate('请勾选数据！');
      this.msgSrv.info(msg);
      return;
    }
    if (dtCancel.filter(p=> !this.dataRowCancel(p)).length > 0 ) {
      const msg = this.appTranslate.translate('勾选项存在不能取消的订单行');
      this.msgSrv.info(msg);
      return;
    }

    this.queryService.CancelPcPurchaseOrder(dtCancel)
      .subscribe(res => {
        if (res.code==200) {
          this.msgSrv.success(this.appTranslate.translate('关闭/取消成功'));
        } else {
          this.msgSrv.error(this.appTranslate.translate(res.msg));
        }
        this.query();
      });
  }
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return  differenceInDays (this.today,current) > 0;
  };
 public save() {
    if (this.gridData === null || this.gridData.length === 0) {
      return;
    }
    const dtSave = this.gridApi.getSelectedRows();

    if (dtSave.length === 0) {
      const msg = this.appTranslate.translate('请勾选数据！');
      this.msgSrv.info(msg);
      return;
    }
    //新的数量小于接收数量或者减少量大于可转单数量
    if(dtSave.filter(p=> p.newQuantity <  p.receivedQty ).length > 0 )
    {
      const msg = this.appTranslate.translate('填写的订单行数量小于已接收数量');
      this.msgSrv.info(msg);
      return;
    }
    if(dtSave.filter(p=>  p.quantity - p.newQuantity > p.canChangeQty).length > 0 )
    {
      const msg = this.appTranslate.translate('减少数量大于可转单数量');
      this.msgSrv.info(msg);
      return;
    }

    if(dtSave.filter(p=> p.hstatus ==='AWAITING_APPROVAL' || p.lstatus !=='OPEN' ).length > 0 )
    {
      const msg = this.appTranslate.translate('订单已批准或订单行状态不是打开状态');
      this.msgSrv.info(msg);
      return;
    }

    this.queryService.SavePcPurchaseOrder(dtSave)
      .subscribe(res => {
        if (res.code==200) {
          this.msgSrv.success(this.appTranslate.translate('保存成功'));
        } else {
          this.msgSrv.error(this.appTranslate.translate(res.msg));
        }
        this.query();
      });
  }
}
