import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { BaseTranslstorService } from '../../../modules/generated_module/services/basetranslator-service';
import { TranslatorEditComponent } from './edit/edit.component';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import {TranslatorImportComponent} from './import/import.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'translator-ag',
  templateUrl: './translator-ag.component.html',
  providers: [QueryService]
})
export class TranslatorAgCodeComponent extends CustomBaseContext implements OnInit, MissingTranslationHandler {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  handle(params: MissingTranslationHandlerParams) {
    throw new Error('Method not implemented.');
  }

  public selectBy = 'id';
  public languageOptions: any[] = [];
  public applicationOptions: any[] = [];
  public queryParams = {
    defines: [
      { field: 'devLanguageRd', title: '原文', ui: { type: UiType.string } },
      { field: 'languageCode', title: '语言', ui: { type: UiType.select, options: this.languageOptions } }
    ],
    values: {
      devLanguageRd: '',
      languageCode: this.appConfigService.getLanguage()
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
      field: 'languageCode', headerName: '语言',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    },
    { field: 'devLanguageRd', headerName: '原文', tooltipField: 'devLanguageRd', menuTabs: ['filterMenuTab'] },
    { field: 'translatedText', headerName: '译文', tooltipField: 'translatedText', menuTabs: ['filterMenuTab'] }
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
    private TranslstorService: BaseTranslstorService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.loadOptions();
    this.clear();
    this.queryCommon();
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {
    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      if (this.allColumnIds.length < 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('pcbuyer');
  }

  private loadOptions() {

    this.commonQueryService.GetLookupByTypeRef('FND_LANGUAGE', this.languageOptions);
    /** 初始化 系统支持的语言类型 */
    // this.commonQueryService.GetLookupByType('FND_LANGUAGE').subscribe(result => {
    //   result.Extra.forEach(d => {
    //     this.languageOptions.push({
    //       label: d.MEANING,
    //       value: d.LOOKUP_CODE,
    //     });
    //   });
    // });
  }

  httpAction = { url: this.TranslstorService.GetLngMapping, method: 'GET' };
  public query() {
    super.query();
    // this.loadOptions();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  public add(item?: any) {
    this.modal
      .static(TranslatorEditComponent, {
        i: {
          id: (item !== undefined ? item.id : null),
          devLanguageId: (item !== undefined ? item.devLanguageId : null),
          languageCode: (item !== undefined ? item.languageCode : null),
          devLanguageRd: (item !== undefined ? item.devLanguageRd : null),
          translatedText: (item !== undefined ? item.translatedText : null),
          operationFlag: (item !== undefined ? 'N' : 'Y')// Y表示新增，N表示修改
        },
        CODEOptions: this.languageOptions,
        CurLng: this.appConfigService.getLanguage(),
      })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public remove(item: any) {
    this.TranslstorService.Remove(item.devLanguageId).subscribe(res => {
      if (res.code == 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  private getQueryParamsValue(): any {
    return {
      devLanguageRd: this.queryParams.values.devLanguageRd,
      languageCode: this.queryParams.values.languageCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  public getPageDataByTranslate(item?: any) {
    const requestDto = {
      pageData: localStorage.getItem('MyMissingTranslationHandlerKey'),
      lngCode: this.appConfigService.getLanguage()
    };
    this.TranslstorService.getPageDataByTranslate(requestDto).subscribe(res => {
      if (res.code == 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '收集完成'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  public RefreshLngJson(item?: any) {
    this.TranslstorService.RefreshLngJson().subscribe(res => {
      if (res.code == 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '生成数据完成'));
        // this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'languageCode', options: this.languageOptions }
  ];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.export({ url: this.commonQueryService.exportUrl, method: 'GET' }, this.queryParams.values, this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
  }

  public clear() {
    this.queryParams.values = {
      devLanguageRd: '',
      languageCode: this.appConfigService.getLanguage()
    };
  }
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
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

  /**
   * 导入多语言
   */
  public imports() {
    this.modal.static(TranslatorImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }
}
