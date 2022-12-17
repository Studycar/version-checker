import Konva from 'konva';
import { Util } from '@shared/components/ganttChart/lib/util/Util';

export class Xaxis {
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
        stroke: 'transparent',
        strokeWidth: 0,
        perfectDrawEnabled: false,
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
      },
      text: {
        fill: '#000',
        align: 'left',
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
  private data: XaxisCellInf[];
  private cells;
  private options = null;
  public group;

  constructor(util: Util) {
    this.util = util;
  }

  public init(options = null, createNewGroup = true) {
    if (options) {
      this.options = options;
    }
    if (createNewGroup) {
      this.group = new Konva.Group({ id: 'xAxis', x: this.util.x.startX, y: this.util.x.startY });
    }
    this.data = this.processData();
    this.cells = this.createXAxisCell();
    this.util.x.realWidth = this.data.length;
    this.cellsAddToGroup();
  }

  public drawXAxisWithLazyLoad(): void {
    this.init(null, false);
  }

  public getData(): XaxisCellInf[] {
    return this.data;
  }

  private processData(): XaxisCellInf[] {
    const inf: XaxisCellInf[] = [];

    const date = this.util.time.getDates();
    const day = date.date;
    const week = date.week;
    const hour = date.hour;

    const startX = this.util.x.preLoadRang.startX;
    const endX = this.util.x.preLoadRang.endX;

    const cellWidth = this.util.x.cellWidth;
    const cellHeight = this.util.x.cellHeight;
    const timeType = this.util.time.getTimeInf().timeType;
    let i = startX === 0 ? startX : Math.floor(startX / cellWidth);
    let len = Math.floor(endX / cellWidth);
    let j = i;

    /** 以下为争对timeType为h的处理 */
    let h = 0;
    let hLen = 0;
    /** 起始天 */
    let startDay = 0;
    /** 终结天 */
    if (timeType === 'h') {
      h = i % 24;
      hLen = len % 24 === 0 ? 24 : len % 24;
      startDay = i = i === 0 ? i : Math.floor(i / 24);
      len = Math.ceil(len / 24);
    }

    for (; i < len; i++) {
      if (timeType === 'h') {
        /** 判断是否起点天，取小时的起点 */
        let hh = startDay === i ? h : 0;
        /** 判断是否终点天，取小时的终点 */
        let ll = len - 1 === i ? hLen : 24;
        for (; hh < ll; hh++) {
          let name = `${day[i]}(${week[i]})\n${hour[hh]}`;
          inf.push({
            id: `${day[i]}${week[i]}${hour[hh]}`,
            name: 'xcell',
            x: cellWidth * j++,
            y: this.util.x.startY,
            width: cellWidth,
            height: cellHeight,
            text: name,
            fullDate: date.fullDate[i],
          });
        }
      } else if (timeType === 'd') {
        let name = `${day[i]}\n(${week[i]})`;
        inf.push({
          id: `${day[i]}${week[i]}`,
          name: 'xcell',
          x: cellWidth * j++,
          y: this.util.x.startY,
          width: cellWidth,
          height: cellHeight,
          text: name,
          fullDate: date.fullDate[i],
        });
      }
    }
    return inf;
  }

  private createXAxisCell(): any[] {
    const cells = [];
    const config = {
      group: { ...Xaxis.defaultOptions.style.group },
      rect: { ...Xaxis.defaultOptions.style.rect, ...this.options.cell.rect },
      text: { ...Xaxis.defaultOptions.style.text, ...this.options.cell.text },
    };
    this.data.forEach((inf: XaxisCellInf) => {
      const group = this.createGroup(inf, config);
      const rect = this.createRect(inf, config);
      const text = this.createText(inf, config);
      const timeDial = this.createTimeDial(inf.width, inf.height);
      group.add(rect);
      group.add(text);
      group.add(timeDial);
      cells.push(group);
    });
    return cells;
  }

  private createGroup(inf: XaxisCellInf, config) {
    const group: Konva.Group = new Konva.Group({
      ...config.group,
      id: inf.id,
      name: inf.name,
      x: inf.x,
      y: inf.y,
    });
    return group;
  }

  private createRect(inf: XaxisCellInf, config) {
    const rect: Konva.Rect = new Konva.Rect({
      ...config.rect,
      width: inf.width,
      height: inf.height,
    });
    return rect;
  }

  private createText(inf: XaxisCellInf, config) {
    const text: Konva.Text = new Konva.Text({
      ...config.text,
      width: inf.width,
      height: inf.height,
      text: inf.text,
      offsetY: this.util.time.getTimeInf().timeType === 'd' ? 4 : 0,
    });
    return text;
  }

  private createTimeDial(width, y = 0) {
    const timeFormatType = this.util.time.getTimeInf().timeType;
    const timeInterval = timeFormatType === 'd' ? 24 : 6;
    const average = Number((width / timeInterval).toFixed(2));
    const group = new Konva.Group();
    for (let i = 1; i < timeInterval; i++) {
      let line, y2, color;
      if (i % 4 === 0 && timeFormatType !== 'h') {
        y2 = 4;
        let text = new Konva.Text({
          text: String(i),
          fill: 'black',
          x: i * average - 6.5,
          y: y - y2 - 9,
          fontSize: 10,
          align: 'center',
          width: 14,
        });
        group.add(text);
        color = 'black';
      } else {
        y2 = 2;
        color = 'red';
      }
      line = new Konva.Line({
        points: [i * average, y, i * average, y - y2],
        stroke: color,
        strokeWidth: 1,
      });
      group.add(line);
    }
    return group;
  }

  private cellsAddToGroup() {
    this.cells.forEach((group: Konva.Group) => {
      this.group.add(group);
    });
  }

}

interface XaxisCellInf {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fullDate: string;
}
