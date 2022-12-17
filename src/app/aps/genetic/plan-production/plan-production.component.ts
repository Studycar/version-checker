import { STComponent } from '@delon/abc';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { process } from '@progress/kendo-data-query';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from './query.service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { GeneticPlanProductionEditComponent } from 'app/aps/genetic/plan-production/edit/edit.component';
import { GeneticPlanProductionViewComponent } from 'app/aps/genetic/plan-production/view/view.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'genetic-plan-production',
  templateUrl: './plan-production.component.html',
  providers: [QueryService],
})
export class GeneticPlanProductionComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  orgOptionList: any[] = [];
  schGroupOptionList: any[] = [];
  resultOptionList: any[] = [];
  lookupList: any[] = [];
  public extendColumns: any[] = [];
  public staticcolumns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'performanceName', headerName: '方案', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    {
      field: 'version', headerName: '版本号',
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      },
      width: 90, menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    { field: 'start', headerName: '发布状态', width: 160, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'creationDate', headerName: '创建时间', width: 160, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'elementsValue', headerName: '方案评分', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  ];
  columns = this.staticcolumns;
  extendColunmTitle = null;
  a = 0;
  operatingunits: any[] = [];
  enableflags: any[] = [];
  buorgids: any[] = [];
  masterorganizationids: any[] = [];
  scheduleregions: any[] = [];
  organizationids: any[] = [];
  public totalCount = 0;
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private commonqueryService: CommonQueryService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    public pro: BrandService,
    private messageManageService: MessageManageService,
    private appConfigService: AppConfigService,
    private queryService: CommonQueryService,
    private appGridStateService: AppGridStateService,
    private appconfig: AppConfigService
  )  // tslint:disable-next-line:one-line
  {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.orgOptionList, eventNo: 1 } },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.schGroupOptionList } },
      { field: 'performanceName', title: '方案', ui: { type: UiType.select, options: this.resultOptionList } },
      { field: 'creationDate', title: '创建日期范围', ui: { type: UiType.dateRange } },
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      performanceName: '',
      scheduleGroupCode: '',
      creationDate: [this.commonQueryService.addDays(new Date(), -30), new Date()]
    }
  };
  
  public query() {
    super.query();
    this.queryCommon();
  }

  public ngOnInit(): void {
    this.columns[4].cellRendererParams.customTemplate = this.customTemplate;

    this.selectableSettings.mode = 'single';
    this.selectableSettings.checkboxOnly = true;
    this.gridOptions.rowSelection = 'single';

    /** 初始化 主组织  下拉框*/
    this.commonQueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(element => {
        this.orgOptionList.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });

    this.commonQueryService.GetLookupByType('PS_GA_PARAMETER_TAB').subscribe(result => {
      result.Extra.forEach(d => {
        this.resultOptionList.push({
          label: d.meaning,
          value: d.meaning,
        });

      });
    });
    this.queryCommon();
    this.plantChange(this.appconfig.getPlantCode());
  }

  // 发布
  VersionRelease() {

    if (!this.isNull(this.gridSelectRows) && this.gridSelectRows.length > 0) {
      const row = this.gridSelectRows[0];
      // console.log('yuyyuy' + row.PLANT_CODE);

      this.commonQueryService.SetMarkOrderType(row.popuId).subscribe(result => {
        if (result !== null && result.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(result.msg));
          this.query();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(result.msg || '操作失败'));
        }
      });

    } else {
      this.msgSrv.success('请选择一行数据。');
      return;
    }
  }

  private cloneParam(): any {
    const dto = {
      plantCode: this.queryParams.values.plantCode,
      performanceName: this.queryParams.values.performanceName,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      startTime: this.commonQueryService.formatDateTime((this.queryParams.values.creationDate[0].setHours(0, 0, 0, 0))),
      endTime: this.commonQueryService.formatDateTime((this.queryParams.values.creationDate[1].setHours(23, 59, 59, 999))),
    };
    return dto;
  }

  onCellClicked(event) {
    const vPerformanceSubItem = event.colDef.headerName;
    if (vPerformanceSubItem === '版本号') {
      return;
    }
    const vPopuId = event.data.popuId;
    let vLookupValue = '';
    const selectItemstmp = this.lookupList.find(x => x.value === vPerformanceSubItem);
    if (selectItemstmp !== undefined) {
      vLookupValue = selectItemstmp.label;
    } else {
      return;
    }
    this.modal
      .static(
      GeneticPlanProductionViewComponent,
      { i: { performanceSubItem: vPerformanceSubItem, popuId: vPopuId, lookupvalue: vLookupValue } },
      'lg',
    )
      .subscribe((value) => {
        // if (value) {
        //   this.queryCommon();
        // }
      });
  }

  private queryCommon() {
    this.setLoading(true);
    const queryValues = this.cloneParam();
    queryValues.pageIndex = this._pageNo;
    queryValues.pageSize = this._pageSize;
    queryValues.IsExport = false;
    this.commonQueryService.Search(queryValues).subscribe(result => {
      console.log('result');
      console.log(result.data);
      console.log(result.extra);
      this.gridData = result.data.content;
      this.totalCount = result.data.size;
      this.extendColunmTitle = result.extra;
      this.extendColumns = [];
      for (this.a = 0; this.a < this.extendColunmTitle.length; this.a++) {
        let col = null;
        if (this.extendColunmTitle[this.a].attribute9 !== undefined && this.extendColunmTitle[this.a].attribute9 !== null) {
          col = {
            field: 'attribute' + (this.a + 1).toString(),
            headerName: this.extendColunmTitle[this.a].attribute7,
            cellRendererFramework: CustomOperateCellRenderComponent,
            cellRendererParams: {
              customTemplate: this.customTemplate1,
              a: this.a,
            },
            width: 120, locked: true
          };
          //  暂存要弹出明细的动态列的快码
          const selectItemstmp = this.lookupList.find(x => x.value === this.extendColunmTitle[this.a].attribute7);
          if (selectItemstmp === undefined) {
            this.lookupList.push({
              label: this.extendColunmTitle[this.a].attribute9,
              value: this.extendColunmTitle[this.a].attribute7
            });
          }

        } else {
          col = { field: 'attribute' + (this.a + 1).toString(), headerName: this.extendColunmTitle[this.a].attribute7, width: 120, locked: false };
        }
        this.extendColumns.push(col);
      }
      this.columns = [...this.staticcolumns, ...this.extendColumns];
      this.expColumns = this.columns;
      this.convertExportColumns();
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length, // this.gridState.take,
          filter: this.gridState.filter
        }).data,
        total: this.totalCount
      };
      this.setLoading(false);
    }

    );
  }
  // 处理导出列
  private convertExportColumns() {
    const columns = [];
    this.expColumns.forEach(x => {
      columns.push({
        field: x.field,
        title: x.headerName,
        width: x.width
      });
    });
    this.expColumns = columns;
  }
  // grid当前选中行
  public gridSelectRows: any[];

  // 行选中改变
  onSelectionChanged(event) {
    // console.log(event);
    this.gridSelectRows = this.gridApi.getSelectedRows();
  }

  plantChange(value: any) {
    this.commonQueryService.GetUserPlantGroup(this.queryParams.values.plantCode, '').subscribe(res => {
      res.Extra.forEach(element => {
        this.schGroupOptionList.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode
        });
      });
    });
  }

  public popVersionDetail(item: any) {
    this.modal
      .static(
      GeneticPlanProductionEditComponent,
      { i: { version: (item !== undefined ? item.version : null), popuId: (item !== undefined ? item.popuId : null) } },
      'lg',
    )
      .subscribe((value) => {
        // if (value) {
        //   this.queryCommon();
        // }
      });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  @ViewChild('st', { static: true }) st: STComponent;
  public export() {
    super.export();
    this.excelexport.export(this.gridData);
  }

  public clear() {
    this.queryParams.values = {
      plantCode: null,
      performanceName: null,
      scheduleGroupCode: null,
      creationDate: [new Date(), new Date()]
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

}
