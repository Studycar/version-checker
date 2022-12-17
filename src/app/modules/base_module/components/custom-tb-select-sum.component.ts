import { Component, Input, OnInit } from "@angular/core";
import { decimal } from "@shared";
import { clear } from "console";
import { CustomBaseContext } from "./custom-base-context.component";

/**
 * 表格下方显示选中数据的汇总
 */
@Component({
  selector: 'custom-tb-select-sum',
  template: `
    <div class="container" [ngStyle]="Style">
      已选中数据 {{selected}} 条{{sumItemsString}}
    </div>
  `,
  styles: [
    `
      .container {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    `
  ]
})
export class CustomTbSelectSumComponent implements OnInit {
  @Input() height = 40;
  @Input() sumItems: SumItem[] = [];
  @Input() context: CustomBaseContext;
  selected: number = 0;
  sumItemsClone: SumItem[] = []; // 备份初始sumItems
  sumItemsString: string = '';
  @Input() Style = {height: this.height};

  ngOnInit(): void {
    this.Style = {
      height: this.height, 
      ...this.Style
    };
    if(this.sumItems && this.sumItems.length > 0) {
      this.sumItems.forEach(item => {
        this.sumItemsClone.push(Object.assign(item)) ;
      })
    }
    if(this.context) {
      this.context.agGrid.rowSelected.subscribe((e) => {
        this.sum(e);
      })
      this.context.agGrid.rowDataChanged.subscribe(e => {
        this.sum(null);
      })
    }
  }

  sum(event) {
    if(event) {
      const node = event.node;
      if(node.selected) {
        this.selected++;
        this.sumItems.forEach(item => {
          item.sum = decimal.add(item.sum || 0, node.data[item.field]);
        });
      } else {
        this.selected--;
        this.sumItems.forEach(item => {
          item.sum = decimal.minus(item.sum || 0, node.data[item.field]);
        });
      }
    } else { this.clear(); }
    if (this.sumItems && this.sumItems.length > 0) {
      this.sumItemsString = '，' + this.sumItems.map(item => `${item.headerName}: ${item.sum || 0} ${item.unit || ''}`).join('，');
    }
  }
  
  clear() {
    this.selected = 0;
    this.sumItems.length = 0;
    if(this.sumItemsClone && this.sumItemsClone.length > 0) {
      this.sumItemsClone.forEach(item => {
        this.sumItems.push(Object.assign({}, item)) ;
      })
    }
  }
}

export type SumItem = {
  field: string, // 取值字段
  headerName: string, // 取值显示标题
  sum?: number, // 计算的初始值，默认为 0
  unit?: string, // 取值显示单位
}