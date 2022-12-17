import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { DemandorderclearnoticeEditService } from '../demandclearupnoticesplit/edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-his-view',
  templateUrl: './demand-order-his-view.component.html',
  styleUrls: ['./demand-order-his-view.component.css'],
  providers: [DemandorderclearnoticeEditService],
})
export class DemandOrderHisViewComponent implements OnInit {

  i: any;
  queryParams = {};
  hisData = null; // 需要展示的历史数据
  hasLoadData = false;
  loadingStyle = { 'display': 'block' };
  loadingHideStyle = { 'display': 'none' };

  constructor(
    private apiService: DemandorderclearnoticeEditService,
    public http: _HttpClient
  ) { }

  public query() {
    this.apiService.readhistory2(this.queryParams)
      .subscribe(it => {
        this.hisData = it;
        this.hasLoadData = true;
      });
  }

  ngOnInit() {
    this.queryParams = { reqNumber: this.i.REQ_NUMBER, reqLineNum: this.i.REQ_LINE_NUM };
    this.query();
  }
}
