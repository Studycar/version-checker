import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PSMoRequirementEditComponent } from './edit/edit.component';
import { PSMoRequirementImportComponent } from './import/import.component';
import { PSMoRequirementQueryService } from './query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mo-requirement-manual',
  templateUrl: './mo-requirement.component.html',
  providers: [PSMoRequirementQueryService]
})
export class PSMoRequirementComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: PSMoRequirementQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  // 绑定存货
  public gridViewStocks: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsStocks: any[] = [
    {
      field: 'stockCode',
      title: '存货编码',
      width: '100'
    },
    {
      field: 'stockName',
      title: '存货名称',
      width: '100'
    },
    {
      field: 'stockDesc',
      title: '存货描述',
      width: '150'
    }
  ];

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
      headerName: '产品编码',
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '产品名称',
    },
    {
      field: 'stockDesc',
      width: 120,
      headerName: '产品描述',
    },
    {
      field: 'steelType',
      width: 120,
      headerName: '钢种',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'standards',
      width: 120,
      headerName: '规格',
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'pushState',
      width: 120,
      headerName: '是否推送',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'length',
      width: 120,
      headerName: '长度',
    },
    {
      field: 'width',
      width: 120,
      headerName: '宽度',
    },
    // {
    //   field: 'weight',
    //   width: 120,
    //   headerName: '重量',
    // },
    {
      field: 'requirementQty',
      width: 120,
      headerName: '需求数量',
    },
    {
      field: 'demandTime',
      width: 120,
      headerName: '需求时间',
    },
    {
      field: 'remark',
      width: 120,
      headerName: '备注',
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级',
      valueFormatter: 'ctx.optionsFind(value,4).label'
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
  gradeOptions: any[] = [];
  plantOptions: any[] = [];
  isPushOptions: any[] = [
    {
      label: '推送成功',
      value: 'Y',
    },
    {
      label: '未推送',
      value: 'N',
    },
    {
      label: '推送中',
      value: 'M',
    },
    {
      label: '推送失败',
      value: 'E',
    },
  ];
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
        options = this.isPushOptions;
        break;
      case 4:
        options = this.gradeOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions } },
      {
        field: 'stockCode', title: '产品名称', ui:
        {
          type: UiType.popupSelect,
          valueField: 'stockCode',
          textField: 'stockName',
          gridView: this.gridViewStocks,
          columns: this.columnsStocks,
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
            TextChangedEventNo: 3,
          }
        }
      },
      { field: 'steelType', title: '钢种', ui: { type: UiType.select, options: this.steelTypeOptions } },
      { field: 'surface', title: '表面', ui: { type: UiType.select, options: this.surfaceOptions } },
      { field: 'pushState', title: '是否推送', ui: { type: UiType.select, options: this.isPushOptions } },
    ],
    values: {
      plantCode: null,
      steelType: null,
      surface: null,
      pushState: null,
      stockCode: { value: '', text: '' },
    }
  };

  clear() {
    this.queryParams.values = {
      plantCode: null,
      steelType: null,
      surface: null,
      pushState: null,
      stockCode: { value: '', text: '' },
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
      'PS_GRADE': this.gradeOptions,
    });
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        })
      })
    });
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
      steelType: this.queryParams.values.steelType || '',
      plantCode: this.queryParams.values.plantCode || '',
      surface: this.queryParams.values.surface || '',
      pushState: this.queryParams.values.pushState || '',
      stockCode: this.queryParams.values.stockCode.value,
      coatingFlag: 'N',
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  add(dataItem?: any) {
    this.modal.static(
      PSMoRequirementEditComponent,
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
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  expColumnsOptions: any[] = [
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'pushState', options: this.isPushOptions },
    { field: 'grade', options: this.gradeOptions },
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
   * 存货弹出查询
   * @param {any} e
   */
  public searchStocks(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadStocks(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载存货
   * @param {string} stockCode  存货编码
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadStocks(
    stockCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getProductions({
        plantCode: this.queryParams.values.plantCode || this.appconfig.getActivePlantCode(),
        stockCodeOrName: stockCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewStocks.data = res.data.content;
        this.gridViewStocks.total = res.data.totalElements;
      });
  }

  onStockTextChanged(e: any) {
    const stockCode = e.Text.trim();
    if (stockCode !== '') {
      this.queryService.getProductions({
        plantCode: this.queryParams.values.plantCode || this.appconfig.getActivePlantCode(),
        stockCodeOrName: stockCode,
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if (res.data.content.length > 0) {
          this.queryParams.values.stockCode = {
            value: res.data.content[0].stockCode,
            text: res.data.content[0].stockName,
          };
        } else {
          this.queryParams.values.stockCode = {
            value: '',
            text: '',
          };
          this.msgSrv.info(this.appTranslationService.translate('存货编码或名称无效'));
        }
      });
    } else {
      this.queryParams.values.stockCode = {
        value: '',
        text: '',
      };
    }
  }

  onStocksSelect(e) {
    this.queryParams.values.stockCode = {
      value: e.Row.stockCode,
      text: e.Row.stockName,
    };
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }
  // 导入 
  public import() {
    this.modal
      .static(PSMoRequirementImportComponent, {}, 'md')
      .subscribe(value => {
        this.query();
      });

  }
  pushToSrm() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要推送的数据'));
      return;
    }
    const ids = [];
    for (let i = 0; i < selectedRows.length; i++) {
      if(selectedRows[i].pushState === 'Y' || selectedRows[i].pushState === 'M') {
        this.msgSrv.warning(this.appTranslationService.translate('已推送或推送中的数据不能重复推送，请检查。'));
        return;
      }
      ids.push(selectedRows[i].id);
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(`是否确认推送数据到 SRM？`),
      nzOnOk: () => {
        this.queryService.pushToSrm(ids, this.queryParams.values.plantCode).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg))
          }
        });
      },
    });
  }


}
