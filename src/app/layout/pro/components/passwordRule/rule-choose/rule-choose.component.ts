import { Component, Inject, OnInit } from '@angular/core';
//import { ResetPasswordService } from './resetPassword.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
//import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
const NUM_REG = /^(?=.*\d+).+$/;
const WORD_REG = /^(?=.*[a-zA-Z]+).+$/;
const CHARACTER_REG = /^(?=.*[^a-zA-Z\d])[^!<>%&_+\s]+$/;

@Component({
    selector: 'rule-choose',
    templateUrl: './rule-choose.component.html',
    
    //: [ResetPasswordService],
  },
)
export class PasswordRuleRuleChooseComponent implements OnInit {
  allChecked = false;
  indeterminate = true;
  ruleList = [];//用于页面展示的数据
  saveRuleList=[];
  initList = [];//查询得到的原始数据

  constructor(
    private appApiService: AppApiService,
    private msgSrv: NzMessageService,
    
    private modal: NzModalRef,
    private http: _HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    //this.userName = this.tokenService.get().name;
  }
  ngOnInit() {
    this.initList = [];
    this.ruleList = [];
    // this.gridOptions.enableSorting = false;
    //得到校验规则
    this.getPasswordRule();
  }



  ///api/admin/baselookuptypesb/querylookupvalue?typeCode=CHECK_PASSWORD&language=zh-CN
  getPasswordRule(){
    
    this.http.get("/api/admin/baselookuptypesb/querylookupvalueInTakeEffect", {
      typeCode: "CHECK_PASSWORD",
      language:"zh-CN",
    }).subscribe(res => {
      this.initList = res.data;
      res.data.forEach(element => {
        const row: any = {
          label: element.meaning,
          value: element.id,
        };
        row.checked = element.attribute10 === 'true';
        this.ruleList.push(row);
      });
      this.updateSingleChecked();
    });
  }
  parseTime(d: any) {
    const newDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' '
      + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    return newDate;
  }
  /**
   * 更新密码校验规则
   */
   updatePasswordRule(){
    this.saveRuleList =[];
    for(var i =0 ;i< this.ruleList.length;i++){
      var iData = this.ruleList[i];
      for(var j = 0 ;j <this.initList.length ;j++){
        var jData = this.initList[j];
        if(iData.value === jData.id){
          if(iData.checked){
            jData.endDate = null
          }else{
            jData.endDate =this.parseTime(new Date());
          }
          this.saveRuleList.push(jData);
          break;
        }
      }
    }
    this.appApiService.call<ResponseDto>(
      "/api/admin/baselookuptypesb/updatelookupvalue", 
      this.saveRuleList,
      { method: 'POST' }
      ).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(res.msg || '更新成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
  }


  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.ruleList = this.ruleList.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.ruleList = this.ruleList.map(item => ({
        ...item,
        checked: false
      }));
    }
  }



  updateSingleChecked(): void {
    if (this.ruleList.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.ruleList.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

}
