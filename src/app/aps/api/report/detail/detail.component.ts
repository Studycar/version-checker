import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { QueryService } from '../query.service';
import { UiType, QueryParamDefineObject } from 'app/modules/base_module/components/custom-form-query.component';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'api-report-receive-detail',
  templateUrl: './detail.component.html',
  providers: [QueryService]
})
export class ApiReportReceiveDetailComponent extends CustomBaseContext implements OnInit {
  // 表格height
  gridHeight: any = 350;
  apiOptions: any[] = [];
  successOptions = [{ value: 'Y', label: 'Y' }, { value: 'N', label: 'N' }];
  queryValues = {
    API_CODE: '',
    apiCode: '',
    dateRange: [],
    startDate: null,
    endDate: null,
    headType: 'D',
    successFlag: 'N'
  };
  /**查询参数定义 */
  public queryParams = {
    defines: [
      { field: 'apiCode', title: '接口编码', ui: { type: UiType.select, options: this.apiOptions } },
      { field: 'dateRange', title: '日期范围', required: true, ui: { type: UiType.dateRange } },
      { field: 'successFlag', title: '成功标记', ui: { type: UiType.select, options: this.successOptions } },
    ],
    values: {
      apiCode: this.queryValues.API_CODE,
      dateRange: [this.queryValues.startDate,this.queryValues.endDate],
      startDate: null,
      endDate: null,
      successFlag: 'N',
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }
  };
  public columns = [
    { field: 'apiCode', headerName: '接口编码' },
    { field: 'apiName', headerName: '接口名称' },
    { field: 'requestText', headerName: '请求文本' },
    { field: 'responseText', headerName: '响应文本' },
    { field: 'beginDate', headerName: '请求开始时间' },
    { field: 'endDate', headerName: '请求结束时间' },
    { field: 'successFlag', headerName: '成功标记' },
    { field: 'failMessage', headerName: '结果描述' },
    { field: 'creationDate', headerName: '日期' },
    { field: 'createdBy', headerName: '操作人' },
    { field: 'sourceBatchId', headerName: '批次号' },
  ];
  constructor(
    private modal: NzModalRef,
    private modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public pro: BrandService,
    public queryService: QueryService,
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
    this.initData();
    // 接口列表
    this.queryService.GetApiAllList({
      headType: this.queryValues.headType,
      startDate: this.queryParams.values.dateRange[0] || this.queryValues.startDate,
      endDate: this.queryParams.values.dateRange[1] || this.queryValues.endDate,
    }).subscribe(result => {
      this.apiOptions.length = 0;
      result.data.forEach(d => {
        this.apiOptions.push({ value: d.apiCode, label: d.apiCode + ' ' + d.apiName });
      });
    });
  }
  initData() {
    this.queryParams.values.apiCode = this.queryValues.API_CODE;
    // this.queryParams.values.DATE_RANGE = this.queryValues.DATE_RANGE;
    this.queryParams.values.startDate = this.queryParams.values.dateRange[0] || this.queryValues.startDate;
    this.queryParams.values.endDate = this.queryParams.values.dateRange[1] || this.queryValues.endDate;
    this.queryParams.values.successFlag = 'N';
    // 获取表格数据
    console.log(this.queryValues)
    this.queryService.GetDetailData({
      headType: this.queryValues.headType,
      apiCode: this.queryValues.API_CODE,
      startDate: this.queryParams.values.dateRange[0] || this.queryValues.startDate,
      endDate: this.queryParams.values.dateRange[1] || this.queryValues.endDate,
      successFlag: this.queryValues.successFlag,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }).subscribe(result => {
      this.gridData = result.data.content;
      this.query();
    });
    
  }
  getQueryParamsValue(): any {
    this.queryParams.values.pageIndex = this._pageNo;
    this.queryParams.values.pageSize = this._pageSize;
    return this.queryParams.values;
  }

  public query() {
    super.query();
    this.queryCommon();
  }
  
  httpAction = { url: this.queryService.queryDetailUrl, method: 'POST' };
  
  private queryCommon() {
    this.queryService.loadGridView(this.httpAction, this.getQueryParamsValue(), this.context);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.queryCommon();
  }
  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.queryService.exportAction({ url: this.queryService.queryExportUrl, method: 'POST' }, 
    // this.getQueryParamsValue(), 
    {
      headType: this.queryValues.headType,
      apiCode: this.queryValues.API_CODE,
      startDate: this.queryValues.startDate,
      endDate: this.queryValues.endDate,
      successFlag: this.queryValues.successFlag
    },
    this.excelexport, this.context);
  }
  /**重置事件 */
  public clear() {
    this.initData();
  }
  close() {
    this.modal.destroy();
  }
}
