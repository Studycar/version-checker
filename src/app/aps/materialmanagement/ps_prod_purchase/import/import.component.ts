import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { PsProdPurchaseService } from '../queryService';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-prod-purchase-import',
  templateUrl: './import.component.html',
  providers: [PsProdPurchaseService],
})
export class PsProdPurchaseImportComponent implements OnInit {


  impColumns = {
    columns: ['工厂编码', '产品类型', '产品编码', '产品描述', '钢种', '表面', '产品规格最小', '产品规格最大', '产品宽', '产品长',
      '原料编码', '原料描述', '原料表面', '是否厚度与产品一致', '原料规格', '原料宽', '原料长', '表面等级', '产地'],

    paramMappings: [
      { field: 'plantCode', title: '工厂编码', columnIndex: 10, constraint: { notNull: true, } },
      { field: 'prodTypeStr', title: '产品类型', columnIndex: 20, constraint: { notNull: true } },
      { field: 'stockCode', title: '产品编码', columnIndex: 30, constraint: { notNull: true, } },
      { field: 'stockName', title: '产品描述', columnIndex: 40, constraint: { notNull: false, } },
      { field: 'steelType', title: '钢种', columnIndex: 50, constraint: { notNull: true, } },
      { field: 'surface', title: '表面', columnIndex: 60, constraint: { notNull: true, } },
      { field: 'standardsLowStr', title: '产品规格最小', columnIndex: 70, constraint: { notNull: true, } },
      { field: 'standardsHighStr', title: '产品规格最大', columnIndex: 75, constraint: { notNull: true, } },
      { field: 'standardsWidthStr', title: '产品宽', columnIndex: 80, constraint: { notNull: true, } },
      { field: 'standardsLengthStr', title: '产品长', columnIndex: 85, constraint: { notNull: false, } },
      { field: 'rawStockCode', title: '原料编码', columnIndex: 90, constraint: { notNull: true, } },
      { field: 'rawStockName', title: '原料描述', columnIndex: 100, constraint: { notNull: false, } },
      { field: 'rawSurface', title: '原料表面', columnIndex: 110, constraint: { notNull: true, } },
      { field: 'standardsSameFlagStr', title: '是否厚度与产品一致', columnIndex: 110, constraint: { notNull: true, } },
      { field: 'rawStandardsStr', title: '原料规格', columnIndex: 130, constraint: { notNull: false, } },
      { field: 'widthStr', title: '原料宽', columnIndex: 140, constraint: { notNull: true, } },
      { field: 'lengthStr', title: '原料长', columnIndex: 145, constraint: { notNull: false, } },
      { field: 'surfaceGradeStr', title: '表面等级', columnIndex: 160, constraint: { notNull: true, } },
      { field: 'productionPlace', title: '产地', columnIndex: 170, constraint: { notNull: false, } },

    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂编码', width: 150, locked: false },
    { field: 'prodTypeStr', title: '产品类型', width: 150, locked: false },
    { field: 'stockCode', title: '产品编码', width: 150, locked: false },
    { field: 'stockName', title: '产品描述', width: 150, locked: false },
    { field: 'steelType', title: '钢种', width: 150, locked: false },
    { field: 'surface', title: '表面', width: 150, locked: false },
    { field: 'standardsLowStr', title: '产品规格最小', width: 150, locked: false },
    { field: 'standardsHighStr', title: '产品规格最大', width: 150, locked: false },
    { field: 'standardsWidthStr', title: '产品宽', width: 150, locked: false },
    { field: 'standardsLengthStr', title: '产品长', width: 150, locked: false },
    { field: 'rawStockCode', title: '原料编码', width: 150, locked: false },
    { field: 'rawStockName', title: '原料描述', width: 150, locked: false },
    { field: 'rawSurface', title: '原料表面', width: 150, locked: false },
    { field: 'standardsSameFlagStr', title: '是否厚度与产品一致', width: 200, locked: false },
    { field: 'rawStandardsStr', title: '原料规格', width: 150, locked: false },
    { field: 'widthStr', title: '原料宽', width: 150, locked: false },
    { field: 'lengthStr', title: '原料长', width: 150, locked: false },
    { field: 'surfaceGradeStr', title: '表面等级', width: 150, locked: false },
    { field: 'productionPlace', title: '产地', width: 150, locked: false },
    { field: 'errorMessage', title: '错误信息', width: 150, locked: false },
  ];


  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    console.log('---------tempData---', tempData);
    this.queryService.importData(tempData).subscribe(res => {
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
    public queryService: PsProdPurchaseService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
