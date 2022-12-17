/*
 * @Author: lyp
 * @contact: 
 * @Date: 2020-08-13 09:51:22
 * @LastEditors: lyp
 * @LastEditTime: 2020-08-13 15:29:23
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { SopOnhandStrategyService } from '../../../modules/generated_module/services/soponhandstrategy-service';
import { QueryService } from './queryService';
import { ProductSellBalanceSoponhandstrategyEditComponent } from './edit/edit.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-soponhandstrategy',
  templateUrl: './soponhandstrategy.component.html',
  providers: [QueryService, SopOnhandStrategyService]
})
export class ProductSellBalanceSoponhandstrategyComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  mySelection: any[] = [];
  onhandLevelOptions: any[] = [];
  onhandTypeOptions: any[] = [];
  /**事业部集合 */
  businessUnitOption: any[] = [];
  /**工厂集合 */
  plantOption: any[] = [];
  context = this;
  schedule: string;
  plantOptions: any[] = [];

  public queryParams = {
    defines: [
      {
        field: 'businessUnitCode',
        title: this.appTranslationService.translate('事业部'),
        ui: {
          type: UiType.select,
          options: this.businessUnitOption,
          ngModelChange: this.onScheduleRegionCodeChange,
        },
        required: true,
      },
      {
        field: 'plantCode',
        title: this.appTranslationService.translate('工厂'),
        ui: { type: UiType.select, options: this.plantOption },
      },
      { field: 'onhandLevel', title: this.appTranslationService.translate('库存维度'), ui: { type: UiType.select, options: this.onhandLevelOptions } },
      { field: 'levelValue', title: this.appTranslationService.translate('维度值'), ui: { type: UiType.string } }
    ],
    values: {
      businessUnitCode: this.appconfig.getActiveScheduleRegionCode(),
      plantCode: '',
      onhandLevel: '',
      levelValue: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private querydata: SopOnhandStrategyService,
    private appTranslationService: AppTranslationService,
    private nzModelService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    this.headerNameTranslate(this.expColumns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();
    this.query();
  }

  private loadOptions() {
    /**加载所有事业部 */
    this.commonquery.GetAllScheduleRegion().subscribe(result => {
      result.data.forEach(d => {
        this.businessUnitOption.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });
    /**绑定事业部下工厂 */
    this.onScheduleRegionCodeChange(
      this.queryParams.values.businessUnitCode,
    );
    this.onhandLevelOptions.length = 0;
    this.commonquery.GetLookupByType('SOP_ONHAND_LEVEL').subscribe(res => {
      res.Extra.forEach(item => {
        this.onhandLevelOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });

    this.onhandTypeOptions.length = 0;
    this.commonquery.GetLookupByType('SOP_ONHAND_TYPE').subscribe(res => {
      res.Extra.forEach(item => {
        this.onhandTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });

  }

  httpAction = { url: this.querydata.url, method: 'GET' };

  /**搜索事业部值改变触发的回调 */
  onScheduleRegionCodeChange(value) {
    this.queryParams.values.plantCode = null;
    this.commonquery.GetAllPlant(value).subscribe(res => {
      this.plantOption.length = 0;
      res.data.forEach(item => {
        this.plantOption.push({
          label: item.plantCode,
          value: item.plantCode,
        });
      });
    });
  }

  GetQueryParams(IsExport: boolean) {
    return {
      businessUnitCode: this.queryParams.values.businessUnitCode,
      plantCode: this.queryParams.values.plantCode,
      onhandLevel: this.queryParams.values.onhandLevel,
      levelValue: this.queryParams.values.levelValue,
      isExport: IsExport,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
    };
  }

  query() {
    super.query();
    this.queryService.loadGridViewNew(this.httpAction, this.GetQueryParams(false), this.context);
  }

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'businessUnitCode', headerName: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '工厂编码', menuTabs: ['filterMenuTab'] },
    { field: 'onhandLevel', headerName: '库存维度', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'levelValue', headerName: '维度值', menuTabs: ['filterMenuTab'] },
    { field: 'onhandType', headerName: '计算方式', valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] },
    { field: 'onhandValue', headerName: '策略值', menuTabs: ['filterMenuTab'] }

  ];

  expColumns = [
    { field: 'businessUnitCode', title: '事业部', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', title: '工厂编码', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'onhandLevel', title: '库存维度', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'levelValue', title: '维度值', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'onhandType', title: '计算方式', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'onhandValue', title: '策略值', width: 120, menuTabs: ['filterMenuTab'] }
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.onhandLevelOptions;
        break;
      case 2:
        options = this.onhandTypeOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  add(item?: any) {

    this.modal
      .static(
        ProductSellBalanceSoponhandstrategyEditComponent,
        {
          originDto: item !== undefined ? item : null 
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }

  remove(item: any) {
    this.querydata.Delete([item.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.nzModelService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata
          .Delete(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('删除成功'));
              this.query();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
      },
    });
  }


  expData: any[] = [];

  expColumnsOptions = [
    { field: 'onhandLevel', options: this.onhandLevelOptions },
    { field: 'onhandType', options: this.onhandTypeOptions }

  ];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.queryService.exportAction(this.httpAction, this.GetQueryParams(true), this.excelexport, this.context);
  }

  clear() {
    this.queryParams.values = {
      businessUnitCode: this.appconfig.getActiveScheduleRegionCode(),
      plantCode: null,
      onhandLevel: null,
      levelValue: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    };
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
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
      this.query();
    } else {
      this.setLoading(false);
    }
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {
    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      if (this.allColumnIds.length < 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('soponhandstrategy');
  }


}
