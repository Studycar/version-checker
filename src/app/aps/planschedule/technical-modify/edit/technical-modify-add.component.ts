import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from '../queryService';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { PlanschedulePsTechnicalModifyAddDetailComponent } from './technical-modify-add-detail.component';
import { PlanschedulePsTechnicalModifyItemCategorySelectComponent } from './item-category-select.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-technical-modify-add',
  templateUrl: './technical-modify-add.component.html',
  providers: [QueryService]
})
export class PlanschedulePsTechnicalModifyAddComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

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

  inputParam: any;
  listPlant: any[] = [];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.listPlant } },
      { field: 'models', title: '车型', required: true, ui: { type: UiType.textarea } },
      { field: 'beforeItemCode', title: '技改前物料', required: true, ui: { type: UiType.textarea } },
    ],
    values: {
      plantCode: null, // this.appconfig.getPlantCode(),
      models: '',
      beforeItemCode: '',
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true, suppressSizeToFit: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      }
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'models', headerName: '车型', menuTabs: ['filterMenuTab'] },
    { field: 'modelDesc', headerName: '车型描述', menuTabs: ['filterMenuTab'] },
    { field: 'beforeItemCode', headerName: '技改前物料', menuTabs: ['filterMenuTab'] },
    { field: 'beforeItemDesc', headerName: '技改前物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'onhandQty', headerName: '场内库存', menuTabs: ['filterMenuTab'] },
    { field: 'supplyQty', headerName: '供应商库存', menuTabs: ['filterMenuTab'] },
    { field: 'totalDemandQty', headerName: '总需求', menuTabs: ['filterMenuTab'] },
    { field: 'decudeStockAllocationQty', headerName: '推演库存分配', menuTabs: ['filterMenuTab'] },
    { field: 'decudeStockLeftQty', headerName: '推演剩余库存', menuTabs: ['filterMenuTab'] },
  ];

  queryParamsValues: any;
  expColumns = [];
  expColumnsOptions = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  ngOnInit() {
    this.clear();
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.gridData = [];
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
      models: this.queryParams.values.models,
      beforeItemCode: this.queryParams.values.beforeItemCode,
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.queryParamsValues = this.getQueryParams();
    this.queryService.loadGridViewNew(this.queryService.queryAddHttpAction, this.queryParamsValues, this);
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.inputParam.plantCode,
      models: '',
      beforeItemCode: '',
    };
  }

  public export() {
    super.export();
    setTimeout(() => { this.excelexport.export(this.gridData); }, 300);
  }

  detail(dataItem: any) {
    const inputParam = {
      plantCode: dataItem.plantCode,
      models: dataItem.models,
      beforeItemCode: dataItem.beforeItemCode,
      refresh: false,
    };
    this.modal.static(PlanschedulePsTechnicalModifyAddDetailComponent, { inputParam: inputParam }, 'xl').subscribe(value => {
      if (inputParam.refresh) {
        this.queryCommon();
        this.inputParam.refresh = inputParam.refresh;
      }
    });
  }

  selectCategory() {
    this.selectCategoryItem('category');
  }

  selectItem() {
    this.selectCategoryItem('item');
  }

  selectCategoryItem(type: string) {
    let selectText = '';
    if (type === 'category') {
      selectText = this.queryParams.values.models;
    }
    if (type === 'item') {
      selectText = this.queryParams.values.beforeItemCode;
    }

    const inputParam = {
      selectType: type, // 选择物料
      plantCode: this.queryParamsValues.plantCode,
      itemCode: '',
      showSelectText: true, // 显示已选
      selectText: selectText,
      multiple: true, // 多选
      selectRow: null, // 选择行
    };
    this.modal.static(PlanschedulePsTechnicalModifyItemCategorySelectComponent, { inputParam: inputParam }, 'lg').subscribe(value => {
      if (value) {
        if (type === 'category') {
          this.queryParams.values.models = inputParam.selectText;
        }
        if (type === 'item') {
          this.queryParams.values.beforeItemCode = inputParam.selectText;
        }
        this.queryCommon();
      }
    });
  }

}
