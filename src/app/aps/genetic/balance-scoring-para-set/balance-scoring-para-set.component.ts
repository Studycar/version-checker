import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STComponent } from '@delon/abc';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { process } from '@progress/kendo-data-query';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { SelectableSettings } from '../../../../../node_modules/@progress/kendo-angular-grid';
import { CustomFormQueryComponent, UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { BalanceScoringParaSetService } from 'app/modules/generated_module/services/balance-scoring-para-set-service';
import { ProLineGroupMaintainService } from 'app/modules/generated_module/services/prolinegroupmaintain-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'Genetic-balance-scoring-para-set',
  templateUrl: './balance-scoring-para-set.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [QueryService, BalanceScoringParaSetService],
  styles: [`.k-grid .no-padding{padding:0}
          .whole-cell{display:block;padding:0;margin:0;}
          .editCellStyle {color:#FFA500;}
          .focusCellStye {color: blue}
          .backColor0 {background-color:#ffffff !important}
          .backColor1 {background-color:#f5f7fa !important}
          .cell-span { background-color: #ffffff; }
          .show-cell {
            background: white;
            border-left: 1px solid lightgrey !important;
            border-right: 1px solid lightgrey !important;
            border-bottom: 1px solid lightgrey !important;}
          .texStyle {
            line-height: 20px;
          }`]

})
export class GeneticBalanceScoringParaSetComponent extends CustomBaseContext implements OnInit {
  @ViewChild(CustomFormQueryComponent, { static: true })
  customFormquery: CustomFormQueryComponent;
  expandForm = false;
  orgOptionList: any[] = [];
  schedulegroupoptions: any[] = [];
  existsSchedulegroupoptions: any[] = [];
  resultOptionList: any[] = [];
  lookupValue: any[] = [];
  // queryParams: any = {};
  searchPara: any = {};
  gridSave: any[] = [];
  dtSave: any[] = [];
  lastValue: any = '1111';
  newOrUpdate: any = 'NEW'; // 新增 更新标识
  public gridData: any[] = [];
  public gridData1: any[] = [];
  // 是否启用checkbox选择
  public selectionEnabledKeys: any[] = [];
  public selectionScheduleKeys: any[] = [];
  // grid所有选中行
  public gridSelectRows: any[];
  dtPlan: any[] = [];
  public totalCount = 0;
  public selectableSettings: SelectableSettings;
  public oldSelectionKeys: any[] = [];
  gridRowEditStyle = { 'height': '25px' };
  columns = [
    {
      field: 'kpiType', headerName: '分类', editable: false,
      rowSpan: function (params) {
        if (params.data.kpiType === '') {
          return 0;
        } else {
          return Number(params.data.attribute1);
        }
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: function (params) {
        const list = params.data.Id;
        const s: any[] = [];
        list.forEach(element => {
          s.push(element.Id);
        });
        return { values: s };
      },
      cellClassRules: { 'cell-span': 'value!==undefined', 'show-cell': 'value!==undefined' },
      cellStyle: { 'line-height': '20px' }, menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    { field: 'kpiElements', headerName: '评价项', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'elementsValue', headerName: '值', editable: true, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    {
      colId: 1, cellClass: '', field: '', headerName: '是否启用', menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      pinned: 'right', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      valueFormatter: function chainValueGetter(params) {
        params.node.selected = params.data.isTrue;
      },
    },
  ];

  exportColumns = [
    {
      field: 'kpiType', headerName: '分类', editable: false,
      rowSpan: function (params) {
        if (params.data.kpiType === '') {
          return 0;
        } else {
          return Number(params.data.ATTRIBUTE1);
        }
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: function (params) {
        const list = params.data.Id;
        const s: any[] = [];
        list.forEach(element => {
          s.push(element.Id);
        });
        return { values: s };
      },
      cellClassRules: { 'cell-span': 'value!==undefined', 'show-cell': 'value!==undefined' },
      cellStyle: { 'line-height': '20px' }, menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    { field: 'kpiElements', headerName: '评价项', width: 180, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'elementsValue', headerName: '值', width: 180, editable: true, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    {
      field: 'enableFlag', width: 180, headerName: '是否启用（是：Y/否：N）',
      menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
  ];

  //计划组网格
  public columns1 = [
    {
      colId: 1, cellClass: '', field: '', headerName: '选择', width: 110, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      valueFormatter: function chainValueGetter(params) {
        params.node.selected = params.data.isTrue;
      },
    },
    { field: 'scheduleGroupCode', headerName: '计划组', width: 250, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },

  ];

  isRowSelectable;
  expColumns: any[] = [];
  components;
  formGroup: FormGroup;
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  @ViewChild('st', { static: true }) st: STComponent;
  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private formBuilder: FormBuilder,
    private balancescoringparasetService: BalanceScoringParaSetService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    public prolinegroupmaintainService: ProLineGroupMaintainService,
    private appconfig: AppConfigService,
    private injector: Injector) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig, injector });
    this.components = { showCellRenderer: this.createShowCellRenderer() };
    this.defaultColDef.sortable = false;
    this.isRowSelectable = function (rowNode) {
      return rowNode.data ? rowNode.data.spanFlag === true : false;
    };
    this.gridOptions.rowSelection = 'multiple';
    this.headerNameTranslate(this.columns);
    this.headerNameTranslate(this.columns1);
  }

  createShowCellRenderer() {
    function ShowCellRenderer() { }
    ShowCellRenderer.prototype.init = function (params) {
      const cellBlank = !params.value;
      if (cellBlank) {
        return null;
      }
      this.ui = document.createElement('div');
      this.ui.innerHTML =
        '<div class="show-name">' +
        params.value;
    };
    ShowCellRenderer.prototype.getGui = function () {
      return this.ui;
    };
    return ShowCellRenderer;
  }

  public queryParams = {
    defines: [
      { field: 'plantCode', title: this.appTranslationService.translate('工厂'), required: true, ui: { type: UiType.select, options: this.orgOptionList, eventNo: 1 } },
      { field: 'performanceName', title: this.appTranslationService.translate('方案'), required: true, ui: { type: UiType.select, options: this.resultOptionList } },
      { field: 'scheduleGroupCode', title: this.appTranslationService.translate('计划组'), required: true, ui: { type: UiType.select, options: this.schedulegroupoptions } },
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      performanceName: null,
      scheduleGroupCode: '',
    }
  };

  public ngOnInit(): void {
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
    this.commonQueryService.GetLookupByType('PS_GA_PARAMETER_TAB_CONTENT').subscribe(result => {
      result.Extra.forEach(d => {
        const selectItemstmp = this.lookupValue.find(x => x.label === d.ATTRIBUTE3);
        if (selectItemstmp === undefined) {
          this.lookupValue.push({
            label: d.attribute3,
            value: d.attribute6,
          });
        }
      });
    });
    this.plantChange(this.appconfig.getPlantCode());
  }

  query() {
    super.query();
    this.newOrUpdate = 'UPDATE';
    this.queryCommon('1');
  }

  private clonePara(): any {
    const dto = {
      plantCode: this.queryParams.values.plantCode,
      performanceName: this.queryParams.values.performanceName,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode
    };
    return dto;
  }

  // flag :1,Query;2,NEW
  public queryCommon(flag: any) {
    this.dtSave.length = 0;
    const queryValues = this.clonePara();
    queryValues.flag = flag;
    queryValues.isExport = false;
    this.gridData1.length = 0;
    this.gridData.length = 0;
    this.commonQueryService.SearchScheduleGroup(queryValues).subscribe(result => {
      this.gridData1 = this.createDataSource2(result);
      this.view = {
        data: process(this.gridData1, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData1.length, // this.gridState.take,
          filter: this.gridState.filter
        }).data,
        total: this.totalCount
      };

    });
    this.commonQueryService.Search(queryValues).subscribe(result => {
      this.totalCount = result.data.totalElements;
      this.gridData = this.createDataSource(result);
      console.log(this.gridData);
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridData.length, // this.gridState.take,
          filter: this.gridState.filter
        }).data,
        total: this.totalCount
      };
    });
  }

  // 处理记分卡数据源
  createDataSource(result: any) {
    this.selectionEnabledKeys.length = 0;
    this.gridSave = [];
    this.lastValue = '';
    if (result.data == null || result.data.content == null) return;
    // 头数据源
    const dtHeader = result.data.content;
    const _gridData = [];
    dtHeader.forEach(d => {
      const dt = Object.assign({}, d);
      if (dt.kpiType !== this.lastValue) {
        this.lastValue = dt.kpiType;
      } else {
        dt.kpiType = '';
      }
      if (dt.enableFlag === 'Y') {
        dt.isTrue = true;
        this.selectionEnabledKeys.push(d.attribute6);
      } else {
        dt.isTrue = false;
      }
      _gridData.push(dt);
      this.gridSave.push(dt);
    });
    return _gridData;
  }

  // 处理计划组数据源
  createDataSource2(result: any) {
    this.selectionScheduleKeys.length = 0;
    this.lastValue = '';
    if (result == null || result.data == null) return;
    // 计划组数据源
    const _gridData = [];
    result.data.forEach(d => {
      const dt = Object.assign({}, d);
      if (dt.enableFlag === 'Y') {
        dt.isTrue = true;
        this.selectionScheduleKeys.push(dt.scheduleGroupCode);
      } else {
        dt.isTrue = false;
      }
      _gridData.push(dt);
    });
    return _gridData;
  }

  plantChange(value: any) {
    this.queryParams.values.scheduleGroupCode = null;
    this.schedulegroupoptions.length = 0;
    this.commonQueryService.GetUserPlantGroup(this.queryParams.values.plantCode).subscribe(result => {
      result.Extra.forEach(element => {
        this.schedulegroupoptions.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode
        });
      });
    });
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      performanceName: [],
      scheduleGroupCode: null,
    };
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  selectRow: any = [];
  selectColumn: any;

  public cellClickHandler(value: any) {
    this.selectRow = value.data;
    console.log(value.data);
    this.selectColumn = value.column.colId;
  }

  createFormGroup(dataItem: any): FormGroup {
    const editRow = {};
    this.columns.forEach(dr => {
      editRow[dr.field] = new FormControl(dataItem[dr.field]);
    });
    return this.formBuilder.group(editRow);
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['值'];

  add() {
    this.newOrUpdate = 'NEW';
    this.queryCommon('2');
  }

  public Save() {
    // 获取变更的数据
    const msg = this.appTranslationService.translate('请选择计划组！');
    if (this.gridData1 == null || this.gridData1.length === 0) {
      this.msgSrv.info(msg);
      return;
    }

    for (let aa = 0; aa < this.lookupValue.length; aa++) {
      let retValue = 0;
      const lb = this.lookupValue[aa].label; // 个体评分
      const lv = this.lookupValue[aa].value; // 1
      let lastKpiType = '';
      this.gridSave.forEach(dd => {
        if (dd.kpiType !== null && dd.kpiType !== '') {
          lastKpiType = dd.kpiType;
        } else {
          dd.kpiType = lastKpiType;
        }
        if (dd.kpiType === lb && dd.isTrue === true) {
          retValue = Number(retValue.toFixed(2)) + Number(dd.elementsValue);
        }
      });
      if (retValue !== Number(lv) && lv !== null && lv !== undefined) {
        const msg1 = this.appTranslationService.translate('【分类】:' + lb + '对应的所有评价项的值的汇总应该是：' + lv);
        this.msgSrv.info(msg1);
        return;
      }
    }

    if (this.selectionScheduleKeys.length === 0) {
      this.msgSrv.info(msg);
      return;
    }
    const queryValues = this.clonePara();
    this.existsSchedulegroupoptions.length = 0;

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确认提交保存吗'),
      nzOnOk: () => {
        this.commonQueryService.SaveData(this.gridSave, this.selectionScheduleKeys, queryValues, this.newOrUpdate).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('保存成功'));
            this.dtSave = [];
            // this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  onRowSelected(event) {
    if (event.node.selected === true) {
      this.selectionEnabledKeys.push(event.data.attribute6);
      event.data.isTrue = true;
    } else {
      const vindex = this.selectionEnabledKeys.indexOf(event.data.attribute6);
      this.selectionEnabledKeys.splice(vindex, 1);
      event.data.isTrue = false;
    }
  }


  onScheduleRowSelected(event) {
    if (event.node.selected === true) {
      this.selectionScheduleKeys.push(event.data.scheduleGroupCode);
      event.data.isTrue = true;
    } else {
      const vindex = this.selectionKeys.indexOf(event.data.scheduleGroupCode);
      this.selectionScheduleKeys.splice(vindex, 1);
      event.data.isTrue = false;
    }

  }

  public cellCloseHandler(args: any) {
    const dataItem = args.data;
    const field = args.column.colId; // 列名
    const orgValue = args.oldValue; // 旧值
    const newValue = args.newValue; // 新值
    if (orgValue !== newValue) {
      // 需要校验是否是数字
      if (newValue.length > 0 && (this.strToNumber(newValue) === NaN || this.strToNumber(newValue) < 0)) {
        this.msgSrv.info(this.appTranslationService.translate('请输入不小于0的数字'));
        return;
      }
      dataItem[args.column.field] = newValue;
      this.setSaveData(dataItem, args.column);
    }
  }

  onCellValueChanged(args: any) {
    const dataItem = args.data;
    const field = args.column.colId; // 列名
    const orgValue = args.oldValue; // 旧值
    const newValue = args.newValue; // 新值
    if (orgValue !== newValue) {
      // 需要校验是否是数字
      if (newValue.length > 0 && (this.strToNumber(newValue) === NaN || this.strToNumber(newValue) < 0)) {
        this.msgSrv.info(this.appTranslationService.translate('请输入不小于0的数字'));
        return;
      }
      dataItem[args.column.field] = newValue;
    }

  }

  strToNumber(str: any) {
    if (str == null || str.length === 0) return 0;
    return Number(str);
  }

  // 设置保存数据
  setSaveData(dataItem: any, column: any) {
    const saveData = {
      Id: dataItem.Id,
      elementsValue: dataItem[column.colId], // 修改后的值
    };
    this.dtSave.push(saveData);
  }

  public export() {
    const msg = this.appTranslationService.translate('没有要导出的数据！');
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.info(msg);
      return;
    }
    // this.initColumns();
    this.expColumns = [];
    this.exportColumns.forEach(dr => {
      const str = { field: dr.field, title: dr.headerName };
      this.expColumns.push(str);
    });
    const queryValues = this.clonePara();
    queryValues.flag = '1';
    queryValues.isExport = true;
    this.commonQueryService.Search(queryValues).subscribe(result => {
      const _gridData = this.createDataSource(result);
      this.excelexport.export(_gridData);
    });
  }
}

