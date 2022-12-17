import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { RespmanagerService } from '../../../modules/generated_module/services/respmanager-service';
import { BaseBaserespmanagerEditComponent } from './edit/edit.component';
import { BaseBaserespmanagerchildComponent } from '../baserespmanagerchild/baserespmanagerchild.component';
import { BaseResprequestgroupComponent } from '../resprequestgroup/resprequestgroup.component';
import { PlantMaintainService } from '../../../modules/generated_module/services/plantmaintain-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { CommonInputDto } from '../../../modules/generated_module/dtos/common-input-dto';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import {BaseRespsBImportComponent} from './import/import.component';

/**
 * 职责
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-baserespmanager',
  templateUrl: './baserespmanager.component.html',
  providers: [QueryService]
})
export class BaseBaserespmanagerComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  public languageOptions: any[] = [];
  public applicationOptions: any[] = [];
  public selectBy = 'respId';
  public queryParams = {
    defines: [
      { field: 'respsName', title: '职责名称', ui: { type: UiType.string } },
      { field: 'respsCode', title: '职责代码', ui: { type: UiType.string } },
      { field: 'description', title: '描述', ui: { type: UiType.string } },
      { field: 'language', title: '语言', ui: { type: UiType.select, options: this.languageOptions } }
    ],
    values: {
      respsName: '',
      respsCode: '',
      description: '',
      language: this.appConfigService.getLanguage()
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'respsName', headerName: '职责名称', menuTabs: ['filterMenuTab'] },
    { field: 'respsCode', headerName: '职责代码', menuTabs: ['filterMenuTab'] },
    {
      field: 'applicationCode', headerName: '应用模块',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
    { field: 'description', headerName: '描述', tooltipField: 'description', menuTabs: ['filterMenuTab'] },
    {
      field: 'language', headerName: '语言',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    },
    { field: 'startDate', headerName: '生效日期', menuTabs: ['filterMenuTab'] },
    { field: 'endDate', headerName: '失效日期', menuTabs: ['filterMenuTab'] },
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
    private respmanagerService: RespmanagerService,
    private messageManageService: MessageManageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private queryService: CommonQueryService,
    public commonQueryService: QueryService,
    private appGridStateService: AppGridStateService
  )
  // tslint:disable-next-line:one-line
  {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.commonQueryService.GetLookupByTypeRef('FND_LANGUAGE', this.languageOptions);
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
      if (this.allColumnIds.length <= 9) {
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
    this.commonQueryService.GetApplication().subscribe(result => {
      this.applicationOptions.length = 0;
      result.data.forEach(d => {
        this.applicationOptions.push({
          label: d.applicationName,
          value: d.applicationCode,
        });
      });
    });
  }

  httpAction = { url: this.respmanagerService.seachUrl, method: 'POST' };

  public query() {
    super.query();
    this.loadOptions();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
    console.log('test:' + this.queryParams.values.respsName);
  }

  public add() {
    this.modal
      .static(
        BaseBaserespmanagerEditComponent,
        { i: { NEWFLAG: 'Y' } },
        'lg',
    )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public modifyda(item: any) {
    this.modal
      .static(
        BaseBaserespmanagerEditComponent,
        { i: { respId: (item !== undefined ? item.respId : null), language: (item !== undefined ? item.language : null), NEWFLAG: 'N' } },
        'lg',
    )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public detail(item: any) {
    this.modal
      .static(
        BaseBaserespmanagerchildComponent,
        { p: { respId: (item !== undefined ? item.respId : null), respsName: (item !== undefined ? item.respsName : null), language: (item !== undefined ? item.language : null) } },
        'lg',
    )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public requestGroup(item: any) {
    this.modal
      .static(
        BaseResprequestgroupComponent,
        { p: { respId: (item !== undefined ? item.respId : null), respsName: (item !== undefined ? item.respsName : null), language: (item !== undefined ? item.language : null) } },
        'lg',
    )
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'applicationCode', options: this.applicationOptions }, { field: 'language', options: this.languageOptions }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.loadOptions();
    super.export();
    this.commonQueryService.exportAction(this.httpAction, this.queryParams.values, this.excelexport, this.context);
  }

  public clear() {
    this.queryParams.values = {
      respsName: '',
      respsCode: '',
      description: '',
      language: this.appConfigService.getLanguage()
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
   * 导入职责
   */
  public imports() {
    this.modal.static(BaseRespsBImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }

}
