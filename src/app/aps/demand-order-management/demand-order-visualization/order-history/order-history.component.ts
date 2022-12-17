import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Item } from '@progress/kendo-angular-grid/dist/es2015/data/data.iterators';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'order-history',
    templateUrl: './order-history.component.html',
    providers: [QueryService]
})

export class OrderHistory implements OnInit {

    @Input() public item;
    
    loadingStyle = { 'display': 'block' };
    loadingHideStyle = { 'display': 'none' };
    hisData: any[] = []; // 需要展示的历史数据
    hasLoadData = false;
    i: any;

    constructor(
        public http: _HttpClient,
        private apiService: QueryService
    ) { }

    ngOnInit(): void {
        this.query();
    }
    public query() {
        console.log(this.item);
        this.apiService.getChangeHistoryReq({
            reqNumber: this.item.reqNumber,
            reqLineNum: this.item.reqLineNum
        })
            .subscribe(it => {
                this.hisData = it;
                this.hasLoadData = true;
            });
    }
}