import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { PlanscheduleHWCustomerService } from "../../query.service";


@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  providers: [PlanscheduleHWCustomerService]
})
export class PlanscheduleHWCustomerDetailImportComponent implements OnInit {

  salesmanOptions = [];
  plantCodeList = [];
  
  impColumns = {
    columns: ['客户编码', '所属公司', '信用单位', '客户初始额度', '信用额度', '业务员', '业务员编码', '分管部门', '部门编码', '是否控制信用额度', '税率%'
    , '客户自定义字段1', '客户自定义字段2', '客户自定义字段3', '客户自定义字段4', '客户自定义字段5', '客户自定义字段6', '客户自定义字段7', '客户自定义字段8'
    , '客户自定义字段9', '客户自定义字段10', '客户自定义字段11', '客户自定义字段12', '客户自定义字段13', '客户自定义字段14', '客户自定义字段15'],
    paramMappings: [
      { field: 'cusCode', title: '客户编码', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'plantCode', title: '所属公司', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'creditCus', title: '信用单位', columnIndex: 2, constraint: { notNull: false, } },
      { field: 'initialCredit', title: '客户初始额度', columnIndex: 5, constraint: { notNull: false, } },
      { field: 'cusCredit', title: '信用额度', columnIndex: 3, constraint: { notNull: false, } },
      { field: 'salesman', title: '业务员', columnIndex: 3, constraint: { notNull: false, } },
      { field: 'salesmanCode', title: '业务员编码', columnIndex: 3, constraint: { notNull: false, } },
      { field: 'department', title: '分管部门', columnIndex: 6, constraint: { notNull: false } },
      { field: 'departmentCode', title: '部门编码', columnIndex: 4, constraint: { notNull: false } },
      { field: 'creditControl', title: '是否控制信用额度', columnIndex: 7, constraint: { notNull: true, } },
      { field: 'tax', title: '税率%', columnIndex: 7, constraint: { notNull: true, } },
      { field: 'attribute1', title: '客户自定义字段1', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute2', title: '客户自定义字段2', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute3', title: '客户自定义字段3', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute4', title: '客户自定义字段4', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute5', title: '客户自定义字段5', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute6', title: '客户自定义字段6', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute7', title: '客户自定义字段7', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute8', title: '客户自定义字段8', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute9', title: '客户自定义字段9', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute10', title: '客户自定义字段10', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute11', title: '客户自定义字段11', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute12', title: '客户自定义字段12', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute13', title: '客户自定义字段13', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute14', title: '客户自定义字段14', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'attribute15', title: '客户自定义字段15', columnIndex: 7, constraint: { notNull: false, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'cusCode', title: '客户编码', width: 150, locked: false },
    { field: 'plantCode', title: '所属公司', width: 150, locked: false },
    { field: 'creditCus', title: '信用单位', width: 150, locked: false },
    { field: 'initialCredit', title: '客户初始额度', width: 150, locked: false },
    { field: 'cusCredit', title: '信用额度', width: 150, locked: false },
    { field: 'salesman', title: '业务员', width: 150, locked: false },
    { field: 'salesmanCode', title: '业务员编码', width: 150, locked: false },
    { field: 'department', title: '分管部门', width: 150, locked: false },
    { field: 'departmentCode', title: '部门编码', width: 150, locked: false },
    { field: 'creditControl', title: '是否控制信用额度', width: 150, locked: false },
    { field: 'tax', title: '税率%', width: 150, locked: false },
    { field: 'attribute1', title: '客户自定义字段1', width: 150, locked: false },
    { field: 'attribute2', title: '客户自定义字段2', width: 150, locked: false },
    { field: 'attribute3', title: '客户自定义字段3', width: 150, locked: false },
    { field: 'attribute4', title: '客户自定义字段4', width: 150, locked: false },
    { field: 'attribute5', title: '客户自定义字段5', width: 150, locked: false },
    { field: 'attribute6', title: '客户自定义字段6', width: 150, locked: false },
    { field: 'attribute7', title: '客户自定义字段7', width: 150, locked: false },
    { field: 'attribute8', title: '客户自定义字段8', width: 150, locked: false },
    { field: 'attribute9', title: '客户自定义字段9', width: 150, locked: false },
    { field: 'attribute10', title: '客户自定义字段10', width: 150, locked: false },
    { field: 'attribute11', title: '客户自定义字段11', width: 150, locked: false },
    { field: 'attribute12', title: '客户自定义字段12', width: 150, locked: false },
    { field: 'attribute13', title: '客户自定义字段14', width: 150, locked: false },
    { field: 'attribute14', title: '客户自定义字段14', width: 150, locked: false },
    { field: 'attribute15', title: '客户自定义字段15', width: 150, locked: false },
    { field: 'attribute1', title: '错误信息', width: 150, locked: false }, // 错误信息需要更改字段
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

  extraColumns = [];
  ngOnInit() {
  }

  // 获取动态列
  getColumns() {
    this.queryService.GetLookupByType('PS_CUS_CUSTOMIZATION').subscribe(res => {
      if(res.Success && res.Extra.length > 0) {
        this.extraColumns = [...res.Extra.map(d => ({
          field: d.lookupCode,
          width: 120,
          headerName: d.meaning,
        }))];
      }
    })
  }

  close() {
    this.modal.destroy();
  }

}
