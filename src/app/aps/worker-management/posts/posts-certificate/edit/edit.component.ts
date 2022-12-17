import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { PostsService } from '../../query.service';


@Component({
  selector: 'worker-management-posts-certificate-edit',
  templateUrl: './edit.component.html',
  providers: [PostsService]
})
export class WorkerManagementPostsCertificateEditComponent implements OnInit {
  // public optionListPlant: any[] = [];
  public optionListCertificate: any[] = [];
  public optionListEnable: any[] = [];

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
    if (this.i.CERTIFICATE_ID != null&&this.i.POST_ID!=null) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    } else {
      // this.i.PLANT_CODE = this.appConfigService.getPlantCode();
      this.i.UNCERTIFICATED_ALLOWED = 'Y';
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
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    this.editService
      .GetCertificateLists()
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListCertificate.push({
            label: d.CERTIFICATE_CODE+' '+d.CERTIFICATE_NAME,
            value: d.CERTIFICATE_ID,
          });
        });
      });
  }
  // 保存
  save(value: any) {
    this.editService.SaveCertificate(this.i).subscribe(res => {
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
