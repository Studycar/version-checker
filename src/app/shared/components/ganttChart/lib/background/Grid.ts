import Konva from 'konva';
import { Util } from '@shared/components/ganttChart/lib/util/Util';
import { Xaxis } from '@shared/components/ganttChart/lib/axis/Xaxis';
import { Yaxis } from '@shared/components/ganttChart/lib/axis/Yaxis';

export class Grid {
  private static defaultOptions = {
    style: {
      line: {
        stroke: '#c9c9c9',
        strokeWidth: 1,
      },
    },
  };

  private util: Util;
  private data: LineCellInf[] = [];
  private cells: any[];
  private xaxis: Xaxis;
  private yaxis: Yaxis;

  public group;

  constructor(util: Util, axis) {
    this.util = util;
    this.xaxis = axis.getXaxis();
    this.yaxis = axis.getYaxis();
  }

  init() {
    this.group = new Konva.Group({ id: 'grid' });
    this.processData();
    this.cells = this.createGridCell();
    this.cellsAddToGroup();
  }

  processData() {
    const xEndY = this.util.y.cellHeight * this.yaxis.getData().length;
    const yStartX = this.util.x.preLoadRang.startX;
    const yEndX = this.util.x.preLoadRang.endX;
    this.xaxis.getData().forEach(d => {
      const inf = {
        startX: d.x,
        endX: d.x,
        startY: 0,
        endY: xEndY,
      };
      this.data.push(inf);
    });

    this.yaxis.getData().forEach(d => {
      const inf = {
        startX: yStartX,
        endX: yEndX,
        startY: d.y,
        endY: d.y,
      };
      this.data.push(inf);
    });
  }

  createGridCell() {
    const lineCells = [];
    const config = {
      line: { ...Grid.defaultOptions.style.line },
    };
    this.data.forEach(inf => {
      const line = this.createLine(inf, config);
      lineCells.push(line);
    });

    return lineCells;
  }

  createLine(inf: LineCellInf, config) {
    const line = new Konva.Line({
      ...config.line,
      name: 'line',
      points: [inf.startX, inf.startY, inf.endX, inf.endY],
    });
    return line;
  }

  cellsAddToGroup() {
    this.cells.forEach(c => this.group.add(c));
  }
}

interface LineCellInf {
  startX: number,
  endX: number,
  startY: number,
  endY: number,
}
