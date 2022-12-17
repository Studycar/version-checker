import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { PsBurdeningStandardService } from '../queryService';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-Burdening-Standard-import-plates',
  templateUrl: './importPlates.component.html',
  providers: [PsBurdeningStandardService],
})
export class PsBurdeningStandardImportPlatesComponent implements OnInit {
  impColumns = {
    columns: ['工厂', '工序', '产品编码', '产品描述', '钢种', '表面', '产品规格', '产品宽', '产品长',
      '原料编码', '原料描述', '原料表面', '原料优先级', '原料规格', '原料宽', '原料长', '规格优先级', '表面等级', '产地'],

    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'processCode', title: '工序', columnIndex: 2, constraint: { notNull: true } },
      { field: 'stockCode', title: '产品编码', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'stockName', title: '产品描述', columnIndex: 4, constraint: { notNull: false, } },
      { field: 'steelType', title: '钢种', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'surface', title: '表面', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'standards', title: '产品规格', columnIndex: 7, constraint: { notNull: true, } },
      { field: 'standardsWidth', title: '产品宽', columnIndex: 8, constraint: { notNull: true, } },
      { field: 'standardsLength', title: '产品长', columnIndex: 9, constraint: { notNull: true, } },
      { field: 'rawStockCode', title: '原料编码', columnIndex: 10, constraint: { notNull: true, } },
      { field: 'rawStockName', title: '原料描述', columnIndex: 11, constraint: { notNull: false, } },
      { field: 'rawSurface', title: '原料表面', columnIndex: 12, constraint: { notNull: true, } },
      { field: 'rawPriority', title: '原料优先级', columnIndex: 13, constraint: { notNull: true, } },
      { field: 'rawStandards', title: '原料规格', columnIndex: 14, constraint: { notNull: true, } },
      { field: 'width', title: '原料宽', columnIndex: 15, constraint: { notNull: true, } },
      { field: 'length', title: '原料长', columnIndex: 16, constraint: { notNull: true, } },
      { field: 'standardsSortStr', title: '规格优先级', columnIndex: 17, constraint: { notNull: true, } },
      { field: 'surfaceGradeStr', title: '表面等级', columnIndex: 18, constraint: { notNull: true, } },
      { field: 'productionPlace', title: '产地', columnIndex: 19, constraint: { notNull: false, } },

    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'processCode', title: '工序', width: 150, locked: false },
    { field: 'stockCode', title: '产品编码', width: 150, locked: false },
    { field: 'stockName', title: '产品描述', width: 150, locked: false },
    { field: 'steelType', title: '钢种', width: 150, locked: false },
    { field: 'surface', title: '表面', width: 150, locked: false },
    { field: 'standards', title: '产品规格', width: 150, locked: false },
    { field: 'standardsWidth', title: '产品宽', width: 150, locked: false },
    { field: 'standardsLength', title: '产品长', width: 150, locked: false },
    { field: 'rawStockCode', title: '原料编码', width: 150, locked: false },
    { field: 'rawStockName', title: '原料描述', width: 150, locked: false },
    { field: 'rawSurface', title: '原料表面', width: 150, locked: false },
    { field: 'rawPriority', title: '原料优先级', width: 150, locked: false },
    { field: 'rawStandards', title: '原料规格', width: 150, locked: false },
    { field: 'width', title: '产品宽', width: 150, locked: false },
    { field: 'length', title: '产品长', width: 150, locked: false },
    { field: 'standardsSortStr', title: '规格优先级', width: 150, locked: false },
    { field: 'surfaceGradeStr', title: '表面等级', width: 150, locked: false },
    { field: 'productionPlace', title: '产地', width: 150, locked: false },
    { field: 'errorMessage', title: '错误信息', width: 150, locked: false },
  ];


  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.queryService.importDataPlates(tempData).subscribe(res => {
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
    public queryService: PsBurdeningStandardService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
