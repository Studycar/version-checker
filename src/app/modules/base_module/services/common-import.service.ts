/**
 * 导入类服务，主要是一些公共功能的方法，与业务无关的方法
 */

import { Injectable } from "@angular/core";

 @Injectable({
  providedIn: 'root',
})
export class CommonImportService {
  constructor() {}

  setSequence(impColumns: any, field: string, options: any[]) {
    const sequence = [];
    const sequenceValue = [];
    options.forEach(op => {
      sequence.push(op.label);
      sequenceValue.push(op.value);
    });
    const columnIndex = impColumns.paramMappings.findIndex(col => col.field === field);
    if(columnIndex === -1) { return ; }
    impColumns.paramMappings[columnIndex].constraint.sequence = sequence;
    impColumns.paramMappings[columnIndex].constraint.sequenceValue = sequenceValue;
  }

  /**
   * 导入模板获取对应值
   * @param columns 
   * @param item 
   * @param fields 
   */
  getColumnValue(columns, item, fields) {
    const result: any = {};
    fields.forEach(field => {
      const fieldIndex = columns.findIndex(p => p.field === field);
      result[field] = fieldIndex > -1 ? item[columns[fieldIndex].columnIndex] : '';
    });
    return result;
  }
}