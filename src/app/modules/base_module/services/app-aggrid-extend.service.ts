import { Injectable } from '@angular/core';
import { GridOptions, RowNode } from 'ag-grid-community';

class RowFormat {
  [key: string]: any
}

@Injectable({ providedIn: 'root' })
export class AppAgGridExtendService {
  gridOptions: GridOptions;

  setGridOptions(gridOptions: GridOptions) {
    this.gridOptions = gridOptions;
  }

  extendGridMethod(options: { methodName: string, methodFn: <T>(event: T) => void }) {
    this.gridOptions[options.methodName] = options.methodFn;
  }

  /**
   * 获取冻结的行
   * @param {RowNode[] | number} rows 汇总的行
   * @param {string | string[]} fields 汇总字段
   * @param {{[p: string]: any}} rowFormat 冻结行的格式 eg：{field:'合计'}
   * @return {any[]}
   */
  getPinnedRowData(rows: RowNode[] | number, fields: string | string[], rowFormat: RowFormat[]): RowFormat[] {
    if (typeof fields === 'string') {
      rowFormat[0][fields] = typeof rows === 'number' ? rows : this.processRowTotal(rows, fields);
    } else {
      fields.forEach(field => rowFormat[0][field] = typeof rows === 'number' ? rows : this.processRowTotal(rows, field));
    }

    return rowFormat;
  }

  /**
   * 根据字段汇总
   * @param {RowNode[]} rows
   * @return {any}
   */
  processRowTotal(rows: RowNode[], field: string): number | string {
    return rows.reduce((acc, cur) => acc + Number(cur.data[field]), 0);
  }
}
