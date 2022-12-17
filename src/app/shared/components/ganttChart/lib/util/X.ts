import { Util } from '@shared/components/ganttChart/lib/util/Util';
import { Time, TimeInf } from '@shared/components/ganttChart/lib/util/Time';

export class X {
  private util: Util;

  private _oldCellWidth = 0;
  private _cellWidth = 0;
  private _cellHeight = 10;
  private _realWidth = 0;

  private _min = 1440;
  public startX = 100;
  public startY = 0;
  public totalWidth = 0;
  public preLoadRang: PreLoadRang;
  public totalWorkOrder = 0;

  constructor(util: Util) {
    this.util = util;
  }

  set oldCellWidth(n: number) {
    this._oldCellWidth = n;
  }

  get oldCellWidth(): number {
    return this._oldCellWidth;
  }

  set cellWidth(n: number) {
    this._cellWidth = n;
  }

  get cellWidth(): number {
    return this._cellWidth;
  }

  set cellHeight(n: number) {
    this._cellHeight = n;
  }

  get cellHeight(): number {
    return this._cellHeight;
  }

  set realWidth(len) {
    this._realWidth = len * this.cellWidth;
  }

  get realWidth() {
    return this._realWidth;
  }

  setMin(type: string) {
    if (type === 'h') {
      this._min = 60;
    } else if (type === 'd') {
      this._min = 1440;
    }
  }

  get min(): number {
    return this._min;
  }

  get baseMinWidth(): number {
    return this.cellWidth / this._min;
  }

  public init(options: xOption, workOrder: any[]): void {
    const util = this.util;
    if (options.x) {
      this.startX = options.x;
    }
    if (options.y) {
      this.startY = options.y;
    }
    workOrder.forEach(gy => this.totalWorkOrder += gy.tasks.length);
    this.cellHeight = options.cell.height;
    this.setMin(util.time.getTimeInf().timeType);
    this.cellWidth = this.calculateCellWidth(util.time.getTimeInf(), util.dom.width, util.y.cellWidth, util.time.getDates().date.length);
    this.totalWidth = this.calculateTotalWidth(util.time);
    this.setPreLoadRang();
  }

  public setPreLoadRang() {
    this.preLoadRang = this.calculatePreloadRang();
  }

  public calculateCellWidth(timeInf: TimeInf, outerWidth: number, yWidth: number, curTimeNum: number): number {
    curTimeNum = timeInf.timeType === 'h' ? curTimeNum * 24 : curTimeNum;
    return Math.floor((outerWidth - yWidth) / (+timeInf.timeNum > curTimeNum ? curTimeNum : timeInf.timeNum));
  }

  public calculatePreloadRang(): PreLoadRang {
    const timeNum = this.util.time.getTimeInf().timeNum;
    let preloadEle = 10;
    if (timeNum < 2) {
      preloadEle = 1;
    } else if (timeNum < 4) {
      preloadEle = 2;
    } else if (timeNum > 3 && timeNum < 7) {
      preloadEle = 6;
    }
    const perLoadEleWidth = preloadEle * this.cellWidth;
    const screenEleWidth = this.util.time.getTimeInf().timeNum * this.cellWidth;
    const miniPreloadWidth = screenEleWidth + perLoadEleWidth;
    let sx = this.util.dom.getScrollDom().scrollLeft;
    sx = Math.floor(sx / this.cellWidth) * this.cellWidth;
    let ex = sx + perLoadEleWidth + screenEleWidth;

    if (sx > 0) {
      sx -= perLoadEleWidth;
      if (sx < 0) {
        sx = 0;
      } else if (this.totalWidth - sx < miniPreloadWidth) {
        sx = this.totalWidth - miniPreloadWidth;
      }
    }

    if (sx === 0) {
      ex += perLoadEleWidth;
    }
    if (ex > this.totalWidth) {
      ex = this.totalWidth;
    }

    return { startX: sx, endX: ex };

  }

  public calculateTotalWidth(time: Time): number {
    return time.getDates().date.length * this.cellWidth * time.getTimeInf().timeSize;
  }


  public getTimeFromStartTimeWidth(time: Date) {
    return this.getBetweenTimeWidth(this.util.time.getStartDate(), time);
  }

  public getBetweenTimeWidth(startDate: Date, endData: Date) {
    return +(((new Date(endData).getTime() - new Date(startDate).getTime()) / 60 / 1000) * this.baseMinWidth).toFixed(2);
  }
}

export interface xOption {
  x?: number;
  y?: number;
  height: number;
  cell: { height?: number, rect: object, text: object }
}

export interface PreLoadRang {
  startX: number;
  endX: number;
}
