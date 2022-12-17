import { Component, OnInit, ViewChild } from "@angular/core";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonImportService } from "app/modules/base_module/services/common-import.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { CustomerOrderReviewCoatingQueryService } from "../query.service";

@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  providers: [CustomerOrderReviewCoatingQueryService]
})
export class CustomerOrderReviewCoatingImportComponent implements OnInit {

  plantOptions = [];
  plantCodeList = [];
  options: any = {};
  
  impColumns = {
    columns: ['工厂', '存货编码', '存货名称', '宽度', '标签描述', '表面保护'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'stockCode', title: '存货编码', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'stockName', title: '存货名称', columnIndex: 2, constraint: { notNull: true, } },
      { field: 'width', title: '宽度', columnIndex: 3, constraint: { notNull: true, } },
      { field: 'labelDesc', title: '标签描述', columnIndex: 9, constraint: { notNull: false } },
      // { field: 'coatingDownCode', title: '底膜存货编码', columnIndex: 9, constraint: { notNull: false, } },
      { field: 'paper', title: '表面保护', columnIndex: 10, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'stockCode', title: '存货编码', width: 150, locked: false },
    { field: 'stockName', title: '存货名称', width: 150, locked: false },
    { field: 'width', title: '宽度', width: 150, locked: false },
    { field: 'labelDesc', title: '标签描述', width: 150, locked: false },
    // { field: 'coatingDownCode', title: '底膜存货编码', width: 150, locked: false },
    { field: 'paper', title: '表面保护', width: 150, locked: false },
    { field: 'attribute1', title: '错误信息', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    let errData = [];
    // [tempData, errData] = this.generateCode(tempData);
    this.queryService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        if (errData.length > 0) {
          this.excelexport.export(errData);
          this.msgSrv.info(this.appTranslationService.translate(`导入成功${tempData.length}条，导入失败${errData.length}条，请查看导出信息`));
        } else {
          this.msgSrv.success(this.appTranslationService.translate('导入成功'));
          this.modal.close(true);
        }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        this.excelexport.export(res.data);
        if(res.data.length < tempData.length) {
          this.modal.close(true);
        }
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    private queryService: CustomerOrderReviewCoatingQueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
    private commonImportService: CommonImportService,
  ) { }

  ngOnInit() {
    this.loadOptions();
    // 胶膜
    this.commonImportService.setSequence(this.impColumns, 'paper', this.options.paperOptions);
  }


  loadOptions() {
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        })
      });
      console.log(this.plantOptions);
      // 工厂
      this.commonImportService.setSequence(this.impColumns, 'plantCode', this.plantOptions);
      console.log(this.impColumns);
    });
  }

  close() {
    this.modal.destroy();
  }

  // generateCode(tempData) {
  //   const data = [];
  //   tempData.forEach(d => {
  //     data.push(Object.assign({}, d, {
  //       cusOrderState: '10'
  //     }))
  //   })
  //   return [data, []];
  // }

}
