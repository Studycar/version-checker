import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryParamDefineObject, UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'processSchedule-opshiftplan',
  templateUrl: './opshiftplan.component.html',
  providers: [QueryService]
})
export class ProcessScheduleOpShiftplanComponent extends CustomBaseContext implements OnInit {
  // 显示页面标题，弹出方式打开时显示
  public pShowTitle = false;
  // 数字化工作台选中行
  public pGridSelectRow: any;
  public pGridSelectRows: any[];
  // 数字化工作台默认产线树选项
  public pGridSelection: any[];
  public loadSelection = false;

  // 是否展示按钮
  showButton: Boolean = true;
  expandForm: Boolean = false;
  public view = {
    data: [],
    total: 0
  };
  public gridHeight = 400;
  public totalCount = 0;
  public context = this;
  public plantOptions: any[] = [];
  public lineOptions: any[] = [];

  /*  -------------------------树形选择--------------------------------- */
  public treeDataTable: any[] = []; // 产线树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'code', title: '名称', width: '200px' },
    { field: 'description', title: '描述', width: '200px' }
  ]; // 产线树形显示列
  public selection: any[] = []; // 选中项
  /*    ---------------------------------------------------------- */

  public now = new Date(); // 当前时间
  lineSelection = [];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 } },
      { field: 'lineIdsStr', title: '资源', ui: { type: UiType.treeSelect, options: this.treeDataTable, columns: this.treeNodeColumns, selection: this.lineSelection, keyField: 'id', valueField: 'code', valueLevel: 1 } },
      { field: 'dateTimeRange', title: '时间范围', required: true, ui: { type: UiType.dateTimeRange } }
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
    { field: 'scheduleGroupCode', headerName: '计划组', width: 100, pinned: 'left', lockPinned: true, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'resourceCode', headerName: '资源', width: 100, pinned: 'left', lockPinned: true, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'makeOrderNum', headerName: '工序工单', width: 150, pinned: 'left', lockPinned: true, menuTabs: ['filterMenuTab', 'columnsMenuTab'] }, // PROCESS_MAKE_ORDER_NUM
    { field: 'processCodeDesc', headerName: '工序描述', width: 150, pinned: 'left', lockPinned: true, menuTabs: ['filterMenuTab', 'columnsMenuTab'] }, // PROCESS_MAKE_ORDER_NUM
    { field: 'sourceMakeOrderNum', headerName: '来源工单', width: 130, pinned: 'left', lockPinned: true, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', width: 120, pinned: 'left', lockPinned: true, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'descriptionsCn', headerName: '物料描述', width: 150, tooltipField: 'descriptionsCn', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'makeOrderStatusName', headerName: '工单状态', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'moQty', headerName: '工单数量', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'completeQty', headerName: '完工数量', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'leftQty', headerName: '剩余数量', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'rate', headerName: '速率', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'fpcTime', headerName: '开始时间', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'lpcTime', headerName: '结束时间', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'demandDate', headerName: '需求时间', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'shiftIntervalName', headerName: '班次', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'comments', headerName: '备注', width: 150, tooltipField: 'comments', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'unitOfMeasure', headerName: '单位', width: 80, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'standardFlagName', headerName: '标准类型', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'makeOrderTypeName', headerName: '工单类型', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'topProcessMoNum', headerName: '顶层工序MO号', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'topFpcTime', headerName: '顶层工序MO开始时间', width: 170, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'topMakeOrderStatusName', headerName: '顶层工序MO状态', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'parentProcessMoNum', headerName: '父层工序MO号', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'parentFpcTime', headerName: '父层工序MO开始时间', width: 170, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'parentMakeOrderStatusName', headerName: '父层工序MO状态', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'projectNumber', headerName: '项目号', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqNumber', headerName: '需求订单号', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqLineNum', headerName: '需求订单行号', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqType', headerName: '需求订单类型', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'releasedDate', headerName: '发放时间', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'fixScheduleTime', headerName: '固定时间', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'fulfillTime', headerName: '最终完成时间', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'earliestStartTime', headerName: '生产最早开始时间', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'mouldCode', headerName: '模具', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'backlogFlag', headerName: '尾数标识', width: 100, menuTabs: ['filterMenuTab', 'columnsMenuTab'] }
  ];
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
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.defaultColDef.sortable = false;;
    this.gridData = [];
    // 加载工厂
    this.commonQueryService.GetUserPlant()
      .subscribe(result => {
        this.plantOptions.length = 0;
        result.Extra.forEach(d => {
          this.plantOptions.push({ value: d.plantCode, label: d.plantCode });
        });
      });
    this.clear();
    // 数字化工作台传参初始化
    if (this.pShowTitle && this.pGridSelectRow !== undefined) {
      if (this.pGridSelectRows === undefined || this.pGridSelectRows.length === 0) {
        this.pGridSelectRows = [this.pGridSelectRow];
      }
      this.queryParams.values.plantCode = this.pGridSelectRows[0].plantCode;
      this.pGridSelection = [];
      this.loadSelection = true;
      this.showButton = false;
      this.gridHeight = 300;
    }
    // 加载资源
    this.loadLine();
    // this.queryCommon();
  }
  // 切换工厂
  plantChange(value: any) {
    // 加载资源
    this.loadLine();
  }
  // 加载资源
  loadLine() {
    // 获取计划组（产线树形结构数据）
    this.commonQueryService.GetUserPlantGroupOrderByCode(this.queryParams.values.plantCode || '', '', true)
      .subscribe(result => {
        if (result.extra !== undefined && result.extra !== null) {
          const data = [];
          result.extra.forEach(x => {
            data.push({ id: x.id, code: x.scheduleGroupCode, description: x.descriptions });
          });
          // 获取产线
          this.commonQueryService.GetUserPlantGroupLineOrderByCode(this.queryParams.values.plantCode || '', '', true)
            .subscribe(result2 => {
              if (result2.extra !== undefined && result2.extra !== null) {
                // 根据计划组编码匹配产线子节点数据
                data.forEach(x => {
                  const items = result2.extra.filter(d => d.scheduleGroupCode === x.code);
                  if (items !== undefined && items !== null)
                    x.children = [];
                  items.forEach(i => { x.children.push({ id: i.id, code: i.resourceCode, description: i.descriptions }); });
                });
                this.findDefine().ui.options = data; // 注意：数据加载完再赋值
                this.treeDataTable = data;

                // 数字化工作台默认选项
                if (this.pGridSelection !== undefined && this.loadSelection) {
                  this.pGridSelection.length = 0;
                  let lineIdsStr = '';
                  this.pGridSelectRows.forEach(pGridSelectRow => {
                    if (this.pGridSelection.findIndex(sl => sl.code === pGridSelectRow.resourceCode) === -1) {
                      const item = result2.extra.find(d => d.resourceCode === pGridSelectRow.resourceCode);
                      this.pGridSelection.push({ id: item.id, code: item.resourceCode, description: item.descriptions, level: 1 });
                      lineIdsStr += ',' + item.resourceCode;
                    }
                  });
                  this.findDefine().ui.selection = this.pGridSelection;
                  this.lineSelection = this.pGridSelection;
                  // this.loadSelection = false;
                  const that = this;
                  // 延时0.1秒避免内容被清除
                  setTimeout(function () { that.queryParams.values.lineIdsStr = lineIdsStr.substring(1, lineIdsStr.length - 1); that.queryCommon(); }, 100);
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
    ui.selection.forEach(x => { if (x.level === ui.valueLevel) { dto.lineIdsStr += ',' + x.id; } });
    return dto;
  }
  public query() {
    super.query();
    this.queryCommon();
  }

  public queryCommon() {
    this.dealDateColumn();
    this.gridApi.refreshHeader(); // 重绘
    this.setLoading(true);
    this.commonQueryService.Search(this.cloneParam()).subscribe(result => {
      if (result !== null && result.data !== null) {
        this.gridData = result.data;
        this.totalCount = this.gridData.length;
        this.view = {
          data: this.gridData,
          total: this.totalCount
        };
      } else {
        this.setLoading(false);
      }
    });
  }
  // 处理日期列
  dealDateColumn() {
    const newColumns: any[] = [];
    this.columns.forEach(x => {
      const dateCellTitle = 'Cell'; // 日期列字段名称前缀，必须与中间件一致
      if (x.field.indexOf(dateCellTitle) === -1) {
        newColumns.push(x);
      }
      // 遇到日期列不再从原数组拷贝列
      if (x.field === 'comments') {// 日期开始列
        const start = new Date(this.queryParams.values.dateTimeRange[0]);
        const end = new Date(this.queryParams.values.dateTimeRange[1]);
        const days = this.commonQueryService.getDays(end, start);
        // 生成日期列
        for (let i = 0; i <= days; i++) {
          const t = this.commonQueryService.addDays(start, i);
          const item = { field: dateCellTitle + this.commonQueryService.formatDate(t).replace(/-/g, ''), headerName: this.commonQueryService.getMonthNum(t) + '-' + this.commonQueryService.getDayNum(t), width: 100 };
          newColumns.push(item);
        }
      }
    });

    // newColumns.forEach(x => { x['suppressMovable'] = true; }); // 禁用列拖动
    this.columns = this.clone(newColumns);
    this.expColumns = this.columns;
    // this.gridApi.setColumnDefs(this.columns);
  }

  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      lineIdsStr: '',
      dateTimeRange: [
        new Date(this.commonQueryService.formatDate(this.now).replace(/-/g, '/') + ' 07:50:00'),
        new Date(this.commonQueryService.formatDate(this.commonQueryService.addDays(this.now, 14)).replace(/-/g, '/') + ' 23:59:59') // 当前日期15天范围
      ],
      startTime: null,
      endTime: null
    };
    this.findDefine().ui.selection.length = 0;
    this.loadLine();
  }

  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.exportAction({ url: this.commonQueryService.exportUrl, method: 'POST' }, this.cloneParam(), this.excelexport, this);
  }
}
