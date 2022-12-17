import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { PSMoRequirementQueryService } from '../query.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mo-requirement-manual-import',
  templateUrl: './import.component.html',
  providers: [PSMoRequirementQueryService],
})
export class PSMoRequirementImportComponent implements OnInit {


  impColumns = {
    columns: ['工厂', '产品编码', '产品名称', '产品描述', '钢种', '表面', '规格', '宽度', '长度', '重量', '需求数量', '需求日期', '备注'],

    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 10, constraint: { notNull: true, } },
      { field: 'stockCode', title: '产品编码', columnIndex: 30, constraint: { notNull: true, } },
      { field: 'stockName', title: '产品名称', columnIndex: 40, constraint: { notNull: false, } },
      { field: 'stockDesc', title: '产品描述', columnIndex: 50, constraint: { notNull: false, } },
      { field: 'steelType', title: '钢种', columnIndex: 60, constraint: { notNull: true, } },
      { field: 'surface', title: '表面', columnIndex: 70, constraint: { notNull: true, } },
      { field: 'standards', title: '规格', columnIndex: 80, constraint: { notNull: true, } },
      { field: 'width', title: '宽度', columnIndex: 80, constraint: { notNull: true, } },
      { field: 'length', title: '长度', columnIndex: 100, constraint: { notNull: true, } },
      { field: 'weight', title: '重量', columnIndex: 110, constraint: { notNull: true, } },
      { field: 'requirementQty', title: '需求数量', columnIndex: 120, constraint: { notNull: true, } },
      { field: 'demandTime', title: '需求日期', columnIndex: 130, type: 'date', constraint: { notNull: true, } },
      { field: 'grade', title: '等级', columnIndex: 140, constraint: { notNull: true, } },
      { field: 'remark', title: '备注', columnIndex: 150, constraint: { notNull: false, } },

    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'stockCode', title: '产品编码', width: 150, locked: false },
    { field: 'stockName', title: '产品名称', width: 150, locked: false },
    { field: 'stockDesc', title: '产品描述', width: 150, locked: false },
    { field: 'steelType', title: '钢种', width: 150, locked: false },
    { field: 'surface', title: '表面', width: 150, locked: false },
    { field: 'standards', title: '规格', width: 150, locked: false },
    { field: 'width', title: '宽度', width: 150, locked: false },
    { field: 'length', title: '长度', width: 150, locked: false },
    { field: 'weight', title: '重量', width: 150, locked: false },
    { field: 'requirementQty', title: '需求数量', width: 150, locked: false },
    { field: 'demandTime', title: '需求日期', width: 150, locked: false },
    { field: 'grade', title: '等级', width: 150, locked: false },
    { field: 'remark', title: '备注', width: 150, locked: false },   
    { field: 'errorMessage', title: '错误信息', width: 150, locked: false },
  ];


  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.queryService.Import(tempData).subscribe(res => {
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
