import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { DataExceptionService } from '../dataexception.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-dataexception-edit',
  templateUrl: './edit.component.html',
  providers: [DataExceptionService],
})
export class BaseDataexceptionEditComponent implements OnInit {

  public applicationCodeOptions: any[] = []; // 模块下拉
  public isEnabledOptions: any[] = [];       // 是否有效下拉
  public isModify = false;                   // 是否修改标识
  public record: any = {};                   // 行数据(主网格传递过来)
  public recordDb: any;                      // 数据库行数据

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
    this.loadData();
  }

  /**加载数据 */
  loadData() {
    /* 加载模块数据 */
    this.applicationCodeOptions.length = 0;
    this.dataExceptionService.GetApplication().subscribe(result => {
      this.applicationCodeOptions.length = 0;
      result.data.forEach(d => {
        this.applicationCodeOptions.push({
          label: d.applicationName,
          value: d.applicationCode
        });
      });
    });
    /** 加载是否可用数据 */
    this.isEnabledOptions.length = 0;
    this.dataExceptionService.GetLookupByType('FND_YES_NO').subscribe(result => {
      this.isEnabledOptions.length = 0;
      result.Extra.forEach(d => {
        this.isEnabledOptions.push({
          label: d.meaning,
          value: d.lookupCode
        });
      });
    });

    if (this.record.id !== '') {
      this.isModify = true;
      /** 初始化编辑数据 */
      this.dataExceptionService.querySingle(this.record.id).subscribe(result => {
        this.record = result.data;
        this.recordDb = Object.assign({}, result.data);
      });
    } else {
      this.isModify = false;
      this.record.enableFlag = 'Y';
    }
  }

  /**保存 */
  save(saveDto: any) {
    this.record.id = this.record.id || '';
    if (this.record.id !== '') {
      saveDto.id = this.record.id;
    } else {
      saveDto.id = '';
    }
    this.dataExceptionService.save(saveDto).subscribe(result => {
      if (result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(result.msg));
      }
    });
  }

  /**重置 */
  clear() {
    this.record.id = this.record.id || '';
    if (this.record.id !== '') {
      this.record = this.recordDb;
      this.recordDb = Object.assign({}, this.record);
    } else {
      this.record = {};
    }
  }

  /**关闭 */
  close() {
    this.modal.destroy();
  }
}
