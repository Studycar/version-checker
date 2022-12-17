import { Component, OnInit, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  selector: 'intelligent-simulation-save',
  templateUrl: './save.component.html',
  providers: [QueryService]
})
export class IntelligentSimulationSaveComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) {

  }

  loading: Boolean = false;
  i: any;

  versionOptions: any[] = [];

  ngOnInit(): void {
    // console.log(this.i);
    this.loadData();
  }

  loadData() {
    this.handleVersionListData();
  }

  handleVersionListData() {
    console.log('handleVersionListData', this.versionOptions)
    const lastVersion = Math.max(...this.i.versionOptions.map(item => Number(item.value))) + 1;
    this.versionOptions = this.i.versionOptions;
    this.versionOptions.shift(); // 删除0版本
    this.versionOptions.push({ value: lastVersion + '', label: lastVersion + '' }); // 添加最新版本
    this.versionOptions.reverse(); // 反序
    this.i.paramVersion = this.versionOptions[0].value;
  }

  // 保存
  save(value: any) {
    console.log('save', this.i);
    const params = { ...this.i };
    params.versionList = params.versionOptions.map(item => item.value);
    delete params.versionOptions;
    const paramVersion = params.paramVersion;
    params.paramVersion = Number(params.paramVersion);
    this.loading = true;
    this.queryService.save(params).subscribe(res => {
      this.loading = false;
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(paramVersion);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '保存失败'));
      }
    });
  }

  // 关闭
  close() {
    this.modal.destroy();
  }
}
