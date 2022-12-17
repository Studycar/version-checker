import { sharePlanOrderComponent } from './plan-order/plan-order.component';
/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:09:03
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-15 15:09:03
 * @Note: ...
 */
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent } from '@delon/abc';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { process } from '@progress/kendo-data-query';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import {
  RowClassArgs,
  SelectableSettings,
  GridDataResult,
} from '../../../../../node_modules/@progress/kendo-angular-grid';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { ShareIssuedWorkbenchService } from '../../../modules/generated_module/services/share-issued-workbench-service';
import { ViewDetailComponent } from './view/viewDetail.component';
import { BasePsbomViewComponent } from '../../base/psbom/view/view.component';
import { ViewComponent } from './view/view.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ActivatedRoute } from '@angular/router';
import { InventoryDetailComponent } from '../../demand-order-management/inventory-calculation/detail/detail.component';
import { EditService } from '../../plant-model/mobatchrelease/edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'share-plan-share-issued-workbench',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './share-issued-workbench.component.html',
  providers: [QueryService, ShareIssuedWorkbenchService, EditService],
  styles: [
    `
      .k-grid .no-padding {
        padding: 0;
      }
      .whole-cell {
        display: block;
        padding: 0;
        margin: 0;
      }
      .redCellStyle {
        color: red;
      }
      .blueCellStyle {
        color: blue;
      }
      .editCellStyle {
        color: #F6A52C;
      }
      .gPlanCodeColumn {
        background-color: Yellow;
      }
      .sPlanCodeColumn {
        background-color: Green;
      }
      .bPlanCodeColumn {
        background-color: LightGreen;
      }
      .gyPlanCodeColumn {
        background-color: LightGray;
      }
      .focusCellStye {
        color: blue;
      }
      .backColor0 {
        background-color: #ffffff !important;
      }
      .backColor1 {
        background-color: #f5f7fa !important;
      }
      .cell-span {
        background-color: #ffffff;
      }
      .show-cell {
        background: white;
        border-left: 1px solid lightgrey !important;
        border-right: 1px solid lightgrey !important;
        border-bottom: 1px solid lightgrey !important;
      }
      .texStyle {
        line-height: 100px;
      }
    `,
  ],
})
export class SharePlanShareIssuedWorkbenchComponent extends CustomBaseContext implements OnInit {
  expandForm = false;
  firstQueryFlag = true;
  organizationids: any[] = [];
  prodGroups: any[] = [];
  searchParans: any = {};
  dateRange: any[] = [];
  lastDateRange: any[] = [];
  gridData: any[] = [];
  listMakeBuy: any[] = [];
  dtPlan: any[] = [];
  planOrderPlantCode: string;
  planOrderMoNumber: string;
  planOrderLpcTime: any;
  totalCount = 0;
  selectableSettings: SelectableSettings;
  // 工厂
  public plantCodes: any[] = [];
  public optionListProductLine: Set<any> = new Set();
  selectionKeys: any[] = [];
  extendColumns: any[] = []; // 日期扩展列
  redColumnHeaders: any[] = [];
  listScheduleGroup: any[] = [];
  gridRowEditStyle = { height: '25px' };
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100',
    },
  ];
  staticColumns = [
    {
      field: 'plantCode',
      title: '工厂',
      width: 70,
      locked: true,
      merge: true,
    },
    {
      field: 'itemCode',
      title: '物料编码',
      width: 130,
      locked: true,
      merge: true,
    },
    { field: 'descriptions', title: '物料描述', width: 100, merge: true },
    { field: 'onhandQuantity', title: '现有量', width: 100, merge: true },
    { field: 'resourceCode', title: '生产线', width: 160, merge: true },
    { field: 'attribute1', title: 'BOM材料', width: 120, merge: true },
    { field: 'attribute2', title: '配料含量', width: 120, merge: true },
    { field: 'attribute3', title: '系数', width: 120, merge: true },
    { field: 'techVersion', title: '工艺版本', width: 160, merge: true },
    { field: 'remark', title: '备注', width: 100, merge: true },
    { field: 'supplyTypeName', title: '类型', width: 100, merge: false },
    { field: 'beginning', title: '期初', width: 100, merge: false },
  ];
  isRowSelectable;
  expColumns: any[] = [];
  dtSave: any[] = [];
  // 工序版本
  opVersion: any[] = [];
  components;
  formGroup: FormGroup;
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  queryParams = {
    defines: [
      {
        field: 'strPlantCode',
        title: '工厂',
        required: true,
        ui: { type: UiType.select, options: this.organizationids, eventNo: 1 },
      },
      {
        field: 'strProdGroup',
        title: '计划组',
        ui: { type: UiType.select, options: this.prodGroups, ngModelChange: this.onChangeGroup },
      },
      { field: 'productLineId', title: '资源', ui: { type: UiType.select, options: this.optionListProductLine } },
      {
        field: 'strTimeRange',
        title: '日期范围',
        required: true,
        ui: { type: UiType.dateRange },
      },
      // { field: 'strItemForm', title: '物料编码', ui: { type: UiType.text, eventNo: 2 } },
      {
        field: 'strItemForm',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 4,
        },
      },
      { field: '', title: '', required: false, ui: { type: UiType.blank }}, // 占位符，使单选框在一行
      { field: 'noZeroDemand', title: '仅显示需下达需求计划', required: false, ui: { type: UiType.checkbox } },
      { field: 'noZeroDemandFirst', title: '仅显示首日需下达需求计划', required: false, ui: { type: UiType.checkbox } },

      // { field: 'strItemTo', title: '物料编码到', ui: { type: UiType.text, eventNo: 3 } }
    ],
    values: {
      strPlantCode: this.appconfig.getPlantCode(),
      strTimeRange: [],
      strProdGroup: null,
      productLineId: '',
      scheduleGroupCode: null,
      // strItemForm: '',
      strItemForm: { value: '', text: '' },
      // strItemTo: '',
      noRelease: false,
      noZeroDemand: false,
      noZeroDemandFirst: false
    },
  };
  // 常量列
  fixColName: any[] = [
    { supplyType: 'demand', supplyTypeName: '需求量' },
    { supplyType: 'mo', supplyTypeName: '工单' },
    { supplyType: 'plan', supplyTypeName: '计划单' },
    { supplyType: 'deduce', supplyTypeName: '推演库存' },
  ];
  // 页面大小选项
  pageSizes = [20, 40, 60, 80, 100];

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private formBuilder: FormBuilder,
    private confirmationService: NzModalService,
    private shareIssuedService: ShareIssuedWorkbenchService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    public queryService: QueryService,
    public editService: EditService,
    private route: ActivatedRoute,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.components = { showCellRenderer: this.createShowCellRenderer() };
    this.defaultColDef.sortable = false;;

    this.isRowSelectable = function (rowNode) {
      return rowNode.data ? rowNode.data.spanFlag === true : false;
    };
    // this.gridOptions.rowSelection = 'single';
    this.initColumns();
  }

  inventoryCheck() {
    this.modal.static(
      InventoryDetailComponent,
      {
        params: {
          plantCode: this.queryParams.values.strPlantCode,
          startDatetime: this.queryParams.values.strTimeRange[0],
          endDatetime: this.queryParams.values.strTimeRange[1],
        }
      },
      'lg'
    ).subscribe(res => {

    });
  }

  createShowCellRenderer() {
    function ShowCellRenderer() { }
    ShowCellRenderer.prototype.init = function (params) {
      const cellBlank = !params.value;
      if (cellBlank) {
        return null;
      }
      this.ui = document.createElement('div');
      this.ui.innerHTML = '<div class="show-name">' + params.value;
    };
    ShowCellRenderer.prototype.getGui = function () {
      return this.ui;
    };
    return ShowCellRenderer;
  }


  // 组 值更新事件 重新绑定产线
  onChangeGroup(value: string): void {
    /** 重新绑定  组*/
    this.queryParams.values.productLineId = null;
    this.optionListProductLine.clear();
    if ((this.queryParams.values.strPlantCode || '') === '') return;
    this.editService.GetUserPlantGroupLine(this.queryParams.values.strPlantCode, value).subscribe(result => {
      if (result.Extra == null) {
        this.optionListProductLine.clear();
        return;
      } else {
        // 先清除，在重新绑定
        this.optionListProductLine.clear();
        result.Extra.forEach(d => {
          this.optionListProductLine.add({
            label: d.resourceCode,
            value: d.resourceCode,
          });
        });
        return;
      }
    });

  }

  ngOnInit(): void {
    // 当前用户对应工厂
    this.queryParams.values.strPlantCode = this.appconfig.getPlantCode();
    /** 初始化 组织  下拉框*/
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.organizationids.push({ value: d.plantCode, label: d.plantCode });
      });
      this.plantChange(this.queryParams.values.strPlantCode);
    });

    this.queryService.GetLookupByTypeNew('TECH_VERSION').subscribe(result => {
      result.data.forEach(d => {
        this.opVersion.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    const tf = new Date();
    const tt = this.commonQueryService.addDays(tf, 15);
    this.queryParams.values.strTimeRange = [tf, tt];
    this.query();
  }

  // 初始化列，根据查询日期
  initColumns() {
    this.columns = [
      {
        colId: 1,
        cellClass: '',
        field: 'check',
        headerName: '',
        width: 40,
        pinned: 'left',
        lockPinned: true,
        checkboxSelection: function (params) {
          return params.data.resourceExcFlag !== 'Y';
        },
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerComponentParams: {
          template: this.headerTemplate,
        },
        rowSpan: function (params) {
          if (params.data.spanFlag === true) {
            return 4;
          } else {
            return 0;
          }
        },
        cellClassRules: {
          'show-cell': function (params) {
            return params.data.spanFlag;
          },
          backColor0: function (params) {
            return params.data.spanFlag && params.data.ITEM_INDEX % 2 === 0;
          },
          backColor1: function (params) {
            return params.data.spanFlag && params.data.ITEM_INDEX % 2 !== 0;
          },
        },
        cellStyle: { 'line-height': '120px' },
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'varField',
        headerName: '主要信息',
        tooltipField: 'varField',
        pinned: 'left',
        lockPinned: true,
        width: 150,
      },
      {
        field: 'otherField',
        headerName: '其他信息',
        tooltipField: 'otherField',
        pinned: 'left',
        lockPinned: true,
        width: 130,
      },
      {
        field: 'resourceCode',
        headerName: '生产线',
        editable: true,
        pinned: 'left',
        lockPinned: true,
        width: 100,
        rowSpan: function (params) {
          if (params.data.spanFlag === true) {
            return 4;
          } else {
            return 0;
          }
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: function (params) {
          const list = params.data.resources;
          const s: any[] = [];
          list.forEach(element => {
            s.push(element.resourceCode);
          });
          return { values: s };
        },
        cellClassRules: {
          'cell-span': 'value!==undefined',
          'show-cell': 'value!==undefined',
        },
        cellStyle: { 'line-height': '120px' },
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'techVersion',
        headerName: '工艺版本',
        width: 120,
        pinned: 'left',
        lockPinned: true,
        rowSpan: function (params) {
          if (params.data.spanFlag === true) {
            return 4;
          } else {
            return 0;
          }
        },
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: function (params) {
          const list = params.data.TECHVERSION;
          const s: any[] = [];
          s.push('');
          list.forEach(element => {
            if (element.techVersion !== null && element.techVersion !== '') {
              if (s.indexOf(element.techVersion) < 0) {
                s.push(element.techVersion);
              }
            }
          });
          return { values: s };
        },
        cellClassRules: {
          'cell-span': 'value!==undefined',
          'show-cell': 'value!==undefined',
        },
        cellStyle: { 'line-height': '120px' },
        menuTabs: ['filterMenuTab'],
      },

      {
        field: 'remark',
        headerName: '备注',
        pinned: 'left',
        lockPinned: true,
        width: 120,
        rowSpan: function (params) {
          if (params.data.spanFlag === true) {
            return 4;
          } else {
            return 0;
          }
        },
        editable: true,
        cellClassRules: {
          'cell-span': 'value!==undefined',
          'show-cell': 'value!==undefined',
        },
        cellStyle: { 'line-height': '120px' },
        cellEditor: 'agLargeTextCellEditor',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'supplyTypeName',
        headerName: '类型',
        pinned: 'left',
        lockPinned: true,
        width: 100,
        menuTabs: ['filterMenuTab'],
        cellClass: function (params) {
          return params.context.getCellClass(
            params.data,
            'supplyTypeName',
            '',
          );
        },
      },
      {
        field: 'beginning',
        headerName: '期初',
        pinned: 'left',
        lockPinned: true,
        width: 100,
        menuTabs: ['filterMenuTab'],
      },
    ];

    const showAttribute = this.route.snapshot.paramMap.get('showAttribute');
    // attribute属性只在8001显示，8002不显示(默认显示)
    if (!this.isNull(showAttribute) && showAttribute === 'N') {
      const removeColumns = [
        'attribute1',
        'attribute2',
        'attribute3',
        'otherField',
      ];
      this.columns = this.columns.filter(
        t => removeColumns.findIndex(r => r === t.field) === -1,
      );
      this.staticColumns = this.staticColumns.filter(
        t => removeColumns.findIndex(r => r === t.field) === -1,
      );
    }

    this.extendColumns.forEach(col => {
      this.columns.push(col);
    });
    this.headerNameTranslate(this.columns);
  }

  selectRow: any = [];
  selectColumn: any;
  dateClick: any = null;
  public cellClickHandler(value: any) {
    this.selectRow = value.data;
    this.selectColumn = value.column.colDef.field; // .colId;
    this.gridData.forEach(dr => {
      dr.showBold = dr.itemId === this.selectRow.itemId;
    });

    // 模拟双击 两次点击时间差在1000毫秒内
    let doubleClick = false;
    if (this.dateClick == null) {
      this.dateClick = new Date();
    } else {
      const date2 = new Date();
      const date3 = date2.getTime() - this.dateClick.getTime(); // 时间差的毫秒数
      this.dateClick = new Date();
      if (date3 < 1000) doubleClick = true;
    }
    if (doubleClick) {
      const rowType = this.selectRow.supplyType;
      const plantCode = this.selectRow.plantCode;
      const itemId = this.selectRow.itemId;
      if (
        value.colDef.field === 'beginning' ||
        value.colDef.field.indexOf('COL') > -1
      ) {
        if ((rowType === 'demand' || rowType === 'mo') && value.value) {
          const param = {
            rowType: rowType,
            plantCode: plantCode,
            itemId: itemId,
            fieldName: value.colDef.field,
            titleName: value.colDef.title,
            startDate: this.searchParans.timeRangeFrom,
          };
          this.modal
            .static(ViewDetailComponent, { iParam: param }, 'lg')
            .subscribe(() => { });
        }
      }
    }

    const rowType = this.selectRow.supplyType;
    const itemId = this.selectRow.itemId;
    const strDate = value.column.colDef.title;
    if ((rowType === 'plan') && value.value) {
      const dr = this.dtPlan.find (
        p => p.itemId === itemId && p.fpcTime === strDate + ' 00:00:00',
      );
      this.planOrderPlantCode = dr.plantCode;
      this.planOrderMoNumber = dr.moNumber;
      this.planOrderLpcTime = dr.lpcTime;
    }
  }
  searchExpand() {
    this.expandForm = !this.expandForm;
    // const columnCount = 3; /* 一行列数 */
    const rows = 2; // Math.ceil((this.queryParams.defines.length + 1) / columnCount);
    const form_marginTop = 5; /* form和按钮工具栏的margin-top */
    const formHeight = rows * 39 + form_marginTop;
    if (this.expandForm) {
      this.setGridHeight({
        topMargin: this.gridHeightArg.topMargin + formHeight,
        bottomMargin: this.gridHeightArg.bottomMargin,
      });
    } else {
      this.setGridHeight({
        topMargin: this.gridHeightArg.topMargin - formHeight,
        bottomMargin: this.gridHeightArg.bottomMargin,
      });
    }
  }

  // 列是否可编辑
  cellEditState(paramIn: any) {
    return this.cellCanEdit(
      paramIn.data,
      paramIn.colDef.title,
      paramIn.colDef.field,
    );
  }

  cellCanEdit(dataItem: any, fieldTime: string, fieldCol: string): Boolean {
    const tf = new Date();
    if (
      dataItem.supplyType === 'plan' &&
      new Date(fieldTime) >= new Date(tf.toLocaleDateString())
    ) {
      return true;
    }
    return false;
  }

  public getPlanStatus(itemId: String, strDate: String): String {
    let status = '';
    const dr = this.dtPlan.find(
      p => p.itemId === itemId && p.fpcTime === strDate + ' 00:00:00',
    );
    if (dr) {
      status = dr.makeOrderStatus;
    }
    return status;
  }

  public cellCloseHandler(args: any) {
    const dataItem = args.data;
    const field = args.column.colDef.field; // .colId; // 列名
    const orgValue = args.oldValue || ''; // 旧值
    const newValue = args.newValue || ''; // 新值
    if (orgValue.toString() !== newValue.toString()) {
      // 计划数需要校验是否是数字
      const col = this.extendColumns.find(p => p.field === field);
      if (col !== undefined) {
        if (
          newValue.length > 0 &&
          (this.strToNumber(newValue).toString() === 'NaN' ||
            this.strToNumber(newValue) < 0)
        ) {
          this.msgSrv.warning(
            this.appTranslationService.translate('请输入不小于0的数字'),
          );
          dataItem[col.field] = orgValue;
          this.gridApi.refreshCells();
          return;
        }
        dataItem[col.field] = newValue;
        this.setSaveData(dataItem, args.column, true);
      } else {
        dataItem[args.column.colId] = newValue;
        if (args.column.colDef.field === 'machineNumber') {
          // 联动生产线
          dataItem.resourceCode = dataItem.resources.find(
            x => x.machineNumber === dataItem.machineNumber,
          ).resourceCode;
          // this.gridData = this.clone(this.gridData);
        } else if (args.column.colDef.field === 'techVersion') {
          // jianl修改，增加修改工艺版本的时候，联动修改资源
          const techVersion = dataItem.techVersion;
          dataItem.resources = this.calItemRoutings(
            dataItem.itemId,
            dataItem.plantCode,
            techVersion,
          );
          let resourceCode = '';
          if (dataItem.resources && dataItem.resources.length > 0) {
            resourceCode = dataItem.resources[0].resourceCode;
          }
          dataItem.resourceCode = resourceCode;
        }
        this.setSaveData(dataItem, args.column, false);
      }
      this.Save();
    }
  }

  // 设置保存数据
  setSaveData(dataItem: any, column: any, isPlan: boolean) {
    const field = column.colDef.field; // .colId; // 列名
    // 设置相同物料行的生产线和备注
    if (
      field === 'resourceCode' ||
      field === 'remark' ||
      field === 'techVersion'
    ) {
      const sameItem = this.gridData.filter(
        p => p.itemId === dataItem.itemId,
      );
      sameItem.forEach(p => {
        p.resourceCode = dataItem.resourceCode;
        p.remark = dataItem.remark;
        p.techVersion = dataItem.techVersion;
      });
    }

    // 查找保存数据
    const data = this.dtSave.find(
      p => p.itemId === dataItem.itemId && p.columnId === field,
    );
    if (data !== undefined) {
      // 已经存在
      data.newValue = dataItem[field];
      data.resourceCode = dataItem.resourceCode;
      data.remark = dataItem.remark;
      data.techVersion = dataItem.techVersion;
    } else {
      const saveData = this.getSaveData(dataItem, column, isPlan);
      this.dtSave.push(saveData);
    }
  }

  getSaveData(dataItem: any, column: any, isPlan: boolean) {
    const saveData = {
      id: dataItem.id,
      plantCode: dataItem.plantCode,
      itemId: dataItem.itemId,
      itemCode: dataItem.itemCode,
      itemDesc: dataItem.descriptions,
      resourceCode: dataItem.resourceCode,
      remark: dataItem.remark,
      techVersion: dataItem.techVersion,
      columnId: column.colDef.field, // 要保存的列名
      columnName: column.colDef.field, // 要保存的列名
      columnIdTitle: column.colDef.title, // 列描述
      newValue: dataItem[column.colDef.field], // 修改后的值
      isPlan: isPlan, // 是否是计划
    };
    if (!dataItem.spanFlag) {
      const data = this.gridData.find(
        p => p.itemId === dataItem.itemId && p.spanFlag,
      );
      if (data !== undefined) {
        saveData.resourceCode = data.resourceCode;
        saveData.remark = data.remark;
        saveData.techVersion = data.techVersion;
      }
    }
    return saveData;
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['生产线', '备注', '工艺版本'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#shareIssued');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (
          this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1
        ) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
        if (
          this.redColumnHeaders.findIndex(name => name === dom.innerHTML) > -1
        ) {
          dom.setAttribute('style', 'color: red');
        }
      });
    }
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.dtSave.length = 0;
    this.getsearchParans();
    this.setLoading(true);
    this.commonQueryService.Search(this.searchParans).subscribe(result => {
      this.setLoading(false);
      this.gridData.length = 0;
      const isChange = this.createExtendColumns();
      this.gridData = this.createDataSource(result);
      this.totalCount = result.data.totalElements;
      // this.gridApi.paginationSetPageSize(this.gridData.length);
      if (this.totalCount === 0) {
        this.lastPageNo = 1;
      }
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length, // this.gridState.take,
          filter: this.gridState.filter,
        }).data,
        total: this.totalCount,
      };
      // 添加列必须在绑定数据源后
      if (isChange) {
        this.initColumns();
      }

      setTimeout(() => {
        this.onVirtualColumnsChanged(null);
      });
    });
  }

  // 所有的工艺路线
  allItemRoutings: any;

  createExtendColumns(): Boolean {
    // 设置扩展列头{ field: 'USER_PASSWORD', title: '密码', width: 100, locked: false }
    let isChange = false;
    if (
      this.lastDateRange == null ||
      this.lastDateRange[0] !== this.searchParans.timeRangeFrom ||
      this.lastDateRange[1] !== this.searchParans.timeRangeTo
    ) {
      // 时间范围有修改
      isChange = true;
    }
    if (isChange) {
      // this.initColumns();
      this.extendColumns.length = 0;
      this.redColumnHeaders = [];
      // 加载列头
      const tt = new Date(this.searchParans.timeRangeFrom);
      const tf = new Date(this.searchParans.timeRangeTo);
      if (tt < tf) {
        for (const dt = tt; dt <= tf;) {
          const headerName = this.getHeaderName(dt);
          const fieldName = this.getFieldName(dt);
          const titleName = this.commonQueryService.formatDate(dt);
          const col = {
            field: fieldName,
            headerName: headerName,
            width: 100,
            title: titleName,
            headerTooltip:'星期六日显示红色',
            // 列编辑模式
            editable: function (params) {
              return params.context.cellEditState(params);
            },
            cellClass: function (params) {
              return params.context.getCellClass(
                params.data,
                fieldName,
                titleName,
              );
            },
          };
          this.extendColumns.push(col);
          const days = dt.getDay();
          // 列头星期六星期天显示红色
          if (days === 0 || days === 6) {
            this.redColumnHeaders.push(headerName);
          }
          dt.setDate(dt.getDate() + 1);
        }
      }
      this.lastDateRange = [
        this.searchParans.timeRangeFrom,
        this.searchParans.timeRangeTo,
      ];
      // this.showHeaderColor();
    }
    return isChange;
  }

  // 处理数据源
  createDataSource(result: any) {
    if (result == null || result.data.content == null) {
      return;
    }
    // 头数据源
    const dtHeader = result.data.content;
    // 需求、供应、计划
    const dtDemand = result.extra.demandList;
    const dtSupply = result.extra.supplyList;
    this.dtPlan = result.extra.planList;
    this.allItemRoutings = result.extra.routingList; // 工艺路线

    const _gridData = [];
    let itemIndex = -1;
    dtHeader.forEach(d => {
      itemIndex += 1;
      let demandBegin = 0;
      let supplyBegin = 0;
      let planBegin = 0;
      let k = 1;
      this.fixColName.forEach(df => {
        const dt = Object.assign({}, d);
        dt.supplyType = df.supplyType;
        dt.supplyTypeName = df.supplyTypeName;
        // 需求
        let _dtDemand = [];
        if (dt.supplyType === 'demand') {
          _dtDemand = dtDemand.filter(
            dd =>
              dd.plantCode === d.plantCode && dd.itemCode === d.itemCode,
          );
          // 计算期初
          dt.beginning = demandBegin = this.getBeginSum(
            _dtDemand,
            'demandDate',
            'demandQty',
          );
        }
        // 供应
        let _dtSupply = [];
        if (dt.supplyType === 'mo') {
          _dtSupply = dtSupply.filter(
            dd =>
              dd.plantCode === d.plantCode && dd.itemCode === d.itemCode,
          );
          dt.beginning = supplyBegin = this.getBeginSum(
            _dtSupply,
            'demandDate',
            'demandQty',
          );
        }
        // 计划
        let _dtPlan = [];
        if (dt.supplyType === 'plan') {
          _dtPlan = this.dtPlan.filter(
            dd =>
              dd.plantCode === d.plantCode && dd.itemCode === d.itemCode,
          );
          // 计算期初
          dt.beginning = planBegin = this.getBeginSum(
            _dtPlan,
            'fpcTime',
            'moQty',
          );
        }
        // 推演量
        if (dt.supplyType === 'deduce') {
          // 期初推演量=库存+供应+计划-需求
          dt.beginning =
            this.strToNumber(dt.onhandQuantity) +
            supplyBegin +
            planBegin -
            demandBegin;
        }

        const tt = new Date(this.searchParans.timeRangeFrom);
        const tf = new Date(this.searchParans.timeRangeTo);
        if (tt < tf) {
          for (const dt1 = tt; dt1 <= tf;) {
            const str = this.commonQueryService.formatDate(dt1);
            const reg = new RegExp('-', 'g'); // 创建正则RegExp对象
            const col = {
              field: 'COL' + str.replace(reg, ''),
              headerName: str,
            };
            if (dt.supplyType === 'demand') {
              // 需求
              dt[col.field] = this.getDateSum(
                _dtDemand,
                'demandDate',
                'demandQty',
                col.headerName,
              );
            }
            if (dt.supplyType === 'mo') {
              // 供应
              dt[col.field] = this.getDateSum(
                _dtSupply,
                'demandDate',
                'demandQty',
                col.headerName,
              );
            }
            if (dt.supplyType === 'plan') {
              // 计划
              dt[col.field] = this.getDateSum(
                _dtPlan,
                'fpcTime',
                'moQty',
                col.headerName,
              );
            }
            dt1.setDate(dt1.getDate() + 1);
          }
        }

        if (!this.searchParans.isExport) {
          // 不是导出的时候需要根据物料加载工艺路线
          dt['resources'] = this.calItemRoutings(
            dt.itemId,
            dt.plantCode,
            dt.techVersion,
          );
          dt['TECHVERSION'] = this.calItemRoutingsVersion(
            dt.itemId,
            dt.plantCode,
          );
          dt['showBold'] = false;
        }
        dt['itemIndex'] = itemIndex; // 用于隔行变色
        dt.otherField =
          'BOM材料：' +
          (dt.attribute1 !== undefined && dt.attribute1 !== null
            ? dt.attribute1
            : '');
        dt.spanFlag = true;
        dt.varField = dt.plantCode;
        if (k === 2) {
          dt.spanFlag = false;
          dt.varField = dt.itemCode;
          dt.resourceCode = undefined;
          dt.remark = undefined;
          dt.techVersion = undefined;
          dt.otherField =
            '配料含量：' +
            (dt.attribute2 !== undefined && dt.attribute2 !== null
              ? dt.attribute2
              : '');
        }
        if (k === 3) {
          dt.spanFlag = false;
          dt.varField = dt.descriptions;
          dt.resourceCode = undefined;
          dt.remark = undefined;
          dt.techVersion = undefined;
          // dt.otherField = '系数：' + (dt.ATTRIBUTE3 !== undefined && dt.ATTRIBUTE3 !== null ? dt.ATTRIBUTE3 : '');
          dt.otherField = undefined;
        }
        if (k === 4) {
          dt.spanFlag = false;
          dt.varField = '现有量：' + dt.onhandQuantity;
          dt.resourceCode = undefined;
          dt.remark = undefined;
          dt.techVersion = undefined;
          dt.otherField = undefined;
        }
        k++;
        _gridData.push(dt);
      });
    });

    // 计算推演量
    this.calDeduce(_gridData, '');
    return _gridData;
  }

  // 列头样式：MM-DD班次号(星期)，如：04-10天(一)
  weekDays = this.appTranslationService.translate('日一二三四五六');
  private getHeaderName(date: Date) {
    const str = this.commonQueryService.formatDate(date);
    return str.substring(5) + '(' + this.weekDays.charAt(date.getDay()) + ')';
  }

  private getFieldName(date: Date) {
    const reg = new RegExp('-', 'g'); // 创建正则RegExp对象
    const str = this.commonQueryService.formatDate(date).replace(reg, '');
    return 'COL' + str;
  }

  // 获取期初数
  getBeginSum(dataSet: any, dateColName: string, qtyColName: string) {
    let retQty = 0;
    dataSet.forEach(dd => {
      if (
        this.commonQueryService.CompareDate(
          dd[dateColName],
          this.searchParans.timeRangeFrom + ' 00:00:00',
        ) < 0
      )
        retQty = retQty + this.strToNumber(dd[qtyColName]);
    });
    return retQty;
  }

  // 获取特定日期数
  getDateSum(
    dataSet: any,
    dateColName: string,
    qtyColName: string,
    colName: string,
  ) {
    let retQty = null;
    dataSet.forEach(dd => {
      if (
        this.commonQueryService.formatDate(new Date(dd[dateColName])) ===
        colName
      ) {
        retQty = this.strToNumber(retQty) + this.strToNumber(dd[qtyColName]);
      }
    });
    return retQty;
  }

  // 筛选工艺路线
  calItemRoutings(itemId: String, plantCode: String, techVersion: string) {
    const dt = [];
    if (techVersion === '') {
      techVersion = null;
    }
    // let hasResource = false; // 是否包含当前生产线
    this.allItemRoutings.forEach(it => {
      if (
        it.itemId === itemId &&
        it.plantCode === plantCode &&
        it.techVersion === techVersion
      )
        dt.push(it);
    });
    return dt;
  }

  // 筛选工艺版本
  calItemRoutingsVersion(itemId: String, plantCode: String) {
    const dt = [];
    // let hasResource = false; // 是否包含当前生产线
    this.allItemRoutings.forEach(it => {
      if (it.itemId === itemId && it.plantCode === plantCode) dt.push(it);
    });
    return dt;
  }

  // grid 设置行样式
  public getRowClass = function (params) {
    // 根据物料隔行变色
    if (params.data.ITEM_INDEX % 2 === 0) {
      return 'backColor0';
    } else {
      return 'backColor1';
    }
  };

  getCellClass(dataItem: any, field: string, fieldTime: string): String {
    // 负数显示红色
    if (this.strToNumber(dataItem[field]) < 0) {
      return 'redCellStyle'; // { 'redCellStyle': true };
    }

    // 类型
    if (field === 'supplyTypeName' && dataItem.supplyType === 'plan') {
      return 'blueCellStyle';
    }

    if (dataItem.supplyType === 'plan' && !this.isNull(fieldTime)) {
      // 判断计划单状态
      const status = this.getPlanStatus(dataItem.itemId, fieldTime);
      if (status === 'G') {
        return 'gPlanCodeColumn';
      }
      if (status === 'B') {
        return 'bPlanCodeColumn';
      }
      if (status === 'S') {
        return 'sPlanCodeColumn';
      }
      if (!this.cellCanEdit(dataItem, fieldTime, field)) {
        return 'gyPlanCodeColumn';
      }
    }
    return '';
  }

  // 计算推演量
  calDeduce(gvDate: any, item: String) {
    if (gvDate == null || gvDate.length === 0) return;
    let lastDeduce = 0;
    let rowIndex = 0;
    gvDate.forEach(gd => {
      // 循环数据
      if (
        gd.supplyType === 'deduce' &&
        (item.length === 0 || gd.itemId === item)
      ) {
        // 期初推演量
        lastDeduce = gd.beginning;
        this.extendColumns.forEach(ec => {
          // 循环日期
          // 非期初推演库存 = 前一日推演库存 + 工单量 + 计划单 - 需求量
          const val =
            this.strToNumber(lastDeduce) +
            this.strToNumber(gvDate[rowIndex - 2][ec.field]) +
            this.strToNumber(gvDate[rowIndex - 1][ec.field]) -
            this.strToNumber(gvDate[rowIndex - 3][ec.field]);
          gd[ec.field] = val;
          lastDeduce = val;
        });
      }
      rowIndex = rowIndex + 1;
    });
  }

  strToNumber(str: any) {
    if (str == null || str.length === 0) return 0;
    return Number(str);
  }

  clear() {
    // 默认开始时间为当前时间，结束时间为当前时间+15天
    const tf = new Date();
    const tt = this.commonQueryService.addDays(tf, 15);
    this.dateRange = [tf, tt];
    this.queryParams.values = {
      scheduleGroupCode: null,
      strPlantCode: this.appconfig.getPlantCode(),
      strTimeRange: this.dateRange,
      strProdGroup: null,
      productLineId: null,
      strItemForm: { value: '', text: '' },
      noRelease: false,
      noZeroDemand: false,
      noZeroDemandFirst: false
    };
  }

  getsearchParans() {
    const pageNo = this._pageNo;
    const pageSize = this._pageSize;
    this.searchParans = {
      plantCode: this.queryParams.values.strPlantCode,
      timeRangeFrom: this.commonQueryService.formatDate(
        this.queryParams.values.strTimeRange[0],
      ),
      timeRangeTo: this.commonQueryService.formatDate(
        this.queryParams.values.strTimeRange[1],
      ),
      prodGroupCode: this.queryParams.values.strProdGroup,
      productLineId: this.queryParams.values.productLineId,
      itemCodeFrom: this.queryParams.values.strItemForm.text,
      // ItemCodeTo: this.queryParams.values.strItemTo,
      pageIndex: pageNo,
      pageSize: pageSize,
      noRelease: this.queryParams.values.noRelease,
      isExport: false, // 是否导出
      noZeroDemand: this.queryParams.values.noZeroDemand,
      noZeroDemandFirst: this.queryParams.values.noZeroDemandFirst,
    };
  }

  selectKeys = 'itemId';
  // 行选中改变
  onSelectionChanged() {
    this.getGridSelectionKeys(this.selectKeys);
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;

  public onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      if (this.queryParams !== undefined) {
        this.queryCommon();
      }
    } else {
      this.setLoading(false);
    }
  }

  // 切换工厂
  plantChange(value: string) {
    this.queryParams.values.productLineId = null;
    this.optionListProductLine.clear();
    this.queryParams.values.strProdGroup = null;
    this.prodGroups.length = 0;
    this.queryService.GetUserPlantGroupNew(value).subscribe(res => {
      res.data.forEach(element => {
        this.prodGroups.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode,
        });
      });
    });
  }

  // 切换物料
  itemCodeChange(event) {
    this.onPageChanged({ pageNo: 1, pageSize: this.lastPageSize });
  }

  // 物料弹出查询
  public searchItemsFrom(e: any) {
    if (
      !this.queryParams.values.strPlantCode ||
      this.queryParams.values.strPlantCode === undefined
    ) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请先选择工厂！'),
      );
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.strPlantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  public searchItemsTo(e: any) {
    if (
      !this.queryParams.values.strPlantCode ||
      this.queryParams.values.strPlantCode === undefined
    ) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请先选择工厂！'),
      );
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.strPlantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  public loadItems(
    plantCode: string,
    itemCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    // 加载物料
    this.queryService
      .getUserPlantItemPageList(
        plantCode || '',
        itemCode || '',
        '',
        pageIndex,
        pageSize,
      )
      .subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.totalElements;
      });
  }

  // 保存
  Save() {
    // 获取变更的数据
    if (
      this.gridData == null ||
      this.gridData.length === 0 ||
      this.dtSave.length === 0
    ) {
      this.msgSrv.warning(
        this.appTranslationService.translate('没有要保存的数据！'),
      );
      return;
    }
    this.shareIssuedService
      .SaveShareData(this.dtSave)
      .subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('保存成功'));
          this.calDeduce(this.gridData, this.dtSave[0].itemId);
          this.dtSave = [];
          this.gridApi.refreshCells();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
  }

  // 供需生成
  setReqOrder() {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(
        '系统将提交请求生成共享件供需数据，是否继续生成?',
      ),
      nzOnOk: () => {
        this.shareIssuedService
          .setReqOrder(this.queryParams.values.strPlantCode)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success('共享件供需生成请求已提交，请等候处理');
              this.query();
            } else {
              this.msgSrv.error(res.msg);
            }
          });
      },
    });
  }

  // 下达
  goDown() {
    if (
      this.gridData == null ||
      this.gridData.length === 0 ||
      this.selectionKeys.length === 0
    ) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请勾选物料数据！'),
      );
      return;
    }
    this.shareIssuedService
      .ReserveShareData(
        this.searchParans.plantCode,
        this.selectionKeys,
        this.dtSave,
        this.extendColumns[0].title,
        this.extendColumns[this.extendColumns.length - 1].title,
      )
      .subscribe(res => {
        if (res.code === 200) {
          this.queryCommon();
          this.msgSrv.success(
            this.appTranslationService.translate(
              '请求下达完成，请求号=' + res.data,
            ),
          );
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
  }

  // 单元格下达
  oneGoDown() {
    if (
      this.gridData == null ||
      this.gridData.length === 0 ||
      !this.selectRow ||
      !this.selectColumn
    ) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请点击需要下达的单元格'),
      );
      return;
    }
    if (this.selectRow.supplyType !== 'plan') {
      this.msgSrv.warning(
        this.appTranslationService.translate('请点可以下达的单元格'),
      );
      return;
    }
    const col = this.extendColumns.find(p => p.field === this.selectColumn);
    if (!col) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请点可以下达的单元格'),
      );
      return;
    }

    const strValue = this.strToNumber(this.selectRow[this.selectColumn]);
    if (!strValue) {
      this.msgSrv.warning(
        this.appTranslationService.translate('单元格的数量不正确'),
      );
      return;
    }

    let saveData = this.dtSave.find(
      p =>
        p.itemId === this.selectRow.itemId &&
        p.columnId === this.selectColumn &&
        p.isPlan === true,
    );
    if (!saveData) {
      saveData = {
        id: this.selectRow.id,
        plantCode: this.selectRow.plantCode,
        itemId: this.selectRow.itemId,
        itemCode: this.selectRow.itemCode,
        itemDesc: this.selectRow.descriptions,
        resourceCode: undefined,
        remark: undefined,
        techVersion: undefined,
        columnId: undefined, // 要保存的列名
        columnName: undefined, // 要保存的列名
        columnIdTitle: undefined,
        columnTitle: undefined, // 列描述
        newValue: this.selectRow[this.selectColumn], // 修改后的值
        isPlan: true, // 是否是计划
      };
    }
    const demandDate = this.gridData.find(
      p =>
        p.supplyType === 'demand' &&
        !this.isNull(p.resourceCode) &&
        p.itemCode === this.selectRow.itemCode,
    );
    saveData.columnIdTitle = col.title;
    saveData.resourceCode = demandDate.resourceCode;
    saveData.remark = demandDate.remark;
    saveData.techVersion = demandDate.techVersion;

    this.shareIssuedService
      .OneReserveShareData(this.searchParans.plantCode, saveData)
      .subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(
            this.appTranslationService.translate(
              '请求下达完成，请求号=' + res.data,
            ),
          );
          this.queryCommon();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
  }

  // 数据刷新
  refreshData() {
    if (
      this.gridData == null ||
      this.gridData.length === 0 ||
      this.selectionKeys.length === 0
    ) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请勾选物料数据！'),
      );
      return;
    }

    this.setLoading(true);
    this.shareIssuedService
      .RefreshShareData(
        this.searchParans.plantCode,
        this.selectionKeys,
        this.extendColumns[this.extendColumns.length - 1].title,
      )
      .subscribe(res => {
        if (res.code === 200) {
          this.queryCommon();
          this.setLoading(false);
          this.msgSrv.success(
            this.appTranslationService.translate('刷新成功，' + res.data),
          );
        } else {
          this.setLoading(false);
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
  }

  // 工艺路线
  itemRoutings() {
    if (
      this.gridData == null ||
      this.gridData.length === 0 ||
      this.selectRow == null ||
      this.selectRow.length === 0
    ) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择数据！'));
      return;
    }

    const param = {
      rowType: 'itemRoutings',
      plantCode: this.selectRow.plantCode,
      itemId: this.selectRow.itemId,
      fieldName: '',
      titleName: '',
      startDate: '',
    };
    this.modal
      .static(ViewDetailComponent, { iParam: param }, 'lg')
      .subscribe(() => { });
  }

  // BOM组件
  bomCompent() {
    if (
      this.gridData == null ||
      this.gridData.length === 0 ||
      this.selectRow == null ||
      this.selectRow.length === 0
    ) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择数据！'));
      return;
    }
    console.log(this.selectRow)
    this.modal
      .static(
        BasePsbomViewComponent,
        {
          i: {
            ALTERNATE_BOM_DESIGNATOR: null,
            PLANT_CODE: this.selectRow.plantCode,
            ASSEMBLY_ITEM_ID: this.selectRow.itemId,
            assemblyItemId: this.selectRow.itemId,
            plantCode: this.selectRow.plantCode,
          },
        },
        'lg',
      )
      .subscribe(() => { });
  }

  // 导出
  export() {
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.warning(
        this.appTranslationService.translate('没有要导出的数据！'),
      );
      return;
    }
    this.expColumns = [];
    this.staticColumns.forEach(dr => {
      const str = { field: dr.field, title: dr.title, width: dr.width };
      this.expColumns.push(str);
    });
    this.extendColumns.forEach(dr => {
      const str = { field: dr.field, title: dr.title, width: dr.width };
      this.expColumns.push(str);
    });
    this.getsearchParans();
    this.searchParans.isExport = true;
    this.commonQueryService.Search(this.searchParans).subscribe(result => {
      const _gridData = this.createDataSource(result);
      this.excelexport.export(_gridData);
    });
  }

  createPlanOrder() {
    this.modal.static(sharePlanOrderComponent, {
      plantCode: this.planOrderPlantCode,
      makeOrderNum: this.planOrderMoNumber,
      lpcTime: this.planOrderLpcTime,
    }, 'lg')
    .subscribe((value) => {
      if (value) {
        
      }
    });
  }
}
