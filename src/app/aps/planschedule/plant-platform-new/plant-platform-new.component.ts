import { Component, OnInit, ViewChild } from '@angular/core';
import { GanttComponent } from '@shared/components/gantt/gantt.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { GetGraphicalWorkbenchDataInputDto } from '@shared/model/graphicalworkbench/get-graphical-workbench-data-input-dto';
import { EditService } from '../digitalization-workbench/edit.service';
import { ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { PlantModelCalendarComponent } from '../../plant-model/calendar/calendar.component';
import { PlanscheduleMoexceptionAgComponent } from '../moexception/moexception-ag.component';
import { PlantModelCalendarDateQueryComponent } from '../../plant-model/calendar/datequery/datequery.component';
import { PlanscheduleDigitalizationWorkbenchPlanReleaseComponent } from '../digitalization-workbench/planrelease/planrelease.component';
import { PlanscheduleDigitalizationWorkbenchChooseLineComponent } from '../digitalization-workbench/chooseLine/chooseLine.component';
import { PlanscheduleDigitalizationWorkbenchSplitMoComponent } from '../digitalization-workbench/splitMo/splitMo.component';
import { PlanscheduleDigitalizationWorkbenchSetResourceAndRateComponent } from '../digitalization-workbench/setResourceAndRate/setResourceAndRate.component';
import { PlanscheduleDigitalizationWorkbenchEndMoComponent } from '../digitalization-workbench/endMo/endMo.component';
import { PlantPlatformSearchComponent } from '../plant-platform/search/search.component';
import { PlanscheduleShiftplanAgComponent } from '../shiftplan/shiftplan-ag.component';
import { PlantPlatformService } from '../plant-platform/services/plant-platform.service';
import { PlanscheduleMomanagerEditComponent } from '../momanager/edit/edit.component';
import { ComVindicateComponent } from '../../plant-model/comvindicate/comvindicate.component';
import { ScheduleCheckReportComponent } from '../schedule-check-report/schedule-check-report.component';
import { SearchEndMoComponent } from '../digitalization-workbench/searchEndMo/searchEndMo.component';
import { PlanscheduleDigitalizationWorkbenchMoSummaryComponent } from '../digitalization-workbench/mo-summary/mo-summary.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-platform-new',
  templateUrl: './plant-platform-new.component.html',
  styleUrls: ['./plant-platform-new.component.less'],
  providers: [PlantPlatformService, EditService],
})
export class PlantPlatformNewComponent implements OnInit {
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
  taskHightColors: object[] = [
    { label: '同物料号', value: '3' },
    { label: '同项目号', value: '4' },
    { label: '非标', value: '5' },
    { label: '贴花工艺', value: '6' },
    { label: '金油工艺', value: '7' },
    { label: '截色工艺', value: '8' },

  ];
  taskFilters: object[] = [{ label: '工单号', value: 'makeOrderNum' }, { label: '物料号', value: 'itemCode' }];
  taskHighlight: string;
  filterCode: string;
  filterField = 'makeOrderNum';

  taskTooltipsDisplay: boolean[] = [true, false, false, false, false, false, false, false, true];
  searchResult: any;
  loading: Boolean = false;

  public iconStyle = {
    width: '35px',
    height: '35px',
  };

  constructor(
    private plantPlatformService: PlantPlatformService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private modal: ModalHelper,
    private digWorkbenchService: EditService,
  ) {
  }

