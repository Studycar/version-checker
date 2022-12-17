import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { process } from '@progress/kendo-data-query';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'supply-view-detail',
  templateUrl: './supply-view-detail.component.html',
  styleUrls: ['./supply-view-detail.component.css'],
  providers: [QueryService],
})
export class SupplyViewDetailComponent extends CustomBaseContext implements OnInit {
  title: String = '供应明细';
  iParam: any;
  // 静态列
  public staticColumns: any[] = [
    { field: 'plantCode', headerName: '工厂', title: '工厂', width: 100, locked: true },
    { field: 'itemCode', headerName: '物料编码', title: '物料编码', width: 120, locked: true },
    { field: 'itemDescription', headerName: '物料描述', title: '物料描述', width: 120, locked: true },
    { field: 'supplyType', headerName: '供应来源', title: '需求来源', width: 100, locked: true },
    { field: 'supplyDate', headerName: '供应时间', title: '需求时间', width: 120, locked: true },
    { field: 'supplyQty', headerName: '供应数量', title: '需求数量', width: 120, locked: true },
    { field: 'attribute1', headerName: '工单号/采购订单/字库', title: '工单号/采购订单/字库', width: 200, locked: true }];

  constructor(
    msgSrv: NzMessageService,
    public queryService: QueryService,
    appTranslationService: AppTranslationService,
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null }); }

  public ngOnInit(): void {
    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.queryService.QuerySupplyDetail(this.iParam).subscribe(result => {
      this.gridData = [];
      if (result !== null && result.data.content !== null) {
        result.data.content.forEach(d => {
          if (d.supplyType === 'MO')
            d.supplyType = '工单';
          else if (d.supplyType === 'ONHAND')
            d.supplyType = '现有量';
          else
            d.supplyType = '采购';
          this.gridData.push(d);
        });
      }
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridState.take,
          filter: this.gridState.filter
        }).data,
        total: result.data.size
      };
    });
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.query();
    } else {
      this.setLoading(false);
    }
  }
}
