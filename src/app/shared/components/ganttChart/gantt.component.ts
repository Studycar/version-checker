import { Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Gantt } from '@shared/components/ganttChart/lib/Gantt';
// import { GanttService } from '@shared/components/gantt/gantt.service';

@Component({
  selector: 'gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GanttComponent implements OnInit {
  @Input() options: object;

  private gantt: Gantt = new Gantt();


  constructor(
    // private ganttServices: GanttService,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit() {
    this.options = {};
    // this.options = this.ganttServices.getOption();
    const scrollDom: HTMLElement = this.el.nativeElement.querySelector('.scroll-box');
    const outerDom: HTMLElement = this.el.nativeElement.querySelector('.outbox');
    const container = this.el.nativeElement.querySelector('#container');
    const width = scrollDom.offsetWidth;
    const height: number = document.documentElement.clientHeight - scrollDom.getBoundingClientRect().top;

    this.gantt.init({
      stageConfig: {
        container,
        width,
        height,
        x: .5,
        y: .5,
      },
      scrollDom,
      outerDom,
      options: this.options,
    });
    if (this.options) {
      this.gantt.setOption(this.options);
      this.gantt.render().subscribe();
    }
  }

  setOption(options): void {
    this.gantt.setOption(options);
    this.gantt.render().subscribe();
  }

}
