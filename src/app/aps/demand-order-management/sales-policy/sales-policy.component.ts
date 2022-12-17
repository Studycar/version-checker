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
import { SalesPolicyService } from './sales-policy.service';
import { DemandOrderManagementSalesPolicyEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-sales-policy',
  templateUrl: './sales-policy.component.html',
  providers: [SalesPolicyService],
})
export class DemandOrderManagementSalesPolicyComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  regionList: any[] = [];
  salesRegionList: any[] = [];
  salesAreaList: any[] = [];

  public queryParams = {
    defines: [
      { field: 'scheduleRegionCode', title: '事业部', required: true, ui: { type: UiType.select, options: this.regionList, ngModelChange: this.regionChange } },
      { field: 'salesRegion', title: '销售公司', ui: { type: UiType.select, options: this.salesRegionList, ngModelChange: this.loadSalesArea } },
      { field: 'salesArea', title: '区域', ui: { type: UiType.select, options: this.salesAreaList } },
      { field: 'itemCode', title: '产品编码', ui: { type: UiType.textarea } }
    ],
    values: {
      scheduleRegionCode: this.appconfig.getActiveScheduleRegionCode(),
      salesRegion: '',
      salesArea: '',
      itemCode: ''
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
      field: 'scheduleRegionCode', headerName: '事业部', title: '事业部', width: 100, locked: true, pinned: 'left', menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    {
      field: 'salesRegion', headerName: '销售公司', title: '销售公司', width: 100, locked: true, pinned: 'left', menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'salesArea', headerName: '区域', title: '区域', width: 100, locked: true, pinned: 'left', menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'itemCode', headerName: '产品编码', title: '产品编码', width: 120, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    {
      field: 'beginDate', headerName: '开始时间', title: '开始时间', width: 170, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    {
      field: 'endDate', headerName: '结束时间', title: '结束时间', width: 170, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab']
    },
    {
      field: 'policyNote', headerName: '促销政策', title: '促销政策', width: 120, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab']
      , tooltipField: 'policyNote'
    },
    // { field: 'PRIORITY', headerName: '优先级', title: '优先级', width: 120, locked: false, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  ];

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private editService: SalesPolicyService,
    private appconfig: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.clear();
    this.loadOptionData();
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
    // 区域
    this.loadSalesArea();
  }
  // 销售公司
  loadSalesRegion() {
    this.queryParams.values.salesRegion = null;
    this.queryParams.values.salesArea = null;
    this.editService.GetDivisions({
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      custDivisionType: 'REGION',
      pareatDivisionId: '',
      enableFlag: '',
      isExport: true,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }).subscribe(result => {
      this.salesRegionList.length = 0;
      console.log(result);
      result.data.content.forEach(d => {
        this.salesRegionList.push({
          label: d.custDivisionName,
          value: d.custDivisionName,
        });
      });
    });
  }
  // 区域
  loadSalesArea() {
    this.queryParams.values.salesArea = null;
    this.editService.GetDivisions({
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      //custDivisionType: 'DC',
      pareatDivisionId: this.queryParams.values.salesRegion,
      enableFlag: '',
      isExport: true,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    }).subscribe(result => {
      this.salesAreaList.length = 0;
      result.data.content.forEach(d => {
        this.salesAreaList.push({
          label: d.custDivisionName,
          value: d.custDivisionName,
        });
      });
    });
  }
  regionChange() {
    this.loadSalesRegion();
    this.loadSalesArea();
  }
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesRegionList;
        break;
      case 2:
        options = this.salesAreaList;
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
    this.editService.loadGridView({ url: this.editService.QueryUrl, method: 'GET' }, dto, this.context);
  }

  private getQueryParams(IsExport: boolean) {
    const dto = {
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      salesRegion: this.queryParams.values.salesRegion,
      salesArea: this.queryParams.values.salesArea,
      itemCode: this.queryParams.values.itemCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      IsExport: IsExport
    };
    return dto;
  }

  // 新增、编辑
  public add(item?: any) {
    this.modal.static(DemandOrderManagementSalesPolicyEditComponent, { originDto: item !== undefined ? item : { scheduleRegionCode: this.queryParams.values.scheduleRegionCode } }, 'lg').subscribe((value) => {
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
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
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
      salesRegion: '',
      salesArea: '',
      itemCode: ''
    };
  }

  selectBy = 'id';
  // 行选中改变
  onSelectionChanged(event: any) {
    this.getGridSelectionKeys(this.selectBy);
  }

  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'salesRegion', options: this.salesRegionList }, { field: 'salesArea', options: this.salesAreaList }];
  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = this.getQueryParams(true);
    this.editService.export({ url: this.editService.QueryUrl, method: 'GET' }, dto, this.excelexport, this.context);
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
