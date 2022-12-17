import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../../../query.service';
import { AppTranslationService } from '../../../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-shift-edit',
  templateUrl: './edit.component.html',
  // styleUrls: ['../../../../../../../assets/css/common.css'],
  providers: [QueryService],
})
export class PlantModelCalendarShiftEditComponent implements OnInit {
  public isModify = false;
  // 编辑参数
  public i: any;
  iClone: any;
  public enableOptions: any[] = [];
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
    // 是否有效SYS_ENABLE_FLAG
    this.queryService.GetLookupByTypeRef('FND_YES_NO', this.enableOptions);
    if ((this.i.id || '') !== '') {
      this.isModify = true;
      /** 初始化编辑数据 */
      this.queryService.GetShift(this.i.id).subscribe(resultMes => {
        this.i = resultMes.data;
        this.iClone = Object.assign({}, this.i);
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
    value.scheduleRegionCode = this.i.scheduleRegionCode;
    value.calendarCode = this.i.calendarCode;
    value.shiftCode = this.i.shiftCode;
    this.queryService.SaveShift(value).subscribe(res => {
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
  public close() {
    this.modal.destroy();
  }
}
