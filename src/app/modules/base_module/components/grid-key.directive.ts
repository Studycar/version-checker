import {
  OnInit,
  Input,
  OnDestroy,
  Directive,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  CreateFormGroupArgs,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { NzNotificationService } from 'ng-zorro-antd';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[myGridRowKey]',
})
export class InGridRowKeyDirective implements OnInit, OnDestroy {
  /* tslint:disable-next-line:no-input-rename */
  @Input('myGridRowKey')
  public inputValue: any = {};

  private unsubKeydown: () => void;

  constructor(
    private grid: GridComponent,
    private el: ElementRef,
    private renderer: Renderer2,
    private notification: NzNotificationService,
  ) {
    this.grid.navigable = true;
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
    const activeRow = this.grid.activeRow;
    const activeCell = this.grid.activeCell;
    if (!activeRow || !activeRow.dataItem) {
      // Not on an editable row
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
    const activeCell = this.grid.activeCell;
    const contents = `<strong>表名：</strong>${this.inputValue.tb}
      </br><strong>字段：</strong>${
        Object.keys(activeCell.dataItem)[activeCell.colIndex]
      }
      </br><strong>值：</strong>${
        Object.values(activeCell.dataItem)[activeCell.colIndex]
      }`;

    this.notification.info('单元格信息', contents, {
      nzDuration: 10000,
    });
  }

  private showRecord() {
    const activeCell = this.grid.activeCell;
    const contents = `<strong>表名：</strong>${this.inputValue.tb}
      </br><strong>创建人员：</strong>${
        // activeCell.dataItem.CREATED_BY
        'aps_admin'
      }
      </br><strong>创建时间：</strong>${
        activeCell.dataItem.CREATION_DATE
      }
      </br><strong>更新人员：</strong>${
        // activeCell.dataItem.LAST_UPDATED_BY
        'aps_admin'
      }
      </br><strong>更新时间：</strong>${
        activeCell.dataItem.LAST_UPDATE_DATE
      }`;

    this.notification.info('行记录操作信息', contents, {
      nzDuration: 10000,
    });
  }
}
