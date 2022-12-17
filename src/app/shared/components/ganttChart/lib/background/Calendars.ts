import { Util } from '@shared/components/ganttChart/lib/util/Util';
import Konva from 'konva';

export class Calendars {
  private data: CalendarCellInf[] = [];
  private cells: any[];
  readonly util: Util;

  public group;

  constructor(util: Util) {
    this.util = util;
  }

  public init(data = null, createNewGroup = true) {
    if(createNewGroup){
      this.group = new Konva.Group({
        id: 'calendars',
      });
    }
    this.processData(data);
    this.cells = this.createCalendarCell();
    this.cellsAddToGroup();
  }

  private processData(data) {
    const util = this.util;
    const startX = util.x.preLoadRang.startX;
    const endX = util.x.preLoadRang.endX;

    data.forEach(d => {
      const start = util.x.getTimeFromStartTimeWidth(d.start);
      const width = util.x.getBetweenTimeWidth(d.start, d.end);
      const end = start + width;
      if (end < startX || start > endX) return;
      const inf = {
        height: util.y.cellHeight,
        width,
        x: start,
        y: util.y.getYPosition(d.productLine),
        fill: d.color,
      };
      this.data.push(inf);
    });
  }

  private createCalendarCell(): any[] {
    const cells = [];
    this.data.forEach(inf => {
      const rect = this.createRect(inf);
      cells.push(rect);
    });
    return cells;
  }

  private createRect(inf: CalendarCellInf) {
    const rect = new Konva.Rect({
      x: inf.x,
      y: inf.y,
      height: inf.height,
      width: inf.width,
      fill: inf.fill,
    });
    return rect;
  }

  private cellsAddToGroup() {
    this.cells.forEach(c => this.group.add(c));
  }
}

interface CalendarCellInf {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string,
}
