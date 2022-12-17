import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { DlyCalendarService } from '../../../../modules/generated_module/services/dly-calendar-service';
import { DlyCalendarDto } from 'app/modules/generated_module/dtos/dly-calendar-dto';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-dlycalendar-view-edit',
  templateUrl: './view-edit.component.html',
})
export class PreparationPlatformDlycalendarViewEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  title: String = '新增';
  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private service: DlyCalendarService,
    private commonQueryService: CommonQueryService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.title = '编辑';
      this.service.GetByViewId(this.i.id).subscribe(res => {
        this.i = res.data;
        this.iClone = Object.assign({}, this.i);
        this.i.shiftStartTime = new Date(this.i.shiftStartTime);
        this.i.shiftEndTime = new Date(this.i.shiftEndTime);
      });
    }
  }

  save() {    
      this.i.shiftStartTime=this.commonQueryService.getTimeString(this.i.shiftStartTime);
      this.i.shiftEndTime=this.commonQueryService.getTimeString(this.i.shiftEndTime);
      this.service.EditViewData(this.i).subscribe(res => {       
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
  
  }

  close() {
    this.modal.destroy();
  }
  /**重置 */
  clear() {
    this.i.id = this.i.id || '';
    if (this.i.id !== '') {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
}
