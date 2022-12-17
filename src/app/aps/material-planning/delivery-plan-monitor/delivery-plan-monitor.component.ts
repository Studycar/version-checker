import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { ModalHelper } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delivery-plan-monitor',
  templateUrl: './delivery-plan-monitor.component.html',
  styleUrls: ['./delivery-plan-monitor.component.css']
})
export class DeliveryPlanMonitorComponent extends CustomBaseContext implements OnInit {

  constructor(public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private modal: ModalHelper,
    private commonQueryService: CommonQueryService,) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  plantOption: any[] = [];
  queryType: any[] = [{ label: '全部订单', value: '1' }, { label: '仅在途', value: '2' }, { label: '已完成', value: '3' }];
  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOption, },
        required: true
      },
      {
        field: 'plantCode',
        title: '类型',
        ui: { type: UiType.select, options: this.queryType, },
        required: true
      },
      { field: 'createDate', title: '日期范围', ui: { type: UiType.dateRange } },

    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      queryType: '1',
      createDate: [],
    }
  };
  columns = [
    { field: 'plantCode', headerName: '工厂', width: 80, menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', width: 180, menuTabs: ['filterMenuTab'] },
    { field: 'vendorMame', headerName: '供应商', width: 140, menuTabs: ['filterMenuTab'] },
    { field: 'poNumber', headerName: '采购订单号', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'poLineNum', headerName: '订单行号', width: 100, menuTabs: ['filterMenuTab'] },
    { field: 'orderQuantity', headerName: '订单数量', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'deliveryPlanQuantity', headerName: '送货计划数', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'deliveryTime', headerName: '交货日期', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'deliveryQuantity', headerName: '已交货数', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'instransitQuantity', headerName: '交货在途', width: 110, menuTabs: ['filterMenuTab'] },
  ];
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  ngOnInit() {
    this.loadPlantOption(this.appConfigService.getDefaultScheduleRegionCode());
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    const httpAction = { url: '/api/mrp/mrpDataOperation/deliveryPlanMonitor', method: 'GET' };
    this.commonQueryService.loadGridViewNew(httpAction, this.getQueryParams(), this.context);
  }

  getQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      queryType: this.queryParams.values.queryType,
      beginDate: this.formatDate(this.queryParams.values.createDate[0]),
      endDate: this.formatDate(this.queryParams.values.createDate[1]),
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      queryType: '1',
      createDate: []
    };
  }

  loadPlantOption(businessUnitCode: string) {
    this.commonQueryService.GetUserPlant(businessUnitCode, '').subscribe(res => {
      this.plantOption.length = 0;
      res.Extra.forEach(item => {
        this.plantOption.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}

