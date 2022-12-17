import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { PlanscheduleHWCustomerService } from "../query.service";

@Component({
  selector: 'planschedule-hw-customer-info-change',
  templateUrl: './info-change.component.html',
  providers: [PlanscheduleHWCustomerService]
})
export class PlanscheduleHWCustomerInfoChangeComponent implements OnInit {
  i: any;
  isEdit = false;
  regionOptions = [];
  domesticOptions = [];
  currencyOptions = [];
  cusGradeOptions = [];
  cusTypeOptions = [];
  changeReason = ''
  customersOptions = {
    1: {'PS_CUSTOMER_STATUS': []},
    2: {'PS_CUS_REGION': []},
    3: {'PS_CUS_DOMESTIC': []},
    4: {'PS_CURRENCY': []},
  };

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public router: Router,
    private ideSubmitService: IdeSubmitService,
    private queryService: PlanscheduleHWCustomerService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    this.queryService.getFullById(this.i.id).subscribe(res => {
      if (res.code === 200) {
        this.i = Object.assign({}, res.data);
      }
    });
    this.loadOptions();
  }

  loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CUS_DOMESTIC': this.domesticOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_CUS_REGION': this.regionOptions,
      'PS_CUS_GRADE': this.cusGradeOptions,
      'CUS_TYPE': this.cusTypeOptions
    });
  }

  /** 所属客户相关的 */

  public gridViewCustoms: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsCustoms: any[] = [
    {
      field: 'cusCode',
      title: '客户编码',
      width: '100'
    },
    {
      field: 'cusName',
      title: '客户名称',
      width: '100'
    }
  ];
  onPopupSelectTextChanged(event: any) {
    this.i.affiliatedCus = event.Text.trim();
  }
  onRowSelect(e: any) {
    this.i.affiliatedCus = e.Value;
  }
  public searchCustoms(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadCustoms(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }
  public loadCustoms(
    CUS_NAME: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.queryService
      .getCustoms({
        cusName: CUS_NAME,
        pageIndex: PageIndex,
        pageSize: PageSize,
      })
      .subscribe(res => {
        this.gridViewCustoms.data = res.data.content;
        this.gridViewCustoms.total = res.data.totalElements;
      });
  }

  submit(value) {
    if (this.i.cusName === this.i.cusAbbreviation) {
      this.msgSrv.warning(this.appTranslationService.translate('客户名称不能与客户简称重复！'));
      return;
    }
    if (this.isEdit) { // 主数据编辑
      this.queryService.saveCusFull(this.i).subscribe((res) => {
        if(res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      })
    } else { // 主数据信息变更
      this.queryService.checkNameAndAbbreviation(this.i).subscribe(res => {
        if(res.code === 200) {
          this.modal.close(true);
          this.ideSubmitService.navigate('ideCustomerInfoChange', {
            formData: this.i
          })
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      })

    }
  }

  close() {
    this.modal.destroy();
  }
}