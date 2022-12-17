import Konva from 'konva';
import { Util } from '@shared/components/ganttChart/lib/util/Util';
import { YaxisData } from '@shared/components/ganttChart/lib/util/Y';

export class Yaxis {
  private static defaultOptions = {
    style: {
      group: {
        perfectDrawEnabled: false,
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
      },
      rect: {
        transformsEnabled: 'none',
        fill: '#fff',
        stroke: '#dfe3e6',
        strokeWidth: 1,
        perfectDrawEnabled: false,
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
      },
      text: {
        transformsEnabled: 'none',
        fill: '#000',
        align: 'right',
        verticalAlign: 'middle',
        fontSize: 12,
        warp: 'none',
        lineHeight: 1.2,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        perfectDrawEnabled: false,
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
      },
    },
  };

  private util: Util;
  public group;
  private data: YaxisCellInf[];
  private cells;

  constructor(util: Util) {
    this.util = util;
  }

  public init(options) {
    this.group = new Konva.Group({ id: 'yAxis', x: this.util.y.startX, y: this.util.y.startY });
    this.data = this.processData(options.data);
    this.cells = this.createYAxisCell(options);
    this.cellsAddToGroup();
  }

  public processData(data: YaxisData[]): YaxisCellInf[] {
    const inf: YaxisCellInf[] = [];
    const cellWidth = this.util.y.cellWidth;
    const cellHeight = this.util.y.cellHeight;
    let j = 0;
    data.forEach((gy: YaxisData) => {
      if (gy.drawName) {
        inf.push({
          id: gy.name,
          name: 'ycell',
          x: this.util.y.startX,
          y: cellHeight * j++,
          width: cellWidth,
          height: cellHeight,
          text: gy.name,
          tips: gy.drawTips && gy.tips.replace('-', '_'),
        });
      }
      gy.children && gy.children.forEach((pl: YaxisData) => {
        if (pl.drawName) {
          inf.push({
            id: pl.name,
            name: 'ycell',
            x: this.util.y.startX,
            y: cellHeight * j++,
            width: cellWidth,
            height: cellHeight,
            text: pl.name,
            tips: pl.drawTips && pl.tips.replace('-', '_'),
          });
        }
      });
    });
    return inf;
  }

  public getData(): YaxisCellInf[] {
    return this.data;
  }

  private createYAxisCell(options): Konva.Group[] {
    const cells: Konva.Group[] = [];
    const config = {
      group: { ...Yaxis.defaultOptions.style.group },
      rect: { ...Yaxis.defaultOptions.style.rect, ...options.cell.rect },
      text: { ...Yaxis.defaultOptions.style.text, ...options.cell.text },
    };
    this.data.forEach((inf: YaxisCellInf) => {
      const group = this.createGroup(inf, config);
      const rect = this.createRect(inf, config);
      const text = this.createText(inf, config);

      group.add(rect);
      group.add(text);

      cells.push(group);
    });
    return cells;
  }

  private createGroup(inf: YaxisCellInf, config): Konva.Group {
    const group = new Konva.Group({
      ...config.group,
      id: inf.id,
      name: inf.name,
      x: inf.x,
      y: inf.y,
    });
    return group;
  }

  private createRect(inf: YaxisCellInf, config): Konva.Rect {
    const rect = new Konva.Rect({
      ...config.rect,
      width: inf.width,
      height: inf.height,
    });
    return rect;
  }

  private createText(inf: YaxisCellInf, config): Konva.Text {
    const textStr = inf.text + (inf.tips ? `\n${inf.tips}` : '');
    const text = new Konva.Text({
      ...config.text,
      width: inf.width,
      height: inf.height,
      text: textStr,
    });
    return text;
  }

  private cellsAddToGroup() {
    this.cells.forEach((group: Konva.Group) => {
      this.group.add(group);
    });
  }
}

interface YaxisCellInf {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  tips?: string;
}
