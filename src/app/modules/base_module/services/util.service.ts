import { Injectable } from '@angular/core';

/**
 * 工具类服务，主要是一些公共功能的方法，与业务无关的方法
 */

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  /**判断对象是否为空，undefined，null，返回true，否则返回false */
  isObjEmpty(target: any) {
    return target === undefined || target === null;
  }

  /**判断对象是否为空，undefined，null，返回true，否则返回false */
  isStrEmpty(target: string) {
    return target === undefined || target === null || target === '';
  }

  /**判断数组对象是否为空，undefined，null，返回true，否则返回false */
  isArrayEmpty(target: []) {
    return target === undefined || target === null || target.length === 0;
  }
}
