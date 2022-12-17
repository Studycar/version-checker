import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from './queryService';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
// import { PlanscheduleMoexceptionMoLevelComponent } from './moLevel/moLevel.component';
// import { ProcessScheduleOpdigitalizationWorkbenchMoLevelComponent } from 'app/aps/process-schedule/opdigitalization-workbench/moLevel/moLevel.component';
import { PlanscheduleMoexceptionSubmitExceptionComponent } from './view/submitException.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-moexception-ag',
  templateUrl: './moexception-ag.component.html',
  providers: [QueryService]
})
export class PlanscheduleMoexceptionAgComponent extends CustomBaseContext implements OnInit {
  plantOptions: any[] = [];
  scheduleGroupOptions: any[] = [];
  resourceOptions: any[] = [];
  moStatusOptions: any[] = [];
  exceptionOptions: any[] = [];
  priorityOptions: any[] = [];
  actionOptions: any[] = [];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 } },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.scheduleGroupOptions, eventNo: 2 } },
      { field: 'resourceCode', title: '资源', ui: { type: UiType.select, options: this.resourceOptions } },
      { field: 'makeOrderNum', title: '工单号', ui: { type: UiType.text } },
      { field: 'makeOrderStatus', title: '工单状态', ui: { type: UiType.select, options: this.moStatusOptions } },
      { field: 'dateTimeRange', title: '排产时间', ui: { type: UiType.dateTimeRange, style: { width: '240px' } } },
      { field: 'exceptionType', title: '例外类型', ui: { type: UiType.select, options: this.exceptionOptions } },
      { field: 'exceptionAction', title: '处理建议', ui: { type: UiType.select, options: this.actionOptions } },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      scheduleGroupCode: null,
      resourceCode: null,
      makeOrderNum: '',
      makeOrderStatus: null,
      dateTimeRange: [],
      exceptionType: null,
      exceptionAction: null,
    }
  };
  // 排产模拟的发布版本
  public version: string;

  public columns = [
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'makeOrderNum', headerName: '工单号', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料', menuTabs: ['filterMenuTab'] },
    { field: 'descriptionsCn', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'exceptionType', headerName: '例外类型', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1)' },
    { field: 'exceptionPriority', headerName: '例外等级', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,2)' },
    { field: 'exceptionMessage', headerName: '例外信息', menuTabs: ['filterMenuTab'] },
    { field: 'exceptionAction', headerName: '处理建议', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,3)' },
    { field: 'makeOrderStatus', headerName: '工单状态', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,4)' },
    { field: 'fpcTime', headerName: '计划开始时间', menuTabs: ['filterMenuTab'] },
    { field: 'lpcTime', headerName: '计划完成时间', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCodeDescriptions', headerName: '计划组描述', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCodeDescriptions', headerName: '资源描述', menuTabs: ['filterMenuTab'] },
    { field: 'processMakeOrderNum', headerName: '工序工单号', menuTabs: ['filterMenuTab'] },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.exceptionOptions;
        break;
      case 2:
        options = this.priorityOptions;
        break;
      case 3:
        options = this.actionOptions;
        break;
      case 4:
        options = this.moStatusOptions;
        break;
    }
    const tmp = options.find(x => x.value === value) || { label: value };
    return tmp;
  }
  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    // 加载工厂
    this.commonQueryService.GetUserPlant().subscribe(result => {
      // this.plantOptions.length = 0;
      result.Extra.forEach(d => {
        this.plantOptions.push({ value: d.plantCode, label: `${d.plantCode}(${d.descriptions})` });
      });
    });

    this.commonQueryService.GetLookupByTypeLang('PS_MAKE_ORDER_STATUS', this.appConfigService.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.moStatusOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
    this.commonQueryService.GetLookupByTypeLang('PS_EXCEPTION_TYPE', this.appConfigService.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.exceptionOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
    this.commonQueryService.GetLookupByTypeLang('PS_EXCEPTION_GRADE', this.appConfigService.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.priorityOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
    this.commonQueryService.GetLookupByTypeLang('PS_EXCEPTION_SUGGESTION', this.appConfigService.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.actionOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
    this.clear();
    if (this.version) {
      this.queryByVersion();
    } else {
      this.queryCommon();
    }
    this.plantChange(this.queryParams.values.plantCode);
  }

  plantChange(value) {
    this.queryParams.values.scheduleGroupCode = null;
    this.scheduleGroupOptions.length = 0;
    this.commonQueryService.GetUserPlantGroup(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.scheduleGroupOptions.push({
          label: `${element.scheduleGroupCode}(${element.descriptions})`,
          value: element.scheduleGroupCode,
        });
        // this.scheduleGroupChange('');
      });
    });
    this.scheduleGroupChange('');
  }

  scheduleGroupChange(value) {
    this.queryParams.values.resourceCode = null;
    this.resourceOptions.length = 0;
    this.commonQueryService.GetUserPlantGroupLine(this.queryParams.values.plantCode, value).subscribe(
      res => {
        res.Extra.forEach(element => {
          this.resourceOptions.push({
            label: `${element.resourceCode}(${element.descriptions})`,
            value: element.resourceCode,
          });
        });
      });
  }

  public query() {
    super.query();
    this.queryCommon();
  }
  httpAction = { url: this.commonQueryService.queryUrl, method: 'GET' };
  public queryCommon() {
    const queryValues = this.getQueryParamsValue();
    this.commonQueryService.loadGridViewNew(this.httpAction, queryValues, this.context);
  }
  public queryByVersion() {
    this.commonQueryService.loadGridViewNew(
      { url: this.commonQueryService.queryByVersionUrl, method: 'GET' },
      { version: this.version, pageIndex: this._pageNo, pageSize: this._pageSize },
      this.context);
  }
  // 获取查询参数值
  private getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      resourceCode: this.queryParams.values.resourceCode,
      makeOrderNum: this.queryParams.values.makeOrderNum,
      makeOrderStatus: this.queryParams.values.makeOrderStatus,
      exceptionType: this.queryParams.values.exceptionType,
      exceptionAction: this.queryParams.values.exceptionAction,
      startTime: this.commonQueryService.formatDateTime(this.queryParams.values.dateTimeRange[0]),
      endTime: this.commonQueryService.formatDateTime(this.queryParams.values.dateTimeRange[1]),
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }
  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      scheduleGroupCode: null,
      resourceCode: null,
      makeOrderNum: '',
      makeOrderStatus: null,
      dateTimeRange: [],
      exceptionType: null,
      exceptionAction: null,
    };
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'makeOrderStatus', options: this.moStatusOptions },
    { field: 'exceptionType', options: this.exceptionOptions },
    { field: 'exceptionPriority', options: this.priorityOptions },
    { field: 'exceptionAction', options: this.actionOptions }
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.exportAction({ url: this.commonQueryService.exportUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport);
    // this.commonQueryService.exportAction({ url: this.commonQueryService.exportUrl, method: 'POST' }, this.getQueryParamsValue(), this.excelexport, this);
  }
  // 例外生成
  excSubmit() {
    // this.commonQueryService.SubmitRequest_Exception(this.queryParams.values.plantCode).subscribe(result => {
    //   if (result !== null && result.Success) {
    //     this.msgSrv.success(this.appTranslationService.translate(result.Message || '刷新请求提交成功！'));
    //   } else {
    //     this.msgSrv.error(this.appTranslationService.translate(result.Message || '刷新请求提交失败！'));
    //   }
    // });
    this.modal.static(PlanscheduleMoexceptionSubmitExceptionComponent, {}, 'md')
      .subscribe(() => {
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
      this.queryCommon();
    }
  }
  // // 工单工序簇
  // public openMoLevel(dataItem: any) {
  //   this.modal
  //     .static(ProcessScheduleOpdigitalizationWorkbenchMoLevelComponent, { i: { ID: '', makeOrderNum: dataItem.makeOrderNum } }, 'xl')
  //     .subscribe(() => {
  //     });
  // }
}
