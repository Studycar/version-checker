import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { LoadCapacityRuleService } from '../load-capacity-rule.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'load-capacity-rule-import',
  templateUrl: './import.component.html',
  providers: [LoadCapacityRuleService],
})
export class LoadCapacityRuleImportComponent implements OnInit {
  impColumns = {
    columns: ['工厂', '装运点', '时段号', 'A类能力吨位', 'B类能力吨位', 'C类能力吨位', '生效日期', '失效日期'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true } },
      { field: 'loadLocation', title: '装运点', columnIndex: 2, constraint: { notNull: true } },
      { field: 'internal', title: '时段号', columnIndex: 3, constraint: { notNull: true } },
      { field: 'tonnageForA', title: 'A类能力吨位', columnIndex: 4, },
      { field: 'tonnageForB', title: 'B类能力吨位', columnIndex: 5, },
      { field: 'tonnageForC', title: 'C类能力吨位', columnIndex: 6, },
      { field: 'enableDate', title: '生效日期', columnIndex: 7, constraint: { notNull: true } },
      { field: 'disableDate', title: '失效日期', columnIndex: 8, }
    ],
  };

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'loadLocation', title: '装运点', width: 150, locked: false },
    { field: 'internal', title: '时段号', width: 200, locked: false },
    { field: 'tonnageForA', title: 'A类能力吨位', width: 150, locked: false },
    { field: 'tonnageForB', title: 'B类能力吨位', width: 150, locked: false },
    { field: 'tonnageForC', title: 'C类能力吨位', width: 200, locked: false },
    { field: 'enableDate', title: '生效日期', width: 200, locked: false },
    { field: 'disableDate', title: '失效日期', width: 200, locked: false },
    { field: 'errMsg', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public loadCapacityRuleService: LoadCapacityRuleService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) {

  }

  ngOnInit(): void {
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {

    console.log('excelDataProcess: ' + tempData);

    tempData.forEach(obj => {
      obj.enableDate = obj.enableDate.replace(/\//g, '-') + ' 00:00:00';
      obj.disableDate = obj.disableDate != '' ? obj.disableDate.replace(/\//g, '-') + ' 00:00:00' : '';
    });
    this.loadCapacityRuleService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        if (res.data != null && res.data.length > 0)
          this.excelexport.export(res.data);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
