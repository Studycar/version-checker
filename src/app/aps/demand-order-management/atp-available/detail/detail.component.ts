import { Component, OnInit } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  selector: 'app-atp-available-detail',
  templateUrl: './detail.component.html'
})
export class AtpAvailableDetailComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private modalRef: NzModalRef,
    private commonQueryService: CommonQueryService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  data: any;
  gridHeight = 350;
  orderTypeOption: any[] = [];
  columns = [
    { field: 'businessUnitCode', headerName: '事业部', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'plantCode', headerName: '工厂', width: 110, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'itemCode', headerName: '产品编码', width: 130, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'batchCode', headerName: '批次号', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'originalOnhandQuantity', headerName: '初始可用量', width: 170, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'remainOnhandQuantity', headerName: '剩余可用量', width: 170, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqNumber', headerName: '订单编号', width: 180, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'lineNumber', headerName: '行号', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'orderType', headerName: '订单类型', width: 120, valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqDate', headerName: '需求日期', width: 150, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'reqQty', headerName: '需求数量', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'usedQty', headerName: '占用数量', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'userType', headerName: '占用类型', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  ];

  ngOnInit() {
    this.loadOrderTypeOption();
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonQueryService.loadGridView(
      { url: '/api/ps/gopAtpOnhandUsed/queryGopAtpOnhandUsed', method: 'GET' },
      this.getQueryParams(),
      this.context
    );
  }

  getQueryParams() {
    return {
      businessUnitCode: this.data.businessUnitCode,
      plantCode: this.data.plantCode,
      itemCode: this.data.itemCode,
      batchCode: this.data.batchCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  loadOrderTypeOption() {
    this.commonQueryService.GetLookupByTypeNew('PP_PLN_ORDER_TYPE').subscribe(res => {
      res.data.forEach(item => {
        this.orderTypeOption.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    if (optionsIndex === 1) {
      options = this.orderTypeOption;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}
