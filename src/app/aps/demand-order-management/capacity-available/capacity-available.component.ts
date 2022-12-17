import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { ModalHelper } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomOperateCellRenderComponent } from '../../../modules/base_module/components/custom-operatecell-render.component';
import { CapacityAvailableDetailComponent } from './detail/detail.component';
import * as moment from 'moment';

@Component({
  selector: 'app-capacity-available',
  templateUrl: './capacity-available.component.html'
})
export class CapacityAvailableComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private modal: ModalHelper,
    private commonQueryService: CommonQueryService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  businessUnitOption: any[] = [];
  plantOption: any[] = [];
  salesOptions: any[] = [];
  queryParams = {
    defines: [
      {
        field: 'businessUnitCode',
        title: '事业部',
        ui: { type: UiType.select, options: this.businessUnitOption, ngModelChange: this.onBusinessUnitCodeChange }
      },
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOption }
      },
      {
        field: 'capacityCategory',
        title: '产能分类',
        ui: { type: UiType.text }
      },
      {
        field: 'startAvailableDate',
        title: '可用日期从',
        ui: { type: UiType.date }
      },
      {
        field: 'endAvailableDate',
        title: '可用日期至',
        ui: { type: UiType.date }
      }
    ],
    values: {
      businessUnitCode: this.appConfigService.getDefaultScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      capacityCategory: '',
      startAvailableDate: moment(new Date()).format('yyyy-MM-DD').toString(),
      endAvailableDate: null
    }
  };
  columns = [
    {
      colId: 'action',
      field: '',
      headerName: '操作',
      width: 70,
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
    { field: 'businessUnitCode', headerName: '事业部', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'plantCode', headerName: '工厂', width: 110, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'salesType', headerName: '内外销', valueFormatter: 'ctx.optionsFind(value,1).label', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'capacityCategory', headerName: '产能分类', width: 130, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'availableDate', headerName: '可用日期', width: 130, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'originalCategoryQuantity', headerName: '初始可用量', width: 180, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    { field: 'remainCategoryQuantity', headerName: '剩余可用量', width: 180, menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
  ];
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadSalesOptions();
    this.loadBusinessUnitOption();
    this.loadPlantOption(this.appConfigService.getDefaultScheduleRegionCode());
    this.query();
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonQueryService.loadGridView(
      { url: '/api/ps/gopCtpCategory/queryGopCtpCategory', method: 'POST' },
      this.getQueryParams(),
      this.context
    );
  }

  getQueryParams() {
    return {
      businessUnitCode: this.queryParams.values.businessUnitCode,
      plantCode: this.queryParams.values.plantCode,
      capacityCategory: this.queryParams.values.capacityCategory,
      startAvailableDate: this.isNull(this.queryParams.values.startAvailableDate) ? '' : this.commonQueryService.formatDate(this.queryParams.values.startAvailableDate),
      endAvailableDate: this.isNull(this.queryParams.values.endAvailableDate) ? '' : this.commonQueryService.formatDate(this.queryParams.values.endAvailableDate),
      batchCode: null,
      pageIndex: this._pageNo,
      pageSize: this._pageSize  
    };
  }

  clear() {
    this.queryParams.values = {
      businessUnitCode: this.appConfigService.getDefaultScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      capacityCategory: '',
      startAvailableDate: null,
      endAvailableDate: null
    };
  }

  detail(data) {
    this.modal.static(
      CapacityAvailableDetailComponent,
      { data: data },
      'lg'
    ).subscribe(res => { });
  }

  onBusinessUnitCodeChange(val: string) {
    this.queryParams.values.plantCode = null;
    this.loadPlantOption(val);
  }

  loadSalesOptions() {
    this.commonQueryService.GetLookupByTypeNew('SOP_SALES_TYPE').subscribe(res => {
      res.data.forEach(item => {
        this.salesOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }
  


  loadBusinessUnitOption() {
    this.commonQueryService.GetScheduleRegions().subscribe(result => {
      result.data.forEach(d => {
        this.businessUnitOption.push({ value: d.scheduleRegionCode, label: d.scheduleRegionCode });
      });
    });
  }

  loadPlantOption(businessUnitCode: string) {
    this.commonQueryService.GetUserPlant(businessUnitCode, '').subscribe(result => {
      this.plantOption.length = 0;
      result.Extra.forEach(d => {
        this.plantOption.push({ value: d.plantCode, label: d.plantCode });
      });
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
