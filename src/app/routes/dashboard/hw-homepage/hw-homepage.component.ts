import { formatDate } from "@angular/common";
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonQueryService } from "app/modules/generated_module/services/common-query.service";
import { NzCarouselComponent, NzMessageService } from "ng-zorro-antd";
import { fromEvent, interval, Subject } from "rxjs";
import { debounceTime, filter, switchMap } from "rxjs/operators";
import { HwHomepageService } from "./hw-homepage.service";
import { draw } from './ganter.js';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { decimal } from "@shared";

@Component({
  selector: 'app-hw-homepage',
  templateUrl: './hw-homepage.component.html',
  styleUrls: ['./hw-homepage.component.less'],
  providers: [HwHomepageService]
})
export class HwHomepageComponent implements OnInit {
  constructor(
    private appTranslateService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private queryService: HwHomepageService,
    private el: ElementRef,
    private render: Renderer2,
    private router: ActivatedRoute,
  ) { }

  noticeArr: Array<{content: string, author: string, contentArr: string[]}> = [];

  plantOptions: Array<{label: string, value: string}> = [];
  commonPlant = this.appConfigService.getPlantCode();
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  leftPlan = 0;
  leftPlanDesc = `${this.currentYear}年计划`;
  leftOrders = 0;
  leftOrdersDesc = `${this.currentYear}年接单`;
  leftActual = 0;
  leftActualDesc = `${this.currentYear}年实际`;
  rightPlan = 0;
  rightPlanDesc = `${this.currentMonth + 1}月计划`;
  rightOrders = 0;
  rightOrdersDesc = `${this.currentMonth + 1}月接单`;
  rightActual = 0;
  rightActualDesc = `${this.currentMonth + 1}月实际`;
  dailyPlanOutput = 0;
  dailyActualOutput = 0;
  years = [];
  months = [];
  themeBlueColor = '#0a91eb';
  
  leftChartData = [
    ['2020', 43.3, 85.8, 93.7],
    ['2021', 83.1, 73.4, 55.1],
    ['2022', 86.4, 65.2, 82.5],
    ['2023', 98.4],
    ['2024', 107.4],
  ];
  rightChartData = [
    ['4', 43.3, 85.8, 93.7],
    ['5', 83.1, 73.4, 55.1],
    ['6', 86.4, 65.2, 82.5],
    ['7', 98.4],
    ['8', 107.4],
  ];
  echartLabelConfig = {
    color: this.themeBlueColor,
    rich: {
      c: {
        fontWeight: 'bold',
        color: this.themeBlueColor,
        fontSize: 20,
      }
    }
  };
  xAxisConfig = {
    axisTick: {
      show: false
    }
  }
  yAxisConfig = {
    splitLine: {
      show: false,
    },
    axisTick: {
      inside: true
    },
    axisLabel: {
      showMinLabel: false,
      rotate: -90,
    }
  }
  gridConfig = {
    top: '20%',
    right: '3%'
  }
  firstBarConf = {
    barGap: 0,
    itemStyle: {
      color: 'rgb(242, 209, 42)',
    }
  }
  secondBarConf = {
    itemStyle: {
      color: 'rgb(0, 143, 221)',
    }
  }
  thirdBarConf = {
    itemStyle: {
      color: 'rgb(247, 87, 99)',
    }
  }
  legendConf = {
    bottom: '5%',
    icon: 'circle'
  }


