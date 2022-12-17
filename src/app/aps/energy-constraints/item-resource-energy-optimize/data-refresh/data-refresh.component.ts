import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { ItemResourceEnergyOptimizeService } from '../query.service';

@Component({
  selector: 'data-refresh',
  templateUrl: './data-refresh.component.html',
  providers: [ItemResourceEnergyOptimizeService]
})
export class ItemResourceEnergyOptimizeDataRefreshComponent implements OnInit {

  plantCode: string;
  params = {
    stanRateMin: 50,
    stanRateMax: 200
  };
  plantCodeList: any[] = [];
  startDate: Date;
  endDate: Date;

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private queryService: ItemResourceEnergyOptimizeService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
  ) { }

  ngOnInit() {
    this.initDate();
    this.loadData();
  }

  initDate() {
    let now = new Date();
    this.startDate = new Date(now.getFullYear(), now.getMonth(), 1); // 当前月份第一天
    this.endDate = new Date(now.getFullYear(), now.getMonth()+1, 0); // 当前月份最后一天
  }

  private loadData() {
    /**初始化 工厂信息 */
    this.queryService.GetUserPlantNew(this.appconfig.getUserId()).subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push({
          label: d.plantCode,
          value: d.plantCode,
        });
        this.plantCode = this.plantCodeList[0].label;
      });
    });
  }

  close() {
    this.modal.destroy();
  }

  dataRefreshConfirm() {
    const params = {
      plantCode: this.plantCode,
      startTime: this.queryService.formatDate(this.startDate),
      endTime: this.queryService.formatDate(this.endDate),
      minValueStr: this.params.stanRateMin,
      maxValueStr: this.params.stanRateMax,
    }
    this.queryService.submitRequest(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('已经提交请求.(请求编号={0})',res.msg));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  disabledStartDate = (startDate: Date): boolean => {
    if (!startDate || !this.endDate) {
      return false;
    }
    return startDate.getTime() > this.endDate.getTime();
  }

  disabledEndDate = (endDate: Date): boolean => {
    if (!endDate || !this.startDate) {
      console.log(`dateFrom: ${this.startDate}`);
      return false;
    }
    /**结束时间大于等于开始时间 */
    return (endDate.getTime() + 86400000) <= this.startDate.getTime();
  }

}
