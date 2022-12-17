import { Component, Injector, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CustomBaseContext, LookupItem } from 'app/modules/base_module/components/custom-base-context.component';
import { VersionQueryService } from '../queryService';
import { ProductSellBalanceForecastService } from '../../product-sell-balance-forecast.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopforecastversion-detail',
  templateUrl: './detail.component.html',
  providers: [VersionQueryService, ProductSellBalanceForecastService],
})
export class ProductSellBalanceSopForecastVersionDetailComponent extends CustomBaseContext implements OnInit {
  i: any;
  gridHeight = 300;
  dynamicField = 'd';
  selectBy = 'id';

  salesTypeOptions: any[] = []; // 内外销
  approveStatus: any[] = []; // 审批状态
  plantOptions: any[] = [];
  itemOptions: any[] = [];

  /**查询参数定义 */
  public queryParams = {
    defines: [
      {
        field: 'plantCode', title: '工厂', ui: {
          type: UiType.select, options: this.plantOptions,
          ngModelChange: this.loadItems
        }
      },
      { field: 'itemCode', title: '物料', ui: { type: UiType.select, options: this.itemOptions } },
      { field: 'demandDateRange', title: '需求日期', ui: { type: UiType.dateRange } },
    ],
    values: {
      versionCode: '',
      businessUnitCode: '',
      demandPeriod: '',
      plantCode: null,
      itemCode: null,
      demandDateRange: []
    }
  };

  fixColumns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: (param) => {
        return param.data.approveStatus === '已审批';
      }, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'businessUnitCode', headerName: '事业部', pinned: 'left', lockPinned: true, width: 80 },
    { field: 'plantCode', headerName: '工厂', pinned: 'left', lockPinned: true, width: 80 },
    {
      field: 'salesType',
      headerName: '内外销', pinned: 'left', lockPinned: true,
      valueFormatter: 'ctx.optionsFind(value,1).label', width: 80
    },
    { field: 'demandDate', headerName: '需求日期', pinned: 'left', lockPinned: true, width: 120 },
    { field: 'itemCode', headerName: '物料编码', pinned: 'left', lockPinned: true, width: 100 },
    { field: 'xsyc', headerName: '销售预测', pinned: 'left', lockPinned: true, width: 100 },
    { field: 'scjh', headerName: '生产计划', pinned: 'left', lockPinned: true, width: 100 },
    { field: 'qmkc', headerName: '期末库存', pinned: 'left', lockPinned: true, width: 100 },
    { field: 'salesCatgoryBig', headerName: '产品大类', width: 100 },
    { field: 'salesCatgorySub', headerName: '产品小类', width: 100 },
    { field: 'descriptionsCn', headerName: '物料描述', width: 120 },
    { field: 'isNew', headerName: '是否新品', valueFormatter: 'ctx.isNewFormatter(data)', width: 100 },
    { field: 'newProductCode', headerName: '新品编码', width: 100 },
    { field: 'newProductName', headerName: '新品描述', width: 120 },
    { field: 'price', headerName: '单价', width: 80 },
    { field: 'avgSales', headerName: '月均分销量', width: 120 },
    { field: 'noShipmentAndUnmet', headerName: '未发订单', width: 100 },
    { field: 'onhand', headerName: '当前库存', width: 100 },
    { field: 'approveStatus', headerName: '审批状态', width: 100, valueFormatter: 'ctx.optionsFind(value,2).label' },
  ];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    public innerService: ProductSellBalanceForecastService,
    private queryService: VersionQueryService,
    private appConfigService: AppConfigService,
    private confirmationService: NzModalService,
    private injector: Injector) {
    super({ pro: null, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService, injector });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    // 加载工厂
    this.queryService.GetVersionPlant(this.i.versionCode, this.i.businessUnitCode, '').subscribe(res => {
      this.plantOptions.length = 0;
      if (res != null && res.data != null) {
        res.data.forEach(element => {
          console.log(element);
          this.plantOptions.push({ value: element, label: element });
        });
      }
    });

    this.loadItems('');

    // 内外销
    this.innerService.GetLookupByType('SOP_SALES_TYPE').subscribe(res => {
      res.Extra.forEach(item => {
        this.salesTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });

    /** 审批状态 */
    this.innerService.GetLookupByType('FND_APPROVE_STATUS').subscribe(res => {
      res.Extra.forEach(item => {
        this.approveStatus.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });

    this.queryCommon();
  }

  // 加载物料
  loadItems(value) {
    this.queryService.GetVersionItem(this.i.versionCode, this.i.businessUnitCode, value).subscribe(res => {
      if (res != null && res.data != null) {
        this.itemOptions.length = 0;
        res.data.forEach(element => {
          this.itemOptions.push({ value: element, label: element });
        });
      }
    });
  }

  public query() {
    super.query(); // grid初始化
    this.queryCommon();
  }

  dynamicColumns = [];
  private queryCommon() {
    this.setLoading(true);
    this.queryService.QueryDetail(this.GetqueryParams()).subscribe(res => {
      if (res.data !== null && res.data.length !== undefined) {
        res.data[0].headerCellList.forEach((el, index) => {
          this.dynamicColumns.push({ field: this.dynamicField + index, headerName: el, editable: true, width: 60 });
        });
      }
      this.columns = [...this.fixColumns, ...this.dynamicColumns];
      setTimeout(() => {
        this.gridData = res.data;
      });
      this.setLoading(false);
    });
  }
  private GetqueryParams(): any {
    const dto = this.clone(this.queryParams.values);
    dto.versionCode = this.i.versionCode;
    dto.businessUnitCode = this.i.businessUnitCode;
    dto.demandPeriod = this.i.demandPeriod;
    const dateRange = this.queryParams.values.demandDateRange;
    dto.demandDateStart = dateRange.length > 0 ? this.queryService.formatDate(dateRange[0]) : '';
    dto.demandDateEnd = dateRange.length > 0 ? this.queryService.formatDate(dateRange[1]) : '';
    return dto;
  }

  close() {
    this.modal.destroy();
  }

  // 下达
  send() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要下达的记录！'));
      return;
    }
    const dtos = [];
    let invalid = false;
    this.gridApi.getSelectedRows().forEach(el => {
      let allEmpty = true;
      const dto = {
        plantCode: el.plantCode,
        number: 0,
        businessUnitCode: el.businessUnitCode,
        versionCode: el.versionCode,
        demandPeriod: el.demandPeriod,
        itemCode: el.itemCode,
        id: el[this.selectBy],
        dicValue: []
      };
      dtos.push(dto);
      for (let i = 0; i < this.dynamicColumns.length; i++) {
        if (!this.isNull(el[this.dynamicField + i])) {
          allEmpty = false;
          dto.dicValue.push({ key: i, value: el[this.dynamicField + i] });
        }
      }
      if (allEmpty) {
        invalid = true;
      }
    });
    if (invalid) {
      this.msgSrv.warning(this.appTranslationService.translate('选中记录的栏位【' + this.dynamicField + '】不能全为空！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要提交下达吗？'),
      nzOnOk: () => {
        this.queryService.SendDetail(dtos).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('下达成功'));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesTypeOptions;
        break;
      case 2:
        options = this.approveStatus;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }


  /**
 * 是否新品列格式化
 */
  public isNewFormatter(data) {
    if (data.newProductCode !== undefined && data.newProductCode != null && data.newProductCode !== '') {
      return this.appTranslationService.translate('是');
    }
    return this.appTranslationService.translate('否');
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
}
