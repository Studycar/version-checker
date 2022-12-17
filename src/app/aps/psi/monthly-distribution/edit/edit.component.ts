import { Component, OnInit, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';
import { sub } from '../../util';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  selector: 'monthly-distribution-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]
})
export class MonthlyDistributionEditComponent {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) {

  }

  loading: Boolean = false;
  isModify = false;
  i: any;
  iClone: any;
  rest: number = 1;
  tooltipTitle = '请输入0到1的小数！';

  buCodeOptions: any[] = [];
  categoryOptions: any[] = [];
  saleChannelOptions: any[] = [
    { label: '线上', value: '线上' },
    { label: '线下', value: '线下' },
  ];

  calculateArr = ['productQtyM1', 'productQtyM2', 'productQtyM3', 'productQtyM4', 'productQtyM5', 'productQtyM6', 'productQtyM7', 'productQtyM8', 'productQtyM9', 'productQtyM10', 'productQtyM11', 'productQtyM12'];

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
      this.getCategoryOptions();
    }
    this.loadData();
    this.calculate(null);
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
    this.i.marketCategory = null;
    this.getCategoryOptions();
  }

  // 获取品类列表
  getCategoryOptions() {
    const businessUnitCode = this.i.businessUnitCode;
    this.categoryOptions.length = 0;
    this.queryService.getCategoryOptions(businessUnitCode).subscribe(res => {
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

  calculate(event: any): void {
    let total = 1;
    this.calculateArr.forEach(key => {
      const value = this.i[key] || 0;
      total = sub(total, value);
    });
    this.rest = total;
  }

  // 保存
  save(value: any) {
    // 月份参数总和应该等于1
    if (this.rest !== 0) {
      this.msgSrv.warning(this.appTranslationService.translate('月份参数总和应该等于1'));
      return;
    }
    // 每个月份参数应该在0-1之间
    let flag = false;
    this.calculateArr.forEach(key => {
      const value = this.i[key] || 0;
      if (value <= 0 || value >=1) {
        flag = true;
      }
    });
    if (flag) {
      this.msgSrv.warning(this.appTranslationService.translate('每个月份参数应该在0-1之间'));
      return;
    }
    const params = { ...this.i };
    params.planPeriodMonth = this.queryService.formatDateTime2(params.planPeriodMonth, 'yyyy-MM');
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
    this.calculate(null);
  }
}
