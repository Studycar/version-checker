import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[adaptiveFullScreen]',
})
export class AdaptiveFullScreenDirective implements OnInit, AfterViewInit, OnDestroy {
  // 开启宽自适应，会计算左边元素宽度，默认开启
  @Input()
  fixedWidth = true;
  // 开启高自适应，会计算上边元素高度，默认开启
  @Input()
  fixedHeight = true;
  // 直接设置宽等于屏幕宽，不会计算左是否还有元素

  /** 当fixedWidth与screenWidth冲突，以screenWidth优先*/
  @Input()
  screenWidth = false;
  // 直接设置高等于屏幕高，不会计算上是否还有元素
  @Input()
  screenHeight = false;

  clientRect: ClientRect | DOMRect;
  screenRect: { width: number, height: number };

  fn = () => this.updateSize();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.fn);
  }

  ngAfterViewInit(): void {
    this.updateSize();
  }

  updateSize() {
    this.screenRect = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
    this.clientRect = this.el.nativeElement.getBoundingClientRect();

    const width = this.screenRect.width - this.clientRect.left;
    const height = this.screenRect.height - this.clientRect.top;

    if (this.fixedWidth) {
      this.renderer.setStyle(this.el.nativeElement, 'width', `${width}px`);
    }
    if (this.fixedHeight) {
      this.renderer.setStyle(this.el.nativeElement, 'height', `${height}px`);
    }
    if (this.screenWidth) {
      this.renderer.setStyle(this.el.nativeElement, 'width', `${this.screenRect.width}px`);
    }
    if (this.screenHeight) {
      this.renderer.setStyle(this.el.nativeElement, 'height', `${this.screenRect.height}px`);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.fn);
  }
}
