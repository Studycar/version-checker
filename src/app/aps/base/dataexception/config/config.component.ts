import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { DataExceptionService } from '../dataexception.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-dataexception-config',
  templateUrl: './config.component.html',
  providers: [DataExceptionService],
})
export class BaseDataexceptionConfigComponent implements OnInit {

  public record: any = {};                   // 行数据(主网格传递过来)

  /**构造函数 */
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private dataExceptionService: DataExceptionService,
    private appTranslationService: AppTranslationService,
  ) { }

  /**页面初始化 */
  ngOnInit(): void {

    if (this.record.id !== '') {
      /** 初始化编辑数据 */
      this.dataExceptionService.querySingle(this.record.id).subscribe(result => {

        if (result.code==200) {
          this.record = result.data;
        }
      });
    } else {

      this.msgSrv.warning(this.appTranslationService.translate('ID传值失败'));
    }
  }

  /**保存 */
  save(configDto: any) {
    this.record.id = this.record.id || '';
    if (this.record.id !== '') {
      configDto.id = this.record.id;
    } else {
      configDto.id = '';
    }
    this.dataExceptionService.config(configDto).subscribe(result => {
      if (result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.warning(this.appTranslationService.translate(result.msg));
      }
    });
  }

  /**关闭 */
  close() {
    this.modal.destroy();
  }

  textChange(value: string) {
    const k = value.toString().search('delete');
    const k1 = value.toString().search('update');
    if (k !== -1 || k1 !== -1) {
      this.msgSrv.warning('不能包含delete或者update字符串');
      this.dataExceptionService.querySingle(this.record.id).subscribe(result => {
        if (result.code==200) {
          this.record = result.data;
        }
      });
    }
  }
}
