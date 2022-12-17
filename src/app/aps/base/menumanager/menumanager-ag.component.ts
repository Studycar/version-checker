import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BaseMenumanagerEditComponent } from './edit/edit.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { MenuQueryService } from './query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { BaseChildmenuallocateAgComponent } from '../childmenuallocate/childmenuallocate-ag.component';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import {BaseMenuImportComponent} from './import/import.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-menumanager-ag',
  templateUrl: './menumanager-ag.component.html',
  providers: [MenuQueryService]
})
export class BaseMenumanagerAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: MenuQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();
    this.queryCommon();
  }

  public selectBy = 'menuId';
  public applicationOptions: any[] = [];
  public languageOptions: any[] = [];
  public menuTypeOptions: any[] = [];
  public windowTypeOptions: any[] = [];
  public queryParams = {
    defines: [
      { field: 'menuName', title: '菜单名称', ui: { type: UiType.string } },
      { field: 'menuCode', title: '菜单编码', ui: { type: UiType.string } },
      { field: 'description', title: '描述', ui: { type: UiType.string } },
      { field: 'language', title: '语言', ui: { type: UiType.select, options: this.languageOptions } },
      { field: 'menuType', title: '菜单类型', ui: { type: UiType.select, options: this.menuTypeOptions } }
    ],
    values: {
      menuName: '',
      menuCode: '',
      description: '',
      language: this.appConfigService.getLanguage(),
      menuType: null
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
    { field: 'menuName', headerName: '菜单名称', pinned: 'left', menuTabs: ['filterMenuTab'] },
    {
      field: 'applicationId', headerName: '应用模块',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'language', headerName: '语言',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    },
    { field: 'functionName', headerName: '功能', menuTabs: ['filterMenuTab'] },
    { field: 'description', headerName: '描述', menuTabs: ['filterMenuTab'] },
    { field: 'menuCode', headerName: '菜单编码', menuTabs: ['filterMenuTab'] },
    {
      field: 'menuType', headerName: '菜单类型',
      valueFormatter: 'ctx.optionsFind(value,3).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'windowType', headerName: '窗口类型',
      valueFormatter: 'ctx.optionsFind(value,4).label', menuTabs: ['filterMenuTab']
    },
    { field: 'attribute1', headerName: '图片', menuTabs: ['filterMenuTab'] },
    { field: 'startDate', headerName: '生效日期', menuTabs: ['filterMenuTab'] },
    { field: 'endDate', headerName: '失效日期', menuTabs: ['filterMenuTab'] },
    { field: 'menuSequence', headerName: '菜单顺序', menuTabs: ['filterMenuTab'] },
    { field: 'parameters', headerName: '系统参数', menuTabs: ['filterMenuTab'] }
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
      case 3:
        options = this.menuTypeOptions;
        break;
      case 4:
        options = this.windowTypeOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  public query() {
    super.query();
    this.queryCommon();
  }
  public queryCommon() {
    this.queryService.loadGridViewNew(this.httpAction, this.getParamsValues(), this.context);
  }

  public add(item?: any) {
    this.modal
      .static(BaseMenumanagerEditComponent, { i: (item !== undefined ? item : { menuId: null, language: this.appConfigService.getLanguage() }) })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public setting(item: any) {
    this.modal
      .static(BaseChildmenuallocateAgComponent, { p: { menuId: item.menuId, language: item.language, menuName: item.menuName, attribute2: item.attribute2, menuTypeName: this.optionsFind(item.menuType, 3).label } })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'applicationId', options: this.applicationOptions },
    { field: 'language', options: this.languageOptions },
    { field: 'menuType', options: this.menuTypeOptions },
    { field: 'windowType', options: this.windowTypeOptions }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    // this.queryService.export(this.httpAction, this.getParamsValues(), this.excelexport, this.context);
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }

  public clear() {
    this.queryParams.values = {
      menuName: '',
      menuCode: '',
      description: '',
      language: this.appConfigService.getLanguage(),
      menuType: null
    };
  }
  private getParamsValues(): any {
    const dto = this.clone(this.queryParams.values);
    if (this.isNull(dto.menuType)) {
      dto.menuType = '';
    }
    return dto;
  }
  private loadOptions() {
    this.queryService.GetLookupByTypeRef('FND_LANGUAGE', this.languageOptions);
    this.queryService.GetLookupByTypeRef('FND_MENU_TYPE', this.menuTypeOptions);
    this.queryService.GetLookupByTypeRef('FND_WINDOW_TYPE', this.windowTypeOptions);
    this.queryService.GetApplicationNew().subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationOptions.push({
          label: d.applicationName,
          value: d.id,
        });
      });
    });
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
   * 导入菜单
   */
  public imports() {
    this.modal.static(BaseMenuImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }

}
