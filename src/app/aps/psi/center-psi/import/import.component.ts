import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../query.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

@Component({
  selector: 'center-psi-import',
  templateUrl: './import.component.html',
  providers: [QueryService]
})
export class CenterPsiImportComponent implements OnInit {

  impColumns = {
    columns: ['序号', '事业部', '营销中心编码', '营销中心', '商品编码', '商品名称', '营销大类', '营销小类', '中心提报当月需求', '已送审订单量', '当月分销规划', '已达成'],
    paramMappings: [
      { field: 'id', title: '序号', columnIndex: 0, constraint: { notNull: true, } },
      { field: 'businessUnit', title: '事业部', columnIndex: 1, constraint: { notNull: false } },
      { field: 'areaCode', title: '营销中心编码', columnIndex: 2, constraint: { notNull: false } },
      { field: 'areaName', title: '营销中心', columnIndex: 3, constraint: { notNull: false } },
      { field: 'itemCode', title: '商品编码', columnIndex: 4, constraint: { notNull: false } },
      { field: 'itemName', title: '商品名称', columnIndex: 5, constraint: { notNull: false } },
      { field: 'salesCategoryBig', title: '营销大类', columnIndex: 6, constraint: { notNull: false } },
      { field: 'salesCategorySub', title: '营销小类', columnIndex: 7, constraint: { notNull: false } },
      { field: 'monthForecastQty', title: '中心提报当月需求', columnIndex: 8, constraint: { notNull: true } },
      { field: 'applicationQty', title: '已送审订单量', columnIndex: 9, constraint: { notNull: false } },
      { field: 'monthPlanningQty', title: '当月分销规划', columnIndex: 10, constraint: { notNull: false } },
      { field: 'reachQty', title: '已达成', columnIndex: 11, constraint: { notNull: true } },
    ],
  };
  expData: any[] = [];
  expColumns = [
    { field: 'id', title: '序号', width: 120, locked: false },
    { field: 'businessUnit', title: '事业部', width: 120, locked: false },
    { field: 'areaCode', title: '营销中心编码', width: 120, locked: false },
    { field: 'areaName', title: '营销中心', width: 120, locked: false },
    { field: 'itemCode', title: '商品编码', width: 120, locked: false },
    { field: 'itemName', title: '商品名称', width: 120, locked: false },
    { field: 'salesCategoryBig', title: '营销大类', width: 120, locked: false },
    { field: 'salesCategorySub', title: '营销小类', width: 120, locked: false },
    { field: 'monthForecastQty', title: '中心提报当月需求', width: 120, locked: false },
    { field: 'applicationQty', title: '提交订单量', width: 120, locked: false },
    { field: 'monthPlanningQty', title: '当月分销规划', width: 120, locked: false },
    { field: 'reachQty', title: '已达成', width: 120, locked: false },
  ];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.queryService.importData(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '导入成功'));
        if (res.extra != null && res.extra.length > 0)
          this.excelexport.export(res.extra);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '导入失败'));
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
