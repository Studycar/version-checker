import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { BaseMessageEditComponent } from './edit/edit.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-message-ag',
  templateUrl: './message-ag.component.html',
  providers: [QueryService]
})
export class BaseMessageAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'messageId';
  public languageOptions: any[] = [];
  public applicationOptions: any[] = [];
  public queryParams = {
    defines: [
      { field: 'strMessageCode', title: '消息代码', ui: { type: UiType.string } },
      { field: 'strMessageText', title: '消息', ui: { type: UiType.string } },
      { field: 'strDescription', title: '描述', ui: { type: UiType.string } },
      { field: 'strLanguage', title: '语言', ui: { type: UiType.select, options: this.languageOptions } }
    ],
    values: {
      strMessageCode: '',
      strMessageText: '',
      strDescription: '',
      strLanguage: this.appConfigService.getLanguage()
    }
  };
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'messageCode', headerName: '消息代码', menuTabs: ['filterMenuTab'] },
    {
      field: 'messageText', headerName: '消息', tooltipField: 'messageText', menuTabs: ['filterMenuTab']
    },
    {
      field: 'applicationCode', headerName: '应用模块',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
    { field: 'description', headerName: '描述', tooltipField: 'description', menuTabs: ['filterMenuTab'] },
    {
      field: 'language', headerName: '语言',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    }
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationOptions;
        break;
      case 2:
        options = this.languageOptions;
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
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private messageManageService: MessageManageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.commonQueryService.GetLookupByType('FND_LANGUAGE').subscribe(result => {
      result.Extra.forEach(d => {
        this.languageOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    this.loadOptions();
    this.clear();
    this.queryCommon();
  }

  private loadOptions() {
    this.messageManageService.GetAppliaction(this.queryParams.values.strLanguage).subscribe(result => {
      this.applicationOptions.length = 0;
      result.data.forEach(d => {
        this.applicationOptions.push({
          label: d.applicationName,
          value: d.applicationCode,
        });
      });
    });
  }
  httpAction = { url: this.messageManageService.queryUrl, method: 'GET' };
  public query() {
    super.query();
    // this.loadOptions();
    this.queryCommon();
  }
  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParams(false), this.context);
  }

  getQueryParams(isExport: boolean): any {
    return {
      messageCode: this.queryParams.values.strMessageCode,
      messageText: this.queryParams.values.strMessageText,
      description: this.queryParams.values.strDescription,
      language: this.queryParams.values.strLanguage,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      export: isExport
    };
  }

  public add(item?: any) {
    this.modal
      .static(BaseMessageEditComponent, { i: { messageId: (item !== undefined ? item.messageId : null), language: (item !== undefined ? item.language : null) } })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public remove(item: any) {
    this.messageManageService.Remove(item.messageId).subscribe(res => {
      if (res.code === 200) { //  if (res.Success) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  public removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.messageManageService
          .removeBatch(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) { // if (res.Success) {
              this.msgSrv.success(this.appTranslationService.translate('删除成功'));
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
      },
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'applicationCode', options: this.applicationOptions }, { field: 'language', options: this.languageOptions }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    // this.loadOptions();
    super.export();
    this.commonQueryService.exportAction(this.httpAction, this.getQueryParams(true), this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
  }

  public clear() {
    this.queryParams.values = {
      strMessageCode: '',
      strMessageText: '',
      strDescription: '',
      strLanguage: this.appConfigService.getLanguage()
    };
  }
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // 页码切换
  // onPageChanged({ pageNo, pageSize }) {
  //   this.gridApi.paginationSetPageSize(pageSize);
  //   this.gridApi.paginationGoToPage(pageNo - 1);
  //   this.setLoading(false);
  // }

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
      this.query();
    } else {
      this.setLoading(false);
    }
  }
}
