import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings } from '../../../../../../node_modules/@progress/kendo-angular-grid';
import { QueryService } from '../query.service';
import { ShippingNoticeHfService } from '../../../../modules/generated_module/services/shipping-notice-hf-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-shipping-notice-hf-data-check',
  templateUrl: './data-check.component.html',
  providers: [QueryService, ShippingNoticeHfService],
})
export class PreparationPlatformShippingNoticeHfDataCheckComponent extends CustomBaseContext implements OnInit {
  public gridData: any[] = [];
  public totalCount = 0;
  gridHeight = document.body.clientHeight - 300;
  queryParams: any = {};
  totalColumns: any[] = [
    { field: 'PLANT_CODE', headerName: '组织', title: '组织', width: 80 },
    { field: 'ITEM_CODE', headerName: '物料编码', title: '物料编码', width: 120},
    { field: 'ITEM_DESC', headerName: '物料描述', title: '物料描述', width: 120, tooltipField: 'ITEM_DESC' },
    { field: 'LAST_NAME', headerName: '采购员', title: '采购员', width: 120, tooltipField: 'LAST_NAME' },
    { field: 'ERROR_MESSAGE', headerName: '例外信息', title: '例外信息', tooltipField: 'ERROR_MESSAGE' },
    // { field: 'VENDOR_SITE_NAME', headerName: '供应商地址', title: '组织', }
  ];
  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private shippingNoticeHfService: ShippingNoticeHfService
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
    // 自动填充列宽
    this.isSizeColumnsToFit = true;
  }

  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  ngOnInit(): void {
    // 初始化数据
    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

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
    this.queryParams.PageIndex = this._pageNo;
    this.queryParams.pageSize = this._pageSize;
    this.queryParams.IsExport = false;
    this.commonQueryService.QueryDataCheck(this.queryParams).subscribe(result => {
      this.gridData.length = 0;
      this.totalCount = result.TotalCount;
      this.gridData = result.Result;
      // this.gridData = result.Result;
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
  }

  // 导出
  public export() {
    const msg = this.appTranslationService.translate('没有要导出的数据！');
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.info(msg);
      return;
    }
    this.queryParams.IsExport = true;
    this.commonQueryService.QueryDataCheck(this.queryParams).subscribe(result => {
      this.excelexport.export(result.Result);
    });
  }
}
