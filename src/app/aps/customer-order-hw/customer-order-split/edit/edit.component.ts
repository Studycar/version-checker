import { Component, OnInit } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { CustomerOrderSplitQueryService } from "../query.service";


@Component({
  selector: 'customer-order-split-edit',
  templateUrl: './edit.component.html',
  providers: [CustomerOrderSplitQueryService]
})
export class CustomerOrderSplitEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  productCategoryOptions: any[] = [];
  steelTypeOptions: any[] = [];
  mantissalOptions: any = [];
  processingTypeOptions: any[] = [];
  unitOptions: any[] = [];

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerOrderSplitQueryService,
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
      this.i.branchStandards = this.i.branchStandards.toString();
    } else {
      this.i.unit = '003'; // 吨
      this.i.mantissal = '30'; // 保留尾数
    }
    this.loadOptions();
  }


  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_MANTISSAL': this.mantissalOptions,
      'PS_PROCESSING_TYPE': this.processingTypeOptions,
      'PS_ITEM_UNIT': this.unitOptions,
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