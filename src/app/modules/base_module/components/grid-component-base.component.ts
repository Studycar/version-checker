import { AfterViewInit, Injector } from '@angular/core';


//#region 组件基类

/**
 * 组件基类，实现了权限控制
 */
export abstract class ComponentBase implements AfterViewInit {
  ngAfterViewInit(): void {

  }

  /**
   * 权限字典，以模块代码为键，是否有权限为值
   */
  public auth: { [key: string]: boolean; } = {};
  constructor(injector: Injector) {

  }

  /**
   * 重写以返回权限控制配置信息
   */
  protected abstract AuthConfig(): any;

  /**
   * 初始化并执行权限检查，检查结果存储到 this.auth 中
   */
  async checkAuth() {

  }
}

//#endregion

/**
 * 网格组件基类
 *
 * @export
 * @abstract
 * @class GridComponentBase
 * @extends {ComponentBase}
 */
export abstract class GridComponentBase extends ComponentBase {
  protected AuthConfig() {

  }
    constructor(injector: Injector) {
        super(injector);
    }
}
