import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { SalesOrderDetailComponent } from "../sales-order/detail/detail.component";
import { AddContractComponent } from "./add-contract/add-contract.component";
import { SalesDistDetailedContractEditComponent } from "./edit-contract/edit.component";
import { SalesDistDetailedEditComponent } from "./edit/edit.component";
import { SalesDistDetailedImportComponent } from "./import/import.component";
import { SalesDistDetailedQueryService } from "./query.service";

@Component({
  selector: 'sales-dist-detailed',
  templateUrl: './sales-dist-detailed.component.html',
  providers: [SalesDistDetailedQueryService]
})
export class SalesDistDetailedComponent extends CustomBaseContext implements OnInit {

  distTypeOptions: any = []; // PS_DIST_TYPE
  distDetailedStateOptions: any = [];  // PS_DIST_DETAILED_STATE
  productCategoryOptions: any[] = [];
  plantOptions: any[] = [];
  planOptions: any[] = [];
  subsectionStateOptions: any[] = [];
  YesNoOptions: any[] = [];
  packTypeOptions: any[] = [];
  transportTypeOptions: any[] = [];
  prodTypeOptions: any[] = [];
  materialOptions: any[] = [];
  steelTypeOptions: any[] = [];
  warehouseOptions: any[] = [];
  warehousePlantOptions: any[] = []; // 工厂对应成品仓库
  pricingTypeOptions: any[] = [];
  gongchaOptions: any[] = [];
  ttTypeOptions: any[] = [];

