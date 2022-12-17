import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { EditService } from '../edit.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-digitalization-workbench-endmo',
  templateUrl: './endMo.component.html',
  providers: [EditService]
})
export class PlanscheduleDigitalizationWorkbenchEndMoComponent implements OnInit {
  // grid 勾选项（传参）
  public gridSelectKeys: any[] = [];
  exceptionOptions: any[] = [];
  // 查询参数
  public i = {
    reason: '', backlogClass: ''
  };
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: EditService,
    private commonQueryService: CommonQueryService,
    private appconfig: AppConfigService
  ) {

  }

  ngOnInit(): void {
    this.commonQueryService
    .GetLookupByTypeLang('PS_BACKLOG_CLASS', this.appconfig.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.exceptionOptions.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });
  }

  close() {
    this.modal.destroy();
  }

  confirm() {
    if (this.i.reason === '') {
      this.msgSrv.warning(this.appTranslationService.translate('置尾原因不能为空!'));
    } else {
      this.editService.SetEndMo(this.gridSelectKeys, this.i.reason, this.i.backlogClass)
        .subscribe(result => {
          if (result != null) {
            if (result.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate(result.msg || '置尾成功!'));
              this.modal.close(true);
            } else {
              this.msgSrv.error(this.appTranslationService.translate('置尾失败!<br/>' + result.msg));
            }
          }
        });
    }
  }

  public clear() {
    this.i.reason = '';
  }
}
