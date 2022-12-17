import { Component, OnInit, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  selector: 'actual-occurrence-data-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]
})
export class ActualOccurrenceDataEditComponent {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) {

  }

  isModify = false;
  i: any;
  iClone: any;
  dtAmt: number = 0;
  tooltipTitle = '请输入0到1的小数！';

  businessUnitCodeOptions: any[] = [];
  categoryOptions: any[] = [];
  dataTypeOptions: any[] = [
    { value: 'OWN_INV', label: '自有库存', },
    { value: 'CHANNEL_INV', label: '渠道库存', },
    { value: 'SALE', label: '分销', },
    { value: 'WAREH', label: '出仓', },
    { value: 'PROD', label: '生产', },
  ];
  channelOptions: any[] = [
    { value: '线上', label: '线上', },
    { value: '线下', label: '线下', },
  ];
  salesTypeOptions: any[] = [];

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
    this.getBusinessUnitCodeOptions();
    this.getSalesTypeOptions();
  }

  // 获取事业部列表
  getBusinessUnitCodeOptions() {
    this.businessUnitCodeOptions.length = 0;
    this.queryService.getScheduleRegion().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.businessUnitCodeOptions.push({
          value: item.scheduleRegionCode,
          label: item.descriptions,
        });
      });
    });
  }

  businessUnitCodeOptionsChange(event: any) {
    this.i.category = null;
    this.getCategoryOptions();
  }

  // 获取品类列表
  getCategoryOptions() {
    const params = this.getQueryParams();
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

  // 获取内外销列表
  getSalesTypeOptions() {
    this.salesTypeOptions.length = 0;
    this.queryService.getSaleChannelOptions().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.salesTypeOptions.push({
          label: item.description,
          value: item.lookupCode,
        });
      });
    });
  }

  calculate(event: any): void {
    const dtlAvgPrice = this.i.dtlAvgPrice || 0;
    const dtQty = this.i.dtQty || 0;
    const amount = dtlAvgPrice * dtQty / 10000;
    this.dtAmt = Number(amount.toFixed(8));
  }

  // 获取保存参数
  getQueryParams(): any {
    const params: any = { ...this.i };
    const bu = this.businessUnitCodeOptions.find(item => item.value === params.businessUnitCode);
    params.businessUnit = bu ? bu.label : null;
    params.dtAmt = this.dtAmt;
    params.periodMonth = this.queryService.formatDateTime2(params.periodMonth, 'yyyy-MM');
    console.log('getQueryParams', params);
    return params;
  }

  // 保存
  save(value: any) {
    console.log('save', this.i);
    const params = this.getQueryParams();
    this.queryService.save(params).subscribe(res => {
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
