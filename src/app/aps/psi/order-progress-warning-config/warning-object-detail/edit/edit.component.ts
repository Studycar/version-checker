import { Component, OnInit } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { WaningObjectQueryService } from "../query.service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";

@Component({
  selector: 'order-progress-warning-config-edit',
  templateUrl: `./edit.component.html`,
  providers: [WaningObjectQueryService],
})
export class OrderProgressWarningConfigDetailEditComponent implements OnInit {

  isModify: boolean = false;
  i: any;

  warnLevelOptions: any[] = [];
  userNameOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public queryService: WaningObjectQueryService,
    private appTranslationService: AppTranslationService,
    public http: _HttpClient,
  ) { }
  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getById(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
        }
      })
    }
    this.loadOptions();
  }

  loadOptions() {
    this.loadWarnLevel();
    this.loadUser();
  }

  loadWarnLevel() {
    this.queryService.GetLookupByTypeRef('SOP_WARN_LEVEL', this.warnLevelOptions);
  }

  loadUser() {
    this.queryService.GetUserInfos().subscribe(res => {
      res.data.forEach(d => {
        this.userNameOptions.push({
          label: d.description,
          value: d.userName,
          msgAccount: d.emailAddress
        })
      })
    })
  }

  userNameChange(event: any) {
    const user = this.userNameOptions.find(user => user.value === this.i.userName);
    if(user) {
      this.i.userDesc = user.label;
      this.i.msgAccount = user.msgAccount;
    }
  }

  save(f) {
    this.queryService.save(this.i).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate("保存成功"));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  close() {
    this.modal.destroy();
  }
}