  isCurrent: Boolean = false; // 是否现货
  isNotDistributed: Boolean = false; // 是否未分货
  isDistributed: Boolean = false; // 是否已分货
  isBilled: Boolean = false; // 是否已开单
  stockSaleFlag: string = 'Y';
  type: string = 'notDistributed';
  property = {
    notDistributed: {
      myAgGridState: 'sales-dist-detailed-not-distributed',
      exportFileName: '未分货明细表',
      distDetailedState: '10',
      sumItems: [
        {
          field: 'theoreticalWeight',
          headerName: '理重',
          // unit: '吨',
        },
        {
          field: 'onhandQuantity',
          headerName: '数量',
          // unit: '张',
        },
      ]
    },
    distributed: {
      myAgGridState: 'sales-dist-detailed-distributed',
      exportFileName: '已分货明细表',
      distDetailedState: '20',
      sumItems: [
        {
          field: 'theoreticalWeight',
          headerName: '理重',
          // unit: '吨',
        },
        {
          field: 'onhandQuantity',
          headerName: '数量',
          // unit: '张',
        },
      ]
    },
    billed: {
      myAgGridState: 'sales-dist-detailed-billed',
      exportFileName: '已开单明细表',
      distDetailedState: '40',
      sumItems: [
        {
          field: 'theoreticalWeight',
          headerName: '理重',
          // unit: '吨',
        },
        {
          field: 'onhandQuantity',
          headerName: '数量',
          // unit: '张',
        },
      ]
    },
    current: {
      myAgGridState: 'sales-dist-detailed-curr',
      exportFileName: '现货分货表',
      distDetailedState: null,
      sumItems: [
        {
          field: 'theoreticalWeight',
          headerName: '理重',
          // unit: '吨',
        },
        {
          field: 'onhandQuantity',
          headerName: '数量',
          // unit: '张',
        },
      ]
    },
  }
  salesDistDetailedQuery = { field: 'distDetailedState', title: '分货明细状态', ui: { type: UiType.select, options: this.distDetailedStateOptions } };
  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public http: _HttpClient,
    private appconfig: AppConfigService,
    public queryService: SalesDistDetailedQueryService,
    private router: ActivatedRoute,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    if(this.router.snapshot.data.isCurrent) {
      this.isCurrent = true;
      this.type = 'current';
      this.stockSaleFlag = 'N';
      this.columns = this.currentColumns;
      this.queryParams.defines.push(this.salesDistDetailedQuery);
    } else if (this.router.snapshot.data.isNotDistributed) {
      this.isNotDistributed = true;
      this.type = 'notDistributed';
    } else if (this.router.snapshot.data.isDistributed) {
      this.isDistributed = true;
      this.type = 'distributed';
    } else if (this.router.snapshot.data.isBilled) {
      this.isBilled = true;
      this.type = 'billed';
    } 
    this.queryParams.values.stockSaleFlag = this.stockSaleFlag
    this.queryParams.values.distDetailedState = this.property[this.type].distDetailedState;
    this.sumHeight = 40;
    this.initGridHeight();
  }
  
  // 绑定合同
  public gridViewContracts: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsContracts: any[] = [
    {
      field: 'contractCode',
      title: '合同号',
      width: '100'
    },
    {
      field: 'contractState',
      title: '合同状态',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'basePrice',
      title: '基价',
      width: '100'
    },
    {
      field: 'deposit',
      title: '定金',
      width: '100'
    },
    {
      field: 'money',
      title: '金额',
      width: '100'
    },
    {
      field: 'plantCode',
      title: '供方',
      width: '200',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'affiliatedMonth',
      title: '合同月份',
      width: '100'
    },
    {
      field: 'signingDate',
      width: 120,
      title: '签订日期',
    },
    {
      field: 'cusCode',
      title: '客户编码',
      width: '100'
    },
    {
      field: 'cusAbbreviation',
      title: '客户简称',
      width: '100'
    },
    {
      field: 'steelType',
      title: '钢种',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'remarks',
      title: '备注',
      width: '100'
    },
    {
      field: 'quantitySy',
      title: '合同待分货量',
      width: '100'
    },
    {
      field: 'material',
      title: '厚/薄料',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
  ];
  contractOptions = {
    1: { 'PS_CONTRACT_STATE': [] },
    2: { 'PLANT_CODE': [] },
    3: { 'PS_CONTRACT_STEEL_TYPE': [] },
    4: { 'HOUBO': [] },
  };

  // 绑定仓库表
  public gridViewWares: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsWares: any[] = [
    {
      field: 'plantCode',
      title: '工厂',
      width: '100'
    },
    {
      field: 'subinventoryCode',
      title: '仓库编码',
      width: '100'
    },
    {
      field: 'subinventoryDescription',
      title: '仓库名称',
      width: '100'
    }
  ];

  // 现有量列
  onhandColumns = [
    {
      field: 'batchCode',
      width: 120,
      headerName: '批号',
    },
    { field: 'paper', width: 120, headerName: '表面保护' },
    { field: 'plantCode', width: 120, headerName: '工厂编码' },
    { field: 'plantName', width: 120, headerName: '工厂名称' },
    { field: 'itemId', width: 190, headerName: '产品编码' },
    { field: 'skuName', width: 350, headerName: '产品名称', tooltipField: 'descriptionsCn' },
    { field: 'itemDescription', headerName: '物料描述', width: 240 },
    { field: 'standardType', headerName: '规格型号', width: 240 },
    { field: 'inBatchCode', width: 130, headerName: '来料批号' },
    { field: 'whName', width: 130, headerName: '仓库' },
    { field: 'onhandQuantity', width: 90, headerName: '现存量' },
    { field: 'unitCode', width: 90, headerName: '数量单位编码' },
    { field: 'unitName', width: 90, headerName: '数量单位' },
    { field: 'steelGrade', width: 90, headerName: '钢种' },
    { field: 'surface', width: 120, headerName: '表面' },
    { field: 'spec', width: 120, headerName: '规格尺寸' },
    { field: 'grade', width: 120, headerName: '等级' },
    { field: 'actHeight', width: 120, headerName: '实厚' },
    { field: 'actWidth', width: 120, headerName: '实宽' },
    { field: 'weight', width: 120, headerName: '净重' },
    { field: 'unitWeight', width: 120, headerName: '单重' },
    { field: 'rollLength', width: 120, headerName: '卷长' },
    { field: 'quality', width: 240, headerName: '品质信息' },
    { field: 'avaQuantity', width: 120, headerName: '可用量' },
    { field: 'entryTime', width: 120, headerName: '入库时间' },
    { field: 'subsectionState', width: 120, headerName: '分卷状态', valueFormatter: 'ctx.optionsFind(value,5).label' },
    { field: 'rewinding', width: 120, headerName: '重卷次数', },
    { field: 'coilInnerDia', width: 120, headerName: '钢卷内径' },
    { field: 'packType', width: 120, headerName: '包装方式', valueFormatter: 'ctx.optionsFind(value,7).label' },
    { field: 'fullVolume', width: 120, headerName: '是否整卷', valueFormatter: 'ctx.optionsFind(value,6).label' },
    { field: 'elongation', width: 120, headerName: '延伸率' },
    { field: 'gloss', width: 120, headerName: '光泽度' },
    { field: 'ironLoss', width: 120, headerName: '铁损' },
    { field: 'magnetoreception', width: 120, headerName: '磁感' },
    { field: 'paperLength', width: 120, headerName: '垫纸长度' },
    { field: 'grossWeight', width: 120, headerName: '毛重' },
  ];

  // 现货列
  currentColumns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    {
      field: 'distType',
      width: 120,
      headerName: '分货类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'distDetailedState',
      width: 120,
      headerName: '分货明细状态',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'orderMonth',
      width: 120,
      headerName: '订单月份'
    },
    {
      field: 'plan',
      width: 120,
      headerName: '计划',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'productCategory',
      width: 120,
      headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'place',
      width: 120,
      headerName: '目的地',
    },
    {
      field: 'warehouseCode',
      width: 120,
      headerName: '仓库编码',
    },
    {
      field: 'warehouseName',
      width: 120,
      headerName: '仓库名称',
    },
    {
      field: 'plateLength',
      width: 120,
      headerName: '板长',
    },
    {
      field: 'prodType',
      width: 120,
      headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,10).label',
    },
    {
      field: 'pricingType',
      width: 120,
      headerName: '计价方式',
      valueFormatter: 'ctx.optionsFind(value,11).label',
    },
    {
      field: 'labelSpecs',
      width: 120,
      headerName: '标签规格',
    },
    // {
    //   field: 'plant',
    //   width: 120,
    //   headerName: '工厂',
    // },
    {
      field: 'makeOrderNum',
      width: 120,
      headerName: '计划单号',
    },
    {
      field: 'formerBatchCode',
      width: 120,
      headerName: '原单号',
    },
    {
      field: 'transportType',
      width: 120,
      headerName: '运输方式',
      valueFormatter: 'ctx.optionsFind(value,9).label',
    },
    {
      field: 'skuType',
      width: 120,
      headerName: '存货类型',
    },
    {
      field: 'subinventoryAllocation',
      width: 120,
      headerName: '库位编码',
    },
    {
      field: 'hardness',
      width: 120,
      headerName: '硬度',
    },
    {
      field: 'baleNo',
      width: 120,
      headerName: '捆包号',
    },
    {
      field: 'coatingUpName',
      width: 120,
      headerName: '面膜存货描述',
    },
    {
      field: 'coatingUpCode',
      width: 120,
      headerName: '面膜存货编码',
    },
    {
      field: 'coatingDownName',
      width: 120,
      headerName: '底膜存货描述',
    },
    {
      field: 'coatingDownCode',
      width: 120,
      headerName: '底膜存货编码',
    },
    {
      field: 'lockId',
      width: 120,
      headerName: '锁库标识',
    },
    {
      field: 'lockQuantity',
      width: 120,
      headerName: '锁库数量',
    },
    {
      field: 'lockType',
      width: 120,
      headerName: '锁库类型',
    },
    {
      field: 'realWhCode',
      width: 120,
      headerName: '实体仓库编码',
    },
    {
      field: 'theoreticalWeight',
      width: 120,
      headerName: '理重',
    },
    {
      field: 'trmming',
      width: 120,
      headerName: '是否切边',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'tolerance',
      width: 120,
      headerName: '公差（标签厚度减去实厚）',
      valueFormatter: 'ctx.optionsFind(value,12).label',
    },
    {
      field: 'sleeveType',
      width: 120,
      headerName: '套筒类型',
      valueFormatter: 'ctx.optionsFind(value,13).label',
    },
    {
      field: 'paperPlate',
      width: 120,
      headerName: '纸板',
    },
    {
      field: 'quantityUnstocked',
      width: 120,
      headerName: '待入库数量',
    },
    {
      field: 'quantityUnshipped',
      width: 120,
      headerName: '待发货数量',
    },
    {
      field: 'quantityTransferring',
      width: 120,
      headerName: '调拨在途数量',
    },
    {
      field: 'quantityUntransferred',
      width: 120,
      headerName: '调拨待发数量',
    },
    {
      field: 'boxType',
      width: 120,
      headerName: '箱体类型',
    },
    {
      field: 'entrustedProcessing',
      width: 120,
      headerName: '受托加工',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'taxPrice',
      width: 120,
      headerName: '含税价',
    },
    {
      field: 'fixedPrice',
      width: 120,
      headerName: '限价',
    },
    {
      field: 'money',
      width: 120,
      headerName: '无税金额',
    },
    {
      field: 'taxRate',
      width: 120,
      headerName: '税率',
    },
    {
      field: 'taxAmount',
      width: 120,
      headerName: '税额',
    },
    {
      field: 'amountIncludingTax',
      width: 120,
      headerName: '含税金额',
    },
    {
      field: 'basePrice',
      width: 120,
      headerName: '基价',
    },
    {
      field: 'price',
      width: 120,
      headerName: '价格',
    },
    {
      field: 'markUp',
      width: 120,
      headerName: '加价',
    },
    {
      field: 'specialMarkup',
      width: 120,
      headerName: '特殊加价',
    },
    {
      field: 'unitOfWeight',
      width: 120,
      headerName: '重量单位',
    },
    {
      field: 'unitCodeWeight',
      width: 120,
      headerName: '重量单位编码',
    },
    {
      field: 'haveContract',
      width: 120,
      headerName: '是否有合同',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码',
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称',
    },
    {
      field: 'salesOrderCode',
      width: 120,
      headerName: '销售订单明细行号',
    },
    {
      field: 'transferOrderCode',
      width: 120,
      headerName: '调拨单行号',
    },
    {
      field: 'contractCode',
      width: 120,
      headerName: '合同号',
    },
    ...this.onhandColumns,
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建时间'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新时间'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },

  ];

  columns: any = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    {
      field: 'distType',
      width: 120,
      headerName: '分货类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'distDetailedState',
      width: 120,
      headerName: '分货明细状态',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'branchCusOrderCode',
      width: 120,
      headerName: '分行客户订单号'
    },
    {
      field: 'orderMonth',
      width: 120,
      headerName: '订单月份'
    },
    {
      field: 'plan',
      width: 120,
      headerName: '计划',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'productCategory',
      width: 120,
      headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'place',
      width: 120,
      headerName: '目的地',
    },
    {
      field: 'warehouseCode',
      width: 120,
      headerName: '仓库编码',
    },
    {
      field: 'warehouseName',
      width: 120,
      headerName: '仓库名称',
    },
    {
      field: 'plateLength',
      width: 120,
      headerName: '板长',
    },
    {
      field: 'prodType',
      width: 120,
      headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,10).label',
    },
    {
      field: 'pricingType',
      width: 120,
      headerName: '计价方式',
      valueFormatter: 'ctx.optionsFind(value,11).label',
    },
    {
      field: 'labelSpecs',
      width: 120,
      headerName: '标签规格',
    },
    // {
    //   field: 'plant',
    //   width: 120,
    //   headerName: '工厂',
    // },
    {
      field: 'makeOrderNum',
      width: 120,
      headerName: '计划单号',
    },
    {
      field: 'formerBatchCode',
      width: 120,
      headerName: '原单号',
    },
    {
      field: 'transportType',
      width: 120,
      headerName: '运输方式',
      valueFormatter: 'ctx.optionsFind(value,9).label',
    },
    {
      field: 'skuType',
      width: 120,
      headerName: '存货类型',
    },
    {
      field: 'subinventoryAllocation',
      width: 120,
      headerName: '库位编码',
    },
    {
      field: 'hardness',
      width: 120,
      headerName: '硬度',
    },
    {
      field: 'baleNo',
      width: 120,
      headerName: '捆包号',
    },
    {
      field: 'coatingUpName',
      width: 120,
      headerName: '面膜存货描述',
    },
    {
      field: 'coatingUpCode',
      width: 120,
      headerName: '面膜存货编码',
    },
    {
      field: 'coatingDownName',
      width: 120,
      headerName: '底膜存货描述',
    },
    {
      field: 'coatingDownCode',
      width: 120,
      headerName: '底膜存货编码',
    },
    {
      field: 'lockId',
      width: 120,
      headerName: '锁库标识',
    },
    {
      field: 'lockQuantity',
      width: 120,
      headerName: '锁库数量',
    },
    {
      field: 'lockType',
      width: 120,
      headerName: '锁库类型',
    },
    {
      field: 'realWhCode',
      width: 120,
      headerName: '实体仓库编码',
    },
    {
      field: 'theoreticalWeight',
      width: 120,
      headerName: '理重',
    },
    {
      field: 'trmming',
      width: 120,
      headerName: '是否切边',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'tolerance',
      width: 120,
      headerName: '公差（标签厚度减去实厚）',
      valueFormatter: 'ctx.optionsFind(value,12).label',
    },
    {
      field: 'sleeveType',
      width: 120,
      headerName: '套筒类型',
      valueFormatter: 'ctx.optionsFind(value,13).label',
    },
    {
      field: 'paperPlate',
      width: 120,
      headerName: '纸板',
    },
    {
      field: 'quantityUnstocked',
      width: 120,
      headerName: '待入库数量',
    },
    {
      field: 'quantityUnshipped',
      width: 120,
      headerName: '待发货数量',
    },
    {
      field: 'quantityTransferring',
      width: 120,
      headerName: '调拨在途数量',
    },
    {
      field: 'quantityUntransferred',
      width: 120,
      headerName: '调拨待发数量',
    },
    {
      field: 'boxType',
      width: 120,
      headerName: '箱体类型',
    },
    {
      field: 'entrustedProcessing',
      width: 120,
      headerName: '受托加工',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'taxPrice',
      width: 120,
      headerName: '含税价',
    },
    {
      field: 'fixedPrice',
      width: 120,
      headerName: '限价',
    },
    {
      field: 'money',
      width: 120,
      headerName: '无税金额',
    },
    {
      field: 'taxRate',
      width: 120,
      headerName: '税率',
    },
    {
      field: 'taxAmount',
      width: 120,
      headerName: '税额',
    },
    {
      field: 'amountIncludingTax',
      width: 120,
      headerName: '含税金额',
    },
    {
      field: 'basePrice',
      width: 120,
      headerName: '基价',
    },
    {
      field: 'price',
      width: 120,
      headerName: '价格',
    },
    {
      field: 'markUp',
      width: 120,
      headerName: '加价',
    },
    {
      field: 'specialMarkup',
      width: 120,
      headerName: '特殊加价',
    },
    {
      field: 'unitOfWeight',
      width: 120,
      headerName: '重量单位',
    },
    {
      field: 'unitCodeWeight',
      width: 120,
      headerName: '重量单位编码',
    },
    {
      field: 'haveContract',
      width: 120,
      headerName: '是否有合同',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'houbo',
      width: 120,
      headerName: '厚薄料',
      valueFormatter: 'ctx.optionsFind(value,8).label',
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码',
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称',
    },
    {
      field: 'salesOrderCode',
      width: 120,
      headerName: '销售订单明细行号',
    },
    {
      field: 'transferOrderCode',
      width: 120,
      headerName: '调拨单行号',
    },
    {
      field: 'contractCode',
      width: 120,
      headerName: '合同号',
    },
    ...this.onhandColumns,
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建时间'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新时间'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.distTypeOptions;
        break;
      case 2:
        options = this.distDetailedStateOptions;
        break;
      case 3:
        options = this.productCategoryOptions;
        break;
      case 4:
        options = this.planOptions;
        break;
      case 5:
        options = this.subsectionStateOptions;
        break;
      case 6:
        options = this.YesNoOptions;
        break;
      case 7:
        options = this.packTypeOptions;
        break;
      case 8:
        options = this.materialOptions;
        break;
      case 9:
        options = this.transportTypeOptions;
        break;
      case 10:
        options = this.prodTypeOptions;
        break;
      case 11:
        options = this.pricingTypeOptions;
        break;
      case 12:
        options = this.gongchaOptions;
        break;
      case 13:
        options = this.ttTypeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'skuName', title: '产品名称', ui: { type: UiType.text } },
      { field: 'makeOrderNum', title: '计划单号', ui: { type: UiType.text } },
      { field: 'batchCode', title: '批号', ui: { type: UiType.text } },
      {
        field: 'whName', title: '仓库', ui: {
          type: UiType.popupSelect, valueField: 'subinventoryCode', textField: 'subinventoryCode', gridView: this.gridViewWares, columns: this.columnsWares, eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
            TextChangedEventNo: 3,
          }
        }
      },
      { field: 'cusAbbreviation', title: '客户简称', ui: { type: UiType.text } },
      { field: 'contractCode', title: '合同号', ui: { type: UiType.text } },
      { field: 'steelGrade', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOptions } },
      { field: 'entryTime', title: '入库时间', ui: { type: UiType.dateRange } },
      { field: 'creationDate', title: '创建时间', ui: { type: UiType.dateRange } },
      { field: 'distType', title: '分货类型', ui: { type: UiType.select, options: this.distTypeOptions } },
      // { field: 'productCategory', title: '产品大类', ui: { type: UiType.select, options: this.productCategoryOptions } },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      distType: null,
      distDetailedState: this.property[this.type].distDetailedState,
      skuName: '',
      makeOrderNum: '',
      batchCode: '',
      whName: {value: '', text: ''},
      cusAbbreviation: '',
      contractCode: '',
      steelGrade: null,
      entryTime: [],
      creationDate: [],
      stockSaleFlag: this.stockSaleFlag
      // productCategory: null,
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      distType: null,
      distDetailedState: this.property[this.type].distDetailedState,
      skuName: '',
      makeOrderNum: '',
      batchCode: '',
      whName: {value: '', text: ''},
      cusAbbreviation: '',
      contractCode: '',
      steelGrade: null,
      entryTime: [],
      creationDate: [],
      stockSaleFlag: this.stockSaleFlag
      // productCategory: null,
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions()
  }

  loadOptions = super.wrapLoadOptionsFn(async () => {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_DIST_TYPE': this.distTypeOptions,
      'PS_DIST_DETAILED_STATE': this.distDetailedStateOptions,
      'PS_PLAN': this.planOptions,
      'PS_SUBSECTION_STATE': this.subsectionStateOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
      'HOUBO': this.materialOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_PRICING_TYPE': this.pricingTypeOptions,
      'GONGCHA': this.gongchaOptions,
      'PS_TT_TYPE': this.ttTypeOptions,
    });
    this.queryService.GetLookupByType('PS_PRODECT_WAREHOUSE').subscribe(res => {
      if(res.Success && res.Extra) {
        res.Extra.forEach(d => {
          this.warehouseOptions.push({
            label: d.meaning,
            value: d.additionCode,
            plantCode: d.attribute1,
          })
        });
      }
    });
    await this.plantOptions.push(...await this.queryService.getUserPlants());
    await this.productCategoryOptions.push(...await this.queryService.getUserProCates());
  })

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    const params = { ...this.queryParams.values };
    return Object.assign(params, {
      whName: this.queryParams.values.whName.text,
      entryTime: this.queryService.formatDate(this.queryParams.values.entryTime[0]),
      endEntryTime: this.queryService.formatDate(this.queryParams.values.entryTime[1]),
      creationDate: this.queryService.formatDate(this.queryParams.values.creationDate[0]),
      endCreationDate: this.queryService.formatDate(this.queryParams.values.creationDate[1]),
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    })
  }

  isVisible: boolean = false;
  isMatchContract: boolean = false;
  plantCode = this.appconfig.getActivePlantCode();
  productCategory = null;
  distType = null;
  warehouses = [];
  modalType: string = 'getOnhand';
  modalProperty = {
    getOnhand: {
      title: '获取现有量'
    },
    batchDeductionContract: {
      title: '批量挂合同'
    },
  }

  matchCustomerOrder() {
    const ids = this.getGridSelectionKeysByFilter('id', (item) => item.distDetailedState === '10');
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择未分货的数据！'));
      return;
    } 
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确定发起自动分货请求？'),
      nzOnOk: () => {
        this.queryService.matchCustomOrder(ids.join(',')).subscribe(res => {
          if(res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });

  }

  matchContract() {
    let filterFn = item => !item.contractCode;
    if(this.isBilled) {
      filterFn = item => this.getFlag(item, 'null');
    } 
    const ids = this.getGridSelectionKeysByFilter('id', filterFn);
    if(ids.length === 0) {
      let warningMsg = '请先勾选合同编码为空的数据！';
      if(this.isBilled) {
        warningMsg = '请先勾选分货类型为调拨单、合同编码为空的数据！';
      }
      this.msgSrv.warning(this.appTranslationService.translate(warningMsg));
      return;
    }
    this.queryService.matchContract(ids.join(',')).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  getOnhand() {
    this.isVisible = true;
    this.modalType = 'getOnhand';
    this.loadPlantWares();
  }

  loadPlantWares() {
    if(this.plantCode) {
      this.warehousePlantOptions.length = 0;
      this.warehousePlantOptions.push(...this.warehouseOptions.filter(d => d.plantCode === this.plantCode));
    }
  }

  contractCode: string = '';
  selectedRows: any[] = [];
  batchDeductionContract() {
    const selectedRows = this.gridApi.getSelectedRows();
    let warnMsg = '';
    if (selectedRows.length === 0) {
      warnMsg = '请先勾选数据（条件：相同的工厂、客户、产品大类、钢种，且合同号为空、未退货、客户不为空）';
    } else {
      const obj = { 'plantCode': '工厂', 'cusCode': '客户', 'productCategory': '产品大类', 'steelGrade': '钢种' };
      for (let i = 0; i < selectedRows.length; i++) {
        if (!!selectedRows[i].contractCode) {
          warnMsg = '存在合同号不为空的数据！';
          break;
        } else if (!!selectedRows[i].returnFlag) {
          warnMsg = '存在已退货的数据！';
          break;
        } else if (!selectedRows[i].cusCode) {
          warnMsg = '存在客户为空的数据！';
          break;
        }
        let sameFlag = true;
        for (let p in obj) {
          if (selectedRows[i][p] !== selectedRows[0][p]) {
            warnMsg = `存在${obj[p]}不相同的数据！`;
            sameFlag = false;
            break;
          }
        }
        if (!sameFlag) { break; }
      }
    }
    if (!!warnMsg) { this.msgSrv.warning(this.appTranslationService.translate(warnMsg)); return; }
    this.selectedRows = [...selectedRows];
    this.contractCode = '';
    this.isVisible = true;
    this.modalType = 'batchDeductionContract';
  }

    /**
   * 合同弹出查询
   * @param {any} e
   */
     public searchContracts(e: any) {
      const PageIndex = e.Skip / e.PageSize + 1;
      this.loadContracts(
        e.SearchValue,
        PageIndex,
        e.PageSize,
      );
    }
  
    /**
     * 加载客户
     * @param {string} contractCode  合同号
     * @param {number} pageIndex  页码
     * @param {number} pageSize   每页条数
     */
    public loadContracts(
      contractCode: string,
      pageIndex: number,
      pageSize: number,
    ) {
      this.queryService
        .getContracts({
          contractCode: contractCode,
          contractState: '30',
          cusCode: this.selectedRows[0].cusCode,
          plantCode: this.selectedRows[0].plantCode,
          steelType: this.selectedRows[0].steelGrade,
          categoryCode: this.selectedRows[0].productCategory,
          pageIndex: pageIndex,
          pageSize: pageSize
        })
        .subscribe(res => {
          this.gridViewContracts.data = res.data.content;
          this.gridViewContracts.total = res.data.totalElements;
        });
    }
  
    ContractTextChanged(event: any) {
      const contractCode = event.Text.trim();
      if(contractCode !== '') {
        this.queryService
        .getContracts({
          contractCode: contractCode,
          contractState: '30',
          cusCode: this.selectedRows[0].cusCode,
          plantCode: this.selectedRows[0].plantCode,
          steelType: this.selectedRows[0].steelGrade,
          categoryCode: this.selectedRows[0].productCategory,
          pageIndex: 1,
          pageSize: 1
        })
        .subscribe(res => {
          if(res.data.content.length === 0) {
            this.msgSrv.warning(this.appTranslationService.translate('合同号无效'));
            this.contractCode = '';
          } else {
            this.contractCode = res.data.content[0].contractCode;
          }
        });
      } else {
        this.contractCode = '';
      }
    }
  
    onRowSelectContracts(e) {
      this.contractCode = e.Row.contractCode;
    }

  compute() {
    const ids = this.getGridSelectionKeys();
    if (ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据！'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确定发起计价请求？'),
      nzOnOk: () => {
        this.queryService.compute(ids).subscribe(res => {
          if(res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  handleCancel() {
    this.isVisible = false;
    this.plantCode = this.appconfig.getActivePlantCode();
    this.productCategory = null;
    this.distType = null;
    this.warehouses = [];
  }

  handleOk() {
    switch (this.modalType) {
      case 'getOnhand':
        {
          const warehouse = this.warehouses.join(',');
          this.queryService.task(this.plantCode, warehouse).subscribe(res => {
            if(res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate(res.msg));
              this.isVisible = false;
              this.plantCode = this.appconfig.getActivePlantCode();
              this.warehouses = [];
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
        }
        break;
      case 'batchDeductionContract':
        {
          this.queryService.batchDeductionContract(this.selectedRows.map(item => item.id), this.contractCode).subscribe(res => {
            if(res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate(res.msg));
              this.isVisible = false;
              this.query();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
        }
        break;
    
      default:
        break;
    }
  }

  refreshHasRawContract() {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确定发起刷新请求？'),
      nzOnOk: () => {
        this.queryService.refreshHasRawContract().subscribe(res => {
          if(res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  addContract() {
    let filterFn = item => item.distDetailedState === '10' && !item.contractCode;
    if(this.isCurrent) {
      filterFn = item => !!item.productCategory && !!item.cusCode && !item.contractCode;
    }
    const selectedRows = this.gridApi.getSelectedRows();
    let warningMsg = '';
    for(let i = 0; i < selectedRows.length; i++) {
      const item = selectedRows[0];
      if(!filterFn(item)) {
        if(this.isCurrent) {
          warningMsg = '只能勾选产品大类与客户均不为空、合同号为空的数据！';
        } else {
          warningMsg = '只能勾选未分货且合同号为空的数据！';
        }
      } else if(item.productCategory !== selectedRows[0].productCategory) {
        warningMsg = '所选分货明细产品大类不一致，请重新选择！';
      } else if(item.cusCode !== selectedRows[0].cusCode) {
        warningMsg = '所选分货明细客户不一致，请重新选择！';
      }
      if(warningMsg) {
        this.msgSrv.warning(this.appTranslationService.translate(warningMsg));
        return;
      }
    }
    this.modal.static(
      AddContractComponent,
      {
        i: {id: null},
        salesDistDetailedDTOList: selectedRows,
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  updateContract() {
    // 过滤选中数据批号、合同号不为空的数据
    let batchCodes = [...new Set(this.getGridSelectionKeysByFilter('batchCode', (item) => !this.isNull(item.batchCode) && !this.isNull(item.contractCode)))];
    if(batchCodes.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选批号和合同号均不为空的数据'));
      return;
    }
    // 过滤flag为空的数据
    batchCodes = batchCodes.filter(item => this.isNull(item.flag));
    if(batchCodes.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('所勾选数据在之前已完成更新'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要更新合同数量吗？'),
      nzOnOk: () => {
        this.queryService.updateContract(batchCodes).subscribe(res => {
          if(res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('更新成功'));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  confirmCancelFh() {
    let filterKey = 'branchCusOrderCode';
    let warnMsg = '请先勾选分行客户订单号为空的数据！';
    let stockSaleFlag: 'Y' | 'N' = this.isCurrent ? 'Y' : 'N'; // 确认分货选 Y，取消分货选 N
    if(this.isCurrent) { 
      filterKey = 'contractCode'; 
      warnMsg = '请先勾选合同号为空的数据！';
    }
    const ids = this.getGridSelectionKeysByFilter('id', item => this.isNull(item[filterKey]));
    if(ids.length === 0) {
      this.msgSrv.warning(warnMsg);
      return;
    }
    this.queryService.confirmCancelFh(ids, stockSaleFlag).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('更新成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  import() {
    this.modal.static(
      SalesDistDetailedImportComponent,
      {
        options: {
          distTypeOptions: this.distTypeOptions,
          materialOptions: this.materialOptions,
          transportTypeOptions: this.transportTypeOptions,
          productCategoryOptions: this.productCategoryOptions,
        },
        isCurrent: this.isCurrent
      },
      'md'
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  add(dataItem?: any) {
    this.modal.static(
      SalesDistDetailedEditComponent,
      {
        i: dataItem === undefined ? { id: null } : dataItem,
        isCurrent: this.isCurrent
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  // 获取数据后统计
  loadGridDataCallback(result) {
    setTimeout(() => {
      const isFilter = this.gridApi.isColumnFilterPresent();
      let data = [];
      if (isFilter) {
        this.gridApi.forEachNodeAfterFilter(item => {
          data.push(item.data);
        });
      } else {
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (result.data.content && Array.isArray(result.data.content)) {
            data = result.data.content;
          }
        } 
      }
      this.setTotalBottomRow(data);
    });
  }

  // 过滤后重新统计
  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
  }

  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'distType';
    // 需要统计的列数组
    const fields = ['avaQuantity', 'weight', 'theoreticalWeight', 'onhandQuantity', 'quantityUnstocked', 'quantityUnshipped'
      , 'amountIncludingTax', 'money', 'taxAmount'];
    super.setTotalBottomRow(data, totalField, fields);
  }

  getFlag(dataItem, type: 'null' | 'notnull') {
    switch (type) {
      case 'null':
        // 合同号为空，并且分货明细状态为已开单、分货类型为调拨单
        return dataItem.distDetailedState === '40' && dataItem.distType === 'DBD' && !dataItem.contractCode;
      case 'notnull':
        // 合同号不为空，并且分货明细状态为已开单、分货类型为调拨单，或者分货明细状态为已分货、分货类型为不开单、销售订单
        const flag1 = dataItem.contractCode && (
          (dataItem.distDetailedState === '40' && dataItem.distType === 'DBD') ||
          (dataItem.distDetailedState === '20' && (dataItem.distType === 'BKD' || dataItem.distType === 'XSDD')));
        // 销售订单明细行号值为空
        const flag2 = !dataItem.salesOrderCode;
        return flag1 || flag2;
    }
  }

  editContract(dataItem, isTransfer: Boolean=true) {
    this.modal.static(
      SalesDistDetailedContractEditComponent,
      {
        i: dataItem,
        isCurrent: this.isCurrent,
        isTransfer: isTransfer
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

    remove(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeys('id') : [dataItem.id];
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if(dataItem === undefined) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('确定要删除吗？'),
          nzOnOk: () => {
            this.delete(ids);
          },
        });
      } else {
        this.delete(ids);
      }
    }
  }

  delete(ids) {
    this.queryService.delete(ids).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  /**
   * 打开明细
   * @param dataItem 
   */
  showDetail(dataItem) {
    this.modal.static(
      SalesOrderDetailComponent,
      {
        salesOrderCode: dataItem.salesOrderCode,
        cusCode: dataItem.cusCode,
        cusAbbreviation: dataItem.cusAbbreviation,
        productCategory: dataItem.productCategory,
        plantCode: dataItem.plantCode,
      }
    ).subscribe(() => {})
  }

  /**
   * 仓库弹出查询
   * @param {any} e
   */
 public searchWares(e: any) {
  const PageIndex = e.Skip / e.PageSize + 1;
  this.loadWares(
    e.SearchValue,
    PageIndex,
    e.PageSize,
  );
}

/**
 * 加载仓库
 * @param {string} subinventoryCode  仓库编码
 * @param {number} pageIndex  页码
 * @param {number} pageSize   每页条数
 */
public loadWares(
  subinventoryCode: string,
  pageIndex: number,
  pageSize: number,
) {
  if (!this.queryParams.values.plantCode) {
    this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
    return;
  }
  this.queryService
    .getWares({
      plantCode: this.queryParams.values.plantCode,
      subinventoryCode: subinventoryCode,
      pageIndex: pageIndex,
      pageSize: pageSize,
    })
    .subscribe(res => {
      this.gridViewWares.data = res.data.content;
      this.gridViewWares.total = res.data.totalElements;
    });
}

//  行点击事件， 给参数赋值
onWaresSelect(e: any) {
  this.queryParams.values.whName = {
    value: e.Row.subinventoryCode,
    text: e.Row.subinventoryDescription,
  };
}

onWaresTextChanged(event: any) {
  const subinventoryCode = event.Text.trim();
  if(subinventoryCode !== '') {
    if (!this.queryParams.values.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.queryService
    .getWares({
      plantCode: this.queryParams.values.plantCode,
      subinventoryCode: subinventoryCode,
      pageIndex: 1,
      pageSize: 1,
    }).subscribe(res => {
      if(res.data.content.length > 0) {
        // 判断转入转出仓库是否相同
        this.queryParams.values.whName = {
          value: res.data.content[0].subinventoryCode,
          text: res.data.content[0].subinventoryDescription,
        };
      } else {
        this.queryParams.values.whName = {
          value: '',
          text: ''
        };
        this.msgSrv.info(this.appTranslationService.translate('仓库编码无效'))
      }
    });
  } else {
    this.queryParams.values.whName = {
      value: '',
      text: ''
    };
  }
}

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

  expColumnsOptions: any[] = [
    { field: 'distType', options: this.distTypeOptions },
    { field: 'distDetailedState', options: this.distDetailedStateOptions },
    { field: 'productCategory', options: this.productCategoryOptions },
    { field: 'plan', options: this.planOptions },
    { field: 'subsectionState', options: this.subsectionStateOptions },
    { field: 'fullVolume', options: this.YesNoOptions },
    { field: 'rewinding', options: this.YesNoOptions },
    { field: 'packType', options: this.packTypeOptions },
    { field: 'entrustedProcessing', options: this.YesNoOptions },
    { field: 'prodType', options: this.prodTypeOptions },
    { field: 'transportType', options: this.transportTypeOptions },
    { field: 'houbo', options: this.materialOptions },
    { field: 'trmming', options: this.YesNoOptions },
    { field: 'pricingType', options: this.pricingTypeOptions },
    { field: 'sleeveType', options: this.ttTypeOptions },
    { field: 'tolerance', options: this.gongchaOptions },
    { field: 'haveContract', options: this.YesNoOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.exportFile();
  }

  exportFile() {
    this.queryService.exportAction(
      this.httpAction,
      this.getQueryParamsValue(true),
      this.excelexport,
      this.context
    );
  }
}
