import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from './queryService';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { PlanschedulePsTechnicalModifyAddComponent } from './edit/technical-modify-add.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-technical-modify',
  templateUrl: './technical-modify.component.html',
  providers: [QueryService]
})
export class PlanschedulePsTechnicalModifyComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private queryService: QueryService,
    private msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  listPlant: any[] = [];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.listPlant } },
      { field: 'makeOrderNum', title: '工单号', ui: { type: UiType.text } },
      { field: 'models', title: '车型', ui: { type: UiType.textarea } },
      { field: 'beforeItemCode', title: '技改前物料', ui: { type: UiType.textarea } },
      { field: 'afterItemCode', title: '技改后物料', ui: { type: UiType.textarea } },
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      makeOrderNum: '',
      models: '',
      beforeItemCode: '',
      afterItemCode: '',
    }
  };

  public columns = [
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'makeOrderNum', headerName: '生产订单号', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '生产订单物料', menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '生产订单物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'models', headerName: '车型', menuTabs: ['filterMenuTab'] },
    { field: 'modelDesc', headerName: '车型描述', menuTabs: ['filterMenuTab'] },
    { field: 'moQty', headerName: '生产订单数量', menuTabs: ['filterMenuTab'] },
    { field: 'beforeItemCode', headerName: '技改前物料', menuTabs: ['filterMenuTab'] },
    { field: 'beforeItemDesc', headerName: '技改前物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'beforeQty', headerName: '技改前数量', menuTabs: ['filterMenuTab'] },
    { field: 'afterItemCode', headerName: '技改后物料', menuTabs: ['filterMenuTab'] },
    { field: 'afterItemDesc', headerName: '技改后物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'afterQty', headerName: '技改后数量', menuTabs: ['filterMenuTab'] },
    { field: 'afterUsage', headerName: '技改后单位用量', menuTabs: ['filterMenuTab'] },
    { field: 'onhandQty', headerName: '场内库存', menuTabs: ['filterMenuTab'] },
    { field: 'supplyQty', headerName: '供应商库存', menuTabs: ['filterMenuTab'] },
    { field: 'techModDate', headerName: '技改日期', menuTabs: ['filterMenuTab'] },
    { field: 'createdBy', headerName: '创建人', menuTabs: ['filterMenuTab'] },
    { field: 'fpcTime', headerName: '订单开始日期', menuTabs: ['filterMenuTab'] },
    { field: 'lpcTime', headerName: '订单结束日期', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '生产线', menuTabs: ['filterMenuTab'] },
  ];

  queryParamsValues: any;
  expColumns = [];
  expColumnsOptions = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  ngOnInit() {
    this.loadData();
    this.query();
  }

  loadData() {
    // 当前用户对应工厂
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.listPlant.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  getQueryParams(isExport: boolean = false) {
    return {
      plantCode: this.queryParams.values.plantCode,
      makeOrderNum: this.queryParams.values.makeOrderNum,
      models: this.queryParams.values.models,
      beforeItemCode: this.queryParams.values.beforeItemCode,
      afterItemCode: this.queryParams.values.afterItemCode,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  add(item?: any) {
    const inputParam = { plantCode: this.queryParamsValues.plantCode, refresh: false };
    this.modal.static(PlanschedulePsTechnicalModifyAddComponent, { inputParam: inputParam }, 'xl').subscribe(
      (value) => {
        if (inputParam.refresh) {
          this.queryCommon();
        }
      }
    );
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.queryParamsValues = this.getQueryParams();
    this.queryService.loadGridViewNew(this.queryService.queryHttpAction, this.queryParamsValues, this);
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      makeOrderNum: '',
      models: '',
      beforeItemCode: '',
      afterItemCode: '',
    };
  }

  public export() {
    super.export();
    this.queryService.export(this.queryService.queryHttpAction, this.getQueryParams(true), this.excelexport, this.context);
  }

  // 页码切换
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }

}
