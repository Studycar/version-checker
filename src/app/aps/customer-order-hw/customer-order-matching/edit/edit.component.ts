import { Component, OnInit } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { CustomerOrderMatchingQueryService } from "../query.service";

@Component({
  selector: 'customer-order-matching-edit',
  templateUrl: './edit.component.html',
  providers: [CustomerOrderMatchingQueryService]
})
export class CustomerOrderMatchingEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  matchingEssentialOptions: any[] = [];
  matchingTypeOptions: any = [];
  productCategoryOptions: any = [];

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerOrderMatchingQueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.get(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      });
    } else {
    }
    this.loadOptions();
  }


  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_MATCHING_ESSENTIAL': this.matchingEssentialOptions,
      'PS_MATCHING_TYPE': this.matchingTypeOptions,
    });
    this.productCategoryOptions.push(...await this.queryService.getUserProCates());
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    const params = Object.assign({}, this.i, {
    });
    this.queryService.save(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  

}