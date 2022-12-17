import {
  OnInit,
  Input,
  OnDestroy,
  Directive,
  AfterViewInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { AppGridStateService } from '../services/app-gridstate-service';
import { AgGridAngular } from 'ag-grid-angular';
import { AppAgGridStateService } from '../services/app-ag-gridstate-service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[myAgGridState]',
  exportAs: 'myAgGridState',
})
export class MyAgGridStateDirective
  implements OnInit, AfterViewInit, OnDestroy {
  private unsubKeydown: () => void;
  /** 是否重置，重置需要清空状态，无需再保存状态 */
  private isRestState = false;

  constructor(
    private grid: AgGridAngular,
    private appGridStateService: AppGridStateService,
    private appAgGridStateService: AppAgGridStateService,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  @Input('myAgGridState')
  public saveKey = 'myAgGridState-key';

  // 事件执行开关
  private executeSwitch = {
    columnResized: true,
    columnPinned: true,
    columnVisible: true,
    columnMoved: true,
  };
  private delay = 500;

  public ngOnInit(): void {
    setTimeout(() => {
      this.mapGridSettings();
    });
  }
  private columnResizedEvent;
  private columnPinnedEvent;
  private columnVisibleEvent;
  private columnMovedEvent;

  ngAfterViewInit(): void {
    this.setElAttribute();
    this.unsubKeydown = this.renderer.listen(
      this.el.nativeElement,
      'keydown',
      e => this.onKeydown(e),
    );
    // 延时监听，不监听页面加载时触发的事件
    setTimeout(() => {
      this.columnResizedEvent = this.grid.columnResized.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(t => {
        this.delayExecuted('columnResized');
      });
      this.columnPinnedEvent = this.grid.columnPinned.subscribe(t => {
        this.delayExecuted('columnPinned');
      });
      this.columnVisibleEvent = this.grid.columnVisible.subscribe(t => {
        this.delayExecuted('columnVisible');
      });
      this.columnMovedEvent = this.grid.columnMoved.subscribe(t => {
        this.delayExecuted('columnMoved');
      });
    }, this.delay);
  }

  ngOnDestroy(): void {
    this.unsubKeydown();
    // 销毁时取消订阅
    this.columnResizedEvent.unsubscribe();
    this.columnPinnedEvent.unsubscribe();
    this.columnVisibleEvent.unsubscribe();
    this.columnMovedEvent.unsubscribe();
  }

  private delayExecuted(eventType: string) {
    if (this.executeSwitch[eventType]) {
      this.executeSwitch[eventType] = false;
      setTimeout(() => {
        this.saveGridSettings();
        this.executeSwitch[eventType] = true;
      }, this.delay);
    }
  }

  public saveGridSettings() {
    // update by jianl 不可以按以下这样去更新个性化，假如属于动态列，一开始动态列没有加载出来，用户调整了一下个性化
    // 这样就会删除了那些动态列的个性化数据；现在改成数据列会一直保存下来
    // const columnState: ColumnState[] = this.grid.columnApi.getColumnState();
    // this.appGridStateService.set(this.saveKey, columnState);
    /** 重置状态设置为false，防止重置事件后，重置状态一直为true*/
    this.appAgGridStateService.saveGridState(
      this.grid.columnApi,
      this.appGridStateService,
      this.saveKey,
      this.isRestState,
    ).subscribe(() => this.isRestState = false);
  }

  public mapGridSettings() {
    this.appGridStateService.saveDefined(this.saveKey, this.grid.columnApi.getColumnState());
    this.appAgGridStateService.resetGridSettingsByCache(
      this.grid.columnApi,
      this.appGridStateService,
      this.saveKey,
    );
  }

  setSaveKey(key: string) {
    this.saveKey = key;
    this.setElAttribute();
  }

  setElAttribute() {
    this.renderer.setAttribute(this.el.nativeElement, 'stateOriginKey', `${this.saveKey}Origin`);
    this.renderer.setAttribute(this.el.nativeElement, 'stateDefinedKey', `${this.saveKey}Defined`);
  }

  // ctrl+F3
  public onKeydown(e: KeyboardEvent): void {
    const key = e.key;
    if (e.ctrlKey && key === 'F3') {
      e.preventDefault();
      this.reset();
    }
  }

  reset() {
    /**
     * 重置事件会触发一次列属性变更，导致会额外触发一次保存事件，把重置后状态保存
     * 设置为ture，防止再次被保存，该属性在保存事件订阅后自动重新设置为false
     * */
    this.isRestState = true;
    this.appGridStateService.reset(this.grid.columnApi, this.saveKey);
  }
}
