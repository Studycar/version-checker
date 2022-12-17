import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { DesignateSupplierRulesService } from '../designate-supplier-rules.service';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'replace-item-quota-edit',
  templateUrl: './edit.component.html',
  providers: [DesignateSupplierRulesService]
})
export class DesignateSupplierRulesEditComponent implements OnInit {

  constructor(
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: NzModalRef,
    private commonQueryService: CommonQueryService,
    private designateSupplierRulesService: DesignateSupplierRulesService,
    private appTranslateService: AppTranslationService,
    private queryService: DesignateSupplierRulesService,
  ) { }

  params: any;
  paramsClone: any;
  title = '新增信息';
  editDisabled = false;
  whetherOptions: any[] = [];
  materialRangeOptions: any[] = [];
  plantOptions: any[] = [];
  itemOptions: GridDataResult = {
    data: [],
    total: 0
  };
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];
  vendorOptions: GridDataResult = {
    data: [],
    total: 0
  };
  columnsVendor: any[] = [
    {
      field: 'vendorNumber',
      title: '供应商编码',
      width: '100'
    },
    {
      field: 'vendorSiteCode',
      title: '供应商描述',
      width: '100'
    }
  ];

  ngOnInit() {
    if (this.params.id !== undefined) {
      this.title = '编辑信息';
      this.editDisabled = true;
      // this.queryService.getReplaceItemQuotaById(this.params.id).subscribe(res => {
      //   this.params = res.data;
      //   this.paramsClone = Object.assign({}, this.params);
      // });
    }
    this.LoadData();
    this.loadWhetherOptions();
    this.loadMaterialRangeOptions();
  }

  loadWhetherOptions() {
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      this.whetherOptions.length = 0;
      result.Extra.forEach(d => {
        this.whetherOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  loadMaterialRangeOptions() {
    this.commonQueryService.GetLookupByType('MRP_PLAN_INCLUDE_ITEMS').subscribe(res => {
      this.materialRangeOptions.length = 0;
      res.Extra.forEach(item => {
        this.materialRangeOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  LoadData() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  searchItems(e: any) {
    const pageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.params.plantCode, e.SearchValue, pageIndex, e.PageSize);
  }

  public loadItems(plantCode: string, itemCode: string, pageIndex: number, pageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(plantCode || '', itemCode || '', '', pageIndex, pageSize).subscribe(res => {
      this.itemOptions.data = res.data.content;
      this.itemOptions.total = res.data.totalElements;
    });
  }

  searchVendor(e: any) {
    const pageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor(this.params.plantCode, this.params.itemId, e.SearchValue, pageIndex, e.PageSize);
  }

  public loadVendor(plantCode: string, itemCode: string, vendorNumber: string, pageIndex: number, pageSize: number) {
    // 加载物料
    this.designateSupplierRulesService.queryApprovedVendorList(plantCode || '', itemCode || '', vendorNumber, pageIndex, pageSize).subscribe(res => {
      this.vendorOptions.data = res.data.content;
      this.vendorOptions.total = res.data.totalElements;
    });
  }

  save() {
    this.queryService.update(this.params).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslateService.translate('保存成功！'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.params = this.paramsClone;
    this.paramsClone = Object.assign({}, this.params);
  }
}
