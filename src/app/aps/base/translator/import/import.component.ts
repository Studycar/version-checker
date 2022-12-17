import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { BaseTranslatorEditService } from '../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-translator-import',
  templateUrl: './import.component.html',
  providers: [BaseTranslatorEditService],
})
export class TranslatorImportComponent implements OnInit {

  impColumns = {
    columns: ['语言', '原文', '译文'],
    paramMappings: [
      { field: 'languageCode', title: '语言', columnIndex: 2, constraint: { notNull: true } },
      { field: 'devLanguageRd', title: '原文', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'translatedText', title: '译文', columnIndex: 2, constraint: { notNull: false } }
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'languageCode', title: '语言', width: 150, locked: false },
    { field: 'devLanguageRd', title: '原文', width: 150, locked: false },
    { field: 'translatedText', title: '译文', width: 150, locked: false }
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {

    this.baseTranslatorEditService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        /*if (res.data != null && res.data.length > 0){
            this.excelexport.export(res.data);
        }*/
         this.modal.close();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public baseTranslatorEditService: BaseTranslatorEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
