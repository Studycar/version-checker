import { Component, OnInit, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  selector: 'maintain-annual-parameters-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]
})
export class MaintainAnnualParametersEditComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) {

  }

  loading = false;
  isModify = false;
  i: any;
  iClone: any;

  buCodeOptions: any[] = [];
  categoryOptions: any[] = [];
  saleChannelOptions: any[] = [
    { value: '1', label: '线上' },
    { value: '2', label: '线下' },
  ]

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
      console.log(this.i);
      this.getCategoryOptions();
    }
    this.loadData();
  }

  loadData() {
    this.getBuCodeOptions();
  }

  // 获取事业部列表
  getBuCodeOptions() {
    this.buCodeOptions.length = 0;
    this.queryService.getScheduleRegion().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.buCodeOptions.push({
          value: item.scheduleRegionCode,
          label: item.descriptions,
        });
      });
    });
  }

  buCodeOptionsChange(event: any) {
    this.getCategoryOptions();
  }

  // 获取品类列表
  getCategoryOptions() {
    const params = {
      businessUnitCode: this.i.businessUnitCode,
    };
    this.categoryOptions.length = 0;
    this.queryService.getCategoryOptions(params.businessUnitCode).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      const marketCategory = Array.from(new Set(data.filter(item => item.marketCategory).map(item => item.marketCategory)));
      marketCategory.forEach(item => {
        this.categoryOptions.push({
          label: item,
          value: item,
        });
      });
    });
  }


  // 保存
  save(value: any) {
    const params = { ...this.i };
    params.planPeriodMonth = this.queryService.formatDateTime2(params.planPeriodMonth, 'yyyy-MM');
    params.paramType = '1';
    const bu = this.buCodeOptions.find(item => item.value === this.i.businessUnitCode);
    params.businessUnit = bu ? bu.label : null;
    this.loading = true;
    const apiName = this.isModify ? 'edit' : 'save';
    this.queryService[apiName](params).subscribe(res => {
      this.loading = false;
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '保存失败'));
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
