import { Component, OnInit, ViewChild, } from "@angular/core";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonQueryService } from "app/modules/generated_module/services/common-query.service";
import { NzMessageService } from "ng-zorro-antd";
import { SummartBlockComponent } from "./echart-components/summary-block.component";
import { QueryService } from "./query.service";

@Component({
  selector: 'order-progress-warning',
  templateUrl: './order-progress-warning.component.html',
  styleUrls: ['./order-progress-warning.less'],
  providers: [QueryService]
})
export class OrderProgressWarningComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customer', { static: true }) customer: SummartBlockComponent;
  @ViewChild('area', { static: true }) area: SummartBlockComponent;
  @ViewChild('group', { static: true }) group: SummartBlockComponent;
  @ViewChild('factory', { static: true }) factory: SummartBlockComponent;

  selectRow: any;
  warnConditionName = ['', ''];
  warnDaysSummaryMap = {
    'CUSTOMER': {},
    'AREA': {},
    'GROUP': {},
    'FACTORY': {}
  };
  chartsLoading: Boolean = false;

  buCodeOptions: any[] = [];
  currentActiveBlock = 'CUSTOMER';

  lastQueryParams: any = {}; // 保存最后一次查询的参数，相同参数时不触发查询

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

  queryParams = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.buCodeOptions, }, },
      { field: 'periodMonth', title: '预警月份', ui: { type: UiType.monthPicker, }, },
    ],
    values: {
      businessUnitCode: null,
      periodMonth: new Date(),
      warnDimension: '',
      warnProject: '',
      dimensionCode: '',
    }
  };

  dimensionColumns = [
    { field: 'dimensionCode', headerName: this.columnNames[this.currentActiveBlock].dimensionCodeName },
    { field: 'dimensionValue', headerName: this.columnNames[this.currentActiveBlock].dimensionValueName },
  ]
  progressColumns = [
    {
      field: 'orderProgress', headerName: this.warnConditionName[0],
      cellClass: (params) => {
        if (Number(params.data.totalWarnDays) > 0) {
          return 'bg-red';
        }
      },
      valueFormatter: 'ctx.setProgress(value)'
    },
    {
      field: 'transferProgress', headerName: this.warnConditionName[1],
      valueFormatter: 'ctx.setProgress(value)'
    },
  ]
  columns = [
    { field: 'businessUnit', headerName: '事业部' },
    ...this.dimensionColumns,
    { field: 'warnProjectDesc', headerName: '预警项' },
    { field: 'warnConditionDesc', headerName: '预警条件' },
    { field: 'warnDeviation', headerName: '预警偏差' },
    ...this.progressColumns,
    {
      field: 'totalWarnDays', headerName: '连续预警天数',
      cellClass: (params) => {
        if (Number(params.data.totalWarnDays) > Number(params.data.warnUpgradeDays)) {
          return 'bg-red';
        }
      },
    },

  ];
  setProgress(value) {
    return value + (this.warnConditionName[0].indexOf('进度') !== -1 ? '%' : '');
  }

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

  ngOnInit() {
    this.queryParams.values.warnDimension = this.currentActiveBlock;
    this.query();
    this.loadOptions();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  resetColumn(type: string) {
    switch (type) {
      case 'dimension':
        this.dimensionColumns[0].headerName = this.columnNames[this.currentActiveBlock].dimensionCodeName;
        this.dimensionColumns[1].headerName = this.columnNames[this.currentActiveBlock].dimensionValueName;
        break;
      case 'progress':
        this.progressColumns[0].headerName = this.warnConditionName[0];
        this.progressColumns[1].headerName = this.warnConditionName[1];
        break;
      default:
        break;
    }
    if (this.context.gridApi) {
      this.context.gridApi.setColumnDefs(this.columns);
    }
  }

  httpAction = { url: this.queryService.queryUrl, method: 'POST' };
  queryCommon() {
    let params: any = this.getQueryParams();
    Object.assign(params, this.getBlockParams());
    console.log('lastQueryParams',this.lastQueryParams);
    console.log('params',params);
    if(!this.equalsObject(params, this.lastQueryParams)) {
      this.getWarnDaysSummary();
      this.queryService.loadGridView(
        this.httpAction,
        params,
        this.context,
        this.dataPreFilter
      );
      setTimeout(() => {
        if (this.context.gridApi) {
          const firstNode = this.context.gridApi.getRowNode('0')
          if(firstNode) {
            firstNode.setSelected(true);
          }
        }
      }, 100);
      this.lastQueryParams = Object.assign({}, params);
    }
  }

  equalsObject(obj1, obj2) {
    if(JSON.stringify(obj1) === JSON.stringify(obj2)) {
      return true;
    }
    return false;
  }

  dataPreFilter = (res) => {
    const list = res.data.content;
    if (list.length) {
      const nameArr = list[0].warnConditionDesc.split(/[<|>]/);
      this.warnConditionName[0] = nameArr[0];
      this.warnConditionName[1] = nameArr[1];
      // 默认选择第一个
      this.selectRow = list[0];
      // 高亮第一行
    } else {
      this.warnConditionName[0] = '';
      this.warnConditionName[1] = '';
      this.selectRow = undefined;
    }
    console.log('nameArr',this.warnConditionName[0],this.warnConditionName[1])
    this.resetColumn('progress');
    return res;
  }

  getQueryParams() {
    return {
      businessUnitCode: this.queryParams.values.businessUnitCode,
      periodMonth: this.queryService.formatDateTime2(this.queryParams.values.periodMonth, 'yyyy-MM'),
      warnDimension: this.queryParams.values.warnDimension,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  getBlockParams() {
    let blockParams: any = {};
    switch (this.currentActiveBlock) {
      case 'CUSTOMER':
        blockParams = this.customer.queryParams;
        break;
      case 'AREA':
        blockParams = this.area.queryParams;
        break;
      case 'GROUP':
        blockParams = this.group.queryParams;
        break;
      case 'FACTORY':
        blockParams = this.factory.queryParams;
        break;
      default:
        break;
    }
    blockParams = {
      warnProject: blockParams.warnProject || '',
      dimensionCode: blockParams.dimensionCode || '',
      dimensionValue: blockParams.dimensionValue || '',
    }
    console.log('blockParams');
    console.log(blockParams);
    return blockParams;
  }

  handleProjectChange(type) {
    this.changeCurrentBlock(type);
    this.query();
  }
  handleBlockChange(type) {
    this.changeCurrentBlock(type);
    this.query();
  }

  changeCurrentBlock(type: string) {
    this.currentActiveBlock = type;
    this.queryParams.values.warnDimension = type;
    this.resetColumn('dimension');
  }

  // 加载搜索项
  loadOptions() {
    this.getBuCodeOptions();
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
      if (this.buCodeOptions.length) {
        this.queryParams.values.businessUnitCode = this.buCodeOptions[0].value;
      } else {
        this.queryParams.values.businessUnitCode = null;
      }
    });
  }

  clear() {
    super.clear();
    if (this.buCodeOptions.length) {
      this.queryParams.values.businessUnitCode = this.buCodeOptions[0].value;
    } else {
      this.queryParams.values.businessUnitCode = null;
    }
    this.queryParams.values.periodMonth = new Date();
  }

  getWarnDaysSummary() {
    this.initWarnDaysSummary();
    const params = this.getQueryParams();
    this.queryService.getWarnDaysSummary({
      businessUnitCode: params.businessUnitCode,
      periodMonth: params.periodMonth,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }).subscribe(res => {
      if (res.code === 200) {
        res.data.forEach(di => {
          if (!this.warnDaysSummaryMap[di.warnDimension][di.warnProject]) {
            Object.assign(this.warnDaysSummaryMap[di.warnDimension], {
              [di.warnProject]: {
                xAxis: [],
                data: []
              }
            });
          }
          // 赋值
          const map = this.warnDaysSummaryMap[di.warnDimension][di.warnProject];
          map.xAxis.push(di.totalWarnDays);
          map.data.push(di.dimensionQty);
        });
        this.initChart();
        this.chartsLoading = true;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  initChart() {
    this.customer.initChartsView(this.warnDaysSummaryMap.CUSTOMER);
    this.area.initChartsView(this.warnDaysSummaryMap.AREA);
    this.factory.initChartsView(this.warnDaysSummaryMap.FACTORY);
    this.group.initChartsView(this.warnDaysSummaryMap.GROUP);
  }

  initWarnDaysSummary() {
    this.warnDaysSummaryMap = {
      'CUSTOMER': {},
      'AREA': {},
      'GROUP': {},
      'FACTORY': {}
    };
    this.chartsLoading = false;
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

  onCellClicked(params) {
    this.context.gridApi.deselectAll();
    params.node.setSelected(true);
    this.selectRow = params.data;
  }
}
