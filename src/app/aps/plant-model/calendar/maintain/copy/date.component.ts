import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../../query.service';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-maintain-copy-date',
  templateUrl: './date.component.html',
  // styleUrls: ['../../../../../../assets/css/common.css'],
  providers: [QueryService],
})
export class PlantModelCalendarMaintainCopyDateComponent implements OnInit {
  // 编辑参数
  public i = {
    plantCode: '',
    scheduleGroupCode: '',
    resourceCode: '',
    calendarCode: '',
    showStartTime: '',
    showEndTime: '',
    targetStartTime: '',
    targetEndTime: ''
  };
  // 构造函数
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService
  ) { }
  // 初始化
  ngOnInit(): void {

  }
  // 复制
  public copy(value: any) {
    // datetime to string
    this.i.showStartTime = this.queryService.formatDate(this.i.showStartTime);
    this.i.showEndTime = this.queryService.formatDate(this.i.showEndTime);
    this.i.targetStartTime = this.queryService.formatDate(this.i.targetStartTime);
    this.i.targetEndTime = this.queryService.formatDate(this.i.targetEndTime);
    this.queryService.CopyByDate(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('复制成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.warning(this.appTranslationService.translate(res.msg));
      }
    });
  }
  // 重置
  public clear() {
    this.i.showStartTime = '';
    this.i.showEndTime = '';
    this.i.targetStartTime = '';
    this.i.targetEndTime = '';
  }
  // 关闭
  close() {
    this.modal.destroy();
  }
}
