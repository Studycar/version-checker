import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NzCarouselComponent, NzMessageService } from 'ng-zorro-antd';
// import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { STColumn } from '@delon/abc';
import { getTimeDistance } from '@delon/util';
import { _HttpClient } from '@delon/theme';
import { I18NService } from '@core/i18n/i18n.service';
import { EChartOption } from 'echarts';
import Options from './option.js';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { draw } from './ganter.js';
import { fromEvent } from 'rxjs';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { DashboardService } from './dashboard-service.js';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service.js';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './v2.component.html',
  styleUrls: ['./v2.component.less'],
})
export class DashboardV2Component implements OnInit {
  scheduleRegionOptions: any = [];
  plantOptions: any = [];
  scheduleGroupOptions: any = [];
  scheduleRegionCode = '';
  plantCode;
  userPlantGroupCode;
  userPlantGroupCode_2;
  queryDate = new Date();
  isVisible = false;
  noteStr;
  ganterOpt;
  noteArr: any = {
    Result: [
      {
        AUTHOR: '',
        NEWSTIME: '',
      },
    ],
  };
  loadingArr = {
    loading_one: true,
    loading_tow: true,
    loading_three: true,
    loading_four: true,
    loading_five: true,
    loading_six: true,
  };
  orderType = 0;
  timeRange = 0;
  timeType = 3;
  data: any = {};

  chartOption_1: EChartOption;
  chartOption_2: EChartOption;
  chartOption_3: EChartOption;
  chartOption_4: EChartOption;
  chartOption_5: EChartOption;
  chartOption_6: EChartOption;

