import { AfterViewInit, Component, OnInit } from '@angular/core';
import { OPPlantPlatformService } from './services/op-plant-platform.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { OPPlantPlatformSearchComponent } from './search/op-search.component';
import { ModalHelper } from '@delon/theme';
import { GetPlantPlatformDataInputDto } from './dtos/get-plant-platform-data-input-dto';
import { EditService } from '../opdigitalization-workbench/edit.service';
import { PlantModelCalendarComponent } from 'app/aps/plant-model/calendar/calendar.component';
import { ProcessScheduleMoprocessMaintenanceEditComponent } from '../moprocess-maintenance/edit/edit.component';
import { ProcessScheduleOpdigitalizationWorkbenchEndMoComponent } from '../opdigitalization-workbench/endMo/endMo.component';
import { ProcessScheduleOpdigitalizationWorkbenchMoLevelComponent } from '../opdigitalization-workbench/moLevel/moLevel.component';
import { ProcessScheduleOpdigitalizationWorkbenchPlanReleaseComponent } from '../opdigitalization-workbench/planrelease/planrelease.component';
import { ProcessScheduleOpdigitalizationWorkbenchCalculateWorkingComponent } from '../opdigitalization-workbench/calculateWorking/calculateWorking.component';
import { ProcessSchedulePoComVindicateComponent } from '../pocomvindicate/pocomvindicate.component';
import { ProcessScheduleOpdigitalizationWorkbenchChooseLineComponent } from '../opdigitalization-workbench/chooseLine/chooseLine.component';
import { ProcessScheduleOpShiftplanComponent } from '../opshiftplan/opshiftplan.component';
import { ProcessScheduleOpdigitalizationWorkbenchSetResourceAndRateComponent } from '../opdigitalization-workbench/setResourceAndRate/setResourceAndRate.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'op-plant-platform',
  templateUrl: './op-plant-platform.component.html',
  styleUrls: ['./op-plant-platform.component.css'],
  providers: [OPPlantPlatformService, EditService]
})
export class OPPlantPlatformComponent implements OnInit, AfterViewInit {

  constructor(private plantPlatformService: OPPlantPlatformService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private modal: ModalHelper,
    private digWorkbenchService: EditService) { }
  // 2 hours、12 hours、day、3 day、7 day、14 day、30 day
  scaleModes: any = { 14: '', 28: '', 42: '', 56: '', 70: '', 84: '', 100: '' };
  scaleMode: any;
  filterTasks: any;
  filterRows: any;
  searchResult: any;
  taskTooltipsDisplay: any[];
  taskColorsOptions: any[];
  taskColors: any;
  taskHighlight: string;

  loading = false;
  iconStyle = {
    width: '35px',
    height: '35px',
    'font-size': '8px'
  };

  ngOnInit() {
    this.scaleMode = 56;
    this.filterTasks = '';
    this.filterRows = '';
    this.taskTooltipsDisplay = [true, false, false, false, false, true];

    this.taskColorsOptions = [];
    this.taskColorsOptions.push({ label: '状态', value: '0' });
    this.taskColorsOptions.push({ label: '提前量', value: '1' });
    this.taskColorsOptions.push({ label: '齐套', value: '2' });
    this.taskColors = '0';

    this.taskHighlight = '';
  }

  ngAfterViewInit(): void {
    setTimeout(() => { this.search(); });
  }

  // 查询
  search() {
    this.modal.static(OPPlantPlatformSearchComponent, { searchResult: this.searchResult }).subscribe((value) => {
      if (value) {
        this.searchResult = value;
        window.frames['ganttFrame'].contentDocument.getElementById('dataStorage').value = JSON.stringify(value);
        window.frames['ganttFrame'].contentDocument.getElementById('initGanttData').click();
        this.scaleMode = 56;
        this.filterTasks = '';
        this.filterRows = '';
        this.taskTooltipsDisplay = [true, false, false, false, false, true];
        this.taskColors = '0';
        this.taskHighlight = '';
      } else {
      }
    });
  }

