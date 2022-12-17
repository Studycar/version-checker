import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { PpDemandDataInterfaceEditService } from '../edit.service';
import { formatDate } from '@angular/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-pp-demand-data-interface-import',
  templateUrl: './import.component.html',
  providers: [PpDemandDataInterfaceEditService],
})
export class DemandOrderManagementPpDemandDataInterfaceImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '来源系统', '订单编号', '需求订单行号', '需求类型', '物料编码', '需求数量', '需求日期', '内外销', '事业部', '承诺日期', '客户编码', '客户名称', '发运集', '需求说明', '销售业务员', '销售大区', '销售区域','组织'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: false, } },
      { field: 'source', title: '来源系统', columnIndex: 2, constraint: { notNull: true } },
      { field: 'reqNumber', title: '订单编号', columnIndex: 3, constraint: { notNull: true } },
      { field: 'reqLineNum', title: '需求订单行号', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'reqType', title: '需求类型', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'itemCode', title: '物料编码', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'reqQty', title: '需求数量', columnIndex: 7, constraint: { notNull: true, } },
      { field: 'reqDate', title: '需求日期', columnIndex: 8, constraint: { notNull: true, } },
      { field: 'domesticOversea', title: '内外销', columnIndex: 9, constraint: { notNull: true, } },
      { field: 'businessUnit', title: '事业部', columnIndex: 10, constraint: { notNull: false, } },
      { field: 'promiseDate', title: '承诺日期', columnIndex: 11, constraint: { notNull: false, } },
      { field: 'customerNumber', title: '客户编码', columnIndex: 12, constraint: { notNull: false, } },
      { field: 'customerName', title: '客户名称', columnIndex: 13, constraint: { notNull: false, } },
      { field: 'shipmentSetName', title: '发运集', columnIndex: 14, constraint: { notNull: false, } },
      { field: 'reqComment', title: '需求说明', columnIndex: 15, constraint: { notNull: false, } },
      { field: 'salesrepContact', title: '销售业务员', columnIndex: 16, constraint: { notNull: false, } },
      { field: 'salesRegion', title: '销售大区', columnIndex: 17, constraint: { notNull: false, } },
      { field: 'salesArea', title: '销售区域', columnIndex: 18, constraint: { notNull: false, } },
      { field: 'attribute4', title: '组织', columnIndex: 18, constraint: { notNull: false, } },
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'source', title: '来源系统', width: 150, locked: false },
    { field: 'reqNumber', title: '订单编号', width: 200, locked: false },
    { field: 'reqLineNum', title: '需求订单行号', width: 200, locked: false },
    { field: 'reqType', title: '需求类型', width: 150, locked: false },
    { field: 'itemCode', title: '物料编码', width: 200, locked: false },
    { field: 'reqQty', title: '需求数量', width: 150, locked: false },
    { field: 'reqDate', title: '需求日期', width: 200, locked: false },
    { field: 'businessUnit', title: '事业部', width: 300, locked: false },
    { field: 'domesticOversea', title: '内外销', width: 300, locked: false },
    { field: 'promiseDate', title: '承诺日期', width: 200, locked: false },
    { field: 'customerNumber', title: '客户编码', width: 200, locked: false },
    { field: 'customerName', title: '客户名称', width: 250, locked: false },
    { field: 'salesRegion', title: '销售大区', width: 200, locked: false },
    { field: 'salesArea', title: '销售区域', width: 200, locked: false },
    { field: 'shipmentSetName', title: '发运集', width: 200, locked: false },
    { field: 'reqComment', title: '需求说明', width: 300, locked: false },
    { field: 'salesrepContact', title: '销售业务员', width: 150, locked: false },
    { field: 'attribute4', title: '组织', width: 150, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    let valid = true;
    tempData.forEach(item => {
      item.reqDate = formatDate(item.reqDate, 'yyyy-MM-dd HH:mm:ss', 'zh-Hans');
      if (item.promiseDate) {
        item.promiseDate = formatDate(item.promiseDate, 'yyyy-MM-dd HH:mm:ss', 'zh-Hans');
      }
      if (Number(item.reqQty).toString() === 'NaN') {
        valid = false;
      }
    });
    if (!valid) {
      this.msgSrv.error(this.appTranslationService.translate('【需求数量】格式错误'));
      return;
    }
    this.editService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('导入成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        if (res.data && res.data.length) {
          this.excelexport.export(res.data);
        }
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: PpDemandDataInterfaceEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
