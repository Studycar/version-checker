import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { SopResourceCapacityManageService } from '../../../../modules/generated_module/services/sopresourcecapacity-manage-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-item-category-assign-import',
  templateUrl: './import.component.html',
})

export class SopResourceCapacityImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '计划组', '线体', '月份', '开工天数','开工时长'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'scheduleGroupCode', title: '计划组', columnIndex: 2, constraint: { notNull: true } },
      { field: 'resourceCode', title: '线体', columnIndex: 3, constraint: { notNull: true } },
      { field: 'currentMonth', title: '月份', columnIndex: 4, constraint: { notNull: true } },
      { field: 'workDay', title: '开工天数', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'workHour', title: '开工时长', columnIndex: 6, constraint: { notNull: true, } },
      // { field: 'ROW_NUMBER', title: '行号', default: 1 }
    ],
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'scheduleGroupCode', title: '计划组', width: 150, locked: false },
    { field: 'resourceCode', title: '线体', width: 150, locked: false },
    { field: 'currentMonth', title: '月份', width: 150, locked: false },
    { field: 'workDay', title: '开工天数', width: 150, locked: false },
    { field: 'workHour', title: '开工时长', width: 150, locked: false },
    { field: 'failMessage', title: '错误提示', width: 450, locked: false },
  ];


  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.sopResourceCapacityManageService.importData(tempData).subscribe(res => {
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
    private sopResourceCapacityManageService: SopResourceCapacityManageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {

  }

  close() {
    this.modal.destroy();
  }

}
