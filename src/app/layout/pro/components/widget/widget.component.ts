import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { BrandService } from '../../pro.service';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: '[layout-pro-header-widget]',
  templateUrl: './widget.component.html',
  host: {
    '[class.alain-pro__header-right]': 'true',
    '[class.alain-pro__header-right-dark]': 'isDark',
  },
})
export class LayoutProHeaderWidgetComponent implements OnInit {
  /**jianl新增，控制首页的微信登录二维码是否可视 */
  hiddenWXQRCode = false;
  ruleHidden = true;

  ngOnInit(): void {
    // throw new Error("Method not implemented.");
    // this.loadWXQRCodeShowParam();
    this.ruleShow();
  }

  get isDark() {
    const l = this.pro.layout;
    return l.menu === 'top' && l.theme === 'dark';
  }

  constructor(
    private pro: BrandService,
    private router: Router,
    public _http: _HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {}

  logout() {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
    
  }
  /**
   * 判断是否可以修改密码规则
   */
  ruleShow(){
    if(this.tokenService.get().name==="aps_admin"){
      this.ruleHidden =false;
    }

  }

  /**加载是否显示微信QRcode的参数 */
  // 宏旺这边暂时没有用到这个功能，先注释掉，减少一个请求
  // loadWXQRCodeShowParam() {
  //   const url = '/api/admin/baseparameters/getParametersByCode';
  //   const data = { parameterCode: 'SYS_INDEXPAGE_WXQRCODE' };
  //   this._http.get(url, data).subscribe((res: any) => {
  //     console.log('LayoutProHeaderWidgetComponent res:');
  //     console.log(res);
  //     if (
  //       res === undefined ||
  //       res === null ||
  //       res.data === undefined ||
  //       res.data === null ||
  //       res.data.length === 0
  //     ) {
  //       return;
  //     }

  //     /**系统参数=Y的时候才显示 */
  //     for (const item in res.data) {
  //       console.log(item);
  //       // 系统级
  //       if (res.data[item].levelValue.toString() === '1') {
  //         this.hiddenWXQRCode = res.data[item].parameterValue !== 'Y';
  //         break;
  //       }
  //     }
  //   });
  // }
}
