/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-06-29 15:32:42
 * @LastEditors: Zwh
 * @LastEditTime: 2021-02-06 09:21:46
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../../query.service';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-maintain-edit',
  templateUrl: './edit.component.html',
  // styleUrls: ['../../../../../../assets/css/common.css'],
  providers: [QueryService],
})
export class PlantModelCalendarMaintainEditComponent implements OnInit {
  public isModify = false;
  // 编辑参数
  public i: any;
  private iClone: any;
  public regionOptions: any[] = [];
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
    this.queryService.GetScheduleRegions().subscribe(result => {
      result.data.forEach(d => {
        this.regionOptions.push({ value: d.scheduleRegionCode, label: d.scheduleRegionCode });
      });
    });
    // 是否有效SYS_ENABLE_FLAG
    this.queryService.GetLookupByTypeRef('FND_YES_NO', this.enableOptions);
    if ((this.i.id || '') !== '') {
      this.isModify = true;
      /** 初始化编辑数据 */
      this.queryService.GetCalendar(this.i.id).subscribe(resultMes => {
        this.i = resultMes.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.enableFlag = 'Y';
      this.queryService.GetUserPlant('', this.appConfigService.getUserId()).subscribe(res => {
        this.i.scheduleRegionCode = res.Extra.find(item => item.plantCode === this.appConfigService.getPlantCode()).scheduleRegionCode;
      });
    }
  }
  // 保存
  public save(value: any) {
    if ((this.i.id || '') !== '') {
      value.id = this.i.id;
    } else {
      value.id = null;
    }

    this.queryService.SaveCalendar(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        if (res.msg === 'exist') {
          this.msgSrv.error(this.appTranslationService.translate('一个事业部只能有一个日历编码!'));
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg || '保存失败!'));
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
  public close() {
    this.modal.destroy();
  }
}
