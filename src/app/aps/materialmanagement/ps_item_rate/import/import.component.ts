import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app//modules/base_module/components/custom-excel-export.component';
import { PsItemRateService } from '../queryService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-item-rate-import',
  templateUrl: './import.component.html',
  providers: [PsItemRateService],
})
export class PsItemRateImportComponent implements OnInit {

  impColumns = {
    // columns: ['工厂', '计划组', '资源', '资源类型', '产品编码', '产品名称', '钢种', '产品规格', '原料编码', '原料名称', '原料表面', '原料规格', '原料宽', '原料长', '速率类型', '速率', '优先级'],
    columns: ['工厂', '计划组', '资源', '资源类型', '产品编码', '产品名称', '钢种', '产品规格', '速率类型', '速率', '优先级'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 10, constraint: { notNull: true, } },
      { field: 'scheduleGroupCode', title: '计划组', columnIndex: 20, constraint: { notNull: true } },
      { field: 'resourceCode', title: '资源', columnIndex: 30, constraint: { notNull: true, } },
      { field: 'resourceType', title: '资源类型', columnIndex: 35, constraint: { notNull: false, } },
      { field: 'processCode', title: '工序', columnIndex: 40, constraint: { notNull: true, } },
      { field: 'stockCode', title: '产品编码', columnIndex: 50, constraint: { notNull: true, } },
      { field: 'stockName', title: '产品名称', columnIndex: 60, constraint: { notNull: false, } },
      { field: 'steelType', title: '钢种', columnIndex: 70, constraint: { notNull: true, } },
      { field: 'surface', title: '表面', columnIndex: 72, constraint: { notNull: true, } },
      { field: 'standards', title: '产品规格', columnIndex: 75, constraint: { notNull: true, isNumber: true, precision: 2 } },
      { field: 'width', title: '产品宽', columnIndex: 77, constraint: { notNull: true, isPositiveNumber: true } },
      { field: 'length', title: '产品长', columnIndex: 79, constraint: { isNotNegativeNumber: true } },
      // { field: 'rawStockCode', title: '原料编码', columnIndex: 80, constraint: { notNull: true, } },
      // { field: 'rawStockName', title: '原料名称', columnIndex: 90, constraint: { notNull: false, } },
      // { field: 'rawSurface', title: '原料表面', columnIndex: 95, constraint: { notNull: true, } },
      // { field: 'rawStandards', title: '原料规格', columnIndex: 100, constraint: { notNull: true, isNumber: true, precision: 2 } },
      // { field: 'rawWidth', title: '原料宽', columnIndex: 105, constraint: { notNull: true, isPositiveNumber: true } },
      // { field: 'rawLength', title: '原料长', columnIndex: 107, constraint: { isNotNegativeNumber: true } },
      { field: 'rateType', title: '速率类型', columnIndex: 110, constraint: { notNull: true, } },
      { field: 'rate', title: '速率', columnIndex: 120, constraint: { notNull: true, } },
      { field: 'priority', title: '优先级', columnIndex: 130, constraint: { notNull: true, isPositiveInteger: true } },

    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: true  },
    { field: 'scheduleGroupCode', title: '计划组', width: 150, locked: true  },
    { field: 'resourceCode', title: '资源', width: 150, locked: true  },
    { field: 'resourceType', title: '资源类型', width: 150, locked: false  },
    { field: 'processCode', title: '工序', width: 150, locked: false  },
    { field: 'stockCode', title: '产品编码', width: 150, locked: false  },
    { field: 'stockName', title: '产品名称', width: 150, locked: false },
    { field: 'steelType', title: '钢种', width: 150, locked: false  },
    { field: 'surface', title: '表面', width: 150, locked: false  },
    { field: 'standards', title: '产品规格', width: 150, locked: false  },
    { field: 'width', title: '产品宽', width: 150, locked: false  },
    { field: 'length', title: '产品长', width: 150, locked: false  },
    // { field: 'rawStockCode', title: '原料编码', width: 150, locked: false  },
    // { field: 'rawStockName', title: '原料名称', width: 150, locked: false },
    // { field: 'rawSurface', title: '原料表面', width: 150, locked: false },
    // { field: 'rawStandards', title: '原料规格', width: 150, locked: false  },
    // { field: 'rawWidth', title: '原料宽', width: 150, locked: false  },
    // { field: 'rawLength', title: '原料长', width: 150, locked: false  },
    { field: 'rateType', title: '速率类型', width: 150, locked: false  },
    { field: 'rate', title: '速率', width: 150, locked: false  },
    { field: 'priority', title: '优先级', width: 150, locked: false  },
    { field: 'errorMessage', title: '错误信息', width: 150, locked: false  },
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {

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
    public queryService: PsItemRateService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