  leftChartOptions = {
    grid: {
      ...this.gridConfig
    },
    legend: {
      ...this.legendConf,
      data: [
        '年计划','年接单','年实际'
      ]
    },
    tooltip: {},
    xAxis: [{ 
      type: 'category',
      ...this.xAxisConfig,
      data: this.years
    }],
    yAxis: [{
      ...this.yAxisConfig,
      interval: this.setInterval(Math.max(...(this.leftChartData.map(d => d[1]) as number[]))),
    }],
    series: [
      { 
        type: 'bar',
        name: '年计划',
        data: this.leftChartData.map(d => d[1]),
        ...this.firstBarConf,
        markPoint: {
          data: [
            {
              value: this.leftChartData[2][1],
              xAxis: 2,
              yAxis: decimal.add(this.leftChartData[2][1], 0.4),
              name: this.currentYear,
              symbol: "image://" + require('./image/chart-mark-point.png'),
              symbolSize: [
                this.computeSymbolLen(this.leftChartData[2][1].toString().length, 4, 3), 
                60
              ],
              symbolOffset: [13, -28],
              label: {
                offset: [0, -10],
                formatter: `${this.leftPlanDesc}{c|{c}}`,
                ...this.echartLabelConfig
              }
            }
          ],
        } 
      }, 
      { 
        type: 'bar',
        name: '年接单',
        ...this.secondBarConf,
        data: this.leftChartData.map(d => d[2])
      }, 
      { 
        type: 'bar',
        name: '年实际', 
        ...this.thirdBarConf,
        data: this.leftChartData.map(d => d[3])
      }
    ]
  };

  rightChartOptions = {
    grid: {
      ...this.gridConfig
    },
    legend: {
      ...this.legendConf,
      data: [
        '月计划', '月接单', '月实际'
      ]
    },
    tooltip: {},
    xAxis: [{ 
      type: 'category',
      ...this.xAxisConfig,
      data: this.months
    }],
    yAxis: [{
      ...this.yAxisConfig,
      interval: this.setInterval(Math.max(...(this.rightChartData.map(d => d[1]) as number[]))),
    }],
    series: [
      { 
        type: 'bar',
        name: '月计划',
        data: this.rightChartData.map(d => d[1]),
        ...this.firstBarConf,
        markPoint: {
          data: [
            {
              value: this.rightChartData[2][1],
              xAxis: 2,
              yAxis: decimal.add(this.rightChartData[2][1], 0.4),
              name: this.currentMonth + 1,
              symbol: "image://" + require('./image/chart-mark-point.png'),
              symbolSize: [
                this.computeSymbolLen(this.rightChartData[2][1].toString().length, (this.currentMonth+1).toString().length, 3), 
                60
              ],
              symbolOffset: [10, -28],
              label: {
                offset: [0, -10],
                formatter: `${this.rightPlanDesc}{c|{c}}`,
                ...this.echartLabelConfig
              }
            }
          ],
        } 
      }, 
      { 
        type: 'bar',
        name: '月接单',
        ...this.secondBarConf,
        data: this.rightChartData.map(d => d[2]),
      }, 
      { 
        type: 'bar',
        name: '月实际', 
        ...this.thirdBarConf,
        data: this.rightChartData.map(d => d[3]),
      }
    ]
  };

