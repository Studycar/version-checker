import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { VendorCategoriesPercentService } from '../../../modules/generated_module/services/vendor-categories-percent-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SupplierService } from 'app/modules/generated_module/services/supplier-service';
import { DeliveryRatioReplaceService } from 'app/modules/generated_module/services/delivery-ratio-replace-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delivery-ratio-replace',
  templateUrl: './delivery-ratio-replace.component.html',
  providers: [DeliveryRatioReplaceService]
})
export class DeliveryRatioReplaceComponent extends CustomBaseContext implements OnInit {
  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    public querydata: SupplierService,
    private deliveryRatioReplaceService: DeliveryRatioReplaceService,
    private modal: ModalHelper,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  plantOptions: any[] = [];
  // httpExportAction = {
  //   url: this.deliveryRatioReplaceService.URL_Prefix + 'QueryData',
  //   method: 'GET',
  //   data: null
  // };

  httpAction = { url: this.deliveryRatioReplaceService.seachUrl, method: 'POST' };

  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };

  public gridViewVendors: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
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
  public columnsVendors: any[] = [
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

  public queryParams = {
    defines: [
      // { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 }, required: true },
      // {
      //   field: 'itemCode', title: '物料', ui: {
      //     type: UiType.popupSelect, valueField: 'itemCode', textField: 'itemCode', gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 2
      //   }
      // },
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 },
      },
      {
        field: 'itemCode',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode' /*valueField和textField与gridView的列对应  */,
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2,
        },
      },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: { value: '', text: '' },
    }
  };

  columns = [
    {
      field: 'plantCode',
      headerName: '工厂',
      locked: true,
      width: 100,

      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemCode',
      headerName: '物料编码',
      width: 130,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'vendorNumber',
      headerName: '供应商',
      width: 140,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'vendorSiteCode',
      headerName: '供应商地址',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'allocationPercent',
      headerName: '分配比例',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'effectiveDate',
      headerName: '有效日期',
      width: 130,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'disableDate',
      headerName: '失效日期',
      width: 130,
      menuTabs: ['filterMenuTab'],
    }
  ];
  expColumns = [
    {
      field: 'plantCode',
      title: '工厂',
      locked: true,
      width: 100,

      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemCode',
      title: '物料编码',
      width: 130,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'vendorNumber',
      title: '供应商',
      width: 140,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'vendorSiteCode',
      title: '供应商地址',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'allocationPercent',
      title: '分配比例',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'effectiveDate',
      title: '有效日期',
      width: 130,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'disableDate',
      title: '失效日期',
      width: 130,
      menuTabs: ['filterMenuTab'],
    }
  ];

  selectKeys = 'Id';

  ngOnInit() {
    this.LoadData();
    this.plantChange(this.queryParams.values.plantCode);
    // this.loadVendor('', '', 1, 10);
    this.query();
  }

  // searchVendors(e: any) {
  //   const PageIndex = e.Skip / e.PageSize + 1;
  //   this.loadVendor(e.SearchValue, e.SearchValue, PageIndex, e.PageSize);
  // }

  // public loadVendor(VENDOR_NUMBER: string, VENDOR_NAME: string, PageIndex: number, PageSize: number) {
  //   this.querydata.GetVendorPageList(VENDOR_NUMBER || '', '', PageIndex, PageSize).subscribe(res => {
  //     this.gridViewVendors.data = res.Result;
  //     this.gridViewVendors.total = res.TotalCount;
  //   });
  // }

  plantChange(value: any) {
    this.queryParams.values.itemCode.text = '';
    this.loadItems(value, '', 1, 10);
  }

  // public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
  //   // 加载物料
  //   this.commonQueryService.GetUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
  //     this.gridViewItems.data = res.Result;
  //     this.gridViewItems.total = res.TotalCount;
  //   });
  // }

  public loadItems(
    PLANT_CODE: string,
    ITEM_CODE: string,
    PageIndex: number,
    PageSize: number,
    ViewNo: number = 1,
  ) {
    // 加载物料
    this.commonQueryService
      .getUserPlantItemPageList(
        PLANT_CODE || '',
        ITEM_CODE || '',
        '',
        PageIndex,
        PageSize,
      )
      .subscribe(res => {
        if (ViewNo === 1) {
          this.gridViewItems.data = res.data.content;
          this.gridViewItems.total = res.data.totalElements;
        }
        // else {
        //   this.gridViewItems2.data = res.Result;
        //   this.gridViewItems2.total = res.TotalCount;
        // }
      });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.plantCode, e.SearchValue, PageIndex, e.PageSize);
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

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: { value: '', text: '' },
      // VENDOR_NUMBER: { value: '', text: '' },
    };

  }

  private commonQuery() {
    this.commonQueryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParams(),
      this.context
    );

  }

  getQueryParams(isExport: boolean = false) {
    return {
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode.text,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  expData: any[] = [];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }

}
