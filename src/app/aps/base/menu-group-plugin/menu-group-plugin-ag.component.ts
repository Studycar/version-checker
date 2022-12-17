import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { BaseMenuGroupPluginEditService } from './edit.service';
import { BaseMenuGroupPluginEditComponent } from './edit/edit.component';
import { BaseMenuGroupPluginChildComponent } from '../menu-group-plugin-child/menu-group-plugin-child.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import {BaseMenuGroupImportComponent} from './import/import.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-menu-group-plugin-ag',
  templateUrl: './menu-group-plugin-ag.component.html',
  providers: [BaseMenuGroupPluginEditService],
})
export class BaseMenuGroupPluginAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public applicationLanguage: any[] = [];
  public applicationOptions: any[] = [];
  public queryParams = {
    defines: [
      { field: 'code', title: '菜单组编码', ui: { type: UiType.string } },
      { field: 'name', title: '菜单组名称', ui: { type: UiType.string } },
      { field: 'appName', title: '应用模块', ui: { type: UiType.select, options: this.applicationOptions } },
      { field: 'language', title: '语言', ui: { type: UiType.select, options: this.applicationLanguage } },
      { field: 'StartRange', title: '生效日期范围', ui: { type: UiType.dateRange } },
      { field: 'EndRange', title: '失效日期范围', ui: { type: UiType.dateRange } }
    ],
    values: {
      code: '',
      name: '',
      appName: null,
      language: null,
      StartRange: [],
      EndRange: [],
      startBegin: '',
      startEnd: '',
      endBegin: '',
      endEnd: ''
    }
  };

  // 获取查询参数值
  private getQueryParamsValue(): any {
    return {
      code: this.queryParams.values.code,
      name: this.queryParams.values.name,
      appName: this.queryParams.values.appName,
      language: this.queryParams.values.language,
      startBegin: this.queryParams.values.StartRange.length > 0 ? this.commonQueryService.formatDate(this.queryParams.values.StartRange[0]) : '',
      startEnd: this.queryParams.values.StartRange.length > 0 ? this.commonQueryService.formatDate(this.queryParams.values.StartRange[1]) : '',
      endBegin: this.queryParams.values.EndRange.length > 0 ? this.commonQueryService.formatDate(this.queryParams.values.EndRange[0]) : '',
      endEnd: this.queryParams.values.EndRange.length > 0 ? this.commonQueryService.formatDate(this.queryParams.values.EndRange[1]) : ''
    };
  }

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
    // {
    //   colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
    //   checkboxSelection: false, headerCheckboxSelection: false, headerCheckboxSelectionFilteredOnly: false,
    //   headerComponentParams: {
    //     template: this.headerTemplate
    //   }
    // },
    { field: 'menuGroupCode', headerName: '菜单组编码', tooltipField: 'menuGroupCode', menuTabs: ['filterMenuTab'] },
    {
      field: 'menuGroupName', headerName: '菜单组名称', tooltipField: 'menuGroupName', menuTabs: ['filterMenuTab']
    },
    {
      field: 'applicationName', headerName: '应用模块',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },

    {
      field: 'language', headerName: '语言',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    },
    { field: 'startDate', headerName: '生效日期', menuTabs: ['filterMenuTab'] },
    { field: 'endDate', headerName: '失效日期', menuTabs: ['filterMenuTab'] }
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationOptions;
        break;
      case 2:
        options = this.applicationLanguage;
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
    public editService: BaseMenuGroupPluginEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadMoreLanguage();
    this.loadMoreAppName();
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

  // 绑定语言
  public loadMoreLanguage(): void {
    // this.commonQueryService.GetArrayLookupByType('SYS_LANGUAGE').forEach(d => {
    //  this.applicationLanguage.push(d);
    // });
    // this.applicationLanguage = this.commonQueryService.GetArrayLookupByType('SYS_LANGUAGE');
    // this.commonQueryService.GetLookupByType('FND_LANGUAGE').subscribe(result => {
    //   result.Extra.forEach(d => {
    //     this.applicationLanguage.push({
    //       label: d.MEANING,
    //       value: d.LOOKUP_CODE,
    //     });
    //   });
    // });

    this.commonQueryService.GetLookupByTypeRef('FND_LANGUAGE', this.applicationLanguage);
  }

  isLoading = false;
  // 绑定页面应用程序下拉框AppName
  public loadMoreAppName(): void {
    this.isLoading = true;
    this.commonQueryService.GetApplication().subscribe(result => {
      result.data.forEach(d => {
        this.applicationOptions.push({
          label: d.applicationName,
          value: d.id,
        });
      });
    });
  }

  httpAction = { url: this.editService.seachUrl, method: 'POST' };

  public query() {
    super.query();
    this.loadMoreAppName();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  public add(item: any) {
    this.modal
      .static(BaseMenuGroupPluginEditComponent, {
        i: { id: (item !== undefined ? item.id : null), language: (item !== undefined ? item.language : null) },
      }, 'lg'
      )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    this.editService.Remove(item).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  // 弹出明细 菜单分配窗口
  public detailHandler(item: any) {
    this.modal
      .static(BaseMenuGroupPluginChildComponent, {
        p: {
          id: item.id,  // 菜单组ID
          code: item.menuGroupCode,
          name: item.menuGroupName,
          appName: item.applicationId,
          language: item.language,
        }
      }, 'lg')
      .subscribe(() => {
        console.log('');
      });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'applicationName', options: this.applicationOptions }, { field: 'language', options: this.applicationLanguage }];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {

    super.export();
    this.commonQueryService.export({ url: this.editService.seachUrl, method: 'POST' }, this.getQueryParamsValue(), this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
  }

  public clear() {
    this.queryParams.values = {
      code: '',
      name: '',
      appName: null,
      language: this.appConfigService.getLanguage(),
      StartRange: [],
      EndRange: [],
      startBegin: '',
      startEnd: '',
      endBegin: '',
      endEnd: ''
    };
  }
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  /**
   * 导入菜单组
   */
  public imports() {
    this.modal.static(BaseMenuGroupImportComponent, {}, 'md').subscribe(value => {
         this.query();
    });
  }
}
