import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from './query.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'api-display',
  templateUrl: './display.component.html',
  providers: [QueryService],
})
export class ApiDisplayComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  successOptions = [{ value: 'Y', label: 'Y' }, { value: 'N', label: 'N' }];
  apiOptions = [];
  now = new Date();
  /**查询参数定义 */
  public queryParams = {
    defines: [
      { field: 'apiCode', title: '接口编码', required: true, ui: { type: UiType.select, options: this.apiOptions, eventNo: 1 } },
      { field: 'sourceBatchId', title: '批次号', ui: { type: UiType.text } },
      { field: 'successFlag', title: '成功标记', ui: { type: UiType.select, options: this.successOptions } },
      { field: 'dateRange', title: '日期范围', ui: { type: UiType.dateRange } },
      { field: 'sqlCondition', title: 'SQL条件', ui: { type: UiType.textarea } }
    ],
    values: {
      apiCode: '',
      sourceBatchId: '',
      successFlag: '',
      DATE_RANGE: [this.queryService.addDays(this.now, -7), this.now],
      startDate: null,
      endDate: null,
      sqlCondition: ''
    }
  };
  public columns = [
    { field: 'sourceBatchId', headerName: '生产批次' },
    { field: 'sourceBatchId', headerName: '工厂编码' },
    { field: 'sourceBatchId', headerName: '物料类型' },
    { field: 'sourceBatchId', headerName: '物料编码' },
    { field: 'sourceBatchId', headerName: '插入时间' },
    { field: 'sourceBatchId', headerName: '操作类型' },
    { field: 'sourceBatchId', headerName: '采购员' },
    { field: 'sourceBatchId', headerName: '创建人' },
    { field: 'sourceBatchId', headerName: '创建日期' },
    { field: 'sourceBatchId', headerName: '处理标识' },
    { field: 'sourceBatchId', headerName: '处理时间' },
    { field: 'sourceBatchId', headerName: '是否有效' },
    { field: 'sourceBatchId', headerName: '错误信息' },
    { field: 'sourceBatchId', headerName: '物料ID' },
    { field: 'sourceBatchId', headerName: '最近更新日期' },
    { field: 'sourceBatchId', headerName: '最近更新人' },
    { field: 'sourceBatchId', headerName: '计划员' },
    { field: 'sourceBatchId', headerName: '成功标识' }
  ]
  headerTemplate =
    `<div class="ag-cell-label-container" role="presentation">
      <div ref="eLabel" class="ag-header-cell-label" role="presentation">
        <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
      </div>
    </div>`;
  fixColumns = [
    // {
    //   colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate
    //   },
    //   cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
    //   cellRendererParams: {
    //     customTemplate: null,
    //   }
    // }
  ];
  // columns = [
  //   ...this.fixColumns
  // ];

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
    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadInitData();
  }
  // 加载初始化数据
  private loadInitData() {
    // 接口列表
    this.queryService.GetDisplayConfig().subscribe(result => {
      this.gridData = result.data.data.content;
      this.apiOptions.length = 0;
      result.data.data.content.forEach(d => {
        this.apiOptions.push({ value: d.apiCode, label: d.apiCode + ' ' + d.apiName });
        // this.apiOptions.push({ value: d.API_CODE, label: d.API_CODE });
        this.queryParams.values.apiCode = this.apiOptions[0].value;
        this.onApiChange(null);
      });
    });
  }
  public query() {
    super.query(); // grid初始化
    this.queryCommon();
  }
  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  private queryCommon() {
    this.queryService.loadGridView(this.httpAction, this.GetqueryParams(), this.context);
  }

  expColumns = this.columns;
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    let data = this.GetqueryParams()
    this.queryService.exportAction({ url: this.queryService.exportUrl, method: 'GET' }, data, this.excelexport, this.context);
  }

  /**重置事件 */
  public clear() {
    this.queryParams.values = {
      apiCode: this.queryParams.values.apiCode,
      sourceBatchId: '',
      successFlag: null,
      DATE_RANGE: [this.queryService.addDays(this.now, -7), this.now],
      startDate: null,
      endDate: null,
      sqlCondition: ''
    };
  }
  dynamicColumns = [];
  // 接口切换刷新展示列
  onApiChange(event) {
    this.queryService.GetDisplayColumns(this.queryParams.values.apiCode).subscribe(result => {
      this.dynamicColumns.length = 0;
      result.Extra.forEach(x => {
        if (x.ENABLE_FLAG === 'Y')
          this.dynamicColumns.push({ field: x.FIELD_NAME, headerName: x.DISPLAY_NAME, width: x.WIDTH, menuTabs: ['filterMenuTab'] });
      });
      this.dealDynamicColumn();
      this.gridData = [];
    });
  }
  // 处理动态列
  private dealDynamicColumn() {
    this.columns = [...this.fixColumns, ...this.dynamicColumns];
    this.expColumns = [...this.columns];
    this.convertExportColumns();
  }
  // 处理导出列
  private convertExportColumns() {
    const columns = [];
    this.expColumns.forEach(x => {
      columns.push({
        field: x.field,
        title: x.headerName,
        // width: x.width
      });
    });
    this.expColumns = columns;
  }

  private GetqueryParams() {
    return {
      apiCode: this.queryParams.values.apiCode,
      sourceBatchId: this.queryParams.values.sourceBatchId,
      successFlag: this.queryParams.values.successFlag,
      startDate: this.queryParams.values.DATE_RANGE.length === 2 ? this.queryParams.values.DATE_RANGE[0] : null,
      endDate: this.queryParams.values.DATE_RANGE.length === 2 ? this.queryParams.values.DATE_RANGE[1] : null,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      fixed: false,
      sqlCondition: this.queryParams.values.sqlCondition
    };
  }
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.queryCommon();
  }
}
