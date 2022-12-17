import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { deepCopy } from '@delon/util';

import { CustomBaseContext, LookupItem } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { MessageManageService } from 'app/modules/generated_module/services/message-manage-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { SopDemandAnalysisdm } from 'app/modules/generated_module/services/sopdemandanalysisdm-service';
import { ProductSellBalanceForecastService } from '../product-sell-balance-forecast.service';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { HttpMethod } from 'app/modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-demand-analysis',
  templateUrl: './sop-demand-analysis.component.html',
  styleUrls: ['./sop-demand-analysis.component.css'],
  providers: [ProductSellBalanceForecastService],
})
export class SopDemandAnalysisComponent extends CustomBaseContext implements OnInit {
  public gridStateKey = 'sop-demand-analysis';
  public dimensionOptions: any[] = []; // 维度一、二、三、四
  public plantOptions: Set<any> = new Set(); // 工厂
  public businessUnitOptions: Set<any> = new Set(); // 事业单位
  public businessUnitOptionsExp: any[] = []; // 事业单位导出用
  public userPrivilage: any[] = []; // 用户的授权数据
  public salesTypeOptions: Set<LookupItem> = new Set<LookupItem>(); // 内外销
  public salesTypeOptionsArray: any[] = []; // 内外销网格用
  public salesTypeOptionsArrayExp: any[] = []; // 内外销导出用
  public exportFileName: String = '预测汇总分析-汇总'; // 导出的文件名
  

  public hasLoadData = false; // 标识是否已经加载了数据
  public currentSelectedTab = null; // 当前的tb页面
  public demandColumnPrefix = 'DEMAND'; // 需求列的前缀field前缀，N+1
  public sopDemandAnalysisResult = null; // 需求分析结果
  public echartsIntance = null; // echarts的实例

  public isMothWeek = '';

