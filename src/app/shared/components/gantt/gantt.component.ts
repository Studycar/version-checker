import { Component, Input, OnInit, ViewEncapsulation, Renderer2, ElementRef } from '@angular/core';
import { Gantt } from './js/gantt';
import { GraphicGantt } from './js/esm2015/gantt';

@Component({
  selector: 'aps-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GanttComponent implements OnInit {
  @Input('options') ganttOptions: object;

  ganttChart: Gantt = new GraphicGantt();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {

  }

  ngOnInit() {
    const scrollBox = this.el.nativeElement.querySelector('.scroll-box');
    const width = scrollBox.offsetWidth;

    if (width > 0) {
      this.init();
    }
  }

  init() {
    const scrollBox = this.el.nativeElement.querySelector('.scroll-box');
    const container = this.el.nativeElement.querySelector('#container');
    const width = scrollBox.offsetWidth;
    const height = document.documentElement.clientHeight - scrollBox.getBoundingClientRect().top;
    const ganttChart = this.ganttChart;

    ganttChart.init({
      container,
      width,
      height,
      x: .5,
      y: .5,
    }, '.scroll-box', '.outbox', { lazyLoad: true }, this.el);
    if (this.ganttOptions) {
      ganttChart.setOption(this.ganttOptions);
      ganttChart.render();
    }
  }

  setOption(ganttOptions: object) {
    const ganttChart = this.ganttChart;
    if (ganttOptions) {
      ganttChart.reset();
      ganttChart.setOption(ganttOptions);
      ganttChart.render();
    }
  }

  setTimeFormat(timeFormat: string) {
    this.ganttChart.setTimeFormat(timeFormat);
  }

  resetWorkOrderStatus(status: string, option: any, filterFn?) {
    this.ganttChart.resetWorkOrderStatus(status, option, filterFn);
  }

  filterWorkOrderById(id) {
    this.ganttChart.filterWorkOrderById(id);
  }

  filterWorkOrderByFlag(flag) {
    this.ganttChart.filterWorkOrderByFlag(flag);
  }

  filterWorkOrderByField(value, field) {
    this.ganttChart.filterWorkOrderByField(value, field);
  }

  filterProductionLine(productionLine: string[]) {
    this.ganttChart.filterProductionLine(productionLine);
  }

  setWorkOrderContent(fields: boolean[]) {
    this.ganttChart.setWorkOrderContent(fields);
  }

  getSeletctedCells() {
    return this.ganttChart.getSeletctedCells();
  }

  getSelectedY() {
    return this.ganttChart.getSelectedY();
  }

  setScrollLeftByTime(time) {
    this.ganttChart.setScrollLeftByTime(time);
  }

  setWorkOrderDragable(name, dragable) {
    this.ganttChart.setWorkOrderDragable(name, dragable);
  }

  getLatest() {
    return this.ganttChart.getLatest();
  }
}
