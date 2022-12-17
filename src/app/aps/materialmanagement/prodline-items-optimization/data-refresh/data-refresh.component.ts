import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { ProdlineItemOptimizationService } from '../../../../modules/generated_module/services/prodline-item-optimization-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'data-refresh',
  templateUrl: './data-refresh.component.html',
  providers: [ProdlineItemOptimizationService]
})
export class DataRefreshComponent implements OnInit {

  constructor(
    public http: _HttpClient,
    private modalRef: NzModalRef,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService,
    private queryService: ProdlineItemOptimizationService,
    private appTranslationService: AppTranslationService,
  ) { }

  plantOptions: any[] = [];
  whetherOptions: any[] = [];
  params = {
    plantCode: this.appConfigService.getPlantCode(),
    startTime: new Date(new Date().setDate(new Date().getDate() - 21)),
    endTime: new Date(new Date().setDate(new Date().getDate() + 7)),
    uphFlag: 'Y',
    priorityFlag: 'Y',
    uphRateMin: 50,
    uphRateMax: 200
  };

  ngOnInit() {
    this.loadPlant();
    this.loadYesNO();
  }

  loadPlant() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      this.plantOptions.length = 0;
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  loadYesNO(): void {
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      this.whetherOptions.length = 0;
      result.Extra.forEach(d => {
        this.whetherOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  dataRefreshConfirm() {
    const paramsData: {plantCode: string, startTime: string, endTime: string, uphFlag: string, priorityFlag: string, uphRateMin: number, uphRateMax: number } = {
      plantCode: this.params.plantCode,
      startTime: this.formatDate(this.params.startTime),
      endTime: this.formatDate(this.params.endTime),
      uphFlag: this.params.uphFlag,
      priorityFlag: this.params.priorityFlag,
      uphRateMin: this.params.uphRateMin,
      uphRateMax: this.params.uphRateMax
    };
    this.queryService.dataRefresh(paramsData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.modalRef.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${year}-${month}-${day}`;
  }

  close() {
    this.modalRef.destroy();
  }
}
