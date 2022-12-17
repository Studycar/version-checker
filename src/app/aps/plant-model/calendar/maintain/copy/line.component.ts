import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { QueryService } from '../../query.service';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';
import { PlantModelCalendarMaintainCopyLineSelectComponent } from './line-select.component';
import { CustomBaseContext } from '../../../../../modules/base_module/components/custom-base-context.component';
/**
 * 工作日历复制（按产线）
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-maintain-copy-line',
  templateUrl: './line.component.html',
  // styleUrls: ['../../../../../../assets/css/common.css'],
  providers: [QueryService],
})
export class PlantModelCalendarMaintainCopyLineComponent
  extends CustomBaseContext
  implements OnInit {
  // 默认组织
  public userOrganization = {
    scheduleRegionCode: '',
    plantCode: '',
    scheduleGroupCode: '',
    resourceCode: '',
    calendarCode: '',
  };
  // 编辑参数
  public queryValues = {
    scheduleRegionCode: '',
    plantCode: '',
    scheduleGroupCode: '',
    resourceCode: '',
    calendarCode: '',
    shiftCode: '',
    enableFlag: '',
    showStartTime: '',
    showEndTime: '',
    lineIds: []
  };
  // 下拉选项
  public plantOptions: any[] = [];
  public regionOptions: any[] = [];
  public groupOptions: any[] = [];
  public lineOptions: any[] = [];
  public shiftOptions: any[] = [];
  public calendarOptions: any[] = [];
  public enableOptions: any[] = [];
  // 构造函数
  constructor(
    private modalRef: NzModalRef,
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) {
    super({
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: null,
    });
  }
  // 初始化
  ngOnInit(): void {
    // 设置默认查询参数
    this.setDefaultQueryParams();
    // 事业部
    this.queryService.GetScheduleRegions().subscribe(result => {
      result.data.forEach(d => {
        this.regionOptions.push({
          value: d.scheduleRegionCode,
          label: d.scheduleRegionCode,
          calendarCode: d.calendarCode,
        });
      });
    });
    // 工厂
    this.loadUserPlant();

    // 日历编码
    this.loadCalendarCode();
    // 计划组
    this.loadGroup();
    // 资源
    this.loadLine();
    // 班次
    this.lineChange(this.queryValues.resourceCode || '');
    //是否有效SYS_ENABLE_FLAG
    this.queryService.GetLookupByTypeRef('FND_YES_NO', this.enableOptions);
  }
  // 切换区域
  public regionChange(value: string) {
    this.queryValues.calendarCode =
      this.regionOptions.find(x => x.value === value).calendarCode || '';
    this.queryValues.scheduleGroupCode = null;
    this.queryValues.resourceCode = null;
    // 计划组
    this.loadGroup();
    // 资源
    this.loadLine();
    // 班次
    this.lineChange(this.queryValues.resourceCode || '');
  }

  // 加载工厂
  private loadUserPlant() {
    this.plantOptions.length = 0;
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
        });
      });
    });
  }
  // 加载工作日历编码
  private loadCalendarCode(isLoad: boolean = true) {
    this.calendarOptions.length = 0;
    this.queryService
      .GetCalendarList({
        scheduleRegionCode:
          this.queryValues.scheduleRegionCode || '',
      })
      .subscribe(result => {
        result.data.forEach(d => {
          this.calendarOptions.push({
            label: d.calendarCode,
            value: d.calendarCode,
            scheduleRegionCode: d.scheduleRegionCode,
          });
        });

      });
  }

  // 加载计划组
  private loadGroup() {
    this.groupOptions.length = 0;
    if ((this.queryValues.plantCode || '') === '') return;
    this.queryService
      .GetUserPlantGroup(this.queryValues.plantCode || '', this.queryValues.scheduleRegionCode || '')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.groupOptions.push({
            value: d.scheduleGroupCode,
            label: d.scheduleGroupCode,
            plantCode: d.plantCode,
          });
        });
      });
  }

  //切换工厂
  public plantChange(value: string) {

    if ((value || '') !== '') {
      const plantInfo = this.plantOptions.find(x => x.value === value);
      this.queryValues.plantCode = plantInfo.value || '';
    }
    // 计划组
    this.loadGroup();
    // 资源
    this.loadLine();
    // 班次
    this.lineChange(this.queryValues.resourceCode || '');
  }
  // 切换计划组
  public groupChange(value: string) {
    this.queryValues.resourceCode = null;
    if (value !== undefined && value !== '') {
      const groupInfo = this.groupOptions.find(x => x.value === value);
      this.queryValues.plantCode = groupInfo.plantCode || '';
    }
    this.loadLine();
    // 班次
    this.lineChange(this.queryValues.resourceCode || '');
  }
  // 加载资源产线
  private loadLine() {
    this.lineOptions.length = 0;
    if ((this.queryValues.scheduleGroupCode || '') === '') return;
    this.queryService
      .GetUserPlantGroupLine('', this.queryValues.scheduleGroupCode || '')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.lineOptions.push({
            value: d.resourceCode,
            label: d.resourceCode,
          });
        });
      });
  }
  // 加载车间班次
  private loadShift(){
    this.queryValues.shiftCode = null;
    this.shiftOptions.length = 0;
    if ((this.queryValues.resourceCode || '') === '') return;
    // 班次编码
    this.queryService
      .GetResShiftList({ plantCode: this.queryValues.plantCode, resourceCode: this.queryValues.resourceCode })
      .subscribe(result => {
        result.data.forEach(d => {
          this.shiftOptions.push({
            value: d.shiftCode,
            label: d.shiftName,
            enableFlag: d.enableFlag,
          });
        });
      });
  }
  // 切换产线
  public lineChange(value: string) {
    this.queryValues.calendarCode = null;
      this.queryService.GetCalendarByResourceCode(
        this.queryValues.plantCode || '',
        this.queryValues.resourceCode || ''
      ).subscribe(result => {
        if (result !== null && result.data !== null) {
          this.queryValues.calendarCode = result.data[0];
          this.loadShift();
        }

      });
  }


  // 切换班次
  public shiftChange(value: string) {
    if (value !== '' && value !== undefined) {
      const d = this.shiftOptions.find(x => x.value === value);
      this.queryValues.enableFlag = d.enableFlag;
    }
  }
  // 下一步
  public next() {
    this.modal
      .static(
        PlantModelCalendarMaintainCopyLineSelectComponent,
        { i: this.clone(this.queryValues) },
        'lg',
      )
      .subscribe((value) => { 
        if(value) {
          this.modalRef.close(true);
        }
      });
  }
  // 设置默认查询参数
  private setDefaultQueryParams() {
    this.queryValues.scheduleRegionCode =
      this.userOrganization.scheduleRegionCode || '';
    this.queryValues.plantCode = this.userOrganization.plantCode || '';
    this.queryValues.scheduleGroupCode =
      this.userOrganization.scheduleGroupCode || '';
    this.queryValues.resourceCode = this.userOrganization.resourceCode || '';
    this.queryValues.calendarCode = this.userOrganization.calendarCode || '';
    // 备份初始化查询参数
    this.queryValuesClone = this.clone(this.queryValues);
  }
  // 重置
  public clear() {
    this.queryValues = this.clone(this.queryValuesClone);
  }
  // 关闭
  close() {
    this.modalRef.destroy();
  }
}
