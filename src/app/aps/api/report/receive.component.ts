import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UiType, QueryParamDefineObject } from '../../../modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ApiReportReceiveDetailComponent } from './detail/detail.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'api-report-receive',
  templateUrl: './receive.component.html',
  providers: [QueryService],
})
export class ApiReportReceiveComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  /*  -------------------------树形选择---------------------------- */
  treeNodeColumns = [
    { field: 'CODE', title: '编码', width: '240px' },
    { field: 'DESCRIPTION', title: '名称', width: '160px' }
  ]; // 树形显示列
  /*    ---------------------------------------------------------- */
  // 返回指定field的参数定义项,找不到时返回undefined
  private findDefine(field: string = 'API_CODE'): QueryParamDefineObject {
    const result = this.queryParams.defines.find(x => x.field === field);
    return result;
  }

  headTypeOptions = [];
  now = new Date();
  /**查询参数定义 */
  public queryParams = {
    defines: [
      { field: 'API_CODE', title: '接口编码', ui: { type: UiType.treeSelect, options: [], columns: this.treeNodeColumns, selection: [], keyField: 'id', valueField: 'apiCode', valueLevel: 0 } },
      { field: 'DATE_RANGE', title: '日期范围', required: true, ui: { type: UiType.dateRange } },
      { field: 'HEAD_TYPE', title: '日期统计类型', required: true, ui: { type: UiType.select, options: this.headTypeOptions } },
    ],
    values: {
      API_CODE: '',
      HEAD_TYPE: 'D',
      DATE_RANGE: [this.queryService.addDays(this.now, -1), this.now],
      START_DATE: null,
      END_DATE: null,
    }
  };
  headerTemplate =
    `<div class="ag-cell-label-container" role="presentation">
      <div ref="eLabel" class="ag-header-cell-label" role="presentation">
        <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
      </div>
    </div>`;
  fixColumns = [
    {
      colId: 0, field: '', headerName: '操作', width: 60, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    {
      field: 'ROW_KEY',
      headerName: '接口编码',
      width: 150
    },
    {
      field: 'ROW_KEY_DESC',
      headerName: '接口名称',
      width: 150
    },
  ];
  dateColumns = [
    { field: 'TOTAL_QTY', headerName: '总数量', width: 100 },
    { field: 'SUCCESS_QTY', headerName: '成功数量', width: 100 },
    { field: 'FAIL_QTY', headerName: '失败数量', width: 100 },
    { field: 'SUCCESS_RATE', headerName: '成功率(%)', width: 100 }
  ];
  columns = [
    ...this.fixColumns
  ];

  /**构造函数 */
  constructor(
    public pro: BrandService,
    private msgSrv: NzMessageService,
    public queryService: QueryService,
    private modal: ModalHelper,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
    // this.isSizeColumnsToFit = true;
  }

  /**页面初始化 */
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.convertExportColumns();
    this.loadInitData();
    this.query();
  }
  // 加载初始化数据
  private loadInitData() {
    // 接口列表
    this.queryService.GetApiAllList(this.GetqueryParams()).subscribe(result => {
      const data = [];
      result.data.forEach(d => {
        data.push({ ID: d.id, CODE: d.apiCode, DESCRIPTION: d.apiName });
      });
      this.findDefine().ui.options = data; // 注意：数据加载完再赋值
    });
    // 表头日期维度：年/月/日/时段
    this.queryService.GetLookupByType('RPT_DATE_HEAD_TYPE').subscribe(result => {
      this.headTypeOptions.length = 0;
      result.Extra.forEach(d => {
        this.headTypeOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }
  public query() {
    super.query(); // grid初始化
    this.queryCommon();
  }

  dateCells = [];
  private queryCommon() {
    this.setLoading(true);
    this.queryService.GetReceiveRptData(this.GetqueryParams()).subscribe(result => {
      // if (result != null) {
        this.dateCells = result.data.headList || [];
        this.dealDateColumn();
        this.gridData = result.data.extra || [];
      // }
      this.setLoading(false);
    });
  }

  expColumns = this.columns;
  groupCollection = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    this.excelexport.export(this.gridData);
  }

  /**重置事件 */
  public clear() {
    this.queryParams.values = {
      API_CODE: '',
      HEAD_TYPE: 'D',
      DATE_RANGE: [this.queryService.addDays(this.now, -1), this.now],
      START_DATE: null,
      END_DATE: null
    };
    this.findDefine().ui.selection.length = 0;
  }

  // 处理日期动态列
  private dealDateColumn() {
    const queryGroupCollection = [];
    const exportGroupCollection = [];
    this.dateCells.forEach(date => {
      const groupColumn = {
        headerName: date,
        children: []
      };
      const exportGroupColumn = {
        title: date,
        child: []
      };
      this.dateColumns.forEach(col => {
        groupColumn.children.push({ field: col.field + date, headerName: col.headerName, width: col.width });
        exportGroupColumn.child.push({ field: col.field + date, title: col.headerName, width: col.width });
      });
      queryGroupCollection.push(groupColumn);
      exportGroupCollection.push(exportGroupColumn);
    });
    this.columns = [...this.fixColumns, ...queryGroupCollection];
    this.expColumns = [...this.fixColumns];
    this.convertExportColumns();
    this.groupCollection = exportGroupCollection;
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

  private GetqueryParams(): any {
    return {
      // API_CODE: this.queryParams.values.API_CODE,
      // HEAD_TYPE: this.queryParams.values.HEAD_TYPE,
      // START_DATE: this.queryParams.values.DATE_RANGE[0],
      // END_DATE: this.queryParams.values.DATE_RANGE[1],
      // Selection: this.findDefine().ui.selection,
      // fixed: false
      apiCode: this.queryParams.values.API_CODE,
      headType: this.queryParams.values.HEAD_TYPE,
      startDate: this.queryParams.values.DATE_RANGE[0],
      // startDate: '2020-03-09 10:45:06',
      endDate: this.queryParams.values.DATE_RANGE[1],
      // successFlag: this.findDefine().ui.selection,
      successFlag: ''
    };
  }
  // 数据明细
  detail(dataItem: any) {
    const inputParam = this.GetqueryParams();
    inputParam.API_CODE = dataItem.ROW_KEY;
    inputParam.DATE_RANGE = this.queryParams.values.DATE_RANGE;
    this.modal.static(ApiReportReceiveDetailComponent, { queryValues: inputParam }, 1200)
      .subscribe(() => {

      });
  }
}
