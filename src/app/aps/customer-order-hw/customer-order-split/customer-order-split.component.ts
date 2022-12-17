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
import { CustomerOrderSplitEditComponent } from "./edit/edit.component";
import { CustomerOrderSplitQueryService } from "./query.service";


@Component({
  selector: 'customer-order-split',
  templateUrl: './customer-order-split.component.html',
  providers: [CustomerOrderSplitQueryService]
})
export class CustomerOrderSplitComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerOrderSplitQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  productCategoryOptions: any[] = [];
  steelTypeOptions: any[] = [];
  mantissalOptions: any = [];
  processingTypeOptions: any[] = [];
  unitOptions: any[] = [];
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
      field: 'productCategory',
      width: 120,
      headerName: '产品大类',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'processingType',
      width: 120,
      headerName: '加工类型',
      valueFormatter: 'ctx.optionsFind(value,5).label'
    },
    {
      field: 'branchStandards',
      width: 120,
      headerName: '拆分标准',
    },
    {
      field: 'unit',
      width: 120,
      headerName: '单位',
      valueFormatter: 'ctx.optionsFind(value,6).label'
    },
    {
      field: 'mantissal',
      width: 120,
      headerName: '尾数处理方式',
      valueFormatter: 'ctx.optionsFind(value,4).label'
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
        options = this.productCategoryOptions;
        break;
      case 2:
        options = this.steelTypeOptions;
        break;
      case 4:
        options = this.mantissalOptions;
        break;
      case 5:
        options = this.processingTypeOptions;
        break;
      case 6:
        options = this.unitOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  
  queryParams = {
    defines: [
    ],
    values: {
    }
  };

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });;
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_MANTISSAL': this.mantissalOptions,
      'PS_PROCESSING_TYPE': this.processingTypeOptions,
      'PS_ITEM_UNIT': this.unitOptions,
    });
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
    return {
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      CustomerOrderSplitEditComponent,
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

  expColumnsOptions: any[] = [
    { field: 'productCategory', options: this.productCategoryOptions },
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'mantissal', options: this.mantissalOptions },
    { field: 'processingType', options: this.processingTypeOptions },
    { field: 'unit', options: this.unitOptions },
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