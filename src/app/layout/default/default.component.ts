import {
  Component,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  ComponentFactoryResolver,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  Inject,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ScrollService, MenuService, SettingsService } from '@delon/theme';

import { environment } from '@env/environment';
import { SettingDrawerComponent } from './setting-drawer/setting-drawer.component';

import { Subscription } from 'rxjs';
import { updateHostClass } from '@delon/util';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html',
  preserveWhitespaces: false,
  host: {
    '[class.alain-default]': 'true',
  },
})
export class LayoutDefaultComponent implements OnInit, AfterViewInit, OnDestroy  {
  private notify$: Subscription;
  isFetching = false;
  @ViewChild('settingHost', {  static: true, read: ViewContainerRef })
  settingHost: ViewContainerRef;

  constructor(
    router: Router,
    scroll: ScrollService,
    private resolver: ComponentFactoryResolver,
    _message: NzMessageService,
    public menuSrv: MenuService,
    public settings: SettingsService,
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private doc: any,
  ) {
    // scroll to top in change page
    router.events.subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError) {
        this.isFetching = false;
        _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      setTimeout(() => {
        scroll.scrollToTop();
        this.isFetching = false;
      }, 100);
    });
  }

  private setClass() {
    const { el, renderer, settings } = this;
    const layout = settings.layout;
    updateHostClass(
      el.nativeElement,
      renderer,
      {
        ['alain-default']: true,
        [`alain-default__fixed`]: layout.fixed,
        [`alain-default__boxed`]: layout.boxed,
        [`alain-default__collapsed`]: layout.collapsed,
      },
      true,
    );
     this.doc.body.classList[layout.colorWeak ? 'add' : 'remove']('color-weak');
  }

  ngAfterViewInit(): void {
    // Setting componet for only developer
    if (!environment.production) {
      setTimeout(() => {
        const settingFactory = this.resolver.resolveComponentFactory(
          SettingDrawerComponent,
        );
        this.settingHost.createComponent(settingFactory);
      }, 22);
    }
  }

  ngOnInit() {
    this.notify$ = this.settings.notify.subscribe(() => this.setClass());
    this.setClass();
  }
   ngOnDestroy() {
    this.notify$.unsubscribe();
  }
}
