import { Component, OnInit, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  selector: 'monthly-warehouse-copy',
  templateUrl: './copy.component.html',
  providers: [QueryService]
})
export class MonthlyWarehouseCopyComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) {

  }

  loading: Boolean = false;
  i: any;

  buCodeOptions: any[] = [];
  sourceTargetOptions: any[] = [
    { label: '月度出仓比率', value: 1 },
    { label: '月度分销比率', value: 2 },
  ];

  ngOnInit(): void {
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

  // 保存
  save(value: any) {
    const params: any = { ...this.i };
    params.startMonth = this.queryService.formatDateTime2(this.i.startMonth, 'yyyy-MM');
    params.endMonth = this.queryService.formatDateTime2(this.i.endMonth, 'yyyy-MM');
    this.loading = true;
    this.queryService.copy(params).subscribe(res => {
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
}
