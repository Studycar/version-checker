import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from '../queryService.service';
import { formatDate } from '@angular/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-forecast-import',
  templateUrl: './import.component.html',
  providers: [QueryService],
})
export class ProductSellBalanceSopForecastImportComponent implements OnInit {

  needRefresh = false;
  outFileData: any[] = [];
  dateRange: any[] = [];
  dateFrom: any;
  dateTo: any;
  fileName = '';

  impColumns = { columns: [], paramMappings: [] };
  _impColumns = {
    columns: ['工厂', '订单号', '物料编码', '物料描述', '订单类型'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true } },
      { field: 'reqNumber', title: '订单号', columnIndex: 2, constraint: { notNull: true } },
      { field: 'itemCode', title: '物料编码', columnIndex: 3, constraint: { notNull: true } },
      { field: 'itemDesc', title: '物料描述', columnIndex: 4, constraint: { notNull: false } },
      { field: 'reqType', title: '订单类型', columnIndex: 5, constraint: { notNull: true } },
    ],
  };
  expData: any[] = [];
  expColumns = [];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    this.dateFrom = this.queryService.getMonthFirstDate(new Date()); // 当月第一天
    this.dateTo = this.queryService.addMonths(this.dateFrom, 5);
    // this.dateRange = [tf, tt];

    // 初始化导入模板，扩展列为6个月
    this.onDateRangeChange(this.dateRange);
  }

  onDateRangeChange(event: any) {
    if (this.dateTo < this.dateFrom) {
      this.dateTo = this.queryService.addMonths(this.dateFrom, 5);
    }
    this.dateRange = [this.dateFrom, this.dateTo];
    let tf = this.dateRange[0]; // 当月第一天
    const tt = this.dateRange[1];

    let loopNum = this._impColumns.columns.length;
    this.impColumns = { columns: [], paramMappings: [] };
    this._impColumns.columns.forEach(p => this.impColumns.columns.push(p));
    this._impColumns.paramMappings.forEach(p => this.impColumns.paramMappings.push(p));
    while (tf <= tt) {
      loopNum = loopNum + 1;

      // 加载导入项
      // const year: number = tf.getFullYear();
      // const month: any = tf.getMonth() + 1 < 10 ? '0' + (tf.getMonth() + 1) : tf.getMonth() + 1;
      // const tfStr = this.queryService.formatDate(tf);
      const tfStr = formatDate(tf, 'yyyy-MM', 'zh-Hans');
      this.impColumns.columns.push(tfStr);
      this.impColumns.paramMappings.push({ field: tfStr, title: tfStr, columnIndex: loopNum, constraint: { notNull: false } });

      tf = this.queryService.addMonths(tf, 1);
    }
  }

  downMold() {
    if (this.dateRange === null || this.dateRange.length < 2) {
      this.msgSrv.error(this.appTranslationService.translate('请选择月份'));
      return;
    }
    if (this.dateTo < this.dateFrom) {
      this.msgSrv.error(this.appTranslationService.translate('开始月份不能大于结束月份'));
      return;
    }
    this.doExport(false, this.outFileData);
  }

  doExport(isErrorOut: boolean, data: any) {
    this.expColumns = [];
    this.impColumns.paramMappings.forEach(p => {
      this.expColumns.push({ field: p.field, title: p.title, width: 100, locked: false, notNull: p.constraint.notNull });
    });
    if (isErrorOut) {
      this.fileName = 'Error';
      this.expColumns.push({ field: 'errorMsg', title: '错误信息', width: 300, locked: false });
    } else {
      this.fileName = '需求汇总导入模板';
    }
    setTimeout(() => {
      this.excelexport.export(data);
    }, 100);
  }

  public excelDataProcess(tempData: any[]) {
    const inputData = {
      dtInput: tempData,
      startDate: formatDate(this.dateRange[0], 'yyyy-MM', 'zh-Hans'),
      endDate: formatDate(this.dateRange[1], 'yyyy-MM', 'zh-Hans'),
    };
    this.queryService.importSopForecast(inputData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.data.strMsg));

        // this.modal.destroy(true);
        this.needRefresh = res.data.success;
        this.close();
      } else {
        this.needRefresh = false;
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }

      if (res.data.dataResult != null && res.data.dataResult.length > 0) {
        this.doExport(true, res.data.dataResult);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  disabledDateFrom = (current: Date): boolean => {
    // Can not select days before today and today
    const dateMonths = formatDate(new Date(), 'yyyy-MM-01', 'zh-Hans');
    return current <= new Date(dateMonths);
  }

  disabledDateTo = (current: Date): boolean => {
    // Can not select days before today and today
    return current <= this.dateFrom;
  }
}
