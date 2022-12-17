import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[autoHeight]',
})
export class AutoHeightDirective implements AfterViewInit {

  /** 高度值，超过该高度调用滚动条，否则不出现（搭配<ng-scrollbar>使用） */
  @Input() fixedHeight = 100;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    /** 需等页面加载完后才能捕获父元素高度 */
    setTimeout(() => {
      if (this.el.nativeElement.offsetHeight < this.fixedHeight) {
        this.renderer.setStyle(this.el.nativeElement, 'height', 'auto');
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'height', `${this.fixedHeight}px`);
      }
    });
  }
}
