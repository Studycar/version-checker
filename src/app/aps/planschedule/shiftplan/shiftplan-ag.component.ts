import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType, QueryParamDefineObject } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-shiftplan-ag',
  templateUrl: './shiftplan-ag.component.html',
  providers: [QueryService]
})
export class PlanscheduleShiftplanAgComponent extends CustomBaseContext implements OnInit {
  // 显示页面标题，弹出方式打开时显示
  public pShowTitle = false;
  // 数字化工作台选中行
  public pGridSelectRow: any;
  // 数字化工作台默认产线树选项
  public pGridSelection: any[];
  public loadSelection = false;
  showButton: Boolean = true;

  public view = {
    data: [],
    total: 0
  };
  public gridHeight = 400;
  public totalCount = 0;
  public context = this;
  public plantOptions: any[] = [];
  public lineOptions: any[] = [];
  yesOrNo: any[] = [];
  statusOptions: any[] = [];
  unitOptions: any[] = [];
  demandOrderTypes: any[] = [];
  kitFlagTypes: any[] = [];
  surfaceOptions: any[] = [];
  steelTypeOptions: any[] = [];
  productCategoryOptions: any[] = [];
  needSiteCutOptions: any[] = [
    {
      label: '切',
      value: 1,
    },
    {
      label: '不切',
      value: 0,
    },
  ];

