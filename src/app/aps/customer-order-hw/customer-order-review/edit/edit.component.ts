import { Component, OnInit } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { decimal } from "@shared";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { CustomerOrderReviewQueryService } from "../query.service";

@Component({
  selector: 'customer-order-review-edit',
  templateUrl: './edit.component.html',
  providers: [CustomerOrderReviewQueryService]
})
export class CustomerOrderReviewEditComponent implements OnInit {
  
  /**false：新增信息，true：编辑信息 */
  isModify: boolean = false;
  i: any; 
  iClone: any;
  contractSteelTypeOptions: any = [];
  processingTypeOptions: any = [];
  contractSurfaceOptions: any = [];
  prodTypeOptions: any = [];
  productCategoryOptions: any = []; // PS_PRODUCT_CATEGORY
  plantOptions: any[] = [];
  formatterPrecision = (value: string | number) => value ? decimal.roundFixed(Number(value), 2) : value;

  constructor(
    private modal: NzModalRef,
    private queryService: CustomerOrderReviewQueryService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    this.loadOptions();
    if(this.i.id) {
      this.isModify = true;
      this.queryService.get(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      })
    }
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_CONTRACT_SURFACE': this.contractSurfaceOptions,
      'PS_PROCESSING_TYPE': this.processingTypeOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
    });
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        })
      })
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
    this.i.standards = this.formatterPrecision(this.i.standards);
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