  dataCollectionDate = new Date(new Date().setDate(new Date().getDate() - 1));
  yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.yesterday) > 0;
  }
  @ViewChild('nzCarousel', { static: true }) nzCarousel: NzCarouselComponent;
  userName = this.appConfigService.getUserName();
  userRole: 'planner' | 'administrator' = this.appConfigService.getRespCode() === '11460' ? 'administrator' : 'planner';
  usingDuration = 0;
  loggedIn = true;
  plannerLoggedIn = true;
  loginTime = '';
  plannerLoginTime = '';
  loggedInDate = '';
  plannerLoggedInDate = '';
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
  injectionRate = 0;
  silkRate = 0;
  stampingRate = 0;
  requestQty = 0;
  autoRequestQty = 0;
  usingMostRequest = '';
  featureQty = 0;
  useMenuTop1Name = '';
  useMenuTop2Name = '';
  useMenuTop1Qty = 0;
  useMenuTop2Qty = 0;
  targetAchievedQty = 0;
  planChangeRate = 0;
  standardPlanChangeRate = 0;
  jobCompleteRate = 0;
  standardJobCompleteRate = 0;
  orderClosingRate = 0;
  standardOrderClosingRate = 0;
  orderDeliveryRate = 0;
  standardOrderDeliveryRate = 0;
  logoutTime = '';
  plannerLogoutTime = '';
  logoutDate = '';
  plannerLogoutDate = '';

  
  modalVisible = false;
  noteStr = '';
  noteId = '';
  note = '';

  ngOnInit() {
    // setTimeout(() => {
    //   this.getResourceLoadRateData(this.activeIndex);
    // });
    this.initChart();
    this.loadPlantOption();
    // this.queryNotice();
    // this.getDataCollectionData();
    this.getDashboardData();
    // this.getIncomingKitData();
    interval(1000).subscribe(result => {
      if (new Date().getMinutes() === 0 && new Date().getSeconds() === 0) {
        this.dailyActualOutput = new Date().getHours() >= 8 ? (new Date().getHours() - 7) * 412 : 412 * (15 + new Date().getHours());
        // this.getIncomingKitData();
      }
    });
    fromEvent(window, 'resize').subscribe(event => {
      const currentUrl = window.location.href;
      const targetUrl = this.router.routeConfig.path || '';
      if (currentUrl.includes(targetUrl)) {
        // this.getResourceLoadRateData(this.activeIndex);
      }
    });
  }

  computeSymbolLen(boldNumLen, numLen, textLen) {
    const res = decimal.add(decimal.mul(boldNumLen, 12), decimal.mul(numLen, 8), decimal.mul(textLen, 13));
    return res;
  }

  setInterval(maxValue) {
    const valueStr = Math.floor(maxValue).toString();
    const res = decimal.add(valueStr[0], 1) * Math.pow(10, valueStr.length-1);
    return res;
  }

  initChart() {
    this.years.push(
      this.currentYear - 2,
      this.currentYear - 1,
      this.currentYear,
      this.currentYear + 1,
      this.currentYear + 2,
    );
    const month = this.currentMonth + 1;
    this.months.push(month <= 2 ? (month + 12 - 2) : (month - 2));
    this.months.push(month <= 1 ? (month + 12 - 1) : (month - 1));
    this.months.push(month);
    this.months.push(month >= 12 ? (month - 12 + 1) : (month + 1));
    this.months.push(month >= 11 ? (month - 12 + 2) : (month + 2));
  }

  handleCancel() {
    this.modalVisible = false;
  }

  showModal() {
    this.noteStr = this.note;
    this.modalVisible = true;
  }

  handleSave() {
    this.queryService.saveNotice({
      ID: this.noteId,
      SCHEDULE_REGION_CODE: this.appConfigService.getActiveScheduleRegionCode(),
      PLANT_CODE: this.appConfigService.getPlantCode(),
      CONTENTS: this.noteStr
    }).subscribe(res => {
      if (res.Success) {
        this.queryNotice();
        this.modalVisible = false;
        this.msgSrv.success(res.Message);
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  queryNotice() {
    this.queryService.queryNotice(this.appConfigService.getActiveScheduleRegionCode(), this.appConfigService.getPlantCode()).subscribe(res => {
      this.noticeArr.length = 0;
      if (res.Result.length === 0) {
        this.noticeArr.push(
          { content: '暂无消息', author: '', contentArr: [] },
        );
        this.note = '';
      } else {
        this.note = res.Result[0].CONTENTS;
        this.noteId = res.Result[0].ID;
        const author = `${res.Result[0].AUTHOR} ${res.Result[0].NEWSTIME}`;
        const notices = res.Result[0].CONTENTS.split('/').slice(0, 2);
        notices.forEach(item => {
          this.noticeArr.push({
            content: item === '' ? '暂无消息' : item,
            author: item === '' ? '' : author,
            contentArr: []
          });
        });
        // 通知文字溢出滚动
        setTimeout(() => {
          const nodes = document.getElementsByClassName('content');
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].clientWidth < nodes[i].scrollWidth) {
              const noticeItemWidth = nodes[i].clientWidth;
              const line = Math.ceil((this.noticeArr[i].content.length * 12) / noticeItemWidth);
              const wordsPerLine = Math.floor(noticeItemWidth / 12);
              for (let j = 0; j < line; j++) {
                this.noticeArr[i].contentArr.push(this.noticeArr[i].content.substr(j * wordsPerLine, wordsPerLine));
              }
            }
          }
        });
      }
    });
  }

  getDashboardData() {
    this.queryService.getDashboardData(this.commonPlant).subscribe(res => {
      this.leftPlan = res.leftPlan;
      this.leftOrders = res.leftOrders;
      this.leftActual = res.leftActual;
      this.rightPlan = res.rightPlan;
      this.rightOrders = res.rightOrders;
      this.rightActual = res.rightActual;
      this.dailyPlanOutput = res.dailyPlanOutput;
      this.dailyActualOutput = res.dailyActualOutput;
    });
  }

 

  loadPlantOption() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      this.plantOptions.length = 0;
      console.log('loadPlantOption', res);
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  onMouseWheel(e: WheelEvent) {
    e.preventDefault();
    if (e.deltaY < 0) {
      this.nzCarousel.pre();
    } else {
      this.nzCarousel.next();
    }
  }

  onCommonPlantChange(plant: string) {

  }

  onDataCollectionDateChange(date: Date) {
    this.nzCarousel.goTo(0);
    this.getDataCollectionData();
  }

  getDataCollectionData() {
    this.queryService.loadDataCollectionData(this.dataCollectionDate).subscribe(res => {
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
        this.injectionRate = res.Extra.ScheduleDeliverRateZHS;
        this.silkRate = res.Extra.ScheduleDeliverRateSY;
        this.stampingRate = res.Extra.ScheduleDeliverRateCHY;
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
        this.commonQueryService.GetLookupByType('KPI_STANDARD_TYPE').subscribe(result => {
          result.Extra.forEach(item => {
            switch (item.LOOKUP_CODE) {
              case 'MO_CHANGE_RATE':
                this.standardPlanChangeRate = Number(item.MEANING.replace(/%/g, ''));
                if (this.planChangeRate < this.standardPlanChangeRate && this.planChangeRate > 0) {
                  this.targetAchievedQty += 1;
                }
                break;
              case 'MO_FINISH_RATE':
                this.standardJobCompleteRate = Number(item.MEANING.replace(/%/g, ''));
                if (this.jobCompleteRate > this.standardJobCompleteRate) {
                  this.targetAchievedQty += 1;
                }
                break;
              case 'MO_CLOSING_RATE':
                this.standardOrderClosingRate = Number(item.MEANING.replace(/%/g, ''));
                if (this.orderClosingRate > this.standardOrderClosingRate) {
                  this.targetAchievedQty += 1;
                }
                break;
              case 'ORDER_DELIVERY_TIMELINESS':
                this.standardOrderDeliveryRate = Number(item.MEANING.replace(/%/g, ''));
                if (this.orderDeliveryRate > this.standardOrderDeliveryRate) {
                  this.targetAchievedQty += 1;
                }
                break;
            }
          });
        });
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.Message));
      }
    });
  }

  // tabSwitch(index: number) {
  //   this.activeIndex = index;
  //   this.getResourceLoadRateData(index);
  // }
}

function tooltipFormatter(params) {
  let html = params[0].name + '<br>';
  for (let i = 0; i < params.length; i++) {
    html += '<span style="display: inline-block; margin-right: 5px; border-radius: 10px; width: 10px; height: 10px; background-color:' + params[i].color + ';"></span>';
    if (params[i].seriesName.indexOf('率') > 0) {
      html += params[i].seriesName + ': ' + params[i].value + '%<br>';
    } else {
      html += params[i].seriesName + ': ' + params[i].value + '<br>';
    }
  }
  return html;
}