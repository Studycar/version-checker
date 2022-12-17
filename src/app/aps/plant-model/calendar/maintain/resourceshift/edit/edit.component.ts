import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../../../query.service';
import { AppTranslationService } from '../../../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-resourceshift-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService],
})
export class PlantModelCalendarResourceShiftEditComponent implements OnInit {
  isModify = false;
  // 编辑参数
  public i: any;
  private iClone: any;
  // 下拉选项
  public regionOptions: any[] = [];
  public plantOptions: any[] = [];
  public groupOptions: any[] = [];
  public lineOptions: any[] = [];
  public calendarOptions: any[] = [];
  public shiftOptions: any[] = [];
  public enableOptions: any[] = [];
  // 构造函数
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService
  ) { }
  // 初始化
  ngOnInit(): void {
    // 事业部
    this.queryService.GetScheduleRegions()
      .subscribe(result => {
        result.data.forEach(d => {
          this.regionOptions.push({ value: d.scheduleRegionCode, label: d.scheduleRegionCode });
        });
      });
    this.loadCalendar(); // 日历
    // 工厂
    this.loadPlant(); // 工厂
    // 计划组
    this.loadGroup();
    // 资源
    this.loadLine();
    // 是否有效SYS_ENABLE_FLAG
    this.queryService.GetLookupByTypeRef('FND_YES_NO', this.enableOptions);
    if (this.i.id != null) {
      this.isModify = true;
      /** 初始化编辑数据 */
      this.queryService.GetResShift(this.i.id).subscribe(resultMes => {
        this.i = resultMes.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.queryService.getUserPlant(this.appConfigService.getUserId()).subscribe(res => {
        this.i.scheduleRegionCode = res.data.find(item => item.plantCode === this.appConfigService.getPlantCode()).scheduleRegionCode;
        this.regionChange(this.i.scheduleRegionCode);
        this.i.plantCode = this.appConfigService.getPlantCode();
        this.plantChange(this.i.plantCode);
      });
      this.i.enableFlag = 'Y';
    }
  }
  // 切换区域
  public regionChange(value: string) {
    this.i.calendarCode = null;
    this.i.plantCode = null;
    this.i.scheduleGroupCode = null;
    this.i.resourceCode = null;
    this.loadCalendar(); // 日历
    this.loadPlant(); // 工厂
    this.loadGroup();
    this.loadLine();
  }
  // 切换日历
  public calendarChange(value: string) {
    this.i.shiftCode = null;
    // 班次编码
    this.queryService.GetShiftListRef({ calendarCode: this.i.calendarCode || '' }, this.shiftOptions);
  }
  // 切换工厂
  public plantChange(value: string) {
    this.i.scheduleGroupCode = null;
    this.i.resourceCode = null;
    this.loadGroup();
    this.loadLine();
  }
  // 切换计划组
  public groupChange(value: string) {
    this.i.resourceCode = null;
    this.loadLine();
  }
  // 加载工厂
  private loadPlant() {
    // this.plantOptions.length = 0;
    this.queryService.GetUserPlant(this.i.scheduleRegionCode || '')
      .subscribe(result => {
        this.plantOptions.length = 0;
        result.Extra.forEach(d => {
          this.plantOptions.push({ value: d.plantCode, label: d.plantCode });
        });
      });
  }
  // 加载工作日历编码
  private loadCalendar() {
    // 日历编码
    // this.queryService.GetCalendarListRef({ scheduleRegionCode: this.i.scheduleRegionCode || '' }, this.calendarOptions);
    // this.calendarOptions.length = 0;
    if ((this.i.scheduleRegionCode || '') === '') return;
    this.queryService.GetCalendarList({ scheduleRegionCode: this.i.scheduleRegionCode || '' }).subscribe(result => {
      this.calendarOptions.length = 0;
      result.data.forEach(d => {
        this.calendarOptions.push({
          label: d.calendarCode,
          value: d.calendarCode,
          scheduleRegionCode: d.scheduleRegionCode
        });
      });
      const calendar = this.calendarOptions.find(x => x.scheduleRegionCode === this.i.scheduleRegionCode);
      this.i.calendarCode = calendar.value || '';
      // 加载班次
      this.calendarChange('');
    });
  }
  // 加载计划组
  private loadGroup() {
    // this.groupOptions.length = 0;
    if ((this.i.scheduleRegionCode || '') === '') return;
    this.queryService.GetUserPlantGroup(this.i.plantCode || '', this.i.scheduleRegionCode || '')
      .subscribe(result => {
        this.groupOptions.length = 0;
        result.Extra.forEach(d => {
          this.groupOptions.push({ value: d.scheduleGroupCode, label: d.scheduleGroupCode });
        });
      });
  }
  // 加载资源产线
  private loadLine() {
    // this.lineOptions.length = 0;
    if ((this.i.plantCode || '') === '') return;
    this.queryService.GetUserPlantGroupLine(this.i.plantCode || '', this.i.scheduleGroupCode || '')
      .subscribe(result => {
        this.lineOptions.length = 0;
        result.Extra.forEach(d => {
          this.lineOptions.push({ value: d.resourceCode, label: d.resourceCode });
        });
      });
  }
  // 保存
  public save(value: any) {
    if (this.i.id !== null) {
      value.id = this.i.id;
    } else {
      value.id = null;
    }
    this.queryService.SaveResShift(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        if (res.msg === 'exist2') {
          this.msgSrv.error(this.appTranslationService.translate('一个资源不能使用多个日历编码!'));
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      }
    });
  }
  // 重置
  public clear() {
    this.i.id = this.i.id || '';
    if (this.i.id !== '') {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
  // 关闭
  close() {
    this.modal.destroy();
  }
}
