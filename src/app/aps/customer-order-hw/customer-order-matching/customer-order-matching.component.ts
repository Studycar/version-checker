import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { CustomerOrderMatchingEditComponent } from "./edit/edit.component";
import { CustomerOrderMatchingQueryService } from "./query.service";


@Component({
  selector: 'customer-order-matching',
  templateUrl: './customer-order-matching.component.html',
  providers: [CustomerOrderMatchingQueryService]
})
export class CustomerOrderMatchingComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerOrderMatchingQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  matchingEssentialOptions: any[] = [];
  productCategoryOptions: any[] = [];
  matchingTypeOptions: any = [];
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
      field: 'matchingEssential',
      width: 120,
      headerName: '匹配维度',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'productCategory',
      width: 120,
      headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'priority',
      width: 120,
      headerName: '优先级',
    },
    {
      field: 'matchingType',
      width: 120,
      headerName: '匹配类型',
      valueFormatter: 'ctx.optionsFind(value,3).label'
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
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新时间'
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人'
    },
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.matchingEssentialOptions;
        break;
      case 2:
        options = this.productCategoryOptions;
        break;
      case 3:
        options = this.matchingTypeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  
  queryParams = {
    defines: [
      { field: 'matchingEssential', title: '匹配维度', ui: { type: UiType.select, options: this.matchingEssentialOptions } },
      { field: 'productCategory', title: '产品大类', ui: { type: UiType.select, options: this.productCategoryOptions } },
      { field: 'priority', title: '优先级', ui: { type: UiType.text } },
    ],
    values: {
      matchingEssential: null,
      productCategory: null,
      priority: null,
    }
  };

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_MATCHING_ESSENTIAL': this.matchingEssentialOptions,
      'PS_MATCHING_TYPE': this.matchingTypeOptions,
    })
    await this.productCategoryOptions.push(...await this.queryService.getUserProCates());
  }

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
    const params: any = { ...this.queryParams.values };
    params.isExport = isExport;
    if(!isExport) {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    return params;
  }

  add(dataItem?: any) {
    this.modal.static(
      CustomerOrderMatchingEditComponent,
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
  
  clear() {
    this.queryParams.values = {
      matchingEssential: null,
      productCategory: null,
      priority: null,
    }
  }
}