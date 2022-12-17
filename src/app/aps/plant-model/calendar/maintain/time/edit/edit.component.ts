import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../../../query.service';
import { AppTranslationService } from '../../../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-time-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService],
})
export class PlantModelCalendarTimeEditComponent implements OnInit {
  public isModify = false;
  // 编辑参数
  public i: any;
  private iClone: any;
  // 下拉选项
  public calendarOptions: any[] = [];
  public shiftOptions: any[] = [];
  public shiftIntervalOptions: any[] = [];
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
    // 初始化默认的借用能力和开动率
    this.i.lendCapacity = 0;
    this.i.efficency = 100;
    // 日历编码
    this.queryService.GetCalendarListRef({}, this.calendarOptions);
    // 班次
    this.loadShift();
    // 班次时间模板SHIFT_CODE
    this.queryService.GetLookupByTypeRef('PS_SHIFT_CODE', this.shiftIntervalOptions);
    if ((this.i.id || '') !== '') {
      this.isModify = true;
      /** 初始化编辑数据 */
      this.queryService.GetTime(this.i.id).subscribe(resultMes => {
        this.i = resultMes.data;
        this.iClone = Object.assign({}, this.i);
        console.log(this.i);
      });
    } else {
      this.queryService.getUserPlant(this.appConfigService.getUserId()).subscribe(res => {
        const scheduleRegionCode = res.data.find(item => item.PLANT_CODE === this.appConfigService.getPlantCode()).scheduleRegionCode;
        this.i.calendarCode = this.calendarOptions.find(item => item.scheduleRegionCode === scheduleRegionCode).value;
        this.calendarChange(this.i.calendarCode);
      });
    }
  }
  // 日历编码切换
  public calendarChange(value: any) {
    this.i.shiftCode = null;
    // 班次
    this.loadShift();
  }
  // 加载班次
  private loadShift() {
    // 班次编码a
    this.queryService.GetShiftListRef({ calendarCode: this.i.calendarCode }, this.shiftOptions);
  }
  // 保存
  public save(value: any) {
    if ((this.i.id || '') !== '') {
      value.id = this.i.id;
    } else {
      value.id = null;
    }
    value.scheduleRegionCode = this.calendarOptions.find(x => x.value === value.calendarCode).scheduleRegionCode;
    value.enableFlag = 'Y';
    value.showStartTime = this.queryService.formatDateTime(value.startTime);
    value.showEndTime = this.queryService.formatDateTime(value.endTime);
    this.queryService.SaveTime(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
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
