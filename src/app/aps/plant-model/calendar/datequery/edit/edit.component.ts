import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../../query.service';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-datequery-edit',
  templateUrl: './edit.component.html',
  // styleUrls: ['../../../../../../assets/css/common.css'],
  providers: [QueryService],
})
export class PlantModelCalendarDateQueryEditComponent implements OnInit {
  width = { width: '200px' };
  isModify = false;
  i: any;
  iClone: any;
  public enableOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    // 是否有效SYS_ENABLE_FLAG
    this.queryService.GetLookupByTypeRef('FND_YES_NO', this.enableOptions);
    if (this.i.id != null) {
      this.isModify = true;
      /** 初始化编辑数据 */
      this.queryService.GetResTime(this.i.id).subscribe(resultMes => {
        this.i = resultMes.data;
        this.iClone = Object.assign({}, this.i);
      });
    }
  }
  // 休息时间/开动率更新
  change(value: any) {
    if (value !== undefined && value !== null) {
      this.i.availableTime = (this.queryService.getDays(this.i.endTime, this.i.startTime) * 24).toFixed(0);
      this.i.availableCapacity = ((this.i.availableTime - this.i.restTime) * this.i.efficency * 0.01).toFixed(2);
    }
  }
  // 保存
  save(value: any) {
    if (this.i.availableTime < 0) {
      this.msgSrv.warning(this.appTranslationService.translate('开始时间不能大于结束时间！'));
      return;
    }
    if (this.i.id !== null) {
      value.id = this.i.id;
      value.plantCode = this.i.plantCode;
      value.availableCapacity = this.i.availableCapacity;
      value.startTime = this.queryService.formatDateTime(this.i.startTime);
      value.endTime = this.queryService.formatDateTime(this.i.endTime);
      value.showCalendarDay=this.queryService.formatDateTime2(this.i.showCalendarDay,"yyyy-MM-dd HH:mm:ss");
    } else {
      value.id = null;
    }

    value.type = '2';
    this.queryService.UpdateResTime(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.warning(this.appTranslationService.translate(res.msg));
      }
    });
  }

  clear() {
    this.i.id = this.i.id || '';
    if (this.i.id !== '') {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }

  close() {
    this.modal.destroy();
  }
}
