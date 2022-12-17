import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { deepCopy } from '@delon/util';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { ProductSellBalanceSopForecastVersionDetailComponent } from './detail/detail.component';
import { VersionQueryService } from './queryService';
import { ProductSellBalanceSopForecastVersionSendComponent } from './send/sendl.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopforecastversion',
  templateUrl: './sopforecastversion.component.html',
  providers: [VersionQueryService],
  styles: [`
    .EChart-box {
      display: flex;
      width: 100%;
    }

    .EChart-box .left {
      flex: 1;
    }

    .EChart-box .right {
      flex: 2;
    }
  `],
})
export class ProductSellBalanceSopForecastVersionComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  selectBy = 'versionCode';
  regionOptions = [];
  now = new Date();
  /**查询参数定义 */
  public queryParams = {
    defines: [
      {
        field: 'businessUnitCode',
        title: '事业部',
        required: true,
        ui: { type: UiType.select, options: this.regionOptions },
      },
      { field: 'demandDate', title: '周期', required: true, ui: { type: UiType.date } },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      demandDate: this.now,
    },
  };
  fixColumns = [
    {
      colId: 0, field: '', headerName: '操作', width: 60, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'businessUnitCode',
      headerName: '事业部',
      width: 120,
    },
    {
      field: 'demandPeriod',
      headerName: '需求周期',
      width: 120,
    },
    {
      field: 'versionCode',
      headerName: '版本',
      width: 120,
    },
  ];

  dateColumns = [
    { field: 'XSJH', headerName: '销售计划', width: 100 },
    { field: 'SCJH', headerName: '生产计划', width: 100 },
    { field: 'QMKC', headerName: '期末库存', width: 100 },
    { field: 'XSE', headerName: '销售额', width: 100 },
    { field: 'SCCB', headerName: '生产成本', width: 100 },
    { field: 'ML', headerName: '毛利', width: 100 },
    { field: 'KCJE', headerName: '库存金额', width: 100 },
  ];
  columns = [
    ...this.fixColumns,
  ];

  /**构造函数 */
  constructor(
    public pro: BrandService,
    private msgSrv: NzMessageService,
    private confirmationService: NzModalService,
    public queryService: VersionQueryService,
    private modal: ModalHelper,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private injector: Injector) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService, injector });
    this.headerNameTranslate(this.columns);
  }

  /**页面初始化 */
  ngOnInit() {
    this.fixColumns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadInitData();
    // this.query();
  }

  // 加载初始化数据
  private loadInitData() {
    /**加载事业部和工厂 */
    this.regionOptions.length = 0;
    this.queryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(item => {
        this.regionOptions.push({
          label: item.scheduleRegionCode,
          value: item.scheduleRegionCode,
        });
      });
      this.clear();
    });
  }

  public query() {
    super.query(); // grid初始化
    this.queryCommon();
  }

  dateCells = [];
  private queryCommon() {
    this.setLoading(true);
    this.queryService.Query(this.GetqueryParams()).subscribe(result => {
      if (result != null) {
        this.dateCells = result.data.headerCellList;
        this.dealDateColumn();
        this.gridData = result.data.gridData;
        this.initChart(this.dateCells, this.gridData);
      }
      this.setLoading(false);
    });
  }

  expColumns = this.columns;
  groupCollection = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.excelexport.export(this.gridData);
  }

  // 版本明细
  detail(dataitem: any) {
    this.modal.static(ProductSellBalanceSopForecastVersionDetailComponent, {
      i: dataitem,
    }, 'xl').subscribe(() => {
    });
  }

  // 审核
  approval() {
    if (this.gridApi.getSelectedRows().length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要审批的版本记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要提交审批吗？'),
      nzOnOk: () => {
        const dtos = [];
        this.gridApi.getSelectedRows().forEach(el => {
          dtos.push({
            businessUnitCode: el.businessUnitCode,
            demandPeriod: el.demandPeriod,
            versionCode: el.versionCode,
          });
        });
        this.queryService.Approval(dtos).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('审批成功'));
            this.queryCommon();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  // 下达
  send() {
    if (this.gridApi.getSelectedRows().length !== 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先单选要下达的版本记录！'));
      return;
    }
    this.modal.static(ProductSellBalanceSopForecastVersionSendComponent,
      {
        i: this.gridApi.getSelectedRows()[0],
      }, 'md').subscribe(() => {
      });
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  /**重置事件 */
  public clear() {
    this.queryParams.values = {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      demandDate: this.now,
    };
  }

  // 处理日期动态列
  private dealDateColumn() {
    const queryGroupCollection = [];
    const exportGroupCollection = [];
    this.dateCells.forEach(date => {
      const groupColumn = {
        headerName: date,
        children: [],
      };
      const exportGroupColumn = {
        title: date,
        child: [],
      };
      this.dateColumns.forEach(col => {
        groupColumn.children.push({ field: col.field + date, headerName: col.headerName, width: col.width });
        exportGroupColumn.child.push({ field: col.field + date, title: col.headerName, width: col.width });
      });
      queryGroupCollection.push(groupColumn);
      exportGroupCollection.push(exportGroupColumn);
    });
    this.columns = [...this.fixColumns, ...queryGroupCollection];
    this.expColumns = [...this.fixColumns];
    this.convertExportColumns();
    this.groupCollection = exportGroupCollection;
  }

  // 处理导出列
  private convertExportColumns() {
    const columns = [];
    this.expColumns.forEach(x => {
      columns.push({
        field: x.field,
        title: x.headerName,
        width: x.width,
      });
    });
    this.expColumns = columns;
  }

  private GetqueryParams(): any {
    return {
      businessUnitCode: this.queryParams.values.businessUnitCode,
      demandDate: this.queryParams.values.demandDate,
      IsExport: true,
    };
  }

  option = {
    tooltip: {},
    legend: {
      type: 'scroll',
      data: ['版本1', '版本2', '版本3'],
    },
    radar: {
      // shape: 'circle',
      radius: '67%',
      indicator: [
        { name: '销售计划', max: 6500 },
        { name: '生产计划', max: 6500 },
        { name: '期末库存', max: 6500 },
        { name: '销售额', max: 16000 },
        { name: '生产成本', max: 30000 },
        { name: '毛利', max: 52000 },
        { name: '库存金额', max: 25000 },
      ],
    },
    series: [{
      name: '多版本雷达图',
      type: 'radar',
      data: [
        {
          value: [1700, 4000, 3100, 1600, 3200, 1000, 1300],
          name: '版本1',
          // lineStyle: { color: '#FBDA05' },
          // itemStyle: { color: '#FBDA05' },
        },
        {
          value: [4200, 1800, 1900, 3500, 3700, 1600, 1200],
          name: '版本2',
          // lineStyle: { color: '#2359FF' },
          // itemStyle: { color: '#2359FF' },
        },
        {
          value: [1200, 2500, 4300, 5300, 2200, 8100, 9000],
          name: '版本3',
          // lineStyle: { color: '#9278ab' },
          // itemStyle: { color: '#9278ab' },
        },
      ],
    }],
  };

  barOption = {
    title: {
      text: 'N1',
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '20%',
      bottom: '15%',
    },
    legend: {
      textStyle: {
        color: '#919CA3',
        fontSize: 12,
      },
      left: 'center',
      top: 20,
      itemWidth: 15,
      itemHeight: 12,
      itemGap: 20,
      padding: [5, 0],
      data: ['销售计划', '生产计划', '期末库存'],
    },
    xAxis: [
      {
        type: 'category',
        data: ['N1', 'N2', 'N3', 'N4', 'N5'],
        axisPointer: {
          type: 'shadow',
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#919CA3',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#919CA3',
        },
      },
      {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#919CA3',
          // formatter: '{value}%',
        },
      },
    ],
    series: [
      {
        name: '销售计划',
        type: 'bar',
        data: [1700, 4000, 3100, 1600, 3200],
      },
      {
        name: '生产计划',
        type: 'bar',
        data: [1700, 4000, 3100, 1600, 3200],
      },
      {
        name: '期末库存',
        type: 'bar',
        data: [1700, 4000, 3100, 1600, 3200],
      },
      {
        name: '销售计划折线',
        type: 'line',
        yAxisIndex: 1,
        data: [1700, 4000, 3100, 1600, 3200],
      },
      {
        name: '生产计划折线',
        type: 'line',
        yAxisIndex: 1,
        data: [1700, 4000, 3100, 1600, 3200],
      },
      {
        name: '期末库存折线',
        type: 'line',
        yAxisIndex: 1,
        data: [1700, 4000, 3100, 1600, 3200],
      },
    ],
  };

  chartData: Array<{ [key: string]: any }> = [];

  initChart(result: any[], extra: any[]) {
    if (extra.length === 0) return;
    this.chartData.length = 0;
    const versionCode: string[] = [];
    const seriesData: Array<{ [key: string]: any }> = [];
    let salesPlanMax = 0;
    let producePlanMax = 0;
    let endingInventoryMax = 0;
    let salesMax = 0;
    let costMax = 0;
    let profitMax = 0;
    let inventoryAmountMax = 0;
    extra.forEach(item => {
      salesPlanMax = Math.max(item['XSJH' + result[0]], salesPlanMax);
      producePlanMax = Math.max(item['SCJH' + result[0]], producePlanMax);
      endingInventoryMax = Math.max(item['QMKC' + result[0]], endingInventoryMax);
      salesMax = Math.max(item['XSE' + result[0]], salesMax);
      costMax = Math.max(item['SCCB' + result[0]], costMax);
      profitMax = Math.max(item['ML' + result[0]], profitMax);
      inventoryAmountMax = Math.max(item['KCJE' + result[0]], inventoryAmountMax);
      versionCode.push(item.VERSION_CODE);
      const value: number[] = [];
      this.dateColumns.forEach(d => {
        value.push(item[d.field + result[0]]);
      });
      seriesData.push({
        value: value,
        name: item.VERSION_CODE,
      });

      const options = deepCopy(this.barOption);
      const salesPlan: number[] = [];
      const producePlan: number[] = [];
      const endingInventory: number[] = [];
      options.title.text = item.VERSION_CODE;
      options.xAxis[0].data = result;
      result.forEach(n => {
        salesPlan.push(item['XSJH' + n]);
        producePlan.push(item['SCJH' + n]);
        endingInventory.push(item['QMKC' + n]);
      });
      options.series[0].data = salesPlan;
      options.series[1].data = producePlan;
      options.series[2].data = endingInventory;
      options.series[3].data = salesPlan;
      options.series[4].data = producePlan;
      options.series[5].data = endingInventory;
      this.chartData.push(options);
    });
    this.option.legend.data = versionCode;
    this.option.series[0].data = seriesData as any;
    this.option.radar.indicator[0].max = salesPlanMax;
    this.option.radar.indicator[1].max = producePlanMax;
    this.option.radar.indicator[2].max = endingInventoryMax;
    this.option.radar.indicator[3].max = salesMax;
    this.option.radar.indicator[4].max = costMax;
    this.option.radar.indicator[5].max = profitMax;
    this.option.radar.indicator[6].max = inventoryAmountMax;
    this.option = Object.assign({}, this.option);
  }
}