  // 根据查询条件重新加载数据
  reloadData() {
    const plantPlatformDataInputDto = new GetPlantPlatformDataInputDto();
    plantPlatformDataInputDto.StartDate = this.searchResult.dateRange.StartDate;
    plantPlatformDataInputDto.EndDate = this.searchResult.dateRange.EndDate;
    plantPlatformDataInputDto.ScheduleGroupResources = this.searchResult.ScheduleGroupResources;
    plantPlatformDataInputDto.PlantCode = this.searchResult.PlantCode;
    this.loading = true;

    this.plantPlatformService.GetPlantPlatformData(plantPlatformDataInputDto).subscribe(res => {
      if (res !== null && res.Success) {
        this.searchResult.plantPlatformDataOutputDto = res.Extra;
        // this.scaleMode = 56;
        // this.filterTasks = '';
        // this.filterRows = '';
        // this.taskTooltipsDisplay = [true, false, false, false, false, true];
        // this.taskColors = '0';
        // this.taskHighlight = '';
        window.frames['ganttFrame'].contentDocument.getElementById('dataStorage').value = JSON.stringify(this.searchResult);
        window.frames['ganttFrame'].contentDocument.getElementById('setGanttData').click();
        this.msgSrv.success(this.appTranslationService.translate(res.Message || '加载数据成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message || '加载数据失败'));
      }

      this.loading = false;
    });
  }

  private refreshCommon(refreshType: string) {
    if (this.searchResult === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请先查询数据!'));
      return;
    }
    // 数据选择
    window.frames['ganttFrame'].contentDocument.getElementById('initRowName').click();
    const curRowName = window.frames['ganttFrame'].contentDocument.getElementById('rowNameStorage').value;
    // window.frames['ganttFrame'].contentDocument.getElementById('backupRowName').click();

    if (curRowName === '') {
      this.msgSrv.warning(this.appTranslationService.translate('请选择计划组或者资源!'));
      return;
    }
    this.loading = true;
    // 调整之前保存数据
    window.frames['ganttFrame'].contentDocument.getElementById('getGanttData').click();
    const curGanttData = JSON.parse(window.frames['ganttFrame'].contentDocument.getElementById('dataStorage').value).data;
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
          RESOURCE_CODE: curRow.name,
          RESOURCE_CODE_OLD: curTask.resCode
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
            this.msgSrv.success(this.appTranslationService.translate('调整保存成功！' + result.Message));
            this.refreshTypeHandle(curRowName, refreshType);
          } else {
            this.msgSrv.error(this.appTranslationService.translate('调整保存失败！' + result.Message));
            this.loading = false;
          }
        });
    } else {
      this.refreshTypeHandle(curRowName, refreshType);
    }
  }

  private refreshTypeHandle(curRowName, refreshType) {
    // 获取资源
    let curScheduleGroupCodes = [curRowName];
    this.searchResult.ScheduleGroupResources.forEach(sgr => {
      if (sgr.Key === curRowName) {
        curScheduleGroupCodes = sgr.Value;
      }
    });
    const plantCode = this.searchResult.PlantCode;
    if (refreshType === '1') {
      this.digWorkbenchService.Refresh(plantCode, curScheduleGroupCodes, '', '').subscribe(resultRef => {
        if (resultRef !== null && resultRef.Success) {
          this.msgSrv.success(this.appTranslationService.translate(resultRef.Message || '刷新成功！'));
          this.reloadData();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(resultRef.Message || '刷新失败！'));
          this.loading = false;
        }
      });
    } else if (refreshType === '2') {
      this.digWorkbenchService.SubmitRequest_MoRecursive(plantCode, curScheduleGroupCodes).subscribe(resultRef => {
        if (resultRef !== null && resultRef.Success) {
          this.msgSrv.success(this.appTranslationService.translate(resultRef.Message || '请求提交成功！'));
          this.reloadData();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(resultRef.Message || '请求提交失败！'));
          this.loading = false;
        }
      });
    } else if (refreshType === '3') {
      this.digWorkbenchService.SubmitRequest_UpperLevelLinkage(plantCode, curScheduleGroupCodes).subscribe(resultRef => {
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

  // 排产刷新
  refresh() {
    this.refreshCommon('1');
  }

  // 工作日历
  openCalendar() {
    if (this.searchResult === null || this.searchResult === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请先查询数据!'));
    } else {
      window.frames['ganttFrame'].contentDocument.getElementById('initRowName').click();
      const curRowName = window.frames['ganttFrame'].contentDocument.getElementById('rowNameStorage').value;
      window.frames['ganttFrame'].contentDocument.getElementById('backupRowName').click();

      let vilidFlag = true;
      let curScheduleGroupCode = '';
      if (curRowName === '') {
        vilidFlag = false;
      } else {
        this.searchResult.ScheduleGroupResources.forEach(sgr => {
          if (sgr.Key === curRowName) {
            vilidFlag = false;
          }
          sgr.Value.forEach(element => {
            if (element === curRowName)
              curScheduleGroupCode = sgr.Key;
          });
        });
      }

      if (vilidFlag === false) {
        this.msgSrv.warning(this.appTranslationService.translate('请选择资源!'));
        return;
      }
      const pGridSelectRow = {
        SCHEDULE_REGION_CODE: this.searchResult.ScheduleRegionCode,
        PLANT_CODE: this.searchResult.PlantCode,
        SCHEDULE_GROUP_CODE: curScheduleGroupCode,
        RESOURCE_CODE: curRowName
      };
      this.modal.static(PlantModelCalendarComponent, { pShowTitle: true, pGridSelectRow: pGridSelectRow }, 'xl')
        .subscribe(() => { });
    }
  }

  // 修改
  openMoEdit() {
    const curTask = this.getTaskById();
    if (curTask !== null && curTask !== undefined) {
      this.modal.static(ProcessScheduleMoprocessMaintenanceEditComponent, { j: { Id: curTask.id } }, 'xl')
        .subscribe((value) => {
          if (value) {
            this.reloadData();
          }
        });
    }
  }

  // 集约选线
  chooseLine() {
    if (this.searchResult === null || this.searchResult === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请先查询数据!'));
    } else {
      window.frames['ganttFrame'].contentDocument.getElementById('initRowName').click();
      const curRowName = window.frames['ganttFrame'].contentDocument.getElementById('rowNameStorage').value;
      // window.frames['ganttFrame'].contentDocument.getElementById('backupRowName').click();
      let vilidFlag = true;
      let curScheduleGroupCode = '';
      if (curRowName === '') {
        vilidFlag = false;
      } else {
        this.searchResult.ScheduleGroupResources.forEach(sgr => {
          if (sgr.Key === curRowName) {
            vilidFlag = false;
          }
          sgr.Value.forEach(element => {
            if (element === curRowName)
              curScheduleGroupCode = sgr.Key;
          });
        });
      }

      if (vilidFlag === false) {
        this.msgSrv.warning(this.appTranslationService.translate('请选择资源!'));
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
          RESOURCE_CODE: curRowName
        },
        querySelection: querySelection
      }, 'lg')
        .subscribe((value) => {
          if (value) {
          }
        });
    }
  }

  // 置尾单
  setEndMo() {
    const curTask = this.getTaskById();
    if (curTask !== null && curTask !== undefined) {
      this.modal.static(ProcessScheduleOpdigitalizationWorkbenchEndMoComponent, { gridSelectKeys: [curTask.id] }, 'lg')
        .subscribe((value) => {
          if (value) {
            this.reloadData();
          }
        });
    }
  }

  // 固定
  fixMo() {
    const curTask = this.getTaskById();
    if (curTask !== null && curTask !== undefined) {
      // 弹出确认框
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate(curTask.movable ? '确定要固定吗？' : '确定要取消固定吗？'),
        nzOnOk: () => {
          window.frames['ganttFrame'].contentDocument.getElementById('initTaskFrom').click();
          const curTaskFrom = window.frames['ganttFrame'].contentDocument.getElementById('taskFromStorage').value;
          // window.frames['ganttFrame'].contentDocument.getElementById('backupTaskId').click();
          this.loading = true;
          this.digWorkbenchService.FixMo([{ ID: curTask.id, FIX_SCHEDULE_TIME: new Date(curTaskFrom) }], curTask.movable).subscribe(result => {
            if (result !== null && result.Success) {
              this.msgSrv.success(this.appTranslationService.translate(result.Message));
              window.frames['ganttFrame'].contentDocument.getElementById('getGanttData').click();
              this.searchResult.plantPlatformDataOutputDto.data = JSON.parse(window.frames['ganttFrame'].contentDocument.getElementById('dataStorage').value).data;
              let curFlag = false;
              this.searchResult.plantPlatformDataOutputDto.data.forEach(rowData => {
                rowData.tasks.forEach(task => {
                  if (task.id === curTask.id) {
                    task.movable = !task.movable;
                    curFlag = true;
                    return;
                  }
                });

                if (curFlag) {
                  return;
                }
              });

              window.frames['ganttFrame'].contentDocument.getElementById('dataStorage').value = JSON.stringify(this.searchResult);
              window.frames['ganttFrame'].contentDocument.getElementById('setGanttData').click();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(result.Message || '操作失败！'));
            }
            this.loading = false;
          });
        },
      });
    }
  }

  // 打开工单组件
  openMoComponent() {
    const curTask = this.getTaskById();
    if (curTask !== null && curTask !== undefined) {
      this.modal.static(ProcessSchedulePoComVindicateComponent, { pShowTitle: true, pGridSelectRow: { PROCESS_MAKE_ORDER_NUM: curTask.name } }, 'xl')
        .subscribe(() => { });
    }
  }

  // 工单簇
  openMoLevel() {
    const curTask = this.getTaskById();
    if (curTask !== null && curTask !== undefined) {
      const modal = this.confirmationService.create({
        // nzWrapClassName: 'modal-lg',
        nzTitle: this.appTranslationService.translate('工单簇'),
        nzContent: ProcessScheduleOpdigitalizationWorkbenchMoLevelComponent,
        nzFooter: null,
        nzWidth: 1200,
        nzComponentParams: { i: { ID: curTask.id } },
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

  // 获取工单
  private getTaskById(): any {
    let curTask;
    if (this.searchResult === null || this.searchResult === undefined) {
      this.msgSrv.warning(this.appTranslationService.translate('请先查询数据!'));
    } else {
      window.frames['ganttFrame'].contentDocument.getElementById('initTaskId').click();
      const curTaskId = window.frames['ganttFrame'].contentDocument.getElementById('taskIdStorage').value;
      // window.frames['ganttFrame'].contentDocument.getElementById('backupTaskId').click();
      if (curTaskId === '') {
        this.msgSrv.warning(this.appTranslationService.translate('请选择工单!'));
      } else {
        this.searchResult.plantPlatformDataOutputDto.data.forEach(rowData => {
          rowData.tasks.forEach(task => {
            if (task.id === curTaskId) {
              curTask = task;
              return;
            }
          });

          if (curTask) {
            return;
          }
        });
      }
    }

    return curTask;
  }

  // 产能平衡
  calculateWorking() {
    const curTask = this.getTaskById();
    if (curTask !== null && curTask !== undefined) {
      let resourceCode = '';
      this.searchResult.plantPlatformDataOutputDto.data.forEach(rowData => {
        rowData.tasks.forEach(task => {
          if (task.id === curTask.id) {
            resourceCode = rowData.name;
            return;
          }
        });

        if (resourceCode !== '') {
          return;
        }
      });

      let scheduleGroupCode = '';
      this.searchResult.plantPlatformDataOutputDto.data.forEach(rowData => {
        rowData.children.forEach(child => {
          if (child === resourceCode) {
            scheduleGroupCode = rowData.name;
            return;
          }
        });

        if (scheduleGroupCode !== '') {
          return;
        }
      });

      const gridSelectItem = {
        PLANT_CODE: this.searchResult.PlantCode,
        SCHEDULE_GROUP_CODE: scheduleGroupCode,
        RESOURCE_CODE: resourceCode,
        ID: curTask.id
      };

      this.modal.static(ProcessScheduleOpdigitalizationWorkbenchCalculateWorkingComponent, { gridSelectItems: [gridSelectItem] }, 'lg')
        .subscribe((value) => {
          if (value) {
            this.reloadData();
          }
        });
    }
  }

  // 工单联动
  moLink() {
    this.refreshCommon('2');
  }

  // 上层联动
  moUpLink() {
    this.refreshCommon('3');
  }

  // 排产表
  openSchedule() {
    window.frames['ganttFrame'].contentDocument.getElementById('initRowName').click();
    let curRowName = window.frames['ganttFrame'].contentDocument.getElementById('rowNameStorage').value;
    // window.frames['ganttFrame'].contentDocument.getElementById('backupRowName').click();
    let curScheduleGroupCode = '';
    if (curRowName === '') {
      this.msgSrv.warning(this.appTranslationService.translate('请选择计划组或者资源!'));
      return;
    } else {
      this.searchResult.ScheduleGroupResources.forEach(sgr => {
        if (sgr.Key === curRowName) {
          curScheduleGroupCode = curRowName;
          curRowName = sgr.Value[0];
        } else {
          sgr.Value.forEach(element => {
            if (element === curRowName)
              curScheduleGroupCode = sgr.Key;
          });
        }
      });
    }

    const pGridSelectRow = {
      SCHEDULE_REGION_CODE: this.searchResult.ScheduleRegionCode,
      PLANT_CODE: this.searchResult.PlantCode,
      SCHEDULE_GROUP_CODE: curScheduleGroupCode,
      RESOURCE_CODE: curRowName
    };
    this.modal.static(ProcessScheduleOpShiftplanComponent, { pShowTitle: true, pGridSelectRow: pGridSelectRow }, 'xl')
      .subscribe(() => { });
  }

  // 计划发布
  release() {
    window.frames['ganttFrame'].contentDocument.getElementById('initRowName').click();
    const curRowName = window.frames['ganttFrame'].contentDocument.getElementById('rowNameStorage').value;
    // window.frames['ganttFrame'].contentDocument.getElementById('backupRowName').click();
    if (curRowName === '') {
      this.msgSrv.warning(this.appTranslationService.translate('请选择计划组或者资源!'));
    } else {
      let lineCodes = [curRowName];
      let groupCode = '';
      this.searchResult.ScheduleGroupResources.forEach(sgr => {
        if (sgr.Key === curRowName) {
          groupCode = sgr.Key;
          lineCodes = sgr.Value;
        }

        sgr.Value.forEach(element => {
          if (element === curRowName) {
            groupCode = sgr.Key;
          }
        });
      });

      this.modal.static(ProcessScheduleOpdigitalizationWorkbenchPlanReleaseComponent,
        {
          i: {},
          regionCode: this.searchResult.ScheduleRegionCode,
          plantCode: this.searchResult.PlantCode,
          lineCodes: lineCodes,
          startTime: this.searchResult.dateRange.StartDate,
          endTime: this.searchResult.dateRange.EndDate,
          schedule_group_code: groupCode,
        }, 'lg').subscribe((value) => {
          if (value) {
          }
        });
    }
  }

  // 放大
  scaleModeChange(event: any) {
    window.frames['ganttFrame'].contentDocument.getElementById('scaleModeStorage').value = this.scaleFormatter(this.scaleMode);
    window.frames['ganttFrame'].contentDocument.getElementById('initScaleMode').click();
  }

  scaleFormatter(value) {
    let formatValue = null;
    switch (value) {
      case 14:
        formatValue = '2 hours';
        break;
      case 28:
        formatValue = '12 hours';
        break;
      case 42:
        formatValue = 'day';
        break;
      case 56:
        formatValue = '3 day';
        break;
      case 70:
        formatValue = '7 day';
        break;
      case 84:
        formatValue = '14 day';
        break;
      case 100:
        formatValue = '30 day';
        break;
      default:
        formatValue = null;
        break;
    }
    return formatValue;
  }

  // 过滤工单
  filterTasksOnInput(event: any) {
    window.frames['ganttFrame'].contentDocument.getElementById('filterTasksStorage').value = this.filterTasks;
    window.frames['ganttFrame'].contentDocument.getElementById('initFilterTasks').click();
  }

  // 过滤行
  filterRowsOnInput(event: any) {
    window.frames['ganttFrame'].contentDocument.getElementById('filterRowsStorage').value = this.filterRows;
    window.frames['ganttFrame'].contentDocument.getElementById('initFilterRows').click();
  }

  // 提示内容
  taskTooltipsDisplayChange(event: any) {
    const curTaskTooltipsDisplay = ['none', 'none', 'none', 'none', 'none', 'none'];
    this.taskTooltipsDisplay.forEach((checked, index) => {
      // tslint:disable-next-line:radix
      if (checked) {
        curTaskTooltipsDisplay[index] = 'inline';
      }
    });
    window.frames['ganttFrame'].contentDocument.getElementById('taskTooltipsStorage').value = JSON.stringify({ taskTooltipsDisplay: curTaskTooltipsDisplay });
    window.frames['ganttFrame'].contentDocument.getElementById('initTaskTooltipsDisplay').click();
  }

  // 工单颜色
  taskColorsChange(event: any) {
    window.frames['ganttFrame'].contentDocument.getElementById('taskColorsStorage').value = this.taskColors;
    window.frames['ganttFrame'].contentDocument.getElementById('initTaskColors').click();
  }

  // 高亮
  taskHighlightChange(event: any) {
    if (event === this.taskHighlight) {
      this.taskHighlight = '';
    } else {
      this.taskHighlight = event;
    }

    window.frames['ganttFrame'].contentDocument.getElementById('taskHighlightStorage').value = this.taskHighlight;
    if (this.taskHighlight === '' || this.taskHighlight === '2') {
      window.frames['ganttFrame'].contentDocument.getElementById('initTaskHighlightColors').click();
    }
  }
  // 工单指定
  public setResourceAndRate() {
    const curTask = this.getTaskById();
    if (curTask !== '') {
      const linesReturn = [];
      this.modal.static(ProcessScheduleOpdigitalizationWorkbenchSetResourceAndRateComponent, {
        gridSelectKeys: [curTask.id],
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
}