  /*  -------------------------树形选择--------------------------------- */
  public treeDataTable: any[] = []; // 产线树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'code', title: '名称', width: '200px' },
    { field: 'description', title: '描述', width: '200px' }
  ]; // 产线树形显示列
  public selection: any[] = []; // 选中项
  /*    ---------------------------------------------------------- */

  public now = new Date(); // 当前时间
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 } },
      { field: 'lineIdsStr', title: '资源', ui: { type: UiType.treeSelect, options: this.treeDataTable, columns: this.treeNodeColumns, selection: [], keyField: 'id', valueField: 'description', valueLevel: 1 } },
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
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCodeDescriptions', headerName: '计划组描述', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCodeDescriptions', headerName: '资源描述', menuTabs: ['filterMenuTab'] },
    { field: 'makeOrderNum', headerName: '工单号', width: 130, pinned: 'left', lockPinned: true, menuTabs: ['filterMenuTab'] },
    { field: 'platformModel', headerName: '产品型号', width: 120, pinned: 'left', lockPinned: true, menuTabs: ['filterMenuTab'] },
    { field: 'stockCode', headerName: '产品编码', width: 120, pinned: 'left', lockPinned: true, menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'makeOrderStatus', headerName: '工单状态', width: 100, menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,7).label' },
    {
      field: 'needSideCut', width: 100, headerName: '切边标识',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'stockName', width: 100, headerName: '产品描述',
    },
    {
      field: 'steelType', width: 100, headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'standards', width: 100, headerName: '规格',
    },
    {
      field: 'surface', width: 100, headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,8).label',
    },
    {
      field: 'routeId', width: 100, headerName: '路径标识',
    },
    {
      field: 'manufRoute', width: 100, headerName: '制造路径',
    },
    {
      field: 'productCategory', width: 100, headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,9).label',
    },
    {
      field: 'length', width: 100, headerName: '长度',
    },
    {
      field: 'width', width: 100, headerName: '宽度',
    },
    { field: 'moQty', headerName: '工单数量', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'completeQty', headerName: '完工数量', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'leftQty', headerName: '剩余数量', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'rate', headerName: '速率', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'switchTime', headerName: '切换小时', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'fpcTime', headerName: '开始时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'lpcTime', headerName: '结束时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'demandDate', headerName: '需求时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'shiftIntervalName', headerName: '班次', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'comments', headerName: '备注', width: 150, tooltipField: 'COMMENTS', menuTabs: ['filterMenuTab'] },
    { field: 'unitOfMeasure', headerName: '单位', width: 80, menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,4).label' },
    { field: 'standardFlagName', headerName: '标准类型', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'makeOrderTypeName', headerName: '工单类型', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'topMoNum', headerName: '顶层工单', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'topFpcTime', headerName: '顶层工单开始时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'topMakeOrderStatus', headerName: '顶层工单状态', width: 120, menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,7).label' },
    { field: 'parentMoNum', headerName: '父层工单号', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'parentFpcTime', headerName: '父工单开始时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'parentMakeOrderStatus', headerName: '父工单状态', width: 120, menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,7).label' },
    { field: 'projectNumber', headerName: '项目号', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'customerName', headerName: '客户名称', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'reqNumber', headerName: '需求订单号', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'reqLineNum', headerName: '需求订单行号', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'reqType', headerName: '需求订单类型', width: 120, menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1).label' },
    { field: 'inspectionTime', headerName: '验货时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'bondedFlag', headerName: '是否保税', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'releasedDate', headerName: '发放时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'fixScheduleTime', headerName: '固定时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'fpsTime', headerName: '首件开始时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'fpcTime', headerName: '首件完成时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'lpsTime', headerName: '末件开始时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'lpcTime', headerName: '末件完成时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'fulfillTime', headerName: '最终完成时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'earliestStartTime', headerName: '生产最早开始时间', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'mouldCode', headerName: '模具', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'backlogFlag', headerName: '尾数标识', width: 100, menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,3).label' }
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
    this.gridData = [];
  }

  ngOnInit() {
    this.defaultColDef.sortable = false;
    this.defaultColDef.filter = false;;
    // 加载工厂
    this.commonQueryService.GetUserPlant()
      .subscribe(result => {
        this.plantOptions.length = 0;
        result.Extra.forEach(d => {
          this.plantOptions.push({ value: d.plantCode, label: `${d.plantCode}(${d.descriptions})` });
        });
      });
    this.clear();
    // 数字化工作台传参初始化
    if (this.pShowTitle && this.pGridSelectRow !== undefined) {
      this.queryParams.values.plantCode = this.pGridSelectRow.plantCode;
      this.pGridSelection = [];
      this.loadSelection = true;
      this.showButton = false;
      this.gridHeight = 350;
      this.query();
    }
    // 加载资源
    this.loadLine();
    // this.queryCommon();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    })
  }

  async loadOptions() {
    await this.commonQueryService.GetLookupByTypeRefZip({
      'PP_PLN_ORDER_TYPE': this.demandOrderTypes,
      'PS_MAKE_ORDER_STATUS': this.statusOptions,
      'FND_YES_NO': this.yesOrNo,
      'PC_KIT_STATUS': this.kitFlagTypes,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
    })
  }

  // 切换工厂
  plantChange(value: any) {
    // 加载资源
    this.loadLine();
  }
  // 加载资源
  loadLine() {
    // 获取计划组（产线树形结构数据）
    this.commonQueryService.GetUserPlantGroup(this.queryParams.values.plantCode || '')
      .subscribe(result => {
        if (result.Extra !== undefined && result.Extra !== null) {
          const data = [];
          result.Extra.forEach(x => {
            data.push({ id: x.id, code: x.scheduleGroupCode, description: x.descriptions });
          });
          // 获取产线
          this.commonQueryService.GetUserPlantGroupLine(this.queryParams.values.plantCode || '', '')
            .subscribe(result2 => {
              if (result2.Extra !== undefined && result2.Extra !== null) {
                // 根据计划组编码匹配产线子节点数据
                data.forEach(x => {
                  const items = result2.Extra.filter(d => d.scheduleGroupCode === x.code);
                  if (items !== undefined && items !== null)
                    x.children = [];
                  items.forEach(i => { x.children.push({ id: i.id, code: i.resourceCode, description: i.descriptions }); });
                });
                this.findDefine().ui.options = data; // 注意：数据加载完再赋值

                // 数字化工作台默认选项
                if (this.pGridSelection !== undefined && this.loadSelection) {
                  const item = result2.Extra.find(d => d.resourceCode === this.pGridSelectRow.resourceCode);
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

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.demandOrderTypes;
        break;
      case 2:
        options = this.kitFlagTypes;
        break;
      case 3:
        options = this.yesOrNo;
        break;
      case 4:
        options = this.unitOptions;
        break;
      case 5:
        options = this.needSiteCutOptions;
        break;
      case 6:
        options = this.steelTypeOptions;
        break;
      case 7:
        options = this.statusOptions;
        break;
      case 8:
        options = this.surfaceOptions;
        break;
      case 9:
        options = this.productCategoryOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
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
    // setTimeout(() => {
    //   this.setLoading(true);
    // }, 100); // 延时调用，否则看不到加载状态效果
    this.setLoading(true);
    this.commonQueryService.Search(this.cloneParam()).subscribe(result => {
      if (result !== null && result.data !== null) {
        this.gridData = result.data;
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
  }

  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'reqType', options: this.demandOrderTypes },
    { field: 'backlogFlag', options: this.yesOrNo },
    { field: 'unitOfMeasure', options: this.unitOptions },
    { field: 'needSideCut', options: this.needSiteCutOptions },
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'productCategory', options: this.productCategoryOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.exportAction({ url: this.commonQueryService.exportUrl, method: 'POST' }, this.cloneParam(), this.excelexport, this);
  }
}
