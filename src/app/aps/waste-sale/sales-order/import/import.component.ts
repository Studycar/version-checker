import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { SalesOrderQueryService } from "../query.service";


@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  providers: [SalesOrderQueryService]
})
export class SalesOrderImportWasteComponent implements OnInit {

  options;
  
  impColumns = {
    columns: ['订单日期', '备注', '销售类型', '销售订单状态', '业务员', '客户编码', '产品大类', '工厂', '币种', '是否自提', '是否含税', '汇率'],
    paramMappings: [
      { field: 'salesOrderDate', title: '订单日期', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'remarks', title: '备注', columnIndex: 2, constraint: { notNull: false, } },
      { field: 'salesOrderType', title: '销售类型', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'salesOrderState', title: '销售订单状态', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'salesman', title: '业务员', columnIndex: 5, constraint: { notNull: true } },
      { field: 'cusCode', title: '客户编码', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'productCategory', title: '产品大类', columnIndex: 7, constraint: { notNull: true, } },
      { field: 'plantCode', title: '工厂', columnIndex: 8, constraint: { notNull: true, } },
      { field: 'currency', title: '币种', columnIndex: 9, constraint: { notNull: true, },},
      { field: 'pickUp', title: '是否自提', columnIndex: 10, constraint: { notNull: true, } },
      { field: 'taxIncluded', title: '是否含税', columnIndex: 11, constraint: { notNull: true, } },
      { field: 'exchangeRate', title: '汇率', columnIndex: 12, constraint: { notNull: true, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'salesOrderDate', title: '订单日期', width: 150, locked: false },
    { field: 'remarks', title: '备注', width: 150, locked: false },
    { field: 'salesOrderType', title: '销售类型', width: 150, locked: false },
    { field: 'salesOrderState', title: '销售订单状态', width: 150, locked: false },
    { field: 'department', title: '部门', width: 150, locked: false },
    { field: 'cusCode', title: '客户编码', width: 150, locked: false },
    { field: 'cusAbbreviation', title: '客户简称', width: 150, locked: false },
    { field: 'cusType', title: '客户类型', width: 150, locked: false },
    { field: 'productCategory', title: '产品大类', width: 150, locked: false },
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'salesman', title: '业务员', width: 150, locked: false },
    { field: 'currency', title: '币种', width: 150, locked: false },
    { field: 'pickUp', title: '是否自提', width: 150, locked: false },
    { field: 'taxIncluded', title: '是否含税', width: 150, locked: false },
    { field: 'exchangeRate', title: '汇率', width: 150, locked: false },
    { field: 'attribute1', title: '错误', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    let errData = [];
    [tempData, errData] = this.verify(tempData);
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
    private queryService: SalesOrderQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    // this.commonImportService.setSequence(this.impColumns, 'currency', this.options.currencyOptions);
    // this.commonImportService.setSequence(this.impColumns, 'pickUp', this.options.YesNoOptions);
    // this.commonImportService.setSequence(this.impColumns, 'taxIncluded', this.options.YesNoOptions);
  }

  loadOptions() {
  }

  close() {
    this.modal.destroy();
  }

  private verify(tempData: any[]) {
    let data = [];
    for(let i = 0; i < tempData.length; i++) {
      tempData[i].salesOrderCode = this.generateSalesOrderCode();
      const option = this.options.salesOrderTypeOptions.find(o => o.label === tempData[i].salesOrderType);
      if(option) {
        tempData[i].cklb = option.cklb;
        tempData[i].cklbRemarks = option.cklbRemarks;
      }
      data.push(tempData[i]);
    }
    let errData = [];
    
    return [data, errData];
  }

  generateSalesOrderCode() {
    const today = new Date();
    const year = today.getFullYear().toString().slice(2);
    const month = today.getMonth() < 9 ? ('0' + (today.getMonth() + 1).toString()) : (today.getMonth() + 1).toString()
    const salesOrderCode = year + month + this.queryService.generateSerial();
    return salesOrderCode;
  }


}
