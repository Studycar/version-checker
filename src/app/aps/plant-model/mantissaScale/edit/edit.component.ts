import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PsMantissaScaleService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'PsMantissaScaleEdit',
  templateUrl: './edit.component.html',
  providers: [PsMantissaScaleService]
})
export class PsMantissaScaleEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  productCategoryOptions: any[] = [];
  prodTypeOptions: any[] = [];  
  plantOptions: any[] = [];
  @ViewChild('f', { static: true }) f: NgForm;



  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: PsMantissaScaleService,
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
      this.i.plantCode = this.appconfig.getActivePlantCode();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }
  

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    const params = Object.assign({}, this.i, {    });
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