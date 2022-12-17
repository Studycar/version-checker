import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { DeliveryOrderQueryService } from "../query.service";
import { DeliveryOrderDetailEditComponent } from "./edit/edit.component";

@Component({
  selector: 'delivery-order-detail',
  templateUrl: './detail.component.html',
  providers: [DeliveryOrderQueryService]
})
export class DeliveryOrderDetailComponent extends CustomBaseContext implements OnInit {

  plantCode: string = '';
  shippingAddress: string = '';
  deliveryState: string = '';

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: DeliveryOrderQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

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
      field: 'deliveryOrderCode',
      width: 120,
      headerName: '配送单号'
    },
    {
      field: 'detailedNum',
      width: 120,
      headerName: '明细行号'
    },
    {
      field: 'state',
      width: 120,
      headerName: '配送单行状态',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'type',
      width: 120,
      headerName: '配送单类型',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂',
    },
    {
      field: 'salesOrderCode',
      width: 120,
      headerName: '销售订单号',
    },
    {
      field: 'invoiceBillCode',
      width: 120,
      headerName: '发货单号',
    },
    {
      field: 'invoiceBillDetailedNum',
      width: 120,
      headerName: '发货单明细行号',
    },
    {
      field: 'code',
      width: 120,
      headerName: '调拨单号',
    },
    {
      field: 'pono',
      width: 120,
      headerName: '调拨单明细行号',
    },
    {
      field: 'quantityMx',
      width: 120,
      headerName: '数量',
    },
    {
      field: 'invoiceBillDate',
      width: 120,
      headerName: '配送日期',
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
      field: 'stockCode',
      width: 120,
      headerName: '存货编码',
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '存货名称',
    },
    {
      field: 'unit',
      width: 120,
      headerName: '单位',
    },
    {
      field: 'batchNum',
      width: 120,
      headerName: '批号',
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'priceKg',
      width: 120,
      headerName: '价格（KG）',
    },
    {
      field: 'sfsn',
      width: 120,
      headerName: '是否省内',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'xykh',
      width: 120,
      headerName: '下游客户',
    },
    {
      field: 'shippingAddress',
      width: 120,
      headerName: '配送地址',
    },
  ];
  steelTypeOptions: any[] = [];
  YesNoOptions: any[] = [];
  detailedStateOptions: any[] = [];
  deliveryTypeOptions: any[] = [];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.steelTypeOptions;
        break;
      case 2:
        options = this.YesNoOptions;
        break;
      case 3:
        options = this.detailedStateOptions;
        break;
      case 4:
        options = this.deliveryTypeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  deliveryOrderCode: string = '';

  queryParams = {
    defines: [
      { field: 'deliveryOrderCode', title: '配送单号', ui: { type: UiType.text } },
      { field: 'invoiceBillCode', title: '发货单号', ui: { type: UiType.text } },
      { field: 'code', title: '调拨单号', ui: { type: UiType.text } },
      { field: 'batchNum', title: '批号', ui: { type: UiType.text } },
      { field: 'dateRange', title: '配送日期', ui: { type: UiType.dateRange } },
    ],
    values: {
      deliveryOrderCode: '',
      invoiceBillCode: '',
      code: '',
      batchNum: '',
      dateRange: [],
    }
  };

  clear() {
    this.queryParams.values = {
      deliveryOrderCode: this.deliveryOrderCode,
      invoiceBillCode: '',
      code: '',
      batchNum: '',
      dateRange: [],
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.queryParams.values.deliveryOrderCode = this.deliveryOrderCode;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_YES_NOT': this.YesNoOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_DELIVERY_DETAILED_TYPE': this.detailedStateOptions,
      'PS_DELIVERY_TYPE': this.deliveryTypeOptions,
    });
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryDetailedUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    const params: any = { ...this.queryParams.values, export:isExport };
    params.invoiceBillDate = this.queryService.formatDate(this.queryParams.values.dateRange[0]);
    params.endInvoiceBillDate = this.queryService.formatDate(this.queryParams.values.dateRange[1]);
    delete params.dateRange;
    if(!isExport) {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  add(dataItem?: any) {
    this.modal.static(
      DeliveryOrderDetailEditComponent,
      {
        i: dataItem === undefined ? { id: null, deliveryOrderCode: this.deliveryOrderCode } : dataItem,
        plantCode: this.plantCode,
        shippingAddress: this.shippingAddress,
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
    this.queryService.deleteDetailed(ids).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  issue(dataItem) {
    this.queryService.issue([dataItem.id]).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('下发成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

   /**
   * 打开修改记录
   * @param dataItem 
   */
    showChangeDetail(dataItem) {
      this.modal.static(
        PlanscheduleHWChangeDetailComponent,
        {
          httpAction: { url: this.queryService.queryDetailChangeDetailUrl, method: 'GET' },
          myAgGrid: {
            myAgGridState: 'ps_delivery_order_detailed_history',
            myAgGridRowKey: 'PS_DELIVERY_ORDER_DETAILED_HISTORY',
          },
          queryParamsValue: {
            detailedNum: dataItem.detailedNum,
          },
          exportFileName: '配送单明细',
          tableColumns: [{
            field: 'zxdz',
            headerName: '执行动作',
            width: 100
          }, ...this.columns.filter(col => col.colId === undefined)],
          tableExpColumnsOptions: this.expColumnsOptions,
          optionsFind: this.optionsFind.bind(this)
        }
      ).subscribe(() => {})
    }

  expColumnsOptions: any[] = [
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'sfsn', options: this.YesNoOptions },
    { field: 'state', options: this.detailedStateOptions },
    { field: 'type', options: this.deliveryTypeOptions },
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

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

}
