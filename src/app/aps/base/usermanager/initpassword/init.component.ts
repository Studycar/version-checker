import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { UserManagerManageService } from '../../../../modules/generated_module/services/user-manager-manage-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-usermanager-init',
  templateUrl: './init.component.html',
})
export class BaseUsermanagerInitComponent implements OnInit {
  record: any = {};
  i: any;
  userId : string;
  dto: any;
  values = {
    userPassword1: '',
    userPassword: ''
  };
  @ViewChild('sf', {static: true}) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      userPassword1: {
        type: 'string',
        title: '请输入初始化密码'
      },
      userPassword: {
        type: 'string',
        title: '请再次输入初始化密码'
      }
    },
    required: ['userPassword1', 'userPassword'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 200,
      grid: { span: 12 },
    }
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private userManagerManageService: UserManagerManageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    this.i.userPassword = '';
  }

  /**
   * 密码校验
   * @param value 
   */
  CheckPassword(value: any) {
    this.http.post("/api/admin/baseusers/ruleCheckpassword", {
      userPassword:value.userPassword,
    }).subscribe(res => {

      console.log(res);
    });
  }
  /**
   * 初始化密码之前先校验密码是否满足密码规则
   * @param value 
   */
  save(value: any) {
    if (value.userPassword1 === value.userPassword) {
      this.dto = { userId: this.userId, userPassword: value.userPassword };
      this.http.post("/api/admin/baseusers/ruleCheckpassword", {
        userPassword:value.userPassword,
      }).subscribe(res => {
        if(res.code ===200){//密码校验通过才保存密码
          this.userManagerManageService.UpdatePwd(this.dto).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('保存成功'));
              this.modal.close(true);
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
        }else{
          this.msgSrv.warning(res.msg);
          this.clear();
        }
      });
    } else {
      this.msgSrv.warning('两次输入不一致，请重新输入');
      this.clear();
    }
  }
  /**
   * 旧的密码初始化
   */
  // save(value: any) {
  //   if (value.userPassword1 === value.userPassword) {
  //     this.dto = { userId: this.userId, userPassword: value.userPassword };
  //     this.userManagerManageService.UpdatePwd(this.dto).subscribe(res => {
  //       if (res.code === 200) {
  //         this.msgSrv.success(this.appTranslationService.translate('保存成功'));
  //         this.modal.close(true);
  //       } else {
  //         this.msgSrv.error(this.appTranslationService.translate(res.msg));
  //       }
  //     });
  //   } else {
  //     this.msgSrv.warning('两次输入不一致，请重新输入');
  //     this.clear();
  //   }
  // }

  close() {
    this.modal.destroy();
  }

  clear() {
    // this.sf.refreshSchema();
    this.values = {
      userPassword1: '',
      userPassword: ''
    };
  }
}
