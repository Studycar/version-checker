import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { MaterialmanagementMoLossEditComponent } from './edit/edit.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { MaterialmanagementMoLossImportComponent } from './import/import.component';
import { ImportsModalComponent } from 'app/modules/base_module/components/imports-modal/imports-modal.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-mo-loss',
  templateUrl: './mo-loss.component.html',
  providers: [QueryService],
})
export class MaterialmanagementMoLossComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'Id';

  listScheduleRegion: any[] = [];
  listPlant: any[] = [];
  listDataType = [{ label: '物料', value: '0' }, { label: '库存分类', value: '1' }];
  listSupplyType: any[] = [];
  listSubinventories: any[] = [];

  public queryParams = {
    defines: [
      { field: 'SCHEDULE_REGION_CODE', title: '事业部', ui: { type: UiType.select, options: this.listScheduleRegion, ngModelChange: this.onScheduleRegionChange }, required: true },
      { field: 'PLANT_CODE', title: '工厂', ui: { type: UiType.select, options: this.listPlant }, required: true },
      { field: 'CATEGORY', title: '值类别', ui: { type: UiType.select, options: this.listDataType } },
      { field: 'CATEGORY_VALUES', title: '类别值', ui: { type: UiType.text } },
    ],
    values: {
      SCHEDULE_REGION_CODE: null,
      PLANT_CODE: null,
      CATEGORY: null,
      CATEGORY_VALUES: null,
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
    { field: 'SCHEDULE_REGION_CODE', width: 120, headerName: '事业部', tooltipField: 'SCHEDULE_REGION_CODE', menuTabs: ['filterMenuTab'], },
    { field: 'PLANT_CODE', width: 120, headerName: '工厂', tooltipField: 'PLANT_CODE', menuTabs: ['filterMenuTab'], },
    { field: 'CATEGORY_NAME', width: 120, headerName: '值类别', tooltipField: 'CATEGORY_NAME', menuTabs: ['filterMenuTab'], },
    { field: 'CATEGORY_VALUES', width: 120, headerName: '类别值', tooltipField: 'CATEGORY_VALUES', menuTabs: ['filterMenuTab'], },
    { field: 'CONSTANT_LOSS', width: 120, headerName: '固定损耗', tooltipField: 'SUPPLY_TYPE_NAME', menuTabs: ['filterMenuTab'], },
    { field: 'VARIABLE_LOSS', width: 120, headerName: '变动损耗(%)', tooltipField: 'SUPPLY_SUBINVENTORY', menuTabs: ['filterMenuTab'], },
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
      SCHEDULE_REGION_CODE: this.queryParams.values.SCHEDULE_REGION_CODE,
      PLANT_CODE: this.queryParams.values.PLANT_CODE,
      CATEGORY: this.queryParams.values.CATEGORY,
      CATEGORY_VALUES: this.queryParams.values.CATEGORY_VALUES,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      IS_EXPORT: isExport
    };
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadScheduleRegion();
  }

  loadScheduleRegion() {
    this.queryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(item => {
        this.listScheduleRegion.push({
          label: item.SCHEDULE_REGION_CODE, // DESCRIPTIONS,
          value: item.SCHEDULE_REGION_CODE
        });
      });
    });
    this.loadPlant(true);
  }

  loadPlant(isFormLoad: boolean) {
    this.listPlant.length = 0;
    this.queryService.GetUserPlant(this.queryParams.values.SCHEDULE_REGION_CODE).subscribe(res => {
      res.Extra.forEach(item => {
        this.listPlant.push({
          label: item.PLANT_CODE,
          value: item.PLANT_CODE,
          SCHEDULE_REGION_CODE: item.SCHEDULE_REGION_CODE,
        });
      });
      if (isFormLoad) {
        // 页面初始化，加载默认区域和工厂
        this.loadDefaultPlantAndScheduleRegion();
        this.query();
      }
    });
  }

  loadDefaultPlantAndScheduleRegion() {
    this.queryParams.values.PLANT_CODE = this.appConfigService.getPlantCode();
    const userConfig = this.listPlant.find(item => item.value === this.queryParams.values.PLANT_CODE);
    this.queryParams.values.SCHEDULE_REGION_CODE = userConfig ? userConfig.SCHEDULE_REGION_CODE : null;
  }

  onScheduleRegionChange(value) {
    this.loadPlant(false);
  }

  public clear() {
    this.queryParams.values = {
      SCHEDULE_REGION_CODE: null,
      PLANT_CODE: null,
      CATEGORY: null,
      CATEGORY_VALUES: null,
    };

    this.loadDefaultPlantAndScheduleRegion();
    this.onScheduleRegionChange(this.queryParams.values.SCHEDULE_REGION_CODE);
    // this.onPlantChange(this.queryParams.values.PLANT_CODE);
  }

  public query() {
    super.query();
    this.lastPageNo = 1;
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridView({ url: this.queryService.queryDataUrl, method: 'POST' }, this.getQueryParamsValue(false), this.context);
  }

  public add(item: any) {
    this.modal.static(MaterialmanagementMoLossEditComponent,
      { dataId: item !== undefined ? item.Id : null, }, 'lg', ).subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    const listIds = [];
    listIds.push(item.Id);
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
    this.queryService.DeleteMoLoss(listIds).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  // 导入
  public import() {
    this.modal.static(MaterialmanagementMoLossImportComponent, {}, 'md').subscribe(value => {
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
    this.commonQueryService.export({ url: this.queryService.queryDataUrl, method: 'POST' }, this.getQueryParamsValue(true), this.excelexport, this.context);
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
