import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { SkillService } from '../query.service';

@Component({
  selector: 'worker-management-skill-edit',
  templateUrl: './edit.component.html',
  providers: [SkillService]
})
export class WorkerManagementSkillEditComponent implements OnInit {
  public optionListPlant: any[] = [];
  public optionListEnable: any[] = [];
  isModify = false;
  i: any;
  iClone: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: SkillService,
    private appConfigService: AppConfigService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  // 初始化数据
  loadData() {
    if (this.i.Id != null) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.i.enableFlag = 'Y';
    }
    // 工厂
    this.editService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.optionListPlant.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });
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
  // 保存
  save(value: any) {
    this.editService.Save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
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
