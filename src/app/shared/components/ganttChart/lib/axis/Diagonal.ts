import Konva from 'konva';
import { Util } from '@shared/components/ganttChart/lib/util/Util';

export class Diagonal {
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
        stroke: '#d2d2d2',
        fill: '#ecfdff',
        strokeWidth: 1,
        perfectDrawEnabled: false,
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
      },
      text: {
        transformsEnabled: 'none',
        wrap: 'none',
        lineHeight: 1.2,
        verticalAlign: 'middle',
        fontFamily: '微软雅黑',
        fontWeight: '100',
        fill: '#b8bbbe',
        padding: 4,
        align: 'center',
        text: '工序工单共:',
        perfectDrawEnabled: false,
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
      },
    },
  };


  private util: Util;
  public group;
  private data;
  private cell;

  constructor(util: Util) {
    this.util = util;
  }

  public init(options) {
    this.group = new Konva.Group({ id: 'diagonal', x: this.util.y.startX, y: this.util.x.startY });
    this.data = this.processData();
    this.cell = this.createDiagonalCell(options);
    this.cellAddToGroup();
  }

  private processData() {
    return {
      width: this.util.y.cellWidth,
      height: this.util.x.cellHeight,
    };
  }

  private createDiagonalCell(options): Konva.Group {
    const inf = this.data;
    const config = {
      group: { ...Diagonal.defaultOptions.style.rect },
      rect: { ...Diagonal.defaultOptions.style.rect, ...options.style.rect },
      text: { ...Diagonal.defaultOptions.style.text, text: options.style.text },
    };
    const group: Konva.Group = this.createGroup(inf, config);
    const rect: Konva.Rect = this.createRect(inf, config);
    const text: Konva.Text = this.createText(inf, config);

    group.add(rect);
    group.add(text);

    return group;
  }

  private createGroup(inf, config): Konva.Group {
    const group = new Konva.Group({
      ...config.group,
      width: inf.width,
      height: inf.height,
    });
    return group;
  }

  private createRect(inf, config): Konva.Rect {
    const rect = new Konva.Rect({
      ...config.rect,
      width: inf.width,
      height: inf.height,
    });
    return rect;
  }

  private createText(inf, config): Konva.Text {
    const str = `${config.text.text}\n${this.util.x.totalWorkOrder}`;
    const text = new Konva.Text({
      ...config.text,
      width: inf.width,
      height: inf.height,
      text: str,
    });
    return text;
  }

  private cellAddToGroup() {
    this.group.add(this.cell);
  }
}
