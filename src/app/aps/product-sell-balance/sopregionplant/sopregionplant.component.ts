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
import { SopRegionPlantService } from '../../../modules/generated_module/services/sopregionplant-service';
import { QueryService } from './queryService';
import { ProductSellBalanceSopregionplantEditComponent } from './edit/edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopregionplant',
  templateUrl: './sopregionplant.component.html',
  providers: [QueryService, SopRegionPlantService]
})
export class ProductSellBalanceSopregionplantComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  mySelection: any[] = [];
  YesOrNo: any[] = [];
  plantTypeOptions: any[] = [];
  custDivisionOptions: any[] = [];
  regionOptions: any[] = [];
  /**事业部集合 */
  businessUnitOption: any[] = [];
  /**工厂集合 */
  plantOption: any[] = [];
  schedule: string;
  plantOptions: any[] = [];
  context = this;
  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private querydata: SopRegionPlantService,
    private apptranslate: AppTranslationService,
    private nzModelService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();
    this.query();
  }
  public queryParams = {
    defines: [
      {
        field: 'businessUnitCode',
        title: '事业部',
        ui: {
          type: UiType.select,
          options: this.businessUnitOption,
          ngModelChange: this.onScheduleRegionCodeChange,
        },
        required: true,
      },
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOption },
      },
      { field: 'custDivisionName', title: '区域', ui: { type: UiType.select, options: this.custDivisionOptions } },
    ],
    values: {
      businessUnitCode: this.appconfig.getActiveScheduleRegionCode(),
      plantCode: '',
      custDivisionName: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

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

    this.plantTypeOptions.length = 0;
    this.commonquery.GetLookupByType('PP_PLANT_TYPE').subscribe(res => {
      res.Extra.forEach(item => {
        this.plantTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });

  }

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

    this.queryParams.values.custDivisionName = null;
    this.querydata.GetRegionByBusiness(value).subscribe(res => {
      this.custDivisionOptions.length = 0;
      res.data.content.forEach(item => {
        this.custDivisionOptions.push({
          label: item.custDivisionName,
          value: item.custDivisionValue,
        });
      });
    });
  }


  httpAction = {
    url: this.querydata.url,
    method: 'GET',
  };

  query() {
    super.query();
    this.queryService.loadGridViewNew(this.httpAction, this.GetQueryParams(false), this.context);
  }

  GetQueryParams(isExport: boolean) {
    return {
      plantCode: this.queryParams.values.plantCode,
      regionCode: this.queryParams.values.businessUnitCode,
      custDivisionName: this.queryParams.values.custDivisionName,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      isExport: isExport
    };
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
    { field: 'regionId', headerName: '区域', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '工厂编码', menuTabs: ['filterMenuTab'] },
    { field: 'plantType', headerName: '工厂类型', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] }

  ];

  expColumns = [
    { field: 'businessUnitCode', title: '事业部', width: 200, locked: false },
    { field: 'regionId', title: '区域', width: 200, locked: false },
    { field: 'plantCode', title: '工厂编码', width: 200, locked: false },
    { field: 'plantType', title: '工厂类型', width: 200, locked: false },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.plantTypeOptions;
        break;

    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }
  clear() {
    this.queryParams.values = {
      businessUnitCode: this.appconfig.getActiveScheduleRegionCode(),
      plantCode: '',
      custDivisionName: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    };
  }

  add(item?: any) {
    this.modal
      .static(
        ProductSellBalanceSopregionplantEditComponent,
        {
          i: { id: (item !== undefined ? item.id : null) }
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }

  remove(value: any) {
    this.querydata.remove(value).subscribe(res => {
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
      this.msgSrv.warning(this.apptranslate.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.nzModelService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata
          .RemoveBath(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.apptranslate.translate('删除成功'));
              this.query();
            } else {
              this.msgSrv.error(this.apptranslate.translate(res.msg));
            }
          });
      },
    });
  }

  expData: any[] = [];
  expColumnsOptions = [
    { field: 'plantType', options: this.plantTypeOptions }
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryService.exportAction(this.httpAction, this.GetQueryParams(true), this.excelexport, this.context);
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
    this.setGridWidth('sopregionplant');
  }

}
