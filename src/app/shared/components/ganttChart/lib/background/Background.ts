import Konva from 'konva';
import { Axis } from '@shared/components/ganttChart/lib/axis/Axis';
import { Util } from '@shared/components/ganttChart/lib/util/Util';
import { Grid } from '@shared/components/ganttChart/lib/background/Grid';
import { Calendars } from '@shared/components/ganttChart/lib/background/Calendars';

export class Background {
  readonly layer;
  private util: Util;
  private grid: Grid;
  private calendars: Calendars;
  private calendarData;

  constructor(util: Util, axis: Axis) {
    this.util = util;
    this.layer = new Konva.Layer({
      id: 'background',
      x: util.x.startX,
      y: util.y.startY,
    });
    this.grid = new Grid(util, axis);
    this.calendars = new Calendars(util);
  }

  public init(calendars) {
    this.calendarData = calendars;
    this.grid.init();
    this.calendars.init(calendars);
  }

  public draw(stage) {
    this.layer.add(this.calendars.group);
    this.layer.add(this.grid.group);
    stage.add(this.layer);
  }

  public drawCalendarsWithLazyLoad(plStartX){
    this.calendars.group.destroyChildren();
    this.calendars.init(this.calendarData, false);
    this.grid.group.x(plStartX);
  }
}
