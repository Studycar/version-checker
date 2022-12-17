import { Component, OnInit } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { CustomerOrderReviewEssentialQueryService } from "../query.service";


@Component({
  selector: 'customer-order-review-essential-edit',
  templateUrl: './edit.component.html',
  providers: [CustomerOrderReviewEssentialQueryService]
})
export class CustomerOrderReviewEssentialEditComponent implements OnInit {
  
  /**false：新增信息，true：编辑信息 */
  isModify: boolean = false;
  i: any; 
  iClone: any;

  essentialOptions: any = [];
  YesNoOptions: any = [];

  constructor(
    private modal: NzModalRef,
    private queryService: CustomerOrderReviewEssentialQueryService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.get(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      })
    }
    this.loadOptions();
  }

  loadOptions() {
    this.queryService.GetLookupByType('PS_CUS_ORDER_ESSENTIAL').subscribe(res => {
      if(res.Success && res.Extra.length > 0) {
        res.Extra.forEach(d => {
          // 不显示工厂
          if(d.lookupCode !== 'PLANT_CODE') {
            this.essentialOptions.push({
              label: d.meaning,
              value: d.lookupCode,
            });
          }
        });
      }
    })
    this.queryService.GetLookupByTypeRefAll({
      'PS_YES_NOT': this.YesNoOptions,
    });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    this.queryService.save(this.i).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }
}