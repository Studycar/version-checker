import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { ItemJointHDEditService } from '../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'item-joint-hd-import',
  templateUrl: './import.component.html',
  providers: [ItemJointHDEditService],
})
export class ItemJointHDImportComponent implements OnInit {
  impColumns = {
    columns: ['主产品排产工厂', '主产品排产资源', '主产品物料', '联产品排产工厂', '联产品排产资源', '联产品物料', '数量转换关系', '开始时间间隔', '合并数量上限', '舍入值'],
    paramMappings: [
      { field: 'PLANT_CODE_MASTER', title: '主产品排产工厂', columnIndex: 1, constraint: { notNull: true } },
      { field: 'RESOURCE_CODE_MASTER', title: '主产品排产资源', columnIndex: 2, constraint: { notNull: true } },
      { field: 'ITEM_ID_MASTER', title: '主产品物料', columnIndex: 3, constraint: { notNull: true } },
      { field: 'PLANT_CODE_JOINT', title: '联产品排产工厂', columnIndex: 4, constraint: { notNull: true } },
      { field: 'RESOURCE_CODE_JOINT', title: '联产品排产资源', columnIndex: 5, constraint: { notNull: true } },
      { field: 'ITEM_ID_JOINT', title: '联产品物料', columnIndex: 6, constraint: { notNull: true } },
      { field: 'QTY_TRANSFER', title: '数量转换关系', columnIndex: 7, constraint: { notNull: true } },
      { field: 'TIME_INTERVAL', title: '开始时间间隔', columnIndex: 8, constraint: { notNull: true } },
      { field: 'SPLIT_QTY', title: '合并数量上限', columnIndex: 9, constraint: { notNull: true } },
      { field: 'ROUNDING_VALUE', title: '舍入值', columnIndex: 10, constraint: { notNull: true } }
    ]
  };

  expColumns = [
    { field: 'PLANT_CODE_MASTER', title: '主产品排产工厂', width: 150, locked: false },
    { field: 'RESOURCE_CODE_MASTER', title: '主产品排产资源', width: 150, locked: false },
    { field: 'ITEM_ID_MASTER', title: '主产品物料', width: 200, locked: false },
    { field: 'PLANT_CODE_JOINT', title: '联产品排产工厂', width: 150, locked: false },
    { field: 'RESOURCE_CODE_JOINT', title: '联产品排产资源', width: 150, locked: false },
    { field: 'ITEM_ID_JOINT', title: '联产品物料', width: 200, locked: false },
    { field: 'QTY_TRANSFER', title: '数量转换关系', width: 200, locked: false },
    { field: 'TIME_INTERVAL', title: '开始时间间隔', width: 200, locked: false },
    { field: 'SPLIT_QTY', title: '合并数量上限', width: 200, locked: false },
    { field: 'ROUNDING_VALUE', title: '舍入值', width: 200, locked: false },
    { field: 'ATTRIBUTE1', title: '错误信息', width: 300, locked: false }
  ];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public itemJointHDEditService: ItemJointHDEditService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    console.log(tempData, 'tempData');
    this.itemJointHDEditService.Import(tempData).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success(this.appTranslationService.translate(res.Message));
        if (res.Extra != null && res.Extra.length > 0)
          this.excelexport.export(res.Extra);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
