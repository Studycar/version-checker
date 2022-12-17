import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { PurchaseQueryService } from "./query.service";

@Component({
  selector: 'purchase',
  templateUrl: './purchase.component.html',
  providers: [PurchaseQueryService]
})
export class PurchaseComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: PurchaseQueryService,
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
      title: '产品编码',
      width: '100'
    },
    {
      field: 'stockName',
      title: '产品名称',
      width: '100'
    }
    ];

  columns = [
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
      headerName: '工厂组织',
    },
    {
      field: 'requirementQty',
      width: 120,
      headerName: '汇总数量',
    },
    {
      field: 'meter',
      width: 120,
      headerName: '米数',
    },
    {
      field: 'demandTime',
      width: 120,
      headerName: '组件需求时间',
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
      field: 'lengths',
      width: 120,
      headerName: '长度',
      valueFormatter: (params) => params.data.lengths == 0 ? 'C' : params.data.lengths,
    },
    {
      field: 'width',
      width: 120,
      headerName: '宽度',
    },
    {
      field: 'greate',
      width: 120,
      headerName: '等级',
    },
    {
      field: 'unit',
      width: 120,
      headerName: '单位',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'chType',
      width: 120,
      headerName: '存货类型', // 对应 形式 快码
      valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'beizhu',
      width: 120,
      headerName: '备注',
    },
    {
      field: 'weight',
      width: 120,
      headerName: '重量',
    },
    {
      field: 'catName',
      width: 120,
      headerName: '胶膜分类',
    },
    {
      field: 'pushState',
      width: 120,
      headerName: '已推送',
      valueFormatter: 'ctx.optionsFind(value,5).label'
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
  unitOptions: any[] = [];
  surfaceOptions: any[] = [];
  prodTypeOptions: any[] = [];
  plantOptions: any[] = [];
  coatingTypeOptions: any[] = [];
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
        options = this.unitOptions;
        break;

      case 4:
        options = this.prodTypeOptions;
        break;

      case 5:
        options = this.isPushOptions;
        break;
    }
    let option = options.find(x => x.value == value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
      { field: 'demandTime', title: '组件需求时间', ui: { type: UiType.dateRange } },
      { field: 'plantCode', title: '工厂组织', ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'stockCode', title: '产品名称', ui: 
        { 
          type: UiType.popupSelect,
          valueField: 'stockCode', 
          textField: 'stockName', 
          name: 'stockCode',
          gridView: this.gridViewStocks, 
          columns: this.columnsStocks, 
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
            TextChangedEventNo: 3,
          }
        }  
      },
      { field: 'coatingType', title: '胶膜类型', ui: { type: UiType.select, options: this.coatingTypeOptions } },
      { field: 'pushState', title: '是否推送', ui: { type: UiType.select, options: this.isPushOptions} } ,
    ],
    values: {
      demandTime: [],
      plantCode: null,
      pushState: null,
      coatingType:null,
      stockCode: {value:'', text:''}
    }
  };

  clear() {
    this.queryParams.values = {
      demandTime: [],
      plantCode: null,
      pushState: null,
      coatingType: null,
      stockCode: {value:'', text:''}
    }
  }

  ngOnInit() {
    this.query();
    this.loadOptions().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_ITEM_UNIT': this.unitOptions,
      'PS_PROD_TYPE': this.prodTypeOptions,
    });
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.descriptions,
          value: d.plantCode,
        })
      })
    });
    this.queryService.getCoatingType().subscribe(res => {
      res.data.forEach(d => {
        this.coatingTypeOptions.push({
          label: `${d.catId}(${d.catName})`,
          value: d.catId,
        })
      })
    });
  }

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
    return {
      plantCode: this.queryParams.values.plantCode || '',
      catId: this.queryParams.values.coatingType || '',
      pushState: this.queryParams.values.pushState,
      stockCode: this.queryParams.values.stockCode.value,
      demandTime: this.queryService.formatDate(this.queryParams.values.demandTime[0]),
      endDemandTime: this.queryService.formatDate(this.queryParams.values.demandTime[1]),
      export: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  getData() {
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要发起请求获取数据吗？'),
      nzOnOk: () => {
        this.queryService.task().subscribe(res => {
          if(res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
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
        stockCodeOrName: stockCode,
        plantCode: this.queryParams.values.plantCode || this.appconfig.getActivePlantCode(),
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
    if(stockCode !== '') {
      this.queryService.getProductions({
        stockCodeOrName: stockCode,
        plantCode: this.queryParams.values.plantCode || this.appconfig.getActivePlantCode(),
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.queryParams.values.stockCode = {
            value: res.data.content[0].stockCode,
            text: res.data.content[0].stockName,
          };
        } else {
          this.queryParams.values.stockCode = { value:'', text:'' };
          this.msgSrv.info(this.appTranslationService.translate('存货编码或名称无效'));
        }
      });
    } else {
      this.queryParams.values.stockCode = { value:'', text:'' };
    }
  }

  onStocksSelect(e) {
    this.queryParams.values.stockCode = {
      value: e.Row.stockCode,
      text: e.Row.stockName,
    };
  }

  pushToSrm() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (this.isNull(selectedRows) || selectedRows.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要推送的数据'));
      return;
    }
    const ids = [];
    for(let i = 0; i < selectedRows.length; i++) {
      if(selectedRows[i].pushState === 'Y' || selectedRows[i].pushState === 'M') {
        this.msgSrv.warning(this.appTranslationService.translate('已推送或推送中的数据不能重复推送，请检查。'));
        return;
      }
      ids.push(selectedRows[i].id);
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate(`是否确认推送数据到 SRM？`),
      nzOnOk: () => {
        this.queryService.pushToSrm(ids).subscribe(res => {
          if(res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate(res.msg));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg))
          }
        });
      },
    });
  }

  expColumnsOptions: any[] = [
    { field: 'steelType', options: this.steelTypeOptions },
    { field: 'surface', options: this.surfaceOptions },
    { field: 'unit', options: this.unitOptions },
    { field: 'chType', options: this.prodTypeOptions },
    { field: 'pushState', options: this.isPushOptions },
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
