import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { EditService } from './edit.service';
import { PlanscheduleShiftplanComponent } from '../shiftplan/shiftplan.component';
import { State, process } from '@progress/kendo-data-query';
import { PlanscheduleDigitalizationWorkbenchSearchComponent } from './search/search.component';
import { PlanscheduleDigitalizationWorkbenchRefreshComponent } from './refresh/refresh.component';
import { PlanscheduleDigitalizationWorkbenchPlanReleaseComponent } from './planrelease/planrelease.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PlantModelCalendarComponent } from '../../plant-model/calendar/calendar.component';
import { PlanscheduleDigitalizationWorkbenchBatchMoveComponent } from './batchMove/batchMove.component';
import { PlanscheduleDigitalizationWorkbenchCalculateWorkingComponent } from './calculateWorking/calculateWorking.component';
import { ComVindicateComponent } from '../../plant-model/comvindicate/comvindicate.component';
import { PlanscheduleMomanagerEditComponent } from '../momanager/edit/edit.component';
import { PlanscheduleDigitalizationWorkbenchEndMoComponent } from './endMo/endMo.component';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { PlanscheduleDigitalizationWorkbenchRemarkMoComponent } from './remarkMo/remarkMo.component';
import { PlanscheduleDigitalizationWorkbenchMoLevelComponent } from './moLevel/moLevel.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { PlanscheduleDigitalizationWorkbenchChooseLineComponent } from './chooseLine/chooseLine.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-digitalization-workbench',
  templateUrl: './digitalization-workbench.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
            .div_menu {
              position: relative;
              padding: 5px 0px;
              /* border: solid 1px rgb(243, 244, 245);
              background-color: rgb(153, 187, 255);  */
              text-align:left;
            }

            .span_menu{
              display: inline-block;
              margin: 0px auto;
            }

            .k-grid .no-padding{
               padding-top: 0px;
               padding-bottom: 0px;
            }

            .whole-cell{
              display: block;
              padding: 8px 12px;
            }
            /* 打开多个功能，css类名一样会覆盖，先打开的无效 */
            .first_row_workbench .columnCss{
              color: red;
              background-color: rgb(124,252,0);
            }
          `],
  providers: [EditService]
})
export class PlanscheduleDigitalizationWorkbenchComponent extends CustomBaseContext implements OnInit {
  public selectBy = 'ID';
  public IsCompleterefresh = false;
  public gridSelectRow: any; // 当前选中行
  hidden = false; // 测试列隐藏
  // 显示区列定义
  public columns = [
    { field: 'SEQ_NO', title: '顺序#', width: 80, locked: true },
    // { field: 'SCHEDULE_REGION_CODE', title: '事业部', width: 100, locked: true },
    // { field: 'PLANT_CODE', title: '工厂', width: 80, locked: true },
    { field: 'SCHEDULE_GROUP_CODE', title: '计划组', width: 120, locked: true },
    { field: 'RESOURCE_CODE', title: '资源#', width: 120, locked: true, ui: { type: 'select', data: [] } },
    { field: 'MAKE_ORDER_NUM', title: '工单号', width: 150, locked: true, ui: { link: true } },
    { field: 'ITEM_CODE', title: '物料', width: 150, locked: true },
    { field: 'DESCRIPTIONS_CN', title: '物料描述', width: 150, locked: false, hidden: this.hidden, ui: { tooltip: 1 } },
    { field: 'FPC_TIME', title: '开始时间', width: 170, locked: false },
    { field: 'LPC_TIME', title: '完成时间', width: 170, locked: false },
    { field: 'UNIT_OF_MEASURE', title: '单位', width: 80, locked: false, hidden: this.hidden },
    { field: 'MO_QTY', title: '工单数量', width: 100, locked: false },
    { field: 'PLAN_QTY', title: '排产数量', width: 100, locked: false },
    { field: 'COMPLETE_QTY', title: '完工数量', width: 100, locked: false },
    { field: 'STANDARD_FLAG_NAME', title: '标准工单类型', width: 120, locked: false, hidden: true },
    { field: 'MAKE_ORDER_TYPE_NAME', title: '工单类型', width: 100, locked: false },
    { field: 'MAKE_ORDER_STATUS_NAME', title: '工单状态', width: 100, locked: false },
    { field: 'TOP_MO_NUM', title: '顶层工单', width: 150, locked: false, hidden: this.hidden },
    { field: 'TOP_FPC_TIME', title: '顶层工单开始时间', width: 170, locked: false, hidden: this.hidden },
    { field: 'TOP_MAKE_ORDER_STATUS_NAME', title: '顶层工单状态', width: 120, locked: false, hidden: this.hidden },
    { field: 'PARENT_MO_NUM', title: '父工单', width: 150, locked: false, hidden: this.hidden },
    { field: 'PARENT_FPC_TIME', title: '父工单开始时间', width: 170, locked: false, hidden: this.hidden },
    { field: 'PARENT_MAKE_ORDER_STATUS_NAME', title: '父工单状态', width: 120, locked: false, hidden: this.hidden },
    { field: 'PROJECT_NUMBER', title: '项目号', width: 150, locked: false },
    { field: 'COMPLETION_SUBINVENTORY', title: '完工子库', width: 120, locked: false, hidden: true },
    { field: 'EXCEPTION_MESSAGE', title: '例外信息', width: 120, locked: false, hidden: this.hidden },
    { field: 'COMMENTS', title: '备注#', width: 150, locked: false, ui: { tooltip: 1 } },
    { field: 'CUSTOMER_NAME', title: '客户名称', width: 120, locked: false, hidden: true },
    { field: 'REQ_NUMBER', title: '需求订单号', width: 120, locked: false, hidden: true },
    { field: 'REQ_LINE_NUM', title: '需求订单行号', width: 120, locked: false, hidden: true },
    { field: 'REQ_TYPE_NAME', title: '需求类型', width: 120, locked: false, hidden: true },
    { field: 'DEMAND_DATE', title: '需求时间', width: 170, locked: false },
    { field: 'INSPECTION_TIME', title: '验货时间', width: 170, locked: false, hidden: this.hidden },
    { field: 'BONDED_FLAG', title: '是否保税', width: 100, locked: false, hidden: true },
    { field: 'RELEASED_DATE', title: '发放时间', width: 170, locked: false, hidden: true },
    { field: 'RELEASED_BY', title: '发放者', width: 100, locked: false, hidden: true },
    { field: 'FIX_SCHEDULE_TIME', title: '固定时间', width: 170, locked: false },
    { field: 'COMPLETED_DATE', title: '完成时间', width: 170, locked: false, hidden: true },
    { field: 'CLOSED_DATE', title: '关闭时间', width: 170, locked: false, hidden: true },
    { field: 'CLOSED_BY', title: '关闭者', width: 100, locked: false, hidden: true },
    { field: 'FPS_TIME', title: '首件开始时间', width: 170, locked: false },
    { field: 'FPC_TIME', title: '首件完成时间', width: 170, locked: false },
    { field: 'LPS_TIME', title: '末件开始时间', width: 170, locked: false },
    { field: 'LPC_TIME', title: '末件完成时间', width: 170, locked: false },
    { field: 'FULFILL_TIME', title: '最终完成时间', width: 170, locked: false, hidden: this.hidden },
    { field: 'OFFSET_LEAD_TIME', title: '提前量（小时）', width: 150, locked: false, hidden: this.hidden },
    { field: 'EARLIEST_START_TIME', title: '生产最早开始时间', width: 170, locked: false, hidden: this.hidden },
    { field: 'CREATION_DATE', title: '创建时间', width: 170, locked: false, hidden: this.hidden },
    { field: 'MANF_LEAD_TIME', title: '生产时间(小时)', width: 150, locked: false, hidden: this.hidden },
    { field: 'SWITCH_TIME', title: '换型时间（小时）', width: 150, locked: false, hidden: this.hidden },
    { field: 'ORI_MO_NUMBER', title: '来源工单', width: 120, locked: false, hidden: true },
    { field: 'DERIVED_FLAG', title: '拆分标识', width: 100, locked: false, hidden: true },
    { field: 'ORI_MO_QTY', title: '来源MO数量', width: 120, locked: false, hidden: true },
    { field: 'MO_WARNNING_FLAG', title: '警告信息', width: 120, locked: false, hidden: true, ui: { tooltip: 1 } },
    { field: 'SCHEDULE_FLAG', title: '参与排产标识', width: 150, locked: false, hidden: true },
    { field: 'ALTERNATE_BOM_DESIGNATOR', title: '替代BOM', width: 120, locked: false, hidden: true },
    { field: 'MOULD_CODE', title: '模具', width: 100, locked: false, hidden: this.hidden },
    { field: 'BACKLOG_FLAG', title: '尾数标识', width: 100, locked: false },
    { field: 'BACKLOG_REASON', title: '尾数原因', width: 150, locked: false, ui: { tooltip: 1 } }
  ];
  // 获取列定义的下拉选择的数组
  public findColumnData(field: string = 'RESOURCE_CODE'): any[] {
    const column = this.columns.find(x => x.field === field);
    if (column !== undefined && column !== null) {
      return column.ui.data;
    } else {
      return [];
    }
  }
  constructor(private http: _HttpClient, private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    public editService: EditService,
    private formBuilder: FormBuilder,
    private appConfigService: AppConfigService
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
  }

  ngOnInit() {
    this.clear();
    this.setGridHeight({ topMargin: 200 });
    this.view = {
      data: [],
      total: 0
    };
  }
  /* -------------------------------服务调用-------------------------------- */
  public query() {
    super.query();
    this.queryCommon();
  }
  // 查询参数
  public queryValues = {
    regionCode: '',
    plantCode: this.appConfigService.getPlantCode(),
    projectNumber: '',
    groupCode: '',
    lineIdsStr: '',
    startTime: null,
    endTime: null,
    selection: [],
    expand: [],
    treeDataTable: []
  };
  public queryCommon() {
    const lineCodes = [];
    // 开始加载
    this.setLoading(true);
    // 获取选中资源编码
    this.queryValues.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.CODE); } });
    this.editService.Search(this.queryValues.regionCode, this.queryValues.plantCode, this.queryValues.projectNumber, lineCodes, this.editService.formatDate(this.queryValues.startTime), this.editService.formatDate(this.queryValues.endTime)).subscribe(result => {
      if (result !== null && result.data !== null) {
        this.gridData = result.data;
        this.view = {
          data: process(this.gridData, {
            sort: this.gridState.sort,
            skip: this.gridState.skip,
            take: this.gridData.length,
            filter: this.gridState.filter
          }).data,
          total: this.gridData.length
        };
      }
      // 加载完毕
      this.setLoading(false);
      // 清除修改的内容
      this.editService.reset();
    });
  }
  // 刷新参数
  public refreshValues = {
    regionCode: '',
    plantCode: '',
    treeDataTable: [],
    selection: [],
    expand: [],
    treeDataTableAll: [],
    type: 1, // 类型：1刷新;2计划发布;3工单联动;4上层联动
    titleText: '刷新',
    setRefresh: function () {
      this.type = 1;
      this.titleText = '刷新';
    },
    setPlanRelease: function () {
      this.type = 2;
      this.titleText = '计划发布';
    },
    setMoLink: function () {
      this.type = 3;
      this.titleText = '工单联动';
    },
    setMoUpLink: function () {
      this.type = 4;
      this.titleText = '上层联动';
    }
  };
  // 设置刷新产线勾选项(queryValues.selection数据项结构 [{ ID: i.ID, CODE: i.RESOURCE_CODE, DESCRIPTION: i.DESCRIPTIONS }])
  public setRefreshSelection(lineCodes: string[]) {
    if (this.queryValues.selection !== undefined && this.queryValues.selection.length > 0) {
      this.refreshValues.selection.length = 0;
      // 遍历查询勾选项的产线
      this.queryValues.selection.forEach(x => {
        if (x.level === 1 && lineCodes.findIndex(z => z === x.CODE) > -1) {
          this.refreshValues.selection.push({ ID: x.ID, CODE: x.CODE, DESCRIPTION: x.DESCRIPTION });
        }
      });
    }
  }
  // 刷新服务调用
  private refreshOperate() {
    const lineCodes = [];
    // 获取选中资源编码
    this.refreshValues.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.CODE); } });
    const plantCode = this.refreshValues.plantCode;
    this.editService.Refresh(plantCode, lineCodes, this.editService.formatDate(this.queryValues.startTime), this.editService.formatDate(this.queryValues.endTime)).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(result.msg || '刷新成功！'));
        this.query();
        this.IsCompleterefresh = true;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(result.msg || '刷新失败！'));
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  // 调整服务调用
  private adjustOperate() {
    const dtos = []; // 调整参数列表
    this.view.data.forEach(x => {
      // 传给服务的参数
      const dto = {
        ID: x.ID,
        SEQ_NO: x.SEQ_NO,
        PLANT_CODE: x.PLANT_CODE,
        RESOURCE_CODE: x.RESOURCE_CODE,
        RESOURCE_CODE_OLD: x.RESOURCE_CODE_OLD,
        FPC_TIME: x.FPC_TIME
      };
      dtos.push(dto);
    });
    this.editService.Save(this.queryValues.regionCode, this.queryValues.plantCode, this.editService.formatDate(this.queryValues.startTime), this.editService.formatDate(this.queryValues.endTime), dtos).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('调整保存成功！<br/>' + result.msg));
        const lines = []; // 产线列表
        this.editService.getUpdateItems().forEach(x => {
          // 目标产线
          if (lines.findIndex(l => l === x.RESOURCE_CODE) === -1) {
            lines.push(x.RESOURCE_CODE);
          }
          // 原产线
          if (lines.findIndex(l => l === x.RESOURCE_CODE_OLD) === -1) {
            lines.push(x.RESOURCE_CODE_OLD);
          }
        });
        // 设置刷新的勾选项
        this.setRefreshSelection(lines);
        // 刷新
        this.refresh();
        // 重置修改信息
        this.editService.reset();
      } else {
        this.msgSrv.error(this.appTranslationService.translate('调整保存失败！<br/>' + result.msg));
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  // 备注操作
  private remarkOperate() {
    const dtos = []; // 备注参数列表
    this.editService.getUpdateItems().forEach(x => {
      // 传给服务的参数
      const dto = {
        ID: x.ID,
        COMMENTS: x.COMMENTS,
        ATTRIBUTE1: x.ATTRIBUTE1
      };
      dtos.push(dto);
    });
    this.editService.RemarkMo(dtos).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('备注保存成功！'));
        // 重置修改信息
        this.editService.reset();
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate('备注保存失败！<br/>' + result.msg));
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  // 计划发布操作
  private releaseOperate() {
    const lineCodes = [];
    let groupCode = '';
    this.refreshValues.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.CODE); groupCode = x.parent.CODE; } });
    this.modal
      .static(PlanscheduleDigitalizationWorkbenchPlanReleaseComponent,
        {
          i: {},
          regionCode: this.queryValues.regionCode,
          plantCode: this.queryValues.plantCode,
          lineCodes: lineCodes,
          startTime: this.queryValues.startTime,
          endTime: this.queryValues.endTime,
          schedule_group_code: groupCode,
        }, 'lg').subscribe((value) => {
          if (value) {
            this.query();
          }
          // 加载完毕
          this.setLoading(false);
        });
  }
  // 工单联动
  private moLinkOperate() {
    const lineCodes = [];
    // 获取选中资源编码
    this.refreshValues.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.CODE); } });
    const plantCode = this.refreshValues.plantCode;
    this.editService.SubmitRequest_MoRecursive(plantCode, lineCodes).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(result.msg));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(result.msg));
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  // 上层联动
  private upLinkOperate() {
    const lineCodes = [];
    // 获取选中资源编码
    this.refreshValues.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.CODE); } });
    const plantCode = this.refreshValues.plantCode;
    this.editService.SubmitRequest_UpperLevelLinkage(plantCode, lineCodes).subscribe(result => {
      if (result !== null && result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(result.msg));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(result.msg));
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  /* ----------------------------------------------------------------------- */
  // 物料工艺路线缓存
  private itemlines = []; // 数据项为{key:plantCode+itemId,data:[]}
  // 移除指定项
  private removeItem(data: any[], value: string) {
    const index = data.findIndex(x => x.value === value);
    if (index > -1) { data.splice(index, 1); }
  }
  // 加载物料工艺路线（资源）
  private loadLine(plantCode: string, itemId: string, resourceCode: string) {
    const data = this.findColumnData();
    data.length = 0;
    const key = plantCode + itemId;
    const line = this.itemlines.find(x => x.key === key);
    if (line !== undefined) {
      // data = Object.assign([], line.data);
      line.data.forEach(x => { data.push(x); });
      // 移除当前项
      this.removeItem(data, resourceCode);
    } else {
      this.editService.GetItemRoutings(plantCode, itemId).subscribe(result => {
        if (result !== null && result.Extra !== null) {
          result.Extra.forEach(d => {
            data.push({ value: d.resourceCode, label: d.resourceCode });
          });
          this.itemlines.push({ key: key, data: Object.assign([], data) });
          // 移除当前项
          this.removeItem(data, resourceCode);
        }
      });
    }
  }
  // 根据查询选中项生成资源选择树
  private generateTreeDataTable(treeDataTable: any[]) {
    treeDataTable.length = 0;
    const expand = true;
    const checked = false;
    // 添加计划组
    this.queryValues.selection.forEach(x => {
      if (x.level === 0) {
        treeDataTable.push({ ID: x.ID, CODE: x.CODE, DESCRIPTION: x.DESCRIPTION, children: [], expand: expand, checked: checked });
      } else if (x.parent !== undefined) { // 未勾选计划组时
        const item = treeDataTable.find(y => y.ID === x.parent.ID);
        if (item === undefined || item === null) {
          treeDataTable.push({ ID: x.parent.ID, CODE: x.parent.CODE, DESCRIPTION: x.parent.DESCRIPTION, children: [], expand: expand, checked: checked });
        }
      }
    });
    // 添加资源
    treeDataTable.forEach(x => {
      this.queryValues.selection.forEach(y => {
        if (y.parent !== undefined && y.parent.ID === x.ID) {
          x.children.push({ ID: y.ID, CODE: y.CODE, DESCRIPTION: y.DESCRIPTION, expand: expand, checked: checked });
        }
      });
    });
  }
  // 提取grid勾选项
  private getGridSelectItems(): any[] {
    const selectItems = [];
    this.view.data.forEach(x => {
      if (this.selectionKeys.findIndex(key => key === x.ID) > -1) {
        selectItems.push(x);
      }
    });
    return selectItems;
  }
  // 是否勾选
  public isSelect(): boolean {
    if (this.selectionKeys.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  /* ------------------------------功能按钮事件----------------------------------- */
  // 查询
  public search() {
    this.modal
      .static(PlanscheduleDigitalizationWorkbenchSearchComponent, { i: this.queryValues }, 'lg')
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }
  // 刷新
  public refresh() {
    this.refreshValues.setRefresh();
    this.refreshCommon();
  }
  // 刷新(计划组选择 共用)
  public refreshCommon() {
    if (this.queryValues.selection === null || this.queryValues.selection.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先执行查询!'));
    } else {
      // 开始加载
      this.setLoading(true);
      this.generateTreeDataTable(this.refreshValues.treeDataTable);
      this.refreshValues.regionCode = this.queryValues.regionCode;
      this.refreshValues.plantCode = this.queryValues.plantCode;
      this.refreshValues.treeDataTableAll = this.queryValues.treeDataTable;
      this.modal
        .static(PlanscheduleDigitalizationWorkbenchRefreshComponent, { i: this.refreshValues }, 'lg')
        .subscribe((val) => {
          if (val) {
            switch (this.refreshValues.type) {
              // 刷新
              case 1:
                this.refreshOperate();
                break;
              // 计划发布
              case 2:
                this.releaseOperate();
                break;
              // 工单联动
              case 3:
                this.moLinkOperate();
                break;
              // 上层联动
              case 4:
                this.upLinkOperate();
                break;
            }
          }
          // 加载完毕
          this.setLoading(false);
        });
    }
  }
  // 计划发布
  PlanRelease() {
    /* 改为后台控制
    if (!this.IsCompleterefresh) {
      this.msgSrv.warning(this.appTranslationService.translate('未完成排产刷新'));
      return;
    }
    */

    if (this.queryValues.selection === null || this.queryValues.selection.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先执行查询!'));
    } else {
      // 设置为计划发布
      this.refreshValues.setPlanRelease();
      this.refreshCommon();
    }
  }
  // 工单联动
  public moLink() {
    this.refreshValues.setMoLink();
    this.refreshCommon();
  }
  // 上层联动
  public moUpLink() {
    this.refreshValues.setMoUpLink();
    this.refreshCommon();
  }
  // 集约选线
  public chooseLine() {
    if (this.view.data.length > 0) {
      const row = this.gridSelectRow || this.view.data[0];
      this.modal
        .static(PlanscheduleDigitalizationWorkbenchChooseLineComponent, {
          i: {
            SCHEDULE_REGION_CODE: row.SCHEDULE_REGION_CODE,
            PLANT_CODE: row.PLANT_CODE,
            SCHEDULE_GROUP_CODE: row.SCHEDULE_GROUP_CODE,
            RESOURCE_CODE: row.RESOURCE_CODE
          },
          querySelection: this.queryValues.selection
        }, 'lg')
        .subscribe((value) => {
          if (value) {
          }
        });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先查询数据!'));
    }
  }
  // 顺序/资源 调整保存
  public save() {
    if (this.editService.hasChanges()) {
      const context = this;
      // 延时0.1秒执行获取最后一次调整的数据
      setTimeout(function () { context.adjustOperate(); }, 100);
    }
  }

  batchSelection: any[] = []; // 勾选项
  batchExpandtion: any[] = []; // 展开项
  // 按资源批量调整
  public batchMove() {
    if (this.selectionKeys.length > 0) {
      this.batchSelection = [];
      this.batchExpandtion = [];
      this.modal
        .static(PlanscheduleDigitalizationWorkbenchBatchMoveComponent, { gridData: this.view.data, gridSelectionKeys: this.selectionKeys, selection: this.batchSelection, expandtion: this.batchExpandtion }, 'lg')
        .subscribe((value) => {
          if (value) {
            // 获取勾选的MO,通过MO的parent取产线
            const mo = this.batchSelection.find(x => x.level === 2); // level:0/1/2 代表 计划组/产线/MO
            this.setRefreshSelection([mo.parent.CODE]);
            this.refresh();
          }
        });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选记录!'));
    }
  }
  // 产能平衡
  public calculateWorking() {
    if (this.selectionKeys.length > 0) {
      const gridSelectItems = this.getGridSelectItems();
      const resourceCode = gridSelectItems[0].RESOURCE_CODE;
      // 勾选了多个产线
      if (gridSelectItems.findIndex(x => x.RESOURCE_CODE !== resourceCode) > -1) {
        this.msgSrv.warning(this.appTranslationService.translate('请选择相同资源下的工单!'));
      } else {
        this.modal
          .static(PlanscheduleDigitalizationWorkbenchCalculateWorkingComponent, { gridSelectItems: gridSelectItems }, 'lg')
          .subscribe((value) => {
            if (value) {
              this.query();
            }
          });
      }
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选记录!'));
    }
  }
  // 置尾单
  public setEndMo() {
    if (this.selectionKeys.length > 0) {
      const moStatus = ['R', 'S']; // 只有已发放和未发放才允许置尾
      const notEndMos = this.view.data.filter(x => this.selectionKeys.findIndex(key => key === x.ID) > -1 && moStatus.findIndex(s => s === x.MAKE_ORDER_STATUS) === -1);
      if (notEndMos !== undefined && notEndMos.length > 0) {
        let moList = '';
        notEndMos.forEach(x => { moList = moList + ',' + x.MAKE_ORDER_NUM; });
        this.msgSrv.warning(this.appTranslationService.translate('工单【' + moList.substr(1, moList.length - 1) + '】不允许置尾，只有已发放或者未发放的工单可以置尾！'));
      } else {
        this.modal
          .static(PlanscheduleDigitalizationWorkbenchEndMoComponent, { gridSelectKeys: this.selectionKeys }, 'lg')
          .subscribe((value) => {
            if (value) {
              this.query();
            }
          });
      }
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选记录!'));
    }
  }

  fixValues = {
    buttonText: '固定时间', // 勾选的第一项已固定时显示'取消固定'，否则显示'固定时间'
    fixType: true, // 类型：true固定;false取消固定
    setFix: function () {
      this.buttonText = '固定时间';
      this.fixType = true;
    },
    setNotFix: function () {
      this.buttonText = '取消固定';
      this.fixType = false;
    }
  };
  private fixTypeChange() {
    if (this.selectionKeys.length > 0) {
      const firstSelectItem = this.view.data.find(x => this.selectionKeys[0] === x.ID);
      if (firstSelectItem.FIX_SCHEDULE_TIME !== null && firstSelectItem.FIX_SCHEDULE_TIME !== '') {
        this.fixValues.setNotFix();
      } else {
        this.fixValues.setFix();
      }
    } else {
      this.fixValues.setFix();
    }
  }
  // 固定
  public fixMo() {
    if (this.selectionKeys.length > 0) {
      // 弹出确认框
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate(this.fixValues.fixType ? '确定要固定吗？' : '确定要取消固定吗？'),
        nzOnOk: () => {
          const fixMoList = [];
          this.getGridSelectItems().forEach(mo => { fixMoList.push({ ID: mo.ID, FIX_SCHEDULE_TIME: mo.FPC_TIME }); });
          this.editService.FixMo(fixMoList, this.fixValues.fixType).subscribe(result => {
            if (result !== null && result.Success) {
              this.msgSrv.success(this.appTranslationService.translate(result.Message));
              this.query();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(result.Message || '操作失败！'));
            }
          });
        },
      });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选记录!'));
    }
  }
  // 备注（选颜色）
  public remarkMo_color() {
    if (this.selectionKeys.length > 0) {
      const firstSelectItem = this.view.data.find(x => this.selectionKeys[0] === x.ID);
      this.modal
        .static(PlanscheduleDigitalizationWorkbenchRemarkMoComponent, { gridSelectKeys: this.selectionKeys, i: { COMMENTS: firstSelectItem.COMMENTS, COLOR: firstSelectItem.ATTRIBUTE1 } }, 'md')
        .subscribe((value) => {
          if (value) {
            this.query();
          }
        });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选记录!'));
    }
  }

  // 备注
  public remarkMo() {
    if (this.editService.hasChanges()) {
      const that = this;
      // 延时0.1秒执行获取最后一次备注的数据
      setTimeout(function () {
        that.remarkOperate();
      }, 100);
    }
  }

  // 工单簇
  public openMoLevel() {
    if (this.view.data.length > 0) {
      const row = this.gridSelectRow || this.view.data[0];
      this.modal
        .static(PlanscheduleDigitalizationWorkbenchMoLevelComponent, { i: { ID: (row !== undefined ? row.ID : null) } }, 'xl')
        .subscribe(() => {
        });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先查询数据!'));
    }
  }

  // 打开工单修改
  public openMoEdit() {
    if (this.selectionKeys.length > 0) {
      this.openMoEditCommon(this.selectionKeys[0]);
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选记录!'));
    }
  }

  public openMoEditCommon(ID: string) {
    this.modal
      .static(PlanscheduleMomanagerEditComponent, { i: { Id: ID } }, 'xl')
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }
  // 打开工单组件
  public openMoComponent() {
    if (this.view.data.length > 0) {
      const row = this.gridSelectRow || this.view.data[0];
      this.modal
        .static(ComVindicateComponent, { pShowTitle: true, pGridSelectRow: row }, 'xl')
        .subscribe(() => { });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先查询数据!'));
    }
  }
  // 打开排产表
  public openSchedule() {
    if (this.view.data.length > 0) {
      const row = this.gridSelectRow || this.view.data[0];
      this.modal
        .static(PlanscheduleShiftplanComponent, { pShowTitle: true, pGridSelectRow: row }, 'xl')
        .subscribe(() => { });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先查询数据!'));
    }
  }
  // 打开工作日历
  public openCalendar() {
    if (this.view.data.length > 0) {
      const row = this.gridSelectRow || this.view.data[0];
      this.modal
        .static(PlantModelCalendarComponent, { pShowTitle: true, pGridSelectRow: row }, 'xl')
        .subscribe(() => { });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先查询数据!'));
    }
  }
  /* ---------------------------------grid事件---------------------------------- */
  // 切换页码，不分页时无效
  public dataStateChange(state: State) {
    this.gridState = state;
    // this.queryCommon();
    this.view = {
      data: process(this.gridData, {
        sort: this.gridState.sort,
        skip: this.gridState.skip,
        take: this.gridData.length,
        filter: this.gridState.filter
      }).data,
      total: this.gridData.length
    };
  }
  // 允许编辑的列
  editColumns = ['SEQ_NO', 'RESOURCE_CODE', 'COMMENTS'];
  // grid 单元格点击编辑
  public cellClickHandler({ sender, rowIndex, column, columnIndex, dataItem, isEdited }) {
    if (!isEdited && this.editColumns.indexOf(column.field) > -1) {
      if (column.field === 'RESOURCE_CODE') {
        this.loadLine(dataItem.PLANT_CODE, dataItem.ITEM_ID, dataItem.RESOURCE_CODE);
      }
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
    // 保存当前选中行
    this.gridSelectRow = this.view.data[rowIndex];
    // 默认当前记录为刷新选中项
    this.refreshValues.selection.length = 0;
    this.queryValues.selection.forEach(x => {
      if (x.level === 1 && this.gridSelectRow.RESOURCE_CODE === x.CODE) {
        this.refreshValues.selection.push({ ID: x.ID, CODE: x.CODE, DESCRIPTION: x.DESCRIPTION, level: 1 });
      }
    });
  }
  // grid 单元格关闭编辑
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      // 新值替换原值
      for (const filed in formGroup.value) {
        dataItem[filed] = formGroup.value[filed];
      }
      this.editService.update(dataItem);
    }
  }
  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      'SEQ_NO': [dataItem.SEQ_NO, Validators.compose([Validators.required, Validators.pattern('^([0-9]+[.][0-9]+|[0-9]+)')])],
      'RESOURCE_CODE': [dataItem.RESOURCE_CODE, Validators.required],
      'COMMENTS': dataItem.COMMENTS
    });
  }
  // checkbox 勾选/取消勾选
  public selectedKeysChange(event: any) {
    this.fixTypeChange();
  }
  // grid row样式设置
  public rowCallback = (context: RowClassArgs) => {
    const SEQ_NO = context.dataItem.SEQ_NO;
    return { first_row_workbench: SEQ_NO === 1 };
  }
  /* -------------------------------------------------------------------------- */

  // 以下测试数据
  dataSet: any[] = [];
  private generateData() {
    const time = new Date();
    for (let i = 0; i < 46; i++) {
      this.dataSet.push({
        ROW_NO: i + 1,
        SCHEDULE_GROUP_CODE: `部装01-M23_${i}`,
        RESOURCE_CODE: `PZZ1KX0001_${i}`,
        MAKE_ORDER_NUM: `164-4528479_${i}`,
        ITEM_CODE: `10103020000004_${i}`,
        DESCRIPTIONS_CN: `压缩机_${i}`,
        MO_QTY: 100 + i,
        COMPLETE_QTY: 50 + i,
        PLAN_QTY: 50 + i,
        LEFT_QTY: 50 - i,
        COMMENTS: '',
        FPC_TIME: time,
        LPC_TIME: time,
        DEMAND_DATE: time,
        PARENT_FPC_TIME: time,
        FIX_SCHEDULE_TIME: time,
        INSPECTION_TIME: time,
        FPS_TIME: time,
        LPS_TIME: time,
        BACKLOG_FLAG: i % 2 === 0 ? '是' : '否',
        BACKLOG_REASON: ''
      });
    }
  }

}
