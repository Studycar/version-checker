import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { NzMessageService } from 'ng-zorro-antd';
import { RequestSetsService } from 'app/modules/generated_module/services/request-sets-service';
import { ConcurrentRequestRequestSetsEditComponent } from './edit/edit.component';
import { LinkStageComponent } from './link-stage/link-stage.component';
import { DefineStageComponent } from './define-stage/define-stage.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-request-sets',
  templateUrl: './request-sets.component.html',
})
export class ConcurrentRequestRequestSetsComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  context = this;
  requestSetsList: any = [];
  enableflags: any = [];
  public gridView: GridDataResult = {
    data: [],
    total: 0,
  };

  public columns22 = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: { template: this.headerTemplate },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      }
    },
    { field: 'requestSetName', headerName: '请求集代码', menuTabs: ['filterMenuTab'] },
    { field: 'userRequestSetName', headerName: '请求集名称', tooltipField: 'userRequestSetName', menuTabs: ['filterMenuTab'] },
    { field: 'applicationName', headerName: '应用模块', tooltipField: 'applicationName', menuTabs: ['filterMenuTab'] },
    { field: 'enabledFlag', headerName: '启用', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'description', headerName: '说明', tooltipField: 'description', menuTabs: ['filterMenuTab'] }
  ];

  public queryParams = {
    defines: [
      { field: 'requestSetId', title: '请求集名称', ui: { type: UiType.select, options: this.requestSetsList } }
    ],
    values: { requestSetId: null }
  };

  httpAction = { url: '/api/admin/baseRequestSets/queryRequestSets', method: 'GET' };

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    msgSrv: NzMessageService,
    apptranslate: AppTranslationService,
    private requestSetsService: RequestSetsService,
    private commonQueryService: CommonQueryService) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns22);
  }

  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;

    /** 初始化 是否有效  下拉框*/
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      this.enableflags.length = 0;
      result.Extra.forEach(d => {
        this.enableflags.push({
          label: d.meaning,
          value: d.lookupCode
        });
      });
    });

    this.requestSetsService.GetRequestSets().subscribe(result => {
      result.data.forEach(d => {
        this.requestSetsList.push({
          label: d.userRequestSetName,
          value: d.requestSetId,
        });
      });
    });

    this.query();
  }

  query() {
    super.query();

    this.queryCommon();
  }

  clear() {
    this.queryParams.values.requestSetId = null;
  }

  queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(false), this.context);
  }

  private getQueryParamsValue(isExport: any): any {
    return {
      requestSetId: this.queryParams.values.requestSetId,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      isExport: isExport
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

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  
  expColumns = this.columns22;
  expColumnsOptions: any[] = [{ field: 'enabledFlag', options: this.enableflags }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.export(this.httpAction, this.getQueryParamsValue(true), this.excelexport, this.context);
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.enableflags;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  add() {
    const param = {
      operType: '新增',
      i: { requestSetId: 0 },
      IsRefresh: false
    };
    this.modal.static(ConcurrentRequestRequestSetsEditComponent, { param: param }).subscribe(() => {
      if (param.IsRefresh) {
        this.queryCommon();
      }
    });
  }

  edit(record: any) {
    const param = {
      operType: '编辑',
      i: record,
      IsRefresh: false,
    };
    this.modal.static(ConcurrentRequestRequestSetsEditComponent, { param: param }).subscribe(() => {
      if (param.IsRefresh) {
        this.queryCommon();
      }
    });
  }

  defineStage(record: any) {
    this.modal.static(DefineStageComponent, { i: record }).subscribe();
  }

  linkStage(record: any) {
    this.modal.static(LinkStageComponent, { i: record }).subscribe();
  }

}
