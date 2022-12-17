import {
  OnInit,
  Input,
  OnDestroy,
  Directive,
  AfterViewInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  CreateFormGroupArgs,
  GridComponent,
  ColumnComponent,
} from '@progress/kendo-angular-grid';
import { NzNotificationService } from 'ng-zorro-antd';
import {
  AppGridStateService,
  ColumnSettings,
  GridSettings,
} from '../services/app-gridstate-service';
import { AgGridAngular } from 'ag-grid-angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[myGridState]',
})
export class MyGridStateDirective implements OnInit, OnDestroy {
  private unsubKeydown: () => void;

  constructor(
    private grid: GridComponent,
    private gridApi: AgGridAngular,
    private notification: NzNotificationService,
    private appGridStateService: AppGridStateService,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  @Input('myGridState')
  public saveKey = 'myGridState-key';

  public ngOnInit(): void {
    this.unsubKeydown = this.renderer.listen(
      this.el.nativeElement,
      'keydown',
      e => this.onKeydown(e),
    );
    this.grid.columnResize.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(t => {
      this.delayExecuted();
    });
    this.grid.columnVisibilityChange.subscribe(t => {
      this.delayExecuted();
    });
    this.grid.columnReorder.subscribe(t => {
      this.delayExecuted();
    });
    setTimeout(() => {
      this.mapGridSettings();
    });
  }

  ngOnDestroy(): void {
    this.unsubKeydown();
  }

  private delayExecuted() {
    setTimeout(() => {
      this.saveGridSettings();
    }, 100);
  }

  public saveGridSettings() {
    const gridConfig: { [key: string]: {} } = {};
    this.grid.columns.toArray().map(item => {
      const col = <ColumnComponent>item;
      if (col.field) {
        gridConfig[col.field] = {
          field: col.field,
          orderIndex: col.orderIndex,
          width: col.width,
          hidden: col.hidden,
        };
      }
      return gridConfig;
    });
    this.appGridStateService.set(this.saveKey, gridConfig);
  }

  public mapGridSettings() {
    const gridConfig = this.appGridStateService.get(this.saveKey);
    if (gridConfig) {
      this.grid.columns.forEach(t => {
        const col = <ColumnComponent>t;
        if (!col.field) {
          return;
        }
        const colConfig = gridConfig[col.field];
        if (colConfig.hidden) {
          col.hidden = colConfig.hidden;
        }
        col.width = colConfig.width;
        if (colConfig.orderIndex > 0) {
          // this.grid.reorderColumn(t, colConfig.orderIndex);
          col.orderIndex = colConfig.orderIndex;
        }
      });
    }
  }

  // ctrl+F4
  public onKeydown(e: KeyboardEvent): void {
    const key = e.key;
    if (e.ctrlKey && key === 'F4') {
      e.preventDefault();
      this.appGridStateService.reset(this.gridApi.columnApi, this.saveKey);
    }
  }
}
