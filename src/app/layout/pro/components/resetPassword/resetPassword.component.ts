import { Component, Inject, OnInit } from '@angular/core';
import { ResetPasswordService } from './resetPassword.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

const NUM_REG = /^(?=.*\d+).+$/;
const WORD_REG = /^(?=.*[a-zA-Z]+).+$/;
const CHARACTER_REG = /^(?=.*[^a-zA-Z\d])[^!<>%&_+\s]+$/;

@Component({
    selector: 'reset-password',
    templateUrl: './resetPassword.component.html',
    styleUrls: ['./resetPassword.component.less'],
    providers: [ResetPasswordService],
  },
)
export class ResetPasswordComponent implements OnInit {

  oldPassword: string; // 老密码
  password: string; // 新密码
  confirmPassword: string; // 确认密码
  userName: string; // 账号
  safeColor = 'red'; // 安全条颜色
  safePercent = 0;  // 安全等级
  safePercen1t ='#000';  // 安全等级
  ruleList = [];
  ruleJudge: any = {};

  constructor(
    private pwdService: ResetPasswordService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private modal: NzModalRef,
    private http: _HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.userName = this.tokenService.get().name;
  }
  ngOnInit() {
    this.ruleList = [];
    // this.gridOptions.enableSorting = false;
    //得到校验规则
    this.getPasswordRule();
  }

  /**
   * 安全等级
   */
  safetyLevel() {
    const safe = [];
    const colors = ['#FF383A', '#FF383A', '#FFAD42', '#69BF6B'];
    safe.push(
      NUM_REG.test(this.password),
      WORD_REG.test(this.password),
      CHARACTER_REG.test(this.password),
    );

    const level = safe.filter(s => s);
    this.safeColor = colors[level.length];
    this.safePercent = Math.round(level.length * 33.33);
  }

  
  ruleCheckpassword() {
    this.ruleJudge= null;
    if(this.password.length>0){
      
    this.pwdService.ruleCheckpassword(this.password).subscribe(res => {
      this.ruleJudge = res;
      console.log(this.ruleJudge);
    })
    }
  }

  /**
   * 安全等级转换为对应中文
   * @param {number} percent
   * @return {string}
   */
  safeTpl(percent: number): string {
    switch (Math.floor(percent / 33.33)) {
      case 2:
        return '中';
      case 3:
        return '高';
      default:
        return '低';
    }
  }

  /**
   * 更新密码
   */
  updatePassword() {
    this.pwdService.updatePassword(this.oldPassword, this.password).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('修改成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }
  ///api/admin/baselookuptypesb/querylookupvalue?typeCode=CHECK_PASSWORD&language=zh-CN
  getPasswordRule(){
    this.http.get("/api/admin/baselookuptypesb/querylookupvalueInTakeEffect", {
      typeCode: "CHECK_PASSWORD",
      language:"zh-CN",
    }).subscribe(res => {
      res.data.forEach(data => {
        if(data.attribute10==='true'){
          this.ruleList.push(data);
        }
      });
      //this.ruleList = res.data;
      
    });
  }

}
