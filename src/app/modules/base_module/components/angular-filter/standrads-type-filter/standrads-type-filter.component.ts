import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { AgFilterComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, IFilterParams, IDoesFilterPassParams, RowNode } from 'ag-grid-community';

/**
 * 规格尺寸过滤器：规格尺寸筛选从小到大排序
 */
@Component({
  selector: 'app-standrads-type-filter',
  templateUrl: './standrads-type-filter.component.html',
  styleUrls: ['./standrads-type-filter.component.less'],
})
export class StandardsTypeFilterComponent implements AgFilterComponent, AfterViewInit {

  private params: IFilterParams;
  private valueGetter: (rowNode: RowNode) => any;
  private valueFormatter;
  private isFirstFilter: Boolean = false;

  @ViewChild('filterInput', { read: ViewContainerRef, static: false }) filterInput;

  text = '';
  filterItems: FilterItem[] = [];

  allChecked = true;
  indeterminate = false;
  _filterWords: (string | null)[] = [];

  set filterWords(val: string[]) {
    this._filterWords = val.length === 0 ? [null] : val;
  }

  get filterWords() {
    return this._filterWords;
  }


  constructor() {
  }

  ngAfterViewInit(): void {
    window.setTimeout(() => {
      this.filterInput.element.nativeElement.focus();
      this.filterInput.element.nativeElement.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) {
          this.params.filterChangedCallback();
          this.filterItems = this.getFilterItems();
        }
      });
    });
  }


  agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
    if (params.column.getUserProvidedColDef().valueFormatter) {
      const evalFn = new Function(
        'params',
        'value',
        `return ${params.column.getUserProvidedColDef().valueFormatter.toString().replace(
          'ctx',
          'params.context',
        )}`,
      );
      this.valueFormatter = evalFn;
    }
    // this.filterItems = this.getFilterItems();
  }

  isFilterActive(): boolean {
    let v = false;
    if (this.text !== null && this.text !== undefined && this.text !== '') {
      v = true;
    } else if (!this.allChecked) {
      v = true;
    }
    return v;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const columnValue = (this.valueGetter(params.node) + '').toLowerCase();
    if (this.filterWords[0] === null) {
      return false;
    }
    return !!this.filterWords.some(fw => columnValue === fw);
  }

  onChange(newValue) {
    this.filterItems = [];
    if (this.text !== newValue) {
      this.text = newValue;
      this.filterItems = this.getFilterItems();
    }
  }

  getNodesByFilter(): RowNode[] {
    const nodes: RowNode[] = [];
    const filterSettings = Object.assign({}, this.params.context.filterSettings);
    this.params.api.forEachNode(node => {
      for (let key in filterSettings) {
        if (key !== this.params.colDef.field && !filterSettings[key].includes((node.data[key] + '').toLowerCase())) {
          return ;
        }
      }
      nodes.push(node);
    })
    return nodes;
  }

  /**
   * 获取checkbox数据
   * @return {FilterItem[]}
   */
  getFilterItems(checkValue: string[] = [], isReset: boolean = false): FilterItem[] {
    const filterRowColumnValues: FilterItem[] = [];
    let rows: any[] = [];
    const unduplicatedTmp: string[] = [];
    let filterRowIndex: any = new Set();
    this.filterWords = this.text.toLowerCase().split(' ');

    /** 获取存在Row的Id */
    if(this.isFilterActive() && !isReset) {
      // 如果当前过滤器已在过滤状态并且非重置，则从过滤后的数据中找到check
      this.params.api.forEachNodeAfterFilter(r => {
        filterRowIndex.add((this.params.api.getValue(this.params.column, r) + '').toLowerCase());
      });
    } else {
      // 如果当前过滤器不在过滤状态或重置，则从所有数据中找到check
      this.params.api.forEachNode(r => {
        filterRowIndex.add((this.params.api.getValue(this.params.column, r) + '').toLowerCase());
      });
    }
    filterRowIndex = [...filterRowIndex];

    const callback = (r) => {
      const value = (this.params.api.getValue(this.params.column, r) + '');
      if (unduplicatedTmp.indexOf(value) !== -1) {
        return;
      }
      unduplicatedTmp.push(value);
      let label = value;
      if(value && this.valueFormatter) {
        label = this.valueFormatter(this.params, value);
      }
      rows.push({
        label,
        value,
        checked: (filterRowIndex.indexOf(value.toLowerCase()) !== -1) || checkValue.includes(value),
      });
    }
    /** 遍历所有行，初始checkbox信息 */
    if (!this.isFirstFilter) {
      this.getNodesByFilter().forEach(r => {
        callback(r);
      });;
    } else {
      this.params.api.forEachNode(r => {
        callback(r);
      });
    }

    // 规格尺寸分三个维度进行排序
    rows = this.sortRows(rows);

    /** 过滤出根据条件存在的行 */
    rows.forEach(r => {
      if (this.filterWords.some(fw => r.label.toLowerCase().indexOf(fw) !== -1)) {
        filterRowColumnValues.push({ label: r.label, value: r.value, checked: r.checked });
      }
    });
    setTimeout(() => {
      this.updateSingleChecked();
    }, 0);
    return filterRowColumnValues;
  }

  sortRows(rows) {
    return rows.sort((a, b) => {
      a = a.value;
      b = b.value;
      if(typeof a !== 'string' || a === '' || a === 'null') { return -1; }
      if(typeof b !== 'string' || b === '' || b === 'null') { return 1; }
      a = a.replace('c', '0');
      b = b.replace('c', '0');
      const [a1, a2, a3] = a.split('*');
      const [b1, b2, b3] = b.split('*');
      if(Number(a1) === Number(b1)) {
        if(Number(a2) === Number(b2)) {
          if(Number(a3) === Number(b3)) {
            return 0;
          } else {
            return Number(a3) - Number(b3);
          }
        } else {
          return Number(a2) - Number(b2);
        }
      } else {
        return Number(a1) - Number(b1);
      }
    });
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    this.filterItems = this.filterItems.map(item => ({ ...item, checked: this.allChecked }));
    this.filterWords = this.flatFn();
    this.params.context.filterSettings[this.params.colDef.field] = this.filterWords;
    if (this.allChecked) {
      delete this.params.context.filterSettings[this.params.colDef.field]
    }
    this.params.filterChangedCallback();
  }

  updateSingleChecked(): void {
    if (this.filterItems.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.filterItems.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.allChecked = false;
      this.indeterminate = true;
    }
    this.filterWords = this.flatFn();
    this.params.context.filterSettings[this.params.colDef.field] = this.filterWords;
    if (this.allChecked) {
      delete this.params.context.filterSettings[this.params.colDef.field]
    }
    this.params.filterChangedCallback();
  }

  unduplicated(arr: any[]) {
    return [...new Set(arr)];
  }

  flatFn() {
    return this.filterItems.filter(r => r.checked).map(r => r.value.toLowerCase());
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    if (Object.keys(this.params.context.filterSettings).length > 0 && this.params.colDef.field !== Object.keys(this.params.context.filterSettings)[0]) {
      this.isFirstFilter = false;
    } else { this.isFirstFilter = true; }
    this.filterItems = this.getFilterItems();
  }

  getFrameworkComponentInstance(): any {
  }

  getModel(): any {
    return this.filterItems;
  }

  getModelAsString(model: any): string {
    return '';
  }

  checkValue: string[] = []; // 保存上一次过滤的结果
  onNewRowsLoaded(): void {
    // fixbug 2513，重新加载数据，过滤项不更新问题
    setTimeout(() => {
      this.filterItems = this.getFilterItems(this.checkValue);
    });
  }

  setModel(model: any): void {
    if(!model) {
      // 手动重置过滤器
      this.checkValue = [];
      this.filterItems = this.getFilterItems(this.checkValue, true);
    } else if(model instanceof Array) {
      const checkValue = model.filter(m => m.checked).map(m => m.value);
      this.checkValue = checkValue.length > 0 ? checkValue : this.checkValue;
      this.filterItems = this.getFilterItems(this.checkValue);
    }
  }

}

interface FilterItem {
  label: string;
  value: string;
  checked?: boolean;
}
