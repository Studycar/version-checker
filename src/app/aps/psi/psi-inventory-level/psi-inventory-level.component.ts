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
import { PsiInventoryLevelEditComponent } from "./edit/edit.component";
import { QueryService } from "./query.service";

@Component({
  selector: 'psi-inventory-level',
  templateUrl: './psi-inventory-level.component.html',
  providers: [QueryService]
})
export class PsiInventoryLevelComponent extends CustomBaseContext implements OnInit {
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
    {
      field: 'type',
      headerName: '类型',
      valueFormatter: 'ctx.optionsFind(value, 1).label'
    },
    { field: 'typeValue', headerName: '类型值', },
    { field: 'descriptions', headerName: '类型值描述',  },
    { field: 'thresholdValue', headerName: '库存阈值' },
    { field: 'creationDate', headerName: '创建时间' },
    { field: 'lastUpdateDate', headerName: '更新时间', }
  ]
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch(optionsIndex) {
      case 1:
        options = this.typeList;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
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
    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    const params = this.getQueryParams();
    this.httpAction.url = this.queryService.queryUrl + '?pageNum=' + this._pageNo + '&pageSize=' + this._pageSize;
    this.queryService.loadGridViewNew(
      this.httpAction,
      params,
      this.context,
      this.dataPreFilter,
    );
  }

  dataPreFilter = (res) => {
    res.data = res.data.records;
    return res;
  }

  buCodeOptions: any[] = [];
  plantOptions: any[] = [];
  baseList: any[] = [];
  typeList = [{ value: 'PLANT', label: '工厂' }, { value: 'BASE', label: '基地' }];

  queryParams = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.buCodeOptions, eventNo: 1, }, required: true, },
      { field: 'type', title: '类型', ui: { type: UiType.select, options: this.typeList, eventNo: 2,}, },
      { field: 'typeValue', title: '类型值', ui: { type: UiType.select, options: [] }, },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      type: '',
      typeValue: '',
    }
  };

  // 加载搜索项
  loadOptions() {
    this.getBuCodeOptions();
    this.getOrganizationOptions();
    this.getBase();
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

  buCodeOptionsChange(value) {
    this.queryParams.values.typeValue = null;
    this.getOrganizationOptions();
    this.getBase();
  }

  getOrganizationOptions() {
    const params = this.getQueryParams();
    this.plantOptions.length = 0;
    this.queryService.getPlant(params).subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.descriptions,
          value: d.plantCode,
        })
      })
    })
  }

  getBase() {
    this.baseList.length = 0;
    this.queryService.getBase({
      businessUnitCode: this.queryParams.values.businessUnitCode
    }).subscribe(res => {
      res.data.forEach(d => {
        this.baseList.push({
          label: d.plantCode,
          value: d.plantCode,
        })
      })
    })
  }

  typeChange(event: any) {
    this.queryParams.values.typeValue = null;
    const type = this.queryParams.values.type;
    this.queryParams.defines.forEach(param => {
      if(param.field === 'typeValue') {
        // 切换工厂对应得类型值
        if(type === 'PLANT') {
          param.ui.options = this.plantOptions;
        } else {
          param.ui.options = this.baseList;
        }
      }
    })
  }

  // initQueryParams() {
  //   if(this.buCodeOptions.length) {
  //     this.queryParams.values.businessUnitCode = this.buCodeOptions[0].value;
  //   }
  //   this.queryParams.values.type = 'PLANT';
  //   this.typeValueOptions = this.plantOptions;
  //   if(this.typeValueOptions.length) {
  //     this.queryParams.values.typeValue = this.typeValueOptions[0].value;
  //   }
  // }

  getQueryParams(isExport: boolean = false): any {
    const params: any = {
      businessUnitCode: this.queryParams.values.businessUnitCode || '',
      type: this.queryParams.values.type || '',
      typeValue: this.queryParams.values.typeValue,
      // isExport: isExport,
    }
    if (!isExport) {
      // params.pageIndex = this._pageNo;
      // params.pageSize = this._pageSize;
    }
    console.log('getQueryParams', params);
    return params;
  }

  add(dataItem?: any) {
    this.modal.static(
      PsiInventoryLevelEditComponent,
      {i: dataItem === undefined ? { id:null } : Object.assign({}, dataItem)}
    ).subscribe(value => {
      if(value) {
        this.query();
      }
    })
  }

  delete(dataItem) {
    this.queryService.delete(dataItem.id).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      }else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  clear() {
    super.clear();
    this.queryParams.values.type = null;
    this.queryParams.values.typeValue = null;
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
