import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { PlanningParametersService } from './planning-parameters.service';
import { PlanningParametersEditComponent } from './edit/edit.component';
import { GlobalParametersComponent } from './global-parameters/global-parameters.component';
import { PlanningPlantComponent } from './planning-plant/planning-plant.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planning-parameters',
  templateUrl: './planning-parameters.component.html',
  providers: [PlanningParametersService]
})
export class PlanningParametersComponent extends CustomBaseContext implements OnInit {

  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private modal: ModalHelper,
    private queryService: PlanningParametersService
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  whetherOptions: any[] = [];
  materialRangeOptions: any = [];
  planTypeOptions: any[] = [];
  planApplicationOptions: any[] = [];
  queryParams = {
    defines: [
      {
        field: 'planName',
        title: '计划名称',
        ui: { type: UiType.text }
      },
      {
        field: 'description',
        title: '计划描述',
        ui: { type: UiType.text }
      },
      {
        field: 'planType',
        title: '计划类型',
        ui: { type: UiType.select, options: this.planTypeOptions }
      },
      {
        field: 'planApplication',
        title: '计划应用',
        ui: { type: UiType.select, options: this.planApplicationOptions }
      },
      // {
      //   field: 'purchasingExecutive',
      //   title: '采购计划执行',
      //   ui: { type: UiType.select, options: this.whetherOptions }
      // },
      // {
      //   field: 'productionExecutive',
      //   title: '生产计划执行',
      //   ui: { type: UiType.select, options: this.whetherOptions }
      // }
    ],
    values: {
      planName: '',
      description: '',
      planType: '',
      planApplication: '',
      // purchasingExecutive: null,
      // productionExecutive: null,
    }
  };
  columns = [
    {
      colId: 'action',
      field: '',
      headerName: '操作',
      width: 130,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
      suppressSizeToFit: true,
    },
    {
      field: 'planName',
      headerName: '计划名称',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'description',
      headerName: '计划描述',
      width: 200,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'planType',
      headerName: '计划类型',
      width: 200,
      valueFormatter: 'ctx.optionsFind(value, "planTypeOptions").label',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'planApplication',
      headerName: '计划应用',
      width: 200,
      valueFormatter: 'ctx.optionsFind(value, "planApplicationOptions").label',
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'purchasingExecutive',
    //   headerName: '采购执行计划',
    //   width: 150,
    //   valueFormatter: 'ctx.optionsFind(value,1).label',
    //   menuTabs: ['filterMenuTab'],
    // },
    // {
    //   field: 'productionExecutive',
    //   headerName: '生产执行计划',
    //   width: 150,
    //   valueFormatter: 'ctx.optionsFind(value,1).label',
    //   menuTabs: ['filterMenuTab'],
    // },
    {
      field: 'planHorizonDays',
      headerName: '展望期天数',
      width: 120,
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   field: 'planIncludedItems',
    //   headerName: '物料范围',
    //   width: 140,
    //   valueFormatter: 'ctx.optionsFind(value,2).label',
    //   menuTabs: ['filterMenuTab'],
    // },
  ];
  expColumns = [
    { field: 'planName', title: '计划名称', width: 150, locked: false },
    { field: 'description', title: '计划描述', width: 150, locked: false },
    { field: 'purchasingExecutive', title: '采购执行计划', width: 150, locked: false },
    { field: 'productionExecutive', title: '生产执行计划', width: 150, locked: false },
    { field: 'planHorizonDays', title: '展望期天数', width: 150, locked: false },
    { field: 'planIncludedItems', title: '物料范围', width: 150, locked: false },
  ];
  expColumnsOptions = [
    { field: 'purchasingExecutive', options: this.whetherOptions },
    { field: 'productionExecutive', options: this.whetherOptions },
    { field: 'planIncludedItems', options: this.materialRangeOptions },
  ];
  @ViewChild('excelexport', { static: true }) excelExport: CustomExcelExportComponent;

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    // this.loadWhetherOptions();
    // this.loadMaterialRangeOptions();
    this.loadPlanTypeOptions();
    this.loadPlanApplicationOptions();
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      planName: '',
      description: '',
      planType: '',
      planApplication: '',
      // purchasingExecutive: null,
      // productionExecutive: null
    };
  }

  commonQuery() {
    this.commonQueryService.loadGridViewNew(
      { url: this.queryService.queryUrl, method: 'POST' },
      this.getQueryParams(),
      this.context
    );
  }

  getQueryParams(isExport: boolean = false) {
    return {
      planName: this.queryParams.values.planName,
      description: this.queryParams.values.description,
      planType: this.queryParams.values.planType,
      planApplication: this.queryParams.values.planApplication,
      // purchasingExecutive: this.queryParams.values.purchasingExecutive,
      // productionExecutive: this.queryParams.values.productionExecutive,
      IS_EXPORT: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  optionsFind(value: string, optionsIndex: any): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.whetherOptions;
        break;
      case 2:
        options = this.materialRangeOptions;
        break;
      case "planTypeOptions":
        options = this.planTypeOptions;
        break;
      case "planApplicationOptions":
        options = this.planApplicationOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  loadWhetherOptions() {
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.whetherOptions)
    /*.subscribe(result => {
      this.whetherOptions.length = 0;
      result.Extra.forEach(d => {
        this.whetherOptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    })*/;
  }

  loadMaterialRangeOptions() {
    this.commonQueryService.GetLookupByTypeRef('MRP_PLAN_INCLUDE_ITEMS', this.materialRangeOptions)
    /*.subscribe(res => {
      this.materialRangeOptions.length = 0;
      res.Extra.forEach(item => {
        this.materialRangeOptions.push({
          label: item.MEANING,
          value: item.LOOKUP_CODE,
        });
      });
    })*/;
  }

  // 计划类型快码
  loadPlanTypeOptions() {
    this.commonQueryService.GetLookupByTypeRef('PS_PLAN_TYPE', this.planTypeOptions)
    console.log("planTypeOptions",this.planTypeOptions)
  }

  // 计划应用快码
  loadPlanApplicationOptions() {
    this.commonQueryService.GetLookupByTypeRef('PS_PLAN_APPLICATION', this.planApplicationOptions)
    console.log("planApplicationOptions",this.planApplicationOptions)
  }

  add(data?: any) {
    this.modal.static(
      PlanningParametersEditComponent,
      { params: data ? data : {} },
      'lg'
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  exportFile() {
    this.commonQueryService.exportAction(
      { url: this.queryService.queryUrl, method: 'POST' },
      this.getQueryParams(true),
      this.excelExport,
      this.context
    );
  }

  globalParameters(data: any) {
    this.modal.static(
      GlobalParametersComponent,
      {
        title: '全局参数',
        type: 'global',
        planName: data.planName
      },
      'lg'
    ).subscribe(res => { });
  }

  planningPlant(data: any) {
    this.modal.static(
      PlanningPlantComponent,
      { planName: data.planName },
      'lg'
    ).subscribe(res => { });
  }

  remove(data: any) {
    //const listIds = [data.Id];
    this.queryService.remove(data).subscribe(res => {
      if (res.code = 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功！'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}
