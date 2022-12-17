import { ToolTip } from '@shared/components/ganttChart/lib/util/ToolTip';
import { Util } from '@shared/components/ganttChart/lib/util/Util';

export class Dom {
  private util: Util;
  private _width = 0;
  private _height = 0;

  private fakeDom: HTMLElement = null;
  private outerDom: HTMLElement = null;
  private scrollDom: HTMLElement = null;
  private loadingDom: HTMLElement = null;
  private toolTip: ToolTip = null;

  public static createLoadDom(params: WHConfig): HTMLElement {
    const dom = document.createElement('div');
    const shadowDom = document.createElement('div');
    const loading = document.createElement('div');
    const text = document.createElement('span');
    dom.style.cssText = [
      `width:${params.width}px`,
      `height: 100%`,
      'text-align:center',
      'position:absolute',
      'top:0',
      'left:0',
      'z-index:9999',
      'display:none',
    ].join(';') + ';';
    shadowDom.style.cssText = [
      'width:100%',
      'height:100%',
      'background-color:rgba(0,0,0,.7)',
    ].join(';') + ';';
    loading.style.cssText = [
      'width:50px',
      'height:50px',
      'background-color:#fff',
      'position:absolute',
      'top:50%',
      'left:50%',
      'border-radius:10px',
      'animation: spin 1s linear infinite',
    ].join(';') + ';';
    text.style.cssText = [
      'width:50px',
      'height:50px',
      'text-align:center',
      'color:#138FB2',
      'font-family:Roboto, helvetica, arial, sans-serif',
      'font-weight:400',
      'position:absolute',
      'top:50%',
      'left:50%',
      'font-size:12px',
      'line-height:50px',
    ].join(';') + ';';
    text.innerText = 'Loading';
    dom.appendChild(shadowDom);
    dom.appendChild(loading);
    dom.appendChild(text);
    return dom;
  }

  public static createDom(params?: WHConfig): HTMLElement {
    let dom = document.createElement('div');
    dom.style.cssText = [
      `width:${params && params.width || 1}px`,
      `height:${params && params.height || 1}px`,
      'background-color:transparent',
      'visibility:hidden',
      'position:absolute',
      'left：0',
      'top:0',
    ].join(';') + ';';
    return dom;
  }

  public static createTooltip(overOrder: boolean = false): HTMLElement {
    let dom = document.createElement('div');
    let span = document.createElement('span');
    let content = document.createElement('div');
    dom.setAttribute('class', 'tooltip');
    if (overOrder) {
      dom.style.cssText = [
        'overflow-y:auto',
        'max-height:200px',
      ].join(';') + ';';
    }

    span.setAttribute('class', 'arrow');
    content.setAttribute('class', 'content');
    dom.appendChild(span);
    dom.appendChild(content);
    return dom;
  }

  set width(n: number) {
    this._width = n;
  }

  get width(): number {
    return this._width;
  }

  set height(n: number) {
    this._height = n;
  }

  get height(): number {
    return this._height;
  }

  constructor(util: Util) {
    this.util = util;
  }

  public init(options: DomInitConfig) {
    this.width = options.width;
    this.height = options.height;

    this.outerDom = options.outerDom;
    this.scrollDom = options.scrollDom;
    this.loadingDom = Dom.createLoadDom({ width: this.width, height: this.height });
    this.fakeDom = Dom.createDom();
    this.toolTip = new ToolTip(this.outerDom, Dom);

    this.scrollDom.appendChild(this.fakeDom);
    this.outerDom.appendChild(this.toolTip.dom);
    this.outerDom.appendChild(this.loadingDom);

  }

  public setOuterDom(el: HTMLElement): void {
    this.outerDom = el;
  }

  public getOuterDom(): HTMLElement {
    return this.outerDom;
  }

  public setScrollDom(el: HTMLElement): void {
    this.scrollDom = el;
  }

  public getScrollDom(): HTMLElement {
    return this.scrollDom;
  }

  public setLoadingDom(el: HTMLElement): void {
    this.loadingDom = el;
  }

  public getLoadingDom(): HTMLElement {
    return this.loadingDom;
  }

  public setFakeDom(el: HTMLElement): void {
    this.fakeDom = el;
  }

  public getFakeDom(): HTMLElement {
    return this.fakeDom;
  }

  public setTooltip(el: ToolTip): void {
    this.toolTip = el;
  }

  public getTooltip(): ToolTip {
    return this.toolTip;
  }

  public setFakeDomSize(): void {
  }
}

export interface WHConfig {
  width: number;
  height: number;
}

export interface DomInitConfig {
  width: number;
  height: number;
  outerDom: HTMLElement;
  scrollDom: HTMLElement;
}
