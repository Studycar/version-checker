/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-08-31 15:44:31
 * @LastEditors: Zwh
 * @LastEditTime: 2019-11-04 22:54:49
 * @Note: ...
 */
import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CustomerDivisionService } from 'app/modules/generated_module/services/customer-division-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-plan-customer-division-edit',
  templateUrl: './edit.component.html',
})
export class DemandPlanCustomerDivisionEditComponent implements OnInit {
  i: any;
  title: String = '新增';
  applicationoptions: any[] = [];
  languageoptions: any[] = [];
  readOnly: boolean;
  Istrue: boolean;
  yesOrNo: any[] = [];
  groupOptions: any[] = [];
  userOptions: any[] = [];
  nameOptions: any[] = [];
  valueOptions: any[] = [];
  divOptions: any[] = [];
  scheduleregions: any[] = [];
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryData: CustomerDivisionService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.title = '编辑';
      this.readOnly = false;
      this.Istrue = true;
    } else {
      this.readOnly = false;
      this.Istrue = false;
      this.i.enableFlag = 'Y';
    }
    this.loadData();
    this.i.businessUnitCode = this.appconfig.getActiveScheduleRegionCode();
  }

  private loadData() {
    this.scheduleregions = this.i.scheduleregions;
    if (this.i.id !== null) {
      this.queryData.GetById(this.i.id).subscribe(res => {
        // this.divTypeChange(res.Extra.PARENT_DIVISION_TYPE);
        this.i = res.data;
        this.loadParentOptions(this.valueOptions, this.i.pareatDivisionId, this.downPageIndex, this.pageSize, false);
        this.loadParentOptions(this.valueOptions, '', this.downPageIndex, this.pageSize, false);
        // console.log('aaa:'+this.i.pareatDivisionId);
        // console.log(this.valueOptions);
      });
    }

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.yesOrNo.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('DP_CUSTOMER_DIVISION', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.divOptions.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });

    // this.queryData.GetDiv().subscribe(res => {
    //   res.Extra.forEach(element1 => {
    //     this.valueOptions.push({
    //       label: element1.CUST_DIVISION_VALUE,
    //       value: element1.CUST_DIVISION_VALUE
    //     });
    //   });
    // });

  }

  divTypeChange(value: any) {
    this.valueOptions.length = 0;
    this.i.pareatDivisionId = null;
    this.downSearch('');
  }
  downPageIndex = 1;
  pageSize = 20;
  downSearchCode = '';
  loadParentOptions(options: any[], searchCode: string, pageIndex: number, pageSize: number, isNew: boolean = true) {
    if (isNew) options.length = 0;
    this.queryData.GetDivPage(this.i.parentCustDivisionType, searchCode, pageIndex, pageSize).subscribe(res => {
      res.data.forEach(element1 => {
        this.valueOptions.push({
          label: element1.custDivisionName,
          value: element1.custDivisionValue
        });
      });
    });
  }
  /* 父项scroll */
  downScroll(event: any) {
    this.downPageIndex++;
    this.loadParentOptions(this.valueOptions, this.downSearchCode, this.downPageIndex, this.pageSize, false);
  }
  /* 父项search */
  downSearch(event: any) {
    this.downPageIndex = 1;
    this.downSearchCode = event;
    this.loadParentOptions(this.valueOptions, this.downSearchCode, this.downPageIndex, this.pageSize);
  }
  save() {
    // if (this.i.Id !== null) {
    //   this.queryData.Edit(this.i).subscribe(res => {
    //     if (res.Success === true) {
    //       this.msgSrv.success('保存成功');
    //       this.modal.close(true);
    //     } else {
    //       this.msgSrv.error(res.Message);
    //     }
    //   });
    // } else {
    //   this.queryData.Insert(this.i).subscribe(res => {
    //     if (res.Success === true) {
    //       this.msgSrv.success('保存成功');
    //       this.modal.close(true);
    //     } else {
    //       this.msgSrv.error(res.Message);
    //     }
    //   });
    // }
    this.queryData.Edit(this.i).subscribe(res => {
      // console.log('aaaaaaaaa');
      // console.log(res);
      if (res.code==200) {
            this.msgSrv.success('保存成功');
            this.modal.close(true);
          } else {
            this.msgSrv.error(res.msg);
          }
        });
  }

  close() {
    this.modal.destroy();
  }
}
