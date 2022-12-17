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
import { MarkupElement1EditComponent } from "./edit/edit.component";
import { MarkupElement1ImportComponent } from "./import/import.component";
import { MarkupElement1QueryService } from "./query.service";

@Component({
  selector: 'markup-element1',
  templateUrl: './markup-element1.component.html',
  providers: [MarkupElement1QueryService]
})
export class MarkupElement1Component extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: MarkupElement1QueryService,
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
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'thicknessDown',
      width: 120,
      headerName: '厚度(>=)',
      valueFormatter: 'ctx.formatterPrecision(value)',
    },
    {
      field: 'thicknessUp',
      width: 120,
      headerName: '厚度(<)',
      valueFormatter: 'ctx.formatterPrecision(value)',
    },
    {
      field: 'widthDown',
      width: 120,
      headerName: '宽度(>=)',
    },
    {
      field: 'widthUp',
      width: 120,
      headerName: '宽度(<)',
    },
    {
      field: 'belowFive',
      width: 120,
      headerName: '0.5及以下薄料加价',
    },
    {
      field: 'belowFour',
      width: 120,
      headerName: '0.4及以下薄料加价',
    },
    {
      field: 'prodType',
      width: 120,
      headerName: '形式',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'entrustedProcessing',
      width: 120,
      headerName: '受托加工',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'thicknessMarkup',
      width: 120,
      headerName: '厚度加价',
    },
    {
      field: 'widthMarkup',
      width: 120,
      headerName: '宽度加价',
    },
    {
      field: 'paperMarkup',
      width: 120,
      headerName: '垫纸加价',
    },
    {
      field: 'coilInnerDia',
      width: 120,
      headerName: '钢卷内径加价',
    },
    {
      field: 'rewindingMarkup',
      width: 120,
      headerName: '重卷加价',
    },
    {
      field: 'markupElementState',
      width: 120,
      headerName: '规则状态',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'lowerDifference',
      width: 120,
      headerName: '下差',
    },
    {
      field: 'thicknessBaseMarkup',
      width: 120,
      headerName: '厚度基础加价',
    },
    {
      field: 'flatMarkup',
      width: 120,
      headerName: '平板加价',
    },
    {
      field: 'startDate',
      width: 120,
      headerName: '生效日期'
    },
    {
      field: 'endDate',
      width: 120,
      headerName: '失效日期'
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

  markupStateOptions: any[] = [];
  productCategoryOptions: any[] = [];
  prodTypeOptions: any[] = [];
  yesOrNoOptions: any[] = [];
  steelTypeOptions: any[] = [];
  plantOptions: any[] = [];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.productCategoryOptions;
        break;
      case 2:
        options = this.steelTypeOptions;
        break;
      case 3:
        options = this.prodTypeOptions;
        break;
      case 4:
        options = this.markupStateOptions;
        break;
      case 5:
        options = this.yesOrNoOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }
  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'productCategory', title: '产品大类', ui: { type: UiType.select, options: this.productCategoryOptions } },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOptions } },
      { field: 'prodType', title: '形式', ui: { type: UiType.select, options: this.prodTypeOptions } },
      { field: 'entrustedProcessing', title: '受托加工', ui: { type: UiType.select, options: this.yesOrNoOptions } },
      { field: 'markupElementState', title: '规则状态', ui: { type: UiType.select, options: this.markupStateOptions } },
      { field: 'startDate', title: '生效日期', ui: { type: UiType.date, } },
      { field: 'endDate', title: '失效日期', ui: { type: UiType.date, } },
      { field: 'widthStr', title: '宽度', ui: { type: UiType.text, } },
      { field: 'thicknessStr', title: '厚度', ui: { type: UiType.text, } },
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      productCategory: this.appconfig.getActiveProductCategory(),
      steelType: null,
      prodType: null,
      entrustedProcessing: null,
      markupElementState: null,
      startDate: '',
      endDate: '',
      widthStr: '',
      thicknessStr: '',
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      productCategory: this.appconfig.getActiveProductCategory(),
      steelType: null,
      prodType: null,
      entrustedProcessing: null,
      markupElementState: null,
      startDate: '',
      endDate: '',
      widthStr: '',
      thicknessStr: '',
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
      'PS_PROD_TYPE': this.prodTypeOptions,
      'PS_YES_NOT': this.yesOrNoOptions,
      'PS_MARKUP_ELEMENT_STATE': this.markupStateOptions,
    });
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.descriptions,
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

  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport = false) {
    return {
      plantCode: this.queryParams.values.plantCode,
      productCategory: this.queryParams.values.productCategory,
      steelType: this.queryParams.values.steelType,
      prodType: this.queryParams.values.prodType,
      entrustedProcessing: this.queryParams.values.entrustedProcessing,
      markupElementState: this.queryParams.values.markupElementState,
      widthStr: this.queryParams.values.widthStr,
      thicknessStr: this.queryParams.values.thicknessStr,
      startDate: this.queryService.formatDate(this.queryParams.values.startDate),
      endDate: this.queryService.formatDate(this.queryParams.values.endDate),
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      MarkupElement1EditComponent,
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
    const ids = dataItem === undefined ? this.getGridSelectionKeysByFilter('id', item => item.markupElementState !== 'Y') : [dataItem.id];
    if (ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选未启用的数据'));
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
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  update(dataItem?: any, operType?: string) {
    const ids = dataItem === undefined ? this.getGridSelectionKeys('id') : [dataItem.id];
    if(ids.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if(dataItem === undefined) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('确定要更新状态吗？'),
          nzOnOk: () => {
            this.updateState(ids, operType);
          },
        });
      } else {
        this.updateState(ids, operType);
      }
    }
  }

  updateState(ids, operType: string = '1') {
    this.queryService.updateState(ids, operType).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('更新成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  import() {
    this.modal.static(
      MarkupElement1ImportComponent,
      {
        options: {
          markupStateOptions: this.markupStateOptions
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
    { field: 'markupElementState', options: this.markupStateOptions },
    { field: 'productCategory', options: this.productCategoryOptions },
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'prodType', options: this.prodTypeOptions },
    { field: 'entrustedProcessing', options: this.yesOrNoOptions },
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
    const tableName = 'PS_MARKUP_ELEMENT_WIDTH_HISTORY';
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: tableName.toLowerCase(),
          myAgGridRowKey: tableName,
        },
        exportFileName: '宽厚度加价',
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
