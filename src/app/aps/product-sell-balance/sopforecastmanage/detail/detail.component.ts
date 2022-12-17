import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { QueryService } from './queryService';
import { SopForeastManageService } from 'app/modules/generated_module/services/sopforecastmanage-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopforecastmanage-detail',
  templateUrl: './detail.component.html',
  providers: [QueryService]
})
export class ProductSellBalanceSopforecastmanageDetailComponent extends CustomBaseContext implements OnInit {

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public pro: BrandService,
    public apptranslate: AppTranslationService,
    public appconfig: AppConfigService,
    private queryService: QueryService,
    private querydata: SopForeastManageService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 270;
  }

  K: any;

  public columns = [
    { field: 'businessUnitCode', headerName: '事业部' },
    { field: 'salesType', headerName: '内外销', valueFormatter: 'ctx.optionsFind(value,1).label', },
    { field: 'plantCode', headerName: '工厂' },
    { field: 'salesRegion', headerName: '业务大区' },
    { field: 'salesArea', headerName: '业务区域' },
    { field: 'itemCode', headerName: '预测编码' },
    { field: 'itemDesc', headerName: '物料描述' },
    { field: 'forecastType', headerName: '预测类型', valueFormatter: 'ctx.optionsFind(value,2).label', },
    { field: 'netForecastDate', headerName: '净预测日期' },
    { field: 'netQty', headerName: '净预测数量' },
    { field: 'consumedQty', headerName: '冲减数量' },
    { field: 'reqNumber', headerName: '需求订单号' },
    { field: 'reqDate', headerName: '订单日期' },
    { field: 'consumeProduction', headerName: '冲减产品维护' },
    { field: 'consumeCustomer', headerName: '冲减客户维度' }
  ];

  salesOptions: any[] = [];
  typeOptions: any[] = [];

  ngOnInit(): void {
    this.queryParams = {
      id: this.K.id
    };

    this.queryService.GetLookupByTypeNew('SOP_SALES_TYPE').subscribe(res => {
      res.data.forEach(element => {
        this.salesOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.queryService.GetLookupByTypeNew('SOP_FORECAST_TYPE').subscribe(res => {
      res.data.forEach(element => {
        this.typeOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.query();
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesOptions;
        break;
      case 2:
        options = this.typeOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  httpQueryAction = {
    url: this.querydata.url2,
    method: 'GET',
    data: false
  };

  query() {
    super.query();
    this.queryService.loadGridViewNew(this.httpQueryAction, this.queryParams, this.context);
  }

  close() {
    this.modal.destroy();
  }


  selectKeys = 'id';

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
