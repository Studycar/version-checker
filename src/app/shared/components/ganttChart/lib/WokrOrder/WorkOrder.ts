import Konva from 'konva';
import { Util } from '@shared/components/ganttChart/lib/util/Util';

export class WorkOrder {
  private static defaultOptions = {
    style: {
      group: {
        offsetY: -5, //工单距离上下边线的距离
        perfectDrawEnabled: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
      },
      rect: {
        fill: '#b8c2cc',
        height: 40,
        shadowColor: 'transparent',
        transformsEnabled: 'none',
        gradient: true, // 是否渐变,默认开启，即为fill到fill透明的渐变,
        perfectDrawEnabled: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
      },
      text: {
        wrap: 'none',
        lineHeight: 1.2,
        verticalAlign: 'middle',
        fontFamily: '微软雅黑',
        fontWeight: '100',
        fill: '#f8fbff',
        offsetX: -8,
        height: 40,
        transformsEnabled: 'none',
        perfectDrawEnabled: false,
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
      },
      exception: {
        width: 2,
        fill: '#e76f6f',
        transformsEnabled: 'none',
        perfectDrawEnabled: false,
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
      },
      progress: {
        height: 2,
        fill: '#4079d0',
        perfectDrawEnabled: false,
        listening: false,
        hitStrokeWidth: 0,
        shadowForStrokeEnabled: false,
      },
      movable: {
        numPoints: 5,
        innerRadius: 5,
        outerRadius: 8,
        fill: 'red',
        strokeWidth: 0,
        transformsEnabled: 'none',
        perfectDrawEnabled: false,
        hitStrokeWidth: 0,
        listening: false,
        shadowForStrokeEnabled: false,
      },
    },
  };
  private util: Util;
  private layers: Konva.Layer[] = [];
  private startX = 50;
  private startY = 100;
  private dragLayer: Konva.Layer;
  private series;

  /** 生成的工单元素 */
  private cells = [];

  /** 处理后的数据 */
  private data = [];

  constructor(util: Util) {
    this.util = util;
  }

  public init(data: any[] | null = null, createNew = true) {
    if (data) {
      this.series = data;
    }
    this.startX = this.util.y.cellWidth;
    this.startY = this.util.x.cellHeight;
    if (createNew) {
      this.dragLayer = new Konva.Layer({
        name: 'dragLayer',
        x: this.startX,
        y: this.startY,
      });
    }
    this.data = this.processData(this.series);
    this.cells = this.createWorkOrder();
    this.cellAddToLayers();
  }

  public draw(stage, createNew = true) {
    this.layers.forEach(layer => stage.add(layer));
    createNew && stage.add(this.dragLayer);
  }

  public drawWorkOrderWithLazyLoad(stage) {
    this.destroyAllLayers();
    this.layers = [];
    this.init(null, false);
    this.draw(stage, false);
  }

  public destroyAllLayers() {
    this.layers.forEach(layer => layer.destroy());
  }

  private processData(data: any[]): WOInf[] {
    const cells: WOInf[] = [];
    data.forEach((order, od) => {
      const tasks = order.tasks;
      const belong = order.belong;
      tasks.forEach((task, td) => {
        const y = this.util.y.getYPosition(task.productLine);
        const from = this.util.x.getTimeFromStartTimeWidth(task.from);
        const width = this.util.x.getBetweenTimeWidth(task.from, task.to);
        const end = from + width;
        if (this.util.lazyLoad) {
          if (end < this.util.x.preLoadRang.startX || from > this.util.x.preLoadRang.endX) return;
        }
        cells.push({
          id: task.id,
          name: `${task.flag} ${belong}`,
          productLine: task.productLine,
          y: y,
          x: from,
          width,
          height: this.util.y.cellHeight,
          originData: task,
          dimension: { od, td }, //在原始数组所处的维度
          exception: task.exception, //例外
          progress: task.progress, //完成百分比
          movable: task.movable, // 固定
          text: this.util.text.getDisplayText(task.taskTooltipsContent),
          layer: null,
        });
      });
    });
    return cells;
  }

  private createWorkOrder(): any[] {
    const cells: Konva.Group[] = [];
    this.data.forEach(inf => {
      const config = { ...WorkOrder.defaultOptions.style, ...inf.originData.style };
      const group = this.createGroup(inf, config);
      const rect = this.createRect(inf, config);
      const text = this.createText(inf, config);
      const progress = this.createProgress(inf, config);

      group.add(rect);
      group.add(progress);
      group.add(text);

      if (inf.exception.warnningFlag) {
        const exception: Konva.Rect = this.createException(inf, config);
        group.add(exception);
      }

      /** 是否可拖动*/
      if (!inf.movable) {
        const movable = this.createMovable(inf, config);
        group.add(movable);
      }

      cells.push(group);
    });

    return cells;
  }