  dataCollectionDate = new Date(new Date().setDate(new Date().getDate() - 1));
  yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.yesterday) > 0;
  };
  userName = this.appConfigService.getUserName();
  userRole: 'planner' | 'administrator' = this.appConfigService.getRespCode() === '11460' ? 'administrator' : 'planner';
  usingDuration = 0;
  loginTime = '';
  plannerLoginTime = '';
  newMaterialQty = 0;
  processRouteQty = 0;
  materialMouldRelationQty = 0;
  lostProcessRouteMaterialQty = 0;
  lostRelationQty = 0;
  newOrderQty = 0;
  modifyOrderQty = 0;
  issuedOrderQty = 0;
  releaseOrderQty = 0;
  publishOrderQty = 0;
  extraMessage = '';
  deliveryCompletionRate = 0;
  effect = this.deliveryCompletionRate >= 90 ? '完美计划出自您手' : '主人还需继续努力做好计划';
  injectionRate = 0;
  injectionDesc = this.injectionRate >= 90 ? '达成' : '未达成';
  silkRate = 0;
  silkDesc = this.silkRate >= 90 ? '达成' : '未达成';
  stampingRate = 0;
  stampingDesc = this.stampingRate >= 90 ? '达成' : '未达成';
  requestQty = 0;
  autoRequestQty = 0;
  usingMostRequest = '';
  featureQty = 0;
  useMenuTop1Name = '';
  useMenuTop2Name = '';
  useMenuTop1Qty = 0;
  useMenuTop2Qty = 0;
  targetAchievedQty = 3;
  planChangeRate = 0;
  standardPlanChangeRate = 0;
  planChangeRateDesc = this.planChangeRate <= this.standardPlanChangeRate ? '达成' : '未达成';
  jobCompleteRate = 0;
  standardJobCompleteRate = 0;
  jobCompleteRateDesc = this.jobCompleteRate >= this.standardJobCompleteRate ? '达成' : '未达成';
  orderClosingRate = 0;
  standardOrderClosingRate = 0;
  orderClosingRateDesc = this.orderClosingRate >= this.standardOrderClosingRate ? '达成' : '未达成';
  orderDeliveryRate = 0;
  standardOrderDeliveryRate = 0;
  orderDeliveryRateDesc = this.orderDeliveryRate >= this.standardOrderDeliveryRate ? '达成' : '未达成';
  logoutTime = '';
  plannerLogoutTime = '';
  iconShow = false;
  loggedIn = true;
  plannerLoggedIn = true;
  loggedInDate = '';
  plannerLoggedInDate = '';
  logoutDate = '';
  plannerLogoutDate = '';
  @ViewChild('nzCarousel', { static: false }) nzCarousel: NzCarouselComponent;

  // 重要事项‘确认’
  handleOk(): void {
    let noteId = '';
    this.noteArr.Result.length === 0
      ? (noteId = '')
      : (noteId = this.noteArr.Result[0].ID);
    const objArr = {
      ID: noteId,
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
      CONTENTS: this.noteStr,
    };
    if (this.noteStr.length > 500) {
      this.msg.success(this.appTrans.translate('输入内容过长...'));
      return;
    }
    // console.info(objArr);
    this.http
      .post<ActionResponseDto>('/afs/serverreport/kpi/saveNotice', objArr)
      .subscribe(res => {
        console.log(res);
        if (res.Success) {
          this.queryNote();
          this.isVisible = false;
          this.msg.success(res.Message);
        } else {
          this.msg.error(res.Message);
        }
      });
  }

  // 重要事项‘取消’
  handleCancel(): void {
    this.isVisible = false;
  }

  // 点击编辑重要事项
  showModal(): void {
    this.noteStr = '';
    if (this.noteArr.Result.length > 0) {
      this.noteStr = this.noteArr.Result[0].CONTENTS;
    }
    this.isVisible = true;
  }

  chartClickFn(params) {
    console.log(params);
    if (params.name.length < 7) {
      return;
    }
    const objArr = {
      MONTH: params.name,
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
      QUERY_DATE: this.queryDate,
    };
    this.http
      .post('/afs/serverreport/kpi/getPoProductCycleData', objArr)
      .subscribe(res => {
        //this.chartOption_3 = Options._getOrderProductionCycle(res, 5, 70);
        this.chartOption_3 = this.dashboardService._getOrderProductionCycle(res, 5, 70);
        this.loadingArr.loading_three = false;
        console.log(res);
      });
  }

  backEchartsFn() {
    const objArr_3 = {
      MONTH: '',
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
      QUERY_DATE: this.queryDate,
    };
    this.http
      .post('/afs/serverreport/kpi/getPoProductCycleData', objArr_3)
      .subscribe(res => {
        //this.chartOption_3 = Options._getOrderProductionCycle(res);
        this.chartOption_3 = this.dashboardService._getOrderProductionCycle(res);
        this.loadingArr.loading_three = false;
      });
  }

  constructor(
    private http: _HttpClient,
    private queryService: CommonQueryService,
    private el: ElementRef,
    private render: Renderer2,
    public msgSrv: NzMessageService,
    public msg: NzMessageService,
    public appConfigService: AppConfigService,
    public dashboardService: DashboardService,
    private appTrans: AppTranslationService,
  ) {}

  selectOrderFn(orderType) {
    this.orderType = orderType;
    const objArr = {
      SALE_TYPE: orderType,
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
      QUERY_DATE: this.queryDate,
    };
    this.http
      .post<ActionResponseDto>(
        '/afs/serverreport/kpi/getPoFinishRateData',
        objArr,
      )
      .subscribe(res => {
        // console.info(res);
        this.loadingArr.loading_one = false;
        //this.chartOption_2 = Options._getOrderCompletionRate(res);
        this.chartOption_2 = this.dashboardService._getOrderCompletionRate(res);
      });
  }

  /**加载事业部数据 */
  _loadScheduleRegionData() {
    this.scheduleRegionOptions.length = 0;
    this.http
      .get<ActionResponseDto>(
        '/afs/serverbaseworkbench/workbench/GetUserScheduleRegion?enableFlag=',
      )
      .subscribe(result => {
        for (const index in result.Extra) {
          this.scheduleRegionOptions.push({
            label: result.Extra[index].DESCRIPTIONS,
            value: result.Extra[index].SCHEDULE_REGION_CODE,
          });
        }
        this._loadPlantData(false);
      });
  }

  // 时间范围选择方法
  selectTimeRange(timeType) {
    this.timeRange = timeType;
    this.queryWorkInfo();
  }

  // 甘特图选择时间方法
  selectTimeType(timeType) {
    this.timeType = timeType;
    this.loadingArr.loading_six = true;
    this.queryGanter();
  }

  // 选择计划区方法
  scheduleRegionFn(v) {
    // console.info(v);
    this.plantCode = null;
    this.userPlantGroupCode = null;
    this.userPlantGroupCode_2 = null;
    this._loadPlantData(true);
  }

  /**加载工厂数据 */
  _loadPlantData(isFirst) {
    this.plantOptions.length = 0;
    this.http
      .get<ActionResponseDto>(
        `/afs/serverbaseworkbench/workbench/getUserPlant?scheduleRegionCode=${this.scheduleRegionCode}`,
      )
      .subscribe(result => {
        // NgInit
        if (!isFirst) {
          this.plantCode = this.appConfigService.getActivePlantCode();
          result.Extra.forEach((element, index) => {
            if (element.PLANT_CODE === this.plantCode)
              this.scheduleRegionCode = element.SCHEDULE_REGION_CODE;
            if (!this.plantCode && index === 0) {
              this.scheduleRegionCode = element.SCHEDULE_REGION_CODE;
            }
          });
        }

        result.Extra.forEach(element => {
          if (element.SCHEDULE_REGION_CODE === this.scheduleRegionCode)
            this.plantOptions.push({
              label: element.PLANT_CODE,
              value: element.PLANT_CODE,
            });
        });

        if (isFirst && this.plantOptions.length > 0) {
          this.plantCode = this.plantOptions[0].value;
          this._loadScheduleGroupData(true);
        } else {
          if (!this.plantCode && this.plantOptions.length > 0) {
            this.plantCode = this.plantOptions[0].value;
          }
          this._loadScheduleGroupData(false);
        }
      });
  }

  // 选择工厂方法
  plantFn(v) {
    this.userPlantGroupCode = '';
    this.userPlantGroupCode_2 = '';
    this._loadScheduleGroupData(true);
  }

  /**加载计划组数据 */
  _loadScheduleGroupData(isFirst: Boolean) {
    this.scheduleGroupOptions.length = 0;
    this.http
      .get<ActionResponseDto>(
        `/afs/serverbaseworkbench/workbench/getUserPlantGroup?plantCode=${this.plantCode}&scheduleRegionCode=${this.scheduleRegionCode}`,
      )
      .subscribe(result => {
        for (const index in result.Extra) {
          if (
            index === '0' ||
            result.Extra[index].SCHEDULE_GROUP_CODE === '总装01-M23'
          ) {
            this.userPlantGroupCode = result.Extra[index].SCHEDULE_GROUP_CODE;
            this.userPlantGroupCode_2 = result.Extra[index].SCHEDULE_GROUP_CODE;
          }

          this.scheduleGroupOptions.push({
            label: result.Extra[index].SCHEDULE_GROUP_CODE,
            value: result.Extra[index].SCHEDULE_GROUP_CODE,
          });
        }

        this.queryNote();
        this.queryBaseInfo();
        this.queryWorkInfo();
        this.queryGanter();
      });
  }

  // 选择计划组方法
  userPlantGroupFn(v) {
    this.queryWorkInfo();
  }

  userPlantGroupFn_2(v) {
    this.loadingArr.loading_six = true;
    this.queryGanter();
  }

  queryBaseInfo() {
    // console.info(this.scheduleRegionCode);
    const objArr = {
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
      QUERY_DATE: this.queryDate,
    };
    const objArr_2 = {
      SALE_TYPE: 0,
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
      QUERY_DATE: this.queryDate,
    };
    const objArr_3 = {
      MONTH: '',
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
      QUERY_DATE: this.queryDate,
    };
    const objArr_4 = {
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
    };
    this.http
      .post('/afs/serverreport/kpi/getPoFinishData', objArr)
      .subscribe(res => {
        // console.info(res);
        //this.chartOption_1 = Options._getOrderCompletion(res);
        this.chartOption_1 = this.dashboardService._getOrderCompletion(res);
      });
    this.http
      .post('/afs/serverreport/kpi/getPoFinishRateData', objArr_2)
      .subscribe(res => {
        this.loadingArr.loading_one = false;
        //this.chartOption_2 = Options._getOrderCompletionRate(res);
        this.chartOption_2 = this.dashboardService._getOrderCompletionRate(res);
      });
    this.http
      .post('/afs/serverreport/kpi/getPoProductCycleData', objArr_3)
      .subscribe(res => {
        //this.chartOption_3 = Options._getOrderProductionCycle(res);
        this.chartOption_3 = this.dashboardService._getOrderProductionCycle(res);
        this.loadingArr.loading_three = false;
      });
    // 获取工单齐套率
    this.http
      .post('/afs/serverreport/kpi/getMoKitData', objArr_4)
      .subscribe(res => {
        // console.info(res);
        //this.chartOption_6 = Options._getOrderRate(res);
        this.chartOption_6 = this.dashboardService._getOrderRate(res);
      });
  }

  // 查询作业管控数据
  queryWorkInfo() {
    const objArr_4 = {
      TIME_TYPE: this.timeRange,
      SCHEDULE_GROUP_CODE: this.userPlantGroupCode,
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
      QUERY_DATE: this.queryDate,
    };
    const objArr_5 = {
      TIME_TYPE: this.timeRange,
      SCHEDULE_GROUP_CODE: this.userPlantGroupCode,
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
      QUERY_DATE: this.queryDate,
    };
    this.http
      .post('/afs/serverreport/kpi/getMoFinishRateData', objArr_5)
      .subscribe(res => {
        //this.chartOption_5 = Options._getWorkChangeCompletionRate(res);
        this.chartOption_5 = this.dashboardService._getWorkChangeCompletionRate(res);
        this.loadingArr.loading_five = false;
      });
    this.http
      .post('/afs/serverreport/kpi/getMoChangeRateData', objArr_4)
      .subscribe(res => {
        // console.info(res);
        //this.chartOption_4 = Options._getWorkCompletionRate(res);
        this.chartOption_4 = this.dashboardService._getWorkCompletionRate(res);
        this.loadingArr.loading_four = false;
      });
  }

  // 查询重要事项
  queryNote() {
    const obj = {
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
    };
    // console.info(obj);
    this.http
      .post('/afs/serverreport/kpi/getNoticeData', obj)
      .subscribe(res => {
        this.noteArr = res;
      });
  }

  // 日期改变函数
  dateChangeFn(v) {
    this.queryBaseInfo();
    this.queryWorkInfo();
  }

  // 甘特图点击刷新方法
  refreshGanterFn() {
    this.loadingArr.loading_six = true;
    this.queryGanter();
  }

  queryGanter() {
    const bodyArr = {
      TIME_TYPE: this.timeType, // (1-当月 2-一周 3-二周 4-三月)
      SCHEDULE_REGION_CODE: this.scheduleRegionCode,
      PLANT_CODE: this.plantCode,
      SCHEDULE_GROUP_CODE: this.userPlantGroupCode_2,
      QUERY_DATE: this.queryDate,
    };
    this.http
      .post<any>('/afs/serverreport/kpi/getResourceLoadRateData', bodyArr)
      .subscribe(result => {
        if (result.Result !== null && result.Result.COLOR_CONFIG !== null) {
          //this.ganterOpt = Options._getGanter(result, this.timeType);
          this.ganterOpt = this.dashboardService._getGanter(result, this.timeType);
          const tutorial = this.el.nativeElement.querySelector('#tutorial');
          this.render.setProperty(tutorial, 'innerHTML', '');
          draw(this.ganterOpt);
          const child = document
            .getElementById('tutorial')
            .getElementsByTagName('div')[0];
          child.style.width = '100%';
        }
        this.loadingArr.loading_six = false;
      });
  }

  ngOnInit() {
    this._loadScheduleRegionData();
    this.getDataCollectionData();
    fromEvent(window, 'resize').subscribe(event => {
      const tutorial = this.el.nativeElement.querySelector('#tutorial');
      this.render.setProperty(tutorial, 'innerHTML', '');
      draw(this.ganterOpt);
      const child = document
        .getElementById('tutorial')
        .getElementsByTagName('div')[0];
      child.style.width = '100%';
    });
  }

  onDataCollectionDateChange(val) {
    this.nzCarousel.goTo(0);
    this.getDataCollectionData();
  }
  onMouseEnter() {
    this.iconShow = true;
  }
  onMouseLeave() {
    this.iconShow = false;
  }
  previousPage() {
    this.nzCarousel.pre();
  }
  nextPage() {
    this.nzCarousel.next();
  }
  getDataCollectionData() {
    this.http.post<any>('/afs/serverdatacollection/DataCollectionService/GetUserData', {Date: this.dataCollectionDate}).subscribe(res => {
      if (res.Success) {
        this.usingDuration = res.Extra.UseSysTotalDays;
        this.loggedIn = res.Extra.IsCurrentDayOnline;
        this.loggedInDate = res.Extra.OnlineDate;
        this.loginTime = res.Extra.OnlineTime;
        this.plannerLoggedIn = res.Extra.PlannerIsCurrentDayOnline;
        this.plannerLoggedInDate = res.Extra.PlannerOnlineDate;
        this.plannerLoginTime = res.Extra.PlannerOnlineTime;
        this.logoutDate = res.Extra.OfflineDate;
        this.logoutTime = res.Extra.OfflineTime;
        this.plannerLogoutDate = res.Extra.PlannerOfflineDate;
        this.plannerLogoutTime = res.Extra.PlannerOfflineTime;
        this.newMaterialQty = res.Extra.ItemCountAdd;
        this.processRouteQty = this.userRole === 'planner' ? res.Extra.ItemRoutingCount : res.Extra.ItemRoutingCountTotal;
        this.materialMouldRelationQty = this.userRole === 'planner' ? res.Extra.ItemMouldCount : res.Extra.ItemMouldCountTotal;
        this.lostProcessRouteMaterialQty = res.Extra.LackRoutingItemCount;
        this.lostRelationQty = res.Extra.LackMouldItemCount;
        this.newOrderQty = res.Extra.ReqOrderCountAdd;
        this.modifyOrderQty = res.Extra.ReqOrderCountUpdate;
        this.issuedOrderQty = this.userRole === 'planner' ? res.Extra.MoSendCount : res.Extra.MoSendCountTotal;
        this.releaseOrderQty = this.userRole === 'planner' ? res.Extra.MoReleaseCount : res.Extra.MoReleaseCountTotal;
        this.publishOrderQty = this.userRole === 'planner' ? res.Extra.MoPublishCount : res.Extra.MoPublishCountTotal;
        this.extraMessage = res.Extra.NoPublishGroupNames ? `其中${res.Extra.NoPublishGroupNames}计划组未正常发布计划` : '所有计划组都正常发布计划';
        this.deliveryCompletionRate = res.Extra.ScheduleDeliverRate;
        this.effect = this.deliveryCompletionRate >= 90 ? '完美计划出自您手' : '主人还需继续努力做好计划';
        this.injectionRate = res.Extra.ScheduleDeliverRateZHS;
        this.injectionDesc = this.injectionRate >= 90 ? '达成' : '未达成';
        this.silkRate = res.Extra.ScheduleDeliverRateSY;
        this.silkDesc = this.silkRate >= 90 ? '达成' : '未达成';
        this.stampingRate = res.Extra.ScheduleDeliverRateCHY;
        this.stampingDesc = this.stampingRate >= 90 ? '达成' : '未达成';
        this.requestQty = this.userRole === 'planner' ? res.Extra.RequestSubmitCount : res.Extra.RequestSubmitCountTotal;
        this.autoRequestQty = res.Extra.RequestRunCount;
        this.usingMostRequest = this.userRole === 'planner' ? res.Extra.RequestRunTop1Name : res.Extra.RequestRunTop1NameTotal;
        this.featureQty = this.userRole === 'planner' ? res.Extra.UseMenuTotalCount : res.Extra.UseMenuTotalCountTotal;
        this.useMenuTop1Name = this.userRole === 'planner' ? res.Extra.UseMenuTop1NAME : res.Extra.UseMenuTop1NAMETotal;
        this.useMenuTop1Qty = this.userRole === 'planner' ? res.Extra.UseMenuTop1Count : res.Extra.UseMenuTop1CountTotal;
        this.useMenuTop2Name = this.userRole === 'planner' ? res.Extra.UseMenuTop2NAME : res.Extra.UseMenuTop2NAMETotal;
        this.useMenuTop2Qty = this.userRole === 'planner' ? res.Extra.UseMenuTop2Count : res.Extra.UseMenuTop2CountTotal;
        this.targetAchievedQty = 0;
        this.planChangeRate = res.Extra.PlanChangeRate;
        this.jobCompleteRate = res.Extra.JobCompleteRate;
        this.orderClosingRate = res.Extra.MoCloseRate;
        this.orderDeliveryRate = res.Extra.ReqOrderDeliverRate;
        this.queryService.GetLookupByType('KPI_STANDARD_TYPE').subscribe(result => {
          result.Extra.forEach(item => {
            switch (item.LOOKUP_CODE) {
              case 'MO_CHANGE_RATE':
                this.standardPlanChangeRate = Number(item.MEANING.replace(/%/g, ''));
                this.planChangeRateDesc = this.planChangeRate < this.standardPlanChangeRate ? '达成' : '未达成';
                if (this.planChangeRate < this.standardPlanChangeRate) {
                  this.targetAchievedQty += 1;
                }
                break;
              case 'MO_FINISH_RATE':
                this.standardJobCompleteRate = Number(item.MEANING.replace(/%/g, ''));
                this.jobCompleteRateDesc = this.jobCompleteRate > this.standardJobCompleteRate ? '达成' : '未达成';
                if (this.jobCompleteRate > this.standardJobCompleteRate) {
                  this.targetAchievedQty += 1;
                }
                break;
              case 'MO_CLOSING_RATE':
                this.standardOrderClosingRate = Number(item.MEANING.replace(/%/g, ''));
                this.orderClosingRateDesc = this.orderClosingRate > this.standardOrderClosingRate ? '达成' : '未达成';
                if (this.orderClosingRate > this.standardOrderClosingRate) {
                  this.targetAchievedQty += 1;
                }
                break;
              case 'ORDER_DELIVERY_TIMELINESS':
                this.standardOrderDeliveryRate = Number(item.MEANING.replace(/%/g, ''));
                this.orderDeliveryRateDesc = this.orderDeliveryRate > this.standardOrderDeliveryRate ? '达成' : '未达成';
                if (this.orderDeliveryRate > this.standardOrderDeliveryRate) {
                  this.targetAchievedQty += 1;
                }
                break;
            }
          });
        });
      } else {
        this.msgSrv.error(this.appTrans.translate(res.Message));
      }
    });
  }
}
