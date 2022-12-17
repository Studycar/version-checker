import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { EChartOption } from 'echarts';
import * as moment from 'moment';
import { process } from '@progress/kendo-data-query';
import { BookUpEchartComponent } from './echarts-component/bookup.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { BaseEchartComponent } from './echarts-component/base.component';
import { FactoryEchartComponent } from './echarts-component/factory.component';
import { QualifiedRateEchartComponent } from './echarts-component/qualified-rate.component';

@Component({
  selector: 'psi-data-show',
  templateUrl: './psi-data-show.component.html',
  styleUrls: ['./psi-data-show.less'],
  providers: [QueryService]
})
export class PsiDataShowComponent extends CustomBaseContext implements OnInit {
  @ViewChild('bookup', { static: false }) bookup: BookUpEchartComponent;
  @ViewChild('base', { static: false }) base: BaseEchartComponent;
  @ViewChild('factory', { static: false }) factory: FactoryEchartComponent;
  @ViewChild('qualifiedRate', { static: false }) qualifiedRate: QualifiedRateEchartComponent;

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

  now: Date;
  timer; // 计时器

  factorySubTitle = '';
  baseSubTitle = '';
  mainDate = moment().subtract(1, 'months').format('YYYY年MM月');
  continuedTime = '累计时间段';

  factoryInventoryNow: any = { count: 0 }; // 工厂每日初始库存
  factoryInventoryThreshold: any = [{ thresholdValue: 0 }]; // 9.工厂库存阈值
  baseInventoryNow: any = { count: 0 }; // 基地每日初始库存
  baseInventoryThreshold: any = [{ thresholdValue: 0 }]; // 10.基地库存阈值
  factoryList = []; // 1.生产
  centerList = []; // 2.中转
  straightList = []; // 3.直发
  factoryInventoryList = []; // 4.工厂库存
  baseShipmentList = []; // 5.基地出货
  baseInventoryList = []; // 6.基地库存
  outPlusList = []; // 7.总出货
  inventoryPlusList = []; // 8.总库存
  inventoryPlusNow: any; // 总库存每日初始值
  inventoryThreshold: any; // 11.基地+工厂总阈值
  sopPlantQualifiedList = [];

  buCodeOptions: any[] = [];
  categoryOptions: any[] = [];
  plantOptions: any[] = [];
  baseList: any[] = [];
  typeOptions = [
    { label: '工厂', value: 'PLANT' },
    { label: '基地', value: 'BASE' },
  ]

  chartOption_1: EChartOption;

