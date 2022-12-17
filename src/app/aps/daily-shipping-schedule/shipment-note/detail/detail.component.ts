import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ShipmentNoteService } from '../shipment-note.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'shipment-note-detail',
  templateUrl: './detail.component.html',
  providers: [ShipmentNoteService],
})
export class ShipmentNoteDetailComponent extends CustomBaseContext implements OnInit {

  selectBy = 'id';
  // 查询参数
  querysDetaiDto: any;
  // 网格列定义
  columns = [
    { field: 'plantCode', headerName: '工厂', title: '工厂', tooltipField: 'plantCode', menuTabs: ['filterMenuTab'] },
    { field: 'dnCode', headerName: 'DN单号', title: 'DN单号', tooltipField: 'dnCode', menuTabs: ['filterMenuTab'] },
    { field: 'dnLineNum', headerName: 'DN单行号', title: 'DN单行号', tooltipField: 'dnLineNum', menuTabs: ['filterMenuTab'] },
    { field: 'planQty', headerName: '计划数量', title: '计划数量', tooltipField: 'planQty', menuTabs: ['filterMenuTab'] },
    { field: 'productMetTime', headerName: '生产可满足时段', title: '生产可满足时段', tooltipField: 'productMetTime', menuTabs: ['filterMenuTab'] },
    { field: 'subinventoryCode', headerName: '发运子库', title: '发运子库', tooltipField: 'subinventoryCode', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', title: '物料编码', tooltipField: 'itemCode', menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', title: '物料描述', tooltipField: 'itemDesc', menuTabs: ['filterMenuTab'] },
  ];

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public shipmentNoteService: ShipmentNoteService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.query();
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const httpAction = { url: this.shipmentNoteService.querysDetailUrl, method: 'POST' };
    // this.querysDetaiDto.QueryParams = { PageIndex: this._pageNo, PageSize: this._pageSize };
    this.querysDetaiDto.export = false;
    this.querysDetaiDto.pageIndex= this._pageNo, 
    this.querysDetaiDto.pageSize=this._pageSize ,
    this.commonQueryService.loadGridViewNew(httpAction, this.querysDetaiDto, this.context);
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.querysDetaiDto.export = true;
    this.commonQueryService.exportAction({ url: this.shipmentNoteService.querysDetailUrl, method: 'POST' }, this.querysDetaiDto, this.excelexport, this.context);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
}
