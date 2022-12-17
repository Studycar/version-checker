import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { InventoryClassificationService } from './inventory-classification.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { InventoryClassificationEditComponent } from './edit/edit.component';
import Timer = NodeJS.Timer;

@Component({
  selector: 'app-inventory-classification',
  templateUrl: './inventory-classification.component.html',
  providers: [InventoryClassificationService]
})
export class InventoryClassificationComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private modal: ModalHelper,
    private commonQueryService: CommonQueryService,
    private queryService: InventoryClassificationService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  plantOptions: Array<{ label: string, value: any }> = [];
  inventoryModeOptions: Array<{ label: string, value: any }> = [];
  categoryOptions: Array<{ label: string, value: any }> = [];
  whetherOptions: Array<{ label: string, value: any }> = [];
  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions, }
      },
      {
        field: 'inventoryMode',
        title: '库存计划模式',
        ui: { type: UiType.select, options: this.inventoryModeOptions, }
      },
      {
        field: 'categoryCode',
        title: '库存分类',
        ui: {
          type: UiType.scrollSelect,
          options: this.categoryOptions,
          extraEvent: {
            ScrollEventNo: 1,
            SearchEventNo: 2,
          }
        }
      },
      {
        field: 'enableFlag',
        title: '是否启用',
        ui: { type: UiType.select, options: this.whetherOptions, }
      }
    ],
    values: {
      plantCode: null,
      inventoryMode: null,
      categoryCode: null,
      enableFlag: null,
    }
  };
  columns = [
    {
      colId: 'action',
      field: 'action',
      headerName: '操作',
      width: 70,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
      suppressSizeToFit: true,
    },
    { field: 'plantCode', headerName: '工厂', width: 100, menuTabs: ['filterMenuTab'], },
    { field: 'invPlanModel', headerName: '库存计划模式', width: 130, valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'], },
    { field: 'categoryCode', headerName: '库存分类', width: 120, menuTabs: ['filterMenuTab'], },
    { field: 'enableFlag', headerName: '是否启用', width: 120, valueFormatter: 'ctx.optionsFind(value, 2).label', menuTabs: ['filterMenuTab'], },
  ];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false, },
    { field: 'invPlanModel', title: '库存计划模式', width: 150, locked: false, },
    { field: 'categoryCode', title: '库存分类', width: 150, locked: false },
    { field: 'enableFlag', title: '是否启用', width: 150, locked: false, },
  ];
  expColumnsOptions = [
    { field: 'invPlanModel', options: this.inventoryModeOptions },
    { field: 'enableFlag', options: this.whetherOptions },
  ];
  @ViewChild('excelExport', { static: true }) excelExport: CustomExcelExportComponent;
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  pageIndex = 1;
  pageSize = 10;
  categorySetCode = '库存分类';
  categorySearchKey = '';
  timeoutRecord: Timer;
  enterTimeInterval = 500; // 库存分类框输入发起请求的时间间隔，毫秒

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.getPlantOptions();
    this.getInventoryModeOptions();
    this.getWhetherOptions();
    this.getCategoryOptions();
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonQueryService.loadGridViewNew(
      this.queryService.action,
      this.getQueryParams(),
      this.context
    );
  }

  clear() {
    this.queryParams.values.plantCode = null;
    this.queryParams.values.inventoryMode = null;
    this.queryParams.values.categoryCode = null;
    this.queryParams.values.enableFlag = null;
  }

  getQueryParams(isExport: boolean = false) {
    return {
      categoryCode: this.queryParams.values.categoryCode,
      plantCode: this.queryParams.values.plantCode,
      inventoryMode: this.queryParams.values.inventoryMode,
      enableFlag: this.queryParams.values.enableFlag,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: isExport,
    };
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.inventoryModeOptions;
        break;
      case 2:
        options = this.whetherOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  getPlantOptions() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  getInventoryModeOptions() {
    this.commonQueryService.GetLookupByType('INV_PLAN_MODEL').subscribe(res => {
      res.Extra.forEach(item => {
        this.inventoryModeOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  getWhetherOptions() {
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(res => {
      res.Extra.forEach(item => {
        this.whetherOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  getCategoryOptions(categoryCode: string = '') {
    this.commonQueryService.GetCategoryPageList1(
      this.categorySetCode,
      categoryCode,
      this.pageIndex,
      this.pageSize
    ).subscribe(res => {
      if (this.pageIndex === 1) {
        this.categoryOptions.length = 0;
      }
      res.data.content.forEach(item => {
        this.categoryOptions.push({
          label: item.categoryCode,
          value: item.categoryCode
        });
      });
    });
  }

  categoryScroll() {
    this.pageIndex++;
    this.getCategoryOptions(this.categorySearchKey);
  }

  categorySearch(val: string) {
    if (!this.timeoutRecord) {
      this.timeoutRecord = setTimeout(() => {
        this.pageIndex = 1;
        this.categorySearchKey = val;
        this.getCategoryOptions(this.categorySearchKey);
      }, this.enterTimeInterval);
    } else {
      clearTimeout(this.timeoutRecord);
      this.timeoutRecord = setTimeout(() => {
        this.pageIndex = 1;
        this.categorySearchKey = val;
        this.getCategoryOptions(this.categorySearchKey);
      }, this.enterTimeInterval);
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      InventoryClassificationEditComponent,
      { i: { id: dataItem ? dataItem.id : null }, }
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  remove(dataItem: any) {
    this.queryService.deleteDataItem(dataItem.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功！'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  exportFile() {
    this.commonQueryService.exportAction(
      this.queryService.action,
      this.getQueryParams(true),
      this.excelExport,
      this.context
    );
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
