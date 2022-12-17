import { Component, OnInit, ViewChild } from "@angular/core";
import { decimal } from "@shared";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { OrderToleranceQueryService } from "../query.service";


@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  providers: [OrderToleranceQueryService]
})
export class OrderToleranceImportComponent implements OnInit {

  plantOptions = [];
  plantCodeList = [];
  options: any = {};
  
  impColumns = {
    columns: ['工厂', '产品大类', '公差', '钢种', '表面', '厚度下区间', '厚度上区间', '下差'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'productCategoryDesc', title: '产品大类', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'allowanceDesc', title: '公差', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'steelTypeDesc', title: '钢种', columnIndex: 23, constraint: { notNull: true, } },
      { field: 'surfaceDesc', title: '表面', columnIndex: 5, constraint: { notNull: true } },
      { field: 'standardsDown', title: '厚度下区间', columnIndex: 6, constraint: { notNull: true } },
      { field: 'standardsUp', title: '厚度上区间', columnIndex: 6, constraint: { notNull: true } },
      { field: 'standardsUp', title: '厚度上区间', columnIndex: 6, constraint: { notNull: true } },
      { field: 'tolerance', title: '下差', columnIndex: 6, constraint: { notNull: true } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'productCategoryDesc', title: '产品大类', width: 150, locked: false },
    { field: 'allowanceDesc', title: '公差', width: 150, locked: false },
    { field: 'steelTypeDesc', title: '钢种', width: 150, locked: false },
    { field: 'surfaceDesc', title: '表面', width: 150, locked: false },
    { field: 'standardsDown', title: '厚度下区间', width: 150, locked: false },
    { field: 'standardsUp', title: '厚度上区间', width: 150, locked: false },
    { field: 'tolerance', title: '下差', width: 150, locked: false },
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
        if(res.data.length < tempData.length) {
          this.modal.close(true);
        }
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    private queryService: OrderToleranceQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
  }


  loadOptions() {
  }

  close() {
    this.modal.destroy();
  }


  isNull(value) {
    return (value || '') === '';
  }

}
