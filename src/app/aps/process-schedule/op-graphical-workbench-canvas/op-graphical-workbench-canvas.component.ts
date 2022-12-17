import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GanttComponent } from '@shared/components/gantt/gantt.component';
import { EditService } from '../opdigitalization-workbench/edit.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { ModalHelper } from '@delon/theme';
import { GetGraphicalWorkbenchDataInputDto } from '@shared/model/graphicalworkbench/get-graphical-workbench-data-input-dto';
import { PlantModelCalendarComponent } from 'app/aps/plant-model/calendar/calendar.component';
import { ProcessScheduleOpdigitalizationWorkbenchEndMoComponent } from '../opdigitalization-workbench/endMo/endMo.component';
import { ProcessScheduleMoprocessMaintenanceEditComponent } from '../moprocess-maintenance/edit/edit.component';
import { ProcessScheduleOpdigitalizationWorkbenchPlanReleaseComponent } from '../opdigitalization-workbench/planrelease/planrelease.component';
import { ProcessScheduleOpdigitalizationWorkbenchMoLevelComponent } from '../opdigitalization-workbench/moLevel/moLevel.component';
import { OPGraphicalWorkbenchService } from './services/op-graphical-workbench.service';
import { OPGraphicalWorkbenchSearchComponent } from './search/op-graphical-workbench-search.component';
import { ProcessScheduleOpdigitalizationWorkbenchChooseLineComponent } from '../opdigitalization-workbench/chooseLine/chooseLine.component';
import { ProcessSchedulePoComVindicateComponent } from '../pocomvindicate/pocomvindicate.component';
import { ProcessScheduleOpShiftplanComponent } from '../opshiftplan/opshiftplan.component';
import { Router } from '@angular/router';
import { PlantModelCalendarDateQueryComponent } from 'app/aps/plant-model/calendar/datequery/datequery.component';
import { ProcessScheduleOpdigitalizationWorkbenchSetResourceAndRateComponent } from '../opdigitalization-workbench/setResourceAndRate/setResourceAndRate.component';
import { ProcessScheduleOpdigitalizationWorkbenchSplitMoComponent } from '../opdigitalization-workbench/splitMo/splitMo.component';
import { PlanscheduleMoexceptionAgComponent } from 'app/aps/planschedule/moexception/moexception-ag.component';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'op-graphical-workbench-canvas',
  templateUrl: './op-graphical-workbench-canvas.component.html',
  styleUrls: ['./op-graphical-workbench-canvas.component.scss'],
  providers: [OPGraphicalWorkbenchService, EditService],
})
export class OPGraphicalWorkbenchCanvasComponent implements OnInit, AfterViewInit {
  // gantt组件
  @ViewChild(GanttComponent, { static: true })
  gantt: GanttComponent;

  // gantt 配置项
  options: any;

