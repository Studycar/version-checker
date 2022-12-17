import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonQueryService } from "app/modules/generated_module/services/common-query.service";
import { NzMessageService } from "ng-zorro-antd";
import { OrderProgressWarningConfigEditComponent } from "./edit/edit.component";
import { QueryService } from "./query.service";
import { OrderProgressWarningConfigDetailComponent } from "./warning-object-detail/detail.component";

@Component({
  selector: 'order-progress-warning-config',
  templateUrl: './order-progress-warning-config.component.html',
  providers: [QueryService]
})
export class OrderProgressWarningConfigComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    { field: 'businessUnit', headerName: '事业部' },
    { field: 'warnDimension', headerName: '预警维度',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    { field: 'warnProjectDesc', headerName: '预警项',
      // valueFormatter: (params) => {
      //   return this.warnOptionsFind(params, 'warnProject').label;
      // }
    },
    { field: 'warnConditionDesc', headerName: '预警条件' },
    { field: 'warnDeviation', headerName: '预警偏差' },
    { field: 'warnObjectDesc', headerName: '预警对象' },
    { field: 'warnContent', headerName: '预警内容' },
    { field: 'warnUpgradeDays', headerName: '升级条件' },
    { field: 'createdBy', headerName: '创建人' },
    { field: 'creationDate', headerName: '创建时间' },
    { field: 'lastUpdatedBy', headerName: '更新人' },
    { field: 'lastUpdateDate', headerName: '更新时间' },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.warnDimensionOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  public warnOptionsFind(params, type) {
    const arr = this.warnDimensionOptions.find(x => x.value === params.data.warnDimension);
    const value = params.value;
    let option = { value: value, label: value };
    if(!this.isNull(arr)) {
      const options = arr[type];
      let option = options.find(x => x.value === value);
      if (this.isNull(option)) {
        option = { value: value, label: value };
      }
    }
    return option;
  }

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryService: QueryService,
    private modal: ModalHelper,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();
    if(this.buCodeOptions.length) {
      this.queryParams.values.businessUnitCode = this.buCodeOptions[0].value;
    }
    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    const params = this.getQueryParams();
    this.queryService.loadGridViewNew(
      this.httpAction,
      params,
      this.context
    )
  }
  buCodeOptions: any[] = [];
  warnDimensionOptions: any[] = [];

  queryParams = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.buCodeOptions, }, required: true },
      { field: 'warnDimension', title: '预警维度', ui: { type: UiType.select, options: this.warnDimensionOptions, }, },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      warnDimension: null,
    }
  };

  // 加载搜索项
  loadOptions() {
    this.getWarnDimensions();
    this.getBuCodeOptions();
  }

  // 获取事业部列表
  getBuCodeOptions() {
    this.buCodeOptions.length = 0;
    this.queryService.getScheduleRegion().subscribe(res => {
      res.data.forEach(d => {
        this.buCodeOptions.push({
          label: d.descriptions,
          value: d.scheduleRegionCode
        })
      });
    });
  }

  getWarnDimensions() {
    this.warnDimensionOptions.length = 0;
    this.queryService.GetLookupByTypeRef('SOP_WARN_DIMENSION', this.warnDimensionOptions);
  }

  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if (isExport) {
      params.isExport = true;
    } else {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    console.log('getQueryParams', params);
    return params;
  }

  add(dataItem?: any) {
    this.modal.static(
      OrderProgressWarningConfigEditComponent,
      {i: dataItem === undefined ? { id:null } : Object.assign({}, dataItem)}
    ).subscribe(value => {
      if(value) {
        this.query();
      }
    })
  }

  detail(dataItem) {
    console.log(dataItem);
    this.modal.static(
      OrderProgressWarningConfigDetailComponent,
      { configId: dataItem.id }
    ).subscribe(() => {});
  }

  delete(dataItem) {
    this.queryService.delete(dataItem.id).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate("删除成功"));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  clear() {
    super.clear();
    this.queryParams.values.businessUnitCode = null;
    this.queryParams.values.warnDimension = null;
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
}
