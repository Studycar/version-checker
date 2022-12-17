import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Directive,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { debounceTime } from 'rxjs/internal/operators';
import { combineLatest } from 'rxjs';

@Directive({
  selector: '[restoreScroll]',
})
export class RestoreScrollDirective implements AfterViewInit {
  @Input() restoreScroll = null;

  constructor(private grid: AgGridAngular) {
  }

  ngAfterViewInit(): void {
    // 数据变更总是会激活位置重置，Grid大小变化时，则需要clientHeight不等于0才激活.
    combineLatest(this.grid.rowDataChanged, this.grid.gridSizeChanged).subscribe((p: any) => {
      let activeScroll = true;
      p.forEach(item => {
        if (item.type === 'gridSizeChanged' && p.clientHeight === 0) activeScroll = false;
      });

      if (activeScroll) {
        const scrollRecord = JSON.parse(localStorage.getItem(this.restoreScroll));
        if (scrollRecord) {
          const record = scrollRecord;
          this.grid.api.ensureIndexVisible(+record.index, 'top');
        }
      }
    });

    this.grid.bodyScroll.pipe(debounceTime(300)).subscribe(scroll => {
      const st = scroll.top;
      if (st <= 0) {
        localStorage.setItem(this.restoreScroll, null);
      } else {
        scroll.api.forEachNode(r => {
          const t = r.rowTop;
          const h = r.rowHeight;
          if (st > t && t + h > st) {
            localStorage.setItem(this.restoreScroll, JSON.stringify({ top: st, index: r.getRowIndexString() }));
          }
        });
      }
    });
  }

}
