import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { OrderCommitmentService } from '../order-commitment.service';

@Component({
  selector: 'app-order-commit-edit',
  templateUrl: './edit.component.html',
  providers: [OrderCommitmentService]
})
export class OrderCommitmentEditComponent implements OnInit {

  constructor(
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private modalRef: NzModalRef,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private appTranslateService: AppTranslationService,
    private queryService: OrderCommitmentService,
  ) { }

  businessUnitOptions: any[] = [];
  plantOptions: any[] = [];
  salesRegionOptions: any[] = [];
  salesAreaOptions: any[] = [];
  customerOptions: any[] = [];
  orderTypeOptions: any[] = [];
  domesticOptions: any[] = [
    { label: '内销', value: 'CIMS' },
    { label: '外销', value: 'OMS' }
  ];
  gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];
  params = {
    businessUnitCode: this.appConfigService.getDefaultScheduleRegionCode(),
    salesRegion: null,
    salesArea: null,
    customerNumber: null,
    orderNum: '',
    orderLine: null,
    orderType: null,
    itemCode: '',
    reqDate: null,
    reqQty: null,
    plantCode: null,
    domesticOversea: null,
    promiseQuantity: null,
    promiseDate: null,
    promiseRtn: null,
    rtnMsg: null,
  };
  pageIndex = 1;
  pageSize = 10;

  ngOnInit() {
    this.loadBusinessUnitOption();
    this.loadPlantOption(this.appConfigService.getDefaultScheduleRegionCode());
    this.loadOrderTypeOption();
    this.loadSalesRegionOption();
    this.loadSalesAreaOption();
    this.downSearch('');
  }

  onBusinessUnitCodeChange(val: string) {
    this.params.plantCode = null;
    this.loadPlantOption(val);
    this.params.salesRegion = null;
    this.loadSalesRegionOption();
    this.params.salesArea = null;
    this.loadSalesAreaOption();
  }

  onSalesRegionChange(val: string) {
    this.params.salesArea = null;
    this.loadSalesAreaOption();
  }

  onSalesAreaChange(val: string) {
    this.params.customerNumber = null;
    this.downSearch('');
  }

  downScroll(event: any) {
    this.pageIndex++;
    this.loadCustomer(this.customerOptions, '', this.pageSize);
  }

  downSearch(event: string) {
    this.pageIndex = 1;
    this.customerOptions.length = 0;
    this.loadCustomer(this.customerOptions, event, this.pageSize);
  }

  loadCustomer(options: any[], searchValue: string, PageSize: number, customerNumber: string = '') {
    const dto = {
      customerNumber: customerNumber,
      customerShortName: searchValue,
      enableFlag: 'A',
      areaCode: this.params.salesArea,
      pageIndex: 1, 
      pageSize: 20,
      isExport: false
    };
    this.queryService.getCustomers(dto).subscribe(res => {
      res.data.content.forEach(data => {
        options.push({ value: data.customerNumber, label: data.customerShortName });
      });
    });
  }

  loadSalesRegionOption() {
    this.queryService.getSalesRegionOrSalesArea({
      scheduleRegionCode: this.params.businessUnitCode || this.appConfigService.getDefaultScheduleRegionCode(),
      custDivisionType: 'REGION',
      pareatDivisionId: '',
      enableFlag: 'Y',
      isExport: true,
      pageIndex: 1, 
      pageSize: 20,
    }).subscribe(result => {
      this.salesRegionOptions.length = 0;
      result.data.content.forEach(d => {
        this.salesRegionOptions.push({
          label: d.custDivisionName,
          value: d.custDivisionValue,
        });
      });
    });
  }

  loadSalesAreaOption() {
    this.queryService.getSalesRegionOrSalesArea({
      scheduleRegionCode: this.params.businessUnitCode || this.appConfigService.getDefaultScheduleRegionCode(),
      custDivisionType: 'DC',
      pareatDivisionId: this.params.salesRegion,
      enableFlag: 'Y',
      isExport: true,
      pageIndex: 1, 
      pageSize: 20,
    }).subscribe(result => {
      this.salesAreaOptions.length = 0;
      result.data.content.forEach(d => {
        this.salesAreaOptions.push({
          label: d.custDivisionName,
          value: d.custDivisionValue,
        });
      });
    });
  }

  loadOrderTypeOption() {
    this.commonQueryService.GetLookupByType('PP_PLN_ORDER_TYPE').subscribe(res => {
      res.Extra.forEach(item => {
        this.orderTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
  }

  loadBusinessUnitOption() {
    this.commonQueryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(item => {
        this.businessUnitOptions.push({
          label: item.scheduleRegionCode,
          value: item.scheduleRegionCode
        });
      });
    });
  }

  loadPlantOption(businessUnitCode: string) {
    this.commonQueryService.GetUserPlant(businessUnitCode, '').subscribe(res => {
      this.plantOptions.length = 0;
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.params.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public loadItems(plantCode: string, itemCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(plantCode || '', itemCode || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  save() {
    this.queryService.deliveryCommitment([this.params]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslateService.translate('操作成功！'));
        // this.modalRef.close(true);
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.msg));
      }
    });
    this.modalRef.close(this.params);
  }

  close() {
    this.modalRef.destroy();
  }
}
