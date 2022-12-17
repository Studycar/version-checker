import { Injectable } from '@angular/core';
import { deepCopy } from '@delon/util';
import { ColumnState, DefType } from './workbench-setting.type';

/** 将gird内部为处理重复列名而添加的"_数字"的colId更改回来 */
const reg = /_\d+$/;

@Injectable()
export class WorkbenchSettingService {
  constructor() { }

  /**
   * 获取 filed映射headerName字典
   * @param columnApi
   * @return {{}}
   */
  private getField2Name(columnApi): { [colId: string]: string } {
    const field2Name = {};

    columnApi.getAllColumns().forEach(col => {
      const item = col.getColDef();
      field2Name[col.colId.replace(reg, '') || item.field] = item.headerName;
    });

    columnApi.columnController.columnDefs.forEach(col => {
      if(col.hasOwnProperty('children')) {
        col.children.forEach(c => {
          field2Name[c.field] = c.headerName + `(${col.headerName})`
        })
      }
    })
    return field2Name;
  }

  /**
   * 为数据根据field添加Name字段和原来索引
   * @param {[]} data 来源数据
   * @return {[]} 处理完数据
   */
  private field2Name(data: ColumnState[], columnApi): DefType[] {
    const field2Name = this.getField2Name(columnApi);

    return data.map((d: ColumnState) => ({
      ...d,
      hide: d.hide ? d.hide : false,
      label: field2Name[d.colId.replace(reg, '')],
    }));
  }

  /**
   * 一维转为二维,因为checkbox数据为二维结构
   * @param {[]} data
   * @return DefType[][]
   */
  private dimensionalChange(data: DefType[]): DefType[][] {
    const checkboxData = [];

    data.forEach((col: object, i: number) => {
      if (i % 6 === 0) {
        checkboxData.push([]);
      }

      checkboxData[Math.floor(i / 6)].push({ ...col });
    });

    return checkboxData;
  }

  /**
   * 加工coldef数据为checkbox定义数据
   * 一维转为二维数组
   * @return {[][]} checkbox数据
   */
  getDefinedFromColDef(sourceData: ColumnState[], columnApi, gridApi): DefType[][] {
    const data = this.field2Name(
      this.excludeCheckboxAndOperation(sourceData, columnApi, gridApi),
      columnApi,
    );
    return this.dimensionalChange(data);
  }

  /**
   * 排除操作,多选框列,ag-Grid-AutoColumn
   * @param {ColumnState[]} data
   * @return {ColumnState[]}
   */
  excludeCheckboxAndOperation(data: ColumnState[], columnApi, gridApi): ColumnState[] {
    const cols = columnApi.getAllColumns();
    return data.filter(
      s =>
        !(
          (s.colId.replace(reg, '') === '0' || s.colId === '操作') &&
          s.pinned === 'right'
        ) &&
        !(s.colId.replace(reg, '') === '1' && s.pinned === 'left') &&
        !(s.colId === 'ag-Grid-AutoColumn') &&
        !(s.colId === 'ROW_SPAN') &&
        !(cols.find(c => c.colId === s.colId).colDef.isAutoCol),
    );
  }

  /**
   * 获取checkobx定义数据
   * @param columnApi
   * @return DefType[][]
   */
  getCheckboxData(columnApi, gridApi): DefType[][] {
    return this.getDefinedFromColDef(columnApi.getColumnState(), columnApi, gridApi);
  }

  /**
   * 获取初始checkbox定义数据
   * @param {string} stateKey
   * @param {api} columnApi
   * @return DefType[][]
   */
  getOriginCheckboxData(stateKey, columnApi, gridApi): DefType[][] {
    const AGOData = this.getAGOriginState(stateKey);
    if (AGOData === undefined || AGOData === null) return null;
    return this.getDefinedFromColDef(AGOData, columnApi, gridApi);
  }

  /**
   * 获取初始列配置状态
   * @return {any}
   */
  getAGOriginState(stateKey): [] {
    return JSON.parse(localStorage.getItem(stateKey));
  }
}
