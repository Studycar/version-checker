import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { EditService } from '../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'processSchedule-opdigitalization-workbench-endmo',
  templateUrl: './endMo.component.html',
  providers: [EditService]
})
export class ProcessScheduleOpdigitalizationWorkbenchEndMoComponent implements OnInit {
  // grid 勾选项（传参）
  public gridSelectKeys: any[] = [];
  // 查询参数
  public i = {
    REASON: ''
  };
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: EditService
  ) {

  }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }

  confirm() {
    if (this.i.REASON === '') {
      this.msgSrv.warning(this.appTranslationService.translate('置尾原因不能为空!'));
    } else {
      this.editService.SetEndMo(this.gridSelectKeys, this.i.REASON)
        .subscribe(result => {
          if (result != null) {
            if (result.Success) {
              this.msgSrv.success(this.appTranslationService.translate(result.Message || '置尾成功!'));
              this.modal.close(true);
            } else {
              this.msgSrv.error(this.appTranslationService.translate('置尾失败!<br/>' + result.Message));
            }
          }
        });
    }
  }

  public clear() {
    this.i.REASON = '';
  }
}
