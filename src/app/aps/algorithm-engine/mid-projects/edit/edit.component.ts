import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { MidProjectsService } from '../query.service';
import { isNull } from 'util';

@Component({
  selector: 'algorithm-engine-mid-projects-edit',
  templateUrl: './edit.component.html',
  providers: [MidProjectsService]
})
export class AlgorithmEngineMidProjectsEditComponent implements OnInit {
  public optionListTopic: any[] = [];
  public optionListEnable: any[] = [];

  isModify = false;
  i: any;
  iClone: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: MidProjectsService,
    private appConfigService: AppConfigService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  // 初始化数据
  loadData() {
    if (this.i.id != null) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i.activeFlag = 'Y';
    }
    // 是否有效
      this.editService
      .GetLookupByType('FND_YES_NO')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListEnable.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
      this.editService
      .GetLookupByType('AI_MID_BUSINESS_TOPIC_LIST')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListTopic.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  // 保存
  save(value: any) {
    this.editService.Save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  // 关闭
  close() {
    this.modal.destroy();
  }
  // 重置
  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
