import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { ConcurrentProgramManageService } from '../../../modules/generated_module/services/concurrent-program-manage-service';
import { ConcurrentRequestConcurrentProgramEditComponent } from './edit/edit.component';
import { ConcurrentRequestConcurrentProgramCopytoComponent } from './copyto/copyto.component';
import { ConcurrentRequestConcurrentProgramSerialComponent } from '../concurrent-program-serial/concurrent-program-serial.component';
import { ConcurrentRequestConcurrentProgramParameterComponent } from '../concurrent-program-parameter/concurrent-program-parameter.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-program',
  templateUrl: './concurrent-program.component.html',
})
export class ConcurrentRequestConcurrentProgramComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  context = this;
  public gridView: GridDataResult = {
    data: [],
    total: 0,
  };
  gridData: any[] = [];
  params: any = {};
  optionListConcProgLOV = [];
  optionListExecutable = [];
  requestOptions: Array<{ label: string, value: any }> = [];
  enabledFlagOptions: Array<{ label: string, value: any }> = [];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private apptranslate: AppTranslationService,
    private concurrentProgramManageService: ConcurrentProgramManageService,
    private commonQueryService: CommonQueryService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: apptranslate,
      msgSrv: null,
      appConfigSrv: null,
    });
    this.headerNameTranslate(this.columns22);
  }

  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();
    this.loadConcProgLOV();
    this.loadExecutable();
    this.query();
  }

  loadOptions() {
    this.commonQueryService.GetLookupByTypeNew('FND_CONC_REQUEST_TYPE').subscribe(res => {
      res.data.forEach(item => {
        this.requestOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });

    this.commonQueryService.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(item => {
        this.enabledFlagOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  loadConcProgLOV(): void {
    this.concurrentProgramManageService.GetConcProgLov().subscribe(result => {
      this.optionListConcProgLOV.length = 0;
      result.data.forEach(d => {
        this.optionListConcProgLOV.push({
          label: d.userConcurrentProgramName,
          value: d.concurrentProgramId,
        });
      });
    });
  }

  loadExecutable(): void {
    this.concurrentProgramManageService.GetExecutableData().subscribe(result => {
      this.optionListExecutable.length = 0;
        result.data.forEach(d => {
          this.optionListExecutable.push({
            label: d.executableName,
            value: d.id,
          });
        });
      });
  }

  public queryParams = {
    defines: [
      {
        field: 'concurrentProgramId',
        title: '程序',
        ui: { type: UiType.select, options: this.optionListConcProgLOV },
      },
      {
        field: 'executableId',
        title: '执行名称',
        ui: { type: UiType.select, options: this.optionListExecutable },
      },
    ],
    values: {
      concurrentProgramId: null,
      executableId: null,
    },
  };

  public columns22 = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 150,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      field: 'userConcurrentProgramName',
      headerName: '程序',
      tooltipField: 'userConcurrentProgramName',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'concurrentProgramName',
      headerName: '简称',
      tooltipField: 'concurrentProgramName',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'applicationName',
      headerName: '应用模块',
      tooltipField: 'applicationName',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'description',
      headerName: '说明',
      tooltipField: 'description',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'executableName',
      headerName: '执行名称',
      tooltipField: 'executableName',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'executionMethodCode',
      headerName: '方法',
      tooltipField: 'executionMethodCode',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'requestPriority',
      headerName: '优先级',
      width: 80,
      tooltipField: 'requestPriority',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'concurrentClassId',
      headerName: '请求类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
      width: 100,
      tooltipField: 'concurrentClassId',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'outputFileType',
      headerName: '输出格式',
      width: 100,
      tooltipField: 'outputFileType',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enabledFlag',
      headerName: '启用',
      valueFormatter: 'ctx.optionsFind(value,2).label',
      width: 80,
      tooltipField: 'enabledFlag',
      menuTabs: ['filterMenuTab'],
    },
  ];

  query() {
    super.query();
    this.loadData();
  }

  getQueryParams(isExport: boolean = false): {[key: string]: any} {
    return {
      concurrentProgramId: this.queryParams.values.concurrentProgramId,
      executableId: this.queryParams.values.executableId,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.requestOptions;
        break;
      case 2:
        options = this.enabledFlagOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  loadData() {
    this.concurrentProgramManageService.QueryMainFormByPage(this.getQueryParams()).subscribe(result => {
      this.gridView = {
        data: result.data.content,
        total: result.data.totalElements,
      };
      this.gridData = result.data.content;
    });
  }

  add() {
    const param = {
      operType: '新增',
      IsRefresh: false,
      i: { id: null },
    };
    this.modal
      .static(ConcurrentRequestConcurrentProgramEditComponent, { param: param })
      .subscribe(() => {
        if (param.IsRefresh) {
          this.query();
          this.loadConcProgLOV(); // 同时需要更新查询区域的下拉框
        }
      });
  }

  edit(record: any) {
    const param = {
      operType: '编辑',
      IsRefresh: false,
      i: record,
    };
    this.modal
      .static(
        ConcurrentRequestConcurrentProgramEditComponent,
        { param: param },
        'lg',
      )
      .subscribe(() => {
        if (param.IsRefresh) {
          this.query();
        }
      });
  }

  // 复制到方法
  copy(record: any) {
    this.modal
      .static(ConcurrentRequestConcurrentProgramCopytoComponent, {
        i: {
          concurrentProgramId: record.concurrentProgramId,
          oldConcurrentProgramName: record.concurrentProgramName,
        },
      })
      .subscribe((res) => {
        if (res) {
          this.query();
        }
      });
  }

  // 不兼容方法
  serial(record: any) {
    this.modal
      .static(ConcurrentRequestConcurrentProgramSerialComponent, {
        i: {
          runningConcurrentProgramId: record.concurrentProgramId,
          runningConcurrentProgramName: record.userConcurrentProgramName,
        },
      })
      .subscribe(() => {
        // this.loadData();
      });
  }

  // 参数方法
  paramter(record: any) {
    this.modal
      .static(
        ConcurrentRequestConcurrentProgramParameterComponent,
        {
          i: {
            concurrentProgramId: record.concurrentProgramId,
            userConcurrentProgramName: record.userConcurrentProgramName,
            conflictParameter: record.conflictParameter,
          },
          parentLoadData: () => { this.query(); }
        },
        'lg',
      )
      .subscribe(() => {
        // this.loadData();
      });
  }

  clear() {
    this.queryParams.values.concurrentProgramId = null;
    this.queryParams.values.executableId = null;
  }

  expColumns = [
    {
      title: '程序',
      field: 'userConcurrentProgramName',
      width: '100px',
      locked: false,
    },
    {
      title: '简称',
      field: 'concurrentProgramName',
      width: '100px',
      locked: false,
    },
    {
      title: '应用模块',
      field: 'applicationName',
      width: '100px',
      locked: false,
    },
    { title: '说明', field: 'description', width: '100px', locked: false },
    { title: '执行名称', field: 'executableName', width: '100px', locked: false },
    { title: '方法', field: 'executionMethodCode', width: '100px', locked: false },
    {
      title: '优先级',
      field: 'requestPriority',
      width: '100px',
      locked: false,
    },
    {
      title: '请求类型',
      field: 'concurrentClassId',
      width: '100px',
      locked: false,
    },
    {
      title: '输出格式',
      field: 'outputFileType',
      width: '100px',
      locked: false,
    },
  ];
  expColumnsOptions = [
    { field: 'concurrentClassId', options: this.requestOptions },
  ];

  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    this.concurrentProgramManageService.QueryMainFormByPage(this.getQueryParams(true))
      .subscribe(result => {
        this.excelexport.export(result.data.content);
      });
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
      this.loadData();
    } else {
      this.setLoading(false);
    }
  }
}
