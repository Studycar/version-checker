import { Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { RefundClaimQueryService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { RefundClaimEditComponent } from './edit/edit.component';
import { IdeSubmitService } from 'app/modules/base_module/services/ide-submit.service';

/**
 * 付款申请单
 */
@Component({
  selector: 'refund-claim',
  templateUrl: './refund-claim.component.html',
  providers: [RefundClaimQueryService],
})
export class RefundClaimComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    public appTranslationService: AppTranslationService,
    public appConfigService: AppConfigService,
    public msgSrv: NzMessageService,
    public confirmationService: NzModalService,
    public modal: ModalHelper,
    public queryService: RefundClaimQueryService,
    private ideSubmitService: IdeSubmitService,
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
    method: 'GET',
  };

  // 表格列配置
  columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 120,
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
    { field: 'refundClaimCode', width: 120, headerName: '申请单号' },
    { field: 'refundState', width: 120, headerName: '申请单状态', valueFormatter: 'ctx.optionsFind(value,5).label' },
    { field: 'orno', width: 120, headerName: '客诉申请单号' },
    { field: 'pono', width: 120, headerName: '客诉申请单明细行号' },
    { field: 'plantCode', width: 120, headerName: '付款公司', valueFormatter: 'ctx.optionsFind(value,7).label' },
    { field: 'cusCode', width: 120, headerName: '客户编码' },
    { field: 'payStatus', width: 120, headerName: '付款状态', valueFormatter: 'ctx.optionsFind(value,2).label' },
    { field: 'endData', width: 120, headerName: '单据日期' },
    // { field: 'payAccountNo', width: 120, headerName: '付款账号' },
    { field: 'payType', width: 120, headerName: '付款方式', valueFormatter: 'ctx.optionsFind(value,6).label' },
    { field: 'payAmount', width: 120, headerName: '付款金额' },
    { field: 'currency', width: 120, headerName: '币种', valueFormatter: 'ctx.optionsFind(value,3).label' },
    { field: 'receiveAccountNo', width: 120, headerName: '收款方账号' },
    { field: 'receiveAccountName', width: 120, headerName: '收款方账户户名' },
    { field: 'receiveCnaps', width: 120, headerName: '收款方联行号' },
    { field: 'receiveBankName', width: 120, headerName: '收款方银行名称' },
    { field: 'prov', width: 120, headerName: '收款方省' },
    { field: 'city', width: 120, headerName: '收款方市' },
    { field: 'personnel', width: 120, headerName: '对公标识', valueFormatter: 'ctx.optionsFind(value,4).label' },
    { field: 'urgent', width: 120, headerName: '是否加急', valueFormatter: 'ctx.optionsFind(value,4).label' },
    { field: 'remark', width: 120, headerName: '摘要' },
    { field: 'businessType', width: 120, headerName: '业务类型', valueFormatter: 'ctx.optionsFind(value,1).label' },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.businessTypeOptions;
        break;
      case 2:
        options = this.payStatusOptions;
        break;
      case 3:
        options = this.currencyOptions;
        break;
      case 4:
        options = this.YesNoOptions;
        break;
      case 5:
        options = this.refundStateOptions;
        break;
      case 6:
        options = this.payTypeOptions;
        break;
      case 7:
        options = this.orgReflectOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  DEFAULT_QUERY_PARAMS = {
    businessType: '',
    plantCode: '',
    payStatus: '',
    orno: '',
  }

  businessTypeOptions = []
  payTypeOptions = [];
  payStatusOptions = []
  currencyOptions = []
  YesNoOptions = []
  refundStateOptions = []
  orgReflectOptions = []

  // 查询条件配置
  queryParams = {
    defines: [
      { field: 'businessType', title: '业务类型', ui: { type: UiType.select, options: this.businessTypeOptions } },
      { field: 'plantCode', title: '付款公司', ui: { type: UiType.select, options: this.orgReflectOptions } },
      { field: 'payStatus', title: '付款状态', ui: { type: UiType.select, options: this.payStatusOptions } },
      { field: 'orno', title: '客诉申请单号', ui: { type: UiType.text } },
    ],
    values: this.DEFAULT_QUERY_PARAMS
  };

  // 获取查询条件
  getQueryParams(isExport: boolean = false): any {
    const params: any = { ...this.queryParams.values };
    // if (isExport) {
    //   params.isExport = true;
    // } else {
    params.export = isExport;
    params.pageIndex = this._pageNo;
    params.pageSize = this._pageSize;
    // }
    return params;
  }

  // 初始化生命周期
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  async ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    await this.loadOptions();
    this.query();
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_REFUND_STATE': this.refundStateOptions,
      'PS_PAY_STATUS': this.payStatusOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_REFUND_TYPE': this.businessTypeOptions,
      'PS_PAY_TYPE': this.payTypeOptions,
      'PS_ORG_REFLECT': this.orgReflectOptions,
    });
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

  // 重置
  public clear() {
    this.queryParams.values = this.DEFAULT_QUERY_PARAMS
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

  openEditModal(dataItem?: any) {
    this.modal.static(
      RefundClaimEditComponent,
      {
        i: dataItem || {}
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  remove(dataItem?: any) {
    const isBatch = !dataItem
    let ids = isBatch ? this.getGridSelectionKeys('id') : [dataItem.id];
    // 批量删除
    if (isBatch) {
      if(ids.length === 0) {
        this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
        return;
      }
      const filteredIds = this.getGridSelectionKeysByFilter('id', (item) => item.refundState === '10')
      if(filteredIds.length === 0) {
        this.msgSrv.warning(this.appTranslationService.translate('要删除的数据中必须包含待审批的数据'));
        return;
      }
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('确定要删除吗？'),
        nzOnOk: () => {
          this.delete(filteredIds);
        },
      });
    } else {
      this.delete(ids);
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

  approve(dataItem: any) {
    this.ideSubmitService.navigate('ideRefundClaim', {
      getFormParams: {
        url: this.queryService.getInfoUrl,
        method: 'POST',
        params: { id: dataItem.id }
      },
    })
  }

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [
    { field: 'plantCode', options: this.orgReflectOptions },
    { field: 'refundState', options: this.refundStateOptions },
    { field: 'payStatus', options: this.payStatusOptions },
    { field: 'payType', options: this.payTypeOptions },
    { field: 'currency', options: this.currencyOptions },
    { field: 'personnel', options: this.YesNoOptions },
    { field: 'urgent', options: this.YesNoOptions },
    { field: 'businessType', options: this.businessTypeOptions },
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