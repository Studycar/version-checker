import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { PostsService } from '../../query.service';


@Component({
  selector: 'worker-management-posts-skill-edit',
  templateUrl: './edit.component.html',
  providers: [PostsService]
})
export class WorkerManagementPostsSkillEditComponent implements OnInit {
  // public optionListPlant: any[] = [];
  public optionListSkill: any[] = [];
  public optionListREQ: any[] = [];

  isModify = false;
  i: any;
  iClone: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: PostsService,
    private appConfigService: AppConfigService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  // 初始化数据
  loadData() {
    if (this.i.SKILL_ID != null &&this.i.POST_ID) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    } else {
      // this.i.PLANT_CODE = this.appConfigService.getPlantCode();
      // this.i.ENABLE_FLAG = 'Y';
    }
    // 工厂
    // this.editService.GetUserPlant().subscribe(result => {
    //   result.Extra.forEach(d => {
    //     this.optionListPlant.push({
    //       label: d.PLANT_CODE,
    //       value: d.PLANT_CODE,
    //     });
    //   });
    // });

    this.editService
    .GetLookupByType('PS_HR_SKILL_LEVEL')
    .subscribe(result => {
      result.Extra.forEach(d => {
        this.optionListREQ.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    this.editService
      .GetSkillLists()
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListSkill.push({
            label: d.SKILL_CODE+' '+d.SKILL_NAME,
            value: d.SKILL_ID,
          });
        });
      });
  }
  // 保存
  save(value: any) {
    this.editService.SaveSkill(this.i).subscribe(res => {
      if (res.Success === true) {
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
