import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { TitleService } from '@delon/theme';
import { filter } from 'rxjs/operators';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BaseService } from './modules/base_module/services/app-injector.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private titleSrv: TitleService,
    private modalSrv: NzModalService,
    private baseService: BaseService,
    private renderer: Renderer2,
    public msgSrv: NzMessageService,
  ) {
    baseService.renderer = renderer;
  }

  destoryWaterMark() {
    const watermarkEl = document.getElementById('contactWaterMark');
    watermarkEl && watermarkEl.remove();
  }

  ngOnInit() {
    const freeMenusLinks = ['/login','/dashboard/v2']; // 不受权限控制的路由
    const cascaMenusLinks = {
      '/sale/salesCurContractDetail': '/sale/salesCurContract',
      '/sale/deliveredOrderDetail': '/sale/deliveredOrder',
      '/sale/deliveryOrderDetail': '/sale/deliveryOrder',
    }; // 关联关系的权限路由
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd || evt instanceof NavigationStart))
      .subscribe((evt: NavigationStart | NavigationEnd) => {
        // ide 为流程路由，callback/aps 为单点登录回调路由
        const menusLinks = JSON.parse(localStorage.getItem('menusLinks')) || [];
        const url = evt.url.split('?')[0];
        if (evt instanceof NavigationStart && !freeMenusLinks.includes(url) && !url.startsWith('/ide')  && !url.startsWith('/callback/aps') ) {
          if (menusLinks && !menusLinks.includes(url)) {
            // console.log(evt)
            // this.msgSrv.error('您没有此菜单权限！跳转首页')
            if (cascaMenusLinks.hasOwnProperty(url) && menusLinks.includes(cascaMenusLinks[url])) {
              return;
            }
            this.router.navigateByUrl('/dashboard/v2');
          }
        }
        if (evt instanceof NavigationEnd) {
          this.titleSrv.setTitle();
          this.modalSrv.closeAll();
        }
      });
  }
  
  ngOnDestroy() {
    this.destoryWaterMark();
  }

}