  private createGroup(inf: WOInf, config) {

    const group = new Konva.Group({
      ...config.group,
      id: inf.id,
      name: inf.name,
      x: inf.x,
      y: inf.y,
      height: inf.height,
      width: inf.width,
      draggable: inf.movable,
      stroke: '#000',
      transformsEnabled: 'position',
      dragBoundFunc: pos => {
        const oldY = group.getAbsolutePosition().y;
        const newY = pos.y;
        let directionY = 'none';
        let y = oldY;
        if (newY > oldY) {
          directionY = 'down';
        } else if (newY < oldY) {
          directionY = 'up';
        }

        /** 是否能拖动到相应的Y轴判断 */
        if (inf.originData.moResCodePriorities) {
          const mm = inf.originData.moResCodePriorities;
          const halfHeight = Math.floor(inf.height / 2);
          for (let m = 0, ml = mm.length; m < ml; m++) {
            let name = mm[m].key;
            let produceLineY = this.util.y.getYPosition(name);
            if (!produceLineY) continue;
            if (directionY === 'down') {
              if (newY + inf.height > produceLineY + this.startY + halfHeight && newY + inf.height < produceLineY + this.startY + inf.height) {
                y = produceLineY + this.startY;
                inf.productLine = name;
                break;
              }
            } else if (directionY === 'up') {
              if (newY > produceLineY + this.startY && newY < produceLineY + this.startY + halfHeight) {
                y = produceLineY + this.startY;
                inf.productLine = name;
                break;
              }
            }
          }
        }

        return {
          x: pos.x,
          y: y,
        };
      },
    });

    /** 工单拖动优化，将工单移去拖动层 */
    group.on('mousedown', evt => {
      const group = evt.currentTarget;
      if (group.draggable() === false || inf.layer !== null) return;
      inf.layer = group.getLayer();
      group.moveTo(this.dragLayer);
      inf.layer.draw();
      this.dragLayer.draw();
      group.startDrag();
    });

    /** 工单拖动优化，将工单移回原来所在层 */
    group.on('dragend', evt => {
      if (inf.layer !== null) {
        group.moveTo(inf.layer);
        inf.layer.draw();
        inf.layer = null;
        this.dragLayer.draw();
        group.stopDrag();
      }
    });

    group.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
    group.on('mouseout', function() {
      document.body.style.cursor = 'default';
    });

    return group;
  }

  private createRect(inf: WOInf, config) {
    const height = inf.height + config.group.offsetY * 2;
    let rectConfig: Konva.RectConfig = {
      id: 'bg',
      width: inf.width,
      height,
    };
    if (config.rect.gradient) {
      rectConfig = {
        ...config.rect,
        ...rectConfig,
        fillLinearGradientStartPoint: {
          x: 0,
          y: 0,
        },
        fillLinearGradientEndPoint: {
          x: inf.width,
          y: height,
        },
        fillLinearGradientColorStops: [0, this.util.hex2decimal(config.rect.fill, 1), 1, this.util.hex2decimal(config.rect.fill)],
      };
      delete rectConfig.fill;
    } else {
      rectConfig = {
        ...config.rect,
        ...rectConfig,
      };
    }
    const rect = new Konva.Rect(rectConfig);
    return rect;
  }

  private createText(inf: WOInf, config) {

    const text: Konva.Text = new Konva.Text({
      ...config.text,
      id: 'text',
      text: inf.text,
      width: inf.width + config.text.offsetX,
      height: inf.height + config.group.offsetY * 2,
    });
    return text;
  }

  private createProgress(inf: WOInf, config) {
    const percent: number = inf.progress.percent;
    const y = inf.height + config.group.offsetY * 2 - config.progress.height;
    const progress: Konva.Rect = new Konva.Rect({
      ...config.progress,
      id: 'progress',
      width: percent === 0 ? 0 : inf.width * percent / 100,
      y,
      fill: config.progress.color || config.progress.fill,
    });
    return progress;
  }

  private createException(inf: WOInf, config) {
    const height = inf.height + config.group.offsetY * 2;
    const exception = new Konva.Rect({
      ...config.exception,
      id: 'exception',
      height: height,
    });
    return exception;
  }

  private createMovable(inf: WOInf, config) {
    const movable: Konva.Star = new Konva.Star({
      ...config.movable,
      id: '*',
    });
    return movable;
  }

  private cellAddToLayers() {
    let layer;
    this.cells.forEach((c: Konva.Group, i: number) => {
      if (i % 2000 === 0) {
        layer = new Konva.Layer({
          name: 'workOrder',
          x: this.startX,
          y: this.startY,
        });
        this.layers.push(layer);
      }
      layer.add(c);
    });
  }
}

interface WOInf {
  id: string;
  name: string;
  productLine: string;
  y: number;
  x: number;
  width: number;
  height: number;
  originData: any;
  dimension: { od: number, td: number };
  exception: { warning: boolean, color: string }
  progress: { percent: number, color: string, fill?: string };
  movable: boolean,
  text: string;
  layer: null | Konva.Layer;
}
