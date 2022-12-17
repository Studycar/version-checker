import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild, ElementRef } from "@angular/core";
import { QueryService } from "../query.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService } from "ng-zorro-antd";
import { GridDataResult } from "@progress/kendo-angular-grid";
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';

@Component({
  selector: 'summary-block',
  template: `
    <div class="summary-wrapper">
      <div class="header">
        <div nz-row>
          <div nz-col nzSpan="10">
            <nz-select nzShowSearch [(ngModel)]="queryParams.warnProject" name="warnProject" required (ngModelChange)="onProjectChange($event)">
              <nz-option *ngFor="let option of warnProjectOptions" [nzLabel]="option.label" [nzValue]="option.value">
              </nz-option>
            </nz-select>
          </div>
          <div nz-col nzSpan="4" class="header-title">{{ qCode('SOP_WARN_DIMENSION',type) }}</div>
          <div nz-col nzSpan="10" [ngSwitch]="type">
            <popup-select *ngSwitchCase="'CUSTOMER'" [Value]="queryParams.dimensionCode" [Text]="queryParams.dimensionValue" [ValueField]="'customerNumber'"
              [TextField]="'customerName'" [gridView]="gridViewCustomers" [placeHolder]="'客户编码'"
              [columns]="columnsCustomers" (TextChanged)="onTextChanged($event)" (SearchEvent)="searchCustomers($event)" (RowSelect)="onRowSelect($event)">
            </popup-select>
            <nz-select *ngSwitchCase="'AREA'"  nzShowSearch nzAllowClear [(ngModel)]="queryParams.dimensionCode"
              name="dimensionCode" nzPlaceHolder="营销中心" (ngModelChange)="onFilterChange($event)">
              <nz-option *ngFor="let option of areaOptions" [nzLabel]="option.label" [nzValue]="option.value">
              </nz-option>
            </nz-select>
            <nz-select *ngSwitchCase="'GROUP'"  nzShowSearch nzAllowClear [(ngModel)]="queryParams.dimensionCode"
              name="dimensionCode" nzPlaceHolder="营销小类" (ngModelChange)="onFilterChange($event)">
              <nz-option *ngFor="let option of salesCategorySubOptions" [nzLabel]="option.label" [nzValue]="option.value">
              </nz-option>
            </nz-select>
            <popup-select *ngSwitchCase="'FACTORY'" [Value]="queryParams.dimensionCode" [Text]="queryParams.dimensionCode" [ValueField]="'itemCode'"
              [TextField]="'itemCode'" [gridView]="gridViewItems" [placeHolder]="'物料编码'"
              [columns]="columnsItems" (TextChanged)="onTextChanged($event)" (SearchEvent)="searchItems($event)" (RowSelect)="onRowSelect($event)">
            </popup-select>
          </div>
        </div>
      </div>
      <div class="charts">
        <div style="width: 100%;height: 100%" echarts [options]="myChart"></div>
      </div>
    </div>
  `,
  styles: [`
    .summary-wrapper {
      height: 100%;
      padding: 5px;
    }
    .summary-wrapper .header {
      height: 28px;
    }
    .summary-wrapper .charts {
      height: calc(100% - 38px);
      cursor: pointer;
    }
    .header-title {
      font-size: 13px;
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `],
  providers: [QueryService],
})
export class SummartBlockComponent implements OnInit, OnChanges {

  @Input() type: string;
  @Input() chartsData: Object;
  @Input() chartsLoading: Boolean;

  warnProjectOptions: any[] = [];
  warnDimensionOptions: any[] = [];
  areaOptions: any[] = [];
  salesCategorySubOptions: any[] = [];
  queryParams = {
    warnProject: null,
    dimensionCode: null,
    dimensionValue: null
  };

  myChart: EChartOption;

  columnNames = {
    'CUSTOMER': {
      dimensionCodeName: '客户编码',
      dimensionValueName: '客户名称'
    },
    'AREA': {
      dimensionCodeName: '中心编码',
      dimensionValueName: '中心名称'
    },
    'GROUP': {
      dimensionCodeName: '营销大类',
      dimensionValueName: '营销小类'
    },
    'FACTORY': {
      dimensionCodeName: '产品编码',
      dimensionValueName: '产品名称'
    }
  };

  // 客户
  gridViewCustomers: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsCustomers: any[] = [
    {
      field: 'customerNumber',
      title: '客户编码',
      width: '100',
    },
    {
      field: 'customerName',
      title: '客户名称',
      width: '100',
    },
  ];

