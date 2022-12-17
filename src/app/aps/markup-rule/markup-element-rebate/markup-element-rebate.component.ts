import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MarkupElementTransportEditComponent } from '../markup-element-transport/edit/edit.component';
import { MarkupElementTransportImportComponent } from '../markup-element-transport/import/import.component';
import { MarkupElementRebateEditComponent } from './edit/edit.component';
import { MarkupElementRebateImportComponent } from './import/import.component';
import { MarkupElementRebateQueryService } from './query.service';

@Component({
  selector: 'markup-element-rebate',
  templateUrl: './markup-element-rebate.component.html',
  providers: [MarkupElementRebateQueryService]
})
export class MarkupElementRebateComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: MarkupElementRebateQueryService,
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
      field: 'rebateMarkup',
      width: 120,
      headerName: '返利加价',
    },
    {
      field: 'state',
      width: 120,
      headerName: '规则状态',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'startDate',
      width: 120,
      headerName: '生效时间'
    },
    {
      field: 'endDate',
      width: 120,
      headerName: '失效时间'
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '创建日期',
    },
    {
      field: 'createdBy',
      width: 120,
      headerName: '创建人',
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      headerName: '最近更新日期',
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      headerName: '最近更新人',
    },
  ];

  steelTypeOptions: any[] = [];
  steelSortOptions: any[] = [];
  surfaceOptions: any[] = [];
  prodTypeOptions: any[] = [];
  plantOptions: any[] = [];
  markupStateOptions: any[] = [];
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
      case 5:
        options = this.markupStateOptions;
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
    ],
    values: {
      plantCode: this.appconfig.getActivePlantCode(),
      stockName: '',
      steelSort: null,
      steelType: null,
      surface: null,
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getActivePlantCode(),
      stockName: '',
      steelSort: null,
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
      'PS_STEEL_SORT': this.steelSortOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_PRODUCT_FORM': this.prodTypeOptions,
      'MARKUP_REBATE_STATE': this.markupStateOptions,
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
    return params;
  }

  checkPublisDate(dataItem): boolean {
    const startDate = new Date(dataItem.startDate);
    const today = new Date();
    return startDate.getTime() >= today.getTime();
  }

  checkIsValid(dataItem): boolean {
    const startDate = new Date(dataItem.startDate);
    const endDate = new Date(dataItem.endDate);
    const today = new Date();
    return dataItem.state === 'STATE_ENABLE' && 
      startDate.getTime() <= today.getTime() && today.getTime() <= endDate.getTime();
  }

  add(dataItem?: any) {
    if(dataItem !== undefined && !this.checkPublisDate(dataItem)) {
      this.msgSrv.warning(this.appTranslationService.translate('只能编辑生效时间在当前时间之后的数据！'))
      return;
    }
    this.modal.static(
      MarkupElementRebateEditComponent,
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
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选符合条件的数据：生效时间在当前时间之后'));
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
        if(!this.checkPublisDate(dataItem)) {
          this.msgSrv.warning(this.appTranslationService.translate('只能删除生效时间在当前时间之后的数据！'))
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

  disable(dataItem) {
    if (!this.checkIsValid(dataItem)) {
      this.msgSrv.warning(this.appTranslationService.translate('该条数据不是有效数据'));
      this.gridApi.redrawRows();
      return;
    }
    this.queryService.disable(dataItem.id).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  import() {
    this.modal.static(
      MarkupElementRebateImportComponent,
      {
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
    { field: 'state', options: this.markupStateOptions },
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
    const tableName = 'PS_MARKUP_REBATE_HISTORY';
    this.modal.static(
      PlanscheduleHWChangeDetailComponent,
      {
        httpAction: { url: this.queryService.queryChangeDetailUrl, method: 'GET' },
        myAgGrid: {
          myAgGridState: tableName.toLowerCase(),
          myAgGridRowKey: tableName,
        },
        exportFileName: '返利加价',
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
