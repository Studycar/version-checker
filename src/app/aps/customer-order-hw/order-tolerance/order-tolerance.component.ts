import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { decimal } from "@shared";
import { BrandService } from "app/layout/pro/pro.service";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { OrderToleranceEditComponent } from "./edit/edit.component";
import { OrderToleranceImportComponent } from "./import/import.component";
import { OrderToleranceQueryService } from "./query.service";

@Component({
  selector: 'order-tolerance',
  templateUrl: './order-tolerance.component.html',
  providers: [OrderToleranceQueryService]
})
export class OrderToleranceComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: OrderToleranceQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

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
      headerName: '工厂',
    },
    {
      field: 'productCategory',
      width: 120,
      headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'allowance',
      width: 120,
      headerName: '公差',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'standardsDown',
      width: 120,
      headerName: '厚度下区间',
    },
    {
      field: 'standardsUp',
      width: 120,
      headerName: '厚度上区间',
    },
    {
      field: 'tolerance',
      width: 120,
      headerName: '下差',
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建日期'
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人'
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新日期'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
  ];

  steelTypeOptions: any[] = [];
  surfaceOptions: any[] = [];
  plantOptions: any[] = [];
  productCategoryOptions: any[] = [];
  gongchaOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.steelTypeOptions;
        break;
      case 2:
        options = this.surfaceOptions;
        break;
      case 3:
        options = this.productCategoryOptions;
        break;
      case 4:
        options = this.gongchaOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;

  queryParams = {
    defines: [
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOptions } },
      { field: 'surface', title: '表面', ui: { type: UiType.select, options: this.surfaceOptions } },
    ],
    values: {
      steelType: null,
      surface: null,
    }
  };

  clear() {
    this.queryParams.values = {
      steelType: null,
      surface: null,
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
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'GONGCHA': this.gongchaOptions,
    });
    this.surfaceOptions.unshift({
      label: '*',
      value: '*'
    });
    await this.plantOptions.push(...await this.queryService.getUserPlants());
    await this.productCategoryOptions.push(...await this.queryService.getUserProCates());
  })

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    const params = this.getQueryParamsValue();
    const httpAction = Object.assign({}, this.httpAction);
    httpAction.url += `?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
    this.queryService.loadGridViewNew(
      httpAction,
      params,
      this.context
    )
  }

  getQueryParamsValue(isExport = false) {
    const params: any = { ...this.queryParams.values, export: isExport };
    params.pageIndex = this._pageNo;
    params.pageSize = this._pageSize;
    return params;
  }

  add(dataItem?: any) {
    this.modal.static(
      OrderToleranceEditComponent,
      {
        i: dataItem === undefined ? { id: null } : dataItem
      }
    ).subscribe((value) => {
      if (value) {
        this.query();
      }
    })
  }

  remove(dataItem?: any) {
    const ids = dataItem === undefined ? this.getGridSelectionKeys('id') : [dataItem.id];
    if (ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if (dataItem === undefined) {
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
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  import() {
    this.modal.static(
      OrderToleranceImportComponent,
      {
        options: {
        }
      },
      'md'
    ).subscribe((value) => {
      if (value) {
        this.query();
      }
    })
  }

  expColumnsOptions: any[] = [
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'productCategory', options: this.productCategoryOptions },
    { field: 'allowance', options: this.gongchaOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.exportFile();
  }

  exportFile() {
    const params = this.getQueryParamsValue(true);
    const httpAction = Object.assign({}, this.httpAction);
    httpAction.url += `?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
    this.queryService.exportAction(
      httpAction,
      params,
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
