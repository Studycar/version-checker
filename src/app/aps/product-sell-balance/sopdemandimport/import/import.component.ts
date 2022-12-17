import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../queryService';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-item-category-assign-import',
  templateUrl: './import.component.html',
  providers: [QueryService]
})
export class DemandImportImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '内外销', '需求日期', '产品编码', '产品描述', '业务大区', '预测类型', '需求数量'],
    paramMappings: [
      { field: 'PLANT_CODE', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'SALES_TYPE', title: '内外销', columnIndex: 2, constraint: { notNull: true } },
      { field: 'DEMAND_DATE', title: '需求日期', columnIndex: 3, constraint: { notNull: true } },
      { field: 'ITEM_CODE', title: '产品编码', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'ITEM_DESC', title: '产品描述', columnIndex: 5, constraint: { notNull: false, } },
      { field: 'SALES_AREA', title: '业务大区', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'FORECAST_TYPE', title: '预测类型', columnIndex: 7, constraint: { notNull: true, } },
      { field: 'FORECAST_SOP', title: '需求数量', columnIndex: 8, constraint: { notNull: true, } },
      { field: 'ROW_NUMBER', title: '行号', default: 1 }
    ],
  };

  expData: any[] = [];
  expColumns = [
    { field: 'PLANT_CODE', title: '工厂', width: 150, locked: false },
    { field: 'SALES_TYPE', title: '内外销', width: 150, locked: false },
    { field: 'DEMAND_DATE', title: '需求日期', width: 150, locked: false },
    { field: 'ITEM_CODE', title: '产品编码', width: 150, locked: false },
    { field: 'ITEM_DESC', title: '产品描述', width: 300, locked: false },
    { field: 'SALES_AREA', title: '业务大区', width: 150, locked: false },
    { field: 'FORECAST_TYPE', title: '预测类型', width: 150, locked: false },
    { field: 'FORECAST_SOP', title: '需求数量', width: 150, locked: false },
    { field: 'FAIL_MESSAGE', title: '错误信息', width: 300, locked: false }];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.commonQueryService.Import(tempData).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success(this.appTranslationService.translate(res.Message));
        if (res.Extra != null && res.Extra.length > 0)
          this.excelexport.export(res.Extra);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }


  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
