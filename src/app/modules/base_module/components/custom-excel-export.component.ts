import { Component, OnInit, ViewChild, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { GridComponent, ColumnComponent, ColumnBase } from '@progress/kendo-angular-grid';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
import { CustomBaseContext } from './custom-base-context.component';
/*
  author:liujian11
  date:2018-07-30
  function:excel导出组件
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-excelexport',
  template: `<kendo-excelexport [data]="expData" fileName="{{fileName}}.xlsx" #excelexport>
    <div *ngFor="let column of expColumns">
      <kendo-excelexport-column *ngIf="!column.hasOwnProperty('child')" [field]="column.field" [locked]="column.locked" [title]="column.title"
        [width]="column.width" [hidden]="column.hidden||hiddenColumns.indexOf(column.field) > -1" [headerCellOptions]="headerCellOptions"
        [cellOptions]="cellOptions">
      </kendo-excelexport-column>
      <div *ngIf="column.hasOwnProperty('child')">
        <kendo-excelexport-column-group [title]="column.title"
          [headerCellOptions]="headerCellOptions">
          <div *ngFor="let k of column.child">
            <kendo-excelexport-column  [headerCellOptions]="headerCellOptions"
              [cellOptions]="cellOptions" [field]="k.field" [title]="k.title" [headerCellOptions]="{ textAlign: 'center' }" [width]="70">
            </kendo-excelexport-column>
            <div *ngIf="k.hasOwnProperty('child')">
              <kendo-excelexport-column-group [title]="k.title" [headerCellOptions]="headerCellOptions">
                <div *ngFor="let l of k.child">
                  <kendo-excelexport-column  [headerCellOptions]="headerCellOptions"
                    [cellOptions]="cellOptions" [field]="l.field" [title]="l.title" [headerCellOptions]="{ textAlign: 'center' }" [width]="70">
                  </kendo-excelexport-column>
                </div>
              </kendo-excelexport-column-group>
            </div>
          </div>
        </kendo-excelexport-column-group>
      </div>
    </div>
    <kendo-excelexport-column-group *ngFor="let option of groupCollection" [title]="option.title"
      [headerCellOptions]="headerCellOptions">
      <kendo-excelexport-column *ngFor="let k of option.child" [headerCellOptions]="headerCellOptions"
      [cellOptions]="cellOptions" [field]="k.field" [title]="k.title" [headerCellOptions]="{ textAlign: 'center' }" [width]="70">
      </kendo-excelexport-column>
    </kendo-excelexport-column-group>
  </kendo-excelexport>`
})

export class CustomExcelExportComponent implements OnInit, OnChanges, AfterViewInit {

  public headerCellOptions = { textAlign: 'center', fontFamily: '微软雅黑', fontSize: 12, bold: true, };

  public cellOptions = { textAlign: 'left', fontFamily: '微软雅黑', fontSize: 12 };

  public expData: any[] = [];

  @Input() public expColumns: Array<ExpColumnObject | ExpGroupObject> = [];

  @Input() public groupCollection: ExpGroupObject[] = [];

  @Input() public hiddenColumns: string[] = [];

  @Input() public expColumnsOptions: ExpColumnOptionsObject[] = [];

  @Input() public fileName = 'export';

  @ViewChild('excelexport', { static: true }) private excelexport: ExcelExportComponent;

  @Input() public context: CustomBaseContext; /* 外部调用组件对象的上下文*/

  @Input() public headerRows: any = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
  }

  ngAfterViewInit(): void {
  }

  public export(data?: any[]) {
    this.expData.length = 0;
    if (data !== undefined && data.length > 0) {
      this.dealExportData(data, this.expData, this.expColumnsOptions);
    }
    console.log('CustomExcelExportComponent:');
    console.log(this.expColumns);
    console.log(this.expData);
    const options = this.excelexport.workbookOptions();

    if (this.headerRows.length > 0) {
      const rows = options.sheets[0].rows;
      this.headerRows.forEach(hr => {
        rows.unshift({
          type: 'data',
          cells: [{
            value: hr,
            textAlign: "left",
            fontFamily: "微软雅黑",
            fontSize: 12,
          }]
        });
      });
    }

    this.excelexport.save(options);
  }

  private dealExportData(
    data: any[],
    dealData: any[],
    expColumnsOptions: ExpColumnOptionsObject[] = []): any[] {

    if (data !== null && data.length > 0) {
      dealData.length = 0;
      data.forEach(e => {
        const expItem = Object.assign({}, e);
        for (let i = 0; i < expColumnsOptions.length; i++) {
          let goOn = true;
          expColumnsOptions[i].options.forEach(op => {
            if (!goOn) return;
            if (op.value === expItem[expColumnsOptions[i].field]) {
              expItem[expColumnsOptions[i].field] = op.label;
              goOn = false;
            }
          });
        }
        dealData.push(expItem);
      });
    }
    return dealData;
  }

  // 设置多表头
  setExportColumn(columns) {
    this.expColumns = [];
    columns.forEach(c => {
      if (c.hasOwnProperty('children')) {
        let group = {
          title: c.headerName,
          child: Object.assign([], c.children)
        };
        group.child = group.child.map(g => Object.assign({ title: g.headerName }, g));
        group.child.forEach(item => {
          if (item.hasOwnProperty('children')) {
            item.child = item.children.map(jItem => ({
              ...jItem,
              title: jItem.headerName,
            }));
          }
        });
        this.expColumns.push(group);
      } else {
        this.expColumns.push(Object.assign({ title: c.headerName }, c));
      }
    })
    return this.expColumns;
  }
}



export class ExpColumnObject {
  public field: string;
  public title: string;
  public locked?: boolean;
  public width?: number;
  public orderIndex?: number;
  public hidden?: boolean;
  public extObject?: any;
}



export class ExpOptionObject {
  public value: string;
  public label: string;
  public extObject?: any;
}

export class ExpGroupObject {
  public title: string;
  public child: ExpColumnObject[];
}

export class ExpColumnOptionsObject {
  public field: string;
  public options: ExpOptionObject[];
  public extObject?: any;
}
