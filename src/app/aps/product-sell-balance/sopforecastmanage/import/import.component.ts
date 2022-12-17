/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @LastEditors: Zwh
 * @Note: ...
 * @Date: 2019-04-17 17:04:23
 * @LastEditTime: 2019-09-12 11:36:46
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../queryService';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { SopForeastManageService } from 'app/modules/generated_module/services/sopforecastmanage-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-item-category-assign-import',
  templateUrl: './import.component.html',
  providers: [QueryService]
})
export class ForecastManageImportComponent implements OnInit {

  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    padding: '0px 130px'
  };

  isOk = true;

  radioValue: any = '';
  fileName = 'Error';
  impColumns;

  // expData: any[] = [];
  expColumns = [
    { field: 'businessUnitCode', title: '事业部', width: 150, locked: false },
    { field: 'salesType', title: '内外销', width: 150, locked: false },
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'salesCatgoryBig', title: '产品大类', width: 150, locked: false },
    { field: 'salesCatgorySub', title: '产品小类', width: 300, locked: false },
    { field: 'itemCode', title: '物料编码', width: 150, locked: false },
    { field: 'descriptionsCn', title: '物料描述', width: 150, locked: false },
    { field: 'salesRegion', title: '业务大区', width: 150, locked: false },
    { field: 'salesArea', title: '业务区域', width: 300, locked: false },
    { field: 'customerName', title: '客户', width: 300, locked: false },
    { field: 'forecastType', title: '预测类型', width: 300, locked: false },
    { field: 'forecastDate', title: '原始日期', width: 300, locked: false },
    { field: 'netForecastDate', title: '净预测日期', width: 300, locked: false },
    { field: 'originalQty', title: '预测数量', width: 300, locked: false },
    { field: 'netQty', title: '净预测数量', width: 300, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false }
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    tempData.forEach(item => {
      item.forecastDate = item.forecastDate ? new Date(item.forecastDate) : null;
      item.netForecastDate = item.netForecastDate ? new Date(item.netForecastDate) : null;
      item.originalQty = Number(item.originalQty);
      item.netQty = Number(item.netQty);
    });
    this.commonQueryService.Import(tempData, this.flag).subscribe(res => {
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
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private querydata: SopForeastManageService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }

  flag; // true 修改导入 false 删除导入
  singleSelectChange(value: any) {
    if (value === 'A') {
      this.isOk = false;
      this.flag = true;
      this.impColumns = {
        columns: ['事业部', '内外销', '工厂', '产品大类', '产品小类', '物料编码', '物料描述', '业务大区', '业务区域', '客户', '预测类型', '原始日期', '净预测日期', '预测数量', '净预测数量'],
        paramMappings: [
          { field: 'id', title: 'id', columnIndex: 1, constraint: { notNull: false, } },
          { field: 'businessUnitCode', title: '事业部', columnIndex: 2, constraint: { notNull: true, } },
          { field: 'salesType', title: '内外销', columnIndex: 3, constraint: { notNull: true } },
          { field: 'plantCode', title: '工厂', columnIndex: 4, constraint: { notNull: true } },
          { field: 'salesCatgoryBig', title: '产品大类', columnIndex: 5, constraint: { notNull: false, } },
          { field: 'salesCatgorySub', title: '产品小类', columnIndex: 6, constraint: { notNull: false, } },
          { field: 'itemCode', title: '物料编码', columnIndex: 7, constraint: { notNull: false, } },
          { field: 'descriptionsCn', title: '物料描述', columnIndex: 8, constraint: { notNull: false, } },
          { field: 'salesRegion', title: '业务大区', columnIndex: 9, constraint: { notNull: false, } },
          { field: 'salesArea', title: '业务区域', columnIndex: 10, constraint: { notNull: false, } },
          { field: 'customerName', title: '客户', columnIndex: 11, constraint: { notNull: false, } },
          { field: 'forecastType', title: '预测类型', columnIndex: 12, constraint: { notNull: true, } },
          { field: 'forecastDate', title: '原始日期', columnIndex: 13, constraint: { notNull: true, } },
          { field: 'netForecastDate', title: '净预测日期', columnIndex: 14, constraint: { notNull: false, } },
          { field: 'originalQty', title: '预测数量', columnIndex: 15, constraint: { notNull: true, } },
          { field: 'netQty', title: '净预测数量', columnIndex: 16, constraint: { notNull: true, } },
          { field: 'rowNumber', title: '行号', default: 1 }
        ],
      };
    } if (value === 'B') {
      this.isOk = false;
      this.flag = false;
      this.impColumns = {
        columns: ['事业部', '内外销', '工厂', '产品大类', '产品小类', '物料编码', '物料描述', '业务大区', '业务区域', '客户', '预测类型', '原始日期', '净预测日期', '预测数量', '净预测数量'],
        paramMappings: [
          { field: 'businessUnitCode', title: '事业部', columnIndex: 1, constraint: { notNull: true, } },
          { field: 'salesType', title: '内外销', columnIndex: 2, constraint: { notNull: true } },
          { field: 'plantCode', title: '工厂', columnIndex: 3, constraint: { notNull: true } },
          { field: 'salesCatgoryBig', title: '产品大类', columnIndex: 4, constraint: { notNull: false, } },
          { field: 'salesCatgorySub', title: '产品小类', columnIndex: 5, constraint: { notNull: false, } },
          { field: 'itemCode', title: '物料编码', columnIndex: 6, constraint: { notNull: false, } },
          { field: 'descriptionsCn', title: '物料描述', columnIndex: 7, constraint: { notNull: false, } },
          { field: 'salesRegion', title: '业务大区', columnIndex: 8, constraint: { notNull: false, } },
          { field: 'salesArea', title: '业务区域', columnIndex: 9, constraint: { notNull: false, } },
          { field: 'customerName', title: '客户', columnIndex: 10, constraint: { notNull: false, } },
          { field: 'forecastType', title: '预测类型', columnIndex: 11, constraint: { notNull: true, } },
          { field: 'forecastDate', title: '原始日期', columnIndex: 12, constraint: { notNull: true, } },
          { field: 'netForecastDate', title: '净预测日期', columnIndex: 13, constraint: { notNull: false, } },
          { field: 'originalQty', title: '预测数量', columnIndex: 14, constraint: { notNull: true, } },
          { field: 'netQty', title: '净预测数量', columnIndex: 15, constraint: { notNull: true, } },
          { field: 'rowNumber', title: '行号', default: 1 }
        ],
      };
    }
  }

  httpExportAction = {
    url: this.querydata.url,
    method: 'GET'
  };
  i: any;

  public downLoad() {
    if (this.flag === true && this.radioValue !== '') {
      this.expColumns = [
        { field: 'id', title: 'id', width: 150, locked: false },
        { field: 'businessUnitCode', title: '事业部', width: 150, locked: false },
        { field: 'salesType', title: '内外销', width: 150, locked: false },
        { field: 'plantCode', title: '工厂', width: 150, locked: false },
        { field: 'salesCatgoryBig', title: '产品大类', width: 150, locked: false },
        { field: 'salesCatgorySub', title: '产品小类', width: 300, locked: false },
        { field: 'itemCode', title: '物料编码', width: 150, locked: false },
        { field: 'descriptionsCn', title: '物料描述', width: 150, locked: false },
        { field: 'salesRegion', title: '业务大区', width: 150, locked: false },
        { field: 'salesArea', title: '业务区域', width: 150, locked: false },
        { field: 'customerName', title: '客户', width: 150, locked: false },
        { field: 'forecastType', title: '预测类型', width: 150, locked: false },
        { field: 'forecastDate', title: '原始日期', width: 150, locked: false },
        { field: 'netForecastDate', title: '净预测日期', width: 150, locked: false },
        { field: 'originalQty', title: '预测数量', width: 150, locked: false },
        { field: 'netQty', title: '净预测数量', width: 150, locked: false }
      ];
      this.fileName = '修改导入模板';
      this.commonQueryService.exportAction(this.httpExportAction, this.i.queryParams, this.excelexport);
    }
    if (this.flag === false && this.radioValue !== '') {
      this.expColumns = [
        { field: 'businessUnitCode', title: '事业部', width: 150, locked: false },
        { field: 'salesType', title: '内外销', width: 150, locked: false },
        { field: 'plantCode', title: '工厂', width: 150, locked: false },
        { field: 'salesCatgoryBig', title: '产品大类', width: 150, locked: false },
        { field: 'salesCatgorySub', title: '产品小类', width: 300, locked: false },
        { field: 'itemCode', title: '物料编码', width: 150, locked: false },
        { field: 'descriptionsCn', title: '物料描述', width: 150, locked: false },
        { field: 'salesRegion', title: '业务大区', width: 150, locked: false },
        { field: 'salesArea', title: '业务区域', width: 150, locked: false },
        { field: 'customerName', title: '客户', width: 150, locked: false },
        { field: 'forecastType', title: '预测类型', width: 150, locked: false },
        { field: 'forecastDate', title: '原始日期', width: 150, locked: false },
        { field: 'netForecastDate', title: '净预测日期', width: 150, locked: false },
        { field: 'originalQty', title: '预测数量', width: 150, locked: false },
        { field: 'netQty', title: '净预测数量', width: 150, locked: false }
      ];
      this.fileName = '删除导入模板';
      this.commonQueryService.exportAction(this.httpExportAction, this.i.queryParams, this.excelexport);
    }
    if (this.radioValue === '') {
      this.msgSrv.warning('请选择导入的方式');
    }

  }
}
