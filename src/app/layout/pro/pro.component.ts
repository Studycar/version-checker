import {
  Component,
  ElementRef,
  Renderer2,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
  NavigationCancel,
} from '@angular/router';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { updateHostClass } from '@delon/util';
import { ScrollService, SettingsService, TitleService } from '@delon/theme';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';

import { ProSettingDrawerComponent } from './setting-drawer/setting-drawer.component';
import { BrandService } from './pro.service';
import { LayoutProHeaderComponent } from './components/header/header.component';
import { StartupService } from '@core/startup/startup.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  selector: 'layout-pro',
  templateUrl: './pro.component.html',
  styleUrls: ['./pro.component.less'],
  // NOTICE: If all pages using OnPush mode, you can turn it on and all `cdr.detectChanges()` codes
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutProComponent implements OnInit, AfterViewInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  private queryCls: string;
  @ViewChild('settingHost', { static: true, read: ViewContainerRef })
  private settingHost: ViewContainerRef;
  @ViewChild('header', {static: true})
  private header: LayoutProHeaderComponent;
  @ViewChild('reuseTab', {static: true})
  private reuseTab: any;

  isFetching = false;

  // 水印设置
  waterOptions = {
    watermarkLabel: '',
    watermarkAlpha: 0.2,
  };

  get isMobile() {
    return this.pro.isMobile;
  }

  get inApp() {
    return environment.inApp;
  }

  get showBreadcrumbTab() {
    return this.pro.getShowBreadcrumbTab();
  }

  get getLayoutStyle() {
    const {
      isMobile,
      fixSiderbar,
      collapsed,
      menu,
      width,
      widthInCollapsed,
    } = this.pro;
    if (fixSiderbar && menu !== 'top' && !isMobile) {
      return {
        paddingLeft: (collapsed ? widthInCollapsed : width) + 'px',
      };
    }
    return null;
  }

  get getContentStyle() {
    const { fixedHeader, headerHeight } = this.pro;
    return {
      margin: '0 12px 0 12px',
      'padding-top': (fixedHeader ? headerHeight : 0) + 'px',
    };
  }

  private get body(): HTMLElement {
    return this.doc.body;
  }

  constructor(
    bm: BreakpointObserver,
    mediaMatcher: MediaMatcher,
    router: Router,
    private msg: NzMessageService,
    scroll: ScrollService,
    reuseTabSrv: ReuseTabService,
    private resolver: ComponentFactoryResolver,
    private el: ElementRef,
    private renderer: Renderer2,
    public pro: BrandService,
    private startupSrv: StartupService,
    private appConfigService: AppConfigService,
    private settingsService: SettingsService,
    private titleService: TitleService,
    @Inject(DOCUMENT) private doc: any, // private cdr: ChangeDetectorRef
  ) {
    // scroll to top in change page
    router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
        scroll.scrollToTop();
      }
      if (evt instanceof NavigationError) {
        this.isFetching = false;
        msg.error(`页面缓存不是最新，请清理缓存后刷新页面。`, { nzDuration: 1000 * 3 });
        return;
      }
      if (evt instanceof NavigationCancel) {
        reuseTabSrv.refresh();
        this.isFetching = false;
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.isFetching = false;
      // If have already cached router, should be don't need scroll to top
      if (!reuseTabSrv.exists(evt.url)) {
        scroll.scrollToTop();
      }
    });

    // media
    const query = {
      'screen-xs': '(max-width: 575px)',
      'screen-sm': '(min-width: 576px) and (max-width: 767px)',
      'screen-md': '(min-width: 768px) and (max-width: 991px)',
      'screen-lg': '(min-width: 992px) and (max-width: 1199px)',
      'screen-xl': '(min-width: 1200px)',
    };
    bm.observe([
      '(min-width: 1200px)',
      '(min-width: 992px) and (max-width: 1199px)',
      '(min-width: 768px) and (max-width: 991px)',
      '(min-width: 576px) and (max-width: 767px)',
      '(max-width: 575px)',
    ]).subscribe(() => {
      this.queryCls = Object.keys(query).find(
        key => mediaMatcher.matchMedia(query[key]).matches,
      );
      this.setClass();
    });
  }

  private setClass() {
    const { body, renderer, queryCls, pro } = this;
    updateHostClass(
      body,
      renderer,
      {
        ['color-weak']: pro.layout.colorWeak,
        [`layout-fixed`]: pro.layout.fixed,
        [`aside-collapsed`]: pro.collapsed,
        ['alain-pro']: true,
        [queryCls]: true,
        [`alain-pro__content-${pro.layout.contentWidth}`]: true,
        [`alain-pro__fixed`]: pro.layout.fixedHeader,
        [`alain-pro__wide`]: pro.isFixed,
        [`alain-pro__dark`]: pro.theme === 'dark',
        [`alain-pro__light`]: pro.theme === 'light',
      },
      true,
    );
  }

  handleReuseTabChange () {
    // 由于nz-tabs下划线不显现，需要触发window resize
    try {
      const ev = document.createEvent('Event');
      ev.initEvent('resize', true, true);
      window.dispatchEvent(ev);
    } catch (e) {
      console.error(e);
    }
  }

  ngAfterViewInit(): void {
    // Setting componet for only developer
    // 禁用左则设置栏
    // if (!environment.production) {
    //   setTimeout(() => {
    //     const settingFactory = this.resolver.resolveComponentFactory(
    //       ProSettingDrawerComponent,
    //     );
    //     this.settingHost.createComponent(settingFactory);
    //   }, 22);
    // }
    setTimeout(() => {
      this.pro.layoutHeader = document.querySelector('#layoutHeader');
      this.pro.layoutContent = document.querySelector('#layoutContent');
    }, 100);
  }

  ngOnInit() {
    const { pro, unsubscribe$ } = this;
    pro.notify.pipe(takeUntil(unsubscribe$)).subscribe(() => {
      this.setClass();
    });
    // this.waterOptions.watermarkLabel = '美云智数 ' + this.appConfigService.getUserName();
    this.startupSrv
    .loadDefaultInfo(this.appConfigService.getUserId())
    .then(res => {
      if (res && res.data) {
        this.appConfigService.setActivePlantCode({
          plantCode: res.data.defaultPlantCode,
          descriptions: res.data.defaultPlantDesc,
        });
        this.appConfigService.setDefaultPlantCode(res.data.defaultPlantCode);
        this.appConfigService.setActiveScheduleRegionCode(
          res.data.defaultScheduleRegionCode,
        );
        this.appConfigService.setDefaultScheduleRegionCode(
          res.data.defaultScheduleRegionCode,
        );
        this.appConfigService.setRespCode(res.data.respCode);
        this.appConfigService.setPlantCodes(res.data.plantCodes);
        this.appConfigService.setUserName(res.data.userName);
        this.titleService.suffix = res.data.systemName;
        this.settingsService.setApp({name: res.data.systemName, description: ''});
        this.startupSrv.loadMenu();
      } else {
        throw new Error('获取用户信息失败')
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  ngOnDestroy() {
    const { unsubscribe$, body, pro } = this;
    unsubscribe$.next();
    unsubscribe$.complete();
    body.classList.remove(
      `alain-pro__content-${pro.layout.contentWidth}`,
      `alain-pro__fixed`,
      `alain-pro__wide`,
      `alain-pro__dark`,
      `alain-pro__light`,
    );
  }
}
