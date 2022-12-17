import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { FunctionmanagerService } from '../../../modules/generated_module/services/functionmanager-service';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { BaseFunctionmanagerEditComponent } from './edit/edit.component';
import { ProLineGroupMaintainService } from '../../../modules/generated_module/services/prolinegroupmaintain-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { PlantMaintainService } from '../../../modules/generated_module/services/plantmaintain-service';
import { QueryService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { BaseFunctionmanagerDetailComponent } from './detail/detail.component';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-functionmanager-ag',
  templateUrl: './functionmanager.ag.component.html',
  providers: [QueryService],
})
export class BaseFunctionmanagerAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  languages: any[] = [];
  enabledflags: any[] = [];
  applications: any[] = [];
  functiontypes: any[] = [];
  public queryParams = {
    defines: [
      { field: 'functionName', title: '功能名称', ui: { type: UiType.text } },
      { field: 'functionCode', title: '功能代码', ui: { type: UiType.text } },
      { field: 'functionPath', title: '功能路径', ui: { type: UiType.text } },
      { field: 'description', title: '描述', ui: { type: UiType.text } }
    ],
    values: {
      functionName: '',
      functionCode: '',
      functionPath: '',
      description: ''
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 90, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    { field: 'functionName', headerName: '功能名称', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'functionCode', headerName: '功能代码', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    {
      field: 'applicationCode', width: 120, headerName: '应用模块',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
    { field: 'functionPath', headerName: '功能路径', width: 120, locked: false, menuTabs: ['filterMenuTab'] },
    {
      field: 'functionType', headerName: '功能类型', width: 120,
      valueFormatter: 'ctx.optionsFind(value,4).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'enabledFlag', width: 120, headerName: '有效',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'description', headerName: '描述', width: 160, locked: false, menuTabs: ['filterMenuTab']
    },
    {
      field: 'language', width: 120, headerName: '语言',
      valueFormatter: 'ctx.optionsFind(value,3).label', menuTabs: ['filterMenuTab']
    },
    { field: 'attribute1', headerName: '引用', width: 120, locked: false, menuTabs: ['filterMenuTab'] },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applications;
        break;
      case 2:
        options = this.enabledflags;
        break;
      case 3:
        options = this.languages;
        break;
      case 4:
        options = this.functiontypes;
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
    public http: _HttpClient,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public functionmanagerService: FunctionmanagerService,
    // public messageManageService: MessageManageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public prolinegroupmaintainService: ProLineGroupMaintainService,
    private plantmaintainService: PlantMaintainService,
    public commonQueryService: QueryService,
    private commonqueryService: CommonQueryService,
    private appconfig: AppConfigService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  httpAction = { url: this.functionmanagerService.seachUrl, method: 'POST' };
  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'applicationCode', options: this.applications },
    { field: 'enabledFlag', options: this.enabledflags },
    { field: 'language', options: this.languages },
    { field: 'functionType', options: this.functiontypes }
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.loadOptions();
    super.export();
    // this.commonQueryService.exportAction({ url: this.functionmanagerService.exportUrl, method: 'POST' }, this.queryParams.values, this.excelexport, this.context);
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }
  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.loadOptions();
    // this.clear();
    this.queryCommon();
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    // console.log(key);
    // this.allColumnIds.length = 0;
    // this.gridColumnApi.getAllColumns().forEach(x => {
    //   this.allColumnIds.push(x.getColId());
    // });
    // this.gridColumnApi.autoSizeColumns(this.allColumnIds);
    // this.gridApi.sizeColumnsToFit();
    // return;
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {
    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      if (this.allColumnIds.length <= 10) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('functions');
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
  }
  public query() {
    super.query();
    this.loadOptions();
    this.queryCommon();
  }

  private loadOptions() {
    this.commonQueryService.GetLookupByTypeRef('FND_LANGUAGE', this.languages);
    // this.messageManageService.GetLanguages().subscribe(result => {
    //   this.languages.length = 0;
    //   result.Extra.forEach(d => {
    //     this.languages.push({
    //       label: d.LOOKUPNAME,
    //       value: d.LOOKUPCODE,
    //     });
    //   });
    // });

    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.enabledflags);

    this.commonQueryService.GetLookupByTypeRef('FND_FUNCTION_TYPE', this.functiontypes);

    this.commonqueryService.GetApplication().subscribe(result => {
      result.data.forEach(d => {
        this.applications.push({
          label: d.applicationName,
          value: d.applicationCode,
        });
      });
    });
    // this.messageManageService.GetAppliaction().subscribe(result => {
    //   result.Extra.forEach(d => {
    //     this.applications.push({
    //       label: d.APPLICATION_NAM
    //       value: d.APPLICATION_CODE,
    //     });
    //   });
    // });

  }

  add() {
    this.modal
      .static(BaseFunctionmanagerEditComponent, { i: { id: null } })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }
  public modifyda(item: any) {
    this.modal
      .static(
        BaseFunctionmanagerEditComponent,
        { i: { id: (item !== undefined ? item.id : null), language: (item !== undefined ? item.language : null) } },
        'lg',
    )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }
  // 操作明细
  public detail(item: any) {
    this.modal
      .static(
        BaseFunctionmanagerDetailComponent,
        { id: item.id },
        'lg',
    )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }
  public clear() {
    this.queryParams.values = {
      functionName: '',
      functionCode: '',
      functionPath: '',
      description: ''
    };

  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

}
