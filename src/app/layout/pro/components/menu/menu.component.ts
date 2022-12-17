import {
  Component,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild, AfterViewInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Menu, MenuService } from '@delon/theme';
import { InputBoolean } from '@delon/util';
import { BrandService } from '../../pro.service';
import { ProMenu } from '../../pro.types';
import { NzMenuDirective, NzSubMenuComponent } from 'ng-zorro-antd';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  selector: 'layout-pro-menu',
  templateUrl: './menu.component.html',
  host: {
    '[class.alain-pro__menu]': 'true',
    '[class.alain-pro__menu-only-icon]': 'pro.onlyIcon',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CommonQueryService]
})
export class LayoutProMenuComponent implements OnInit, OnDestroy {
  @Input() @InputBoolean() disabledAcl = false;
  @Input() mode = 'inline';

  @ViewChild('menu', { static: false }) menu: NzMenuDirective;

  private unsubscribe$ = new Subject<void>();
  menus: ProMenu[];

  constructor(
    private menuSrv: MenuService,
    private router: Router,
    public pro: BrandService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonQueryService,
    private appConfigService: AppConfigService,
  ) {
  }

  private cd() {
    this.cdr.markForCheck();
  }

  private genMenus(data: Menu[]) {
    const res: ProMenu[] = [];
    // ingores category menus
    const ingoreCategores = data.reduce((prev, cur) => prev.concat(cur.children), []);
    const hiddenItem = this.menuSrv.getHit(ingoreCategores, '/dashboard/v2', true);
    if (hiddenItem) {
      hiddenItem._hidden = true;
    }
    this.menuSrv.visit(ingoreCategores, (item, parent) => {
      if (!item._aclResult) {
        if (this.disabledAcl) {
          item.disabled = true;
        } else {
          item._hidden = true;
        }
      }
      if (item._hidden === true) {
        return;
      }
      if (parent === null) {
        res.push(item);
      }
    });
    this.menus = res;
    this.openStatus();
  }

  private openStatus() {
    const inFn = (list: ProMenu[]) => {
      for (const i of list) {
        i._open = false;
        i._selected = false;
        if (i.children.length > 0) {
          inFn(i.children);
        }
      }
    };
    inFn(this.menus);
    /* 解决首页被覆盖
    if (this.router.url === '/dashboard/v2') {
      try {
        this.router.navigateByUrl('/dashboard/v2');
        const shortCut = this.menus[0];
        shortCut._selected = true;
        if (!this.pro.isTopMenu && !this.pro.collapsed) {
          shortCut._open = true;
        }
        this.cd();
        return;
      } catch (error) { }
    }
    */
    let item = this.menuSrv.getHit(this.menus, this.router.url, true);
    if (!item || this.router.url === '/dashboard/v2') {
      this.cd();
      return;
    }
    do {
      item._selected = true;
      if (!this.pro.isTopMenu && !this.pro.collapsed) {
        item._open = true;
      }
      item = item.__parent;
    } while (item);
    this.cd();
  }

  openChange(item: ProMenu, submenu: NzSubMenuComponent, statue: boolean) {
    const data = item.__parent ? item.__parent.children : this.menus;
    if (data && data.length <= 1) return;
    data.forEach(i => (i._open = false));
    item._open = statue;
  }

  to(item: ProMenu) {
    // 数据采集-菜单打开请求中间件服务
    // this.commonService.OpenMenuVirtual(item.text).subscribe();

    if (item.disabled) return;

    const { router, pro } = this;
    const { externalLink, target, link } = item;
    if (target === '_blank') {
      if (externalLink) {
        const timeStamp = Math.round(new Date().getTime() / 1000);
        const tokenId = this.appConfigService.getUserId() + '^' + timeStamp;
        window.open(externalLink + '?tokenId=' + tokenId);
      } else {
        window.open(item.link);
      }
      return;
    }
    // Wait closed sub-menu panel
    setTimeout(() => router.navigateByUrl(link), pro.collapsed || pro.isTopMenu ? 25 : 0);
    if (pro.isMobile) {
      setTimeout(() => pro.setCollapsed(true), 25);
    }
    // 由于nz-tabs下划线不显现，需要触发window resize
    try {
      const ev = document.createEvent('Event');
      ev.initEvent('resize', true, true);
      window.dispatchEvent(ev);
    } catch (e) {
      console.error(e);
    }
  }

  ngOnInit() {
    const { unsubscribe$, router, pro } = this;
    this.menuSrv.change.pipe(
      takeUntil(unsubscribe$),
    ).subscribe(res => this.genMenus(res));

    router.events.pipe(
      takeUntil(unsubscribe$),
      filter(e => e instanceof NavigationEnd),
    ).subscribe(() => this.openStatus());

    pro.notify.pipe(
      takeUntil(unsubscribe$),
      filter(() => !!this.menus),
    ).subscribe(() => this.cd());
  }

  ngOnDestroy() {
    const { unsubscribe$ } = this;
    unsubscribe$.next();
    unsubscribe$.complete();
  }
}
