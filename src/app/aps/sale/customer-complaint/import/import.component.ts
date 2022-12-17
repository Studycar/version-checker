import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { CustomerComplaintQueryService } from "../query.service";


@Component({
  selector: 'customer-complaint-import',
  templateUrl: './import.component.html',
  providers: [CustomerComplaintQueryService]
})
export class CustomerComplaintImportComponent implements OnInit {

  options;
  
  impColumns = {
    columns: ['客诉申请单号', '客诉申请单行号', '选择处理公司', '材料类型', '钢卷号', '钢卷状态', '钢卷所在地', '不良量', 
    '缺陷描述', '客户诉求', '处理信息反馈', '吨钢赔付（元/吨）', '按张赔付（元/张）', '不良重量/吨', 
    '赔偿金额', '赔付描述说明', '退换货类型'],
    paramMappings: [
      { field: 'orno', title: '客诉申请单号', columnIndex: 1, constraint: { notNull: true } },
      { field: 'pono', title: '客诉申请单行号', columnIndex: 2, constraint: { notNull: true } },
      { field: 'plantCode', title: '选择处理公司', columnIndex: 2, constraint: { notNull: true } },
      { field: 'cailiaoType', title: '材料类型', columnIndex: 4, constraint: { notNull: true } },
      { field: 'batchNum', title: '钢卷号', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'gjlx', title: '钢卷状态', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'gjszd', title: '钢卷所在地', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'blp', title: '不良量', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'qxms', title: '缺陷描述', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'qhsq', title: '客户诉求', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'clxxfk', title: '处理信息反馈', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'dgpf', title: '吨钢赔付（元/吨）', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'azpf', title: '按张赔付（元/张）', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'blpKg', title: '不良重量/吨', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'pfje', title: '赔偿金额', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'pfmssm', title: '赔付描述说明', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'thType', title: '退换货类型', columnIndex: 6, constraint: { notNull: true, } },
    ]
  }

  expData: any[] = [];
  expColumns = [
    { field: 'orno', title: '客诉申请单号', width: 150, locked: false },
    { field: 'pono', title: '客诉申请单行号', width: 150, locked: false },
    { field: 'plantCode', title: '选择处理公司', width: 150, locked: false },
    { field: 'cailiaoType', title: '材料类型', width: 150, locked: false },
    { field: 'batchNum', title: '钢卷号', width: 150, locked: false },
    { field: 'gjlx', title: '钢卷状态', width: 150, locked: false },
    { field: 'gjszd', title: '钢卷所在地', width: 150, locked: false },
    { field: 'blp', title: '不良量', width: 150, locked: false },
    { field: 'qxms', title: '缺陷描述', width: 150, locked: false },
    { field: 'qhsq', title: '客户诉求', width: 150, locked: false },
    { field: 'clxxfk', title: '处理信息反馈', width: 150, locked: false },
    { field: 'dgpf', title: '吨钢赔付（元/吨）', width: 150, locked: false },
    { field: 'azpf', title: '按张赔付（元/张）', width: 150, locked: false },
    { field: 'blpKg', title: '不良重量/吨', width: 150, locked: false },
    { field: 'pfje', title: '赔偿金额', width: 150, locked: false },
    { field: 'pfmssm', title: '赔付描述说明', width: 150, locked: false },
    { field: 'thType', title: '退换货类型', width: 150, locked: false },
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
    private queryService: CustomerComplaintQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    // this.commonImportService.setSequence(this.impColumns, 'steelType', this.options.steelTypeOptions);
    // this.commonImportService.setSequence(this.impColumns, 'plantCode', this.options.plantOptions);
    // this.commonImportService.setSequence(this.impColumns, 'processingType', this.options.processingTypeOptions);
    // this.commonImportService.setSequence(this.impColumns, 'cusGrade', this.options.cusGradeOptions);
  }

  loadOptions() {
  }

  close() {
    this.modal.destroy();
  }

}
