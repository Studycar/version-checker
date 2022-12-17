/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-01-07 10:44:45
 * @LastEditors: Zwh
 * @LastEditTime: 2020-09-30 10:07:36
 */
import { Component, OnInit, ViewChild, Query, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from './queryService';
import { map } from 'rxjs/operators';
import { process, State } from '@progress/kendo-data-query';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { ProductSellBalanceSopdimmainresreviewEditComponent } from './edit/edit.component';
import { SopDimmainresrevVewService } from '../../../modules/generated_module/services/sopdimmainresreview-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopdimmainresreview',
  templateUrl: './sopdimmainresreview.component.html',
  providers: [QueryService]
})
export class ProductSellBalanceSopdimmainresreviewComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private querydata: SopDimmainresrevVewService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  plantOptions: any[] = [];
  mySelection: any[] = [];
  YesOrNo: any[] = [];
  context = this;
  typeOptions: any[] = [];
  groupOptions: any[] = [];
  divisionOptions: any[] = [];
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
    this.viewAsync = this.queryService.pipe(
      map(data => process(data, this.gridState))
    );
    this.LoadData();
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
    this.setGridWidth('');
  }

  LoadData() {
    this.querydata.GetDivision().subscribe(res => {
      res.data.forEach(element => {
        this.divisionOptions.push({
          label: element,
          value: element
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('SOP_RESOURCE_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.typeOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.YesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.plantChange(this.queryParams.values.plantCode);
  }

  httpAction = {
    url: this.querydata.url,
    method: 'GET',
    data: false
  };

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 } },
      { field: 'divisionType', title: '维度类型', ui: { type: UiType.select, options: this.typeOptions } },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.groupOptions } },
      { field: 'keyDivision', title: '资源维度', ui: { type: UiType.select, options: this.divisionOptions } }
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      divisionType: '',
      scheduleGroupCode: '',
      keyDivision: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  query() {
    super.query();
    this.queryService.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
  }

  GetQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      divisionType: this.queryParams.values.divisionType,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      keyDivision: this.queryParams.values.keyDivision,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
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
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'divisionName', headerName: '资源维度', menuTabs: ['filterMenuTab'] },
    { field: 'divisionDesc', headerName: '维度描述', tooltipField: 'DIVISION_DESC', menuTabs: ['filterMenuTab'] },
    { field: 'divisionType', headerName: '维度类型', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,2).label' },
    { field: 'enableFlag', headerName: '是否有效', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1).label' }
  ];

  expColumns = [
    { field: 'plantCode', title: '工厂', width: 200, locked: false },
    { field: 'scheduleGroupCode', title: '计划组', width: 200, locked: false },
    { field: 'divisionName', title: '资源维度', width: 200, locked: false },
    { field: 'divisionDesc', title: '维度描述', width: 200, locked: false },
    { field: 'divisionType', title: '维度类型', width: 200, locked: false },
    { field: 'enableFlag', title: '是否有效', width: 200, locked: false }];

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      divisionType: null,
      scheduleGroupCode: null,
      keyDivision: null,
      pageIndex: 1,
      pageSize: this.gridState.take
    };
  }

  add(item?: any) {
    this.modal
      .static(
        ProductSellBalanceSopdimmainresreviewEditComponent,
        {
          i: { Id: (item !== undefined ? item.id : null) }
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.YesOrNo;
        break;
      case 2:
        options = this.typeOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  remove(value: any) {
    this.querydata.remove(value).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }

  httpExportAction = {
    url: this.querydata.exportUrl,
    method: 'POST'
  };
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryService.exportAction(this.httpExportAction, this.queryParams.values, this.excelexport, this);
  }
  selectKeys = 'Id';
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

  plantChange(value: any) {
    this.groupOptions.length = 0;
    this.querydata.GetGroup(value).subscribe(res => {
      res.data.forEach(element => {
        this.groupOptions.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode
        });
      });
    });
  }

}