  ngOnInit() {

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.search('0');
    });
  }

  // 查询
  search(flag: any) {
    this.modal.static(PlantPlatformSearchComponent, {
      searchResult: this.searchResult,
      canvasFlag: true,
    }).subscribe((value) => {
      if (value) {
        this.searchResult = value;
        this.options = this.searchResult.plantPlatformDataOutputDto;
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

    this.plantPlatformService.GetPlantPlatformDataCanvas(graphicalWorkbenchDataInputDto).subscribe(res => {
      if (res !== null && res.code === 200) {
        this.searchResult.plantPlatformDataOutputDto = res.data;
        this.options = this.searchResult.plantPlatformDataOutputDto;
        this.options.stageClick = this.ganttStageClick();
        const latestDragWkFrom = this.gantt.getLatest() && this.gantt.getLatest().from;
        this.gantt.setOption(this.options);
        this.scaleModeChange(this.curScaleModel);
        if (latestDragWkFrom) {
          this.setScrollLeftByTime(latestDragWkFrom);
        }
        // this.taskTooltipsDisplay = [true, false, false, false, false, false, false, false, true];
        this.taskHighlight = '';
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '加载数据成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '加载数据失败'));
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
            id: curTask.id,
            seqNo: index,
            fpcTime: Date.parse(curTask.from),
            plantCode: this.searchResult.PlantCode,
            resourceCode: curTask.productLine,
            resourceCodeOld: curTask.resourceCode,
            sourceMakeOrderNum: curTask.sourceMakeOrderNum,
            changeIndex: curTask.modifyIndex,
          });
        });
      });

      if (adjustInputDtos.length > 0) {
        this.digWorkbenchService.Save(this.searchResult.ScheduleRegionCode,
          this.searchResult.PlantCode,
          this.digWorkbenchService.formatDate(this.searchResult.dateRange.StartDate),
          this.digWorkbenchService.formatDate(this.searchResult.dateRange.EndDate),
          adjustInputDtos).subscribe(result => {
            if (result !== null && result.code === 200) {
              // 保存成功
              if (result.msg === undefined || result.msg === null || result.msg === '') {
                this.refreshTypeHandle(refreshType);
              } else {
                this.msgSrv.error(this.appTranslationService.translate('调整保存失败！<br/> ' + result.msg));
                this.loading = false;
              }
            } else {
              this.msgSrv.error(this.appTranslationService.translate('调整保存失败！<br/> ' + result.msg));
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
        if (resultRef !== null && resultRef.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(resultRef.msg || '刷新成功！'));
          this.reloadData();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(resultRef.msg || '刷新失败！'));
          this.loading = false;
        }
      });
    } else if (refreshType === '2') {
      const resourceInfos = this.getResourceInfos();

      this.digWorkbenchService.SubmitRequest_MoRecursive(plantCode, resourceInfos).subscribe(resultRef => {
        if (resultRef !== null && resultRef.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(resultRef.msg || '请求提交成功！'));
          this.reloadData();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(resultRef.msg || '请求提交失败！'));
          this.loading = false;
        }
      });
    } else if (refreshType === '3') {
      const resourceInfos = this.getResourceInfos();
      this.digWorkbenchService.SubmitRequest_UpperLevelLinkage(plantCode, resourceInfos).subscribe(resultRef => {
        if (resultRef !== null && resultRef.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(resultRef.msg || '请求提交成功！'));
          this.reloadData();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(resultRef.msg || '请求提交失败！'));
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
        scheduleRegionCode: this.searchResult.ScheduleRegionCode,
        plantCode: this.searchResult.PlantCode,
        scheduleGroupCode: curScheduleGroupCode,
        resourceCode: curResourceCode,
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
            id: curTask.originData.id,
            fixScheduleTime: new Date(curTask.originData.from),
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
      this.modal.static(PlanscheduleDigitalizationWorkbenchEndMoComponent, { gridSelectKeys: [curTask.originData.id] }, 'lg')
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
        id: curTask.originData.id, backlogFlag: curTask.originData.backlogFlag,
        makeOrderStatus: curTask.originData.makeOrderStatus,
      };
      if (dataItem.backlogFlag !== 'Y' && !this.validateStatus(dataItem)) {
        this.msgSrv.warning(this.appTranslationService.translate('状态为未下达和已下达的工序生产订单才允许置尾！'));
        return;
      }
      this.modal.static(PlanscheduleDigitalizationWorkbenchEndMoComponent, { dataItem: dataItem }, 'lg').subscribe((value) => {
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
      this.modal.static(PlanscheduleMomanagerEditComponent, { j: { Id: curTask.originData.id } }, 'xl')
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
      querySelection.push({ code: res.code });
    });
    this.modal.static(PlanscheduleDigitalizationWorkbenchChooseLineComponent, {
      i: {
        scheduleRegionCode: this.searchResult.ScheduleRegionCode,
        plantCode: this.searchResult.PlantCode,
        scheduleGroupCode: curScheduleGroupCode,
        resourceCode: curResourceCode,
      },
      querySelection: querySelection,
    }, 'lg').subscribe((value) => {
    });
  }

  // 工序联动
  moLink() {
    this.refreshCommon('2');
  }


  // 上层联动
  moUpLink() {
    this.refreshCommon('3');
  }

  // 打开工单组件
  openMoComponent() {
    const curTask = this.getTask();
    if (curTask !== '') {
      this.modal.static(ComVindicateComponent, {
        pShowTitle: true,
        pGridSelectRow: { processMakeOrderNum: curTask.originData.name },
      }, 'xl')
        .subscribe(() => {
        });
    }
  }

  // 工单簇
  openMoLevel() {
    const curTask = this.getTask();
    if (curTask !== '') {
      this.modal.static(PlanscheduleDigitalizationWorkbenchMoSummaryComponent,
        { plantCode: this.searchResult.PlantCode, makeOrderNum: curTask.originData.id, projectNumber: curTask.originData.taskTooltipsContent.projectNumber },
        'lg').subscribe(() => { });
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
    this.modal.static(PlanscheduleDigitalizationWorkbenchPlanReleaseComponent,
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
      scheduleRegionCode: this.searchResult.ScheduleRegionCode,
      plantCode: this.searchResult.PlantCode,
      scheduleGroupCode: curScheduleGroupCode,
      resourceCode: curResourceCode,
    };
    this.modal.static(PlanscheduleShiftplanAgComponent, { pShowTitle: true, pGridSelectRow: pGridSelectRow }, 'lg')
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

      // this.modal.static(PlanscheduleDigitalizationWorkbenchSplitMoComponent, { dataItem: dataItem }, 'lg')
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

  // 打开排产检核报表
  public openCheckReport() {
    this.modal
      .static(ScheduleCheckReportComponent, {
        PLANT_CODE: this.searchResult.PlantCode,
        dateTimeRange: [this.searchResult.dateRange.StartDate, this.searchResult.dateRange.EndDate],
        selection: this.searchResult.SelectResourceCodes
      }, 'lg')
      .subscribe(() => { });
  }

  // 查询置尾单
  queryEndMo() {
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
      this.modal.static(SearchEndMoComponent, { scheduleGroup: curScheduleGroupCode }, 'lg')
        .subscribe(
          () => { }
        );
    }
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
        this.plantPlatformService.GetCalendarList({ scheduleRegionCode: this.searchResult.ScheduleRegionCode || '' }).subscribe(result => {
          result.Extra.forEach(d => {
            calendarOptions.push({
              label: d.calendarCode,
              value: d.calendarCode,
              scheduleRegionCode: d.scheduleRegionCode,
            });
          });

          this.modal.static(PlantModelCalendarDateQueryComponent, {
            i: {
              plantCode: this.searchResult.PlantCode,
              scheduleGroupCode: curScheduleGroupCode,
              resourceCode: curRowName,
              calendarCode: calendarOptions[0].value,
              showCalendarDay: curDate,
            },
          }, 'lg').subscribe(() => {
          });
        });
      } else if (inf.type === 1) {
        const cutTaskId = inf.params;
        this.modal.static(PlanscheduleMomanagerEditComponent, { i: { id: cutTaskId } }, 'xl')
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

    this.filterField = 'makeOrderNum';
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
        option = { filed: 'itemCode', color: 'sameItemCodeColor' };
        break;
      case '4':
        status = `same`;
        option = { filed: 'projectNumber', color: 'sameProjectNumColor' };
        break;
      case '5':
        status = `.Y`;
        option = 'standardFalgYColor';
        break;
      case '6':
        status = `.decalTechnology`;
        option = 'decalTechnologyColor';
        break;
      case '7':
        status = `.oilTechnology`;
        option = 'oilTechnologyColor';
        break;
      case '8':
        status = `.cutColorTechnology`;
        option = 'cutColorTechnologyColor';
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
        if (sgr.code === curRowName) {
          sgr.children.forEach(resCode => {
            curResourceCodes.push(resCode.code);
          });
        } else {
          // 选的产线
          sgr.children.forEach(resCode => {
            if (resCode.code === curRowName) {
              sgr.children.forEach(targetResCode => {
                curResourceCodes.push(targetResCode.code);
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
  // 获取工单联动/上层联动的资源参数
  private getResourceInfos() {
    const resourceInfos = [];
    const curRowName = this.getCurRowName();
    for (let i = 0; i < this.searchResult.treeDataTable.length; i++) {
      let ele = this.searchResult.treeDataTable[i];
      console.log(ele);
      // 选的产线
      for (let j = 0; j < ele.children.length; j++) {
        if (ele.children[j].code === curRowName) {
          resourceInfos.push({ scheduleGroupCode: ele.code, resourceCodes: [curRowName] });
          break;
        }
      }
      if (resourceInfos.length > 0) {
        break;
      }
    }

    console.log(resourceInfos);
    return resourceInfos;
  }

  filterFieldChange(event: any) {
    this.filterWorkOrderByField('');
  }

  // 工单指定
  public setResourceAndRate() {
    const curTask = this.getTask();
    if (curTask !== '') {
      const linesReturn = [];
      this.modal.static(PlanscheduleDigitalizationWorkbenchSetResourceAndRateComponent, {
        gridSelectKeys: [curTask.originData.id],
        PLANT_CODE: this.searchResult.PlantCode,
        linesReturn: linesReturn,
      }, 'lg')
        .subscribe((value) => {
          if (value) {
            this.digWorkbenchService.Refresh(this.searchResult.plantCode, linesReturn, '', '').subscribe(resultRef => {
              if (resultRef !== null && resultRef.code === 200) {
                this.msgSrv.success(this.appTranslationService.translate(resultRef.msg || '刷新成功！'));
                this.reloadData();
              } else {
                this.msgSrv.error(this.appTranslationService.translate(resultRef.msg || '刷新失败！'));
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
      this.modal.static(PlanscheduleDigitalizationWorkbenchSplitMoComponent, {
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
    this.modal.static(PlanscheduleMoexceptionAgComponent, {}, 'xl').subscribe(() => {
    });
  }

  // // 产能平衡
  // public calculateWorking() {
  //   if (this.selectionKeys.length > 0) {
  //     const gridSelectItems = this.gridSelectRows;
  //     const resourceCode = gridSelectItems[0].resourceCode;
  //     // 勾选了多个产线
  //     if (gridSelectItems.findIndex(x => x.resourceCode !== resourceCode) > -1) {
  //       this.msgSrv.warning(this.appTranslationService.translate('请选择相同资源下的工单!'));
  //     } else {
  //       this.modal
  //         .static(PlanscheduleDigitalizationWorkbenchCalculateWorkingComponent, { gridSelectItems: gridSelectItems }, 'lg')
  //         .subscribe((value) => {
  //           if (value) {
  //             this.query();
  //           }
  //         });
  //     }
  //   } else {
  //     this.msgSrv.warning(this.appTranslationService.translate(this.Msg.NeedSelect));
  //   }
  // }
}
