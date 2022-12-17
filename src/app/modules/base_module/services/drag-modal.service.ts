import { Injectable, Output } from '@angular/core';
import { ModalOptionsForService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ModalHelperOptions } from '@delon/theme';
import { Observable, Observer } from 'rxjs';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';

@Injectable()
export class DragModalService {
  private zIndex = 500;

  constructor(private dragDrop: DragDrop, private srv: NzModalService) {
  }

  /**
   * 传参和modalHelper.static一样
   * @param comp 组件
   * @param params 组件参数
   * @param size 大小；例如：lg、600，默认：lg
   * @param options 对话框 `ModalOptionsForService` 参数
   * */
  create(comp: any, params?: any, size?: 'sm' | 'md' | 'lg' | 'xl' | '' | number, options?: ModalOptionsForService) {
    const modalOptions: ModalHelperOptions = {
      size: size || 'lg',
      exact: true,
      includeTabs: false,
      modalOptions: options,
    };

    return new Observable((observer: Observer<any>) => {
      let cls = 'resetModalDialog ';
      let width = '';
      if (modalOptions.size) {
        if (typeof modalOptions.size === 'number') {
          width = `${modalOptions.size}px`;
        } else {
          cls += `modal-${modalOptions.size}`;
        }
      }
      if (modalOptions.includeTabs) {
        cls += ' modal-include-tabs';
      }

      const defaultOptions: ModalOptionsForService = {
        nzWrapClassName: cls,
        nzContent: comp,
        nzWidth: width ? width : undefined,
        nzFooter: null,
        nzComponentParams: params,
        nzZIndex: ++this.zIndex,
        nzMask: false,
        nzStyle: { top: 0 },
      };

      const modalComponent: NzModalRef = this.srv.create({ ...defaultOptions, ...modalOptions.modalOptions });
      /**
       * 窗口打开后，可拖动处理
       * */
      modalComponent.afterOpen.subscribe(() => {
        const html: HTMLElement = modalComponent.getElement().parentElement;
        const modalHeader: HTMLElement = <HTMLElement>modalComponent.getElement().querySelector('.modal-header');
        const dragRef: DragRef = this.dragDrop.createDrag(html);
        dragRef.withHandles([modalHeader]);
        /**
         * null为打开回调
         * */
        observer.next(null);
      });
      const afterClose$ = modalComponent.afterClose.subscribe((res: any) => {
        if (modalOptions.exact === true) {
          if (res != null) {
            observer.next(res);
          }
        } else {
          observer.next(res);
        }
        observer.complete();
        afterClose$.unsubscribe();
      });
    });
  }
}
