import {
  OnInit,
  Input,
  OnDestroy,
  Directive,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { AgGridAngular } from 'ag-grid-angular';
import { CellPosition } from 'ag-grid-community';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[myAgGridRowKey]',
})
export class InAgGridRowKeyDirective implements OnInit, OnDestroy {
  /* tslint:disable-next-line:no-input-rename */
  @Input('myAgGridRowKey')
  public inputValue: any = {};

  private unsubKeydown: () => void;
  constructor(
    private grid: AgGridAngular,
    private el: ElementRef,
    private renderer: Renderer2,
    private notification: NzNotificationService,
  ) {
  }

  public ngOnInit(): void {
    this.unsubKeydown = this.renderer.listen(
      this.el.nativeElement,
      'keydown',
      e => this.onKeydown(e),
    );
  }

  public ngOnDestroy(): void {
    this.unsubKeydown();
  }

  public onKeydown(e: KeyboardEvent): void {
    const activeCell: CellPosition = this.grid.api.getFocusedCell();
    if (!activeCell) {
      return;
    }
    const key = e.key;
    if (e.ctrlKey === false && key === 'F3') {
      e.preventDefault();
      this.showCellInfo();
    } else if (e.ctrlKey === false && key === 'F4') {
      e.preventDefault();
      this.showRecord();
    }
  }

  private showCellInfo() {
    const activeCell: CellPosition = this.grid.api.getFocusedCell();
    const activeRow = this.getActiveRow(activeCell.rowIndex);
    const colDef = activeCell.column.getColDef();
    const contents = `<strong>表名：</strong>${this.inputValue.tb}
      </br><strong>字段：</strong>${
      (<string[]>colDef.cellClass).findIndex(css => css === 'agGridCellNoField') > -1 ? '' : activeCell.column.getColDef().field
      }
      </br><strong>值：</strong>${
      activeRow[activeCell.column.getColDef().field]
      }`;

    this.notification.info('单元格信息', contents, {
      nzDuration: 10000,
    });
  }

  private showRecord() {
    const activeCell: CellPosition = this.grid.api.getFocusedCell();
    const activeRow = this.getActiveRow(activeCell.rowIndex);
    const contents = `<strong>表名：</strong>${this.inputValue.tb}
      </br><strong>创建人员：</strong>${
      // activeRow.CREATED_BY
      activeRow.createdBy
      // 'aps_admin'
      }
      </br><strong>创建时间：</strong>${
      // activeRow.CREATION_DATE
      activeRow.creationDate
      }
      </br><strong>更新人员：</strong>${
      // activeRow.LAST_UPDATED_BY
      // 'aps_admin'
      activeRow.lastUpdatedBy
      }
      </br><strong>更新时间：</strong>${
      // activeRow.LAST_UPDATE_DATE
      activeRow.lastUpdateDate
      }`;

    this.notification.info('行记录操作信息', contents, {
      nzDuration: 10000,
    });
  }

  /**
   * 获取当前聚焦单元格所在行
   * @param rowIndex 当前单元格对应行的 index
   * @returns 返回当前行
   */
  getActiveRow(rowIndex) {
    let activeRow = this.grid.rowData[rowIndex];
    // 如果当前表格存在过滤，则需从过滤后的数据选取
    if (this.grid.api.isAnyFilterPresent()) {
      // 使用 throw 提前结束查询 forEachNodeAfterFilter 遍历
      try {
        this.grid.api.forEachNodeAfterFilter((node, index) => {
          if (index === rowIndex) {
            activeRow = node.data;
            throw new Error('');
          }
        })
      } catch(e) {}
    }
    return activeRow;
  }
}
