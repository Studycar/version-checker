import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TabAgStateService } from './tab-ag-state.service';
import { Subject, timer } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { debounceTime } from 'rxjs/internal/operators';
import { Observable } from 'rxjs/Rx';


/**
 * 存储原始（第一次）状态缓存和缓存
 * 保存和更新缓存
 */
@Directive({
  selector: '[tabAggridState]',
  providers: [TabAgStateService],
})
export class TabAggridStateDirective implements OnInit, AfterViewInit, OnDestroy {

  /** 当前Tab长度对应的true数组 */
  @Input() originState: boolean[];

  /** 当前stateKey */
  @Input() stateKey: string;

  /** Tab主题 */
  @Input() tabSubject: Subject<{ index: number, curColDef: any[], columnApi: any, gridApi: any }> | null = null;

  private unsubscribeKeydown: () => void;

  /** 是否保存到服务器，切换需保存到服务器*/
  isSaveToRemote = false;

  columnApi = null;
  gridApi = null;

  /** 触发保存状态AG事件 */
  saveStateEvent = ['columnResized', 'columnPinned', 'columnVisible', 'columnMoved'];

  /** 当前Tab对应索引 */
  tabIndex = 1;

  /** 当前Tab对应的列配置 */
  curColDef = [];

  get tabStateKey() {
    return `${this.stateKey}${this.tabIndex}`;
  }

  get tabOriginStateKey() {
    return `${this.tabStateKey}Origin`;
  }

  get tabDefinedStateKey() {
    return `${this.tabStateKey}Defined`;
  }

  set originIndex(value) {
    this.originState[this.tabIndex - 1] = value;
  }

  /**
   * 获取对应tab是否第一次加载
   * @return {any}
   */
  get originIndex(): boolean {
    return this.originState[this.tabIndex - 1];
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private tabService: TabAgStateService,
    private grid: AgGridAngular,
  ) {
  }

  ngOnInit(): void {
    this.tabSubject.subscribe({
      next: ((v: { index: number, curColDef: any[], columnApi: any, gridApi: any, afterChangeFunction?: Function }) => {
        this.tabIndex = v.index;
        this.curColDef = v.curColDef.map(c => {
          if (typeof c.colId === 'number') {
            c.colId = c.colId.toString();
          }
          return { ...c };
        });
        this.gridApi = v.gridApi;
        this.columnApi = v.columnApi;
        this.renderer.setAttribute(this.el.nativeElement, 'stateOriginKey', this.tabOriginStateKey);
        this.renderer.setAttribute(this.el.nativeElement, 'stateDefinedKey', this.tabDefinedStateKey);
        this.tabChange(v.afterChangeFunction);
      }),
      error: e => {
        console.log(e.message);
      },
    });
  }

  ngAfterViewInit(): void {
    this.gridApi = this.grid.api;
    this.columnApi = this.grid.columnApi;
    /** ag-grid事件 */
    this.bindEvent();
    /** ctrl+F3 重置 */
    this.unsubscribeKeydown = this.renderer.listen(
      this.el.nativeElement,
      'keydown',
      e => this.onKeyDown(e),
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeKeydown();
  }

  bindEvent() {
    this.saveStateEvent.forEach(e => {
      this.grid[e].pipe(debounceTime(300)).subscribe(() => this.saveState());
    });
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.ctrlKey && e.key === 'F3') {
      e.preventDefault();
      this.tabService.reset(this.columnApi, this.stateKey, this.tabDefinedStateKey);
    }
  }

  /**
   * 更改stateKey
   * 同时需要把aggrid外层属性标记也修改，可被其他组件利用
   * @param key
   */
  setStateKey(key) {
    this.stateKey = key;
    this.renderer.setAttribute(this.el.nativeElement, 'stateOriginKey', this.tabOriginStateKey);
    this.renderer.setAttribute(this.el.nativeElement, 'stateDefinedKey', this.tabDefinedStateKey);
  }

  tabChange(afterChangeFunction?: Function) {
    /** 切换关闭远程保存 */

    this.isSaveToRemote = false;

    /** 重置colDef */
    this.gridApi.setColumnDefs([]);
    this.gridApi.setColumnDefs(this.curColDef);

    /** 保存定义列 */
    this.saveDefinedState();

    /** 有缓存，先把缓存和列配置合并，再重设列配置 */
    this.getState().subscribe(state => {
      state = this.tabService.mapState(state, this.columnApi.getColumnState());

      /** 设置列配置*/
      this.columnApi.setColumnState(state);

      /** 设置列状态后，需要重新渲染行，否则会出现列重叠*/
      this.gridApi.redrawRows();

      /** 保存初始状态 */
      this.saveOriginState();

      /** 调用自定义方法 */
      if(afterChangeFunction) {
        afterChangeFunction();
      }

      /** 重新开启远程保存 */
      timer(2000).subscribe(() => this.isSaveToRemote = true);

    });
  }

  getState(): Observable<any[]> {
    const localState = JSON.parse(localStorage.getItem(this.tabStateKey)) || this.columnApi.getColumnState();
    return new Observable<any[]>(subscriber => {
      this.tabService.getByRemote(this.tabStateKey).subscribe(result => {
        if (result.code === 200 && result.data !== null && result.data !== undefined && result.data !== '') {
          const remoteState = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
          subscriber.next(remoteState);
          subscriber.complete();
        }
        subscriber.next(localState);
        subscriber.complete();
      });
    });
  }

  /**
   * 保存状态
   * 如果是恢复状态触发的则不保存
   */
  saveState() {
    const state = this.columnApi.getColumnState();
    this.tabService.save(this.tabStateKey, state);
    if (this.isSaveToRemote) {
      this.tabService.saveByRemote(this.tabStateKey, JSON.stringify(state)).subscribe();
    }
  }

  /**
   * 仅页面刷新或第一次进来才保存原始状态
   */
  saveOriginState() {
    if (this.originIndex) {
      this.originIndex = false;
      this.tabService.save(this.tabOriginStateKey, this.columnApi.getColumnState());
    }
  }

  /**
   * 保存grid程序初始的列初始设定和原始值一样，只保存一次
   */
  saveDefinedState(): void {
    if (this.originIndex) {
      this.tabService.save(this.tabDefinedStateKey, this.columnApi.getColumnState());
    }
  }
}
