import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { DistributionOrderRuleQueryService } from "../query.service";



@Component({
  selector: 'distribution-order-rule-import',
  templateUrl: './import.component.html',
  providers: [DistributionOrderRuleQueryService]
})
export class DistributionOrderRuleImportComponent implements OnInit {

  options;
  
  impColumns = {
    columns: ['产地', '是否长途', '收货范围', '收货区域', '配送地点', '配送仓库', '车载吨位'],
    paramMappings: [
      { field: 'plantCode', title: '产地', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'longDistance', title: '是否长途', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'ranges', title: '收货范围', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'area', title: '收货区域', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'place', title: '配送地点', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'warehouse', title: '配送仓库', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'deadWeight', title: '车载吨位', columnIndex: 3, constraint: { notNull: true, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '产地', width: 150, locked: false },
    { field: 'longDistance', title: '是否长途', width: 150, locked: false },
    { field: 'ranges', title: '收货范围', width: 150, locked: false },
    { field: 'area', title: '收货区域', width: 150, locked: false },
    { field: 'place', title: '配送地点', width: 150, locked: false },
    { field: 'warehouse', title: '配送仓库', width: 150, locked: false },
    { field: 'deadWeight', title: '车载吨位', width: 150, locked: false },
    { field: 'attribute1', title: '错误', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    let errData = [];
    this.queryService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        if (errData.length > 0) {
          this.excelexport.export(errData);
          this.msgSrv.info(this.appTranslationService.translate(`导入成功${tempData.length}条，导入失败${errData.length}条，请查看导出信息`));
        } else {
          this.msgSrv.success(this.appTranslationService.translate("导入成功"));
          this.modal.close(true);
        }
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
    private queryService: DistributionOrderRuleQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    // this.commonImportService.setSequence(this.impColumns, 'markupElement', this.options.markupOptions);
    // this.commonImportService.setSequence(this.impColumns, 'plantCode', this.options.plantOptions);
    // this.commonImportService.setSequence(this.impColumns, 'productCategory', this.options.productCategoryOptions);
  }

  loadOptions() {
  }

  close() {
    this.modal.destroy();
  }

}
