import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { EditService } from './edit.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { ProcessScheduleOpdigitalizationWorkbenchSearchComponent } from './search/search.component';
import { ProcessScheduleOpdigitalizationWorkbenchRefreshComponent } from './refresh/refresh.component';
import { ProcessScheduleOpdigitalizationWorkbenchEndMoComponent } from './endMo/endMo.component';
import { ProcessScheduleOpdigitalizationWorkbenchBatchMoveComponent } from './batchMove/batchMove.component';
import { ProcessScheduleOpdigitalizationWorkbenchCalculateWorkingComponent } from './calculateWorking/calculateWorking.component';
import { ProcessScheduleOpdigitalizationWorkbenchMoLevelComponent } from './moLevel/moLevel.component';
import { ProcessScheduleMoprocessMaintenanceEditComponent } from '../moprocess-maintenance/edit/edit.component';
import { PlantModelCalendarComponent } from '../../plant-model/calendar/calendar.component';
import { ProcessSchedulePoComVindicateComponent } from '../pocomvindicate/pocomvindicate.component';
import { ProcessScheduleOpdigitalizationWorkbenchChooseLineComponent } from './chooseLine/chooseLine.component';
import { ProcessScheduleOpdigitalizationWorkbenchPlanReleaseComponent } from './planrelease/planrelease.component';
import { ProcessScheduleOpShiftplanComponent } from '../opshiftplan/opshiftplan.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProcessScheduleOpdigitalizationWorkbenchSetResourceAndRateComponent } from './setResourceAndRate/setResourceAndRate.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ProcessScheduleOpdigitalizationWorkbenchSplitMoComponent } from './splitMo/splitMo.component';
import { UpdateColorCellDirective } from '@shared/directive/update-color-cell/update-color-cell.directive';
import { PlanscheduleMoexceptionAgComponent } from 'app/aps/planschedule/moexception/moexception-ag.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'process-schedule-opdigitalization-workbench',
  templateUrl: './opdigitalization-workbench.component.html',
  styles: [
    `
      .div_menu {
        position: relative;
        padding: 5px 0px;
        text-align: left;
      }

      .span_menu {
        display: inline-block;
        margin: 0px auto;
      }
    `,
  ],
  providers: [EditService],
})
export class ProcessScheduleOpdigitalizationWorkbenchComponent
  extends CustomBaseContext
  implements OnInit, AfterViewInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<
    any
  >;
  graphicalInput: any;

  @ViewChild(UpdateColorCellDirective, { static: false }) ucc;
  color = '#fff';
  defaultColDef = {
    ...this.defaultColDef,
    /** 配置列变更颜色逻辑,可按自身需求修改逻辑*/
    cellStyle: param => {
      let exist = false;
      let color = null;
      const cc = param.data.MARK_COLOUR;
      if (cc) {
        for (const c in cc) {
          if (cc[c].indexOf(param.column.colId) !== -1) {
            exist = true;
            color = c;
            break;
          }
        }
        if (exist) {
          return { backgroundColor: color };
        }
      }
    }
  };
  gridOptions = {
    ...this.gridOptions,
    defaultColDef: this.defaultColDef,
  };
  // 选色卡
  pickerClose(color) {
    this.ucc.changeCellColor(color).subscribe(data => {
      // 传给服务的参数
      this.editService.MarkColour(data.data.ID, JSON.stringify(data.record)).subscribe(result => {
        if (result !== null && result.Success) {
          this.msgSrv.success(this.appTranslationService.translate(this.Msg.SaveSuccess));
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.graphicalInput = {
        ScheduleRegionCode: params['ScheduleRegionCode'],
        PlantCode: params['PlantCode'],
        ScheduleGroupCode: params['ScheduleGroupCode'],
        ResouceCode: params['ResouceCode'],
        StartDate: params['StartDate'],
        EndDate: params['EndDate'],
      };
      if (this.graphicalInput.ScheduleRegionCode === undefined) {
        setTimeout(() => {
          this.search();
          this.onVirtualColumnsChanged(null);
        });
      } else {
        this.query();
      }
    });
  }
  /* ------------------------------------------以下为参数定义---------------------------------------- */
  // headerTemplate
  private template = `<div class="ag-cell-label-container" role="presentation">
        <div ref="eLabel" class="ag-header-cell-label" role="presentation">
          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
        </div>
      </div>`;
  // grid资源下拉选项
  private lineSelectValues = [];
  private background = '#7CFC00';

  // grid 设置行样式
  public getRowStyle = function (params) {
    return null;
    if (params.node.data.SEQ_NO_COLOR === 1) {
      return { 'background-color': params.context.background, color: 'red' };
    } else {
      // return { 'background-color': '#fcfdfe', color: 'black' };
      return null;
    }
  };
  // 显示区列定义

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    public editService: EditService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private route: ActivatedRoute,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.setGridHeight({ topMargin: 120, bottomMargin: 45 });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);

    this.commonQueryService
      .GetColor('', 'MO_DATE_NO11', '')
      .subscribe(result => {
        result.extra.forEach(d => {
          this.background = d.COLOR_VALUE;
        });
      });
  }

  ngOnInit() {
    this.defaultColDef.sortable = false;
    this.columns = [
      {
        colId: 3,
        field: '',
        headerName: '操作',
        width: 80,
        pinned: this.pinnedAlign,
        lockPinned: true,
        headerComponentParams: {
          template: this.headerTemplate,
        },
        cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
        cellRendererParams: {
          customTemplate: this.customTemplate1, // Complementing the Cell Renderer parameters
        },
      },
      {
        colId: 0,
        cellClass: '',
        field: 'drag',
        headerName: '',
        width: 40,
        pinned: 'left',
        lockPinned: true,
        rowDrag: true,
        headerComponentParams: {
          template: this.template,
        },
      },
      {
        colId: 1,
        cellClass: '',
        field: 'check',
        headerName: '',
        width: 40,
        pinned: 'left',
        lockPinned: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerComponentParams: {
          template: this.template,
        },
      },
      {
        field: 'SEQ_NO',
        headerName: '顺序',
        width: 70,
        pinned: 'left',
        lockPinned: true,
        editable: true,
        cellEditor: 'agTextCellEditor',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'SCHEDULE_GROUP_CODE',
        headerName: '计划组',
        width: 100,
        pinned: 'left',
        lockPinned: true,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'RESOURCE_CODE',
        headerName: '资源',
        width: 100,
        pinned: 'left',
        lockPinned: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: params => {
          if (params.colDef.field === 'RESOURCE_CODE') {
            const dataItem = params.data;
            return this.loadLine(
              dataItem.PLANT_CODE,
              dataItem.ITEM_ID,
              dataItem.PROCESS_CODE,
            );
          }
        },
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'PROCESS_CODE',
        headerName: '工序编码',
        width: 100,
        pinned: 'left',
        lockPinned: false,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'PROCESS_DESCRIPTION',
        headerName: '工序描述',
        width: 100,
        pinned: 'left',
        lockPinned: false,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'PROCESS_MAKE_ORDER_NUM',
        headerName: '工序工单',
        width: 150,
        pinned: 'left',
        lockPinned: false,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate,
        },
      },
      {
        field: 'ITEM_CODE',
        headerName: '物料',
        width: 120,
        pinned: 'left',
        lockPinned: false,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'DESCRIPTIONS_CN',
        headerName: '物料描述',
        width: 150,
        tooltipField: 'DESCRIPTIONS_CN',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'MO_QTY',
        headerName: '工单数量',
        width: 100,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'PLAN_QTY',
        headerName: '排产数量',
        width: 100,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'COMPLETE_QTY',
        headerName: '完工数量',
        width: 100,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'COMMENTS',
        headerName: '备注',
        width: 150,
        tooltipField: 'COMMENTS',
        editable: true,
        cellEditor: 'agLargeTextCellEditor',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      { field: 'EXCEPTION_MESSAGE', headerName: '例外信息', width: 120 },
      {
        field: 'FPC_TIME',
        headerName: '开始时间',
        width: 150,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'LPC_TIME',
        headerName: '完成时间',
        width: 150,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'FIX_SCHEDULE_TIME',
        headerName: '固定时间',
        width: 150,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
        cellStyle: function (params) {
          if (params.value) {
            return { backgroundColor: 'lightcoral' };
          } else {
            return null;
          }
        },
      },
      {
        field: 'DEMAND_DATE',
        headerName: '需求时间',
        cellStyle: function (params) {
          if (params.data.DEMAND_DATE < params.data.LPC_TIME) { // 2020-7-29 开哥要求：当工单完工时间满足不了需求时间时，需求时间单元格用红底色标识
            return { backgroundColor: 'red' };
          } else {
            return null;
          }
        },
        width: 150,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'PARENT_FPC_TIME',
        headerName: '父工序开始时间',
        width: 150,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'TOP_FPC_TIME',
        headerName: '顶层工序开始时间',
        width: 150,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'BACKLOG_FLAG',
        headerName: '尾数标识',
        width: 100,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'BACKLOG_REASON',
        headerName: '尾数原因',
        width: 150,
        tooltipField: 'BACKLOG_REASON',
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'STANDARD_FLAG_NAME',
        headerName: '标准工单类型',
        width: 120,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'MAKE_ORDER_TYPE_NAME',
        headerName: '工单类型',
        width: 100,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'MAKE_ORDER_STATUS_NAME',
        headerName: '工单状态',
        width: 100,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'SOURCE_MAKE_ORDER_NUM',
        headerName: '来源工单',
        width: 120,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'REQ_NUMBER',
        headerName: '需求订单号',
        width: 120,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'REQ_LINE_NUM',
        headerName: '需求订单行号',
        width: 120,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'PROJECT_NUMBER',
        headerName: '项目号',
        width: 150,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'EARLIEST_START_TIME',
        headerName: '生产最早开始时间',
        width: 150,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      {
        field: 'SWITCH_TIME',
        headerName: '换型时间（小时）',
        width: 150,
        menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      },
      { field: 'MARK_COLOUR', headerName: '颜色', hide: true }
      // { field: 'UNIT_OF_MEASURE', headerName: '单位', width: 80 },
      // { field: 'TOP_PROCESS_MO_NUM', headerName: '顶层工序工单号', width: 150 },
      // { field: 'TOP_MAKE_ORDER_STATUS_NAME', headerName: '顶层工序工单状态', width: 120 },
      // { field: 'PARENT_PROCESS_MO_NUM', headerName: '父工序工单号', width: 150 },
      // { field: 'PARENT_MAKE_ORDER_STATUS_NAME', headerName: '父工序工单状态', width: 120 },
      // { field: 'COMPLETION_SUBINVENTORY', headerName: '完工子库', width: 120 },
      // { field: 'REQ_TYPE_NAME', headerName: '需求类型', width: 120 },
      // { field: 'RELEASED_DATE', headerName: '发放时间', width: 170 },
      // { field: 'RELEASED_BY', headerName: '发放者', width: 100 },
      // { field: 'COMPLETED_DATE', headerName: '完成时间', width: 170 },
      // { field: 'FPC_TIME', headerName: '首件完成时间', width: 170 },
      // { field: 'LPC_TIME', headerName: '末件完成时间', width: 170 },
      // { field: 'FULFILL_TIME', headerName: '最终完成时间', width: 170 },
      // { field: 'OFFSET_LEAD_TIME', headerName: '提前量（小时）', width: 150 },
      // { field: 'CREATION_DATE', headerName: '创建时间', width: 170 },
      // { field: 'MO_WARNNING_FLAG', headerName: '警告信息', width: 120 },
      // { field: 'SCHEDULE_FLAG', headerName: '参与排产标识', width: 150 },
      // { field: 'MOULD_CODE', headerName: '模具', width: 100 }
    ];
    this.gridData = [];
  }
  // 查询参数
  public queryValues = {
    regionCode: '',
    plantCode: this.appConfigService.getPlantCode(),
    groupCode: '',
    lineIdsStr: '',
    startTime: null,
    endTime: null,
    selection: [],
    expand: [],
    treeDataTable: [],
  };
  // 刷新（计划发布/工单联动/上层联动）参数
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
      this.titleText = '工序联动';
    },
    setMoUpLink: function () {
      this.type = 4;
      this.titleText = '上层联动';
    },
  };
  // 物料工艺路线缓存 （查询时加载）
  public itemlines = [];
  // 是否已刷新
  public IsCompleterefresh = false;
  // grid当前选中行
  public gridSelectRow: any;
  // grid所有选中行
  public gridSelectRows: any[];
  // 提示语
  public Msg = {
    NeedQuery: '请先执行查询！',
    NeedRefresh: '请先执行排产刷新！',
    NeedSelect: '请先勾选记录!',
    ContrainSameResource: '请选择相同资源下的工单!',
    ConfirmFix: '确定要固定吗？',
    ConfirmCancelFix: '确定要取消固定吗？',
    SaveFail: '保存失败！',
    SaveSuccess: '保存成功！',
    SubmitFail: '请求提交失败！',
    SubmitSuccess: '请求提交成功！',
    Fail: '操作失败！',
    Success: '操作成功！',
  };
  /* ------------------------------功能按钮事件----------------------------------- */
  // 查询
  public search() {
    this.modal
      .static(
        ProcessScheduleOpdigitalizationWorkbenchSearchComponent,
        { i: this.queryValues },
        'lg',
      )
      .subscribe(value => {
        console.log(this.queryValues, 'this.queryValues');
        if (value) {
          this.query();
        }
      });
  }
  // 刷新(计划组选择 共用)
  private refreshCommon(resetSelection: Boolean) {
    // if (this.queryValues.selection === null || this.queryValues.selection.length === 0) {
    if (this.gridData.length === 0) {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedQuery),
      );
    } else {
      this.generateTreeDataTable(this.refreshValues.treeDataTable);
      this.refreshValues.regionCode = this.queryValues.regionCode;
      this.refreshValues.plantCode = this.queryValues.plantCode;
      this.refreshValues.treeDataTableAll = this.queryValues.treeDataTable;
      if (resetSelection && this.gridApi.getSelectedRows().length > 0) {
        const lines = [];
        this.gridApi.getSelectedRows().forEach(row => {
          if (lines.findIndex(line => line === row.RESOURCE_CODE) === -1) {
            lines.push(row.RESOURCE_CODE);
          }
        });
        // 设置刷新的勾选项
        this.setRefreshSelection(lines);
      }
      this.modal
        .static(
          ProcessScheduleOpdigitalizationWorkbenchRefreshComponent,
          { i: this.refreshValues },
          'lg',
        )
        .subscribe(val => {
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
        });
    }
  }
  // 刷新
  public refresh(resetSelection: Boolean) {
    this.refreshValues.setRefresh();
    this.refreshCommon(resetSelection);
  }
  // 计划发布
  public PlanRelease() {
    this.IsCompleterefresh = true;
    if (!this.IsCompleterefresh) {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedRefresh),
      );
      return;
    }
    // if (this.queryValues.selection === null || this.queryValues.selection.length === 0) {
    if (this.gridData.length === 0) {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedQuery),
      );
    } else {
      // 设置为计划发布
      this.refreshValues.setPlanRelease();
      this.refreshCommon(true);
    }
  }
  // 工单联动
  public moLink() {
    this.refreshValues.setMoLink();
    this.refreshCommon(true);
  }
  // 上层联动
  public moUpLink() {
    this.refreshValues.setMoUpLink();
    this.refreshCommon(true);
  }
  // 集约选线
  public chooseLine() {
    if (this.gridData.length > 0) {
      const row = this.gridSelectRow || this.gridData[0];
      this.modal
        .static(
          ProcessScheduleOpdigitalizationWorkbenchChooseLineComponent,
          {
            i: {
              SCHEDULE_REGION_CODE: row.SCHEDULE_REGION_CODE,
              PLANT_CODE: row.PLANT_CODE,
              SCHEDULE_GROUP_CODE: row.SCHEDULE_GROUP_CODE,
              RESOURCE_CODE: row.RESOURCE_CODE,
            },
            querySelection: this.queryValues.selection,
          },
          'lg',
        )
        .subscribe(value => {
          if (value) {
          }
        });
    } else {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedQuery),
      );
    }
  }
  // 顺序/资源 调整保存
  public save() {
    if (this.editService.hasChanges()) {
      const context = this;
      // 延时0.1秒执行获取最后一次调整的数据
      setTimeout(function () {
        context.adjustOperate();
      }, 100);
    }
  }

  private batchSelection: any[] = []; // 按资源批量调整 资源勾选项
  private batchExpandtion: any[] = []; // 按资源批量调整 资源展开项
  // 按资源批量调整
  public batchMove() {
    if (this.selectionKeys.length > 0) {
      this.batchSelection = [];
      this.batchExpandtion = [];
      this.modal
        .static(
          ProcessScheduleOpdigitalizationWorkbenchBatchMoveComponent,
          {
            gridData: this.gridData,
            gridSelectionKeys: this.selectionKeys,
            selection: this.batchSelection,
            expandtion: this.batchExpandtion,
          },
          1100,
        )
        .subscribe(value => {
          if (value) {
            const lines = [];
            this.gridApi.getSelectedRows().forEach(res => {
              if (lines.findIndex(l => l === res.RESOURCE_CODE) === -1) {
                lines.push(res.RESOURCE_CODE);
              }
            });
            // 获取勾选的MO,通过MO的parent取产线
            const mo = this.batchSelection.find(x => x.level === 2); // level:0/1/2 代表 计划组/产线/MO
            lines.push(mo.parent.CODE);
            this.setRefreshSelection(lines); // 只允许批量调整一个计划组，所以此处取任取一计划组
            this.refresh(false);
          }
        });
    } else {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedSelect),
      );
    }
  }
  // 产能平衡
  public calculateWorking() {
    if (this.selectionKeys.length > 0) {
      const gridSelectItems = this.gridSelectRows;
      const resourceCode = gridSelectItems[0].RESOURCE_CODE;
      // 勾选了多个产线
      if (
        gridSelectItems.findIndex(x => x.RESOURCE_CODE !== resourceCode) > -1
      ) {
        this.msgSrv.warning(
          this.appTranslationService.translate(this.Msg.ContrainSameResource),
        );
      } else {
        this.modal
          .static(
            ProcessScheduleOpdigitalizationWorkbenchCalculateWorkingComponent,
            { gridSelectItems: gridSelectItems },
            'lg',
          )
          .subscribe(value => {
            if (value) {
              this.query();
            }
          });
      }
    } else {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedSelect),
      );
    }
  }
  // 置尾单
  public setEndMo() {
    if (this.selectionKeys.length > 0) {
      const moStatus = ['R', 'S']; // 只有已发放和未发放才允许置尾
      const notEndMos = this.gridData.filter(
        x =>
          this.selectionKeys.findIndex(key => key === x.ID) > -1 &&
          moStatus.findIndex(s => s === x.MAKE_ORDER_STATUS) === -1,
      );
      if (notEndMos !== undefined && notEndMos.length > 0) {
        let moList = '';
        notEndMos.forEach(x => {
          moList = moList + ',' + x.PROCESS_MAKE_ORDER_NUM;
        });
        this.msgSrv.warning(
          this.appTranslationService.translate(
            '工单【' +
            moList.substr(1, moList.length - 1) +
            '】不允许置尾，只有已发放或者未发放的工单可以置尾！',
          ),
        );
      } else {
        this.modal
          .static(
            ProcessScheduleOpdigitalizationWorkbenchEndMoComponent,
            { gridSelectKeys: this.selectionKeys },
            'lg',
          )
          .subscribe(value => {
            if (value) {
              this.query();
            }
          });
      }
    } else {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedSelect),
      );
    }
  }
  // 固定
  public fixMo() {
    if (this.selectionKeys.length > 0) {
      // 弹出确认框
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate(
          this.fixValues.fixType
            ? this.Msg.ConfirmFix
            : this.Msg.ConfirmCancelFix,
        ),
        nzOnOk: () => {
          const fixMoList = [];
          this.gridSelectRows.forEach(mo => {
            fixMoList.push({ ID: mo.ID, FIX_SCHEDULE_TIME: mo.FPC_TIME });
          });
          this.editService
            .FixMo(fixMoList, this.fixValues.fixType)
            .subscribe(result => {
              if (result !== null && result.Success) {
                this.msgSrv.success(
                  this.appTranslationService.translate(result.Message),
                );
                this.query();
              } else {
                this.msgSrv.error(
                  this.appTranslationService.translate(
                    result.Message || this.Msg.Fail,
                  ),
                );
              }
            });
        },
      });
    } else {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedSelect),
      );
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
    if (this.gridData.length > 0) {
      const row = this.gridSelectRow || this.gridData[0];
      if (row && row.PROCESS_MAKE_ORDER_NUM) {
        const modal = this.confirmationService.create({
          // nzWrapClassName: 'modal-lg',
          nzTitle: this.appTranslationService.translate('工单簇'),
          nzContent: ProcessScheduleOpdigitalizationWorkbenchMoLevelComponent,
          nzFooter: null,
          nzWidth: 1200,
          nzComponentParams: { i: { ID: row !== undefined ? row.ID : null } },
        });

        modal.afterOpen.subscribe(() => {
          const instance = modal.getContentComponent();
          instance.GetGraphicalMoLevel();
        });

        modal.afterClose.subscribe(() => {
          modal.destroy();
        });
      } else {
        this.msgSrv.warning(
          this.appTranslationService.translate(this.Msg.NeedSelect),
        );
      }
    } else {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedQuery),
      );
    }
  }
  // 打开工单修改
  public openMoEdit() {
    if (this.selectionKeys.length > 0) {
      this.openMoEditCommon(this.selectionKeys[0]);
    } else {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedSelect),
      );
    }
  }

  // 工单修改
  private openMoEditCommon(ID: string) {
    this.modal
      .static(
        ProcessScheduleMoprocessMaintenanceEditComponent,
        { j: { Id: ID } },
        'xl',
      )
      .subscribe(value => {
        this.hasEventTriggered = false;
        if (value) {
          this.query();
        }
      });
  }
  // 打开工单组件
  public openMoComponent() {
    if (this.gridData.length > 0) {
      const row = this.gridSelectRow || this.gridData[0];
      this.modal
        .static(
          ProcessSchedulePoComVindicateComponent,
          {
            pShowTitle: true,
            pGridSelectRow: row,
            fixed: false,
            showButton: false,
          },
          'lg',
        )
        .subscribe(() => { });
    } else {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedQuery),
      );
    }
  }
  // 打开排产表
  public openSchedule() {
    if (this.gridData.length > 0) {
      const row = this.gridSelectRow || this.gridData[0];
      let rows = this.gridApi.getSelectedRows();
      if (rows.length === 0) {
        rows = [row];
      }
      this.modal
        .static(
          ProcessScheduleOpShiftplanComponent,
          { pShowTitle: true, pGridSelectRow: row, pGridSelectRows: rows },
          'lg',
        )
        .subscribe(() => { });
    } else {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedQuery),
      );
    }
  }
  // 打开工作日历
  public openCalendar() {
    if (this.gridData.length > 0) {
      const row = this.gridSelectRow || this.gridData[0];
      this.modal
        .static(
          PlantModelCalendarComponent,
          { pShowTitle: true, pGridSelectRow: row },
          'xl',
        )
        .subscribe(() => { });
    } else {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedQuery),
      );
    }
  }

  /* -------------------------------服务请求调用-------------------------------- */
  // 产线树形结构加载产线数据
  private setLineData(groupData: any[]) {
    const data = groupData;
    // 获取产线
    this.editService
      .GetUserPlantGroupLineOrderByCode(
        this.queryValues.plantCode || '',
        '',
        true,
      )
      .subscribe(result => {
        if (result.extra !== undefined && result.extra !== null) {
          // 根据计划组编码匹配产线子节点数据
          data.forEach(x => {
            const items = result.extra.filter(
              d => d.SCHEDULE_GROUP_CODE === x.CODE,
            );
            if (items !== undefined && items !== null) x.children = [];
            items.forEach(i => {
              const dataItem = {
                ID: i.ID,
                CODE: i.RESOURCE_CODE,
                DESCRIPTION: i.DESCRIPTIONS,
              };
              x.children.push(dataItem);
            });
          });
          this.queryValues.treeDataTable = data; // 注意：数据加载完再赋值
        }
      });
  }

  // 加载资源树形数据（刷新功能）
  private loadLineTreeDataTable() {
    // 获取计划组（产线树形结构数据）
    this.editService
      .GetUserPlantGroupOrderByCode(
        this.queryValues.plantCode || '',
        this.queryValues.regionCode || '',
        true,
      )
      .subscribe(result => {
        if (result.extra !== undefined && result.extra !== null) {
          const data = [];
          result.extra.forEach(x => {
            data.push({
              ID: x.ID,
              CODE: x.SCHEDULE_GROUP_CODE,
              DESCRIPTION: x.DESCRIPTIONS,
            });
          });
          this.setLineData(data);
        }
      });
  }

  // 查询
  public query() {
    super.query();
    this.queryCommon();
  }
  // 查询服务请求
  private queryCommon() {
    const lineCodes = [];
    let regionCode, plantCode, startTime, endTime;
    // 开始加载
    this.setLoading(true);
    if (this.graphicalInput.ScheduleRegionCode !== undefined) {
      this.queryValues.regionCode = regionCode = this.graphicalInput
        .ScheduleRegionCode;
      this.queryValues.plantCode = plantCode = this.graphicalInput.PlantCode;
      this.queryValues.groupCode = this.graphicalInput.ScheduleGroupCode;
      this.queryValues.startTime = this.graphicalInput.StartDate;
      this.queryValues.endTime = this.graphicalInput.EndDate;
      lineCodes.push(this.graphicalInput.ResouceCode);
      startTime = this.editService.formatDate(this.graphicalInput.StartDate);
      endTime = this.editService.formatDate(this.graphicalInput.EndDate);
      this.graphicalInput.ScheduleRegionCode = undefined;
      this.loadLineTreeDataTable();
    } else {
      regionCode = this.queryValues.regionCode;
      plantCode = this.queryValues.plantCode;
      // 获取选中资源编码
      this.queryValues.selection.forEach(x => {
        if (x.level === 1) {
          lineCodes.push(x.CODE);
        }
      });
      startTime = this.editService.formatDate(this.queryValues.startTime);
      endTime = this.editService.formatDate(this.queryValues.endTime);
    }

    this.editService
      .Search(regionCode, plantCode, lineCodes, startTime, endTime)
      .subscribe(result => {
        if (result !== null && result.Result !== null) {
          result.Result.forEach(d => { d.MARK_COLOUR = JSON.parse(d.MARK_COLOUR); });
          this.gridData = result.Result;
          this.itemlines = result.Extra; // 物料工艺路线
          setTimeout(() => {
            this.gridApi.redrawRows(); // 重绘，清除前一次查询的样式
          });
        }
        // 加载完毕
        this.setLoading(false);
        // 清除修改的内容
        this.editService.reset();
      });
  }
  // 刷新服务请求
  private refreshOperate() {
    const lineCodes = [];
    // 开始加载
    this.setLoading(true);
    // 获取选中资源编码
    this.refreshValues.selection.forEach(x => {
      if (x.level === 1) {
        lineCodes.push(x.CODE);
      }
    });
    const plantCode = this.refreshValues.plantCode;
    this.editService
      .Refresh(
        plantCode,
        lineCodes,
        this.editService.formatDate(this.queryValues.startTime),
        this.editService.formatDate(this.queryValues.endTime),
      )
      .subscribe(result => {
        if (result !== null && result.Success) {
          this.msgSrv.success(
            this.appTranslationService.translate(
              result.Message || this.Msg.Success,
            ),
          );
          this.query();
          this.IsCompleterefresh = true;
        } else {
          this.msgSrv.error(
            this.appTranslationService.translate(
              result.Message || this.Msg.Fail,
            ),
            this.msgOption,
          );
        }
        // 加载完毕
        this.setLoading(false);
      });
  }
  // 设置刷新产线勾选项(queryValues.selection数据项结构 [{ ID: i.ID, CODE: i.RESOURCE_CODE, DESCRIPTION: i.DESCRIPTIONS }])
  private setRefreshSelection(lineCodes: string[]) {
    if (
      this.queryValues.selection !== undefined &&
      this.queryValues.selection.length > 0
    ) {
      this.refreshValues.selection.length = 0;
      // 遍历查询勾选项的产线
      this.queryValues.selection.forEach(x => {
        if (x.level === 1 && lineCodes.findIndex(z => z === x.CODE) > -1) {
          this.refreshValues.selection.push({
            ID: x.ID,
            CODE: x.CODE,
            DESCRIPTION: x.DESCRIPTION,
          });
        }
      });
    }
  }
  // 调整服务请求
  private adjustOperate() {
    // 开始加载
    this.setLoading(true);
    const updateResources = []; // 调整顺序/资源需要更新MO优先级的资源
    this.editService.getUpdateItems().forEach(x => {
      if (updateResources.findIndex(r => r === x.RESOURCE_CODE) === -1) {
        updateResources.push(x.RESOURCE_CODE);
      }
      if (
        x.RESOURCE_CODE !== x.RESOURCE_CODE_OLD &&
        updateResources.findIndex(r => r === x.RESOURCE_CODE_OLD) === -1
      ) {
        updateResources.push(x.RESOURCE_CODE_OLD);
      }
    });
    const dtos = []; // 调整参数列表
    let RESOURCE_CODE = '';
    let index = 1;
    this.gridData.forEach(x => {
      // 只取与调整相关资源的MO传回中间件服务
      if (
        updateResources.findIndex(
          r => r === x.RESOURCE_CODE || r === x.RESOURCE_CODE_OLD,
        ) > -1
      ) {
        if (x.RESOURCE_CODE !== RESOURCE_CODE) {
          index = 1;
          RESOURCE_CODE = x.RESOURCE_CODE;
        }
        // 未编辑的按顺序更新序号,有编辑的以编辑为准
        if (x.SEQ_NO === x.SEQ_NO_OLD) {
          x.SEQ_NO = index;
          x.SEQ_NO_OLD = index;
        }
        // 传给服务的参数
        const dto = {
          ID: x.ID,
          SEQ_NO: x.SEQ_NO,
          PLANT_CODE: x.PLANT_CODE,
          RESOURCE_CODE: x.RESOURCE_CODE,
          RESOURCE_CODE_OLD: x.RESOURCE_CODE_OLD,
          FPC_TIME: x.FPC_TIME,
        };
        dtos.push(dto);
        index++;
      }
    });
    this.editService
      .Save(
        this.queryValues.regionCode,
        this.queryValues.plantCode,
        this.editService.formatDate(this.queryValues.startTime),
        this.editService.formatDate(this.queryValues.endTime),
        dtos,
      )
      .subscribe(result => {
        if (result !== null && result.Success) {
          this.msgSrv.success(
            this.appTranslationService.translate(
              this.Msg.SaveSuccess + '<br/>' + result.Message,
            ),
          );
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
          this.refresh(false);
          // 重置修改信息
          this.editService.reset();
        } else {
          this.msgSrv.error(
            this.appTranslationService.translate(
              this.Msg.SaveFail + '<br/>' + result.Message,
            ),
          );
        }
        // 加载完毕
        this.setLoading(false);
      });
  }
  // 备注服务请求
  private remarkOperate() {
    const dtos = []; // 备注参数列表
    this.editService.getUpdateItems().forEach(x => {
      // 传给服务的参数
      const dto = {
        ID: x.ID,
        COMMENTS: x.COMMENTS,
        COMMENTS_COLOR: x.COMMENTS_COLOR,
      };
      dtos.push(dto);
    });
    // 开始加载
    this.setLoading(true);
    this.editService.RemarkMo(dtos).subscribe(result => {
      if (result !== null && result.Success) {
        this.msgSrv.success(
          this.appTranslationService.translate(this.Msg.SaveSuccess),
        );
        // 重置修改信息
        this.editService.reset();
        this.query();
      } else {
        this.msgSrv.error(
          this.appTranslationService.translate(
            this.Msg.SaveFail + '<br/>' + result.Message,
          ),
        );
      }
      // 加载完毕
      this.setLoading(false);
    });
  }
  // 计划发布服务请求
  private releaseOperate() {
    const lineCodes = [];
    let groupCode = '';
    this.refreshValues.selection.forEach(x => {
      if (x.level === 1) {
        lineCodes.push(x.CODE);
        groupCode = x.parent.CODE;
      }
    });
    this.modal
      .static(
        ProcessScheduleOpdigitalizationWorkbenchPlanReleaseComponent,
        {
          i: {},
          regionCode: this.queryValues.regionCode,
          plantCode: this.queryValues.plantCode,
          lineCodes: lineCodes,
          startTime: this.queryValues.startTime,
          endTime: this.queryValues.endTime,
          schedule_group_code: groupCode,
          mainForm: this.context,
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }
  // 工单联动
  private moLinkOperate() {
    const lineCodes = [];
    // 开始加载
    this.setLoading(true);
    // 获取选中资源编码
    this.refreshValues.selection.forEach(x => {
      if (x.level === 1) {
        lineCodes.push(x.CODE);
      }
    });
    const plantCode = this.refreshValues.plantCode;
    this.editService
      .SubmitRequest_MoRecursive(plantCode, lineCodes)
      .subscribe(result => {
        if (result !== null && result.Success) {
          this.msgSrv.success(
            this.appTranslationService.translate(
              result.Message || this.Msg.SubmitSuccess,
            ),
          );
          this.query();
        } else {
          this.msgSrv.error(
            this.appTranslationService.translate(
              result.Message || this.Msg.SubmitFail,
            ),
          );
        }
        // 加载完毕
        this.setLoading(false);
      });
  }
  // 上层联动
  private upLinkOperate() {
    const lineCodes = [];
    // 开始加载
    this.setLoading(true);
    // 获取选中资源编码
    this.refreshValues.selection.forEach(x => {
      if (x.level === 1) {
        lineCodes.push(x.CODE);
      }
    });
    const plantCode = this.refreshValues.plantCode;
    this.editService
      .SubmitRequest_UpperLevelLinkage(plantCode, lineCodes)
      .subscribe(result => {
        if (result !== null && result.Success) {
          this.msgSrv.success(
            this.appTranslationService.translate(
              result.Message || this.Msg.SubmitSuccess,
            ),
          );
          this.query();
        } else {
          this.msgSrv.error(
            this.appTranslationService.translate(
              result.Message || this.Msg.SubmitFail,
            ),
          );
        }
        // 加载完毕
        this.setLoading(false);
      });
  }
  /* ----------------------------------其他方法------------------------------------- */
  // 固定按钮文本显示参数
  public fixValues = {
    buttonText: '固定时间', // 勾选的第一项已固定时显示'取消固定'，否则显示'固定时间'
    fixType: true, // 类型：true固定;false取消固定
    setFix: function () {
      this.buttonText = '固定时间';
      this.fixType = true;
    },
    setNotFix: function () {
      this.buttonText = '取消固定';
      this.fixType = false;
    },
  };
  // 固定文本变更
  private fixTypeChange() {
    if (this.selectionKeys.length > 0) {
      const firstSelectItem = this.gridData.find(
        x => this.selectionKeys[0] === x.ID,
      );
      if (
        firstSelectItem.FIX_SCHEDULE_TIME !== null &&
        firstSelectItem.FIX_SCHEDULE_TIME !== ''
      ) {
        this.fixValues.setNotFix();
      } else {
        this.fixValues.setFix();
      }
    } else {
      this.fixValues.setFix();
    }
  }
  // 加载物料工艺路线（资源）
  private loadLine(
    plantCode: string,
    itemId: string,
    PROCESS_CODE: string,
  ): any {
    this.lineSelectValues.length = 0;
    if (this.itemlines.length > 0) {
      const lines = this.itemlines.filter(
        x =>
          x.PLANT_CODE === plantCode &&
          x.ITEM_ID === itemId &&
          x.PROCESS_CODE === PROCESS_CODE,
      );
      lines.forEach(x => {
        this.lineSelectValues.push(x.RESOURCE_CODE);
      });
    }
    return { values: this.lineSelectValues };
  }
  // 根据查询选中项生成资源选择树
  private generateTreeDataTable(treeDataTable: any[]) {
    treeDataTable.length = 0;
    if (this.queryValues.selection.length > 0) {
      const expand = true;
      const checked = false;
      // 添加计划组
      this.queryValues.selection.forEach(x => {
        if (x.level === 0) {
          treeDataTable.push({
            ID: x.ID,
            CODE: x.CODE,
            DESCRIPTION: x.DESCRIPTION,
            children: [],
            expand: expand,
            checked: checked,
          });
        } else if (x.parent !== undefined) {
          // 未勾选计划组时
          const item = treeDataTable.find(y => y.ID === x.parent.ID);
          if (item === undefined || item === null) {
            treeDataTable.push({
              ID: x.parent.ID,
              CODE: x.parent.CODE,
              DESCRIPTION: x.parent.DESCRIPTION,
              children: [],
              expand: expand,
              checked: checked,
            });
          }
        }
      });
      // 添加资源
      treeDataTable.forEach(x => {
        this.queryValues.selection.forEach(y => {
          if (y.parent !== undefined && y.parent.ID === x.ID) {
            x.children.push({
              ID: y.ID,
              CODE: y.CODE,
              DESCRIPTION: y.DESCRIPTION,
              expand: expand,
              checked: checked,
            });
          }
        });
      });
    } else {
      this.queryValues.treeDataTable.forEach(x => {
        treeDataTable.push(x);
      });
    }
  }

  /* ---------------------------------grid事件---------------------------------- */
  public getRowNodeId = function getRowNodeId(data) {
    return data.ID;
  };

  onRowDragEnter(e) {
    // console.log('onRowDragEnter', e);
  }

  onRowDragMove(event) {
    const movingNode = event.node;
    const overNode = event.overNode;
    const rowNeedsToMove = movingNode !== overNode;
    if (rowNeedsToMove) {
      const movingData = movingNode.data;
      const overData = overNode.data;
      const newStore = this.gridData.slice();
      /* --------批量拖动start------ */
      const selectedRows = [movingData]; // 防止拖动行未选中
      this.gridApi.getSelectedRows().forEach(row => {
        if (selectedRows.indexOf(row) === -1) selectedRows.push(row);
      });
      // 目标行为选中行不移动
      if (selectedRows.indexOf(overData) === -1) {
        let movingDatas = [];
        if (selectedRows.length === 1) {
          movingDatas = selectedRows;
        } else {
          const movingIndex = this.gridData.indexOf(movingData);
          const overIndex = this.gridData.indexOf(overData);
          const dragDown = movingIndex < overIndex; // 向下拖动
          let index = 0;
          this.gridData.forEach(data => {
            const moveDown = index < overIndex;
            // 选中项与拖动方向一致才移动行
            if (selectedRows.indexOf(data) > -1) {
              if (dragDown === moveDown) {
                if (dragDown) {
                  movingDatas.unshift(data);
                } else {
                  movingDatas.push(data);
                }
              }
            }
            index++;
          });
        }
        movingDatas.forEach(data => {
          // 相同资源范围内拖动
          if (data.RESOURCE_CODE === overData.RESOURCE_CODE) {
            const fromIndex = newStore.indexOf(data);
            const toIndex = newStore.indexOf(overData);
            moveInArray(newStore, fromIndex, toIndex);
          }
        });
      }
      /* --------批量拖动end----- */
      newStore.forEach(data => {
        data.SEQ_NO = data.SEQ_NO_OLD; // 移动后忽略之前对顺序号的更改
      });
      this.gridData = this.clone(newStore);
      this.gridApi.setRowData(this.gridData);
      this.gridApi.clearFocusedCell();
    }
    function moveInArray(arr: any[], fromIndex: number, toIndex: number) {
      const element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element); // 在目标后插入
    }
  }

  onRowDragEnd(e) {
    const data = e.node.data;
    // 修改更新标记
    // this.editService.update(data);
    this.calculateFPC(data);
    this.gridData = this.clone(this.gridData);
  }

  onRowDragLeave(e) {
    // console.log('onRowDragLeave', e);
  }
  // 行选中
  onRowSelected(event) {
    // console.log(event);
    // 保存当前选中行
    this.setCurrentSelectedRow(event.data);
  }
  // 单元格双击
  onCellDoubleClicked(event) {
    if (event.colDef.field === 'PROCESS_MAKE_ORDER_NUM') {
      if (this.checkEventTriggered()) return;
      this.openMoEditCommon(event.data.ID);
    }
  }
  // 修改序号
  CHANGE_INDEX = 0;
  // 根据拖动位置计算FPC/LPC
  calculateFPC(item: any) {
    console.log('calculateFPC');
    const datas = [...this.gridApi.getSelectedRows()];
    if (datas.findIndex(data => data === item) === -1) {
      datas.push(item);
    }
    const dataSort = [];
    // 按顺序排列
    this.gridData.forEach(gdata => {
      if (datas.findIndex(data => data === gdata) > -1) {
        dataSort.push(gdata);
      }
    });
    dataSort.forEach(data => {
      data.CHANGE_INDEX = ++this.CHANGE_INDEX;
      // 修改更新标记
      this.editService.update(data);
      const moList = this.gridData.filter(x => x.RESOURCE_CODE === data.RESOURCE_CODE); // 取同一生产线的MO
      if (moList.length > 1) {
        // 根据位置计算FPC_TIME/LPC_TIME
        const index = moList.indexOf(data);
        let fpc = new Date(data.FPC_TIME);
        let lpc = new Date(data.LPC_TIME);
        if (index === 0) {
          const targetMo = moList[dataSort.length]; // 取计算参考MO
          const timespan = lpc.getTime() - fpc.getTime(); // 毫秒数
          data.LPC_TIME = targetMo.FPC_TIME;
          lpc = new Date(data.LPC_TIME);
          data.FPC_TIME = this.editService.formatDateTime(new Date(lpc.getTime() - timespan));
        } else {
          const targetMo = moList[index - 1]; // 取计算参考MO
          const timespan = lpc.getTime() - fpc.getTime();
          // data.FPC_TIME = targetMo.LPC_TIME;
          const targetFpc = new Date(targetMo.FPC_TIME);
          data.FPC_TIME = this.editService.formatDateTime(new Date(targetFpc.getTime() + 1000));

          fpc = new Date(data.FPC_TIME);
          data.LPC_TIME = this.editService.formatDateTime(new Date(fpc.getTime() + timespan));
        }
      }
    });
  }
  // 根据序号计算FPC/LPC
  calculateFPC_SEQ(data: any) {
    data.CHANGE_INDEX = ++this.CHANGE_INDEX;
    // 修改更新标记
    this.editService.update(data);
    const moList = this.gridData.filter(x => x.RESOURCE_CODE === data.RESOURCE_CODE); // 取同一生产线的MO
    if (moList.length > 1) {
      // 根据位置计算FPC_TIME/LPC_TIME
      const lgList = moList.filter(x => x.SEQ_NO > data.SEQ_NO).sort((a, b) => {
        return a.SEQ_NO - b.SEQ_NO;
      });
      const smList = moList.filter(x => x.SEQ_NO < data.SEQ_NO).sort((a, b) => {
        return b.SEQ_NO - a.SEQ_NO;
      });
      let fpc = new Date(data.FPC_TIME);
      let lpc = new Date(data.LPC_TIME);
      if (smList.length > 0) {
        const targetMo = smList[0]; // 取计算参考MO
        const timespan = lpc.getTime() - fpc.getTime();
        // data.FPC_TIME = targetMo.LPC_TIME;
        const targetFpc = new Date(targetMo.FPC_TIME);
        data.FPC_TIME = this.editService.formatDateTime(new Date(targetFpc.getTime() + 1000));

        fpc = new Date(data.FPC_TIME);
        data.LPC_TIME = this.editService.formatDateTime(new Date(fpc.getTime() + timespan));
      } else if (lgList.length > 0) {
        const targetMo = lgList[0]; // 取计算参考MO
        const timespan = lpc.getTime() - fpc.getTime(); // 毫秒数
        data.LPC_TIME = targetMo.FPC_TIME;
        lpc = new Date(data.LPC_TIME);
        data.FPC_TIME = this.editService.formatDateTime(new Date(lpc.getTime() - timespan));
      }
      this.gridData = this.clone(this.gridData);
    }
  }
  // 单元格内容改变
  onCellValueChanged(event) {
    // console.log(event);
    if (
      this.isNullDefault(event.oldValue, '').toString() !==
      this.isNullDefault(event.newValue, '').toString() &&
      this.editColumnHeaders.findIndex(x => x === event.colDef.headerName) > -1
    ) {
      if (event.colDef.headerName === '顺序') {
        this.calculateFPC_SEQ(event.data);
      } else {
        // 修改更新标记
        this.editService.update(event.data);
      }
    }
  }
  // 行选中改变
  onSelectionChanged(event) {
    // console.log(event);
    this.gridSelectRows = this.gridApi.getSelectedRows();
    this.selectionKeys = [];
    if (!this.isNull(this.gridSelectRows) && this.gridSelectRows.length > 0) {
      this.gridSelectRows.forEach(d => {
        this.selectionKeys.push(d.ID);
      });
      // 设置当前选中行
      this.setCurrentSelectedRow(
        this.gridSelectRows[this.gridSelectRows.length - 1],
      );
    } else {
      // 设置当前选中行
      this.setCurrentSelectedRow(this.gridData[0]);
    }
    this.fixTypeChange();
  }
  // 条件过滤
  onFilterChanged(event) {
    const filterActive = this.gridApi.isAnyFilterPresent();
    this.gridApi.setSuppressRowDrag(filterActive);
    this.gridColumnApi.setColumnsVisible(['drag'], !filterActive);
  }
  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['顺序', '资源', '备注'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#opDigitalGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (
          this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1
        ) {
          dom.setAttribute('style', 'color: #FFA500');
        }
      });
    }
  }
  // grid初始化加载
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  // 设置当前选中行
  private setCurrentSelectedRow(rowData: any) {
    if (!this.isNull(rowData)) {
      // 保存当前选中行
      this.gridSelectRow = rowData;
      // 默认当前记录为刷新选中项
      this.refreshValues.selection.length = 0;
      this.queryValues.selection.forEach(x => {
        if (x.level === 1 && this.gridSelectRow.RESOURCE_CODE === x.CODE) {
          this.refreshValues.selection.push({
            ID: x.ID,
            CODE: x.CODE,
            DESCRIPTION: x.DESCRIPTION,
            level: 1,
          });
        }
      });
    }
  }
  // 工单指定
  public setResourceAndRate() {
    if (this.selectionKeys.length > 0) {
      const selectionKeys = [];
      this.gridData.forEach(d => {
        const key = d[this.selectBy];
        if (this.selectionKeys.findIndex(k => k === key) > -1) {
          selectionKeys.push(key);
        }
      });
      const linesReturn = [];
      this.modal
        .static(
          ProcessScheduleOpdigitalizationWorkbenchSetResourceAndRateComponent,
          {
            gridSelectKeys: selectionKeys,
            PLANT_CODE: this.queryValues.plantCode,
            linesReturn: linesReturn
          },
          'lg',
        )
        .subscribe(value => {
          if (value) {
            if (linesReturn.length > 0) {
              this.setRefreshSelection(linesReturn);
              this.refresh(false);
            }
          }
        });
    } else {
      this.msgSrv.warning(
        this.appTranslationService.translate(this.Msg.NeedSelect),
      );
    }
  }
  // 工序工单拆分
  public splitMo(dataItem: any) {
    this.modal
      .static(
        ProcessScheduleOpdigitalizationWorkbenchSplitMoComponent,
        { dataItem: dataItem },
        'lg',
      )
      .subscribe(value => {
        this.query();
      });
  }

  moException() {
    // 例外检查
    this.modal.static(PlanscheduleMoexceptionAgComponent, {}, 'xl').subscribe(() => { });
  }
}
