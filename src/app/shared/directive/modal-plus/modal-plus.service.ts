/**
 * 该服务主要配合apsFlexibleSize指令，实现的功能有：
 * 1.管理弹框
 * 2.选中弹框置顶
 * 3.传入唯一标识值，可防止点击同一按钮重复打开弹框
 * 4.配合apsFlexibleSize指令实现拖拉元素变更尺寸
 */
import {ComponentRef, ElementRef, Injectable, Injector, RendererFactory2} from '@angular/core';
import {Overlay, OverlayContainer, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {PORTAL_DATA} from './portal-data';
import {ComponentPortal} from '@angular/cdk/portal';
import {RESIZE_TYPE} from './resize-type';
import {DragRef} from '@angular/cdk/drag-drop';
import {getScale, getSize, getTransform, px2Percent} from './utils';

// 鼠标离边缘位置多少时可以变更尺寸
const offsetDistance = 5;
const Z_INDEX = 999;

@Injectable()
export class ModalPlusService {
  renderer;

  /** 管理弹框 */
  modalPlusContainer: ModalPlusRef[] = []; // 弹框容器，弹框当前弹框数量

  /** 有唯一标识值时，防止重复打开相同弹框功能*/
  targetMapId = new Map();

  /** 管理选中的弹框置顶 */
  lastModalPlus: HTMLElement | null = null; // 上次选中的弹框，用来将当前弹框置顶

  /** 管理可以变更尺寸元素 */
  resizeElementContainer: ResizeElementInf[] = [];  // 重设尺寸元素容器

  isActiveMouseListener = false; // 是否激活了鼠标事件监听，变更尺寸功能需要鼠标事件协助

  /** 变更尺寸流程状态 必须isMatchResizeType为ture,才能激活isActiveResize，从而启动变更尺寸 */
  activeResizeInf: { isMatchResizeType: boolean, isActiveResize: boolean, activeItem: ResizeElementInf } = {
    isMatchResizeType: false, // 是否已有元素匹配了重调尺寸类型,即鼠标已移动到元素边界
    isActiveResize: false, // 是否已有元素处于重调尺寸中，即在边界按下了鼠标
    activeItem: null, // 变更尺寸元素的元数据
  };

  /** true使用scale来进行缩放，false为直接放大宽高*/
  scaleMode = true;

  private _downHandler = this._mouseDown.bind(this);
  private _moveHandler = this._mouseMove.bind(this);
  private _upHandler = this._mouseUp.bind(this);
  mouseInfo = {
    oldPosition: {x: null, y: null},
    newPosition: {x: null, y: null},
    movement: {x: null, y: null},
  };

  constructor(
    private overlay: Overlay,
    private rendererFactory: RendererFactory2,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private overlayContainer: OverlayContainer,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * 打开弹框
   * @param component
   * @param data 传递到弹框参数
   * @param target 通过触发事件的target来判断弹框是否唯一（打开的弹框如果已经存在，不会重复创建,可以是点击的按钮，也可以是一行数据的id等等,要能唯一标识的值）
   */
  open(component, data?: { [key: string]: any }, target?: any) {
    console.log(this.overlayContainer.getContainerElement(),
    );

    const id = this._getId();
    if (target && this.targetMapId.has(target)) {
      return;
    } else if (target && !this.targetMapId.has(target)) {
      this.targetMapId.set(target, id);
    }

    const global = this.overlayPositionBuilder.global().centerHorizontally().centerVertically();
    const overlayRef = this.overlay.create({
      positionStrategy: global,
      panelClass: 'aps-modal-plus-container',
    });
    const injector = this._createInjector(id, data);
    const flexibleModal = new ComponentPortal(component, null, injector);
    const componentRef: ComponentRef<any> = overlayRef.attach(flexibleModal);
    // 指令内也重复添加，考虑到可能会出现不搭配指令使用，仅当做弹框的情况
    this.renderer.addClass(componentRef.location.nativeElement.firstElementChild, 'aps-modal-plus');
    // 避免和其他使用了material CDK的其他库在层级上的冲突
    this.renderer.setStyle(componentRef.location.nativeElement.parentElement.parentElement, 'zIndex', Z_INDEX);
    this._open(id, overlayRef, componentRef, target);
  }

  setScaleMode() {
    this.scaleMode = !this.scaleMode;
  }

  /**
   * 弹框唯一标识
   * @private
   */
  private _getId(): string {
    return (+new Date()).toString(16); // 弹框唯一标识
  }

  private _createInjector(id, data): Injector {
    const value = {
      close: () => {
        this._close(id);
      },
      ...data,
    };
    return Injector.create([{provide: PORTAL_DATA, useValue: value}]);
  }

  /**
   * 将弹框保存在弹框容器中
   * @param id
   * @param overlayRef
   * @param componentRef
   * @param target
   * @private
   */
  private _open(id, overlayRef: OverlayRef, componentRef: ComponentRef<any>, target = null) {
    this.modalPlusContainer.push({id, overlayRef, componentRef, target});
  }

  /**
   * 删除保存在弹框容器内对应的弹框
   * @private
   */
  private _close(id) {
    let modalIndex = -1;
    const modalItem = this.modalPlusContainer.find((modal, index) => {
      if (modal.id === id) {
        modalIndex = index;
        return true;
      }
    });
    if (modalItem) {
      if (modalItem.target) {
        if (this.targetMapId.has(modalItem.target)) {
          this.targetMapId.delete(modalItem.target);
        }
      }
      modalItem.overlayRef.dispose();
      modalItem.componentRef.destroy();
      this.modalPlusContainer.splice(modalIndex, 1);
    }
  }

  /**
   * 是否存在弹框
   */
  isModalPlusExist(): boolean {
    return this.modalPlusContainer.length !== 0;
  }

  getModalPlus(id: string) {
    return this.modalPlusContainer.find(mp => mp.id === id);
  }

  enableDocumentMouseListener() {
    if (!this.isActiveMouseListener) {
      document.addEventListener('mousedown', this._downHandler);
      document.addEventListener('mousemove', this._moveHandler);
      document.addEventListener('mouseup', this._upHandler);
      this.isActiveMouseListener = true;
    }
  }

  disableDocumentMouseListener() {
    document.removeEventListener('mousedown', this._downHandler);
    document.removeEventListener('mousemove', this._moveHandler);
    document.removeEventListener('mouseup', this._upHandler);
    this.isActiveMouseListener = false;
  }

  private _mouseMove(e: MouseEvent) {
    // 匹配变更状态
    if (!this.activeResizeInf.isActiveResize) {
      const len = this.resizeElementContainer.length;
      this.activeResizeInf.isMatchResizeType = false;
      this.activeResizeInf.activeItem = null;
      for (let i = 0; i < len; i++) {
        const containerItem = this.resizeElementContainer[i];

        // 激活回调
        containerItem.mousemoveCallback(e);

        if (!this.activeResizeInf.isMatchResizeType) {
          this.activeResizeInf.isMatchResizeType = this.matchResizeType(containerItem, e);
          if (this.activeResizeInf.isMatchResizeType) {
            this.activeResizeInf.activeItem = containerItem;
            break;
          }
        }
      }
    } else if (this.activeResizeInf.isActiveResize) {
      // 变更尺寸
      this.resize(e);
    }

  }

  private _mouseDown(e: MouseEvent) {
    if (this.activeResizeInf.isMatchResizeType) {
      this.activeResizeInf.isActiveResize = true;
      this.mouseInfo.oldPosition = {x: e.x, y: e.y};
    }
  }

  private _mouseUp(e: MouseEvent) {
    if (this.activeResizeInf.isActiveResize) {
      this.activeResizeInf.isMatchResizeType = false;
      this.activeResizeInf.isActiveResize = false;

      const containerEle = this.activeResizeInf.activeItem.ele;
      const ele: HTMLElement = containerEle instanceof ElementRef ? containerEle.nativeElement : containerEle;
      const translatePoint = getTransform(ele.style.transform);
      const scale = getScale(ele.style.transform);
      const point = {x: translatePoint.x, y: translatePoint.y};

      if (this.scaleMode) {
        // @ts-ignore 由于_initialTransform为dragRef的私有变量，且没有任何方法对其进行赋值，但我们必须要每次初始化，以记录每次scale的值
        this.activeResizeInf.activeItem.dragRef._initialTransform = null;
        this.renderer.setStyle(ele, 'transform', `scale(${scale})`);
      } else {
        ele.style.transform = '';
      }
      this.activeResizeInf.activeItem.dragRef.setFreeDragPosition(point);
      this.activeResizeInf.activeItem = null;
    }
  }

  /**
   * 添加可变更尺寸元素
   * @param ele 变更尺寸元素
   * @param dragRef 若元素具有拖动功能，传入拖动引用
   * @param scaleInf scale模式下的信息
   * @param min 尺寸变更最小值
   * @param max 尺寸变更最大值
   * @param mouseupCallback 鼠标回调
   * @param mousemoveCallback 鼠标回调
   * @param mousedownCallback 鼠标回调
   */
  addResizeElement(ele: ElementRef | HTMLElement, dragRef: DragRef | null = null, scaleInf: ScaleInf, min: number, max: number, mouseupCallback: (...arg) => any = function (e) {
  }, mousemoveCallback: (...arg) => any = function (e) {
  }, mousedownCallback: (...arg) => any = function (e) {
  }) {
    this.resizeElementContainer.push({
      ele,
      dragRef,
      existedClassName: '',
      scaleInf,
      mouseupCallback,
      mousemoveCallback,
      mousedownCallback,
    });
  }

  deleteResizeElement(ele: ElementRef | HTMLElement) {
    const index = this.resizeElementContainer.findIndex(eInf => eInf.ele === ele);
    if (~index) {
      this.resizeElementContainer.splice(index, 1);
    }
  }

  /**
   * 使可拖动元素失效/生效
   * @param dragRef
   * @param active
   * @private
   */
  activeDragDisable(dragRef: DragRef | null, active: boolean) {
    if (dragRef !== null) {
      dragRef.disabled = active;
    }
  }

  /**
   * 匹配元素是否处于重置尺寸类型
   * @param containerItem
   * @param e
   * @private
   */
  private matchResizeType(containerItem: ResizeElementInf, e): boolean {
    const containerEle = containerItem.ele;
    const ele: HTMLElement = containerEle instanceof ElementRef ? containerEle.nativeElement : containerEle;
    const {width, height} = ele.getBoundingClientRect();
    const top = ele.getBoundingClientRect().top;
    const left = ele.getBoundingClientRect().left;
    const right = ele.getBoundingClientRect().right;
    const bottom = ele.getBoundingClientRect().bottom;
    const layerY = e.y - top;
    const layerX = e.x - left;


    if (e.x >= left && e.x <= right && e.y >= top && e.y <= bottom) {
      if (layerX - offsetDistance <= 0 && layerY - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.NW, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerX + offsetDistance >= width && layerY - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.NE, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerY - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.N, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerX - offsetDistance <= 0 && layerY + offsetDistance >= height) {
        this.addClass(RESIZE_TYPE.SW, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerX - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.W, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerX + offsetDistance >= width && layerY + offsetDistance >= height) {
        this.addClass(RESIZE_TYPE.SE, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerX + offsetDistance >= width) {
        this.addClass(RESIZE_TYPE.E, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerY + offsetDistance >= height) {
        this.addClass(RESIZE_TYPE.S, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else {
        if (containerItem.existedClassName) {
          this.removeClass(containerItem.existedClassName, ele, containerItem);
          this.activeDragDisable(containerItem.dragRef, false);
        }
        return false;
      }
    } else {
      if (containerItem.existedClassName) {
        this.removeClass(containerItem.existedClassName, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, false);
      }
      return false;
    }
  }

  private addClass(className: string, el: HTMLElement, item: ResizeElementInf) {
    this.removeClass(item.existedClassName, el, item);
    this.renderer.addClass(el, className);
    item.existedClassName = className;
  }

  private removeClass(className: string, el: HTMLElement, item: ResizeElementInf) {
    if (className !== '') {
      this.renderer.removeClass(el, className);
      item.existedClassName = '';
    }
  }

  private resize(e) {
    if (this.activeResizeInf.isActiveResize) {
      const movementX = this.mouseInfo.oldPosition.x - e.x;
      const movementY = this.mouseInfo.oldPosition.y - e.y;
      this.mouseInfo.oldPosition = {x: e.x, y: e.y};
      const activeItem = this.activeResizeInf.activeItem;
      const containerEle = activeItem.ele;
      const resizeType = activeItem.existedClassName;
      const ele: HTMLElement = containerEle instanceof ElementRef ? containerEle.nativeElement : containerEle;
      const {width, height} = getSize(ele);
      const lastTranslate = getTransform(ele.style.transform);

      // translate缩放
      // 1.计算缩放值
      // 2.缩放是根据原因尺寸缩放
      //   1)记录自身原有尺寸
      //   2)根据缩放差值计算缩放百分比
      //      2.1 差值记录，每次差值增减都放在一个总差值变量，这样将对精确，而不考虑获取上一次缩放百分比再进行计算
      // 每个弹框有自身起始宽高记录，有自身的总差值记录


      if (resizeType === RESIZE_TYPE.NW) {
        if (this.scaleMode) {
          activeItem.scaleInf.totalDeviation.width += movementX;
          activeItem.scaleInf.totalDeviation.height += movementY;
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y - movementY / 2}px, 0)
          scale(${px2Percent(width, activeItem.scaleInf.totalDeviation.width)}, ${px2Percent(height, activeItem.scaleInf.totalDeviation.height)})`);
        } else {
          this.renderer.setStyle(ele, 'height', `${height + movementY}px`);
          this.renderer.setStyle(ele, 'width', `${width + movementX}px`);
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y - movementY / 2}px, 0)`);
        }
      } else if (resizeType === RESIZE_TYPE.NE) {
        if (this.scaleMode) {
          activeItem.scaleInf.totalDeviation.width -= movementX;
          activeItem.scaleInf.totalDeviation.height += movementY;
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y - movementY / 2}px, 0)
          scale(${px2Percent(width, activeItem.scaleInf.totalDeviation.width)}, ${px2Percent(height, activeItem.scaleInf.totalDeviation.height)})`);
        } else {
          this.renderer.setStyle(ele, 'height', `${height + movementY}px`);
          this.renderer.setStyle(ele, 'width', `${width - movementX}px`);
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y - movementY / 2}px, 0)`);
        }
      } else if (resizeType === RESIZE_TYPE.N) {
        if (this.scaleMode) {
          activeItem.scaleInf.totalDeviation.height += movementY;
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x}px, ${lastTranslate.y - movementY / 2}px, 0)
          scale(${px2Percent(width, activeItem.scaleInf.totalDeviation.width)}, ${px2Percent(height, activeItem.scaleInf.totalDeviation.height)})`);
        } else {
          this.renderer.setStyle(ele, 'height', `${height + movementY}px`);
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x}px, ${lastTranslate.y - movementY / 2}px, 0)`);
        }
      } else if (resizeType === RESIZE_TYPE.SW) {
        if (this.scaleMode) {
          activeItem.scaleInf.totalDeviation.width += movementX;
          activeItem.scaleInf.totalDeviation.height -= movementY;
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y - movementY / 2}px, 0)
          scale(${px2Percent(width, activeItem.scaleInf.totalDeviation.width)}, ${px2Percent(height, activeItem.scaleInf.totalDeviation.height)})`);
        } else {
          this.renderer.setStyle(ele, 'height', `${height - movementY}px`);
          this.renderer.setStyle(ele, 'width', `${width + movementX}px`);
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y - movementY / 2}px, 0)`);
        }
      } else if (resizeType === RESIZE_TYPE.W) {
        if (this.scaleMode) {
          activeItem.scaleInf.totalDeviation.width += movementX;
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y}px, 0)
          scale(${px2Percent(width, activeItem.scaleInf.totalDeviation.width)}, ${px2Percent(height, activeItem.scaleInf.totalDeviation.height)})`);
        } else {
          this.renderer.setStyle(ele, 'width', `${width + movementX}px`);
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y}px, 0)`);
        }
      } else if (resizeType === RESIZE_TYPE.SE) {
        if (this.scaleMode) {
          activeItem.scaleInf.totalDeviation.width -= movementX;
          activeItem.scaleInf.totalDeviation.height -= movementY;
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y - movementY / 2}px, 0)
          scale(${px2Percent(width, activeItem.scaleInf.totalDeviation.width)}, ${px2Percent(height, activeItem.scaleInf.totalDeviation.height)})`);
        } else {
          this.renderer.setStyle(ele, 'height', `${height - movementY}px`);
          this.renderer.setStyle(ele, 'width', `${width - movementX}px`);
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y - movementY / 2}px, 0)`);
        }
      } else if (resizeType === RESIZE_TYPE.E) {
        if (this.scaleMode) {
          activeItem.scaleInf.totalDeviation.width -= movementX;
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y}px, 0)
          scale(${px2Percent(width, activeItem.scaleInf.totalDeviation.width)}, ${px2Percent(height, activeItem.scaleInf.totalDeviation.height)})`);
        } else {
          this.renderer.setStyle(ele, 'width', `${width - movementX}px`);
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x - movementX / 2}px, ${lastTranslate.y}px, 0)`);
        }
      } else if (resizeType === RESIZE_TYPE.S) {
        if (this.scaleMode) {
          activeItem.scaleInf.totalDeviation.height -= movementY;
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x}px, ${lastTranslate.y - movementY / 2}px, 0)
          scale(${px2Percent(width, activeItem.scaleInf.totalDeviation.width)}, ${px2Percent(height, activeItem.scaleInf.totalDeviation.height)})`);
        } else {
          this.renderer.setStyle(ele, 'height', `${height - movementY}px`);
          this.renderer.setStyle(ele, 'transform', `translate3d(${lastTranslate.x}px, ${lastTranslate.y - movementY / 2}px, 0)`);
        }
      }
    }
  }


  showCurrentModalPlus(el: HTMLElement) {
    if (this.lastModalPlus) {
      this.renderer.setStyle(this.lastModalPlus, 'zIndex', Z_INDEX);
    }
    this.renderer.setStyle(el, 'zIndex', 1000);
    this.lastModalPlus = el;
  }
}

export interface ModalPlusRef {
  id: string;
  overlayRef: OverlayRef;
  componentRef: ComponentRef<any>;
  target: HTMLElement;
}

export interface ResizeElementInf {
  ele: ElementRef | HTMLElement;
  dragRef: DragRef | null;
  existedClassName: string; // 尺寸变更类型
  scaleInf: ScaleInf;
  mouseupCallback: (...arg) => any;
  mousemoveCallback: (...arg) => any;
  mousedownCallback: (...arg) => any;
}

export interface ScaleInf {
  size: {
    width: number;
    height: number
  };
  totalDeviation: {
    width: number;
    height: number
  };
}

