import { Util } from '@shared/components/ganttChart/lib/util/Util';

export class Y {
  private util: Util;

  public oldCellHeight = 0;
  public cellHeight = 0;
  public cellWidth = 0;
  public startX = 0;
  public startY = 50;
  public totalHeight = 0;
  public realHeight = 0;
  private yAxisPositions: { [productline: string]: number } = {};
  private cells: any[] = [];

  constructor(util: Util) {
    this.util = util;
  }

  public init(options: yOption): void {
    if (options.x) {
      this.startX = options.x;
    }

    if (options.y) {
      this.startY = options.y;
    }
    this.cellWidth = options.cell.width;
    this.cellHeight = options.cell.height;
    this.processData(options.data);
  }

  private processData(data: YaxisData[]) {
    let i = 0;
    data.forEach(pl => {
      const y = this.cellHeight * i++;
      this.cells.push({
        x: this.startX,
        y,
        text: pl.name + (pl.tips && pl.drawTips ? `\n${pl.tips}` : ''),
      });
      this.yAxisPositions[pl.name] = y;
      pl.children.forEach(cl => {
        const y = this.cellHeight * i++;
        this.cells.push({
          x: this.startX,
          y,
          text: cl.name + (cl.tips && cl.drawTips ? `\n${cl.tips}` : ''),
          parent: cl.name,
        });
        this.yAxisPositions[cl.name] = y;
      });
    });
    this.totalHeight = this.cells.length * this.cellHeight;
  }

  public getYPosition(pl): number | undefined {
    return this.yAxisPositions[pl];
  }
}

export interface yOption {
  x?: number;
  y?: number;
  cell: { height: number, width: number, rect?: object, text?: object };
  data: YaxisData[];
}

export interface YaxisData {
  drawName: boolean;
  name: string;
  drawTips: boolean;
  tips: string;
  children: YaxisData[];
}
