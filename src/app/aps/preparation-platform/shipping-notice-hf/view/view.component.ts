import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { QueryService } from '../query.service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-shipping-notice-hf-view',
  templateUrl: './view.component.html',
  providers: [QueryService],
})
export class PreparationPlatformShippingNoticeHfViewComponent extends CustomBaseContext implements OnInit {
  title: String = '需求-MO明细';
  public gridData: any[] = [];
  public totalCount = 0;
  gridHeight = document.body.clientHeight - 300;
  /*public selectableSettings: SelectableSettings;
  public mySelection: any[] = [];*/
  extendColumns: any[] = [];
  gridRowStyle = { 'border-bottom': '1px solid #d9d9d9' };
  iParam: any = {};
  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null }); }

  ngOnInit(): void {
    if (this.iParam.rowType === 'DEMAND') {
      if (this.iParam.fieldName === 'onhand') {
        this.title = '库存明细';
        this.extendColumns = [
          { field: 'itemCode', title: '物料编码', headerName: '物料编码', width: 150, locked: false },
          { field: 'itemDesc', title: '物料描述', headerName: '物料描述', width: 250, locked: false, tooltipField: 'itemDesc' },
          { field: 'onhandQty', title: '库存数量', headerName: '库存数量', width: 150, locked: false },
          { field: 'warehouseCode', title: '子库', headerName: '子库', width: 150, locked: false },
          { field: 'warehouseDesc', title: '子库描述', headerName: '子库描述', width: 250, locked: false, tooltipField: 'warehouseDesc' },
        ];
      } else {
        this.title = '需求明细';
        this.extendColumns = [
          { field: 'itemCode', title: '物料编码', headerName: '物料编码', width: 120, locked: false },
          { field: 'itemDesc', title: '物料描述', headerName: '物料描述', width: 120, locked: false, tooltipField: 'itemDesc' },
          { field: 'demandStartDate', title: '需求时间', headerName: '需求时间', width: 150, locked: false },
          // { field: 'demandEndDate', title: '需求结束时间', headerName: '需求结束时间', width: 150, locked: false },
          { field: 'demandQty', title: '需求数量', headerName: '需求数量', width: 100, locked: false },
          { field: 'sourceQty', title: '来源数量', headerName: '来源数量', width: 100, locked: false },
          { field: 'source', title: 'mo号', headerName: 'mo号', width: 100, locked: false },
          { field: 'resourceCode', title: '生产线', headerName: '生产线', width: 100, locked: false },
          { field: 'sourceType', title: '来源类型', headerName: '来源类型', width: 100, locked: false },
          { field: 'remark', title: '备注', headerName: '备注', width: 100, locked: false, tooltipField: 'remark' },
          { field: 'startTime', title: '原始需求开始时间', headerName: '原始需求开始时间', width: 160, locked: false },
          { field: 'endTime', title: '原始需求结束时间', headerName: '原始需求结束时间', width: 160, locked: false },
          { field: 'publishTime', title: '需求发布时间', headerName: '需求发布时间', width: 150, locked: false },
        ];
      }
    } else if (this.iParam.rowType === 'DELIVERY_NOTIFY') {
      // 调用送货通知查询取消页面 此处失效
      this.title = '送货通知明细';
      this.extendColumns = [ // { field: 'plantCode', title: '工厂', width: 70, locked: false },
        { field: 'notifyNumber', title: '送货通知单号', headerName: '送货通知单号', width: 140, locked: false },
        { field: 'itemCode', title: '物料编码', headerName: '物料编码', width: 150, locked: false },
        { field: 'itemDesc', title: '物料描述', headerName: '物料描述', width: 120, locked: false },
        { field: 'needByDate', title: '需求日期', headerName: '需求日期', width: 120, locked: false },
        { field: 'deliveryRegion', title: '送货区域', headerName: '送货区域', width: 120, locked: false },
        { field: 'quantity', title: '计划数量', headerName: '计划数量', width: 120, locked: false },
        { field: 'vendorShortName', title: '供应商', headerName: '供应商', width: 120, locked: false },
        { field: 'vendorSiteName', title: '供应商地址', headerName: '供应商地址', width: 120, locked: false },
        { field: 'deliveryQuantity', title: '制单数', headerName: '制单数', width: 100, locked: false },
        { field: 'receivedQuantity', title: '接收数', headerName: '接收数', width: 100, locked: false },
        { field: 'status', title: '状态', headerName: '状态', width: 90, locked: false }
      ];
    }

    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
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
    this.iParam.pageIndex = this._pageNo;
    this.iParam.pageSize = this._pageSize;
    this.iParam.export = false;
    this.commonQueryService.pageDetailData(this.iParam).subscribe(result => {
      this.gridData.length = 0;
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
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  // 导出
  public export() {
    const msg = this.appTranslationService.translate('没有要导出的数据！');
    if (this.gridData == null || this.gridData.length === 0) {
      this.msgSrv.info(msg);
      return;
    }
    this.iParam.IsExport = true;
    this.commonQueryService.pageDetailData(this.iParam).subscribe(result => {
      this.excelexport.export(result.data.content);
    });
  }
}
