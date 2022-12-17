import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { MoProcessMaintenanceService } from '../../../../modules/generated_module/services/moprocess-maintenance-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'process-schedule-moprocess-maintenance-edit',
  templateUrl: './edit.component.html',
})
export class ProcessScheduleMoprocessMaintenanceEditComponent implements OnInit {
  record: any = {};
  j: any;
  readOnly: boolean;
  resourceoptions: any[] = [];
  statusoptions: any[] = [];
  ISHANG: string;
  isOpen = false;

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private querydata: MoProcessMaintenanceService,
    private modalService: NzModalService,
    private appTrans: AppTranslationService
  ) { }

  ngOnInit(): void {
    this.readOnly = true;
    this.isOpen = true;
    if (this.j.Id !== null) {
      this.querydata.GetById(this.j.Id).subscribe(res => {
        this.querydata.GetResourc2(res.Extra.ITEM_ID, res.Extra.PROCESS_CODE).subscribe(res1 => {
          res1.Extra.forEach(element => {
            this.resourceoptions.push({
              label: element.RESOURCE_CODE,
              value: element.RESOURCE_CODE
            });
          });
        });
        this.j = res.Extra;
        if (res.Extra.PROCESS_MAKE_ORDER_STATUS === 'P') {
          this.ISHANG = '是';
        } else {
          this.ISHANG = '否';
        }
      });
    }
    this.LoadData();
  }

  LoadData() {

    this.querydata.GetStatus().subscribe(res => {
      res.Extra.forEach(element => {
        this.statusoptions.push({
          label: element.MEANING,
          value: element.LOOKUP_CODE
        });
      });
    });
  }

  save() {
    this.querydata.Edit(this.j).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  schCshange(value: any) {
    if (value === true) {
      this.j.SCHEDULE_FLAG = 'Y';
    } else {
      this.j.SCHEDULE_FLAG = 'N';
    }
  }

  moChange(value: any) {
    if (value === true) {
      this.j.MO_WARNNING_FLAG = 'Y';
    } else {
      this.j.MO_WARNNING_FLAG = 'N';
    }
  }

  statusChange(value: any) {
    if (value === true) {
      this.modalService.confirm({
        nzContent: this.appTrans.translate('确定要修改吗？'),
        nzOnOk: () => {
          this.j.PROCESS_MAKE_ORDER_STATUS = 'P';
        },
      });
    }
  }

  backChange(value: any) {
    if (value === 'Y') {
      this.j.SCHEDULE_FLAG = 'N';
    } else {
      this.j.SCHEDULE_FLAG = 'Y';
    }
  }

  scheduleChange(value: any) {
    if (value === 'Y') {
      this.j.BACKLOG_FLAG = 'N';
    } else {
      this.j.BACKLOG_FLAG = 'Y';
    }
  }

}
