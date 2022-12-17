import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { deepCopy } from '@delon/util';
import { getMonthDay } from '../util';

@Component({
  selector: 'mold-execution',
  templateUrl: './mold-execution.component.html',
  providers: [QueryService]
})
export class MoldExecutionComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryService: QueryService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  columns: any[] = [];

  staticColumns = [
    { field: 'businessUnit', headerName: '事业部', pinned: 'left', width: 120, },
    { field: 'plantCode', headerName: '组织', pinned: 'left', width: 80, },
    { field: 'category', headerName: '分类', pinned: 'left', width: 120, },
    { field: 'platform', headerName: '平台', width: 80, },
    { field: 'mouldCode', headerName: '模具编码', width: 120, },
    { field: 'itemCode', headerName: '物料编码', width: 120, },
    { field: 'descriptions', headerName: '物料描述', width: 120, },
    { field: 'tonnage', headerName: '机台吨位', width: 120, },
    { field: 'mouldQty', headerName: '模具数量', width: 120, },
    { field: 'dayProductionNum', headerName: '日产能', width: 120, },
    { field: 'monthProductionNum', headerName: '月产能', width: 120, },
    { field: 'nowMakePlant', headerName: '厂家', width: 120, },
  ];

  restColumns = [
    { field: 'received', headerName: '已接单', width: 120, },
    { field: 'receivedRate', headerName: '接单进度', width: 120, },
    { field: 'nowMakePlant', headerName: '厂家', width: 120, },
    {
      headerName: '每日执行情况',
      children: [],
    }
  ];

  businessUnitCodeOptions: any[] = [];
  organizationOptions: any[] = [];
  dieCodeOptions: any[] = [];

  queryParams: any = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.businessUnitCodeOptions, eventNo: 1, }, required: true, },
      { field: 'plantCode', title: '组织', ui: { type: UiType.select, options: this.organizationOptions, eventNo: 2, }, required: true, },
      { field: 'dieCode', title: '模具编码', ui: { type: UiType.select, options: this.organizationOptions, }, },
      { field: 'involveItem', title: '物料编码', ui: { type: UiType.select, options: this.dieCodeOptions, }, },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      plantCode: this.appConfigService.getPlantCode(),
      dieCode: null,
      involveItem: null,
    }
  };

  gmonth: any[] = [];
  nmonth: any[] = [];
  daysInMonth: any[] = [];

  httpAction = {
    url: '',
    method: 'GET',
  }

  ngOnInit(): void {
    this.getNmonth();
    this.getGmonth();
    this.getDaysInMonth();
    this.loadOptions();
    this.query();
  }

  getNmonth() {
    const newArr = [];
    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    for (let index = 9; index >= 0; index--) {
      const template = curMonth - index;
      const month = template <= 0 ? template + 12 : template;
      const year = template <= 0 ? curYear - 1 : curYear;
      newArr.push(`${year}年${month < 10 ? '0' + month : '' + month}月`);
    }
    for (let index = 1; index <= 2; index++) {
      const template = curMonth + index;
      const month = template > 12 ? template - 12 : template;
      const year = template > 12 ? curYear + 1 : curYear;
      newArr.push(`${year}年${month < 10 ? '0' + month : '' + month}月`);
    }

    this.nmonth = newArr;
  }

  getGmonth() {
    const newArr = [];
    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    for (let index = 9; index >= 0; index--) {
      const template = curMonth - index;
      const month = template <= 0 ? template + 12 : template;
      const year = template <= 0 ? curYear - 1 : curYear;
      newArr.push(`${year}年${month < 10 ? '0' + month : '' + month}月`);
    }
    for (let index = 1; index <= 2; index++) {
      const template = curMonth + index;
      const month = template > 12 ? template - 12 : template;
      const year = template > 12 ? curYear + 1 : curYear;
      newArr.push(`${year}年${month < 10 ? '0' + month : '' + month}月`);
    }

    this.gmonth = newArr;
  }

  getDaysInMonth() {
    const newArr = [];
    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    const month = `${curMonth < 10 ? '0' + curMonth : '' + curMonth}月`;
    const days = getMonthDay(curYear, curMonth);
    for (let index = 1; index <= days; index++) {
      newArr.push(`${month}${index}日`);
    }
    this.daysInMonth = newArr;
  }

  // 加载搜索项
  loadOptions() {
    this.getBusinessUnitCodeOptions();
    this.getOrganizationOptions();
  }

  // 获取事业部列表
  getBusinessUnitCodeOptions() {
    this.businessUnitCodeOptions.length = 0;
    this.queryService.getScheduleRegion().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.businessUnitCodeOptions.push({
          value: item.scheduleRegionCode,
          label: item.descriptions,
        });
      });
    });
  }

  businessUnitCodeOptionsChange(value) {
    this.queryParams.values.plantCode = null;
    this.getOrganizationOptions();
  }

  // 获取组织列表
  getOrganizationOptions() {
    const params = this.getQueryParams();
    this.organizationOptions.length = 0;
    this.queryService.getPlant(params).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.organizationOptions.push({
          value: item.plantCode,
          label: item.plantCode,
        });
      })
    });
  }

  organizationOptionsChange(value) {
    this.queryParams.values.dieCode = null;
    this.queryParams.values.involveItem = null;
  }

  // 获取查询参数
  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if (isExport) {
      params.isExport = true;
    } else {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    params.organizationId = params.organizationCode ? this.organizationOptions.find(o => o.value === params.organizationCode).id : null;

    console.log('getQueryParams', params);
    return params;
  }

  // 渲染表头
  renderColumns(): void {
    const params = this.getQueryParams();

    let columns: any[] = [
      ...this.staticColumns,
    ];

    const monthColumns: any[] = [
      {
        headerName: '需求',
        children: [],
      },
      {
        headerName: '缺口',
        children: [],
      }
    ];

    // 需求
    this.gmonth.forEach((item, index) => {
      monthColumns[0].children.push({
        field: `nmonth${index + 1}`,
        headerName: item,
        width: 120,
      });
    });
    monthColumns[0].children.push({ field: 'ntotal', headerName: '累计', width: 100, });
    // 缺口
    this.gmonth.forEach((item, index) => {
      monthColumns[1].children.push({
        field: `gmonth${index + 1}`,
        headerName: item,
        width: 120,
      });
    });
    monthColumns[1].children.push({ field: 'gtotal', headerName: '累计', width: 100, });
    // 每日执行情况
    this.restColumns[2].children = [];
    this.daysInMonth.forEach((item, index) => {
      this.restColumns[2].children.push({
        field: `day${index + 1 }`,
        headerName: item,
        width: 120,
      });
    });

    columns = [
      ...columns,
      ...monthColumns,
      ...this.restColumns,
    ];
    this.columns = columns;

    console.log('columns', this.columns);
  }

  query() {
    super.query();
    this.renderColumns();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      businessUnitCode: null,
      plantCode: null,
      dieCode: null,
      involveItem: null,
    };
  }

  commonQuery() {
    const params = this.getQueryParams();
  //   const testParams = {
  //     "attribute1": "",
  //     "attribute2": "",
  //     "attribute3": "",
  //     "attribute4": "",
  //     "attribute5": "",
  //     "beginMonth": "",
  //     "cavityNum": 0,
  //     "createdBy": "",
  //     "creationDate": "",
  //     "dailyList": [],
  //     "dayProductionNum": 0,
  //     "descriptions": "",
  //     "dieFactory": "",
  //     "dieOwner": "",
  //     "enableFlag": "",
  //     "endMonth": "",
  //     "id": "",
  //     "inspectionDate": "",
  //     "involveItem": "",
  //     "involveItems": [],
  //     "lastUpdateDate": "",
  //     "lastUpdatedBy": "",
  //     "machineCategory": "",
  //     "moldingCycle": 0,
  //     "monthList": [],
  //     "mouldCode": "",
  //     "mouldGroupCode": "",
  //     "mouldQty": 0,
  //     "mouldStatus": "",
  //     "mouldType": "",
  //     "multiMouldFlag": "",
  //     "pageNum": 0,
  //     "pageSize": 0,
  //     "plantCode": "",
  //     "productCategory": "",
  //     "productPlatform": "",
  //     "tonnage": "",
  //     "uph": 0,
  //     "usedLife": ""
  // };
    this.queryService.getData(params).subscribe(res => {
      const data = res.data && res.data.records && Array.isArray(res.data.records) ? res.data.records : [];
      const total = res.data && res.data.total ? res.data.total : 0;
      this.gridData = this.createData(data);
      this.view = {
        data: this.gridData,
        total: total,
      };
      this.initGridWidth();
      setTimeout(() => {
        this.setLoading(false);
      });
    });
  }

  createData(data: any[] = []): any[] {
    const result = deepCopy(data);
    return result;
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
