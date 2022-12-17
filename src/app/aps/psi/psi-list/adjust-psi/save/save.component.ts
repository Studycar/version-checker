//  保存
import { Component, OnInit, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  selector: 'adjust-psi-save',
  templateUrl: './save.component.html',
  providers: [QueryService]
})
export class AdjustPsiSaveComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) {

  }

  loading: boolean = false;
  isModify = false;
  i: any;
  iClone: any;

  targetVersionOptions: any[] = [];
  isMergeOptions: any[] = [
    { value: '1', label: '是' },
    { value: '0', label: '否' },
  ]

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    }
    this.getVersionList();
  }

  getVersionList() {
    const params = {
      rsltVersion: this.i.rsltVersion,
      psiCode: this.i.psiCode,
    };
    this.targetVersionOptions.length = 0;
    this.queryService.getVersionList(params).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      this.targetVersionOptions = data.map(item => ({ label: item, value: item }));
    });
  }

  // 保存
  save(value: any) {
    console.log('save', this.i);
    const params = { ...this.i, };
    this.loading = true;
    this.queryService.saveAdjustPsi(params).subscribe(res => {
      this.loading = false;
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '保存失败'));
      }
    })
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
