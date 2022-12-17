import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType, QueryParamDefineObject } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-shiftplan',
  templateUrl: './shiftplan.component.html',
  providers: [QueryService]
})
export class PlanscheduleShiftplanComponent extends CustomBaseContext implements OnInit {
  // 显示页面标题，弹出方式打开时显示
  public pShowTitle = false;
  // 数字化工作台选中行
  public pGridSelectRow: any;
  // 数字化工作台默认产线树选项
  public pGridSelection: any[];
  public loadSelection = false;

  public view = {
    data: [],
    total: 0
  };
  public gridHeight = 400;
  public totalCount = 0;
  public context = this;
  public plantOptions: any[] = [];
  public lineOptions: any[] = [];

  // private plantCode = '';

  /*  -------------------------树形选择--------------------------------- */
  public treeDataTable: any[] = []; // 产线树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'CODE', title: '名称', width: '200px' },
    { field: 'DESCRIPTION', title: '描述', width: '200px' }
  ]; // 产线树形显示列
  public selection: any[] = []; // 选中项
  /*    ---------------------------------------------------------- */

  public now = new Date(); // 当前时间
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 } },
      // { field: 'lineIdsStr', title: '资源', ui: { type: UiType.select, options: this.lineOptions } },
      { field: 'lineIdsStr', title: '资源', ui: { type: UiType.treeSelect, options: this.treeDataTable, columns: this.treeNodeColumns, selection: [], keyField: 'ID', valueField: 'CODE', valueLevel: 1 } },
      { field: 'dateTimeRange', title: '时间范围', ui: { type: UiType.dateTimeRange } }
      /*  { field: 'startTime', title: '开始时间', ui: { type: UiType.datetime } },
      { field: 'endTime', title: '结束时间', ui: { type: UiType.datetime } } */
    ],
    values: {
      plantCode: '',
      lineIdsStr: '',
      dateTimeRange: [],
      startTime: null,
      endTime: null
    },
  };
  // 返回指定field的参数定义项,找不到时返回undefined
  public findDefine(field: string = 'lineIdsStr'): QueryParamDefineObject {
    const result = this.queryParams.defines.find(x => x.field === field);
    return result;
  }
  public columns = [
    { field: 'SCHEDULE_GROUP_CODE', title: '计划组', width: 120, locked: false, ui: { showTotal: true } },
    { field: 'RESOURCE_CODE', title: '资源', width: 120, locked: false },
    { field: 'MAKE_ORDER_NUM', title: '工单号', width: 150, locked: false, ui: { tooltip: 1 } },
    { field: 'ITEM_CODE', title: '物料编码', width: 150, locked: false },
    { field: 'DESCRIPTIONS_CN', title: '物料描述', width: 150, locked: false, ui: { tooltip: 1 } },
    { field: 'MAKE_ORDER_STATUS_NAME', title: '工单状态', width: 100, locked: false },
    { field: 'MO_QTY', title: '工单数量', width: 100, locked: false },
    // { field: 'PLAN_QTY', title: '排产数量', width: 100, locked: false },
    { field: 'COMPLETE_QTY', title: '完工数量', width: 120, locked: false },
    { field: 'LEFT_QTY', title: '剩余数量', width: 120, locked: false },
    { field: 'RATE', title: '速率', width: 120, locked: false },
    { field: 'FPC_TIME', title: '开始时间', width: 170, locked: false },
    { field: 'LPC_TIME', title: '结束时间', width: 170, locked: false },
    { field: 'DEMAND_DATE', title: '需求时间', width: 170, locked: false },
    { field: 'SHIFT_INTERVAL_NAME', title: '班次', width: 120, locked: false },
    { field: 'COMMENTS', title: '备注', width: 150, locked: false, ui: { tooltip: 1 }, datebegin: true },
    { field: 'UNIT_OF_MEASURE', title: '单位', width: 80, locked: false, dateend: true },
    { field: 'STANDARD_FLAG_NAME', title: '标准类型', width: 100, locked: false },  // PS_DISCRETE_JOB_TYPE
    { field: 'MAKE_ORDER_TYPE_NAME', title: '工单类型', width: 100, locked: false },  // MAKE_ORDER_TYPE
    { field: 'TOP_MO_NUM', title: '顶层工单', width: 150, locked: false },
    { field: 'TOP_FPC_TIME', title: '顶层工单开始时间', width: 170, locked: false },
    { field: 'TOP_MAKE_ORDER_STATUS_NAME', title: '顶层工单状态', width: 120, locked: false },
    { field: 'PARENT_MO_NUM', title: '父层工单号', width: 150, locked: false },
    { field: 'PARENT_FPC_TIME', title: '父工单开始时间', width: 170, locked: false },
    { field: 'PARENT_MAKE_ORDER_STATUS_NAME', title: '父工单状态', width: 120, locked: false },
    { field: 'PROJECT_NUMBER', title: '项目号', width: 150, locked: false },
    { field: 'CUSTOMER_NAME', title: '客户名称', width: 120, locked: false },
    { field: 'REQ_NUMBER', title: '需求订单号', width: 150, locked: false },
    { field: 'REQ_LINE_NUM', title: '需求订单行号', width: 150, locked: false },
    { field: 'REQ_TYPE', title: '需求订单类型', width: 120, locked: false },
    { field: 'INSPECTION_TIME', title: '验货时间', width: 170, locked: false },
    { field: 'BONDED_FLAG', title: '是否保税', width: 120, locked: false },
    { field: 'RELEASED_DATE', title: '发放时间', width: 170, locked: false },
    { field: 'FIX_SCHEDULE_TIME', title: '固定时间', width: 170, locked: false },
    { field: 'FPS_TIME', title: '首件开始时间', width: 170, locked: false },
    { field: 'FPC_TIME', title: '首件完成时间', width: 170, locked: false },
    { field: 'LPS_TIME', title: '末件开始时间', width: 170, locked: false },
    { field: 'LPC_TIME', title: '末件完成时间', width: 170, locked: false },
    { field: 'FULFILL_TIME', title: '最终完成时间', width: 170, locked: false },
    { field: 'EARLIEST_START_TIME', title: '生产最早开始时间', width: 170, locked: false },
    { field: 'MOULD_CODE', title: '模具', width: 120, locked: false },
    { field: 'BACKLOG_FLAG', title: '尾数标识', width: 120, locked: false }
  ];
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService }); }

  ngOnInit() {
    // 加载工厂
    this.commonQueryService.GetUserPlant()
      .subscribe(result => {
        this.plantOptions.length = 0;
        result.Extra.forEach(d => {
          this.plantOptions.push({ value: d.PLANT_CODE, label: d.PLANT_CODE });
        });
      });
    this.clear();
    // 数字化工作台传参初始化
    if (this.pShowTitle && this.pGridSelectRow !== undefined) {
      this.queryParams.values.plantCode = this.pGridSelectRow.PLANT_CODE;
      // this.plantCode = this.queryParams.values.plantCode;
      this.pGridSelection = [];
      this.loadSelection = true;
    }
    // 加载资源
    this.loadLine();
    // this.queryCommon();
  }
  // 切换工厂
  plantChange(value: any) {
    // this.plantCode = value === null ? '' : value;
    // 加载资源
    this.loadLine();
  }
  // 加载资源
  loadLine() {
    // 获取计划组（产线树形结构数据）
    this.commonQueryService.GetUserPlantGroupOrderByCode(this.queryParams.values.plantCode || '')
      .subscribe(result => {
        if (result.data !== undefined && result.data !== null) {
          const data = [];
          result.data.forEach(x => {
            data.push({ id: x.id, code: x.scheduleGroupCode, description: x.descriptions });
          });
          // 获取产线
          this.commonQueryService.GetUserPlantGroupLineOrderByCode(this.queryParams.values.plantCode || '', '')
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
                if (this.pGridSelection !== undefined && this.loadSelection) {
                  const item = result2.data.find(d => d.resourceCode === this.pGridSelectRow.resourceCode);
                  this.pGridSelection.push({ id: item.id, code: item.resourceCode, description: item.descriptions, level: 1 });
                  this.findDefine().ui.selection = this.pGridSelection;
                  this.loadSelection = false;
                  const that = this;
                  // 延时0.1秒避免内容被清除
                  setTimeout(function () { that.queryParams.values.lineIdsStr = item.resourceCode; that.queryCommon(); }, 100);
                }
              }
            });
        }
      });
  }
  private cloneParam(): any {
    const dto = {
      plantCode: this.queryParams.values.plantCode,
      lineIdsStr: '',
      startTime: this.commonQueryService.formatDateTime(this.queryParams.values.dateTimeRange[0]),
      endTime: this.commonQueryService.formatDateTime(this.queryParams.values.dateTimeRange[1])
    };
    const ui = this.findDefine().ui;
    ui.selection.forEach(x => { if (x.level === ui.valueLevel) { dto.lineIdsStr += ',' + x.ID; } });
    return dto;
  }
  public query() {
    super.query();
    this.queryCommon();
  }

  public queryCommon() {
    this.dealDateColumn();
    this.setLoading(true);
    this.commonQueryService.Search(this.cloneParam()).subscribe(result => {
      if (result !== null && result.data.content !== null) {
        this.gridData = result.data.content;
        this.totalCount = this.gridData.length;
        this.view = {
          data: this.gridData,
          total: this.totalCount
        };
      }
      this.setLoading(false);
    });
  }
  // 处理日期列
  dealDateColumn() {
    const newColumns: any[] = [];
    let stop = false;
    this.columns.forEach(x => {
      if (!stop) {
        newColumns.push(x);
      }
      // 遇到日期列不再从原数组拷贝列
      if (x.datebegin === true) {
        stop = true;
        const start = new Date(this.queryParams.values.dateTimeRange[0]);
        const end = new Date(this.queryParams.values.dateTimeRange[1]);
        const days = this.commonQueryService.getDays(end, start);
        // 生成日期列
        for (let i = 0; i <= days; i++) {
          const t = this.commonQueryService.addDays(start, i);
          const dateCellTitle = 'Cell'; // 日期列字段名称前缀，必须与中间件一致
          const item = { field: dateCellTitle + this.commonQueryService.formatDate(t).replace(/-/g, ''), title: this.commonQueryService.getMonthNum(t) + '-' + this.commonQueryService.getDayNum(t), width: 120, locked: false };
          newColumns.push(item);
        }
      } else if (x.dateend === true) {
        stop = false;
        newColumns.push(x);
      }
    });
    this.columns.length = 0;
    newColumns.forEach(x => { this.columns.push(x); });
  }

  public clear() {

    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      lineIdsStr: '',
      dateTimeRange: [
        new Date(this.commonQueryService.formatDate(this.now).replace(/-/g, '/') + ' 08:00:00'),
        new Date(this.commonQueryService.formatDate(this.commonQueryService.addDays(this.now, 14)).replace(/-/g, '/') + ' 23:59:59') // 当前日期15天范围
      ],
      startTime: null,
      endTime: null
    };
    this.findDefine().ui.selection.length = 0;
  }

  // expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.exportAction({ url: this.commonQueryService.exportUrl, method: 'POST' }, this.cloneParam(), this.excelexport, this);
    // if (this.gridData != null && this.gridData.length > 0) {
    //   this.excelexport.export(this.gridData);
    // } else {
    //   this.dealDateColumn();
    //   this.commonQueryService
    //     .Export(this.cloneParam()).subscribe(resultMes => {
    //       this.excelexport.export(resultMes.Extra);
    //     });
    // }
  }
}
