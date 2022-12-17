import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { SopPlanningCapacityService } from './sop-planning-capacity.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ProductSellBalanceSopPlanningCapacityImportComponent } from './import/import.component';
import { ProductSellBalanceSopPlanningCapacityEditComponent } from './edit/edit.component';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sop-planning-capacity',
  templateUrl: './sop-planning-capacity.component.html',
  providers: [SopPlanningCapacityService],
})
export class ProductSellBalanceSopPlanningCapacityComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  plantCodeList: any[] = [];
  salesTypeList: any[] = [];
  capacityList: any[] = [];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantCodeList, ngModelChange: this.plantChange } },
      { field: 'salesType', title: '内外销', ui: { type: UiType.select, options: this.salesTypeList } },
      { field: 'capacityCategory', title: '产能类别', ui: { type: UiType.select, options: this.capacityList } }
    ],
    values: {
      plantCode: this.appconfig.getPlantCode(),
      salesType: null,
      capacityCategory: null
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
        customTemplate: null,
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: { template: this.headerTemplate }
    },
    {
      field: 'plantCode', headerName: '工厂', title: '工厂', width: 80, locked: true, pinned: 'left', menuTabs: ['filterMenuTab']
    },
    {
      field: 'salesType', headerName: '内外销', title: '内外销', width: 100, locked: true, pinned: 'left', menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'capacityCategory', headerName: '产能类别', title: '产能类别', width: 120, locked: true, pinned: 'left', menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'currentMonth', headerName: '月份', title: '月份', width: 120, locked: false, menuTabs: ['filterMenuTab']
    },
    {
      field: 'workDays', headerName: '开工天数', title: '开工天数', width: 120, locked: false, menuTabs: ['filterMenuTab']
    },
    {
      field: 'totalPlanningQuantity', headerName: '规划总量', title: '规划总量', width: 120, locked: false, menuTabs: ['filterMenuTab']
    },
    { field: 'averageDailyYield', headerName: '日均产量', title: '日均产量', width: 120, locked: false, menuTabs: ['filterMenuTab'] },
  ];

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private editService: SopPlanningCapacityService,
    private appconfig: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.clear();
    this.dealCollumns();
    this.loadOptionData();
    this.query();
  }

  dealCollumns() {
    const dynamicCollumns = [];
    for (let i = 1; i <= 31; i++) {
      dynamicCollumns.push(
        {
          field: 'day' + i, headerName: i + '日', title: i + '日', width: 120, menuTabs: ['filterMenuTab'],
          editable: true
        }
      );
      // dynamicCollumns.push(
      //   { field: 'DAY' + i + '_USED', headerName: i + '日已用', title: i + '日已用', width: 120, menuTabs: ['filterMenuTab'] }
      // );
    }
    this.columns = [...this.columns, ...dynamicCollumns];
  }

  loadOptionData() {
    // 当前用户对应工厂
    this.queryParams.values.plantCode = this.appconfig.getPlantCode();
    this.editService.GetUserPlantNew().subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push({ value: d.plantCode, label: d.plantCode, scheduleRegionCode: d.scheduleRegionCode });
      });
      this.plantChange(this.queryParams.values.plantCode);
    });

    this.editService.GetLookupByType('SOP_SALES_TYPE').subscribe(result => {
      this.salesTypeList.length = 0;
      result.Extra.forEach(d => {
        this.salesTypeList.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  plantChange(event) {
    const search = this.plantCodeList.find(t => t.value === event);
    let scheduleRegionCode = '';
    if (search !== undefined) {
      scheduleRegionCode = search.scheduleRegionCode;
    }
    this.editService.getDemandDivisions(scheduleRegionCode).subscribe(result => {
      this.capacityList.length = 0;
      result.data.forEach(d => {
        this.capacityList.push({
          label: d.divisionValue,
          value: d.divisionValue,
        });
      });
    });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesTypeList;
        break;
      case 2:
        options = this.capacityList;
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
    const queryParams = this.getQueryParams(false);
    this.editService.loadGridViewNew({ url: this.editService.queryUrl, method: 'GET' }, queryParams, this.context);
  }

  private getQueryParams(isExport: boolean) {
    return  {
      plantCode: this.queryParams.values.plantCode,
      salesType: this.queryParams.values.salesType,
      capacityCategory: this.queryParams.values.capacityCategory,
      pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize,
      isExport: isExport
    };
  }

  // 新增、编辑
  public add(item: any) {
    this.modal.static(ProductSellBalanceSopPlanningCapacityEditComponent, { originDto: item !== undefined ? item : null }, 'xl').subscribe((value) => {
      if (value) {
        this.queryCommon();
      }
    });
  }
  // 删除
  public remove(item: any) {
    this.editService.delete([item.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.queryCommon();
      } else {
        this.msgSrv.error(res.msg);
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
        this.editService.delete(this.selectionKeys).subscribe(() => {
          this.msgSrv.success(this.appTranslationService.translate('删除成功'));
          this.queryCommon();
        });
      },
    });
  }

  // 导入
  public import() {
    this.modal.static(ProductSellBalanceSopPlanningCapacityImportComponent, {}, 'md').subscribe(() => {
      this.queryCommon();
    });
  }
  // 重置
  public clear() {
    this.queryParams.values = {
      plantCode: this.appconfig.getPlantCode(),
      salesType: null,
      capacityCategory: null,
    };
  }

  selectBy = 'id';
  // 行选中改变
  onSelectionChanged(event: any) {
    this.getGridSelectionKeys(this.selectBy);
  }

  expColumnsOptions: any[] = [{ field: 'salesType', options: this.salesTypeList }, { field: 'capacityCategory', options: this.capacityList }];
  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = this.getQueryParams(true);
    this.editService.export({ url: this.editService.queryUrl, method: 'GET' }, dto, this.excelexport, this.context);
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
