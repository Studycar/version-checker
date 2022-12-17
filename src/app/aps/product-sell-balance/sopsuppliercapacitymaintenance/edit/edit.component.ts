/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:09:02
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-17 19:15:33
 * @Note: ...
 */
import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { SopSupplierCapacityMaintenanceService } from 'app/modules/generated_module/services/sopsuppliercapacitymaintenance-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopsuppliercapacitymaintenance-edit',
  templateUrl: './edit.component.html',
})
export class ProductSellBalanceSopsuppliercapacitymaintenanceEditComponent implements OnInit {

  record: any = {};
  i: any;
  plantoptions: any[] = [];
  itemoptions = [];
  readOnly: Boolean = false;
  title: String = '新增';
  yesOrNo: any[] = [];
  plantCode: String;
  typeOptions: any[] = [];
  valueOptions: any[] = [];
  flag: Boolean = false; // popup 弹出框标识

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: SopSupplierCapacityMaintenanceService,
    private appconfig: AppConfigService,
    private appTranslationService: AppTranslationService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.flag = true;
      this.readOnly = true;
      this.title = '编辑';
      this.dataservice.GetById(this.i.id).subscribe(res => {
        this.valueOptions.push(res.data.divisionValue);
        this.i = res.data;
        this.loadMore();
      });
    } else {
      const k = new Date();
      k.setDate(1);
      this.i.startDate = k;
      this.i.plantCode = this.appconfig.getPlantCode();
    }
    this.LoadData();
  }

  LoadData() {

    this.commonquery.GetLookupByTypeRef('SOP_CAPACITY_TYPE', this.typeOptions);

    this.commonquery.GetLookupByTypeRef('FND_YES_NO', this.yesOrNo);

    // this.commonquery.GetLookupByTypeLang('SOP_CAPACITY_TYPE', this.appconfig.getLanguage()).subscribe(res => {
    //   res.Extra.forEach(element => {
    //     this.typeOptions.push({
    //       label: element.MEANING,
    //       value: element.LOOKUP_CODE
    //     });
    //   });
    // });

    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element1 => {
        this.plantoptions.push({
          label: element1.plantCode,
          value: element1.plantCode
        });
      });
    });

    // this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
    //   res.Extra.forEach(element1 => {
    //     this.yesOrNo.push({
    //       label: element1.MEANING,
    //       value: element1.LOOKUP_CODE
    //     });
    //   });
    // });
  }

  save() {
    if (this.i.id === null) {
      if (this.i.endDate === undefined) {
        this.i.endDate = '';
      }
      this.dataservice.SaveForNew(this.i).subscribe(res => {
        if (res.code == 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.dataservice.EditData(this.i).subscribe(res => {
        if (res.code == 200) {
          this.msgSrv.success('修改成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'vendorNumber',
      title: '供应商编码',
      width: '100'
    },
    {
      field: 'vendorName',
      title: '供应商名称',
      width: '100'
    }
  ];

  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor(e.SearchValue, PageIndex, e.PageSize);
  }
  change1({ sender, event, Text }) {
    const value = this.i.vendorNumber || '';
    this.dataservice.GetVendorPageList(Text || '', '', 1, sender.PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
      if (res.data.totalElements === 1) {
        this.i.vendorNumber = res.data.content.find(x => x.vendorNumber === Text).vendorNumber;
        this.flag = true;
      } else {
        this.msgSrv.warning(this.appTranslationService.translate('供应商无效'));
        this.i.vendorNumber = '';
        this.i.vendorName = '';
        this.flag = false;
      }
    });

  }

  vendorChange(value: any) {
    this.flag = true;
  }

  public loadVendor(vendorNumber: string, PageIndex: number, PageSize: number) {
    this.dataservice.GetVendorPageList(vendorNumber || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

  typeChange(value: any) {
    this.valueOptions.length = 0;
    this.i.divisionValue = null;
    this.loadMore();
    this.pageIndex = 1;
  }

  randomUserUrl = '';
  isLoading: boolean;
  pageIndex = 0;
  k: any;
  pageSize = 10;
  loadMore(): void {
    this.randomUserUrl = '/api/sop/sopsupplycapacity/getValue?type=' + this.i.divisionType + '&plantCode=' + this.i.plantCode + '&pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize + '&k=' + this.k;
    this.isLoading = true;
    this.dataservice.getRandomNameList(this.randomUserUrl).subscribe(data => {
      this.isLoading = false;
      this.valueOptions = [...this.valueOptions, ...data];
    });
    this.pageIndex++;
  }

  onSearch(value: string): void {
    this.pageIndex = 1;
    while (this.valueOptions.length !== 0) {
      this.valueOptions.pop();
    }
    this.isLoading = true;
    this.k = value;
    this.loadMore();
  }

}
