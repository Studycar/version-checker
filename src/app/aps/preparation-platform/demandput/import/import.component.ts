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
export class DemandputImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '物料编码', '需求数量', '需求时间', '送货区域'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'itemCode', title: '物料编码', columnIndex: 2, constraint: { notNull: true } },
      { field: 'demandQty', title: '需求数量', columnIndex: 3, constraint: { notNull: true } },
      { field: 'demandDate', title: '需求时间', columnIndex: 4, type: 'date', constraint: { notNull: true, } },
      { field: 'deliveryRegionCode', title: '送货区域', columnIndex: 5, constraint: { notNull: true } },
      { field: 'rowNumber', title: '行号', default: 1 }
    ],
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'itemCode', title: '物料编码', width: 200, locked: false },
    { field: 'demandQty', title: '需求数量', width: 150, locked: false },
    { field: 'demandDate', title: '需求时间', width: 200, locked: false },
    { field: 'deliveryRegionCode', title: '送货区域', width: 200, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    tempData.forEach(x => {
      x.demandDate = new Date(x.demandDate);
    }
    );

    this.commonQueryService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        if (res.data != null && res.data.length > 0)
          this.excelexport.export(res.data);
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
