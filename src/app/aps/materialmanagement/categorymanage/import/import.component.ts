import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { MaterialmanagementCategorymanageService } from 'app/modules/generated_module/services/materialmanagement-categorymanage-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-item-category-assign-import',
  templateUrl: './import.component.html',
})
export class CategoryManagerImportComponent implements OnInit {

  impColumns = {
    columns: ['类别集', '类别集描述', '类别', '参数描述', '优先级', '段数', '段数一', '段数二', '段数三', '段数四', '段数五', '段数六', '段数七', '段数八', '段数九', '段数十', '是否有效'],
    paramMappings: [
      { field: 'categorySetCode', title: '类别集', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'categorySetDesc', title: '类别集描述', columnIndex: 2, constraint: { notNull: false } },
      { field: 'categoryCode', title: '类别', columnIndex: 3, constraint: { notNull: true } },
      { field: 'descriptions', title: '参数描述', columnIndex: 4, constraint: { notNull: false, } },
      { field: 'priority', title: '优先级', columnIndex: 5, constraint: { notNull: false, } },
      { field: 'segmentsQty', title: '段数', columnIndex: 6, constraint: { notNull: false, } },
      { field: 'segment1', title: '段数一', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'segment2', title: '段数二', columnIndex: 8, constraint: { notNull: false, } },
      { field: 'segment3', title: '段数三', columnIndex: 9, constraint: { notNull: false, } },
      { field: 'segment4', title: '段数四', columnIndex: 10, constraint: { notNull: false, } },
      { field: 'segment5', title: '段数五', columnIndex: 11, constraint: { notNull: false, } },
      { field: 'segment6', title: '段数六', columnIndex: 12, constraint: { notNull: false, } },
      { field: 'segment7', title: '段数七', columnIndex: 13, constraint: { notNull: false, } },
      { field: 'segment8', title: '段数八', columnIndex: 14, constraint: { notNull: false, } },
      { field: 'segment9', title: '段数九', columnIndex: 15, constraint: { notNull: false, } },
      { field: 'segment10', title: '段数十', columnIndex: 16, constraint: { notNull: false, } },
      { field: 'enableFlag', title: '是否有效', columnIndex: 17, constraint: { notNull: true, } },
      // { field: 'ROW_NUMBER', title: '行号', default: 1 }
    ],
  };

  expData: any[] = [];
  expColumns = [
    { field: 'categorySetCode', title: '类别集', width: 150, locked: false },
    { field: 'categorySetDesc', title: '类别集描述', width: 150, locked: false },
    { field: 'categoryCode', title: '类别', width: 150, locked: false },
    { field: 'descriptions', title: '参数描述', width: 150, locked: false },
    { field: 'priority', title: '优先级', width: 300, locked: false },
    { field: 'segmentsQty', title: '段数', width: 150, locked: false },
    { field: 'segment1', title: '段数一', width: 150, locked: false },
    { field: 'segment2', title: '段数二', width: 150, locked: false },
    { field: 'segment3', title: '段数三', width: 150, locked: false },
    { field: 'segment4', title: '段数四', width: 150, locked: false },
    { field: 'segment5', title: '段数五', width: 150, locked: false },
    { field: 'segment6', title: '段数六', width: 150, locked: false },
    { field: 'segment7', title: '段数七', width: 150, locked: false },
    { field: 'segment8', title: '段数八', width: 150, locked: false },
    { field: 'segment9', title: '段数九', width: 150, locked: false },
    { field: 'segment10', title: '段数十', width: 150, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 150, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false },
  ];

  whetherOptions: any[] = [];
  expColumnsOptions: any[] = [{ field: 'enableFlag', options: this.whetherOptions }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    tempData.forEach(x => {
      if (x.segmentsQty === null || x.segmentsQty === '')
        x.segmentsQty = 1;
    });
    this.categoryService.importData(tempData).subscribe(res => {
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
    private categoryService: MaterialmanagementCategorymanageService,
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
