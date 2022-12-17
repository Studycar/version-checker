import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { BehaviorSubject, Observable } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { UserProductCategoryQueryService } from "../query.service";

@Component({
  selector: 'user-product-category-edit',
  templateUrl: './edit.component.html',
  providers: [UserProductCategoryQueryService]
})
export class UserProductCategoryEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  productCategoryOptions: any[] = [];
  employoptions: any[] = [];
  @ViewChild('f', { static: true }) f: NgForm;
  isLoading = false;
  pageIndex = 1;
  pageSize = 10;
  searchValue: string = '';

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: UserProductCategoryQueryService,
    public http: _HttpClient,
  ) {
  }
  getUserList = (value, pageIndex, pageSize) => this.queryService.getUsersPage(value, pageIndex, pageSize);

  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i.enableFlag = 'Y';
    }
    this.loadOptions();
  }

  loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_PRODUCT_CATEGORY': this.productCategoryOptions,
    });
  }

  employchange(e) {
    this.i.employeeNumber = e.value;
    this.i.fullName = e.label;
  }

  categoryChange(e) {
    const option = this.productCategoryOptions.find(o => o.value === this.i.categoryCode);
    this.i.categoryName = option ? option.label : this.i.categoryCode;
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save() {
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