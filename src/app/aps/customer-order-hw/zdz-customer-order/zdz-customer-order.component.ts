import { Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { ZdzCustomerOrderEditComponent } from './edit/edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  selector: 'zdz-customer-order',
  templateUrl: './zdz-customer-order.component.html',
  providers: [QueryService],
})
export class ZdzCustomerOrderComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    public appTranslationService: AppTranslationService,
    public appConfigService: AppConfigService,
    public msgSrv: NzMessageService,
    public confirmationService: NzModalService,
    public modal: ModalHelper,
    public queryService: QueryService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  // 查询/导出接口配置
  httpAction = {
    url: this.queryService.queryUrl,
    method: 'POST',
  };

  // 表格列配置
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
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
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
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'standards',
      width: 120,
      headerName: '规格'
    },
    {
      field: 'unit',
      width: 120,
      headerName: '单位',
      valueFormatter: 'ctx.optionsFind(value,2).label',
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
      field: 'cusCode',
      width: 120,
      headerName: '客户编码'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      headerName: '客户简称'
    },
    {
      field: 'cusDeliveryDate',
      width: 120,
      headerName: '客户交期'
    },
    {
      field: 'processingType',
      width: 120,
      headerName: '加工类型',
      valueFormatter: 'ctx.optionsFind(value,3).label',
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
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'quantity',
      width: 120,
      headerName: '下单数量'
    },
    {
      field: 'salesOrderType',
      width: 120,
      headerName: '销售类型',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'packType',
      width: 120,
      headerName: '包装方式',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'transportType',
      width: 120,
      headerName: '运输方式',
      valueFormatter: 'ctx.optionsFind(value,7).label',
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
      valueFormatter: 'ctx.optionsFind(value,8).label',
    },
    {
      field: 'pickUp',
      width: 120,
      headerName: '是否自提',
      valueFormatter: 'ctx.optionsFind(value,9).label',
    },
    {
      field: 'plannedDeliveryDate',
      width: 120,
      headerName: '计划交期',
    },
    {
      field: 'plan',
      width: 120,
      headerName: '计划',
      valueFormatter: 'ctx.optionsFind(value,10).label',
    },
  ];
  plantOptions: any[] = [];
  cusOrderStateOptions: any = [];
  contractSteelTypeOptions: any = [];
  YesNoOptions: any = [];
  planOptions: any = [];
  salesOrderTypeOptions: any = [];
  gongchaOptions: any = [];
  transportTypeOptions: any = []; // PS_TRANSPORT_TYPE
  unitOptions: any = []; // PS_ITEM_UNIT
  packTypeOptions: any = []; // PS_PACK_TYPE
  processingTypeOptions: any = []; // PS_PROCESSING_TYPE
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.contractSteelTypeOptions;
        break;
      case 2:
        options = this.unitOptions;
        break;
      case 3:
        options = this.processingTypeOptions;
        break;
      case 4:
        options = this.gongchaOptions;
        break;
      case 5:
        options = this.packTypeOptions;
        break;
      case 6:
        options = this.transportTypeOptions;
        break;
      case 7:
        options = this.processingTypeOptions;
        break;
      case 8:
        options = this.cusOrderStateOptions;
        break;
      case 9:
        options = this.YesNoOptions;
        break;
      case 10:
        options = this.planOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  // 查询条件配置
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'cusOrderCode', title: '订单编码', ui: { type: UiType.text } },
      { field: 'stockName', title: '存货名称', ui: { type: UiType.text } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.contractSteelTypeOptions } },
    ],
    values: {
      plantCode: this.appConfigService.getActivePlantCode(),
      cusOrderCode: '',
      stockName: '',
      steelType: null,
      prodType: 'ZDZ'
    }
  };

  // 获取查询条件
  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if (isExport) {
      params.isExport = true;
    } else {
      params.isExport = false;
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  // 初始化生命周期
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_BRANCH_CUS_ORDER_STATE': this.cusOrderStateOptions,
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_PROCESSING_TYPE': this.processingTypeOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_PACK_TYPE': this.packTypeOptions,
      'PS_SALES_ORDER_TYPE': this.salesOrderTypeOptions,
      'GONGCHA': this.gongchaOptions,
      'PS_PLAN': this.planOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }
  query() {
    super.query();
    this.queryCommon();
  }

  // 查询方法
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParams(),
      this.context,
    );
  }
  
  add(dataItem?: any) {
    this.modal.static(
      ZdzCustomerOrderEditComponent,
      { i: dataItem === undefined ? { id : null } : dataItem }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  remove(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeysByFilter('id', item => ['80'].includes(item.cusOrderState)) : [dataItem.id];
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选新增的数据'));
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
  
  orderPublish() {
    const ids = this.getGridSelectionKeys();
    if (ids.length === 0) {
      this.msgSrv.info(this.appTranslationService.translate('请先勾选转定子客户订单'));
      return;
    }
    this.queryService.issueCusOrder(ids).subscribe(res => {
      if (res.code == 200) {
        let msg: string = ['{', '['].includes(res.msg[0]) ? JSON.stringify(JSON.parse(res.msg)) : res.msg;
        this.msgSrv.success(this.appTranslationService.translate(msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  // 重置
  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getActivePlantCode(),
      cusOrderCode: '',
      stockName: '',
      steelType: null,
      prodType: 'ZDZ'
    };
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'cusOrderState', options: this.cusOrderStateOptions },
    { field: 'pickUp', options: this.YesNoOptions },
    { field: 'steelType', options: this.contractSteelTypeOptions },
    { field: 'processingType', options: this.processingTypeOptions },
    { field: 'transportType', options: this.transportTypeOptions },
    { field: 'unit', options: this.unitOptions },
    { field: 'packType', options: this.packTypeOptions },
    { field: 'salesOrderType', options: this.salesOrderTypeOptions },
    { field: 'tolerance', options: this.gongchaOptions },
    { field: 'plan', options: this.planOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.exportAction(
      this.httpAction,
      params,
      this.excelexport,
      this.context
    );
  }
}