  // 统计区的工具栏
  public labelWidth = 80; // 宽度
  public columnCount = 3; // 列
  public statisticsBar_DivisionOptions = []; // 产品维度下拉选择
  public statisticsBar_MonthOptions = []; // 数值下拉选择
  public statisticsBar_GraphTypeOptions = [{ ID: 'bar', TEXT: '柱形图' }, { ID: 'line', TEXT: '线形图' }, { ID: 'pie', TEXT: '饼形图' }]; // 图形类型下拉选择
  public statisticsBar_Params = { Division: '', Month: '', GraphType: '' };
  public statistic_Data = {}; // 统计图的数据
  public statistic_DataOptions = {}; // echar的统计图的选项
  // echar折线/柱状图的配置选项
  public statistic_LineDataOptions = {
    title: {
      text: ''
    },
    tooltip: {},
    legend: {
      data: []
    },
    xAxis: {
      data: []
      // data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [{
      name: '需求量',
      type: 'bar',
      // data: [5, 20, 36, 10, 10, 20],
      data: []
    }]
  };
  // echar的饼图的配置选项
  public statistic_PieDataOptions = {
    title: {
      text: ''
    },
    tooltip: {},
    legend: {
      data: []
    },
    series: [{
      name: '需求量',
      type: 'pie',
      data: [],
      // data: [
      //   { value: 335, name: '直接访问' },
      //   { value: 310, name: '邮件营销' },
      //   { value: 274, name: '联盟广告' },
      //   { value: 235, name: '视频广告' },
      //   { value: 400, name: '搜索引擎' }]
    }]
  };

  public queryParams = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', required: true, ui: { type: UiType.select, options: this.businessUnitOptions, optionsLabel: 'descriptions', /*optionsLabel: 'scheduleRegionCode',*/  optionsValue: 'scheduleRegionCode', ngModelChange: this.onBusinessUnitCodeChange } },
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, optionsLabel: 'plantCode', optionsValue: 'plantCode' } },
      { field: 'salesType', title: '内外销', ui: { type: UiType.select, options: this.salesTypeOptions, optionsLabel: 'Text', optionsValue: 'Code'/*optionsValue: 'Code',*/ } },
      { field: 'demandDate', title: '日期', required: true, ui: { type: UiType.date, format: 'yyyy-MM-dd' } },
      {
        field: 'dimension1', title: '维度一', ui: {
          type: UiType.select, options: this.dimensionOptions, optionsLabel: 'divisionName', optionsValue: 'divisionName', ngModelChange: function (eventParams: any) {
            if (this.queryParams.values.dimension1 === undefined ||
              this.queryParams.values.dimension1 === null ||
              this.queryParams.values.dimension1 === '') {
              this.queryParams.values.dimension2 = null;
              this.queryParams.values.dimension3 = null;
              this.queryParams.values.dimension4 = null;
              return;
            }
            if (this.queryParams.values.dimension1 === this.queryParams.values.dimension2 ||
              this.queryParams.values.dimension1 === this.queryParams.values.dimension3 ||
              this.queryParams.values.dimension1 === this.queryParams.values.dimension4) {
              // 不知道为什么要这样写才能清空
              setTimeout(() => {
                this.queryParams.values.dimension1 = null;
                this.queryParams.values.dimension2 = null;
                this.queryParams.values.dimension3 = null;
                this.queryParams.values.dimension4 = null;
                this.queryParams.defines.find(it => it.field === 'dimension2').readonly = true;
                this.queryParams.defines.find(it => it.field === 'dimension3').readonly = true;
                this.queryParams.defines.find(it => it.field === 'dimension4').readonly = true;
              });
              this.msgSrv.warning(this.appTranslationService.translate('分析维度重复了！'));
            } else {
              this.queryParams.defines.find(it => it.field === 'dimension2').readonly = false;
            }
          }
        }
      },
      {
        field: 'dimension2', title: '维度二', readonly: true, ui: {
          type: UiType.select, options: this.dimensionOptions, optionsLabel: 'divisionName', optionsValue: 'divisionName', ngModelChange: function () {
            if (this.queryParams.values.dimension2 === undefined ||
              this.queryParams.values.dimension2 === null ||
              this.queryParams.values.dimension2 === '') {
              this.queryParams.values.dimension3 = null;
              this.queryParams.values.dimension4 = null;
              return;
            }
            if (this.queryParams.values.dimension2 === this.queryParams.values.dimension1 ||
              this.queryParams.values.dimension2 === this.queryParams.values.dimension3 ||
              this.queryParams.values.dimension2 === this.queryParams.values.dimension4) {
              setTimeout(() => {
                this.queryParams.values.dimension2 = null;
                this.queryParams.values.dimension3 = null;
                this.queryParams.values.dimension4 = null;
                this.queryParams.defines.find(it => it.field === 'dimension3').readonly = true;
                this.queryParams.defines.find(it => it.field === 'dimension4').readonly = true;
              });
              this.msgSrv.warning(this.appTranslationService.translate('分析维度重复了！'));
            } else {
              this.queryParams.defines.find(it => it.field === 'dimension3').readonly = false;
            }
          }
        }
      },
      {
        field: 'dimension3', title: '维度三', readonly: true, ui: {
          type: UiType.select, options: this.dimensionOptions, optionsLabel: 'divisionName', optionsValue: 'divisionName', ngModelChange: function () {
            if (this.queryParams.values.dimension3 === undefined ||
              this.queryParams.values.dimension3 === null ||
              this.queryParams.values.dimension3 === '') {
              this.queryParams.values.dimension4 = null;
              return;
            }
            if (this.queryParams.values.dimension3 === this.queryParams.values.dimension1 ||
              this.queryParams.values.dimension3 === this.queryParams.values.dimension2 ||
              this.queryParams.values.dimension3 === this.queryParams.values.dimension4) {
              setTimeout(() => {
                this.queryParams.values.dimension3 = null;
                this.queryParams.values.dimension4 = null;
                this.queryParams.defines.find(it => it.field === 'dimension4').readonly = true;
              });
              this.msgSrv.warning(this.appTranslationService.translate('分析维度重复了！'));
            } else {
              this.queryParams.defines.find(it => it.field === 'dimension4').readonly = false;
            }
          }
        }
      },
      {
        field: 'dimension4', title: '维度四', readonly: true, ui: {
          type: UiType.select, options: this.dimensionOptions, optionsLabel: 'divisionName', optionsValue: 'divisionName', ngModelChange: function () {
            if (this.queryParams.values.dimension4 === this.queryParams.values.dimension1 ||
              this.queryParams.values.dimension4 === this.queryParams.values.dimension2 ||
              this.queryParams.values.dimension4 === this.queryParams.values.dimension3) {
              setTimeout(() => { this.queryParams.values.dimension4 = null; });
              this.msgSrv.warning(this.appTranslationService.translate('分析维度重复了！'));
            }
          }
        }
      },
    ],
    values: {
      businessUnitCode: null,
      salesType: null,
      demandDate: '',
      dimension1: null,
      dimension2: null,
      dimension3: null,
      dimension4: null,
      plantCode: null,
    }
  };

  //#region   表格内容
  public tabs = [{
    index: 1, active: true, name: '汇总', hiddenColumns: [
      'salesCatgorySub',
      'customerName',
      'itemCode',
      'itemDescriptionsCn',
    ]
  },
  {
    index: 2, active: false, name: '明细',
  }];

  public columns = [];
  public origin_columns = [{
    field: 'businessUnitCode',
    headerName: '事业部',
    valueFormatter: 'ctx.getBusinessUnitNames(value)', menuTabs: ['filterMenuTab']
  },
  {
    field: 'salesType',
    headerName: '内外销',
    valueFormatter: 'ctx.optionsFind(value,1).label',
    menuTabs: ['filterMenuTab']
  },
  {
    field: 'demandDate',
    headerName: '周期',
    valueFormatter: 'ctx.demandDateFormatter(value)', menuTabs: ['filterMenuTab']
  },
  { field: 'salesCatgoryBig', headerName: '营销大类', menuTabs: ['filterMenuTab'] },
  { field: 'salesCatgorySub', headerName: '营销小类', menuTabs: ['filterMenuTab'] },
  { field: 'customerName', headerName: '客户简称', menuTabs: ['filterMenuTab'] },
  { field: 'plantCode', headerName: '组织', menuTabs: ['filterMenuTab'] },
  { field: 'dimension1', headerName: '维度一', menuTabs: ['filterMenuTab'] },
  { field: 'dimension2', headerName: '维度二', menuTabs: ['filterMenuTab'] },
  { field: 'dimension3', headerName: '维度三', menuTabs: ['filterMenuTab'] },
  { field: 'dimension4', headerName: '维度四', menuTabs: ['filterMenuTab'] },
  { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
  { field: 'itemDescriptionsCn', headerName: '物料描述', tooltipField: 'itemDescriptionsCn', menuTabs: ['filterMenuTab'] },
  ];

  expColumnsOptions: any[] = [
    { field: 'businessUnitCode', options: this.businessUnitOptionsExp },
    { field: 'salesType', options: this.salesTypeOptionsArrayExp },
  ];

  constructor(public pro: BrandService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private messageManageService: MessageManageService,
    private appTranslationService: AppTranslationService,
    private innerService: ProductSellBalanceForecastService,
    private sopDemandAnalysisdmService: SopDemandAnalysisdm,
    public appGridStateService: AppGridStateService,
    private appConfigService: AppConfigService) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      commonQuerySrv: innerService,
      appGridStateService: appGridStateService
    });
    this.setGridHeight({ topMargin: 155, bottomMargin: this.pagerHeight + 45 });
  }

  ngOnInit() {
    this.gridData = [];
    this.headerNameTranslate(this.origin_columns);
    this.columns = deepCopy(this.origin_columns);
    this.cloneQueryParams();
    this.init();
  }
  public loadPeriodLevel() {
    // 查询是否是周还是月
    this.innerService.getPeriodLevel(this.queryParams.values.businessUnitCode)
      .subscribe(result => {
        this.isMothWeek = result.data;
      });
  }
  // 维度与事业部联动
  public loadDIMENSION() {
    this.queryParams.values.dimension1=null;
    this.queryParams.values.dimension2=null;
    this.queryParams.values.dimension3=null;
    this.queryParams.values.dimension4=null;
    this.dimensionOptions.length=0;
    this.innerService
      .queryDimension(this.queryParams.values.businessUnitCode)
      .subscribe(rsp => {
        console.log('this.dimension1Options loading');
        console.log(rsp);
        if (rsp.data !== undefined) {
          rsp.data.forEach(element => {
            // this.dimensionOptions.push(element);
            this.dimensionOptions.push({
              divisionName: element
            });
          });
        }
        console.log(this.dimensionOptions);
      });
  }
  /**
   * 控件初始化
   */
  protected init(): void {
    // 获取服务器时间
    this.innerService.getServerDatetime({ dateFormat: 'yyyy-MM-dd', addMonth: 1 })
      .subscribe(rsp => this.queryParams.values.demandDate = rsp.data);

    /** 维度一、二、三、四 */
    // this.innerService
    //   .queryDimension('')
    //   .subscribe(rsp => {
    //     console.log('this.dimension1Options loading');
    //     console.log(rsp);
    //     if (rsp.data !== undefined) {
    //       rsp.data.forEach(element => {
    //         // this.dimensionOptions.push(element);
    //         this.dimensionOptions.push({
    //           divisionName: element
    //         });
    //       });
    //     }
    //     console.log(this.dimensionOptions);
    //   });

    /**加载事业部和工厂 */
    this.innerService.GetScheduleRegions().subscribe(res => {
      console.log("scheduleRegions");
      console.log(res.data);
      // 设置事业部
      this.businessUnitOptionsExp.length=0;
      this.businessUnitOptions.clear();
      const businessUnitCodeOptions = new Set();
      res.data.forEach(element => {
        if (!businessUnitCodeOptions.has(element.scheduleRegionCode)) {
          // 事业部
          element.descriptions = element.scheduleRegionCode + '-' + element.descriptions;
          this.businessUnitOptions.add(element);
          businessUnitCodeOptions.add(element.scheduleRegionCode);
          //增加导出用的Options
          this.businessUnitOptionsExp.push({
            label:element.descriptions,
            value:element.scheduleRegionCode
          });
        }
      });
      this.queryParams.values.businessUnitCode = this.appConfigService.getActiveScheduleRegionCode();
      console.log(this.queryParams.values);
      // 根据事业部加载维度
      this.loadDIMENSION();
      // 加载【产销平衡时间颗粒度：月/周】
      this.loadPeriodLevel();
      //加载工厂
      this.innerService.GetUserPlant('',this.appConfigService.getUserId()).subscribe(res => {
        if (res.Extra !== undefined) {
          console.log("plants");
          console.log(res.Extra);
          // 获取到用户的授权数据
          this.userPrivilage = res.Extra;

          console.log(this.queryParams.values);
          this.resetPlant({ businessUnitCode: this.queryParams.values.businessUnitCode });
          this.queryParams.values.plantCode = this.appConfigService.getPlantCode();

        }
      });
    });

    

    // this.innerService.GetUserPlant('',this.appConfigService.getUserId()).subscribe(res => {
    //   if (res.Extra !== undefined) {
    //     console.log("plants");
    //     console.log(res.Extra);
    //     // 获取到用户的授权数据
    //     this.userPrivilage = res.Extra;

    //     console.log(this.queryParams.values);
    //     this.resetPlant({ businessUnitCode: this.queryParams.values.businessUnitCode });
    //     this.queryParams.values.plantCode = this.appConfigService.getPlantCode();

    //   }
    // });

    // 获取用户的内外销
    this.innerService.getUserDetailsNew({ id: this.appConfigService.getUserId() })
      .subscribe(it => {
        console.log('salesTypeOptions:');
        console.log(it);
        const salesTypeOptions: Set<String> = new Set<String>(); // 内外销
        if (it.data !== undefined && it.data !== null) {
          // (<any[]>it.data).forEach((item) => {
            if (it.data.salesType) {
              salesTypeOptions.add(it.data.salesType);
            }
          // });
          console.log('salesTypeOptions:');
          console.log(salesTypeOptions);
          // 如果没有配置，则可以看内外销
          this.innerService.GetLookupByTypeLang('SOP_SALES_TYPE', this.appConfigService.getLanguage()).subscribe(rsp => {
            console.log('this.salesTypeOptions loading');
            console.log(rsp);
            rsp.Extra.forEach((item) => {
              if (salesTypeOptions.size === 0 || !salesTypeOptions.has(item.lookupCode)) {
                // this.salesTypeOptions.add(item);
                this.salesTypeOptions.add({
                  Text: item.meaning,
                  Code: item.lookupCode
                });
                //网格用Options
                this.salesTypeOptionsArray.push({
                  label: item.meaning,
                  value: item.lookupCode
                });
                //导出用Options
                this.salesTypeOptionsArrayExp.push({
                  label: item.meaning,
                  value: item.lookupCode
                });

                
              }
            });
            console.log(this.salesTypeOptions);
          });
        }
      });
  }

  /**
   * 导出
   */
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    const action = { url: this.innerService.baseUrl + '/getdemandanalysis', method: 'POST' };
    this.innerService.exportAction(action, this.getqueryParams(), this.excelexport, this, (rsp) => {
      console.log('getdemandanalysis result:');
      console.log(rsp);
      this.sopDemandAnalysisResult = rsp;
      const rspDto = new ActionResponseDto();
      console.log('this.currentSelectedTab');
      console.log(this.currentSelectedTab);
      if (this.currentSelectedTab === undefined ||
        this.currentSelectedTab === null ||
        this.currentSelectedTab.index === 1) {
        this.exportFileName = this.appTranslationService.translate('预测汇总分析-汇总');
      } else {
        this.exportFileName = this.appTranslationService.translate('预测汇总分析-明细');
      }
      rspDto.Extra = this.getCurrentTabData().Result;
      // gridData（导出只是导出汇总数据）
      this.respDataHandle(rspDto.Extra);
      this.updateColumns();
      this.expColumns = this.getExportColumns();
      console.log('rspDto');
      console.log(rspDto);
      return rspDto.Extra;
    });
  }

  /**
   * 根据当前的grid-columns数组，生成导出列
   */
  public getExportColumns() {
    console.log('getExportColumns:');
    const expColumns = [];
    const hiddenColumns = (this.currentSelectedTab || this.tabs[0]).hiddenColumns;
    this.columns.forEach(it => {
      // 判断是否隐藏列
      if (hiddenColumns !== undefined && hiddenColumns !== null && hiddenColumns.length > 0) {
        for (const c in hiddenColumns) {
          if (hiddenColumns[c] === it.field) {
            return;
          }
        }
      }
      expColumns.push({ field: it.field, title: it.headerName, width: 200, locked: false });
    });
    console.log('getExportColumns:');
    console.log(expColumns);
    return expColumns;
  }

  /**
   * 统计栏的值改变事件
   */
  public statisticsValueChange() {
    this.setStatisticsData();
  }

  /**
   * 事业部变化事件
   */
  public onBusinessUnitCodeChange(eventParams: any): void {
    console.log(eventParams);
    console.log(this);
    this.resetPlant({ businessUnitCode: eventParams });
    // 维度与事业部联动
    this.loadDIMENSION();
    // 加载【产销平衡时间颗粒度：月/周】
    this.loadPeriodLevel();
  }

  /**
   * 获取事业部的名字
   * @param
   */
  public getBusinessUnitNames(code: string): string {
    console.log('getBusinessUnitNames:' + code);
    let name = '';
    this.businessUnitOptions.forEach(e => {
      if (e.scheduleRegionCode === code) {
        name = e.descriptions;
      }
    });
    return name;
  }

  /**
   * 格式化需求日期
   * @param value
   */
  public demandDateFormatter(value) {
    return this.innerService.formatDateTime2(value, 'yyyy-MM-dd');
  }

  /**
   * 设置用户的工厂和区域
   */
  public resetPlant({ businessUnitCode = '' }): void {
    if (businessUnitCode !== undefined && businessUnitCode) {
      console.log("businessUnitCode和userPrivilage");
      console.log(businessUnitCode);
      console.log(this.userPrivilage);
      // 根据区域过滤工厂
      this.plantOptions.clear();
      const plantCodeOptions = new Set();
      this.queryParams.values.plantCode = null;
      this.userPrivilage.forEach(element => {
        if (element.scheduleRegionCode === businessUnitCode) {
          if (!plantCodeOptions.has(element.plantCode)) {
            this.plantOptions.add(element);
            plantCodeOptions.add(element.plantCode);
          }
        }
      });
    }
  }

  /**
   * 查询
   */
  public query() {
    super.query();
    // this.innerService.getLookupItemsMutil(['SOP_SALES_TYPE']).subscribe(it => {
    //   console.log(it);
      this.queryCommon();
    // });
  }

  /**
   * 查询的公共方法
   */
  public queryCommon() {
    const params = this.getqueryParams();
    if (params === null) return;
    this.innerService.loadGridView({
      url: this.innerService.baseUrl + '/getdemandanalysis',
      method: HttpMethod.post
    }, params, this.context,
      (result) => {
        // 数据预处理
        console.log('pre dill with:');
        console.log(result);
        // if (this.sopDemandAnalysisResult === null) {
        //   this.sopDemandAnalysisResult = result;
        // }
        // 把查询结果保存起来
        this.sopDemandAnalysisResult = result;
        // 判断当前属于哪个tab
        return this.getCurrentTabData();
      },
      () => {
        console.log('this.gridData:');
        console.log(this.gridData);
        this.respDataHandle(this.gridData);
        this.updateColumns();
        // 重置个性化
        this.agGridStateReset(this.gridStateKey);
        this.setStatisticsData();
      });
  }

  /**
   * 响应数据处理
   */
  public respDataHandle(gridData: any) {
    // 加载完毕之后，后处理
    this.hasLoadData = true;
    this.columns = deepCopy(this.origin_columns);
    // 替换维度 列名
    const dimensions = ['dimension1', 'dimension2', 'dimension3', 'dimension4'];
    dimensions.forEach(d => {
      console.log(d);
      if (this.queryParams.values[d] !== '') {
        this.columns.find(it => it.field === d).headerName = this.queryParams.values[d];
        console.log('title');
        console.log(this.queryParams);
        console.log(this.queryParams.values[d]);
      } else {
        const title = this.appTranslationService.translate(this.queryParams.defines.find(it => it.field === d).title);
        console.log(title);
        this.columns.find(it => it.field === d).headerName = title;
      }
    });

    // 把需求数据列叠加上去
    if (gridData !== undefined && gridData !== null && gridData.length > 0) {
      console.log("gridData");
      console.log(gridData);
      // 先构造列
      const demandValues = gridData[0].demandValues;
      if (demandValues !== undefined && demandValues !== null && demandValues.length > 0) {
        this.statisticsBar_MonthOptions = [];
        // 获取起始月份
        let i = new Date(this.queryParams.values.demandDate).getMonth() + 1;
        let index = 0; // 统计栏月份下拉的序号
        demandValues.forEach(() => {
          // const headerName = i + this.appTranslationService.translate('月需求');
          // this.columns.push({ field: this.demandColumnPrefix + index, headerName: headerName });
          // // 这个是统计栏的数值下拉列表
          // this.statisticsBar_MonthOptions.push({ ID: index, TEXT: headerName });
          // index++;
          // i++;

          if (this.isMothWeek === 'MONTH') {

            const headerName = 'N' + (index + 1) + this.appTranslationService.translate('月需求');
            this.columns.push({ field: this.demandColumnPrefix + index, headerName: headerName });
            // 这个是统计栏的数值下拉列表
            this.statisticsBar_MonthOptions.push({ ID: index, TEXT: headerName });
            index++;
            i++;
          }
          else {

            const headerName = 'W' + (index + 1) + this.appTranslationService.translate('周需求');
            this.columns.push({ field: this.demandColumnPrefix + index, headerName: headerName });
            // 这个是统计栏的数值下拉列表
            this.statisticsBar_MonthOptions.push({ ID: index, TEXT: headerName });
            index++;
            i++;
          }
        });
      }

      // 再构造数据，把需求数据列的数据分拆到对象上（需要考虑明细和汇总数据）
      const tempResults = this.sopDemandAnalysisResult.data;
      if (tempResults !== undefined && tempResults !== null) {
        const tempResult = tempResults;

        // 明细数据
        if (tempResult.detailItems !== undefined && tempResult.detailItems !== null) {
          tempResult.detailItems.forEach(item => {
            const tempdemandValues = item.demandValues;
            let index = 0;
            tempdemandValues.forEach(value => {
              item[this.demandColumnPrefix + index] = value;
              index++;
            });
          });
        }

        // 汇总数据
        if (tempResult.sumItems !== undefined && tempResult.sumItems !== null) {
          tempResult.sumItems.forEach(item => {
            const tempdemandValues = item.demandValues;
            let index = 0;
            tempdemandValues.forEach(value => {
              item[this.demandColumnPrefix + index] = value;
              index++;
            });
          });
        }
      }
    }
  }

  /**
   * 设置统计图数据
   */
  public setStatisticsData() {
    // 构造维度下拉数据
    this.statisticsBar_DivisionOptions = [];
    if (!this.isNull(this.queryParams.values.dimension1)) {
      this.statisticsBar_DivisionOptions.push({ ID: 0, TEXT: this.queryParams.values.dimension1 });
    }
    if (!this.isNull(this.queryParams.values.dimension2)) {
      this.statisticsBar_DivisionOptions.push({ ID: 1, TEXT: this.queryParams.values.dimension2 });
    }
    if (!this.isNull(this.queryParams.values.dimension3)) {
      this.statisticsBar_DivisionOptions.push({ ID: 2, TEXT: this.queryParams.values.dimension3 });
    }
    if (!this.isNull(this.queryParams.values.dimension4)) {
      this.statisticsBar_DivisionOptions.push({ ID: 3, TEXT: this.queryParams.values.dimension4 });
    }

    console.log('this.statisticsBar_Params:');
    console.log(this.statisticsBar_Params);
    // 判断统计图是否选中了相关参数
    if (!(this.statisticsBar_Params.Division !== '' &&
      this.statisticsBar_Params.GraphType !== '' &&
      this.statisticsBar_Params.Month !== '')) {
      return;
    }
    // 构造统计图数据
    const tempResults = this.sopDemandAnalysisResult.data;
    if (tempResults !== undefined && tempResults !== null) {
      const tempResult = tempResults;
      console.log('tempResult:');
      console.log(tempResult);
      // 汇总数据
      if (tempResult.chartDatas !== undefined && tempResult.chartDatas !== null) {
        const chartDatas = tempResult.chartDatas[this.statisticsBar_Params.Division]; // 得到选中的维度的数据
        console.log(chartDatas);
        const monthIndex = this.statisticsBar_Params.Month; // 得到选中的月份的数据
        if (this.statisticsBar_Params.GraphType === 'pie') {
          // 饼图
          this.statistic_DataOptions = deepCopy(this.statistic_PieDataOptions);
          const optionObject = <any>this.statistic_DataOptions;
          chartDatas.forEach(it => {
            const name = it.name;
            // console.log('看数据');
            // console.log(name);
            if (name !== undefined && name !== null && name !== '') {
              optionObject.series[0].data.push({ value: it.data[monthIndex], name: name });
            }
          });
        } else {
          // 柱形、折线
          this.statistic_DataOptions = deepCopy(this.statistic_LineDataOptions);
          const optionObject = <any>this.statistic_DataOptions;
          optionObject.series[0].type = this.statisticsBar_Params.GraphType;
          chartDatas.forEach(it => {
            const name = it.name;
            // console.log('看数据');
            // console.log(name);
            if (name !== undefined && name !== null && name !== '') {
              optionObject.xAxis.data.push(name);
              optionObject.series[0].data.push(it.data[monthIndex]);
              // console.log(it.data[monthIndex]);
            }
          });
        }
      }
      this.echartsIntance.setOption(this.statistic_DataOptions);
      console.log('this.statistic_DataOptions:');
      console.log(this.statistic_DataOptions);
    }
  }

  /**
   * 图形初始化事件
   */
  public onChartInit(ec): any {
    this.echartsIntance = ec;
  }

  /**
   * 构造查询参数
   */
  public getqueryParams(): any {
    console.log('getqueryParams():');
    console.log(this.queryParams.values);
    this.queryParams.values.demandDate = this.innerService.formatDateTime2(this.queryParams.values.demandDate, 'yyyy-MM-dd');
    return this.queryParams.values;
  }

  /**
   * 选中记录
   * @param event
   */
  public onSelectionChanged(event: any): void {

  }

  /**
   * 页码变换
   * @param event
   */
  public onPageChanged(event: any): void {

  }

  /**
   * grid加载回调方法
   * @param params
   */
  public onGridReady(params) {
    super.onGridReady(params);
  }

  /**
   * 获取当前tab应该加载的数据
   */
  public getCurrentTabData() {
    const newResult = new GridSearchResponseDto();
    newResult.Result = [];
    newResult.TotalCount = 0;
    const result = this.sopDemandAnalysisResult;
    // 数据预处理
    if (result !== null && result.data !== undefined && result.data !== null) {
      const analysisResultItem = result.data;
      if (this.currentSelectedTab === null) {
        // 汇总tab
        newResult.Result = analysisResultItem.sumItems || [];
        newResult.TotalCount = analysisResultItem.sumItems === null ? 0 : analysisResultItem.sumItems.length;
      } else if (this.currentSelectedTab.index === 1) {
        // 汇总tab
        newResult.Result = analysisResultItem.sumItems || [];
        newResult.TotalCount = analysisResultItem.sumItems === null ? 0 : analysisResultItem.sumItems.length;
      } else {
        // 明细tab
        newResult.Result = analysisResultItem.detailItems || [];
        newResult.TotalCount = analysisResultItem.detailItems === null ? 0 : analysisResultItem.detailItems.length;
      }
    }
    console.log('getCurrentTabData:');
    console.log(newResult);
    return newResult;
  }

  /**
   * 切换不同的tab，需要显示不同的列
   */
  public updateColumns() {
    console.log('updateColumns:');
    console.log(this.columns);
    const currentTab = this.currentSelectedTab || this.tabs[0];
    // 必须要set空一次，再set，才能更新列名
    (<any>this.gridApi).setColumnDefs([]);
    (<any>this.gridApi).setColumnDefs(this.columns);
    this.gridColumnApi.resetColumnState();
    this.gridColumnApi.setColumnsVisible(currentTab.hiddenColumns, false);
  }

  //网格列的select的option设置
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.salesTypeOptionsArray;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  /**
   * 获取快码值（此方法不能直接调用，应该根据
   * @param key
   * @param code
   */
  // public lookupValueName(key: string, code: string) {
  //   return this.innerService.getLookupText(key, code);
  // }

  /**
   * 以下方法为测试方法，请勿删除
   * create by jianl
   */
  public queryCommon2() {
    const params = this.getqueryParams();
    if (params === null) return;
    this.innerService.loadGridView({
      url: 'http://127.0.0.1:9999/api/sop/sopuncstrforecast/getdemandanalysis',
      method: HttpMethod.post
    }, params, this.context,
      (result) => {
        // 数据预处理
        console.log('pre dill baidu with:');
        console.log(result);
        if (this.sopDemandAnalysisResult === null) {
          this.sopDemandAnalysisResult = result;
        }
        // this.sopDemandAnalysisResult = result;
        this.innerService.processGridViewData(this, deepCopy(this.getCurrentTabData()));
        return this.getCurrentTabData();
      },
      () => {
      });
  }

  /**
   * 选项卡切换回调的事件
   * @param arg
   */
  public tabSelect(arg: any = null): void {
    console.log('tabSelect:');
    console.log(arg);
    this.currentSelectedTab = arg;
    this.updateColumns();
    // this.queryCommon2();
    // 必须要采用异步更新数据的方案，否则会报错，ng的model检测方案
    setTimeout(() => {
      this.innerService.processGridViewData(this, deepCopy(this.getCurrentTabData()));
    });
    this.initGridWidth();
  }
}
