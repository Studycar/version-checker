import { ElementRef } from '@angular/core';

export declare class Gantt {
  init(params: object, scrollId: string, outId: string, options: object, el: ElementRef): void;

  setOption(option: object): void;

  render(): void;

  reset(): void;

  /** 设置时间格式 */
  setTimeFormat(timeFormat: string): void;

  /** 重设工单状态 */
  resetWorkOrderStatus(status: string, option: object, filterFn?): void;

  /** 过滤产线*/
  filterProductionLine(productLine: string[]): void;

  /** 根据Id过滤工单*/
  filterWorkOrderById(id: string[]): void;

  /** 根据标识过滤工单*/
  filterWorkOrderByFlag(flag: string): void;

  /** 根据字段过滤工单*/
  filterWorkOrderByField(value: string, field: string): void;

  /** 设置工单内容*/
  setWorkOrderContent(fields: boolean[]): void;

  /** 获取选中工单*/
  getSeletctedCells(): object[];

  /** 获取选中Y轴*/
  getSelectedY(): string[];

  /**
   * 根据name控制工单是否可拖动
   * @param {string} name
   * @param {boolean} dragable
   */
  setWorkOrderDragable(name: string | string[], dragable: boolean): void;

  /** 全屏自适应*/
  autoHeight(outBox: HTMLElement, parent?: HTMLElement): void;

  /** 根据日期滚动x轴 */
  setScrollLeftByTime(time: Date): void;

  /**
   * 获取最后拖动的工单
   * @return {object}
   */
  getLatest(): any;
}
