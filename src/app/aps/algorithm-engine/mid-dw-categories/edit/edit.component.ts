import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { MidDWCategoriesService } from '../query.service';
import { isNull } from 'util';

@Component({
  selector: 'algorithm-engine-mid-dw-categories-edit',
  templateUrl: './edit.component.html',
  providers: [MidDWCategoriesService]
})
export class AlgorithmEngineMidDWCategoriesEditComponent implements OnInit {
  public optionListEnable: any[] = [];

  isModify = false;
  i: any;
  iClone: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: MidDWCategoriesService,
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
  }

  categoryCodeChange(event: any) {
    const reg = /^(?!_)(?!.*?_$)[a-zA-Z_]+$/;
    if (!reg.test(event.target.value)) {
      this.msgSrv.error(this.appTranslationService.translate('仅输入字母或“_”，且仅可字母开头和结束，15个字符以内'));
      event.target.value=''; 
      this.i.categoryShortName='';
    }else{
      this.i.categoryShortName='AI_DW_'+event.target.value;
    }
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
