import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { EditService } from '../edit.service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { GanttComponent } from '@shared/components/gantt/gantt.component';
import { ProcessScheduleMoprocessMaintenanceEditComponent } from '../../moprocess-maintenance/edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'processSchedule-opdigitalization-workbench-molevel',
  templateUrl: './moLevel.component.html',
  providers: [EditService]
})

export class ProcessScheduleOpdigitalizationWorkbenchMoLevelComponent extends CustomBaseContext implements OnInit {
  /*    ---------------------------------------------------------- */
  // 查询参数
  public i: any;
  // gantt组件
  @ViewChild(GanttComponent, { static: true })
  gantt: GanttComponent;
  // gantt 配置项
  options: any;
  // 甘特图初始化
  ganttInitFlag = false;
  // 甘特图、图表切换标识
  swapFlag = false;
  // 平均生产周期
  avgProductionCycle = 0;
  /*  -------------------------MO树形层级--------------------------------- */
  public treeDataTable: any[] = []; // MO树形结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'PROCESS_MAKE_ORDER_NUM', title: '工序工单', width: '200px' },
    { field: 'SCHEDULE_GROUP_CODE', title: '计划组', width: '120px' },
    { field: 'RESOURCE_CODE', title: '资源', width: '120px' },
    { field: 'ITEM_CODE', title: '物料', width: '150px' },
    { field: 'DESCRIPTIONS_CN', title: '物料描述', width: '200px' },
    { field: 'DEMAND_DATE', title: '需求时间', width: '150px' },
    { field: 'FPC_TIME', title: '开始时间', width: '150px' },
    { field: 'LPC_TIME', title: '结束时间', width: '150px' },
    { field: 'MO_QTY', title: '工单数量', width: '100px' },
    /*  { field: 'SUPPLY_QTY', title: '已供应数量', width: '120px' }, */
    { field: 'COMPLETE_QTY', title: '已完成数量', width: '120px' },
    { field: 'MAKE_ORDER_STATUS_NAME', title: '工单状态', width: '100px' },
    { field: 'BACKLOG_FLAG', title: '尾单标识', width: '100px' },
    { field: 'PUBLISH_TIME', title: '发布时间', width: '150px' }
  ]; // 显示列
  public keyField = 'ID'; // 树节点key
  public rowSize = 'middle'; // 行大小
  public showCheckBox = false; // 是否显示checkbox
  public scroll = { x: '2030px', y: '380px' }; // 数据显示区出滚动条

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private editService: EditService,
    private modalHelper: ModalHelper
  ) {
    super({ appTranslationSrv: null, msgSrv: msgSrv, appConfigSrv: null });
  }

  ngOnInit(): void {
    this.setGridHeight({ topMargin: 200 });
  }

  public GetGraphicalMoLevel() {
    this.editService.GetGraphicalMoLevel(this.i.ID).subscribe(result => {
      if (result != null) {
        this.gridData = result.Extra.gridData;
        this.options = result.Extra.options;
        this.avgProductionCycle = result.Extra.avgProductionCycle;
        this.options.stageClick = this.ganttStageClick();
        this.treeDataTable = this.dealLevel(result.Extra.gridData, 0, '', '', true);
        this.treeNodeColumns.find(x => x.field === 'PROCESS_MAKE_ORDER_NUM').width = 180 + 20 * (this.LEVEL_NUM + 1) + 'px';

        if (!this.ganttInitFlag && this.swapFlag) {
          this.gantt.init();
          this.ganttInitFlag = true;
        }
        if (this.swapFlag) {
          this.gantt.setOption(this.options);
        }
      }
      this.setLoading(false);
    });
  }

  // 层级
  public LEVEL_NUM = 0;
  // 处理层级关系
  dealLevel(list: any[], LEVEL_NUM: number = 0, PARENT_MO_PLANT_CODE: string = '', PARENT_MO_NUM: string = '', isExpand: boolean = true): any[] {
    let retList = [];
    if (LEVEL_NUM <= 0) {
      retList = list.filter(x => x.LEVEL_NUM === LEVEL_NUM);
    } else {
      retList = list.filter(x => x.LEVEL_NUM === LEVEL_NUM && x.PLANT_CODE === PARENT_MO_PLANT_CODE && x.PARENT_PROCESS_MO_NUM === PARENT_MO_NUM);
    }
    if (retList !== undefined && retList != null && retList.length > 0) {
      retList.forEach(x => {
        x.expand = isExpand;
        x.children = this.dealLevel(list, x.LEVEL_NUM + 1, x.PLANT_CODE, x.PROCESS_MAKE_ORDER_NUM, isExpand);
      });
      if (LEVEL_NUM > this.LEVEL_NUM) {
        this.LEVEL_NUM = LEVEL_NUM;
      }
    }
    return retList;
  }

  // 点击单元格查看工单
  public ganttStageClick() {
    return (inf: any) => {
      if (inf.type === 1) {
        const cutTaskId = inf.params;
        this.modalHelper.static(ProcessScheduleMoprocessMaintenanceEditComponent, { j: { Id: cutTaskId } }, 'xl')
          .subscribe((value) => {
            if (value) {
              this.GetGraphicalMoLevel();
            }
          });
      }
    };
  }

  swap() {
    this.swapFlag = !this.swapFlag;
  }

  close() {
    this.modal.destroy();
  }

  expColumns = this.treeNodeColumns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.excelexport.export(this.gridData);
  }
}
