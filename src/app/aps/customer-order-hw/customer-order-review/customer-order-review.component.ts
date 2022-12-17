import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { decimal } from '@shared';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomerOrderReviewEditComponent } from './edit/edit.component';
import { CustomerOrderReviewImportComponent } from './import/import.component';
import { CustomerOrderReviewQueryService } from './query.service';

@Component({
  selector: 'customer-order-review',
  templateUrl: './customer-order-review.component.html',
  providers: [CustomerOrderReviewQueryService]
})
export class CustomerOrderReviewComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerOrderReviewQueryService,
    public http: _HttpClient,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  contractSteelTypeOptions: any = [];
  processingTypeOptions: any = [];
  contractSurfaceOptions: any = [];
  prodTypeOptions: any = [];
  productCategoryOptions: any = []; // PS_PRODUCT_CATEGORY
  plantOptions: any[] = [];

  columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    {
      field: 'plantCode',
      width: 120,
      headerName: '工厂'
    },
    {
      field: 'processingType',
      width: 120,
      headerName: '加工类型',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    // {
    //   field: 'standards',
    //   width: 120,
    //   headerName: '厚度',
    //   valueFormatter: 'ctx.formatterPrecision(value)'
    // },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    // {
    //   field: 'width',
    //   width: 120,
    //   headerName: '宽度'
    // },
    {
      field: 'productCategory',
      width: 120,
      headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'prodType',
      width: 120,
      headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'widthDown',
      width: 120,
      headerName: '宽度(>=)'
    },
    {
      field: 'widthUp',
      width: 120,
      headerName: '宽度(<)'
    },
    {
      field: 'widthStep',
      width: 120,
      headerName: '宽度递增步长'
    },
    {
      field: 'standardsDown',
      width: 120,
      headerName: '厚度(>=)',
      valueFormatter: 'ctx.formatterPrecision(value)'
    },
    {
      field: 'standardsUp',
      width: 120,
      headerName: '厚度(<)',
      valueFormatter: 'ctx.formatterPrecision(value)'
    },
    {
      field: 'standardsStep',
      width: 120,
      headerName: '厚度步长'
    },
    {
      field: 'lengthDown',
      width: 120,
      headerName: '长度(>=)'
    },
    {
      field: 'lengthUp',
      width: 120,
      headerName: '长度(<)'
    },
    {
      field: 'standardsTail',
      width: 120,
      headerName: '字尾'
    },
    {
      field: 'ironLoss',
      width: 120,
      headerName: '铁损'
    },
    {
      field: 'magnetoreception',
      width: 120,
      headerName: '磁感'
    },
    {
      field: 'coilInnerDia',
      width: 120,
      headerName: '钢卷内径'
    },
    {
      field: 'hardness',
      width: 120,
      headerName: '硬度'
    },
    {
      field: 'gloss',
      width: 120,
      headerName: '光泽度'
    },
    {
      field: 'elongation',
      width: 120,
      headerName: '延伸率'
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建时间'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新时间'
    },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.processingTypeOptions;
        break;
      case 2:
        options = this.contractSteelTypeOptions;
        break;
      case 3:
        options = this.contractSurfaceOptions;
        break;
      case 4:
        options = this.productCategoryOptions;
        break;
      case 5:
        options = this.prodTypeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  formatterPrecision = (value: string | number) => value ? decimal.roundFixed(Number(value), 2) : value;

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'processingType', title: '加工类型', ui: { type: UiType.select, options: this.processingTypeOptions } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.contractSteelTypeOptions } },
      { field: 'standards', title: '厚度', ui: { type: UiType.text } },
      { field: 'surface', title: '表面', ui: { type: UiType.select, options: this.contractSurfaceOptions } },
      { field: 'width', title: '宽度', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: null,
      processingType: null,
      steelType: null,
      standards: '',
      surface: null,
      width: '',
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: null,
      processingType: null,
      steelType: null,
      standards: '',
      surface: null,
      width: '',
    }
  }
  
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions()
  }

  loadOptions = super.wrapLoadOptionsFn(async () => {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_PROCESSING_TYPE': this.processingTypeOptions,
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_CONTRACT_SURFACE': this.contractSurfaceOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
    });
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        })
      })
    });
    await this.productCategoryOptions.push(...await this.queryService.getUserProCates());
  })

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    return {
      plantCode: this.queryParams.values.plantCode,
      processingType: this.queryParams.values.processingType,
      steelType: this.queryParams.values.steelType,
      standards: this.queryParams.values.standards,
      surface: this.queryParams.values.surface,
      width: this.queryParams.values.width,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      CustomerOrderReviewEditComponent,
      {
        i: dataItem === undefined ? { id: null } : dataItem
      }
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  remove(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeys('id') : [dataItem.id];
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if(dataItem === undefined) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('确定要删除吗？'),
          nzOnOk: () => {
            this.delete(ids);
          },
        });
      } else {
        this.delete(ids);
      }
    }
  }

  delete(ids) {
    this.queryService.delete(ids).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  import() {
    this.modal.static(
      CustomerOrderReviewImportComponent,
      {
        options: {
          productCategoryOptions: this.productCategoryOptions,
          prodTypeOptions: this.prodTypeOptions,
          processingTypeOptions: this.processingTypeOptions,
          contractSteelTypeOptions: this.contractSteelTypeOptions,
          contractSurfaceOptions: this.contractSurfaceOptions,
        }
      },
      'md'
    ).subscribe((value) => {
      if(value) {
        this.query();
      }
    })
  }

  expColumnsOptions: any[] = [
    { field: 'productCategory', options: this.productCategoryOptions },
    { field: 'steelType', options: this.contractSteelTypeOptions },
    { field: 'surface', options: this.contractSurfaceOptions },
    { field: 'processingType', options: this.processingTypeOptions },
    { field: 'prodType', options: this.prodTypeOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.exportFile();
  }

  exportFile() {
    this.queryService.exportAction(
      this.httpAction,
      this.getQueryParamsValue(true),
      this.excelexport,
      this.context
    );
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }


}
