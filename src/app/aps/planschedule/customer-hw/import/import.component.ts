import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { PlanscheduleHWCustomerService } from "../query.service";


@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  providers: [PlanscheduleHWCustomerService]
})
export class PlanscheduleHWCustomerImportComponent implements OnInit {

  cusStateOptions = [];
  plantCodeList = [];
  
  impColumns = {
    columns: ['客户编码', '客户名称', '客户简称', '所属客户', '客户等级', '客户状态', '客户类型', '税号', '联系人', '地区分类', '地址', '联系电话', '开户银行', '银行账号'
    , '银行档案', '是否国内', '币种', '停用时间'],
    paramMappings: [
      { field: 'cusCode', title: '客户编码', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'cusName', title: '客户名称', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'cusAbbreviation', title: '客户简称', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'affiliatedCus', title: '所属客户', columnIndex: 5, constraint: { notNull: false, } },
      { field: 'cusGrade', title: '客户等级', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'cusState', title: '客户状态', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'cusType', title: '客户类型', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'taxNum', title: '税号', columnIndex: 6, constraint: { notNull: true } },
      { field: 'contact', title: '联系人', columnIndex: 4, constraint: { notNull: true } },
      { field: 'region', title: '地区分类', columnIndex: 7, constraint: { notNull: true, } },
      { field: 'address', title: '地址', columnIndex: 7, constraint: { notNull: true, } },
      { field: 'telNum', title: '联系电话', columnIndex: 8, constraint: { notNull: true, } },
      { field: 'bank', title: '开户银行', columnIndex: 9, constraint: { notNull: true, } },
      { field: 'bankNum', title: '银行账号', columnIndex: 10, constraint: { notNull: true, } },
      { field: 'bankArchives', title: '银行档案', columnIndex: 10, constraint: { notNull: false, } },
      { field: 'domestic', title: '是否国内', columnIndex: 10, constraint: { notNull: true, } },
      { field: 'currency', title: '币种', columnIndex: 10, constraint: { notNull: true, } },
      { field: 'disableTime', title: '停用时间', columnIndex: 10, type: 'date', constraint: { notNull: false, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'cusCode', title: '客户编码', width: 150, locked: false },
    { field: 'cusName', title: '客户名称', width: 150, locked: false },
    { field: 'cusAbbreviation', title: '客户简称', width: 150, locked: false },
    { field: 'affiliatedCus', title: '所属客户', width: 150, locked: false },
    { field: 'cusGrade', title: '客户等级', width: 150, locked: false },
    { field: 'cusState', title: '客户状态', width: 150, locked: false },
    { field: 'cusType', title: '客户类型', width: 150, locked: false },
    { field: 'taxNum', title: '税号', width: 150, locked: false },
    { field: 'contact', title: '联系人', width: 150, locked: false },
    { field: 'region', title: '地区分类', width: 150, locked: false },
    { field: 'address', title: '地址', width: 150, locked: false },
    { field: 'telNum', title: '联系电话', width: 150, locked: false },
    { field: 'bank', title: '开户银行', width: 150, locked: false },
    { field: 'bankNum', title: '银行账号', width: 150, locked: false },
    { field: 'bankArchives', title: '银行档案', width: 150, locked: false },
    { field: 'domestic', title: '是否国内', width: 150, locked: false },
    { field: 'currency', title: '币种', width: 150, locked: false },
    { field: 'disableTime', title: '停用时间', width: 150, locked: false },
    { field: 'attribute1', title: '错误信息', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    let errData = [];
    this.queryService.Import(tempData).subscribe(res => {
      if (res.data) {
        if (errData.length > 0) {
          this.excelexport.export(errData);
          this.msgSrv.info(this.appTranslationService.translate(`导入成功${tempData.length}条，导入失败${errData.length}条，请查看导出信息`));
        } else {
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          this.modal.close(true);
        }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    private queryService: PlanscheduleHWCustomerService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService
  ) { }

  ngOnInit() {
  }

  loadOptions() {
  }

  close() {
    this.modal.destroy();
  }

}
