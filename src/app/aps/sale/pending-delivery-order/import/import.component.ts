import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { PendingDeliveryOrderQueryService } from "../query.service";


@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  providers: [PendingDeliveryOrderQueryService]
})
export class PendingDeliveryOrderImportComponent implements OnInit {

  plantOptions = [];
  plantCodeList = [];
  options: any = {};
  
  impColumns = {
    columns: ['工厂', '批号', '目的地', '是否加急', '实际送货车号', '备注', '特殊备注', '提货方式', '物流公司', '配送日期'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'batchCode', title: '批号', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'place', title: '目的地', columnIndex: 2, constraint: { notNull: false, } },
      { field: 'urgent', title: '是否加急', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'realCarNumber', title: '实际送货车号', columnIndex: 3, constraint: { notNull: false, } },
      { field: 'remarks', title: '备注', columnIndex: 5, constraint: { notNull: false, } },
      { field: 'specialRemarks', title: '特殊备注', columnIndex: 5, constraint: { notNull: false, maxLength: 10 } },
      { field: 'deliveryMethod', title: '提货方式', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'logistics', title: '物流公司', columnIndex: 5, constraint: { notNull: false, } },
      { field: 'deliveryDate', title: '配送日期', columnIndex: 5, type: 'dateTime', constraint: { notNull: true } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'batchCode', title: '批号', width: 150, locked: false },
    { field: 'place', title: '目的地', width: 150, locked: false },
    { field: 'urgent', title: '是否加急', width: 150, locked: false },
    { field: 'realCarNumber', title: '实际送货车号', width: 150, locked: false },
    { field: 'remarks', title: '备注', width: 150, locked: false },
    { field: 'specialRemarks', title: '特殊备注', width: 150, locked: false },
    { field: 'deliveryMethod', title: '提货方式', width: 150, locked: false },
    { field: 'logistics', title: '物流公司', width: 150, locked: false },
    { field: 'deliveryDate', title: '配送日期', width: 150, locked: false },
    { field: 'attribute1', title: '错误信息', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.queryService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        this.excelexport.export(res.data);
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    private queryService: PendingDeliveryOrderQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private commonImportService: CommonImportService,
    private appconfig: AppConfigService
  ) { }

  ngOnInit() {
  }

  close() {
    this.modal.destroy();
  }

}
