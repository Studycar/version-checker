import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { EditService } from '../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-digitalization-workbench-remarkmo',
  templateUrl: './remarkMo.component.html',
  providers: [EditService]
})
export class PlanscheduleDigitalizationWorkbenchRemarkMoComponent implements OnInit {
  // grid 勾选项（传参）
  public gridSelectKeys: any[] = [];
  // 参数
  public i = {
    comments: '',
    color: ''
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

  // 选取颜色时触发,可做颜色值转换
  colorPickerChange(event: any) {
    // console.log(event);
    // console.log(this.i.COLOR);
  }

  close() {
    this.modal.destroy();
  }

  confirm() {
    if (this.i.comments === '') {
      this.msgSrv.warning(this.appTranslationService.translate('备注不能为空!'));
    } else {
      const remarkDtos = [];
      this.gridSelectKeys.forEach(x => { remarkDtos.push({ id: x, comments: this.i.comments, attribute1: this.i.color }); });
      this.editService.RemarkMo(remarkDtos)
        .subscribe(result => {
          if (result != null) {
            if (result.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('备注成功!'));
              this.modal.close(true);
            } else {
              this.msgSrv.error(this.appTranslationService.translate('备注失败!<br/>' + result.msg));
            }
          }
        });
    }
  }
}
