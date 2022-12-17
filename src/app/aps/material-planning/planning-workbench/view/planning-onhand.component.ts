import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext, ServiceOptions } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { ModalHelper } from '@delon/theme';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mrp-planning-onhand',
  templateUrl: './planning-onhand.component.html',
  providers: [QueryService],
})
export class MrpPlanningOnhandComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private appTranslate: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfig: AppConfigService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService,
    private queryService: QueryService,
  ) {
    super(<ServiceOptions>{ appTranslationSrv: appTranslate, msgSrv: msgSrv, appConfigSrv: appConfig, pro: pro });
    this.headerNameTranslate(this.columns);
  }

  public iParam: any; // 传入参数
  isFormLoad = true;
  listPlan: any[] = [];
  listPlant: any[] = [];
  listVersion: any[] = [];
  listNettingType: any[] = [];

  context = this;
  queryParams = {
    defines: [
      { field: 'planName', title: '计划名称', ui: { type: UiType.select, options: this.listPlan, ngModelChange: this.onPlanChange }, required: true },
      { field: 'version', title: '版本', ui: { type: UiType.select, options: this.listVersion }, required: true },
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.listPlant }, required: true },
      { field: 'itemCode', title: '物料号', ui: { type: UiType.text }, required: true  },
      { field: 'nettingType', title: '可净得', ui: { type: UiType.select, options: this.listNettingType } },
    ],
    values: {
      planName: null,
      version: null,
      plantCode: null,
      itemCode: null,
      nettingType: null,
    }
  };

  statisticsResult = { totalCount: 0, nettingTypeCount: 0, notNettingTypeCount: 0 };

  columns = [
    { field: 'itemCode', headerName: '物料号', menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'unitOfMeasure', headerName: '单位', menuTabs: ['filterMenuTab'] },
    { field: 'subinventoryCode', headerName: '子库', menuTabs: ['filterMenuTab'] },
    { field: 'description', headerName: '子库描述', menuTabs: ['filterMenuTab'] },
    { field: 'nettingType', headerName: '可净得', menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1)' },
    { field: 'onhandQuantity', headerName: '现有量', menuTabs: ['filterMenuTab'] },
  ];

  expColumns = [];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.listNettingType;
        break;
    }
    const obj = options.find(x => x.value === value) || { label: value };
    return obj ? obj.label : null;
  }

  ngOnInit() {
    this.loadInitData();
    this.loadInputParams();

    this.query();
  }

  loadInputParams() {
    this.queryParams.values.planName = this.iParam.planName;
    this.queryParams.values.version = this.iParam.version;
    this.queryParams.values.plantCode = this.iParam.plantCode;
    this.queryParams.values.itemCode = this.iParam.itemCode;

    this.onPlanChange(this.queryParams.values.planName);
  }

  loadInitData() {
    this.queryService.QueryPlans().subscribe(res => {
      res.data.forEach(item => {
        this.listPlan.push({
          label: item.planName,
          value: item.planName
        });
      });
    });

    // 可净得
    this.queryService.GetLookupByTypeNew('FND_YES_NO').subscribe(result => {
      result.data.forEach(d => {
        this.listNettingType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  onPlanChange(value) {
    if (!this.isFormLoad) {
      this.queryParams.values.version = null;
      this.queryParams.values.plantCode = null;
    }
    this.queryService.QueryDataByPlan(value).subscribe(res => {
      this.listVersion.length = 0;
      this.listPlant.length = 0;

      // 版本
      res.data.listVersion.forEach(item => {
        this.listVersion.push({
          label: item,
          value: item
        });
      });
      // 计划工厂
      res.data.listPlant.forEach(item => {
        this.listPlant.push({
          label: item,
          value: item
        });
      });

      if (!this.isFormLoad) {
        if (this.listVersion.length > 0)
          this.queryParams.values.version = this.listVersion[0].value;


        if (this.listPlant.length > 0)
          this.queryParams.values.plantCode = this.listPlant[0].value;
        this.isFormLoad = false;
      }
    });
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      planName: null,
      version: null,
      plantCode: null,
      itemCode: null,
      nettingType: null,
    };

    this.loadInputParams();
    this.onPlanChange(this.queryParams.values.planName);
  }

  commonQuery() {
    this.queryService.loadGridViewNew(this.queryService.planOnhandQuery, this.getQueryParams(), this.context);
  }

  public loadGridDataCallback(result) {
    this.statisticsResult = { totalCount: 0, nettingTypeCount: 0, notNettingTypeCount: 0 };
    result.data.forEach(p => {
      this.statisticsResult.totalCount += p.onhandQuantity;
      if (p.nettingType === 'Y')
        this.statisticsResult.nettingTypeCount += p.onhandQuantity;
      else
        this.statisticsResult.notNettingTypeCount += p.onhandQuantity;
    });
    // this.msgSrv.success(result.Result.length);
  }

  getQueryParams(isExport?: boolean) {
    return {
      planName: this.queryParams.values.planName,
      version: this.queryParams.values.version,
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode,
      nettingType: this.queryParams.values.nettingType,
      export: isExport
    };
  }

  exportFile() {
    super.export();
    this.queryService.exportAction(this.queryService.planOnhandQuery, this.getQueryParams(true), this.excelexport, this.context);
  }
}
