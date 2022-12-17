import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomerOrderEditComponent } from './edit/edit.component';
import { CustomerOrderImportComponent } from './import/import.component';
import { CustomerOrderQueryService } from './query.service';
import { PlanscheduleHWChangeDetailComponent } from 'app/modules/base_module/components/change-detail/change-detail.component';

@Component({
  selector: 'customer-order',
  templateUrl: './customer-order.component.html',
  providers: [CustomerOrderQueryService]
})
export class CustomerOrderComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerOrderQueryService,
    public http: _HttpClient,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  cusOrderStateOptions: any = []; 
  planOptions: any = [];
  contractSteelTypeOptions: any = [];
  YesNoOptions: any = [];
  paperOptions: any = [];
  contractSurfaceOptions: any = [];
  orderStateOptions: any = [];
  plantOptions: any = [];
  prodTypeOptions: any = [];
  salesOrderTypeOptions: any = [];
  pricingTypeOptions: any = [];
  gongchaOptions: any = [];
  cusOrderTypeOptions: any = []; // PS_CUS_ORDER_TYPE
  productCategoryOptions: any = []; // PS_PRODUCT_CATEGORY
  processingTypeOptions: any = []; // PS_PROCESSING_TYPE
  subsectionStateOptions: any = []; // PS_SUBSECTION_STATE
  transportTypeOptions: any = []; // PS_TRANSPORT_TYPE
  unitOptions: any = []; // PS_ITEM_UNIT
  packTypeOptions: any = []; // PS_PACK_TYPE
  settleStyleOptions: any = []; // PS_SETTLE_STYLE
  selectBy = 'id';
  isReceipt: boolean = true; // 是否接单审核

  columns = [
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
      field: 'cusOrderCode',
      width: 120,
      headerName: '订单编码'
    },
    {
      field: 'cusOrderState',
      width: 120,
      headerName: '订单状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'cusOrderType',
      width: 120,
      headerName: '订单类型',
      valueFormatter: 'ctx.optionsFind(value,8).label',
    },
    {
      field: 'itemCode',
      width: 120,
      headerName: '物料编码',
    },
    {
      field: 'productCategory',
      width: 120,
      headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'orderDate',
      width: 120,
      headerName: '下单日期'
    },
    {
      field: 'orderMonth',
      width: 120,
      headerName: '订单月份'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称'
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码'
    },
    {
      field: 'plan',
      width: 120,
      headerName: '计划',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'prodType',
      width: 120,
      headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,15).label',
    },
    {
      field: 'stockCode',
      width: 120,
      headerName: '存货编码'
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '存货名称'
    },
    {
      field: 'coatingUpCode',
      width: 120,
      headerName: '面膜存货编码'
    },
    {
      field: 'coatingUpName',
      width: 120,
      headerName: '面膜存货描述'
    },
    {
      field: 'upLabelDesc',
      width: 120,
      headerName: '面膜标签描述'
    },
    {
      field: 'coatingDownCode',
      width: 120,
      headerName: '底膜存货编码'
    },
    {
      field: 'coatingDownName',
      width: 120,
      headerName: '底膜存货描述'
    },
    {
      field: 'downLabelDesc',
      width: 120,
      headerName: '底膜标签描述'
    },
    {
      field: 'paper',
      width: 120,
      headerName: '表面保护',
      valueFormatter: 'ctx.optionsFind(value,18).label',
    },
    {
      field: 'salesOrderType',
      width: 120,
      headerName: '销售类型',
      valueFormatter: 'ctx.optionsFind(value,16).label',
    },
    {
      field: 'standards',
      width: 120,
      headerName: '规格'
    },
    {
      field: 'width',
      width: 120,
      headerName: '宽度'
    },
    {
      field: 'prodLength',
      width: 120,
      headerName: '长度'
    },
    {
      field: 'quantity',
      width: 120,
      headerName: '数量'
    },
    {
      field: 'boxQuantity',
      width: 120,
      headerName: '箱数'
    },
    {
      field: 'packingQuantuty',
      width: 120,
      headerName: '装箱张数'
    },
    {
      field: 'cusDeliveryDate',
      width: 120,
      headerName: '客户交期'
    },
    {
      field: 'processingReq',
      width: 120,
      headerName: '加工要求'
    },
    {
      field: 'tolerance',
      width: 120,
      headerName: '公差',
      valueFormatter: 'ctx.optionsFind(value,17).label',
    },
    {
      field: 'pickUp',
      width: 120,
      headerName: '是否自提',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'cusOrder',
      width: 120,
      headerName: '是否客订',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'processingType',
      width: 120,
      headerName: '加工类型',
      valueFormatter: 'ctx.optionsFind(value,9).label',
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'hardness',
      width: 120,
      headerName: '硬度'
    },
    {
      field: 'plannedDeliveryDate',
      width: 120,
      headerName: '计划交期',
    },
    {
      field: 'meterNum',
      width: 120,
      headerName: '米数'
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'urgent',
      width: 120,
      headerName: '急要',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'isChange',
      width: 120,
      headerName: '变更',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'coilState',
      width: 120,
      headerName: '钢卷状态',
    },
    {
      field: 'coilBatchNum',
      width: 120,
      headerName: '来料批号'
    },
    {
      field: 'deliveryQuantity',
      width: 120,
      headerName: '交货重量',
    },
    {
      field: 'deliveryAmount',
      width: 120,
      headerName: '交货数量',
    },
    {
      field: 'deliveryDate',
      width: 120,
      headerName: '交货日期',
    },
    {
      field: 'salesStrategy',
      width: 120,
      headerName: '销售策略',
    },
    {
      field: 'standardsType',
      width: 120,
      headerName: '规格尺寸',
    },
    {
      field: 'elongation',
      width: 120,
      headerName: '延伸率',
    },
    {
      field: 'gloss',
      width: 120,
      headerName: '光泽度',
    },
    {
      field: 'ironLoss',
      width: 120,
      headerName: '铁损',
    },
    {
      field: 'magnetoreception',
      width: 120,
      headerName: '磁感',
    },
    {
      field: 'subsectionState',
      width: 120,
      headerName: '分卷状态',
      valueFormatter: 'ctx.optionsFind(value,10).label',
    },
    {
      field: 'coilInnerDia',
      width: 120,
      headerName: '钢卷内径',
    },
    {
      field: 'pricingType',
      width: 120,
      headerName: '计价方式',
      valueFormatter: 'ctx.optionsFind(value,19).label',
    },
    {
      field: 'labelSpecs',
      width: 120,
      headerName: '标签规格',
    },
    {
      field: 'transportType',
      width: 120,
      headerName: '运输方式',
      valueFormatter: 'ctx.optionsFind(value,11).label',
    },
    {
      field: 'fullVolume',
      width: 120,
      headerName: '是否整卷',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'entrustedProcessing',
      width: 120,
      headerName: '是否受托',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'trmming',
      width: 120,
      headerName: '是否切边',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'unit',
      width: 120,
      headerName: '数量单位',
      valueFormatter: 'ctx.optionsFind(value,12).label',
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      headerName: '重量单位',
      valueFormatter: 'ctx.optionsFind(value,12).label',
    },
    {
      field: 'weight',
      width: 120,
      headerName: '重量',
    },
    {
      field: 'packType',
      width: 120,
      headerName: '包装方式',
      valueFormatter: 'ctx.optionsFind(value,13).label',
    },
    {
      field: 'sampleNum',
      width: 120,
      headerName: '样本编号',
    },
    {
      field: 'settlestyle',
      width: 120,
      headerName: '结算方式',
      valueFormatter: 'ctx.optionsFind(value,14).label',
    },
    {
      field: 'slittingQuantity',
      width: 120,
      headerName: '分条数量',
    },
    {
      field: 'reason',
      width: 120,
      headerName: '驳回原因',
    },
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
        options = this.cusOrderStateOptions;
        break;
      case 2:
        options = this.planOptions;
        break;
      case 3:
        options = this.contractSteelTypeOptions;
        break;
      case 4:
        options = this.YesNoOptions;
        break;
      case 5:
        options = this.contractSurfaceOptions;
        break;
      case 6:
        options = this.orderStateOptions;
        break;
      case 7:
        options = this.productCategoryOptions;
        break;
      case 8:
        options = this.cusOrderTypeOptions;
        break;
      case 9:
        options = this.processingTypeOptions;
        break;
      case 10:
        options = this.subsectionStateOptions;
        break;
      case 11:
        options = this.transportTypeOptions;
        break;
      case 12:
        options = this.unitOptions;
        break;
      case 13:
        options = this.packTypeOptions;
        break;
      case 14:
        options = this.settleStyleOptions;
        break;
      case 15:
        options = this.prodTypeOptions;
        break;
      case 16:
        options = this.salesOrderTypeOptions;
        break;
      case 17:
        options = this.gongchaOptions;
        break;
      case 18:
        options = this.paperOptions;
        break;
      case 19:
        options = this.pricingTypeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'cusOrderCode', title: '订单编码', ui: { type: UiType.text } },
      { field: 'cusOrderState', title: '订单状态', ui: { type: UiType.select, options: this.cusOrderStateOptions } },
      { field: 'productCategory', title: '产品大类', ui: { type: UiType.select, options: this.productCategoryOptions } },
      { field: 'orderDate', title: '下单日期', ui: { type: UiType.date } },
      { field: 'cusAbbreviation', title: '客户简称', ui: { type: UiType.text, } },
      { field: 'plan', title: '计划', ui: { type: UiType.select, options: this.planOptions } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.contractSteelTypeOptions } },
      { field: 'prodType', title: '形式', ui: { type: UiType.select, options: this.prodTypeOptions } },
      { field: 'cusDeliveryDate', title: '客户交期', ui: { type: UiType.date } },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      cusOrderCode: '',
      cusOrderState: null,
      productCategory: null,
      orderDate: '',
      cusAbbreviation: '',
      plan: null,
      steelType: null,
      prodType: null,
      cusDeliveryDate: '',
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      cusOrderCode: '',
      cusOrderState: null,
      productCategory: null,
      orderDate: '',
      cusAbbreviation: '',
      plan: null,
      steelType: null,
      prodType: null,
      cusDeliveryDate: '',
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions()
  }
  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
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
  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'cusOrderCode';
    // 需要统计的列数组
    const fields = ['weight', 'quantity', 'meterNum'];
    super.setTotalBottomRow(data, totalField, fields);
  }
  loadOptions = super.wrapLoadOptionsFn(async () => {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CUS_ORDER_STATE': this.cusOrderStateOptions,
      'PS_PLAN': this.planOptions,
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_CONTRACT_SURFACE': this.contractSurfaceOptions,
      'PS_ORDER_STATE': this.orderStateOptions,
      'PS_CUS_ORDER_TYPE': this.cusOrderTypeOptions,
      'PS_PROCESSING_TYPE': this.processingTypeOptions,
      'PS_SUBSECTION_STATE': this.subsectionStateOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
      'PS_SALES_ORDER_TYPE': this.salesOrderTypeOptions,
      'PS_SETTLE_STYLE': this.settleStyleOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'GONGCHA': this.gongchaOptions,
      'PS_SURFACE_PROTECT': this.paperOptions,
      'PS_PRICING_TYPE': this.pricingTypeOptions,
    });
    await this.productCategoryOptions.push(...await this.queryService.getUserProCates());
    await this.plantOptions.push(...await this.queryService.getUserPlants());
  })

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    const params: any = { ...this.queryParams.values };
    params.cusDeliveryDate = this.queryService.formatDate(params.cusDeliveryDate);
    params.orderDate = this.queryService.formatDate(params.orderDate);
    return {
      ...params,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      CustomerOrderEditComponent,
      { i: dataItem === undefined ? { id : null } : dataItem }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  import() {
    this.modal
      .static(CustomerOrderImportComponent, 
        {
          options: {
            cusOrderStateOptions: this.cusOrderStateOptions,
            planOptions: this.planOptions,
            contractSteelTypeOptions: this.contractSteelTypeOptions,
            YesNoOptions: this.YesNoOptions,
            contractSurfaceOptions: this.contractSurfaceOptions,
            productCategoryOptions: this.productCategoryOptions,
            cusOrderTypeOptions: this.cusOrderTypeOptions,
            processingTypeOptions: this.processingTypeOptions,
            subsectionStateOptions: this.subsectionStateOptions,
            transportTypeOptions: this.transportTypeOptions,
            unitOptions: this.unitOptions,
            packTypeOptions: this.packTypeOptions,
            prodTypeOptions: this.prodTypeOptions,
            settleStyleOptions: this.settleStyleOptions,
            gongchaOptions: this.gongchaOptions,
            salesOrderTypeOptions: this.salesOrderTypeOptions,
            paperOptions: this.paperOptions,
            pricingTypeOptions: this.pricingTypeOptions,
          },
          expColumnsOptions: this.expColumnsOptions,
        }, 'md')
      .subscribe(() => {
        this.query();
      });
  }

  isVisible: boolean = false;
  plantCode = this.appconfig.getActivePlantCode();
  productCategory: string = '';
  receiptApproval() {
    const ids = [];
    const selectedRows = this.gridApi.getSelectedRows();
    for(let i = 0; i < selectedRows.length; i++) {
      if(['10','40'].includes(selectedRows[i].cusOrderState)) {
        ids.push(selectedRows[i].id);
      } else {
        this.msgSrv.warning(this.appTranslationService.translate('请勾选待审核或驳回的客户订单数据！'));
        return;
      }
    }
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请勾选待审核或驳回的客户订单数据！'));
      return;
    }
    this.queryService.acceptOrderAndAudit(ids).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.data.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  handleCancel() {
    this.isVisible = false;
    this.plantCode = this.appconfig.getActivePlantCode();
    this.productCategory = null;
  }

  handleOk() {
    this.queryService.splitCusOrder2Branch(this.plantCode, this.productCategory).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.data.msg));
        this.isVisible = false;
        this.plantCode = this.appconfig.getActivePlantCode();
        this.productCategory = null;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  orderBranch() {
    this.isReceipt = false;
    this.isVisible = true;
  }
  remove(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeysByFilter('id', item => ['10','40'].includes(item.cusOrderState)) : [dataItem.id];
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选待审核或驳回的数据'));
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

  cancel(dataItem) {
    this.queryService.cancel([dataItem.id]).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('取消成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  expColumnsOptions: any[] = [
    { field: 'cusOrderState', options: this.cusOrderStateOptions },
    { field: 'cusOrderType', options: this.cusOrderTypeOptions },
    { field: 'productCategory', options: this.productCategoryOptions },
    { field: 'pickUp', options: this.YesNoOptions },
    { field: 'cusOrder', options: this.YesNoOptions },
    { field: 'urgent', options: this.YesNoOptions },
    { field: 'isChange', options: this.YesNoOptions },
    { field: 'plan', options: this.planOptions },
    { field: 'steelType', options: this.contractSteelTypeOptions },
    { field: 'surface', options: this.contractSurfaceOptions },
    { field: 'processingType', options: this.processingTypeOptions },
    { field: 'subsectionState', options: this.subsectionStateOptions },
    { field: 'transportType', options: this.transportTypeOptions },
    { field: 'fullVolume', options: this.YesNoOptions },
    { field: 'entrustedProcessing', options: this.YesNoOptions },
    { field: 'trmming', options: this.YesNoOptions },
    { field: 'unit', options: this.unitOptions },
    { field: 'unitOfMeasure', options: this.unitOptions },
    { field: 'prodType', options: this.prodTypeOptions },
    { field: 'packType', options: this.packTypeOptions },
    { field: 'settlestyle', options: this.settleStyleOptions },
    { field: 'paper', options: this.paperOptions },
    { field: 'salesOrderType', options: this.salesOrderTypeOptions },
    { field: 'tolerance', options: this.gongchaOptions },
    { field: 'pricingType', options: this.pricingTypeOptions },
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

  showChangeDetail(dataItem) {
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: {
          url: this.queryService.queryChangeDetailUrl,
          method: 'POST'
        },
        myAgGrid: {
          myAgGridState: 'ps-cus-order-change-his',
          myAgGridRowKey: 'PS_CUS_ORDER_CHANGE_HIS',
        },
        defineQueryParams: {
          defines: [
            { field: 'cusOrderCode', title: '订单编码', ui: { type: UiType.text } },
            { field: 'cusOrderState', title: '订单状态', ui: { type: UiType.select, options: this.cusOrderStateOptions } },
            { field: 'orderDate', title: '下单日期', ui: { type: UiType.date } },
            { field: 'cusAbbreviation', title: '客户简称', ui: { type: UiType.text, } },
            { field: 'plan', title: '计划', ui: { type: UiType.select, options: this.planOptions } },
            { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.contractSteelTypeOptions } },
            { field: 'prodType', title: '形式', ui: { type: UiType.text } },
            { field: 'cusDeliveryDate', title: '客户交期', ui: { type: UiType.date } },
          ],
          values: {
            cusOrderCode: dataItem.cusOrderCode,
            cusOrderState: null,
            orderDate: '',
            cusAbbreviation: '',
            plan: null,
            steelType: null,
            prodType: null,
            cusDeliveryDate: '',
          }
        },
        exportFileName: '客户订单',
        tableColumns: this.columns.filter(col => col.colId === undefined),
        tableExpColumnsOptions: this.expColumnsOptions,
        optionsFind: this.optionsFind.bind(this)
      }
    ).subscribe(() => {})
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }
}
