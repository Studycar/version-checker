import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { SopLongTermItemManageService } from '../../../../modules/generated_module/services/soplongtermitem-manage-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-item-category-assign-import',
  templateUrl: './import.component.html',
})

export class SopLongTermItemImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '物料', '物料描述', '采购周期', '是否有效'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'itemCode', title: '物料', columnIndex: 2, constraint: { notNull: true } },
      { field: 'itemDescribe', title: '物料描述', columnIndex: 3, constraint: { notNull: false } },
      { field: 'leadTime', title: '采购周期', columnIndex: 4, constraint: { notNull: true } },
      { field: 'enableFlag', title: '是否有效', columnIndex: 5, constraint: { notNull: true, } },
      // { field: 'ROW_NUMBER', title: '行号', default: 1 }
    ],
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'itemCode', title: '物料', width: 150, locked: false },
    { field: 'itemDescribe', title: '物料描述', width: 300, locked: false },
    { field: 'leadTime', title: '采购周期', width: 150, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 150, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false },
  ];

  whetherOptions: any[] = [];
  expColumnsOptions: any[] = [{ field: 'enableFlag', options: this.whetherOptions }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.sopLongTermItemManageService.importData(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('导入成功'));
      } else {
        this.msgSrv.info(this.appTranslationService.translate(res.msg || '导入失败'));
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
    private sopLongTermItemManageService: SopLongTermItemManageService,
    private commonQueryService: CommonQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
    this.getWhetherOptions();
  }

  close() {
    this.modal.destroy();
  }

  getWhetherOptions() {
    this.commonQueryService.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element => {
        this.whetherOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }
}
