import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'completed-sleeve',
    templateUrl: './completed-sleeve.component.html',
    providers: [QueryService]
})

export class CompletedSleeve implements OnInit {
    @Input() public item;
    @Input() public completionRateData;

    i: any;
    rate: Number = 0;
    moQty: Number = 0;
    completedQty: Number = 0;
    completedDate: any;

    kitTime: any;
    orderCount: Number = 0;
    rate1: Number = 0;
    orderCompletedCount: Number = 0;

    constructor(
        public http: _HttpClient,
        private apiService: QueryService
    ) { }

    ngOnInit(): void {
        this.query();
    }
    public query() {
      let data = this.completionRateData;
      if(data) {
        this.rate = data.rate*100 || 0;
        this.moQty = data.moQty || 0;
        this.completedQty = data.completedQty || 0;
        this.completedDate = data.completedDate || '';
      }
      
      this.apiService.queryMakeOrderKitRate({
          plantCode: this.item.plantCode,
          reqNumber: this.item.reqNumber,
      }).subscribe(res => {
          let data = res.data;
          this.kitTime = data.kitTime;
          this.orderCount = data.orderCount;
          this.rate1 = data.rate*100 || 0;
          this.orderCompletedCount = data.orderCompletedCount;
      });
    }
}