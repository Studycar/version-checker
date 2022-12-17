import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService, UploadFile } from '../../../../../node_modules/ng-zorro-antd';
import { XlsxService } from '@delon/abc';
import { CustomBaseContext } from './custom-base-context.component';
/* 
author:liujian11
date:2018-11-08 
function:文件上传（导入）
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-file-upload',
  templateUrl: '../views/custom-file-upload.html',
})
export class CustomFileUploadComponent implements OnInit {
  @Input() public buttonText = '选择文件'; /* 按钮文本 */
  @Input() public isDataObjectListParse = true; /*数据解析格式：true为对象集合；false为带引号的逗号拼接串集合 */
  @Input() public impColumns: ImpColumnsObject = {
    columns: [], /* execel列头 */
    paramMappings: [] /* execel列头与字段的对应关系，逗号拼接串集合解析的数据顺序与此处字段顺序一致 */
  };
  @Input() public context: CustomBaseContext; /* 数据处理方式一：绑定外部对象的上下文,外部对象必须包含方法excelDataProcess */
  @Output() public excelDataProcessEvent = new EventEmitter<any[]>(); /*数据处理方式二： 绑定事件 */

  constructor(
    private msgSrv: NzMessageService,
    private xlsx: XlsxService) { }

  ngOnInit() {
  }

  public beforeUpload = (file: File) => {
    const isXls = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const xlsxFileExt = ['xlsx', 'xls'];
    const fileExt = file.name.split('.')[1].toLowerCase();
    if (xlsxFileExt.indexOf(fileExt) <= -1) {
      this.msgSrv.error('请选择EXECLE文件！');
    } else {
      this.readFileData(file);
    }
    return false;
  }
  // 上传文件改变时的状态
  public handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
    }
  }
  // 读取文件数据
  private readFileData(file: File) {
    const tempDataList: any[] = [];
    const returnObj = { result: true, message: '' };
    this.xlsx.import(file).then(res => {
      this.fileDataParse(res, tempDataList, returnObj);
      if (!returnObj.result) {
        this.msgSrv.error(returnObj.message);
        return;
      }
      if (this.context != null) {
        this.context.excelDataProcess(tempDataList);
      }
      this.excelDataProcessEvent.emit(tempDataList);
    });
  }
  // 列头验证
  private columnsValidate(headerColumns: string[], returnObj: any): boolean {
    let res = true;
    const lackColumns = [];
    this.impColumns.columns.forEach(e => {
      if (this.getColumnIndex(headerColumns, e) <= -1) { res = false; lackColumns.push(e); }
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
  // 解析数据
  private fileDataParse(fileImpObj: any, tempDataList: any[], returnObj: any) {
    const workbook = fileImpObj; // {sheet:[][]}
    let rowIndex = 0;
    let headerRow: any[];
    let goOn = true;
    let sheetName = 'Sheet1';
    for (const sheet in workbook) {
      sheetName = sheet;
      break;
    }
    workbook[sheetName].forEach(item => {
      if (item.length === 0) return; // 过滤空行
      if (!goOn) return; // 校验失败中断
      if (rowIndex === 0 && item.length >= this.impColumns.columns.length) {
        headerRow = item;
        if (!this.columnsValidate(headerRow, returnObj)) goOn = false; // 验证列头
      } else if (rowIndex > 0) { // && item.length >= this.impColumns.columns.length
        let paramStr = '';
        let data: any;
        const dataObject = {};
        this.impColumns.paramMappings.forEach(p => {
          if (!goOn) return;
          if (p.constraint !== undefined) {
            if ((p.constraint.notNull !== undefined && p.constraint.notNull) && (item[p.columnIndex] === undefined || item[p.columnIndex] === '')) {
              returnObj.result = false;
              returnObj.message = p.title + '不能为空，在' + rowIndex + '行！';
              goOn = false;
            }
            if (p.constraint.sequence !== undefined) {
              const sequenceIndex = p.constraint.sequence.indexOf(item[p.columnIndex]);
              if (sequenceIndex <= -1) {
                returnObj.result = false;
                returnObj.message = p.title + '数据有误，在' + rowIndex + '行！';
                goOn = false;
              } else {
                item[p.columnIndex] = p.constraint.sequenceValue ? p.constraint.sequenceValue[sequenceIndex] : item[p.columnIndex];
              }
            }
          }
          if (p.field === 'ROW_NUMBER') {
            data = rowIndex + '';
            if (!this.isDataObjectListParse) paramStr += '\'' + data + '\',';
          } else if (p.type === 'date' && item[p.columnIndex].length <= 8 && item[p.columnIndex].indexOf('/') > -1) {
            // MM/dd/yy
            const dateArray = item[p.columnIndex].split('/');
            data = (dateArray[2].length === 2 ? '20' + dateArray[2] : dateArray[2]) + '-' + (dateArray[0].length === 1 ? '0' + dateArray[0] : dateArray[0]) + '-' + (dateArray[1].length === 1 ? '0' + dateArray[1] : dateArray[1]);
            if (!this.isDataObjectListParse) paramStr += '\'' + data + '\',';
          } else {
            data = (p.default ? p.default : (item[p.columnIndex] ? item[p.columnIndex] : ''));
            if (!this.isDataObjectListParse) paramStr += '\'' + data + '\',';
          }
          if (this.isDataObjectListParse) dataObject[p.field] = data;
        });
        if (this.isDataObjectListParse) {
          tempDataList.push(dataObject);
        } else {
          tempDataList.push(paramStr.substr(0, paramStr.length - 1));
        }
      }
      rowIndex++;
    });
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
