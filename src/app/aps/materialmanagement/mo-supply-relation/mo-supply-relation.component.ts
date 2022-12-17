import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { MaterialmanagementMoSupplyRelationEditComponent } from './edit/edit.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { MaterialmanagementMoSupplyRelationImportComponent } from './import/import.component';
import { ImportsModalComponent } from 'app/modules/base_module/components/imports-modal/imports-modal.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-mo-supply-relation',
  templateUrl: './mo-supply-relation.component.html',
  providers: [QueryService],
})
export class MaterialmanagementMoSupplyRelationComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';

  listScheduleRegion: any[] = [];
  listPlant: any[] = [];
  listDataType = [{ label: '物料', value: '0' }, { label: '库存分类', value: '1' }];
  listSupplyType: any[] = [];
  listSubinventories: any[] = [];

  public queryParams = {
    defines: [
      { field: 'scheduleRegionCode', title: '事业部', ui: { type: UiType.select, options: this.listScheduleRegion, ngModelChange: this.onScheduleRegionChange }, required: true },
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.listPlant, ngModelChange: this.onPlantChange }, required: true },
      { field: 'category', title: '值类别', ui: { type: UiType.select, options: this.listDataType } },
      { field: 'categoryValues', title: '类别值', ui: { type: UiType.text } },
      { field: 'supplyType', title: '供应类型', ui: { type: UiType.select, options: this.listSupplyType } },
      { field: 'supplySubinventory', title: '供应子库', ui: { type: UiType.select, options: this.listSubinventories } },
    ],
    values: {
      scheduleRegionCode: null,
      plantCode: null,
      category: null,
      categoryValues: null,
      supplyType: null,
      supplySubinventory: null
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true, checkboxSelection: true,
      headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    { field: 'scheduleRegionCode', width: 120, headerName: '事业部', tooltipField: 'v', menuTabs: ['filterMenuTab'], },
    { field: 'plantCode', width: 80, headerName: '工厂', tooltipField: 'plantCode', menuTabs: ['filterMenuTab'], },
    { field: 'categoryName', width: 120, headerName: '值类别', tooltipField: 'categoryName', menuTabs: ['filterMenuTab'], },
    { field: 'categoryValues', width: 120, headerName: '类别值', tooltipField: 'categoryValues', menuTabs: ['filterMenuTab'], },
    { field: 'supplyTypeName', width: 120, headerName: '供应类型', tooltipField: 'supplyTypeName', menuTabs: ['filterMenuTab'], },
    { field: 'supplySubinventory', width: 120, headerName: '供应子库', tooltipField: 'supplySubinventory', menuTabs: ['filterMenuTab'], },
    { field: 'supplySubinventoryName', width: 140, headerName: '供应子库名称', tooltipField: 'supplySubinventoryName', menuTabs: ['filterMenuTab'], },
  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  private getQueryParamsValue(isExport: boolean): any {
    return {
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      plantCode: this.queryParams.values.plantCode,
      category: this.queryParams.values.category,
      categoryValues: this.queryParams.values.categoryValues,
      supplyType: this.queryParams.values.supplyType,
      supplySubinventory: this.queryParams.values.supplySubinventory,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      isExport: isExport
    };
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadSupplyType();
    this.loadScheduleRegion();
  }

  loadScheduleRegion() {
    this.queryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(item => {
        this.listScheduleRegion.push({
          label: item.scheduleRegionCode, // DESCRIPTIONS,
          value: item.scheduleRegionCode
        });
      });
    });
    this.loadPlant(true);
  }

  loadPlant(isFormLoad: boolean) {
    this.listPlant.length = 0;
    if (isFormLoad) {
      //加载默认计划区域对应的工厂
      this.queryService.GetUserPlant(this.appConfigService.getDefaultScheduleRegionCode()).subscribe(res => {
        res.Extra.forEach(item => {
          this.listPlant.push({
            label: item.plantCode,
            value: item.plantCode,
            scheduleRegionCode: item.scheduleRegionCode,
          });
        });
        // 页面初始化，加载默认区域和工厂
        this.queryParams.values.scheduleRegionCode = this.appConfigService.getDefaultScheduleRegionCode();
        this.queryParams.values.plantCode = this.appConfigService.getDefaultPlantCode();
        //
        this.onPlantChange(this.appConfigService.getDefaultPlantCode());
        this.query();
      });
    }
  }

  loadDefaultPlantAndScheduleRegion() {
    this.queryParams.values.scheduleRegionCode = this.appConfigService.getDefaultScheduleRegionCode();
    this.queryParams.values.plantCode = this.appConfigService.getDefaultPlantCode();
    this.onPlantChange(this.appConfigService.getDefaultPlantCode());
    //const userConfig = this.listPlant.find(item => item.value === this.queryParams.values.plantCode);
    //this.queryParams.values.scheduleRegionCode = userConfig ? userConfig.scheduleRegionCode : null;
    //this.onPlantChange(this.queryParams.values.plantCode);
  }

  onScheduleRegionChange(value) {
    this.listPlant.length = 0;
    this.queryService.GetUserPlant(this.queryParams.values.scheduleRegionCode).subscribe(res => {
      res.Extra.forEach(item => {
        this.listPlant.push({
          label: item.plantCode,
          value: item.plantCode,
          plantCode: item.plantCode,
        });
      });
      const userConfig = this.listPlant.find(item => item.value === this.queryParams.values.plantCode);
      this.queryParams.values.plantCode = userConfig ? userConfig.plantCode : null;
    });
  }

  onPlantChange(value) {
    // 加载供应子库
    this.listSubinventories.length = 0;
    this.queryService.QuerySubinventories(value).subscribe(res => {
      res.data.forEach(item => {
        this.listSubinventories.push({
          label: item.subinventoryCode + '(' + item.subinventoryDescription + ')',
          value: item.subinventoryCode
        });
      });
    });
  }

  public loadSupplyType(): void {
    this.listSupplyType.length = 0;
    this.queryService.GetLookupByType('PS_MO_COMP_SUPPLY_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.listSupplyType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  public clear() {
    this.queryParams.values = {
      scheduleRegionCode: this.appConfigService.getDefaultScheduleRegionCode(),
      plantCode: this.appConfigService.getDefaultPlantCode(),
      category: null,
      categoryValues: null,
      supplyType: null,
      supplySubinventory: null
    };
    /**加载所有事业部 */
    this.queryService.GetAllScheduleRegion().subscribe(res => {
      res.data.forEach(item => {
        this.listScheduleRegion.push({
          label: item.scheduleRegionCode, // DESCRIPTIONS,
          value: item.scheduleRegionCode
        });
      });
      /**加载默认事业部对应的工厂 */
      this.onScheduleRegionChange(this.appConfigService.getDefaultScheduleRegionCode());
      this.onPlantChange(this.appConfigService.getDefaultPlantCode());
    });
  }

  public query() {
    super.query();
    this.lastPageNo = 1;
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew({ url: this.queryService.queryDataUrl, method: 'GET' }, this.getQueryParamsValue(false), this.context);
  }

  public add(item: any) {
    this.modal.static(MaterialmanagementMoSupplyRelationEditComponent,
      { dataId: item !== undefined ? item.id : null, }, 'lg').subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    const listIds = [];
    listIds.push(item.id);
    this.DeleteMoSupplyRelationship(listIds);
  }

  removeBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    console.log(this.selectionKeys);

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.DeleteMoSupplyRelationship(this.selectionKeys);
      },
    });
  }

  DeleteMoSupplyRelationship(listIds: any) {
    this.queryService.DeleteMoSupplyRelationship(listIds).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  // 导入
  public import() {
    this.modal.static(MaterialmanagementMoSupplyRelationImportComponent, {}, 'md').subscribe(value => {
      if (value) {
        this.query();
      }
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.export({ url: this.queryService.queryDataUrl, method: 'GET' }, this.getQueryParamsValue(true), this.excelexport, this.context);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
}
