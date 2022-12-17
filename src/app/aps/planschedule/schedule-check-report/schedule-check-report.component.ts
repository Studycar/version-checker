import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType, QueryParamDefineObject } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ScheduleCheckReportService } from './schedule-check-report.service';
import { TabAggridStateDirective } from '@shared/directive/tab-ag-state/tab-aggrid-state.directive';
import { Subject } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'schedule-check-report',
  templateUrl: './schedule-check-report.component.html',
  providers: [ScheduleCheckReportService],
})
export class ScheduleCheckReportComponent extends CustomBaseContext implements OnInit {

  plantCodeList: any[] = [];
  checkTypeList: any[] = [];
  /*  -------------------------树形选择--------------------------------- */
  public treeDataTable: any[] = []; // 产线树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'code', title: '名称', width: '200px' },
    { field: 'description', title: '描述', width: '200px' }
  ]; // 产线树形显示列
  public selection: any[] = []; // 选中项
  /*    ---------------------------------------------------------- */

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantCodeList, eventNo: 1 } },
      { field: 'resourceCodesStr', title: '资源', ui: { type: UiType.treeSelect, options: this.treeDataTable, columns: this.treeNodeColumns, selection: [], keyField: 'ID', valueField: 'CODE', valueLevel: 1 } },
      { field: 'dateTimeRange', title: '排产核查时间范围', required: true, ui: { type: UiType.dateTimeRange } }],
    values: {
      plantCode: null,
      resourceCodesStr: '',
      dateTimeRange: [],
      checkType: 'ITEM'
    }
  };

  public mutexReportColumns: any[] = [
    { field: 'plantCode', headerName: '工厂', title: '工厂', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
    {
      field: 'checkType', headerName: '检核类型', title: '检核类型', width: 100, locked: true,
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
    { field: 'makeOrderNum1', headerName: '工单号1', title: '工单号1', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'fpcTime1', headerName: '开工时间1', title: '开工时间1', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'lpcTime1', headerName: '完工时间1', title: '完工时间1', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'makeOrderNum2', headerName: '工单号2', title: '工单号2', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'fpcTime2', headerName: '开工时间2', title: '开工时间2', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'lpcTime2', headerName: '完工时间2', title: '完工时间2', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'object1', headerName: '对象1', title: '对象1', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'objectDesc1', headerName: '对象1描述', title: '对象1描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'object2', headerName: '对象2', title: '对象2', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'objectDesc2', headerName: '对象2描述', title: '对象2描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'object3', headerName: '对象3', title: '对象3', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'objectDesc3', headerName: '对象3描述', title: '对象3描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'object4', headerName: '对象4', title: '对象4', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'objectDesc4', headerName: '对象4描述', title: '对象4描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'intervalTime', headerName: '最小间隔时间', title: '最小间隔时间', width: 100, locked: true, menuTabs: ['filterMenuTab'] }
  ];
  curTabColumns = [];
  /** 页签 */
  tabs = [
    { index: 1, active: true, name: '物料互斥' },
    { index: 2, active: false, name: '资源互斥' },
    { index: 3, active: false, name: '物料+资源互斥' },
    { index: 4, active: false, name: '同资源组同类别互斥' },
    { index: 5, active: false, name: '日供应能力检核' },
    { index: 6, active: false, name: ' 小时管道速率检核' }
  ];

  tabFirstFlag = Array(this.tabs.length).fill(true);
  /** 当前页签(tab) */
  selectIndex = 1;
  tabSubject = new Subject<{
    index: number;
    curColDef: any[];
    columnApi: any;
    gridApi: any;
  }>();
  // 导出
  public excelExportFileName = '物料互斥检核报表';
  expColumnsOptions: any[] = [{ field: 'CHECK_TYPE', options: this.checkTypeList }];

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public scheduleCheckReportService: ScheduleCheckReportService,
    private commonqueryService: CommonQueryService,
    private appconfig: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  public ngOnInit(): void {
    this.queryParamInit();
    this.scheduleCheckReportService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodeList.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }
  PLANT_CODE = '';
  dateTimeRange = [];
  fixed = true;
  public queryParamInit() {
    // 排产工作台按钮打开界面初始化查询条件
    if (this.selection.length > 0) {
      this.fixed = false;
      this.findDefine().ui.selection = this.selection;
      this.queryParams.values.plantCode = this.PLANT_CODE;
      const startTime = new Date(this.commonqueryService.formatDate(this.dateTimeRange[0]));
      const endTime = new Date(this.commonqueryService.formatDate(this.dateTimeRange[1]) + ' 23:59:59');
      this.queryParams.values.dateTimeRange = [startTime, endTime];
      this.tabSelect({ index: 1 });
      this.loadLine();
    } else {
      this.clear();
    }
  }
  // 重置
  public clear() {
    // 默认开始时间为当前时间，结束时间为当前时间+15天
    const tf = new Date();
    const tt = this.scheduleCheckReportService.addDays(tf, 15);

    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      resourceCodesStr: '',
      dateTimeRange: [tf, tt],
      checkType: 'ITEM'
    };

    this.selectIndex = 1;
    this.tabSelect({ index: 1 });
    this.loadLine();
    this.findDefine().ui.selection = this.selection;
  }

  loadCheckTypes() {
    if (this.queryParams.values.checkType === 'DAILY_SUPPLY_CAPACITY' || this.queryParams.values.checkType === 'HOURLY_PIPE_RATE') {
      this.scheduleCheckReportService.GetLookupByType('PS_SUPPLY_LIMIT_TYPE').subscribe(result => {
        this.checkTypeList.length = 0;
        result.Extra.forEach(d => {
          this.checkTypeList.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
    } else {
      this.scheduleCheckReportService.GetLookupByType('PS_SCHEDULE_CHECK_TYPE').subscribe(result => {
        this.checkTypeList.length = 0;
        result.Extra.forEach(d => {
          this.checkTypeList.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
    }
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.checkTypeList;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const dto = this.getQueryParams(false);
    if (this.selectIndex === 1) {
      this.commonqueryService.loadGridView({ url: this.scheduleCheckReportService.GetItemMutexUrl, method: 'POST' }, dto, this.context);
    } else if (this.selectIndex === 2) {
      this.commonqueryService.loadGridView({ url: this.scheduleCheckReportService.GetResourceMutexUrl, method: 'POST' }, dto, this.context);
    } else if (this.selectIndex === 3) {
      this.commonqueryService.loadGridView({ url: this.scheduleCheckReportService.GetItemResourceMutexUrl, method: 'POST' }, dto, this.context);
    } else if (this.selectIndex === 4) {
      this.commonqueryService.loadGridView({ url: this.scheduleCheckReportService.GetResourceGroupMutexUrl, method: 'POST' }, dto, this.context);
    } else if (this.selectIndex === 5) {
      this.commonqueryService.loadGridView({ url: this.scheduleCheckReportService.GetDailySupplyCapacityUrl, method: 'POST' }, dto, this.context);
    } else if (this.selectIndex === 6) {
      this.commonqueryService.loadGridView({ url: this.scheduleCheckReportService.GetHourlyPipeRateUrl, method: 'POST' }, dto, this.context);
    }
  }

  private getQueryParams(IsExport: boolean) {
    const dto = {
      plantCode: this.queryParams.values.plantCode,
      checkType: this.queryParams.values.checkType,
      resourceCodes: [],
      startDate: this.queryParams.values.dateTimeRange[0],
      endDate: this.queryParams.values.dateTimeRange[1],
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: IsExport
    };
    const ui = this.findDefine().ui;
    ui.selection.forEach(x => { if (x.level === ui.valueLevel) { dto.resourceCodes.push(x.code); } });
    return dto;
  }

  plantCodeChanged(event: any) {
    this.loadLine();
    this.findDefine().ui.selection = [];
  }

  // 加载资源
  loadLine() {
    console.log('loadLine');
    console.log(this.queryParams.values.plantCode);
    // 获取计划组（产线树形结构数据）
    this.scheduleCheckReportService.GetUserPlantGroupOrderByCode(this.queryParams.values.plantCode || '', '', false)
      .subscribe(result => {
        if (result.data !== undefined && result.data !== null) {
          const data = [];
          result.data.forEach(x => {
            data.push({ id: x.id, code: x.scheduleGroupCode, description: x.descriptions });
          });
          // 获取产线
          this.scheduleCheckReportService.GetUserPlantGroupLineOrderByCode(this.queryParams.values.plantCode || '', '', false)
            .subscribe(result2 => {
              if (result2.data !== undefined && result2.data !== null) {
                // 根据计划组编码匹配产线子节点数据
                data.forEach(x => {
                  const items = result2.data.filter(d => d.scheduleGroupCode === x.code);
                  if (items !== undefined && items !== null)
                    x.children = [];
                  items.forEach(i => { x.children.push({ id: i.id, code: i.resourceCode, description: i.descriptions }); });
                });
                this.findDefine().ui.options = data; // 注意：数据加载完再赋值

                // 数字化工作台默认选项
                // if (this.pGridSelection !== undefined && this.loadSelection) {
                //   const item = result2.Extra.find(d => d.RESOURCE_CODE === this.pGridSelectRow.RESOURCE_CODE);
                //   this.pGridSelection.push({ ID: item.ID, CODE: item.RESOURCE_CODE, DESCRIPTION: item.DESCRIPTIONS, level: 1 });
                //   this.findDefine().ui.selection = this.pGridSelection;
                //   this.loadSelection = false;
                //   const that = this;
                //   // 延时0.1秒避免内容被清除
                //   setTimeout(function () { that.queryParams.values.ResourceCodesStr = item.RESOURCE_CODE; that.queryCommon(); }, 100);
                // }
              }
            });
        }
      });
  }

  // 返回指定field的参数定义项,找不到时返回undefined
  public findDefine(field: string = 'ResourceCodesStr'): QueryParamDefineObject {
    const result = this.queryParams.defines.find(x => x.field === field);
    return result;
  }

  tabSelect(arg: any): void {
    if (arg.index == null) {
      this.selectIndex = 1;
    } else {
      this.selectIndex = arg.index;
    }

    this.curTabColumns = [
      { field: 'plantCode', headerName: '工厂', title: '工厂', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
      {
        field: 'checkType', headerName: '检核类型', title: '检核类型', width: 100, locked: true,
        valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
      },
      { field: 'makeOrderNum1', headerName: '工单号1', title: '工单号1', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'fpcTime1', headerName: '开工时间1', title: '开工时间1', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'lpcTime1', headerName: '完工时间1', title: '完工时间1', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'makeOrderNum2', headerName: '工单号2', title: '工单号2', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'fpcTime2', headerName: '开工时间2', title: '开工时间2', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'lpcTime2', headerName: '完工时间2', title: '完工时间2', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'object1', headerName: '对象1', title: '对象1', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'objectDesc1', headerName: '对象1描述', title: '对象1描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'object2', headerName: '对象2', title: '对象2', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'objectDesc2', headerName: '对象2描述', title: '对象2描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'object3', headerName: '对象3', title: '对象3', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'objectDesc3', headerName: '对象3描述', title: '对象3描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'object4', headerName: '对象4', title: '对象4', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'objectDesc4', headerName: '对象4描述', title: '对象4描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
      { field: 'intervalTime', headerName: '最小间隔时间', title: '最小间隔时间', width: 100, locked: true, menuTabs: ['filterMenuTab'] }
    ];

    if (this.selectIndex === 1) {
      this.queryParams.values.checkType = 'ITEM';
      Promise.resolve(null).then(() => this.excelExportFileName = '物料互斥检核报表');
    } else if (this.selectIndex === 2) {
      this.queryParams.values.checkType = 'RESOURCE';
      Promise.resolve(null).then(() => this.excelExportFileName = '资源互斥检核报表');
    } else if (this.selectIndex === 3) {
      this.queryParams.values.checkType = 'ITEM_RESOURCE';
      Promise.resolve(null).then(() => this.excelExportFileName = '物料资源互斥检核报表');
    } else if (this.selectIndex === 4) {
      this.queryParams.values.checkType = 'RESOURCE_GROUP';
      Promise.resolve(null).then(() => this.excelExportFileName = '同资源组同类别互斥检核报表');
    } else if (this.selectIndex === 5) {
      this.curTabColumns = [
        { field: 'plantCode', headerName: '工厂', title: '工厂', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
        {
          field: 'checkType', headerName: '检核类型', title: '检核类型', width: 100, locked: true,
          valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
        },
        { field: 'scheduleGroupCodes', headerName: '适用计划组编码', title: '适用计划组编码', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'scheduleGroupDescs', headerName: '适用计划组描述', title: '适用计划组描述', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'itemCodes', headerName: '适用物料编码', title: '适用物料编码', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'itemDescs', headerName: '适用物料描述', title: '适用物料描述', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'supplyDateString', headerName: '供应日期', title: '供应日期', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'limitCapacity', headerName: '最大配兑能力', title: '最大配兑能力', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'requirementCapacity', headerName: '需求能力', title: '需求能力', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
      ];
      this.queryParams.values.checkType = 'DAILY_SUPPLY_CAPACITY';
      Promise.resolve(null).then(() => this.excelExportFileName = '日供应能力检核报表');
    } else if (this.selectIndex === 6) {
      this.curTabColumns = [
        { field: 'plantCode', headerName: '工厂', title: '工厂', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
        {
          field: 'checkType', headerName: '检核类型', title: '检核类型', width: 100, locked: true,
          valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
        },
        { field: 'scheduleGroupCodes', headerName: '适用计划组编码', title: '适用计划组编码', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'scheduleGroupDescs', headerName: '适用计划组描述', title: '适用计划组描述', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'itemCodes', headerName: '适用物料编码', title: '适用物料编码', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'itemDescs', headerName: '适用物料描述', title: '适用物料描述', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'supplyDateString', headerName: '供应日期', title: '供应日期', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'limitCapacity', headerName: '最大管道速率（H）', title: '最大管道速率（H）', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'resourceCodes', headerName: '产线来源编码', title: '产线来源编码', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour1', headerName: '0至1点', title: '0至1点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour2', headerName: '1至2点', title: '1至2点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour3', headerName: '2至3点', title: '2至3点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour4', headerName: '3至4点', title: '3至4点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour5', headerName: '4至5点', title: '4至5点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour6', headerName: '5至6点', title: '5至6点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour7', headerName: '6至7点', title: '6至7点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour8', headerName: '7至8点', title: '7至8点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour9', headerName: '8至9点', title: '8至9点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour10', headerName: '9至10点', title: '9至10点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour11', headerName: '10至11点', title: '10至11点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour12', headerName: '11至12点', title: '11至12点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour13', headerName: '12至13点', title: '12至13点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour14', headerName: '13至14点', title: '13至14点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour15', headerName: '14至15点', title: '14至15点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour16', headerName: '15至16点', title: '15至16点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour17', headerName: '16至17点', title: '16至17点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour18', headerName: '17至18点', title: '17至18点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour19', headerName: '18至19点', title: '18至19点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour20', headerName: '19至20点', title: '19至20点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour21', headerName: '20至21点', title: '20至21点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'Hour22', headerName: '21至22点', title: '21至22点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour23', headerName: '22至23点', title: '22至23点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
        { field: 'hour24', headerName: '23至24点', title: '23至24点', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
      ];
      this.queryParams.values.checkType = 'HOURLY_PIPE_RATE';
      Promise.resolve(null).then(() => this.excelExportFileName = '小时管道速率检核报表');
      this.initGridWidth();
    }

    this.tabSubject.next({
      index: this.selectIndex,
      curColDef: this.curTabColumns,
      columnApi: this.gridColumnApi,
      gridApi: this.gridApi,
    });
    this.gridApi.redrawRows();

    this.loadCheckTypes();

    this.queryCommon();
    this.initGridWidth();
  }

  public getRowStyle = function (params) {
    if ((params.context.selectIndex === 5 || params.context.selectIndex === 6) && params.node.data.LIMIT_CAPACITY < params.node.data.REQUIREMENT_CAPACITY) {
      return { 'background-color': 'red' };
    }

    return null;
  };

  // 导出
  @ViewChild('mutexReportExcelexport', { static: true }) mutexReportExcelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = this.getQueryParams(true);
    if (this.selectIndex === 1) {
      this.commonqueryService.export({ url: this.scheduleCheckReportService.GetItemMutexUrl, method: 'POST' }, dto, this.mutexReportExcelexport, this.context);
    } else if (this.selectIndex === 2) {
      this.commonqueryService.export({ url: this.scheduleCheckReportService.GetResourceMutexUrl, method: 'POST' }, dto, this.mutexReportExcelexport, this.context);
    } else if (this.selectIndex === 3) {
      this.commonqueryService.export({ url: this.scheduleCheckReportService.GetItemResourceMutexUrl, method: 'POST' }, dto, this.mutexReportExcelexport, this.context);
    } else if (this.selectIndex === 4) {
      this.commonqueryService.export({ url: this.scheduleCheckReportService.GetResourceGroupMutexUrl, method: 'POST' }, dto, this.mutexReportExcelexport, this.context);
    } // else if (this.selectIndex === 5) {
    //   this.commonqueryService.loadGridView({ url: this.scheduleCheckReportService.QueryUrl, method: 'POST' }, dto, this.context);
    // } else if (this.selectIndex === 6) {
    //   this.commonqueryService.loadGridView({ url: this.scheduleCheckReportService.QueryUrl, method: 'POST' }, dto, this.context);
    // }
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
