import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { ModalHelper } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { OrderCommitmentEditComponent } from './edit/edit.component';
import { OrderCommitmentService } from './order-commitment.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  selector: 'app-order-commitment',
  templateUrl: './order-commitment.component.html',
  providers: [OrderCommitmentService]
})
export class OrderCommitmentComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private modal: ModalHelper,
    private commonQueryService: CommonQueryService,
    private queryService: OrderCommitmentService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  businessUnitOption: any[] = [];
  plantOption: any[] = [];
  orderTypeOption: any[] = [];
  queryParams = {
    defines: [
      {
        field: 'businessUnitCode',
        title: '事业部',
        ui: { type: UiType.select, options: this.businessUnitOption, ngModelChange: this.onBusinessUnitCodeChange }
      },
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOption }
      },
      {
        field: 'orderNum',
        title: '订单编号',
        ui: { type: UiType.text }
      },
      {
        field: 'startReqDate',
        title: '需求日期开始',
        ui: { type: UiType.date }
      },
      {
        field: 'endReqDate',
        title: '需求日期结束',
        ui: { type: UiType.date }
      },
    ],
    values: {
      businessUnitCode: this.appConfigService.getDefaultScheduleRegionCode(),
      plantCode: null,
      orderNum: '',
      startReqDate: null,
      endReqDate: null,
    }
  };
  columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      },
    },

    { field: 'businessUnitCode', headerName: '事业部', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'salesRegionDesc', headerName: '销售公司', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'salesArea', headerName: '销售区域', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'customerNumber', headerName: '客户', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'orderNum', headerName: '订单编号', width: 180, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'orderLine', headerName: '行号', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'orderType', headerName: '订单类型', width: 120, valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'itemCode', headerName: '产品编码', width: 130, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqDate', headerName: '需求日期', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqQty', headerName: '需求数量', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'plantCode', headerName: '分配组织', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'promiseQuantity', headerName: '满足数量', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'promiseDate', headerName: '最终满足日期', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'rtnMsg', headerName: '异常信息', width: 220, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  ];

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadBusinessUnitOption();
    this.loadPlantOption(this.appConfigService.getDefaultScheduleRegionCode());
    this.loadOrderTypeOption();
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      businessUnitCode: this.appConfigService.getDefaultScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      orderNum: '',
      startReqDate: null,
      endReqDate: null,
    };
  }

  commonQuery() {
    this.commonQueryService.loadGridView(
      { url: this.queryService.queryUrl, method: 'GET' },
      this.getQueryParams(),
      this.context
    );
  }

  getQueryParams() {
    return {
      businessUnitCode: this.queryParams.values.businessUnitCode,
      plantCode: this.queryParams.values.plantCode,
      orderNum: this.queryParams.values.orderNum,
      startReqDate: this.queryParams.values.startReqDate,
      endReqDate: this.queryParams.values.endReqDate,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  loadOrderTypeOption() {
    this.commonQueryService.GetLookupByType('PP_PLN_ORDER_TYPE').subscribe(res => {
      res.Extra.forEach(item => {
        this.orderTypeOption.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
  }

  loadBusinessUnitOption() {
    this.commonQueryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(item => {
        this.businessUnitOption.push({
          label: item.scheduleRegionCode,
          value: item.scheduleRegionCode
        });
      });
    });
  }

  loadPlantOption(businessUnitCode: string) {
    this.commonQueryService.GetUserPlant(businessUnitCode, '').subscribe(res => {
      this.plantOption.length = 0;
      res.Extra.forEach(item => {
        this.plantOption.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  onBusinessUnitCodeChange(val: string) {
    this.queryParams.values.plantCode = null;
    this.loadPlantOption(val);
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    if (optionsIndex === 1) {
      options = this.orderTypeOption;
    }
    console.log(options)
    let option = options.find(x => x.value === value);
    console.log(option)
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  add() {
    this.modal.static(OrderCommitmentEditComponent).subscribe(res => {
      if (res) {
        this.query();
        // this.gridData = [res, ...this.gridData];
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

  public calculationCap(item: any) {
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要重新计算？'),
      nzOnOk: () => {
        this.queryService
          .calculationCap(item)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('计算请求提交成功'));
              // this.query();
            } else {
              this.msgSrv.warning(this.appTranslationService.translate(res.msg));
            }

          });
      },
    });
  }

  public releaseCap(item: any) {
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要进行产能释放？'),
      nzOnOk: () => {
        this.queryService
          .releaseCap(item)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('产能释放请求提交成功'));
              // this.query();
            } else {
              this.msgSrv.warning(this.appTranslationService.translate(res.msg));
            }

          });
      },
    });
  }
}

