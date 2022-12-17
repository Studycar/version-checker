import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { SopMouldCapacityService } from '../../../../modules/generated_module/services/sopmouldcapacity-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-mould-capacity-import',
  templateUrl: './import.component.html',
  providers: [SopMouldCapacityService]
})

export class SopMouldCapacityImportComponent implements OnInit {

  impColumns = {
    columns: ['工厂', '模具', '月份', '开工天数', '开工时长'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'mouldCode', title: '模具', columnIndex: 2, constraint: { notNull: true } },
      { field: 'currentMonth', title: '月份', columnIndex: 3, constraint: { notNull: true } },
      { field: 'workDay', title: '开工天数', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'workHour', title: '开工时长', columnIndex: 5, constraint: { notNull: true, } },
    ],
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'mouldCode', title: '模具', width: 150, locked: false },
    { field: 'currentMonth', title: '月份', width: 150, locked: false },
    { field: 'workDay', title: '开工天数', width: 150, locked: false },
    { field: 'workHour', title: '开工时长', width: 150, locked: false },
    { field: 'failMessage', title: '错误提示', width: 450, locked: false },
  ];


  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.sopMouldCapacityService.importData(tempData).subscribe(res => {
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
    private sopMouldCapacityService: SopMouldCapacityService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {

  }

  close() {
    this.modal.destroy();
  }

}
