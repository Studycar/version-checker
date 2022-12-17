/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:13
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-02 14:12:06
 * @Note: ...
 */
import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ProductLineManagerService } from '../../../../modules/generated_module/services/production-line-manager';
import { QueryService } from '../edit.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
/**
 * 新增、编辑资源
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-productlinemanager-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService],
})
export class PlantModelProductlinemanagerEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  isModify: boolean;
  Istrue: boolean;
  readOnly: boolean;
  applicationplant: any[] = [];
  schedulegroup: any[] = [];
  mooptions: any[] = [];
  typeoptions: any[] = [];
  vendoroptions: any[] = [];
  randomUserUrl = '';
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  k = '';
  /**是、否 */
  yesnoOptions: any[] = [];
  needVendors = false;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public productlinemanager: ProductLineManagerService,
    private appconfig: AppConfigService,
    private appTranslationService: AppTranslationService,
    private commonquery: CommonQueryService,
  ) { }

  ngOnInit(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.isModify = false;
    if (this.i.id != null) {
      this.isModify = true;
      this.Istrue = true;
      this.readOnly = true;
    } else {
      this.i.plantCode = this.appconfig.getPlantCode();
      this.changePlant(this.i.plantCode);
      this.productlinemanager.GetScheduleRegion(this.i.plantCode).subscribe(res => {
        this.i.scheduleRegionCode = res.data;
        this.i.enableFlag = 'Y';
      });
      this.Istrue = false;
      this.readOnly = false;
      this.i.gaFlag = 'Y'
    }
    this.loadData();
  }

  loadData() {
    if (this.i.id != null) {
      this.productlinemanager.Get(this.i.id).subscribe(result => {
        this.schedulegroup.push(result.data.scheduleGroupCode);
        this.changePlant(result.data.plantCode);
        this.i = result.data;
        this.iClone = Object.assign({}, this.i);
        this.changeResourceType(this.i.resourceType);
      });
    }
    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.yesnoOptions.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });
    /**初始化工厂 */
    this.commonquery.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationplant.push({
          label: d.plantCode,
          value: d.plantCode,
          tag: {
            scheduleRegionCode: d.scheduleRegionCode,
          },
        });
      });
    });

    this.productlinemanager.GetResourceType().subscribe(res => {
      res.data.forEach(element => {
        this.typeoptions.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });
  }

  changePlant(value: any) {
    this.applicationplant.forEach(element => {
      if (element.value === value) {
        this.i.plantCode = element.label;
        this.i.scheduleRegionCode = element.tag.scheduleRegionCode;
        return;
      }
    });

    this.schedulegroup.length = 0;
    this.i.scheduleGroupCode = null;
    // jianl修改，改成不校验权限的接口
    // this.productlinemanager.GetScheduleGroupCode(value).subscribe(result => {
    //   result.Extra.forEach(element => {
    //     this.schedulegroup.push({
    //       label: element.SCHEDULE_GROUP_CODE,
    //       value: element.SCHEDULE_GROUP_CODE
    //     });
    //   });
    // });
    this.productlinemanager.GetScheduleGroupCode(value).subscribe(result => {
      result.data.forEach(element => {
        this.schedulegroup.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode,
        });
      });
    });
    this.mooptions.length = 0;
    this.productlinemanager.GetMoType(value).subscribe(res => {
      res.data.forEach(element => {
        this.mooptions.push({
          label: element.moType,
          value: element.moType,
        });
      });
    });
  }

  // tonnageChange(value: string) {
  //   this.i.TONNAGE = value.toUpperCase();
  // }

  save(value: any) {
    if (this.needVendors) {
      if (this.i.vendorNumber === null || this.i.vendorNumber === '') { // || this.i.VENDOR_SITE_CODE === null || this.i.VENDOR_SITE_CODE === ''
        this.msgSrv.info('资源类型为采购或外协时，供应商不能为空！');
        return;
      }
    }
    if (this.i.id != null) {
      this.productlinemanager.Edit(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.i.id = null;
      this.i.enableFlag = 'Y';
      this.productlinemanager.Insert(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
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
  /**重置 */
  clear() {
    if (this.i.id !== null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
      this.changePlant(this.i.plantCode);
    } else {
      this.i = {};
    }
  }
  gridView1: GridDataResult = {
    data: [],
    total: 0,
  };
  columns1: any[] = [
    {
      field: 'vendorNumber',
      title: '供应商编码',
      width: '100',
    },
    {
      field: 'vendorName',
      title: '供应商名称',
      width: '100',
    },
  ];

  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor(e.SearchValue, PageIndex, e.PageSize);
  }
  change1({ sender, event, Text }) {
    const value = this.i.vendorNumber || '';
    this.productlinemanager.GetVendorPageList(Text || '', '', 1, sender.PageSize)
      .subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
        if (res.data.totalElements === 1) {
          this.i.vendorNumber = res.data.content[0].vendorNumber;
          this.i.vendorName = res.data.content[0].vendorName;
          this.i.vendorSiteCode = '';
        } else {
          this.msgSrv.warning(
            this.appTranslationService.translate('供应商无效'),
          );
          this.i.vendorNumber = '';
          this.i.vendorName = '';
          this.i.vendorSiteCode = '';
        }
      });
  }

  public loadVendor(VENDOR_NUMBER: string, PageIndex: number, PageSize: number) {
    this.productlinemanager.GetVendorPageList(VENDOR_NUMBER || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

  gridView2: GridDataResult = {
    data: [],
    total: 0,
  };
  columns2: any[] = [
    {
      field: 'vendorSiteCode',
      title: '供应商地点编码',
      width: '100',
    },
    {
      field: 'vendorSiteName',
      title: '供应商地点名称',
      width: '100',
    },
  ];

  search2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendorSite(this.i.plantCode, this.i.vendorNumber, e.SearchValue, PageIndex, e.PageSize);
  }
  change2({ sender, event, Text }) {
    const value = this.i.vendorSiteCode || '';
    if (value === '') {
      this.productlinemanager.GetVendorSitePageList(this.i.plantCode, this.i.vendorNumber, Text || '', '', 1, sender.PageSize)
        .subscribe(res => {
          this.gridView2.data = res.data.content;
          this.gridView2.total = res.data.totalElements;
          if (res.data.totalElements === 1) {
            this.i.id2 = res.data.content.find(x => x.vendorSiteCode === Text).id2;
          } else {
            this.msgSrv.warning(
              this.appTranslationService.translate('供应商无效'),
            );
          }
        });
    }
  }

  public loadVendorSite(PLANT_CODE: string, VENDOR_NUMBER: string, VENDOR_SITE_CODE: string, PageIndex: number, PageSize: number) {
    this.productlinemanager.GetVendorSitePageList(PLANT_CODE || '', VENDOR_NUMBER || '', VENDOR_SITE_CODE || '', '', PageIndex, PageSize)
      .subscribe(res => {
        this.gridView2.data = res.data.content;
        this.gridView2.total = res.data.totalElements;
      });
  }

  vendorChange(value: any) {
    this.i.vendorName = this.gridView1.data.find(x => x.vendorNumber === this.i.vendorNumber).vendorName;
    this.i.vendorSiteCode = '';
  }

  changeEnableMesFlag(value) {
    // 启用MES标识联动实绩排产
    if (value !== 'Y') {
      this.i.enableActualProdFlag = null;
    }
  }

  changeResourceType(value) {
    // 资源类型为外协或采购时，供应商必填
    this.needVendors = value === 'B' || value === 'waixie';
  }
}
