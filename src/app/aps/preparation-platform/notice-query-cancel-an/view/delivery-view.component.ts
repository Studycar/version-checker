import { Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { filter } from 'rxjs/operators';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { NoticeQueryCancelService } from '../../../../modules/generated_module/services/notice-query-cancel-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-notice-query-cancel-delivery-view',
  templateUrl: './delivery-view.component.html',
  providers: [NoticeQueryCancelService],
  styles: [`.editCellStyle {color:F6A52C;}`]
})
export class PreparationPlatformDeliveryViewComponent extends CustomBaseContext implements OnInit {
  public gridData: any[] = [];
  public totalCount = 0;
  public plantCode = '';
  public notifyNumber = '';
  gridHeight = document.body.clientHeight - 300;
  context = this;
  public totalColumns = [
    { field: 'plantCode', title: '工厂', headerName: '工厂', width: 70, locked: false },
    { field: 'notifyNumber', title: '送货通知单号', headerName: '送货通知单号', width: 180, locked: false },
    { field: 'deliveryNumber', title: '送货单号', headerName: '送货单号', width: 150, locked: false },
    { field: 'deliveryLineNum', title: '送货单行号', headerName: '送货单行号', width: 150, locked: false },
    { field: 'poHeaderNumber', title: '采购订单号', headerName: '采购订单号', width: 150, locked: false },
    { field: 'poLineNum', title: '采购订单行号', headerName: '采购订单行号', width: 180, locked: false },
    { field: 'itemCode', title: '物料编码', headerName: '物料编码', width: 130, locked: false },
    { field: 'itemDesc', title: '物料描述', headerName: '物料描述', width: 120, locked: false, tooltipField: 'itemDesc', },
    { field: 'vendorShortName', title: '供应商', headerName: '供应商', width: 120, locked: false },
    { field: 'deliveryQuantity', title: '制单数', headerName: '制单数', width: 100, locked: false },
    // { field: 'onWayQuantity', title: '在途数', headerName: '在途数', width: 100, locked: false },
    { field: 'receivedQuantity', title: '接收数', headerName: '接收数', width: 100, locked: false },
    { field: 'acceptQuantity', title: '入库数', headerName: '入库数', width: 100, locked: false },
    { field: 'returnedQuantity', title: '退货数', headerName: '退货数', width: 100, locked: false },
    { field: 'status', title: '状态', headerName: '状态', width: 90, locked: false },
    { field: 'deliveryDate', title: '送货时间', headerName: '送货时间', width: 150, locked: false },
    { field: 'creationDate', title: '创建时间', headerName: '创建时间', width: 150, locked: false }
  ];

  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private noticeQueryCancelService: NoticeQueryCancelService,
    private appTranslationService: AppTranslationService,
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.noticeQueryCancelService.listDeliveryTicket(this.plantCode, this.notifyNumber).subscribe(res => {
      this.gridData = res.data;
      this.totalCount = res.data.length;
    });
  }

  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.excelexport.export(this.gridData);
  }
}
