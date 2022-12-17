import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { decimal } from "@shared";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { MarkupElement1QueryService } from "../query.service";

@Component({
  selector: 'markup-element1-edit',
  templateUrl: './edit.component.html',
  providers: [MarkupElement1QueryService]
})
export class MarkupElement1EditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  markupStateOptions: any[] = [];
  productCategoryOptions: any[] = [];
  prodTypeOptions: any[] = [];
  yesOrNoOptions: any[] = [];
  steelTypeOptions: any[] = [];
  plantOptions: any[] = [];
  @ViewChild('f', { static: true }) f: NgForm;
  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: MarkupElement1QueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      });
    } else {
      this.i.productCategory = this.appconfig.getActiveProductCategory();
      // this.i.markupElementState = '10';
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_YES_NOT': this.yesOrNoOptions,
      'PS_MARKUP_ELEMENT_STATE': this.markupStateOptions,
    });
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.descriptions,
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
    const params = Object.assign({}, this.i, {
      startDate: this.queryService.formatDate(this.i.startDate),
      endDate: this.queryService.formatDate(this.i.endDate),
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