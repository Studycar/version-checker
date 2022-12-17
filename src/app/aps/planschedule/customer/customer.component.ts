import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomerService } from './customer.service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { PlantAreaService } from 'app/aps/demand-order-management/plant-area/plant-area.service';
import { PlanscheduleCustomerEditComponent } from './edit/edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-customer',
  templateUrl: './customer.component.html',
  providers: [CustomerService, PlantAreaService],
})
export class PlanscheduleCustomerComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  gradeList: any[] = [];
  enableList: any[] = [];
  regionList: any[] = [];
  areaList: any[] = [];
  public queryParams = {
    defines: [
      { field: 'scheduleRegionCode', title: '事业部', ui: { type: UiType.select, options: this.regionList, ngModelChange: this.loadArea } },
      { field: 'areaCode', title: '区域', ui: { type: UiType.select, options: this.areaList } },
      { field: 'customerNumber', title: '客户编号', ui: { type: UiType.text } },
      { field: 'customerName', title: '客户名称', ui: { type: UiType.text } },
      { field: 'customerGrade', title: '客户等级', ui: { type: UiType.select, options: this.gradeList } },
      { field: 'enableFlag', title: '是否有效', ui: { type: UiType.select, options: this.enableList } }
    ],
    values: {
      scheduleRegionCode: this.appconfig.getActiveScheduleRegionCode(),
      areaCode: null,
      customerNumber: '',
      customerName: '',
      customerGrade: null,
      enableFlag: null
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    // {
    //   colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
    //   checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
    //   headerComponentParams: { template: this.headerTemplate }
    // },
    {
      field: 'scheduleRegionCode', headerName: '事业部', title: '事业部', width: 100, locked: true, pinned: 'left', menuTabs: ['filterMenuTab']
    },
    {
      field: 'areaName', headerName: '区域', title: '区域', width: 170, locked: true, pinned: 'left', menuTabs: ['filterMenuTab']
    },
    {
      field: 'customerNumber', headerName: '客户编号', title: '客户编号', width: 120, locked: true, pinned: 'left', menuTabs: ['filterMenuTab']
    },
    {
      field: 'customerName', headerName: '客户名称', title: '客户名称', width: 120, locked: true, pinned: 'left', menuTabs: ['filterMenuTab']
    },
    {
      field: 'customerShortName', headerName: '客户简称', title: '客户简称', width: 120, locked: true, pinned: 'left', menuTabs: ['filterMenuTab']
    },
    {
      field: 'customerGrade', headerName: '客户等级', title: '客户等级', width: 100, locked: false, menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'salesQtyMonths', headerName: '月均销量', title: '月均销量', width: 100, locked: false, menuTabs: ['filterMenuTab']
    },
    {
      field: 'customerClassCode', headerName: '客户类别代码', title: '客户类别代码', width: 120, locked: false, menuTabs: ['filterMenuTab']
    },
    {
      field: 'customerType', headerName: '客户类型', title: '客户类型', width: 120, locked: false, menuTabs: ['filterMenuTab']
    },
    {
      field: 'enableFlag', headerName: '是否有效', title: '是否有效', width: 120, locked: false, menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.optionsFind(value,2).label'
    }
  ];

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private editService: CustomerService,
    private areaService: PlantAreaService,
    private appconfig: AppConfigService,
    private commonQueryService: CommonQueryService
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
    this.commonQueryService.GetLookupByType('PP_PLN_CUSTOMER_DEGREE').subscribe(result => {
      this.gradeList.length = 0;
      result.Extra.forEach(d => {
        this.gradeList.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    this.commonQueryService.GetLookupByType('PS_CUSTOMER_STATUS').subscribe(result => {
      this.enableList.length = 0;
      result.Extra.forEach(d => {
        this.enableList.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    this.commonQueryService.GetAllScheduleRegion().subscribe(res => {
      this.regionList.length = 0;
      res.data.forEach(d => {
        this.regionList.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });
    this.loadArea();
  }
  // 区域
  loadArea() {
    this.queryParams.values.areaCode = null;
    this.areaService.GetDivisions({
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      custDvisionType: 'DC',
      pareatDivisionId: '',
      enableFlag: '',
      export: true,
      QueryParams: { PageIndex: this._pageNo, PageSize: this._pageSize }
    }).subscribe(result => {
      this.areaList.length = 0;
      result.data.forEach(d => {
        this.areaList.push({
          label: d.custDivisionName,
          value: d.custDivisionValue,
        });
      });
    });
  }
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.gradeList;
        break;
      case 2:
        options = this.enableList;
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
    this.commonQueryService.loadGridViewNew({ url: this.editService.QueryUrl, method: 'POST' }, dto, this.context);
  }

  private getQueryParams(isExport: boolean) {
    const dto = {
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      areaCode: this.queryParams.values.areaCode,
      customerNumber: this.queryParams.values.customerNumber,
      customerName: this.queryParams.values.customerName,
      customerGrade: this.queryParams.values.customerGrade,
      enableFlag: this.queryParams.values.enableFlag,
      queryParams: { PageIndex: this._pageNo, PageSize: this._pageSize },
      isExport: isExport
    };
    return dto;
  }
  // 新增、编辑
  public add(item?: any) {
    this.modal.static(PlanscheduleCustomerEditComponent, { originDto: item !== undefined ? item : {} }, 'lg').subscribe((value) => {
      if (value) {
        this.queryCommon();
      }
    });
  }
  // 重置
  public clear() {
    this.queryParams.values = {
      scheduleRegionCode: this.appconfig.getActiveScheduleRegionCode(),
      areaCode: null,
      customerNumber: '',
      customerName: '',
      customerGrade: null,
      enableFlag: null
    };
  }

  selectBy = 'id';
  // 行选中改变
  onSelectionChanged(event: any) {
    this.getGridSelectionKeys(this.selectBy);
  }

  expColumnsOptions: any[] = [{ field: 'SALES_TYPE', options: this.gradeList }];
  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    /*super.export();
    const dto = this.getQueryParams(true);
    this.editService.export({ url: this.editService.QueryUrl, method: 'POST' }, dto, this.excelexport, this.context);*/
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
}
