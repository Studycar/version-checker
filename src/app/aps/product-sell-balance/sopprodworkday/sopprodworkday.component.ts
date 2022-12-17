/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-01-21 10:13:37
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 11:22:23
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { QueryService } from './queryService';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { process, State } from '@progress/kendo-data-query';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { SopProdWorkdayService } from '../../../modules/generated_module/services/sopprodworkday-service';
import { ProductSellBalanceSopprodworkdayEditComponent } from './edit/edit.component';
import { stringify } from '@angular/compiler/src/util';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopprodworkday',
  templateUrl: './sopprodworkday.component.html',
  providers: [QueryService]
})
export class ProductSellBalanceSopprodworkdayComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private queryservice: QueryService,
    private querydata: SopProdWorkdayService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private apptranslate: AppTranslationService,
    private nzModalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  plantoptions: any[] = [];
  resourceoptions: any[] = [];
  groupoptions: any[] = []; // 计划组
  public dis: Boolean = false;
  context = this;
  defaultPlantCode;

  public queryParams = {
    defines: [
      { field: 'txtPlantCode', title: '工厂', ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 } },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.groupoptions, eventNo: 2 } },
      { field: 'resourceCode', title: '资源', ui: { type: UiType.select, options: this.resourceoptions } }
    ],
    values: {
      txtPlantCode: this.appconfig.getPlantCode(),
      scheduleGroupCode: '',
      resourceCode: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

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
    { field: 'PLANT_CODE', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'SCHEDULE_GROUP_CODE', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'SCHEDULE_GROUP_DESC', headerName: '计划组描述', tooltipField: 'SCHEDULE_GROUP_DESC', menuTabs: ['filterMenuTab'] },
    { field: 'RESOURCE_CODE', headerName: '资源', menuTabs: ['filterMenuTab'] },
    { field: 'RESOURCE_DESC', headerName: '资源描述', tooltipField: 'RESOURCE_DESC', menuTabs: ['filterMenuTab'] },
    { field: 'RESOURCE_TYPE', headerName: '资源类型', menuTabs: ['filterMenuTab'] },
    { field: 'DAYS', headerName: '计划开工天数', menuTabs: ['filterMenuTab'] },
    { field: 'POPULATION', headerName: '人员定编', menuTabs: ['filterMenuTab'] },
    { field: 'START_DATE', headerName: '开始时间', menuTabs: ['filterMenuTab'] },
    { field: 'END_DATE', headerName: '结束时间', menuTabs: ['filterMenuTab'] }
  ];

  expColumns = [
    { field: 'PLANT_CODE', title: '工厂', width: 200, locked: false },
    { field: 'SCHEDULE_GROUP_CODE', title: '计划组', width: 200, locked: false },
    { field: 'SCHEDULE_GROUP_DESC', title: '计划组描述', width: 200, locked: false },
    { field: 'RESOURCE_CODE', title: '资源', width: 200, locked: false },
    { field: 'RESOURCE_DESC', title: '资源描述', width: 200, locked: false },
    { field: 'RESOURCE_TYPE', title: '资源类型', width: 200, locked: false },
    { field: 'DAYS', title: '计划开工天数', width: 200, locked: false },
    { field: 'POPULATION', title: '人员定编', width: 200, locked: false },
    { field: 'START_DATE', title: '开始时间', width: 200, locked: false },
    { field: 'END_DATE', title: '结束时间', width: 200, locked: false }
  ];

  httpAction = {
    url: this.querydata.url,
    method: 'GET'
  };

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.dis = true;
    this.queryCommon();
    this.LoadData();
    this.defaultPlantCode = this.appconfig.getPlantCode();
    this.plantchange(this.appconfig.getPlantCode());
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
    this.setGridWidth('sopprodworkday');
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.PLANT_CODE,
          value: element.PLANT_CODE
        });
      });
    });
  }

  add(item?: any) {
    this.modal
      .static(
        ProductSellBalanceSopprodworkdayEditComponent,
        { i: { Id: (item !== undefined ? item.Id : null), PLANT_CODE: (item !== undefined ? item.PLANT_CODE : null) } },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }

  plantchange(value) {
    this.queryParams.values.scheduleGroupCode = null;
    this.groupoptions.length = 0;
    this.querydata.GetSchedule(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.groupoptions.push({
          label: element.SCHEDULE_GROUP_CODE,
          value: element.SCHEDULE_GROUP_CODE
        });
      });
    });

    this.queryParams.values.resourceCode = null;
    while (this.resourceoptions.length > 0) {
      this.resourceoptions.pop();
    }

    this.querydata.GetResource(value, this.queryParams.values.scheduleGroupCode).subscribe(res => {
      res.Extra.forEach(element => {
        this.resourceoptions.push({
          label: element.RESOURCE_CODE,
          value: element.RESOURCE_CODE
        });
      });
    });
  }

  groupChange(value: any) {
    this.queryParams.values.resourceCode = null;
    while (this.resourceoptions.length > 0) {
      this.resourceoptions.pop();
    }

    this.querydata.GetResource(this.queryParams.values.txtPlantCode, value).subscribe(res => {
      res.Extra.forEach(element => {
        this.resourceoptions.push({
          label: element.RESOURCE_CODE,
          value: element.RESOURCE_CODE
        });
      });
    });
  }

  private getQueryParamsValue(): any {
    return {
      txtPlantCode: this.queryParams.values.txtPlantCode,
      scheduleGroupCode: this.queryParams.values.scheduleGroupCode,
      resourceCode: this.queryParams.values.resourceCode,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.queryservice.loadGridView(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  clear() {
    this.queryParams.values = {
      txtPlantCode: this.defaultPlantCode,
      scheduleGroupCode: null,
      resourceCode: null,
      pageIndex: 1,
      pageSize: this.gridState.take
    };
    this.plantchange(this.queryParams.values.txtPlantCode);
    this.groupChange(this.queryParams.values.scheduleGroupCode);
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.nzModalService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
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

  httpExportAction = {
    url: this.querydata.exportUrl,
    method: 'POST'
  };

  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.queryservice.exportAction(this.httpExportAction, this.getQueryParamsValue(), this.excelexport, this);
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

}
