import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { VendorCategoriesPercentService } from '../../../../modules/generated_module/services/vendor-categories-percent-service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vendor-categories-percent-edit',
  templateUrl: './edit.component.html',
})
export class VendorCategoriesPerentEditComponent extends CustomBaseContext implements OnInit {

  constructor(
    public http: _HttpClient,
    private modalRef: NzModalRef,
    private pro: BrandService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService,
    private appTranslateService: AppTranslationService,
    private vendorCategoriesPercentService: VendorCategoriesPercentService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslateService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
  }

  title = '新增信息';
  params: any;
  paramsClone: any;
  plantOptions: any[] = [];
  isUpdate = false;
  readOnly: boolean;
  dimensionNameOptions: any[] = [{ label: '组织', value: 'PLANT' }, { label: '事业部', value: 'BUSI' }];
  dimensionValueOptions: any[] = [];

  ngOnInit() {
    if (this.params.id !== undefined) {
      this.title = '编辑信息';
      this.isUpdate = true;
      this.readOnly = true;
      this.onDimNameChange(this.params.dimensionName);
    }
  }

  save() {
    this.vendorCategoriesPercentService.Save(this.params, this.isUpdate).subscribe(res => {
      if (res.code = 200) {
        this.msgSrv.success(this.appTranslateService.translate(res.msg));
        this.modalRef.close(true);
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.msg));
      }
    });
  }

  onDimNameChange(val: string) {
    this.loadDimValueOption(val);
  }

  loadDimValueOption(val: string) {
    this.dimensionValueOptions.length = 0;
    if (val === 'BUSI') {
      this.commonQueryService.GetAllScheduleRegionNew().subscribe(res => {
        res.data.forEach(item => {
          this.dimensionValueOptions.push({
            label: item.scheduleRegionCode,
            value: item.scheduleRegionCode
          });
        });
      });
    } else if (val === 'PLANT') {
      this.commonQueryService.GetUserPlant(this.appConfigService.getDefaultScheduleRegionCode(), '').subscribe(res => {
        res.Extra.forEach(item => {
          this.dimensionValueOptions.push({
            label: item.plantCode,
            value: item.plantCode
          });
        });
      });
    }
  }

  close() {
    this.modalRef.destroy();
  }

  clear() {
    this.params = this.paramsClone;
    this.paramsClone = Object.assign({}, this.params);
  }

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'categoriesCode',
      title: '分类',
      width: '100'
    },
    {
      field: 'descriptions',
      title: '描述',
      width: '100'
    }
  ];

  cate_rowSelect({ sender, Row, Value, Text }) {
    this.params.categoriesCode = Value;
  }

  searchCate(e: any) {
    if (!this.params.dimensionValues) {
      this.msgSrv.warning(this.appTranslateService.translate(this.appTranslateService.translate('请先选择维度值')));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadCate(
      this.params.dimensionName,
      this.params.dimensionValues,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  public loadCate(dimensionName: string, dimensionValues: string, categoriesCode: string, PageIndex: number, PageSize: number) {
    this.vendorCategoriesPercentService.QueryStockCategory(dimensionName || '', dimensionValues || '', categoriesCode || '', PageIndex, PageSize).subscribe(res => {
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
    },
    {
      field: 'vendorSiteCode',
      title: '供应商地址',
      width: '100'
    }
  ];

  vendor_rowSelect({ sender, Row, Value, Text }) {
    this.params.vendorNumber = Value;
    this.params.vendorSiteCode = Row.vendorSiteCode;
  }

  searchVendor(e: any) {
    if (!this.params.dimensionValues) {
      this.msgSrv.warning(this.appTranslateService.translate(this.appTranslateService.translate('请先选择维度值')));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadVendor(
      this.params.dimensionName,
      this.params.dimensionValues,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  public loadVendor(dimensionName: string, dimensionValues: string, vendorNumber: string, PageIndex: number, PageSize: number) {
    this.vendorCategoriesPercentService.QueryVendor(dimensionName || '', dimensionValues || '', vendorNumber || '', PageIndex, PageSize).subscribe(res => {
      this.gridView2.data = res.data.content;
      this.gridView2.total = res.data.totalElements;
    });
  }
}
