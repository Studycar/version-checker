import Konva from 'konva';
import { StageConfig } from 'konva/types/Stage';

import { fromEvent, Observable } from 'rxjs';

import { WorkOrder } from '@shared/components/ganttChart/lib/WokrOrder/WorkOrder';
import { Util } from '@shared/components/ganttChart/lib/util/Util';
import { Axis } from '@shared/components/ganttChart/lib/axis/Axis';
import ResizeObserver from 'resize-observer-polyfill';
import { debounceTime, tap } from 'rxjs/internal/operators';
import { Background } from '@shared/components/ganttChart/lib/background/Background';


export class Gantt {
  private static defaultOption = {
    WOMultiple: false,
    yAxisMultiple: false,
    xAxis: { x: 0, y: 0 },
    yAxis: { x: 0, y: 0 },
  };

  private readonly util: Util;

  private stage = null;
  private initX = 0;
  private initY = 0;

  private selectedYaxis: any[] = [];
  private selectedWO: any[] = [];

  private axis: Axis;
  private workOrder: WorkOrder;
  private background: Background;

  private draw(scrollLeft?: number): void {
    this.workOrder.draw(this.stage);
    this.background.draw(this.stage);
    this.axis.draw(this.stage);
    this.resetStageSize();
  }

  private clear(): void {
    const stage = this.stage;
    stage.clearCache();
    stage.destroyChildren();
    stage.x(this.initX);
    stage.y(this.initY);
  }

  private loadingShow(): void {
    this.util.dom.getLoadingDom().style.display = 'block';
    this.util.dom.getScrollDom().style.overflow = 'hidden';
  }

  private loadingHidden(): void {
    this.util.dom.getLoadingDom().style.display = 'none';
    this.util.dom.getScrollDom().style.overflow = 'auto';
  }

  private resetStageSize(): void {
    this.util.dom.getFakeDom().style.width = `${this.util.x.totalWidth + this.util.x.startX}px`;
    this.stage.width(this.util.x.realWidth + this.util.x.startX);
    this.stage.height(this.util.y.totalHeight + this.util.y.startY);
  }

  constructor() {
    this.util = new Util();
  }

  public init(config: initConfig): void {
    const width = config.stageConfig.width;
    const height = config.stageConfig.height;

    this.stage = new Konva.Stage(config.stageConfig);
    this.initX = config.stageConfig.x;
    this.initY = config.stageConfig.y;

    this.util.dom.init({ width, height, outerDom: config.outerDom, scrollDom: config.scrollDom });
    this.axis = new Axis(this.util);
    this.background = new Background(this.util, this.axis);
    this.workOrder = new WorkOrder(this.util);
  }

  public render(): Observable<boolean> {
    this.clear();
    this.loadingShow();
    return new Observable<boolean>(subscriber => {
      setTimeout(() => {
        this.draw();
        this.bindEvent();
        this.loadingHidden();
      }, 100);
    });
  }

  public setOption(options): void {
    this.util.text.init(options.fields, options.filedsBoolean);
    this.util.time.init(options.timeRang, options.timeFormat);
    this.util.y.init(options.yAxis);
    this.util.x.init(options.xAxis, options.series);
    this.axis.init(options.xAxis, options.yAxis, options.diagonal);
    this.background.init(options.ganttCalendars);
    this.workOrder.init(options.series);
  }

  private resizeStage() {
    const stage = this.stage;
    stage.width(this.util.x.realWidth + this.util.x.startX);

  }

  /** 绑定自适应屏幕尺寸，懒加载事件 */
  private bindEvent(): void {
    this.dragScroll();
    this.adaptiveScreen();
  }

  private dragScroll(): void {
    const scrollDom = this.util.dom.getScrollDom();
    const scroll = fromEvent(scrollDom, 'scroll');
    const delayScroll = scroll.pipe(tap(x => {
      const stage = this.stage;
      const ele = x.target as HTMLDivElement;
      const sl = ele.scrollLeft;
      const yAxis = stage.find('#yAxis');
      const diagonal = stage.find('#diagonal');
      const axis = stage.find('#axisLayer');
      yAxis.x(sl);
      diagonal.x(sl);
      axis.batchDraw();
    }), debounceTime(100));

    delayScroll.subscribe((x: Event) => {
      const ele = x.target as HTMLDivElement;
      const sl = ele.scrollLeft;
      const fullWidth = this.util.dom.width;
      const totalWidth = this.util.x.totalWidth;
      const yAxisWidth = this.util.x.startX;
      const startX = this.util.x.preLoadRang.startX;
      const endX = this.util.x.preLoadRang.endX;
      if ((sl + fullWidth > yAxisWidth + endX && endX < totalWidth) || (sl < startX && startX !== 0)) {
        this.loadingShow();
        setTimeout(() => this.lazyLoadX(sl), 100);
      }
    });
  }

  private lazyLoadX(scrollLeft: number) {
    console.time('load');
    const rep = /\d+.*px/g;
    const stage = this.stage;
    const container = stage.container();
    const transformStr = container.style.transform;
    let transformVal = transformStr.match(rep) || ['', '0px'];

    const axisLayer = stage.find('#axisLayer');
    const background = stage.find('#background');

    /** 重新计算preload范围*/
    this.util.x.setPreLoadRang();
    this.axis.drawWorkOrderWithLazyLoad(scrollLeft);

    /** 舞台重定位*/
    const stageStartX = this.util.x.preLoadRang.startX;
    transformVal[0] = `${stageStartX}px`;
    stage.x(this.initX - stageStartX).width(this.util.x.realWidth + this.util.x.startX);
    container.style.transform = `translate(${transformVal.join(',')})`;

    this.workOrder.drawWorkOrderWithLazyLoad(stage);
    this.background.drawCalendarsWithLazyLoad(stageStartX);

    background.draw();
    axisLayer.moveToTop().draw();

    this.loadingHidden();
    console.timeEnd('load');
  }

  private adaptiveScreen(): void {
    const body = document.body;
    const outerDom = this.util.dom.getOuterDom();
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect;
        const outBoxTop = outerDom.getBoundingClientRect().top;
        const fullHeight = height - outBoxTop;
        outerDom.style.height = `${fullHeight}px`;
      }
    });
    ro.observe(body);
  }

  public getSelectedWO() {
    return this.selectedWO;
  }

  public getSelectedYaxis() {
    return this.selectedYaxis;
  }

  public setTimeFormat(): void {
  }

  public getLatestWO() {
  }

  public resetWOStatus(status, option, fn): void {
  }

  public filterWOById(id): void {
  }

  public filterWO;


}

export interface initConfig {
  stageConfig: StageConfig;
  scrollDom: HTMLElement;
  outerDom: HTMLElement;
  options: any;
}
