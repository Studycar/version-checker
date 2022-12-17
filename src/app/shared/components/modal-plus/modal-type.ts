/**
 * 用于拓展新的弹层属性
 */
 import {
  ModalOptions as NzModalOption,
  ModalOptionsForService as NzModalOptionsForService,
  ModalButtonOptions as NzModalButtonOptions,
} from 'ng-zorro-antd/modal';

export interface ModalOptions<T = any, R = any> extends NzModalOption<T, R> {

}

export interface ModalOptionsForService<T = any> extends NzModalOptionsForService<T> {
  flexible?: boolean;
}

export interface ModalButtonOptions<T = any> extends NzModalButtonOptions<T> {

}