  // 放大
  scaleDayModes: any = ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '10天', '14天', '20天', '30天'];
  scaleHourModes: any = ['1小时', '2小时', '3小时', '4小时', '5小时', '6小时', '7小时', '8小时', '12小时', '16小时'];
  curScaleModel = '3天';

  // 工单配色
  taskColors: object[] = [{ label: '状态', value: '0' }, { label: '提前量', value: '1' }, { label: '齐套', value: '2' }];
  taskHightColors: object[] = [{ label: '同物料号', value: '3' }, { label: '同项目号', value: '4' }, {
    label: '非标',
    value: '5',
  }];
  taskFilters: object[] = [{ label: '工单号', value: 'MAKE_ORDER_NUM' }, { label: '物料号', value: 'ITEM_CODE' }];
  taskHighlight: string;
  filterCode: string;
  filterField = 'MAKE_ORDER_NUM';

  taskTooltipsDisplay: boolean[] = [true, false, false, false, false, false, false, false, true];
  searchResult: any;
  loading: Boolean = false;

  public iconStyle = {
    width: '35px',
    height: '35px',
  };

  constructor(private graphicalWorkbenchService: OPGraphicalWorkbenchService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private modal: ModalHelper,
    private digWorkbenchService: EditService,
    private router: Router) {
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.search('0');
    });
  }

  // 查询
  search(flag: any) {
    this.modal.static(OPGraphicalWorkbenchSearchComponent, {
      searchResult: this.searchResult,
      canvasFlag: true,
    }).subscribe((value) => {
      console.log(JSON.stringify(value.graphicalWorkbenchDataOutputDto));
      if (value) {
        this.searchResult = value;
        this.options = this.searchResult.graphicalWorkbenchDataOutputDto;
        this.options.stageClick = this.ganttStageClick();
        this.gantt.setOption(this.options);
        this.taskColorsChange('0');
        this.scaleModeChange(this.curScaleModel);
        if (flag !== '1') {
          this.taskTooltipsDisplay = [true, false, false, false, false, false, false, false, true];
        }
        this.taskHighlight = '';
      } else {
      }
    });
  }

  // 根据查询条件重新加载数据
  reloadData() {
    const graphicalWorkbenchDataInputDto = new GetGraphicalWorkbenchDataInputDto();
    graphicalWorkbenchDataInputDto.StartDate = this.searchResult.dateRange.StartDate;
    graphicalWorkbenchDataInputDto.EndDate = this.searchResult.dateRange.EndDate;
    graphicalWorkbenchDataInputDto.ScheduleGroupResources = this.searchResult.ScheduleGroupResources;
    graphicalWorkbenchDataInputDto.PlantCode = this.searchResult.PlantCode;
    this.loading = true;

    this.graphicalWorkbenchService.GetGraphicalWorkbenchDataCanvas(graphicalWorkbenchDataInputDto).subscribe(res => {
      if (res !== null && res.Success) {
        this.searchResult.graphicalWorkbenchDataOutputDto = res.Extra;
        this.options = this.searchResult.graphicalWorkbenchDataOutputDto;
        this.options.stageClick = this.ganttStageClick();
        const latestDragWkFrom = this.gantt.getLatest() && this.gantt.getLatest().from;
        this.gantt.setOption(this.options);
        this.scaleModeChange(this.curScaleModel);
        if (latestDragWkFrom) {
          this.setScrollLeftByTime(latestDragWkFrom);
        }
        // this.taskTooltipsDisplay = [true, false, false, false, false, false, false, false, true];
        this.taskHighlight = '';
        this.msgSrv.success(this.appTranslationService.translate(res.Message || '加载数据成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message || '加载数据失败'));
      }

      this.loading = false;
    });
  }

  // 排产刷新
  refresh() {
    this.refreshCommon('1');
  }

  refreshCommon(refreshType: string) {
    if (this.searchResult === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请先查询数据!'));
      return;
    }
    // 数据选择
    const curRowName = this.getCurRowName();
    if (curRowName !== '') {
      this.loading = true;
      // 调整之前保存数据
      const curOptions = JSON.parse(JSON.stringify(this.options));
      const curGanttData = [];
      curOptions.yAxis.data.forEach(curRow => {
        curRow.children.forEach(resCode => {
          curGanttData.push({ resCode: resCode.name, tasks: [] });
        });
      });

      curOptions.series.forEach(curRow => {
        curRow.tasks.forEach(task => {
          curGanttData.forEach(curYRow => {
            // if (curYRow.resCode === task.productLine && task.modifyIndex !== 0) {
            //   curYRow.tasks.push(task);
            // }
            if (curYRow.resCode === task.productLine) {
              curYRow.tasks.push(task);
            }
          });
        });
      });
      const adjustInputDtos = [];
      curGanttData.forEach(curRow => {
        curRow.tasks.sort((task1, task2) => {
          if (new Date(task1.from) >= new Date(task2.from)) {
            return 1;
          } else {
            return -1;
          }
        });
        curRow.tasks.forEach((curTask, index) => {
          adjustInputDtos.push({
            ID: curTask.id,
            SEQ_NO: index,
            FPC_TIME: new Date(curTask.from),
            PLANT_CODE: this.searchResult.PlantCode,
            RESOURCE_CODE: curTask.productLine,
            RESOURCE_CODE_OLD: curTask.resourceCode,
            SOURCE_MAKE_ORDER_NUM: curTask.SOURCE_MAKE_ORDER_NUM,
            CHANGE_INDEX: curTask.modifyIndex,
          });
        });
      });

      if (adjustInputDtos.length > 0) {
        this.digWorkbenchService.Save(this.searchResult.ScheduleRegionCode,
          this.searchResult.PlantCode,
          this.digWorkbenchService.formatDate(this.searchResult.dateRange.StartDate),
          this.digWorkbenchService.formatDate(this.searchResult.dateRange.EndDate),
          adjustInputDtos).subscribe(result => {
            if (result !== null && result.Success) {
              // 保存成功
              if (result.Message === undefined || result.Message === null || result.Message === '') {
                this.refreshTypeHandle(refreshType);
              } else {
                this.msgSrv.error(this.appTranslationService.translate('调整保存失败！<br/> ' + result.Message));
                this.loading = false;
              }
            } else {
              this.msgSrv.error(this.appTranslationService.translate('调整保存失败！<br/> ' + result.Message));
              this.loading = false;
            }
          });
      } else {
        this.refreshTypeHandle(refreshType);
      }
    }
  }

  private refreshTypeHandle(refreshType) {
    // 获取资源
    const curResourceCodes = this.getResourceCodes();
    if (curResourceCodes.length === 0) {
      this.loading = false;
      return;
    }
    const plantCode = this.searchResult.PlantCode;
    if (refreshType === '1') {
      this.digWorkbenchService.Refresh(plantCode, curResourceCodes, '', '').subscribe(resultRef => {
        if (resultRef !== null && resultRef.Success) {
          this.msgSrv.success(this.appTranslationService.translate(resultRef.Message || '刷新成功！'));
          this.reloadData();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(resultRef.Message || '刷新失败！'));
          this.loading = false;
        }
      });
    } else if (refreshType === '2') {
      this.digWorkbenchService.SubmitRequest_MoRecursive(plantCode, curResourceCodes).subscribe(resultRef => {
        if (resultRef !== null && resultRef.Success) {
          this.msgSrv.success(this.appTranslationService.translate(resultRef.Message || '请求提交成功！'));
          this.reloadData();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(resultRef.Message || '请求提交失败！'));
          this.loading = false;
        }
      });
    } else if (refreshType === '3') {
      this.digWorkbenchService.SubmitRequest_UpperLevelLinkage(plantCode, curResourceCodes).subscribe(resultRef => {
        if (resultRef !== null && resultRef.Success) {
          this.msgSrv.success(this.appTranslationService.translate(resultRef.Message || '请求提交成功！'));
          this.reloadData();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(resultRef.Message || '请求提交失败！'));
          this.loading = false;
        }
      });
    }
  }

  // 工作日历
  openCalendar() {
    if (this.searchResult === null || this.searchResult === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请先查询数据!'));
    } else {
      const curResourceCode = this.getResourceCode();
      if (curResourceCode === '') {
        return;
      }
      const curScheduleGroupCode = this.getScheduleGroupCode();
      if (curScheduleGroupCode === '') {
        return;
      }
      const pGridSelectRow = {
        SCHEDULE_REGION_CODE: this.searchResult.ScheduleRegionCode,
        PLANT_CODE: this.searchResult.PlantCode,
        SCHEDULE_GROUP_CODE: curScheduleGroupCode,
        RESOURCE_CODE: curResourceCode,
      };
      this.modal.static(PlantModelCalendarComponent, { pShowTitle: true, pGridSelectRow: pGridSelectRow }, 'xl')
        .subscribe(() => {
        });
    }
  }

  // 固定
  fixMo() {
    const curTask = this.getTask();
    if (curTask !== '') {
      // 弹出确认框
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate(curTask.originData.movable ? '确定要固定吗？' : '确定要取消固定吗？'),
        nzOnOk: () => {
          this.loading = true;
          this.digWorkbenchService.FixMo([{
            ID: curTask.originData.id,
            FIX_SCHEDULE_TIME: new Date(curTask.originData.from),
          }], curTask.originData.movable)
            .subscribe(result => {
              if (result !== null && result.Success) {
                this.gantt.setWorkOrderDragable([curTask.originData.name], !curTask.originData.movable);
                this.msgSrv.success(this.appTranslationService.translate(result.Message));
              } else {
                this.msgSrv.error(this.appTranslationService.translate(result.Message || '操作失败！'));
              }
              this.loading = false;
            });
        },
      });
    }
  }

  // 置尾单
  setEndMo() {
    const curTask = this.getTask();
    if (curTask !== '') {
      this.modal.static(ProcessScheduleOpdigitalizationWorkbenchEndMoComponent, { gridSelectKeys: [curTask.originData.id] }, 'lg')
        .subscribe((value) => {
          if (value) {
            this.reloadData();
          }
        });
    }
  }

  // 置尾单 MENGJIE
  SetBacklog() {
    const curTask = this.getTask();
    if (curTask !== '') {
      const dataItem = {
        Id: curTask.originData.id, BACKLOG_FLAG: curTask.originData.BACKLOG_FLAG,
        MAKE_ORDER_STATUS: curTask.originData.MAKE_ORDER_STATUS,
      };
      if (dataItem.BACKLOG_FLAG !== 'Y' && !this.validateStatus(dataItem)) {
        this.msgSrv.warning(this.appTranslationService.translate('状态为未下达和已下达的工序生产订单才允许置尾！'));
        return;
      }
      this.modal.static(ProcessScheduleOpdigitalizationWorkbenchEndMoComponent, { dataItem: dataItem }, 'lg').subscribe((value) => {
        if (value) {
          this.reloadData();
        }
      });
    }
  }

  // 修改
  openMoEdit() {
    const curTask = this.getTask();
    if (curTask !== '') {
      this.modal.static(ProcessScheduleMoprocessMaintenanceEditComponent, { j: { Id: curTask.originData.id } }, 'xl')
        .subscribe((value) => {
          if (value) {
            this.reloadData();
          }
        });
    }
  }

  // 集约选线
  chooseLine() {
    const curResourceCode = this.getResourceCode();
    if (curResourceCode === '') {
      return;
    }
    const curScheduleGroupCode = this.getScheduleGroupCode();
    if (curScheduleGroupCode === '') {
      return;
    }

    const querySelection = [];
    this.searchResult.SelectResourceCodes.forEach(res => {
      querySelection.push({ CODE: res.CODE });
    });
    this.modal.static(ProcessScheduleOpdigitalizationWorkbenchChooseLineComponent, {
      i: {
        SCHEDULE_REGION_CODE: this.searchResult.ScheduleRegionCode,
        PLANT_CODE: this.searchResult.PlantCode,
        SCHEDULE_GROUP_CODE: curScheduleGroupCode,
        RESOURCE_CODE: curResourceCode,
      },
      querySelection: querySelection,
    }, 'lg').subscribe((value) => {
    });
  }

  // 工序联动
  moLink() {
    this.refreshCommon('2');
  }

  // 打开工单组件
  openMoComponent() {
    const curTask = this.getTask();
    if (curTask !== '') {
      this.modal.static(ProcessSchedulePoComVindicateComponent, {
        pShowTitle: true,
        pGridSelectRow: { PROCESS_MAKE_ORDER_NUM: curTask.originData.name },
      }, 'xl')
        .subscribe(() => {
        });
    }
  }

  // 工单簇
  openMoLevel() {
    const curTask = this.getTask();
    if (curTask !== '') {
      const modal = this.confirmationService.create({
        // nzWrapClassName: 'modal-lg',
        nzTitle: this.appTranslationService.translate('工单簇'),
        nzContent: ProcessScheduleOpdigitalizationWorkbenchMoLevelComponent,
        nzFooter: null,
        nzWidth: 1200,
        nzComponentParams: { i: { ID: curTask.originData.id } },
      });

      modal.afterOpen.subscribe(() => {
        const instance = modal.getContentComponent();
        instance.GetGraphicalMoLevel();
      });

      modal.afterClose.subscribe(() => {
        modal.destroy();
      });
    }
  }

  // 计划发布
  release() {
    const lineCodes = this.getResourceCodes();
    if (lineCodes.length === 0) {
      return;
    }
    const curScheduleGroupCode = this.getScheduleGroupCode();
    if (curScheduleGroupCode === '') {
      return;
    }
    this.loading = true;
    this.modal.static(ProcessScheduleOpdigitalizationWorkbenchPlanReleaseComponent,
      {
        i: {},
        regionCode: this.searchResult.ScheduleRegionCode,
        plantCode: this.searchResult.PlantCode,
        lineCodes: lineCodes,
        startTime: this.searchResult.dateRange.StartDate,
        endTime: this.searchResult.dateRange.EndDate,
        schedule_group_code: curScheduleGroupCode,
        // graphicalWorkBenchContext: this
      }, 'lg').subscribe((value) => {
        this.loading = false;
      });
  }

  // 排产表
  openSchedule() {
    const curResourceCode = this.getResourceCode();
    if (curResourceCode === '') {
      return;
    }
    const curScheduleGroupCode = this.getScheduleGroupCode();
    if (curScheduleGroupCode === '') {
      return;
    }
    const pGridSelectRow = {
      SCHEDULE_REGION_CODE: this.searchResult.ScheduleRegionCode,
      PLANT_CODE: this.searchResult.PlantCode,
      SCHEDULE_GROUP_CODE: curScheduleGroupCode,
      RESOURCE_CODE: curResourceCode,
    };
    this.modal.static(ProcessScheduleOpShiftplanComponent, { pShowTitle: true, pGridSelectRow: pGridSelectRow }, 'lg')
      .subscribe(() => {
      });
  }

  // 暂挂
  SetSuspend() {
    const curTask = this.getTask();
    if (curTask !== '') {
      const dataItem = {
        Id: curTask.originData.id, BACKLOG_FLAG: curTask.originData.BACKLOG_FLAG,
        MAKE_ORDER_STATUS: curTask.originData.MAKE_ORDER_STATUS,
      };

      if (dataItem.MAKE_ORDER_STATUS !== 'P' && !this.validateStatus(dataItem)) {
        this.msgSrv.warning(this.appTranslationService.translate('状态为下达和已下达的工序生产订单才允许暂挂！'));
        return;
      }
      // this.digWorkbenchService.SetSuspend(dataItem.Id).subscribe(res => {
      //   if (res.Success) {
      //     this.msgSrv.success(this.appTranslationService.translate('暂挂成功'));
      //     this.reloadData();
      //   } else {
      //     this.msgSrv.error(this.appTranslationService.translate(res.Message));
      //   }
      // });
    }
  }

  // 校验工序工单状态
  private validateStatus(dataItem: any): boolean {
    const status = dataItem.MAKE_ORDER_STATUS;
    const statusArray = ['R', 'S'];
    if (statusArray.findIndex(x => x === status) === -1) {
      return false;
    } else {
      return true;
    }
  }

  // 工序生产订单拆分
  SetMoOemSplit() {
    const curTask = this.getTask();
    if (curTask !== '') {
      const resourceCode = curTask.originData.productLine;
      let scheduleGroupCode = '';
      this.options.yAxis.data.forEach(curRow => {
        curRow.children.forEach(resCode => {
          if (resCode.name === resourceCode) {
            scheduleGroupCode = curRow.name;
          }
          if (scheduleGroupCode !== '') {
            return;
          }
        });

        if (scheduleGroupCode !== '') {
          return;
        }
      });

      const dataItem = {
        ID: curTask.originData.id,
        PLANT_CODE: this.searchResult.PlantCode,
        SCHEDULE_GROUP_CODE: scheduleGroupCode,
        RESOURCE_CODE: resourceCode,
        PROCESS_CODE: curTask.originData.PROCESS_CODE,
        ITEM_ID: curTask.originData.ITEM_ID,
        FPC_TIME: curTask.originData.from,
        MAKE_ORDER_STATUS: curTask.originData.MAKE_ORDER_STATUS,
        PROCESS_MAKE_ORDER_NUM: curTask.originData.name,
      };
      if (!this.validateStatus(dataItem)) {
        this.msgSrv.warning(this.appTranslationService.translate('状态为下达和已下达的工序生产订单才允许拆分！'));
        return;
      }

      // this.modal.static(ProcessScheduleOpdigitalizationWorkbenchSplitMoComponent, { dataItem: dataItem }, 'lg')
      //   .subscribe((value) => {
      //     if (value) {
      //       this.reloadData();
      //     }
      //   });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请选择工单！'));
    }
  }

  // 重新选线
  public rechooseLine() {
    const curResourceCode = this.getResourceCode();
    if (curResourceCode === '') {
      return;
    }
    const curScheduleGroupCode = this.getScheduleGroupCode();
    if (curScheduleGroupCode === '') {
      return;
    }
    // this.modal.static(ProcessScheduleOpdigitalizationWorkbenchReChooseLinegroupComponent, {
    //   i: {
    //     SCHEDULE_REGION_CODE: this.searchResult.ScheduleRegionCode,
    //     PLANT_CODE: this.searchResult.PlantCode,
    //     SCHEDULE_GROUP_CODE: curScheduleGroupCode,
    //     RESOURCE_CODE: curResourceCode
    //   },
    // }, 'lg').subscribe((value) => {
    //   if (value) {
    //   }
    // });
  }

  // 自制转采购
  salfMadeToPurchase() {
    const curTask = this.getTask();
    if (curTask !== '') {
      // 弹出确认框
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('是否确定自制转采购？'),
        nzOnOk: () => {
          const curTaskIds = [curTask.originData.id];
          // this.digWorkbenchService.SalfMadeToPurchase(curTaskIds).subscribe(res => {
          //   if (res.Success) {
          //     let message = '自制转采购成功';
          //     if (res.Message && res.Message !== '') {
          //       message = res.Message;
          //     }
          //     this.msgSrv.success(this.appTranslationService.translate(message));
          //     this.reloadData();
          //   } else {
          //     this.msgSrv.error(this.appTranslationService.translate(res.Message));
          //   }
          // });
        },
      });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请选择工单！'));
    }
  }

  // 数字化工作台
  openOpDigitWorkbench() {
    if (this.searchResult === null || this.searchResult === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择资源!'));
      return;
    }
    const curResourceCode = this.getResourceCode();
    if (curResourceCode === '') {
      return;
    }
    let params = 'ScheduleRegionCode=' + this.searchResult.ScheduleRegionCode + '&PlantCode=' + this.searchResult.PlantCode;
    if (this.searchResult.ScheduleGroupCode !== null || this.searchResult.ScheduleGroupCode !== undefined
      || this.searchResult.ScheduleGroupCode !== '') {
      params += '&ScheduleGroupCode=' + this.searchResult.ScheduleGroupCode;
    }
    params += '&ResouceCode=' + curResourceCode + '&StartDate=' + this.searchResult.dateRange.StartDate + '&EndDate=' + this.searchResult.dateRange.EndDate;

    window.open('#/fullscreen/process-schedule/opdigitalizationworkbench?' + params, '数字化工作台');
  }

  // 点击单元格查看资源产线日历（按日期yyyy-mm-dd）
  public ganttStageClick() {
    return (inf: any) => {
      if (inf.type === 0) {
        const curRowName = inf.params.productLine;
        const curDate = inf.params.date;
        let curScheduleGroupCode = '';
        if (curRowName !== null) {
          this.searchResult.ScheduleGroupResources.forEach(sgr => {
            // 选择的是产线
            sgr.Value.forEach(element => {
              if (element === curRowName)
                curScheduleGroupCode = sgr.Key;
            });
          });
          if (curScheduleGroupCode === '') {
            this.msgSrv.warning(this.appTranslationService.translate('请选择资源!'));
            return;
          }
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('请选择资源!'));
          return;
        }

        const calendarOptions: any[] = [];
        this.graphicalWorkbenchService.GetCalendarList({ SCHEDULE_REGION_CODE: this.searchResult.ScheduleRegionCode || '' }).subscribe(result => {
          result.Extra.forEach(d => {
            calendarOptions.push({
              label: d.CALENDAR_CODE,
              value: d.CALENDAR_CODE,
              SCHEDULE_REGION_CODE: d.SCHEDULE_REGION_CODE,
            });
          });

          this.modal.static(PlantModelCalendarDateQueryComponent, {
            i: {
              PLANT_CODE: this.searchResult.PlantCode,
              SCHEDULE_GROUP_CODE: curScheduleGroupCode,
              RESOURCE_CODE: curRowName,
              CALENDAR_CODE: calendarOptions[0].value,
              SHOW_CALENDAR_DAY: curDate,
            },
          }, 'lg').subscribe(() => {
          });
        });
      } else if (inf.type === 1) {
        const cutTaskId = inf.params;
        this.modal.static(ProcessScheduleMoprocessMaintenanceEditComponent, { j: { Id: cutTaskId } }, 'xl')
          .subscribe((value) => {
            if (value) {
              this.reloadData();
            }
          });
      }
    };
  }

  // 放大
  scaleModeChange(event: any) {
    let format = '3d';
    if (event.indexOf('天') !== -1) {
      format = event.replace('天', 'd');
    } else if (event.indexOf('小时') !== -1) {
      format = event.replace('小时', 'h');
    }
    this.curScaleModel = event;
    this.gantt.setTimeFormat(format);
    this.setScrollLeftByTime(this.options.scheduleMinStartTime);

    this.filterField = 'MAKE_ORDER_NUM';
    this.filterCode = '';
    this.filterWorkOrderByField('');
  }

  // 工单颜色
  taskColorsChange(event: any) {
    this.gantt.resetWorkOrderStatus(`.moStatus`, 'moStatusColor');
    let status, option;
    switch (event) {
      case '0':
        status = `.moStatus`;
        option = 'moStatusColor';
        break;
      case '1':
        status = `.inAdvance`;
        option = 'moAheadDelayColor';
        break;
      case '2':
        status = `.completed`;
        option = 'moKitColor';
        break;
      case '3':
        status = `same`;
        option = { filed: 'ITEM_CODE', color: 'sameItemCodeColor' };
        break;
      case '4':
        status = `same`;
        option = { filed: 'PROJECT_NUMBER', color: 'sameProjectNumColor' };
        break;
      case '5':
        status = `.Y`;
        option = 'standardFalgYColor';
        break;
      default:
        status = option = undefined;
        break;
    }
    this.gantt.resetWorkOrderStatus(status, option);
  }

  // 提示内容
  taskTooltipsDisplayChange(event: any) {
    this.gantt.setWorkOrderContent(this.taskTooltipsDisplay);
  }

  timerFlag: number;

  // 过滤物料
  filterWorkOrderByField(event: any) {
    if (this.timerFlag) {
      window.clearTimeout(this.timerFlag);
    }
    this.timerFlag = window.setTimeout(() => {
      this.gantt.filterWorkOrderByField(this.filterCode, this.filterField);
    }, 1000);
  }

  // 滚动到制定时间
  setScrollLeftByTime(time: any) {
    this.gantt.setScrollLeftByTime(time);
  }

  private getTask(): any {
    const curTasks = this.gantt.getSeletctedCells();
    if (curTasks !== null && curTasks !== undefined && curTasks.length > 0) {
      return curTasks[curTasks.length - 1];
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请选择工单'));
      return '';
    }
  }

  private getCurRowName() {
    const rowNames = this.gantt.getSelectedY();
    if (rowNames !== null && rowNames !== undefined && rowNames.length > 0) {
      return rowNames[rowNames.length - 1];
    } else {
      return '';
    }
  }

  private getResourceCode() {
    let curResourceCode = '';
    const curRowName = this.getCurRowName();
    if (curRowName !== '') {
      this.searchResult.ScheduleGroupResources.forEach(sgr => {
        // 选择的是产线
        sgr.Value.forEach(element => {
          if (element === curRowName)
            curResourceCode = element;
        });
      });
    }

    if (curResourceCode === '') {
      this.msgSrv.warning(this.appTranslationService.translate('请选择产线!'));
    }
    return curResourceCode;
  }

  private getResourceCodes() {
    // 获取资源
    const curResourceCodes = [];
    const curRowName = this.getCurRowName();
    if (curRowName !== '') {
      this.searchResult.treeDataTable.forEach(sgr => {
        // 选的计划组
        if (sgr.CODE === curRowName) {
          sgr.children.forEach(resCode => {
            curResourceCodes.push(resCode.CODE);
          });
        } else {
          // 选的产线
          sgr.children.forEach(resCode => {
            if (resCode.CODE === curRowName) {
              sgr.children.forEach(targetResCode => {
                curResourceCodes.push(targetResCode.CODE);
              });
            }
          });
        }
      });
    }
    if (curResourceCodes.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择产线或者计划组!'));
    }
    return curResourceCodes;
  }

  private getScheduleGroupCode() {
    let curScheduleGroupCode = '';
    const curRowName = this.getCurRowName();
    if (curRowName !== '') {
      this.searchResult.ScheduleGroupResources.forEach(sgr => {
        // 选择的计划组
        if (sgr.Key === curRowName) {
          curScheduleGroupCode = sgr.Key;
        } else {
          // 选择的是产线
          sgr.Value.forEach(element => {
            if (element === curRowName)
              curScheduleGroupCode = sgr.Key;
          });
        }
      });
    }

    if (curScheduleGroupCode === '') {
      this.msgSrv.warning(this.appTranslationService.translate('请选择计划组!'));
    }
    return curScheduleGroupCode;
  }

  filterFieldChange(event: any) {
    this.filterWorkOrderByField('');
  }

  // 工单指定
  public setResourceAndRate() {
    const curTask = this.getTask();
    if (curTask !== '') {
      const linesReturn = [];
      this.modal.static(ProcessScheduleOpdigitalizationWorkbenchSetResourceAndRateComponent, {
        gridSelectKeys: [curTask.originData.id],
        PLANT_CODE: this.searchResult.PlantCode,
        linesReturn: linesReturn
      }, 'lg')
        .subscribe((value) => {
          if (value) {
            this.digWorkbenchService.Refresh(this.searchResult.plantCode, linesReturn, '', '').subscribe(resultRef => {
              if (resultRef !== null && resultRef.Success) {
                this.msgSrv.success(this.appTranslationService.translate(resultRef.Message || '刷新成功！'));
                this.reloadData();
              } else {
                this.msgSrv.error(this.appTranslationService.translate(resultRef.Message || '刷新失败！'));
                this.loading = false;
              }
            });
          }
        });
    }
  }

  // 工序工单拆分
  public splitMo() {
    const curTask = this.getTask();
    if (curTask !== '') {
      this.modal.static(ProcessScheduleOpdigitalizationWorkbenchSplitMoComponent, {
        dataItem: null,
        dataItemId: curTask.originData.id,
      }, 'lg')
        .subscribe((value) => {
          this.reloadData();
        });
    }
  }

  moException() {
    // 例外检查
    this.modal.static(PlanscheduleMoexceptionAgComponent, { }, 'xl').subscribe(() => { });
  }
}