  // 商品编码
  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '商品编码',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '商品名称',
      width: '100',
    },
  ];

  constructor(
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private queryService: QueryService,
  ) {
  }

  ngOnInit() {
    this.loadOptions();
    if (this.warnProjectOptions && this.warnProjectOptions.length) {
      this.queryParams.warnProject = this.warnProjectOptions[0].value;
    }
    this.initChartsView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('type',this.type);
    // console.log('changes---',changes);
    // // this.chartsData = changes.data.currentValue;
    // console.log('chartData', changes['chartsData']);
    // this.initChartsView();
  }

  initChartsView(chartData?: any) {
    const chartsData = chartData === undefined ? this.chartsData : chartData;
    console.log('chartData', chartsData)
    let option = {};
    let cData = {
      xAxis: [],
      data: []
    };
    if (chartsData[this.queryParams.warnProject]) {
      cData = chartsData[this.queryParams.warnProject];
    }
    const maxData = Math.max(...cData.data);
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top: '10%',
        left: '8%',
        right: '5%',
        bottom: '12%'
      },
      xAxis: [
        {
          type: 'category',
          data: cData.xAxis,
          name: '连续预\n警天数',
          nameTextStyle: {
            padding: [0, 0, -28, -45],
            verticalAlign: 'bottom',
            lineHeight: 12,
            fontSize: 10
          },
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: maxData > 5
        ? {
          type: 'value'
        }
        : {
          type: 'value',
          min: 0,
          max: 5
        },
      series: [
        {
          name: '汇总',
          type: 'bar',
          barMaxWidth: '40',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ]
            )
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ]
              )
            }
          },
          data: cData.data
        }
      ]
    };
    this.myChart = option;
  }

  loadOptions() {
    this.loadWarnDimensions();
    this.loadWarnProjects();
    if(this.type === 'AREA') {
      this.getAreaOptions();
    } else if(this.type === 'GROUP') {
      this.getSalesCategorySubOptions();
    }
  }

  loadWarnDimensions() {
    this.queryService.GetLookupByTypeRef('SOP_WARN_DIMENSION', this.warnDimensionOptions);
  }

  loadWarnProjects() {
    const code = 'SOP_WARN_PROJECT_' + this.type;
    this.queryService.GetLookupByTypeLang(code, '').subscribe(res => {
      this.warnProjectOptions.length = 0;
      res.Extra.forEach(d => {
        this.warnProjectOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        })
      })
      if(this.warnProjectOptions.length) {
        this.queryParams.warnProject = this.warnProjectOptions[0].value;
      }
    })

  }

  // 获取营销中心列表
  getAreaOptions() {
    this.areaOptions.length = 0;
    this.queryService.getAreaOptions().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.areaOptions.push({
          label: item.areaName,
          value: item.areaCode,
        });
      });
    });
  }

  // 获取营销小类
  getSalesCategorySubOptions() {
    const params = {};
    this.salesCategorySubOptions.length = 0;
    this.queryService.getSalesCategorySubOptions(params).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.salesCategorySubOptions.push({
          label: item.description,
          value: item.lookupCode,
        });
      });
    });
  }

  // 搜索客户
  searchCustomers(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadCustomers(e.SearchValue, PageIndex, e.PageSize);
  }

  public loadCustomers(keyword: string, PageIndex: number, PageSize: number) {
    const params = {
      customerShortName: keyword,
      pageIndex: PageIndex,
      pageSize: PageSize,
      enableFlag: 'A',
    };
    this.queryService.getCustomersOptions(params).subscribe(res => {
      console.log('loadCustomer', res);
      this.gridViewCustomers.data = res.data.content;
      this.gridViewCustomers.total = res.data.totalElements;
    });
  }

  searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(e.SearchValue, PageIndex, e.PageSize);
  }

  // 搜索商品
  public loadItems(keyword: string, PageIndex: number, PageSize: number) {
    const params = {};
    this.queryService.getItems(keyword || '', PageIndex, PageSize, params).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }

  qCode(code, value) {
    let options = [];
    switch (code) {
      case 'SOP_WARN_DIMENSION':
        options = this.warnDimensionOptions;
        break;

      default:
        break;
    }
    let option = options.find(o => o.value === value);
    if (!option) {
      option = { label: '', value: '' };
    }
    return option.label;
  }

  @Output() onProjectChangeEvent = new EventEmitter<string>();
  @Output() onFilterChangeEvent = new EventEmitter<string>();
  onProjectChange(val) {
    this.onProjectChangeEvent.emit(this.type);
    this.initChartsView();
  }

  onFilterChange(val) {
    this.onFilterChangeEvent.emit(this.type);
  }

  onTextChanged(event: any) {

  }

  onSearch(event: any) {

  }

  onRowSelect({Value,Text}) {
    this.queryParams.dimensionCode = Value;
    this.queryParams.dimensionValue = Text;
    this.onFilterChangeEvent.emit(this.type);
  }
}