  queryParams = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.buCodeOptions, eventNo: 1, }, required: true, },
      { field: 'type', title: '类型', ui: { type: UiType.select, options: this.typeOptions, eventNo: 2, }, required: true, },
      { field: 'typeValue', title: '类型值', ui: { type: UiType.select, options: this.plantOptions, }, required: true, },
      { field: 'marketCategory', title: '品类', ui: { type: UiType.selectMultiple, options: this.categoryOptions, hidden: false }, },
    ],
    values: {
      businessUnitCode: null,
      type: 'PLANT',
      typeValue: null,
      marketCategory: [],
    }
  };

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.now = new Date();
    }, 1000); // 初始化计时器
    this.factorySubTitle = '数据每晚12点更新，工厂初期库存' + (this.factoryInventoryNow.count || 0) + '，工厂阈值' +
      ((this.factoryInventoryThreshold.length && this.factoryInventoryThreshold[0].thresholdValue) || 0);
    this.baseSubTitle = `数据每晚12点更新，基地初期库存${this.baseInventoryNow.count || 0}，基地阈值${(this.baseInventoryThreshold && this.baseInventoryThreshold[0].thresholdValue) || 0}`;
    this.loadOptions();
    this.query();
  }

  // 加载搜索项
  loadOptions() {
    this.getBuCodeOptions();
    this.getOrganizationOptions();
    this.getBase();
    this.getCategoryOptions();
    this.getQualifiedRateList();
  }

  // 获取事业部列表
  getBuCodeOptions() {
    this.buCodeOptions.length = 0;
    this.queryService.getScheduleRegion().subscribe(res => {
      res.data.forEach(d => {
        this.buCodeOptions.push({
          label: d.descriptions,
          value: d.scheduleRegionCode
        })
      });
      // if(this.buCodeOptions.length) {
      //   this.queryParams.values.businessUnitCode = this.buCodeOptions[0].value;
      //   this.getOrganizationOptions();
      // }
    });
  }

  buCodeOptionsChange(value) {
    this.queryParams.values.typeValue = null;
    this.getOrganizationOptions();
    this.getBase();
    this.queryParams.values.marketCategory = [];
    this.getCategoryOptions();
    this.getQualifiedRateList();
  }

  getOrganizationOptions() {
    const params = this.getQueryParams();
    this.plantOptions.length = 0;
    this.queryService.getPlant(params).subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.descriptions,
          value: d.plantCode,
        })
      })
      // if(this.queryParams.values.type === 'PLANT' && this.plantOptions.length) {
      //   this.queryParams.values.typeValue = this.plantOptions[0].value;
      // }
      // this.query();
    })
  }

  getBase() {
    this.baseList.length = 0;
    this.queryService.getBase({
      businessUnitCode: this.queryParams.values.businessUnitCode
    }).subscribe(res => {
      res.data.forEach(d => {
        this.baseList.push({
          label: d.plantCode,
          value: d.plantCode,
        })
      })
    })
  }

  // 获取品类列表
  getCategoryOptions() {
    const params = this.getQueryParams();
    this.categoryOptions.length = 0;
    this.queryService.getCategoryOptions(params.businessUnitCode).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      const marketCategory = Array.from(new Set(data.filter(item => item.marketCategory).map(item => item.marketCategory)));
      marketCategory.forEach(item => {
        this.categoryOptions.push({
          label: item,
          value: item,
        });
      });
    });
  }

  typeChange(event: any) {
    this.queryParams.values.typeValue = null;
    const type = this.queryParams.values.type;
    this.queryParams.defines.forEach(param => {
      if (param.field === 'typeValue') {
        // 切换工厂对应得类型值
        if (type === 'PLANT') {
          param.ui.options = this.plantOptions;
        } else {
          param.ui.options = this.baseList;
        }
      } else if(param.field === 'marketCategory') {
        param.ui.hidden = type === 'BASE';
      }
    })
  }

  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if (isExport) {
      params.isExport = true;
    } else {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    if (params.marketCategory && params.marketCategory.length) {
      params.marketCategory = params.marketCategory.join(',');
    } else {
      params.marketCategory = '';
    }
    params.businessUnitCode = params.businessUnitCode || '';
    console.log('getQueryParams', params);
    return params;
  }

  query() {
    super.query();
    this.queryCommon();
  }

  columns = [
    { field: 'attribute15', headerName: '产品型号', width: 120 },
    { field: 'outputQty', headerName: '产量', width: 120 },
    { field: 'unqualifiedQuantity', headerName: '不合格数量', width: 120 },
    { field: 'qualificationRate', headerName: '合格率', width: 120 }
  ];
  queryCommon() {
    this.getQualifiedRateList();
    this.getEchartsData();
    this.getPlantQualifiedRateList();
    this.getList();
    this.getItemCount();
  }

  getEchartsData() {
    const plantCode = this.queryParams.values.type === 'PLANT' ? this.queryParams.values.typeValue : '';
    const invCode = this.queryParams.values.type === 'BASE' ? this.queryParams.values.typeValue : '';
    this.queryService.getSopWarningVersionList(
      plantCode, invCode).subscribe(res => {
        if (res.data && res.data.length) {
          this.factoryList = this.newList('1', res.data);
          this.centerList = this.newList('2', res.data);
          this.straightList = this.newList('3', res.data);
          this.factoryInventoryList = this.newList('4', res.data);
          this.baseShipmentList = this.newList('5', res.data);
          this.baseInventoryList = this.newList('6', res.data);
          this.factoryInventoryNow = this.isSomeTime(this.newList('4', res.data));
          this.baseInventoryNow = this.isSomeTime(this.newList('6', res.data));
          this.outPlusList = this.newList('7', res.data);
          this.inventoryPlusList = this.newList('8', res.data);
          this.inventoryPlusNow = this.isSomeTime(this.newList('8', res.data));
        }
      })
  }

  newList(type: string, list: any[]) {
    const array = [];
    list.forEach((item) => {
      if (item.type === type) {
        array.push(item);
      }
    });
    array.sort(function (a, b) {
      return b.createTime < a.createTime ? -1 : 1;
    });
    return array;
  }

  isSomeTime(list) {
    let obj = {};
    list.forEach((item) => {
      if (moment(item.countDate).isSame(moment(), 'day')) {
        obj = item;
      }
    });
    return obj;
  }

  newThresholdList(type, list) {
    const array = [];
    let obj = {};
    list.forEach((item) => {
      if (item.type === type) {
        obj = item;
      }
      if (type === 'TOTAL') {
        obj = item;
      }
    });
    for (let index = 0; index < 7; index++) {
      array.push(obj);
    }
    return array;
  }

  // 获取阈值数据
  getList() {
    this.queryService.getTableList(
      this.queryParams.values.type,
      this.queryParams.values.typeValue).subscribe(res => {
        this.factoryInventoryThreshold = this.newThresholdList('PLANT', res.data);
        this.baseInventoryThreshold = this.newThresholdList('BASE', res.data);
        this.inventoryThreshold = this.newThresholdList('TOTAL', res.data);
        this.factorySubTitle = '数据每晚12点更新，工厂初期库存' + (this.factoryInventoryNow.count || 0) + '，工厂阈值' +
          ((this.factoryInventoryThreshold.length && this.factoryInventoryThreshold[0].thresholdValue) || 0);
        this.baseSubTitle = `数据每晚12点更新，基地初期库存${this.baseInventoryNow.count || 0}，基地阈值${(this.baseInventoryThreshold && this.baseInventoryThreshold[0].thresholdValue) || 0}`;
        if(this.queryParams.values.type == 'PLANT') {
          this.initChart('factory');
        }else {
          this.initChart('base');
        }
      })
  }

  // 获取事业部下各工厂月度数据
  getQualifiedRateList() {
    this.queryService.getSopPlantQualifiedRateList(this.queryParams.values.businessUnitCode).subscribe(res => {
      this.sopPlantQualifiedList = res.data || [];
      if(this.queryParams.values.type == 'PLANT') {
        this.initChart('bookup');
      }
    })
  }

  initChart(type) {
    switch (type) {
      case 'bookup':
        this.bookup.initEchartsView([this.sopPlantQualifiedList]);
        break;
      case 'base':
        this.base.initEchartsView([
          this.baseShipmentList, this.baseInventoryList, this.baseInventoryThreshold]);
        break;
      case 'factory':
        this.factory.initEchartsView([
          this.factoryList, this.centerList, this.straightList, this.factoryInventoryList, this.factoryInventoryThreshold]);
        break;
      case 'qualifiedRate':
        this.qualifiedRate.initEchartsView([this.itemQualifiedRateList]);
        break;
      default:
        break;
    }
  }

  itemQualifiedRateList = [];
  // 获取工厂入库合格率
  getPlantQualifiedRateList() {
    const params = this.getQueryParams();
    const plantCode = params.typeValue;
    const divisionValue = params.marketCategory;
    this.queryService.getItemQualifiedRateList(plantCode, divisionValue).subscribe(res => {
      this.itemQualifiedRateList = res.data || [];
      if(this.queryParams.values.type == 'PLANT') {
        this.initChart('qualifiedRate');
      }
    })
  }

  itemQualifiedRateCount = {
    list: [],
    endMonth: '',
    descriptions: '',
    beginMonth: ''
  }

  // 获取不合格率数据
  getItemCount() {
    const plantCode = this.queryParams.values.typeValue;
    this.queryService.getItemQualifiedRateCount(plantCode).subscribe(res => {
      this.itemQualifiedRateCount = res.data || [];
      if(res.data) {
        const beginMonth = this.queryService.formatDateTime2(this.itemQualifiedRateCount.beginMonth,'yyyy-MM');
        const endMonth = this.queryService.formatDateTime2(this.itemQualifiedRateCount.endMonth,'yyyy-MM');
        this.continuedTime = `累计时间段（${beginMonth} ~ ${endMonth}）`;
        const data = res.data.list;
        const total = res.data && res.data.totalElements ? res.data.totalElements : 0;
        this.context.gridData = data;
        this.context.view = {
          data: process(data, {
            sort: this.context.gridState.sort,
            skip: 0,
            take: this.context.gridState.take,
            filter: this.context.gridState.filter,
          }).data,
          total: total,
        };
      }
      this.initGridWidth();
      this.setLoading(false);
    })
  }

  sheetName = '';
  // 下载报表
  downLoad = (type) => {
    let params = {};
    switch (type) {
      case 'factory':
        params = { types: [1, 2, 3, 4], sheetName: '工厂数据报表' };
        this.sheetName = '工厂数据报表';
        break;
      case 'base':
        params = { types: [1, 5, 6], sheetName: '基地数据报表' };
        this.sheetName = '基地数据报表';
        break;
      case 'baseAndFactory':
        params = { types: [1, 7, 8], sheetName: '工厂+基地数据报表' };
        this.sheetName = '工厂+基地数据报表';
        break;
      default:
        break;
    }
    this.export(params);
    // this.queryService.downLoad({
    //   baseUrl: '',
    //   url: '/api/sop/sys/sopWarningVersion/export',
    //   params,
    // });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  expChartColumns = [
    { field: 'versionNum', title: '序号', width: 120 },
    { field: 'dataType', title: '工厂ID', width: 120 },
    { field: 'type', title: '类型', width: 120 },
    { field: 'countDate', title: '数据时间', width: 120 },
    { field: 'quantity', title: '数量', width: 120 },
  ];
  // 1生产、2中转、3直发、4工厂库存、5基地出货、6基地库存、7总出货、8总库存，0默认
  expTypeOptions = [
    { label: '生产', value: '1' },
    { label: '中转', value: '2' },
    { label: '直发', value: '3' },
    { label: '工厂库存', value: '4' },
    { label: '基地出货', value: '5' },
    { label: '基地库存', value: '6' },
    { label: '总出货', value: '7' },
    { label: '总库存', value: '8' },
    { label: '默认', value: '0' },
  ]
  expChartColumnsOptions = [
    { field: 'type', options: this.expTypeOptions },
  ]
  export(params) {
    this.queryService.downLoad(params).subscribe(res => {
      let data: any[] = res;
      // excelexport.export((<any>res).Extra);
      setTimeout(() => {
        this.excelexport.export(data); // (<any>res).data);
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }

  clear() {
    super.clear();
    this.queryParams.values.marketCategory = [];
  }
}
