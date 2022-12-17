import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from '../../../../../node_modules/ng-zorro-antd';
import { XlsxService } from '@delon/abc';
import { CustomBaseContext } from './custom-base-context.component';
import { PlanscheduleHWCommonService } from 'app/modules/generated_module/services/hw.service';
import { CustomExcelExportComponent } from './custom-excel-export.component';

const REG_POSITIVE_INTEGER = /^[1-9]\d*$/

/*
author:liujian11
date:2018-07-30
function:文件选择按钮组件（导入）
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-xlsxfile-select',
  templateUrl: '../views/custom-xlsxfile-select.html',
})
export class CustomXlsxFileSelectComponent implements OnInit {
  @Input() public isNotAlivable = false; // 按钮是否可用
  @Input() public isUserDefinedDataValidation = false; // 是否使用用户自定义的验证方法
  @Input() public maxLength = -1; // 超过最大长度时报错
  @Input() public buttonWidth = 88;
  @Input() public buttonHeight = 33;
  @Input() public buttonText = '导入'; /* 按钮文本，按钮文本自定义时，需根据文本设置buttonWidth */
  @Input() public buttonType = 'default'; /* 按钮样式，custom为自定义按钮，自定义时需根据自定义按钮的宽和高设置buttonWidth和buttonHeight */
  @Input() public isDataObjectListParse = true; /*数据解析格式：true为对象集合；false为带引号的逗号拼接串集合 */
  @Input() public impColumns: ImpColumnsObject = {
    columns: [], /* execel列头 */
    paramMappings: [] /* execel列头与字段的对应关系，逗号拼接串集合解析的数据顺序与此处字段顺序一致 */
  };
  @Input() public context: CustomBaseContext; /* 数据处理方式一：绑定外部对象的上下文,外部对象必须包含方法excelDataProcess */
  @Output() public excelDataProcessEvent = new EventEmitter<any[]>(); /*数据处理方式二： 绑定事件 */
  /**
   * add by jianl
   * 文件选择后回调的事件
   * 如果调用端定义了该事件，则不会再调用内部的 fileDataParse 方法
   */
  @Output() public fileDataParseEvent = new EventEmitter<{ fileImpObj: any, tempDataList: any[], returnObj: any }>();
  // @Output() public fileDataParseEvent: any = '';

  expColumns: any[] = [];
  expColumnsOptions: any[] = [];
  constructor(
    private msgSrv: NzMessageService,
    private commonQuery: PlanscheduleHWCommonService,
    private xlsx: XlsxService) { }

  ngOnInit() {
    this.generateExpColumns();
  }
  
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  fileUpload(e: Event) {
    const node = e.target as HTMLInputElement;
    const tempDataList: any[] = [];
    const errDataList: any[] = [];
    const returnObj = { result: true, message: '', isExport: false };
    const xlsxFileExt = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // xls, xlsx
    if (xlsxFileExt.indexOf(node.files[0].type) <= -1 && !node.files[0].name.endsWith('.xls') && !node.files[0].name.endsWith('.xlsx')) {
      this.msgSrv.error('请选择EXCEL文件！');
      return;
    }
    this.xlsx.import(node.files[0]).then(res => {
      console.log('res:');
      console.log(res);
      if (this.isUserDefinedDataValidation) {
        // 调用客户端指定的转换方法
        console.log('fileDataParseEvent:');
        this.fileDataParseEvent.emit({ fileImpObj: res, tempDataList: tempDataList, returnObj: returnObj });
      } else {
        console.log('fileDataParse:');
        // this.fileDataParse(res, tempDataList, returnObj);
        this.fileDataParse2(res, tempDataList, errDataList, returnObj);
      }
      // if (this.fileDataParseEvent !== undefined &&
      //   this.fileDataParseEvent !== null &&
      //   this.fileDataParseEvent !== '') {
      //   // 调用客户端指定的转换方法
      //   console.log('fileDataParseEvent:');
      //   this.fileDataParseEvent.emit({ fileImpObj: res, tempDataList: tempDataList, returnObj: returnObj });
      // } else {
      //   console.log('fileDataParse:');
      //   this.fileDataParse(res, tempDataList, returnObj);
      // }
      if (!returnObj.result) {
        if(returnObj.isExport) {
          this.excelexport.export(errDataList);
          return;
        }
        this.msgSrv.error(returnObj.message);
        return;
      }
      if (this.context != null) {
        this.context.excelDataProcess(tempDataList);
      }
      this.excelDataProcessEvent.emit(tempDataList);
    });
    node.value = '';
  }

  generateExpColumns() {
    this.expColumns = this.impColumns.paramMappings
      .sort((a,b) => a.columnIndex-b.columnIndex)
      .map(col => ({
        field: col.field,
        title: col.title,
        width: 120,
      }));
    this.expColumns.push({
      field: 'errMsg',
      title: '错误信息',
      width: 120
    });
    this.excelexport.expColumns = this.expColumns;
  }

  private columnsValidate(headerColumns: string[], returnObj: any): boolean {
    let res = true;
    const lackColumns = [];
    this.impColumns.paramMappings.forEach(m => {
      const columnIndex = this.getColumnIndex(headerColumns, m.title);
      if (columnIndex <= -1) { 
        if(m.constraint && m.constraint.notNull) {
          // 必填列缺失时报错
          res = false; 
          lackColumns.push(m.title); 
        } 
        m.columnIndex = columnIndex;
      }
    });
    if (!res) {
      returnObj.result = res;
      returnObj.message = '缺少列：[' + lackColumns.join('],[') + ']';
    } else {
      this.impColumns.paramMappings.forEach(m => {
        m.columnIndex = this.getColumnIndex(headerColumns, m.title);
      });
    }
    return res;
  }
  // 获取列索引
  private getColumnIndex(headerColumns: string[], columnTitle: string): number {
    let columnIndex = headerColumns.indexOf(columnTitle);
    if (columnIndex <= -1) {
      columnIndex = headerColumns.indexOf(columnTitle + '*');
      if (columnIndex <= -1) {
        columnIndex = headerColumns.indexOf('*' + columnTitle);
      }
    }
    return columnIndex;
  }

  private fileDataParse(fileImpObj: any, tempDataList: any[], returnObj: any) {
    const workbook = fileImpObj; // {sheet:[][]}
    let headerRow: any[];
    let goOn = true;
    let sheetName = 'Sheet1';
    for (const sheet in workbook) {
      sheetName = sheet;
      break;
    }
    if(this.maxLength > -1) {
      const length = workbook[sheetName].filter(item => item.length !== 0).length - 1;
      if(length > this.maxLength) {
        returnObj.result = false;
        returnObj.message = '数据不能超过' + this.maxLength + '条！';
        return;
      }
    } 
    workbook[sheetName].forEach((item, index) => {
      const rowIndex = index + 1;
      if (item.length === 0) return; // 过滤空行
      if (!goOn) return; // 校验失败中断
      if (index === 0) {
        headerRow = item;
        if (!this.columnsValidate(headerRow, returnObj)) goOn = false; // 验证列头
      } else if (index > 0) { // && item.length >= this.impColumns.columns.length
        let paramStr = '';
        let data: any;
        const dataObject = {};
        this.impColumns.paramMappings.forEach(p => {
          if (!goOn) return;
          if(item[p.columnIndex]) { item[p.columnIndex] = item[p.columnIndex].trim(); }
          if (p.constraint !== undefined) {
            if ((p.constraint.notNull !== undefined && p.constraint.notNull) && (item[p.columnIndex] === undefined || item[p.columnIndex] === '')) {
              returnObj.result = false;
              returnObj.message = p.title + '不能为空，在' + rowIndex + '行！';
              goOn = false;
            }
            if (p.constraint.sequence !== undefined) {
              // 如果可以为空并且值为空时不做判断
              if((p.constraint.notNull === undefined || !p.constraint.notNull) && (item[p.columnIndex] === undefined || item[p.columnIndex] === '')) {
                return;
              }
              const sequenceIndex = p.constraint.sequence.indexOf(item[p.columnIndex]);
              if (sequenceIndex <= -1) {
                returnObj.result = false;
                returnObj.message = p.title + '数据有误，在' + rowIndex + '行！';
                goOn = false;
              } else {
                item[p.columnIndex] = p.constraint.sequenceValue ? p.constraint.sequenceValue[sequenceIndex] : item[p.columnIndex];
              }
            }
            if (item[p.columnIndex]) {
              if (p.constraint.isNumber) {
                if(isNaN(Number(item[p.columnIndex]))) {
                  returnObj.result = false;
                  returnObj.message = p.title + '必须为数字，在' + rowIndex + '行！';
                  goOn = false;
                } else if(p.constraint.precision !== undefined && !isNaN(Number(p.constraint.precision))) {
                  // 限制小数位
                  item[p.columnIndex] = Number(item[p.columnIndex]).toFixed(p.constraint.precision);
                }
              }
              if (p.constraint.isPositiveNumber && !(item[p.columnIndex] > 0)) {
                returnObj.result = false;
                returnObj.message = p.title + '必须为正数，在' + rowIndex + '行！';
                goOn = false;
              }
              if (p.constraint.isNotNegativeNumber && !(item[p.columnIndex] >= 0)) {
                returnObj.result = false;
                returnObj.message = p.title + '必须为非负数，在' + rowIndex + '行！';
                goOn = false;
              }
              if (p.constraint.isPositiveInteger && !REG_POSITIVE_INTEGER.test(item[p.columnIndex])) {
                returnObj.result = false;
                returnObj.message = p.title + '必须为正整数，在' + rowIndex + '行！';
                goOn = false;
              }
            }
          }
          if (p.field === 'ROW_NUMBER') {
            data = rowIndex + '';
            if (!this.isDataObjectListParse) paramStr += '\'' + data + '\',';
          } 
          const dates = ['date', 'month', 'dateTime'];
          if(((data || '').trim()) !== '' && dates.indexOf(p.type) > -1) {
            data = this.formatDate(p.type, item[p.columnIndex]);
            if(!data) {
              returnObj.result = false;
              returnObj.message = p.title + '格式不对，在' + rowIndex + '行！';
              goOn = false;
            }
          } else {
            data = (p.default ? p.default : (item[p.columnIndex] ? item[p.columnIndex] : ''));
          }
          if (this.isDataObjectListParse) dataObject[p.field] = data;
        });
        if (this.isDataObjectListParse) {
          tempDataList.push(dataObject);
        } else {
          tempDataList.push(paramStr.substr(0, paramStr.length - 1));
        }
      }
    });
  }

  private fileDataParse2(fileImpObj: any, tempDataList: any[], errDataList: any[], returnObj: any) {
    const workbook = fileImpObj; // {sheet:[][]}
    let headerRow: any[];
    let goOn = true;
    let sheetName = 'Sheet1';
    for (const sheet in workbook) {
      sheetName = sheet;
      break;
    }
    if(this.maxLength > -1) {
      const length = workbook[sheetName].filter(item => item.length !== 0).length - 1;
      if(length > this.maxLength) {
        returnObj.result = false;
        returnObj.message = '数据不能超过' + this.maxLength + '条！';
        return;
      }
    } 
    workbook[sheetName].forEach((item, index) => {
      const rowIndex = index + 1;
      if (item.length === 0) return; // 过滤空行
      if (!goOn) return; // 校验失败中断
      if (index === 0) {
        headerRow = item;
        if (!this.columnsValidate(headerRow, returnObj)) goOn = false; // 验证列头
      } else if (index > 0) { // && item.length >= this.impColumns.columns.length
        let paramStr = '';
        let data: any;
        const dataObject = {};
        const errDataObject = {};
        let errMsg = '';
        this.impColumns.paramMappings.forEach(p => {
          data = null;
          
          if(item[p.columnIndex]) { item[p.columnIndex] = item[p.columnIndex].trim(); }
          if (p.constraint !== undefined) {
            
            if ((p.constraint.notNull !== undefined && p.constraint.notNull) && (item[p.columnIndex] === undefined || item[p.columnIndex] === '')) {
              errMsg += '【' + p.title + '】' + '不能为空！';
              returnObj.result = false;
              returnObj.isExport = true;
            }
            
            if ((p.constraint.maxLength !== undefined && Number(p.constraint.maxLength) > 0) && 
            (item[p.columnIndex] && item[p.columnIndex].toString().length > p.constraint.maxLength)) {
              errMsg += '【' + p.title + '】' + '最长字数为' + Number(p.constraint.maxLength);
              returnObj.result = false;
              returnObj.isExport = true;
            }
            if (p.constraint.sequence !== undefined) {
              // 如果可以为空并且值为空时不做判断
              if(!(p.constraint.notNull === undefined || !p.constraint.notNull) || !(item[p.columnIndex] === undefined || item[p.columnIndex] === '')) {
                const sequenceIndex = p.constraint.sequence.indexOf(item[p.columnIndex]);
                if (sequenceIndex <= -1) {
                  errMsg += '【' + p.title + '】' + '数据有误！';
                  returnObj.result = false;
                  returnObj.isExport = true;
                } else {
                  data = p.constraint.sequenceValue ? p.constraint.sequenceValue[sequenceIndex] : item[p.columnIndex];
                }
              }
            }
            if (item[p.columnIndex]) {
              if (p.constraint.isNumber) {
                if(isNaN(Number(item[p.columnIndex]))) {
                  errMsg += '【' + p.title + '】' + '必须为数字！';
                  returnObj.result = false;
                  returnObj.isExport = true;
                } else if(p.constraint.precision !== undefined && !isNaN(Number(p.constraint.precision))) {
                  // 限制小数位
                  data = Number(item[p.columnIndex]).toFixed(p.constraint.precision);
                }
              }
              if (p.constraint.isPositiveNumber && !(item[p.columnIndex] > 0)) {
                errMsg += '【' + p.title + '】' + '必须为正数！';
                returnObj.result = false;
                returnObj.isExport = true;
              }
              if (p.constraint.isNotNegativeNumber && !(item[p.columnIndex] >= 0)) {
                errMsg += '【' + p.title + '】' + '必须为非负数！';
                returnObj.result = false;
                returnObj.isExport = true;
              }
              if (p.constraint.isPositiveInteger && !REG_POSITIVE_INTEGER.test(item[p.columnIndex])) {
                errMsg += '【' + p.title + '】' + '必须为正整数！';
                returnObj.result = false;
                returnObj.isExport = true;
              }
            }
            if (p.constraint.func && typeof p.constraint.func === 'function') {
              const msg = p.constraint.func(this.impColumns.paramMappings, item);
              if(!this.isNull(msg || '')) {
                errMsg += msg;
                returnObj.result = false;
                returnObj.isExport = true;
              }
            }
          }
          if (p.field === 'ROW_NUMBER') {
            data = rowIndex + '';
            if (!this.isDataObjectListParse) paramStr += '\'' + data + '\',';
          } 
          const dates = ['date', 'month', 'dateTime'];
          if(this.isNull(data || '')) {
            if(dates.indexOf(p.type) > -1 && !this.isNull(item[p.columnIndex] || '')) {
              data = this.formatDate(p.type, item[p.columnIndex]);
              if(!data) {
                errMsg += '【' + p.title + '】' + '格式不对！';
                returnObj.result = false;
                returnObj.isExport = true;
              }
            } else {
              data = (p.default ? p.default : (item[p.columnIndex] ? item[p.columnIndex] : ''));
            }
          } 
          if (this.isDataObjectListParse) {
            dataObject[p.field] = data;
            errDataObject[p.field] = item[p.columnIndex];
          }
        });
        if(errMsg) {
          errDataObject['errMsg'] = errMsg;
        }
        if (this.isDataObjectListParse) {
          tempDataList.push(dataObject);
          errDataList.push(errDataObject);
        } else {
          tempDataList.push(paramStr.substr(0, paramStr.length - 1));
        }
      }
    });
  }

  isNull(value) {
    return (value || '') === '';
  }

  formatDate(type: string, value) {
    const date = new Date(value);
    if(date.toDateString() === 'Invalid Date') {
      return false;
    }
    switch (type) {
      case 'date':
        return this.commonQuery.formatDate(date);
      case 'month': 
        return this.commonQuery.formatDateTime2(date, 'yyyy-MM');
      case 'dateTime': 
        return this.commonQuery.formatDateTime(date);
      default:
        return false;
    }
  }
}

export class ImpColumnsObject {
  public columns: string[];
  public paramMappings: ParamMappingObject[];
  public extObject?: any;
}
export class ParamMappingObject {
  public field: string;
  public title: string;
  public columnIndex: number;
  public type?: string;
  public default?: any;
  public constraint?: any;
  public extObject?: any;
}
