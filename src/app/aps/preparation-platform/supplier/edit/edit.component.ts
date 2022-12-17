import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SupplierService } from '../../../../modules/generated_module/services/supplier-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-supplier-edit',
  templateUrl: './edit.component.html',
})
export class PreparationPlatformSupplierEditComponent implements OnInit {
  i: any;
  iClone: any;
  public readOnly: Boolean = false;
  plantoptions: any[] = [];
  statusoptions: any[] = [];
  siteoptions: any[] = [];
  /**是否 */
  yesnoOptions: any[] = [];

  title: String = '新增';

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private dataService: SupplierService,
    private appConfig: AppConfigService,
    private appTranslationService: AppTranslationService,
    private commonquery: CommonQueryService
  ) { }

  ngOnInit(): void {
    this.LoadData();
    if (this.i.id !== null) {
      this.title = '编辑';
      this.readOnly = true;
      this.dataService.GetById(this.i.id).subscribe(res => {
        this.i = res.data;
        this.iClone = Object.assign({}, this.i);
        this.vendorChange(this.i.vendorNumber);
      });
    } else {
      this.readOnly = false;
      this.i.plantCode = this.appConfig.getPlantCode();
      this.i.enableFlag = 'Y';
    }
  }

  LoadData() {
    this.commonquery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });

    this.commonquery.GetLookupByTypeNew('PC_PO_ASL_STATUS').subscribe(res => {
      res.data.forEach(element => {
        this.statusoptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(result => {
      // this.yesnoOptions.length = 0;
      result.data.forEach(d => {
        this.yesnoOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  save() {
    this.dataService.save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
  /**重置 */
  clear() {
    this.i = this.iClone;
    this.iClone = Object.assign({}, this.i);
  }
  plantChange(value: any) {
    this.i.itemCode = '';
    this.i.itemId = '';
    // this.loadItems(value, '', 1, 10);
  }

  itemChange(value: any) {
    this.i.fullName = '';
    this.i.buyer = value.Row.buyer;
    this.i.itemDesc = value.Row.descriptionsCn;
    /*this.dataService.GetItemDetail(value.Text).subscribe(res => {
      this.i.itemDesc = res.Extra.ITEM_DESC;
      this.i.BUYER = res.Extra.BUYER;
    });*/
  }

  vendorChange(value: any) {
    const vendorNumber = typeof value === 'string' ? value : value.Text;
    if (typeof value !== 'string') {
      this.i.vendorSiteCode = null;
    }
    while (this.siteoptions.length !== 0) {
      this.siteoptions.pop();
    }
    this.dataService.GetVendorSite(vendorNumber, this.i.plantCode || '').subscribe(res => {
      res.data.content.forEach(element => {
        this.siteoptions.push({
          label: element.vendorSiteCode,
          value: element.vendorSiteCode
        });
      });
      if (this.i.vendorSiteCode === null && this.siteoptions.length > 0) {
        this.i.vendorSiteCode = this.siteoptions[0].value;
      }
    });
  }

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];
  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }
  change1({ sender, event, Text }) {
    const value = this.i.itemCode || '';
    if (value !== '') {
      // 加载物料
      this.commonquery.getUserPlantItemPageList(this.i.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
        if (res.data.totalElements === 1) {
          this.i.itemId = res.data.content.find(x => x.itemCode === Text).itemId;
          this.i.itemCode = res.data.content.find(x => x.itemCode === Text).itemCode;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
    }
  }
  // 加载物料
  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

  gridView2: GridDataResult = {
    data: [],
    total: 0
  };
  columns2: any[] = [
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

  search2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor(e.SearchValue, PageIndex, e.PageSize);
  }
  change2({ sender, event, Text }) {
    // const value = this.i.VENDOR_NUMBER || '';
    this.dataService.getVendorPageList(Text || '', '', 1, sender.PageSize).subscribe(res => {
      this.gridView2.data = res.data.content;
      this.gridView2.total = res.data.totalElements;
      if (res.data.totalElements === 1) {
        this.i.vendorNumber = res.data.content[0].vendorName;
      } else {
        this.msgSrv.warning(this.appTranslationService.translate('供应商无效'));
        this.i.vendorNumber = '';
      }
    });
  }

  public loadVendor(VENDOR_NUMBER: string, PageIndex: number, PageSize: number) {
    this.dataService.getVendorPageList(VENDOR_NUMBER || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView2.data = res.data.content;
      this.gridView2.total = res.data.totalElements;
    });
  }

}
