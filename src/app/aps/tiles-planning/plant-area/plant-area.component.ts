import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { PlantAreaService } from './plant-area.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { TilesPlanningPlantAreaEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tiles-planning-plant-area',
  templateUrl: './plant-area.component.html',
  providers: [PlantAreaService],
})
export class TilesPlanningPlantAreaComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  regionList: any[] = [];
  salesRegionList: any[] = [];
  provinceList: any[] = [];
  cityList: any[] = [];
  plantCodeList: any[] = [];

  public gridViewCustomItems: GridDataResult = {
    data: [],
    total: 0,
  };

  public CustomColumnsItems: any[] = [
    {
      field: 'CUSTOMER_NAME',
      title: '客户名称',
      width: '100',
    },
    {
      field: 'CUSTOMER_NUMBER',
      title: '客户编号',
      width: '100',
    },
  ];

  public queryParams = {
    defines: [
      { field: 'scheduleRegionCode', title: '集团', required: true, ui: { type: UiType.select, options: this.regionList, ngModelChange: this.regionChange } },
      { field: 'salesRegion', title: '销售公司', required: true, ui: { type: UiType.select, options: this.salesRegionList, } },
      { field: 'plantCode', title: '生产基地', ui: { type: UiType.select, options: this.plantCodeList, } },
      // {
      //   field: 'strCustom',
      //   title: '客户',
      //   ui: {
      //     type: UiType.popupSelect,
      //     valueField: 'CUSTOMER_NUMBER',
      //     textField: 'CUSTOMER_NAME',
      //     gridView: this.gridViewCustomItems,
      //     columns: this.CustomColumnsItems,
      //     eventNo: 1,
      //   },
      // },

    ],
    values: {
      scheduleRegionCode: this.appconfig.getActiveScheduleRegionCode(),
      salesRegion: null,
      strCustom: { value: '', text: '' },
      plantCode: null,
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: { template: this.headerTemplate }
    },
    {
      field: 'scheduleRegionCode', headerName: '集团', title: '集团', width: 100, locked: true, pinned: 'left', menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    {
      field: 'salesRegion', headerName: '销售公司', title: '销售公司', width: 100, locked: true, pinned: 'left', menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'plantCode', headerName: '生产基地', title: '生产基地', width: 170, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    // {
    //   field: 'CUSTOMER_SHORT_NAME', headerName: '客户', title: '客户', width: 120, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab']
    // },
    // {
    //   field: 'Province', title: '省', width: 170, locked: false, hidden: true
    // },
    // {
    //   field: 'City', title: '市', width: 170, locked: false, hidden: true
    // },
    {
      field: 'provinceCode', headerName: '省', title: '省', width: 170, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    {
      field: 'cityCode', headerName: '市', title: '市', width: 170, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    // {
    //   field: 'DISTANCE', headerName: '运输距离', title: '运输距离', width: 170, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab']
    // },
    { field: 'priority', headerName: '优先级', title: '优先级', width: 120, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  ];

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private editService: PlantAreaService,
    private appconfig: AppConfigService,
    private commonqueryService: CommonQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.clear();
    this.loadOptionData();
    this.clear();
    this.query();
  }

  loadOptionData() {
    // 事业部
    this.editService.GetAllScheduleRegion().subscribe(result => {
      this.regionList.length = 0;
      result.data.forEach(d => {
        this.regionList.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });
    // 销售公司
    this.loadSalesRegion();

    // 生产基地
    this.loadPlantCode();
  }

  // 切换事业部
  regionChange() {
    this.salesRegionList.length = 0;
    this.plantCodeList.length = 0;
    this.queryParams.values.plantCode = null;
    this.queryParams.values.salesRegion = null;
    this.loadSalesRegion();
    this.loadPlantCode();
  }

  // 销售公司
  loadSalesRegion() {
    if (!this.queryParams.values.scheduleRegionCode) return;
    this.commonqueryService.GetUserPlant(this.queryParams.values.scheduleRegionCode, '').subscribe(result => {
      result.Extra.forEach(d => {
        this.salesRegionList.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }


  // 生产基地
  loadPlantCode() {
    if (!this.queryParams.values.scheduleRegionCode) return;
    this.commonqueryService.GetAllPlant(this.queryParams.values.scheduleRegionCode).subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesRegionList;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const dto = this.getQueryParams(false);
    this.editService.loadGridViewNew({ url: this.editService.QueryUrl, method: 'POST' }, dto, this.context);
  }

  private getQueryParams(IsExport: boolean) {
    const dto = {
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      salesRegion: this.queryParams.values.salesRegion
        ? this.queryParams.values.salesRegion
        : null,
      strCustom: this.queryParams.values.strCustom.value,
      plantCode: this.queryParams.values.plantCode,
      QueryParams: { PageIndex: this._pageNo, PageSize: this._pageSize },
      IsExport: IsExport
    };
    return dto;
  }

  // 新增、编辑
  public add(item?: any) {
    this.modal.static(TilesPlanningPlantAreaEditComponent,
      { originDto: item !== undefined ? item : { scheduleRegionCode: this.queryParams.values.salesRegion } }, 'lg')
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }
  // 删除
  public remove(item?: any) {
    this.editService.Delete([item[this.selectBy]]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }

  // 批量删除
  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success(this.appTranslationService.translate('请选择要删除的数据。'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.Delete(this.selectionKeys).subscribe(() => {
          this.msgSrv.success(this.appTranslationService.translate('删除成功'));
          this.queryCommon();
        });
      },
    });
  }

  // 重置
  public clear() {
    this.queryParams.values = {
      scheduleRegionCode: this.appconfig.getActiveScheduleRegionCode(),
      salesRegion: this.appconfig.getPlantCode(),
      strCustom: { value: '', text: '' },
      plantCode: null,
    };
  }

  selectBy = 'ID';
  // 行选中改变
  onSelectionChanged(event: any) {
    this.getGridSelectionKeys(this.selectBy);
  }

  expColumns = this.columns;

  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = this.getQueryParams(true);
    this.editService.export({ url: this.editService.QueryUrl, method: 'POST' }, dto, this.excelexport, this.context);
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
