import { OnInit, ViewChild, TemplateRef, Component } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { WaningObjectQueryService } from "./query.service";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonQueryService } from "app/modules/generated_module/services/common-query.service";
import { NzMessageService, NzModalRef } from "ng-zorro-antd";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { OrderProgressWarningConfigDetailEditComponent } from "./edit/edit.component";

@Component({
  selector: 'order-progress-warning-config-detail',
  templateUrl: './detail.component.html',
  providers: [WaningObjectQueryService]
})
export class OrderProgressWarningConfigDetailComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  configId: string;

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
    { field: 'warnLevel', headerName: '预警层级', valueFormatter: 'ctx.optionsFind(value,1).label'},
    { field: 'userName', headerName: '用户名' },
    { field: 'userDesc', headerName: '用户说明' },
    { field: 'msgAccount', headerName: '邮件地址' },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.warnLevelOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  userNameOptions: any[] = [];
  warnLevelOptions: any[] = [];

  queryParams = {
    defines: [
      { field: 'warnLevel', title: '预警层级', ui: { type: UiType.select, options: this.warnLevelOptions, eventNo: 1, }, },
      { field: 'userName', title: '用户名', ui: { type: UiType.select, options: this.userNameOptions, eventNo: 2, }, },
    ],
    values: {
      configId: '',
      userName: null,
      warnLevel: null,
    }
  };
  
  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryService: WaningObjectQueryService,
    private modal: ModalHelper,
    private modalRef: NzModalRef,
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
    this.queryParams.values.configId = this.configId;
    this.loadOptions();
    this.query();
  }

  loadOptions() {
    this.loadWarnLevel();
    this.loadUser();
  }

  loadWarnLevel() {
    this.queryService.GetLookupByTypeRef('SOP_WARN_LEVEL', this.warnLevelOptions);
  }

  loadUser() {
    this.queryService.GetUserInfos().subscribe(res => {
      res.data.forEach(d => {
        this.userNameOptions.push({
          label: d.description,
          value: d.userName,
        })
      })
    })
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

  getQueryParams() {
    return {
      configId: this.queryParams.values.configId || '',
      userName: this.queryParams.values.userName || '',
      warnLevel: this.queryParams.values.warnLevel || '',
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  add(dataItem?: any) {
    this.modal.static(
      OrderProgressWarningConfigDetailEditComponent,
      { i: dataItem === undefined ? {id:null,configId:this.configId} : Object.assign({}, dataItem) }
    ).subscribe(value => {
      if(value) {
        this.query();
      }
    })
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
    this.queryParams.values.userName = null;
    this.queryParams.values.warnLevel = null;
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