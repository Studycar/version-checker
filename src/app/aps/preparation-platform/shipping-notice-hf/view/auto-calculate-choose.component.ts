import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { QueryService } from '../query.service';
import { ShippingNoticeHfService } from '../../../../modules/generated_module/services/shipping-notice-hf-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-shipping-notice-auto-calculate-choose',
  templateUrl: './auto-calculate-choose.component.html',
  providers: [QueryService, ShippingNoticeHfService],
})
export class PreparationPlatformShippingNoticeHfAutoCalculateChooseComponent extends CustomBaseContext implements OnInit {
  // public selectableSettings: SelectableSettings;
  // public mySelection: any[] = [];
  public selectBy = 'id';
  totalCount = 0;
  queryParams: any = {};
  autoChoose: any[] = [];
  autoChooses: any[] = [];
  gridHeight = document.body.clientHeight - 300;
  private template =
    `<div class="ag-cell-label-container" role="presentation">
        <div ref="eLabel" class="ag-header-cell-label" role="presentation">
          <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
        </div>
      </div>`;
  // staticColumns: any[] = [
  //   {
  //     colId: 1, cellClass: '', field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
  //     checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
  //     headerComponentParams: {
  //       template: this.template
  //     }
  //   },
  //   { field: 'plantCode', title: '组织', headerName: '组织', width: 80, locked: false },
  //   { field: 'itemCode', title: '物料编码', headerName: '物料编码', width: 120, locked: false },
  //   { field: 'itemDesc', title: '物料描述', headerName: '物料描述', width: 120, locked: false, tooltipField: 'itemDesc' },
  //   { field: 'deliveryPlanNumber', title: '送货计划单号', headerName: '送货计划单号', width: 140, locked: false },
  //   { field: 'deliveryRegionCode', title: '送货区域', headerName: '送货区域', width: 120, locked: false },
  //   { field: 'demandDate', title: '需求时间', headerName: '需求时间', width: 120, locked: false },
  //   { field: 'quantity', title: '数量', headerName: '数量', width: 100, locked: false },
  //   { field: 'vendorShortName', title: '供应商', headerName: '供应商', width: 100, locked: false, tooltipField: 'vendorShortName' },
  //   { field: 'vendorSiteName', title: '供应商地址', headerName: '供应商地址', width: 110, locked: false, tooltipField: 'vendorSiteName' },
  //   { field: 'errMsg', title: '操作提示', headerName: '操作提示', width: 110, locked: false, tooltipField: 'errMsg' }
  // ];
  constructor(
    
    public http: _HttpClient,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private shippingNoticeHfService: ShippingNoticeHfService
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null }); }
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  ngOnInit(): void {
    /*this.selectableSettings = {
      checkboxOnly: true,
      mode: 'multiple'
    };*/
    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }
  close() {
    this.modal.destroy();
  }

  autoCalulate(){
    console.log(this.queryParams);
    
    this.shippingNoticeHfService.autoCalculate(this.queryParams.plantCode, this.queryParams.buyer, 
      this.selectionKeys, this.queryParams.calendarType, this.queryParams.fdStatus,this.queryParams.autoCalculateType).subscribe(res => {
      if (res.code === 200) {
        this.queryCommon();
        this.msgSrv.success(this.appTranslationService.translate('自动计算成功，' + res.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
      this.setLoading(false);
      this.modal.close(true);
    });
  }

  /*public dataStateChange(state: State) {
    this.gridState = state;
    this.queryCommon();
  }*/

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  public onStateChange({ pageNo, pageSize }) {
    // this.gridState = state;
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

  queryCommon() {
    this.queryParams.pageIndex = this._pageNo;
    this.queryParams.pageSize = this._pageSize;
    this.queryParams.export = false;
    this.commonQueryService.pageDeliveryPlan(this.queryParams).subscribe(result => {
      // this.gridData.length = 0;
      this.totalCount = result.data.totalElements;
      this.gridData = result.data.content;
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridState.take,
          filter: this.gridState.filter
        }).data,
        total: this.totalCount
      };
    });
    this.commonQueryService.GetLookupByTypeNew("AUTO_CALCULATE_CHOOSE").subscribe(result => {
      result.data.forEach(element => {
        this.autoChooses.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  planRelease() {
    if (this.gridData === null || this.gridData.length === 0) {
      // this.msgSrv.info(msg);
      return;
    }
    const msg = this.appTranslationService.translate('请勾选数据！');
    if (this.selectionKeys.length === 0) {
      this.msgSrv.info(msg);
      return;
    }

    this.shippingNoticeHfService.releaseDeliveryPlan(this.queryParams.plantCode, this.selectionKeys).subscribe(result => {
      if (result.code === 200) {
        this.msgSrv.info(this.appTranslationService.translate('发布成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(result.msg));
      }
    });
  }

  export() {
    const msg = this.appTranslationService.translate('没有要导出的数据！');
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.info(msg);
      return;
    }
    this.queryParams.export = true;
    this.commonQueryService.pageDeliveryPlan(this.queryParams).subscribe(result => {
      // const _gridData = this.createDataSource(result);
      this.excelexport.export(result.data.content);
    });
  }

  /* 返回选中行对象
  public mySelectionKey(context: RowArgs): string {
    return context.dataItem.ID;
  }*/

}
