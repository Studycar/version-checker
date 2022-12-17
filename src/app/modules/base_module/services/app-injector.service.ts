import { Injector, Injectable, Renderer2 } from '@angular/core';

/**
 *  huang.jian
 *  存储injector
 */
export class AppInjector {
  private static injector: Injector;

  static setInjector(injector: Injector) {
    AppInjector.injector = injector;
  }

  static getInjector(): Injector {
    return AppInjector.injector;
  }
}

/**
 * 基类服务
 */
@Injectable({
  providedIn: 'root',
})
export class BaseService {
  renderer: Renderer2;
}

