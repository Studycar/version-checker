import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { PSMoRequirementQueryService } from '../query.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mo-requirement-manual-coating-import',
  templateUrl: './importCoating.component.html',
  providers: [PSMoRequirementQueryService],
})
export class PSMoRequirementCoatingImportComponent implements OnInit {


  impColumns = {
    columns: ['工厂', '产品编码', '产品名称', '产品描述', '需求长度', '需求日期', '备注'],
    // columns: ['工厂', '产品编码', '产品名称', '产品描述', '胶膜分类', '规格型号', '需求重量', '需求长度', '需求日期', '备注'],

    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 10, constraint: { notNull: true, } },
      { field: 'stockCode', title: '产品编码', columnIndex: 30, constraint: { notNull: true, } },
      { field: 'stockName', title: '产品名称', columnIndex: 40, constraint: { notNull: false, } },
      { field: 'stockDesc', title: '产品描述', columnIndex: 45, constraint: { notNull: false, } },
      // { field: 'coatingTypeName', title: '胶膜分类', columnIndex: 50, constraint: { notNull: true, } },
      // { field: 'standards', title: '规格型号', columnIndex: 60, constraint: { notNull: false, } },
      // { field: 'requirementQty', title: '需求重量', columnIndex: 70, constraint: { notNull: true, } },
      { field: 'requirementLength', title: '需求长度', columnIndex: 80, constraint: { notNull: true, } },
      { field: 'demandTime', title: '需求日期', columnIndex: 90, type: 'date', constraint: { notNull: true, } },
      { field: 'remark', title: '备注', columnIndex: 100, constraint: { notNull: false, } },

    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'stockCode', title: '产品编码', width: 150, locked: false },
    { field: 'stockName', title: '产品名称', width: 150, locked: false },
    { field: 'stockDesc', title: '产品描述', width: 150, locked: false },
    // { field: 'coatingTypeName', title: '胶膜分类', width: 150, locked: false },
    // { field: 'standards', title: '规格型号', width: 150, locked: false },
    // { field: 'requirementQty', title: '需求重量', width: 150, locked: false },
    { field: 'requirementLength', title: '需求长度', width: 150, locked: false },
    { field: 'demandTime', title: '需求日期', width: 150, locked: false },
    { field: 'remark', title: '备注', width: 150, locked: false },
    { field: 'errorMessage', title: '错误信息', width: 150, locked: false },
  ];


  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.queryService.ImportCoating(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '导入成功'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '导入失败'));
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
    public queryService: PSMoRequirementQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
