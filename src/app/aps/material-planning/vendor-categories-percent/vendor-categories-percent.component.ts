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
import { VendorCategoriesPerentEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vendor-categories-percent',
  templateUrl: './vendor-categories-percent.component.html',
  styleUrls: ['./vendor-categories-percent.component.css']
})
export class VendorCategoriesPercentComponent extends CustomBaseContext implements OnInit {
  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private vendorCategoriesPercentService: VendorCategoriesPercentService,
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
  dimensionNameOptions: any[] = [{ label: '组织', value: 'PLANT' }, { label: '事业部', value: 'BUSI' }];
  dimensionValueOptions: any[] = [];

  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsItems: any[] = [
    {
      field: 'categoriesCode',
      title: '分类',
      width: '100',
    },
    {
      field: 'descriptions',
      title: '描述',
      width: '100',
    },
  ];

  queryParams = {
    defines: [
      {
        field: 'dimensionName',
        title: '维度名',
        required: true,
        ui: { type: UiType.select, options: this.dimensionNameOptions, ngModelChange: this.onDimNameChange }
      },
      {
        field: 'dimensionValues',
        title: '维度值',
        ui: { type: UiType.select, options: this.dimensionValueOptions, ngModelChange: this.onDimValueChange }
      },
      {
        field: 'categoriesCode',
        title: '库存分类',
        ui: {
          type: UiType.popupSelect,
          valueField: 'categoriesCode',
          textField: 'categoriesCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
          },
        },
      },
    ],
    values: {
      dimensionName: 'PLANT',
      dimensionValues: '',
      categoriesCode: { text: '', value: '' },
    }
  };
  columns = [
    {
      colId: 'action',
      field: '',
      headerName: '操作',
      width: 130,
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
    {
      field: 'dimensionName',
      headerName: '维度名',
      width: 100,
      valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'dimensionValues',
      headerName: '维度值',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'categoriesCode',
      headerName: '库存分类',
      width: 130,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'vendorNumber',
      headerName: '供应商编码',
      width: 130,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'vendorName',
      headerName: '供应商名称',
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
      headerName: '供货比例',
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
    },
    {
      field: 'priority',
      headerName: '优先级',
      width: 90,
      menuTabs: ['filterMenuTab'],
    },
  ];
  expColumns = [
    { field: 'dimensionName', title: '维度名称', width: 150, locked: false },
    { field: 'dimensionValues', title: '维度值', width: 150, locked: false },
    { field: 'categoriesCode', title: '库存分类', width: 150, locked: false },
    { field: 'vendorNumber', title: '供应商编码', width: 150, locked: false },
    { field: 'vendorName', title: '供应商名称', width: 150, locked: false },
    { field: 'vendorSiteCode', title: '供应商地址', width: 150, locked: false },
    { field: 'allocationPercent', title: '供货比例', width: 150, locked: false },
    { field: 'effectiveDate', title: '有效日期', width: 150, locked: false },
    { field: 'disableDate', title: '失效日期', width: 150, locked: false },
    { field: 'priority', title: '优先级', width: 150, locked: false },
  ];
  expColumnsOptions = [
    { field: 'dimensionName', options: this.dimensionNameOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelExport: CustomExcelExportComponent;

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.onDimNameChange(this.queryParams.values.dimensionName);
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      dimensionName: 'PLANT',
      dimensionValues: null,
      categoriesCode: { text: '', value: '' },
    };

    this.onDimNameChange(this.queryParams.values.dimensionName);
  }

  commonQuery() {
    this.commonQueryService.loadGridViewNew(
      { url: this.vendorCategoriesPercentService.URL_Prefix + 'queryPage', method: 'GET' },
      this.getQueryParams(),
      this.context
    );
  }

  getQueryParams(isExport: boolean = false) {
    return {
      dimensionName: this.queryParams.values.dimensionName,
      dimensionValues: this.queryParams.values.dimensionValues,
      categoriesCode: this.queryParams.values.categoriesCode.text,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.dimensionNameOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  onDimNameChange(val: string) {
    this.queryParams.values.dimensionValues = null;
    this.loadDimValueOption(val);
  }

  onDimValueChange(val: string) {
    this.queryParams.values.categoriesCode.text = '';
    this.queryParams.values.categoriesCode.value = '';
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

  add(data?: any) {
    this.modal.static(
      VendorCategoriesPerentEditComponent,
      { params: data ? data : {} },
      'lg'
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  exportFile() {
      this.commonQueryService.exportAction(
        { url: this.vendorCategoriesPercentService.URL_Prefix + 'queryList', method: 'GET' },
        this.getQueryParams(true),
        this.excelExport,
        this.context
      );
  }

  remove(data: any) {
    const id = data.id;
    this.vendorCategoriesPercentService.Delete(id).subscribe(res => {
      if (res.code == 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功！'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
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

  rowSelect({ sender, Row, Value, Text }) {
    this.queryParams.values.categoriesCode.text = Text;
    this.queryParams.values.categoriesCode.value = Value;
  }

  searchCate(e: any) {
    if (!this.queryParams.values.dimensionValues) {
      this.msgSrv.warning(this.appTranslationService.translate(this.appTranslationService.translate('请先选择维度值')));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadCate(
      this.queryParams.values.dimensionName,
      this.queryParams.values.dimensionValues,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  public loadCate(dimensionName: string, dimensionValues: string, categoriesCode: string, PageIndex: number, PageSize: number) {
    
    console.log("dimensionName" + dimensionName); 
    this.vendorCategoriesPercentService.QueryStockCategory(dimensionName || '', dimensionValues || '', categoriesCode || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;


      console.log("this.loadCate" + res.data); 
      this.gridViewItems.total = res.data.totalElements;
    });
  }
}
