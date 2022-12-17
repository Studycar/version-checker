import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { BasePriceEditComponent } from "./edit/edit.component";
import { BasePriceImportComponent } from "./import/import.component";
import { BasePriceQueryService } from "./query.service";
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';


@Component({
  selector: 'base-price',
  templateUrl: './base-price.component.html',
  providers: [BasePriceQueryService]
})
export class BasePriceComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: BasePriceQueryService,
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
      field: 'stockCode',
      width: 120,
      headerName: '存货编码',
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '存货名称',
    },
    {
      field: 'steelSort',
      width: 120,
      headerName: '钢种大类',
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
      field: 'prodType',
      width: 120,
      headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'basePrice',
      width: 120,
      headerName: '基价',
    },
    {
      field: 'publishDate',
      width: 120,
      headerName: '发布日期',
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
  steelSortOptions: any[] = [];
  surfaceOptions: any[] = [];
  prodTypeOptions: any[] = [];
  plantOptions: any[] = [];
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
        options = this.prodTypeOptions;
        break;
      case 4:
        options = this.steelSortOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'stockName', title: '产品名称', ui: { type: UiType.text } },
      { field: 'steelSort', title: '钢种大类', ui: { type: UiType.select, options: this.steelSortOptions } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOptions } },
      { field: 'surface', title: '表面', ui: { type: UiType.select, options: this.surfaceOptions } },
      // { field: 'publishDate1', title: '发布日期', ui: { type: UiType.date, } },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      stockName: '',
      steelSort: null,
      steelType: null,
      surface: null,
      // publishDate1: '',
      // publishDate2: '',
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      stockName: '',
      steelSort: null,
      steelType: null,
      surface: null,
      // publishDate1: '',
      // publishDate2: '',
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
      'PS_STEEL_SORT': this.steelSortOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_PRODUCT_FORM': this.prodTypeOptions,
    });
    this.steelTypeOptions.unshift({
      label: '*',
      value: '*'
    })
    this.steelSortOptions.unshift({
      label: '*',
      value: '*'
    })
    this.surfaceOptions.unshift({
      label: '*',
      value: '*'
    })
    this.plantOptions.push(...await this.queryService.getUserPlants());
  })

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport=false) {
    const params: any = { ...this.queryParams.values, export: isExport };
    if(!isExport) {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    // params.publishDate1 = this.queryService.formatDate(this.queryParams.values.publishDate1);
    // params.publishDate2 = this.queryService.formatDate(this.queryParams.values.publishDate1);
    return params;
  }

  checkPublisDate(dataItem): boolean {
    const publishDate = new Date(dataItem.publishDate);
    const today = new Date();
    return publishDate.getTime() >= today.getTime();
  }

  add(dataItem?: any) {
    if(dataItem !== undefined && !this.checkPublisDate(dataItem)) {
      this.msgSrv.warning(this.appTranslationService.translate('只能编辑发布时间在当前时间之后的数据！'))
      return;
    }
    this.modal.static(
      BasePriceEditComponent,
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
    const ids = dataItem === undefined ? this.getGridSelectionKeysByFilter('id', (item) => this.checkPublisDate(item)) : [dataItem.id];
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选符合条件的数据：发布时间在当前时间之后'));
      return;
    } else {
      // 弹出确认框
      if(dataItem === undefined) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('只提交删除发布时间在当前时间之后的数据，确定要删除吗？'),
          nzOnOk: () => {
            this.delete(ids);
          },
        });
      } else {
        if(!this.checkPublisDate(dataItem)) {
          this.msgSrv.warning(this.appTranslationService.translate('只能删除发布时间在当前时间之后的数据！'))
          return;
        }
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
      BasePriceImportComponent,
      {
        options: {
          steelTypeOptions: this.steelTypeOptions,
          steelSortOptions: this.steelSortOptions,
          plantOptions: this.plantOptions,
          surfaceOptions: this.surfaceOptions
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
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'steelSort', options: this.steelSortOptions },
    { field: 'surface', options: this.surfaceOptions },
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
  
  /**
   * 打开修改记录
   */
   showChangeDetail() {
    const tableName = 'PS_BASE_PRICE_HISTORY';
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: tableName.toLowerCase(),
          myAgGridRowKey: tableName,
        },
        exportFileName: '基价维护',
        tableColumns: [{
          field: 'zxdz',
          headerName: '执行动作',
          width: 100
        }, ...this.columns.filter(col => col.colId === undefined)],
        tableExpColumnsOptions: this.expColumnsOptions,
        queryParams: this.queryParams,
        optionsFind: this.optionsFind.bind(this)
      }
    ).subscribe(() => {})
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

}
