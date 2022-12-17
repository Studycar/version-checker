import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { PostsService } from '../query.service';
import { isNull } from 'util';

@Component({
  selector: 'worker-management-posts-edit',
  templateUrl: './edit.component.html',
  providers: [PostsService]
})
export class WorkerManagementPostsEditComponent implements OnInit {
  // public optionListPlant: any[] = [];
  public optionListEnable: any[] = [];
  public optionListPostType: any[] = [];
  public optionListPostGrade: any[] = [];
  public optionListCategory: any[] = [];
  public optionListSubcat: any[] = [];

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
    if (this.i.id != null) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.i.enableFlag = 'Y';
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
      .GetLookupByType('PS_HR_POST_TYPE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListPostType.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
      this.editService
      .GetLookupByType('PS_HR_POST_CATEGORY')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListPostGrade.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
      this.editService
      .GetLookupByType('PS_HR_POST_DIVISION')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListCategory.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
      this.editService
      .GetLookupByType('PS_HR_POST_SUBCATEGORY')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListSubcat.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }
  saveOrEdit(value: any){
    if (this.i.id != null) {
      this.edit(value)
    }else{
      this.save(value)
    }
  }
  // 保存
  save(value: any) {
    this.editService.Save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }
  // 修改
  edit(value: any){
    this.editService.Edit(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
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
