import { Xaxis } from '@shared/components/ganttChart/lib/axis/Xaxis';
import { Yaxis } from '@shared/components/ganttChart/lib/axis/Yaxis';
import { Diagonal } from '@shared/components/ganttChart/lib/axis/Diagonal';
import Konva from 'konva';
import { Util } from '@shared/components/ganttChart/lib/util/Util';

export class Axis {
  private util: Util;
  private layer = new Konva.Layer({ id: 'axisLayer' });
  private xAxis: Xaxis;
  private yAxis: Yaxis;
  private diagonal: Diagonal;

  constructor(util: Util) {
    this.util = util;
    this.xAxis = new Xaxis(util);
    this.yAxis = new Yaxis(util);
    this.diagonal = new Diagonal(util);
  }

  public getXaxis(): Xaxis {
    return this.xAxis;
  }

  public getYaxis(): Yaxis {
    return this.yAxis;
  }

  public init(xOptions, yOptions, dOptions) {
    this.xAxis.init(xOptions);
    this.yAxis.init(yOptions);
    this.diagonal.init(dOptions);
  }

  public draw(stage) {
    this.layer.add(this.xAxis.group);
    this.layer.add(this.yAxis.group);
    this.layer.add(this.diagonal.group);
    stage.add(this.layer);
  }

  public drawWorkOrderWithLazyLoad(scrollLeft) {
    this.xAxis.group.destroyChildren();
    this.xAxis.drawXAxisWithLazyLoad();
    this.yAxis.group.x(scrollLeft);
    this.diagonal.group.x(scrollLeft);
  }
}
