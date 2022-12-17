import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { NzCarouselComponent, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { HomepageService } from './homepage.service';
import { fromEvent, interval, Subject } from 'rxjs';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { draw } from './ganter.js';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-homepage',
  templateUrl: './new-homepage.component.html',
  styleUrls: ['./new-homepage.component.less'],
  providers: [HomepageService]
})
export class NewHomepageComponent implements OnInit {

  constructor(
    private appTranslateService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private queryService: HomepageService,
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

  orderDeliveryCycleAnalysisStartMonth: Date = new Date(this.currentYear - 1, this.currentMonth + 1, 1);
  orderDeliveryCycleAnalysisEndMonth: Date = new Date();
  orderDeliveryCycleAnalysisLeftBtnDisabled = false;
  orderDeliveryCycleAnalysisRightBtnDisabled = true;
  threeYearsBefore = new Date(this.currentYear - 3, this.currentMonth + 1, 1);
  twoYearsBefore = new Date(this.currentYear - 2, this.currentMonth, 1);
  oneYearsBefore = new Date(this.currentYear - 1, this.currentMonth + 1, 1);
  orderDeliveryCycleAnalysisStartDisabled = (current: Date): boolean => {
    /*if (this.orderDeliveryCycleAnalysisEndMonth === null) {
      return false;
    }
    return differenceInCalendarDays(current, this.orderDeliveryCycleAnalysisEndMonth) > 0;*/
    return differenceInCalendarDays(current, this.threeYearsBefore) < 0 || differenceInCalendarDays(current, this.oneYearsBefore) > 0;
  }
  orderDeliveryCycleAnalysisEndDisabled = (current: Date): boolean => {
    /*if (this.orderDeliveryCycleAnalysisStartMonth === null) {
      return false;
    }
    return differenceInCalendarDays(current, this.orderDeliveryCycleAnalysisStartMonth) < 0;*/
    return differenceInCalendarDays(current, this.twoYearsBefore) < 0 || differenceInCalendarDays(current, new Date()) > 0;
  }
  orderDeliveryCycleAnalysisMonthRangeChange = new Subject<Date[]>();
  orderDeliveryCycleAnalysisChartOptions = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '20%',
      bottom: '20%'
    },
    legend: {
      textStyle: {
        color: '#919CA3',
        fontSize: 12
      },
      left: 'center',
      top: 20,
      itemWidth: 15,
      itemHeight: 12,
      itemGap: 27,
      padding: [5, 0],
      data: ['生产', '等待', '发运', '目标']
    },
    xAxis: [
      {
        type: 'category',
        // tslint:disable-next-line:max-line-length
        data: ['201912', '201911', '201910', '201909', '201908', '201907', '201906', '201905', '201904', '201903', '201902', '201901'],
        axisPointer: {
          type: 'shadow'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          interval: 0,
          color: '#919CA3',
          rotate: 45
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#EDF0F2'
          }
        },
        axisLabel: {
          color: '#919CA3'
        }
      }
    ],
    series: [
      {
        name: '生产',
        type: 'bar',
        stack: 'all',
        data: [4.6, 5.9, 9.0, 26.4, 28.7, 35.5, 24.3, 33.9, 39.9, 18.8, 6.0, 3.3],
        itemStyle: {
          color: '#C305FB'
        }
      },
      {
        name: '等待',
        type: 'bar',
        stack: 'all',
        data: [4.0, 4.9, 7.0, 23.2, 25.6, 23.4, 35.6, 22.1, 32.6, 20.0, 6.4, 3.3],
        itemStyle: {
          color: '#FBDA05'
        }
      },
      {
        name: '发运',
        type: 'bar',
        stack: 'all',
        data: [5.6, 5.9, 9.0, 26.4, 28.7, 8.9, 25.6, 28.2, 33.9, 18.8, 6.0, 7.3],
        itemStyle: {
          color: '#2359FF'
        }
      },
      {
        name: '目标',
        type: 'line',
        data: [21, 20, 30, 45, 32, 25, 42, 34, 15, 27, 37, 19],
        itemStyle: {
          color: '#F6A52C'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(246, 165, 44, 0.7)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(246, 165, 44, 0)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ]
  };

  orderCompletionRateStartMonth: Date = new Date(this.currentYear, this.currentMonth - 5, 1);
  orderCompletionRateEndMonth: Date = new Date();
  orderCompletionRateLeftBtnDisabled = false;
  orderCompletionRateRightBtnDisabled = true;
  halfYearBefore = new Date(this.currentYear, this.currentMonth - 5, 1);
  towAndAHalfYearBefore = new Date(this.currentYear - 2, this.currentMonth - 6, 1);
  orderCompletionRateStartDisabled = (current: Date): boolean => {
    /*if (this.orderCompletionRateEndMonth === null) {
      return false;
    }
    return differenceInCalendarDays(current, this.orderCompletionRateEndMonth) > 0;*/
    return differenceInCalendarDays(current, this.threeYearsBefore) < 0 || differenceInCalendarDays(current, this.halfYearBefore) > 0;
  }
  orderCompletionRateEndDisabled = (current: Date): boolean => {
    /*if (this.orderCompletionRateStartMonth === null) {
      return false;
    }
    return differenceInCalendarDays(current, this.orderCompletionRateStartMonth) < 0;*/
    return differenceInCalendarDays(current, this.towAndAHalfYearBefore) < 0 || differenceInCalendarDays(current, new Date()) > 0;
  }
  orderCompletionRateMonthRangeChange = new Subject<Date[]>();
  orderCompletionRateOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: tooltipFormatter,
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '20%',
      bottom: '15%'
    },
    legend: {
      textStyle: {
        color: '#919CA3',
        fontSize: 12
      },
      left: 'center',
      top: 20,
      itemWidth: 15,
      itemHeight: 12,
      itemGap: 20,
      padding: [5, 0],
      data: ['按时完成量', '统计总量', '按时完成率']
    },
    xAxis: [
      {
        type: 'category',
        data: ['201901', '201902', '202003', '201904', '201905', '201906', '201907', '201908', '201909', '201910', '201911', '201912'],
        axisPointer: {
          type: 'shadow'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3',
        }
      },
      {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3',
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '按时完成量',
        type: 'bar',
        data: [1700, 4000, 3100, 1600, 3200, 2600, 1000, 1300, 2300, 3300, 4500, 700],
        itemStyle: {
          color: '#FBDA05'
        },
        barWidth: 16
      },
      {
        name: '统计总量',
        type: 'bar',
        data: [2200, 4800, 3700, 1900, 3600, 3200, 1200, 1600, 2300, 3400, 5000, 900],
        itemStyle: {
          color: '#2359FF'
        },
        barGap: 0,
        barWidth: 16
      },
      {
        name: '按时完成率',
        type: 'line',
        yAxisIndex: 1,
        data: [77.3, 83.3, 83.8, 84.2, 88.9, 81.25, 83.3, 81.25, 100, 97.1, 90, 77.8],
        itemStyle: {
          color: '#F6A52C'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(246, 165, 44, 0.7)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(246, 165, 44, 0)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ]
  };

  resourceLoadRatePlanGroup = '总装01-M23';
  tabArr: string[] = ['一周', '两周'];
  activeIndex = 0;
  resourceLoadRateOptions = {
    time: '1w',
    startDate: new Date(),
    // fullScreen: true, // 是否开启全展示
    yAxis: {
      textStyle: {
        color: '#919CA3',
        fontSize: '12px',
        textAlign: 'center', // 水平对齐
        verticalAlign: 'middle', // 垂直对齐
      },
      lineStyle: {
        color: '#919CA3',
      },
      data: [],
    },
    xAxis: {
      textStyle: {
        color: '#919CA3',
        fontSize: '12px',
        textAlign: 'center',
        verticalAlign: 'middle', // 垂直对齐
      },
      lineStyle: {
        color: '#919CA3',
      },
    },
    cellStyle: {
      fillStyle: '#F7F9FA',
      strokeStyle: '#919CA3',
      ch: 10,
    },
    tooltip: {
      formatter: val => {
        // val为data里的数据
        let str = '',
          plantGroup = '',
          resource = '',
          date = '',
          resourceType = '',
          resourceAvailableTime = '',
          resourceWorkingTime = '',
          value = '';
        if (val) {
          plantGroup = val.plantGroup || '';
          resource = val.resource || '';
          date = val.date || '';
          resourceType = val.resourceType || '';
          resourceAvailableTime = val.resourceAvailableTime || '';
          resourceWorkingTime = val.resourceWorkingTime || '';
          value = val.val || '';
        } else {
          return false;
        }
        str = `
            ${this.appTranslateService.translate('计划组：')}${plantGroup}<br>
            ${this.appTranslateService.translate('资源：')}${resource}<br>
            ${this.appTranslateService.translate('时间：')}${date}<br>
            ${this.appTranslateService.translate('资源类型：')}${resourceType}<br>
            ${this.appTranslateService.translate('资源可用量（小时）：')}${resourceAvailableTime}<br>
            ${this.appTranslateService.translate('资源使用量（小时）：')}${resourceWorkingTime}<br>
            ${this.appTranslateService.translate('资源利用率：')}${value}%
        `;
        return str;
      },
      height: 166
    },
    series: [],
    legend: function(dom) {
      const legendDom = document.createElement('div');
      dom.appendChild(legendDom);
    },
  };

  planGroupOptions: Array<{label: string, value: string}> = [
    { label: '总装01-M23', value: '总装01-M23' },
  ];
  jobCompletionRatePlanGroup = '总装01-M23';
  jobCompletionRateDateRange = new Subject<Date[]>();
  currentDate = new Date().getDate();
  jobCompletionRateStartDate = new Date(this.currentYear, this.currentMonth, this.currentDate - 6);
  jobCompletionRateEndDate = new Date();
  jobCompletionRateLeftBtnDisabled = false;
  jobCompletionRateRightBtnDisabled = true;
  threeYearsAgo = new Date(this.currentYear - 3, this.currentMonth + 1, this.currentDate);
  aWeekAgo = new Date(this.currentYear, this.currentMonth, this.currentDate - 6);
  threeYearsAndOneWeekAgo = new Date(this.currentYear - 3, this.currentMonth + 1, this.currentDate + 6);
  jobCompletionRateStartDisabled = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.threeYearsAgo) < 0 || differenceInCalendarDays(current, this.aWeekAgo) > 0;
  }
  jobCompletionRateEndDisabled = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.threeYearsAndOneWeekAgo) < 0 || differenceInCalendarDays(current, new Date()) > 0;
  }
  jobCompletionRateOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: tooltipFormatter,
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '20%',
      bottom: '15%'
    },
    legend: {
      textStyle: {
        color: '#919CA3',
        fontSize: 12
      },
      left: 'center',
      top: 20,
      itemWidth: 15,
      itemHeight: 12,
      itemGap: 20,
      padding: [5, 0],
      data: ['当天完成量', '统计总量', '按时完成率']
    },
    xAxis: [
      {
        type: 'category',
        data: ['20200411', '20200412', '20200413', '20200414', '20200415', '20200416', '20200417'],
        axisPointer: {
          type: 'shadow'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3'
        },
        boundaryGap: true
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3',
        }
      },
      {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3',
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '当天完成量',
        type: 'bar',
        data: [1700, 4000, 3100, 1600, 3200, 2600, 1000],
        itemStyle: {
          color: '#C305FB'
        },
        barWidth: 16
      },
      {
        name: '统计总量',
        type: 'bar',
        data: [2200, 4800, 3700, 1900, 3600, 3200, 1200],
        itemStyle: {
          color: '#2359FF'
        },
        barGap: 0,
        barWidth: 16
      },
      {
        name: '按时完成率',
        type: 'line',
        yAxisIndex: 1,
        data: [77.3, 83.3, 83.8, 84.2, 88.9, 81.25, 83.3],
        itemStyle: {
          color: '#F6A52C'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(246, 165, 44, 0.7)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(246, 165, 44, 0)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ]
  };

  orderKitRatePlanGroup = '总装01-M23';
  orderKitRateDateRange = new Subject<Date[]>();
  orderKitRateStartDate = new Date(this.currentYear, this.currentMonth, this.currentDate - 6);
  orderKitRateEndDate = new Date();
  orderKitRateLeftBtnDisabled = false;
  orderKitRateRightBtnDisabled = true;
  orderKitRateOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: tooltipFormatter,
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '20%',
      bottom: '15%'
    },
    legend: {
      textStyle: {
        color: '#919CA3',
        fontSize: 12
      },
      left: 'center',
      top: 20,
      itemWidth: 15,
      itemHeight: 12,
      itemGap: 20,
      padding: [5, 0],
      data: ['标准齐套数', '扩展齐套数', '统计总量', '标准齐套率', '扩展齐套率']
    },
    xAxis: [
      {
        type: 'category',
        data: ['20200411', '20200412', '20200413', '20200414', '20200415', '20200416', '20200417', '20200418', '20200419', '20200420', '20200421', '20200422'],
        axisPointer: {
          type: 'shadow'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3',
        }
      },
      {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3',
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '标准齐套数',
        type: 'bar',
        data: [1700, 4000, 3100, 1600, 3200, 2600, 1000, 1300, 2300, 3300, 4500, 700],
        itemStyle: {
          color: '#C50BF2'
        },
        barWidth: 12
      },
      {
        name: '扩展齐套数',
        type: 'bar',
        data: [2200, 4800, 3700, 1900, 3600, 3200, 1200, 1600, 2300, 3400, 5000, 900],
        itemStyle: {
          color: '#FBDA05'
        },
        barWidth: 12
      },
      {
        name: '统计总量',
        type: 'bar',
        data: [2500, 4900, 4000, 2100, 4100, 3500, 1800, 2700, 2400, 3800, 5200, 1400],
        itemStyle: {
          color: '#2359FF'
        },
        barGap: 0,
        barWidth: 12
      },
      {
        name: '标准齐套率',
        type: 'line',
        yAxisIndex: 1,
        data: [68, 81.6, 77.5, 76.2, 78, 74.3, 55.6, 48.1, 95.8, 97.1, 90, 77.8],
        itemStyle: {
          color: '#F6A52C'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(246, 165, 44, 0.7)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(246, 165, 44, 0)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      },
      {
        name: '扩展齐套率',
        type: 'line',
        yAxisIndex: 1,
        data: [77.3, 83.3, 83.8, 84.2, 88.9, 81.25, 83.3, 81.25, 100, 97.1, 90, 77.8],
        itemStyle: {
          color: '#52BB26'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(82, 187, 38, 0.7)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(82, 187, 38, 0)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ]
  };

  incomingKitRateOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: tooltipFormatter,
    },
    grid: {
      left: '15%',
      right: '15%',
      top: '20%',
      bottom: '15%'
    },
    legend: {
      textStyle: {
        color: '#919CA3',
        fontSize: 12
      },
      left: 'center',
      top: 20,
      itemWidth: 15,
      itemHeight: 12,
      itemGap: 27,
      padding: [5, 0],
      data: ['齐套工单数', '非齐套工单数', '齐套率']
    },
    xAxis: [
      {
        type: 'category',
        // tslint:disable-next-line:max-line-length
        data: ['08:00', '09:00', '10:00', '11:00'],
        axisPointer: {
          type: 'shadow'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3'
        }
      },
      {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#919CA3',
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '齐套工单数',
        type: 'bar',
        stack: 'all',
        data: [12, 17, 27, 32],
        itemStyle: {
          color: '#FBDA05'
        },
        barWidth: 16
      },
      {
        name: '非齐套工单数',
        type: 'bar',
        stack: 'all',
        data: [9, 13, 20, 23],
        itemStyle: {
          color: '#2B5CF7'
        },
        barWidth: 16
      },
      {
        name: '齐套率',
        type: 'line',
        yAxisIndex: 1,
        data: [76, 87, 89, 97],
        itemStyle: {
          color: '#F6A52C'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(246, 165, 44, 0.7)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(246, 165, 44, 0)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ]
  };
  incomingKitRateArr: Array<{title: string, actual: string, target: string, danger: boolean}> = [];

  modalVisible = false;
  noteStr = '';
  noteId = '';
  note = '';

  ngOnInit() {
    setTimeout(() => {
      this.getResourceLoadRateData(this.activeIndex);
    });
    this.loadPlantOption();
    // this.queryNotice();
    // this.getDataCollectionData();
    this.getDashboardData();

    this.orderDeliveryCycleAnalysisMonthRangeChange.pipe(
      debounceTime(500),
      filter((monthRange: Date[]) => monthRange[0] !== null && monthRange[1] !== null),
      switchMap((monthRange: Date[]) => this.queryService.getOrderDeliveryCycleAnalysisData(monthRange, this.commonPlant))
    ).subscribe(res => {
      this.orderDeliveryCycleAnalysisChartOptions.xAxis[0].data = res.xAxisData;
      this.orderDeliveryCycleAnalysisChartOptions.series[0].data = res.produceData;
      this.orderDeliveryCycleAnalysisChartOptions.series[1].data = res.waitData;
      this.orderDeliveryCycleAnalysisChartOptions.series[2].data = res.shippingData;
      this.orderDeliveryCycleAnalysisChartOptions.series[3].data = res.targetData;
      this.orderDeliveryCycleAnalysisChartOptions = Object.assign({}, this.orderDeliveryCycleAnalysisChartOptions);
    });

    this.orderCompletionRateMonthRangeChange.pipe(
      debounceTime(500),
      filter((monthRange: Date[]) => monthRange[0] !== null && monthRange[1] !== null),
      switchMap((monthRange: Date[]) => this.queryService.getOrderCompletionRateOnTimeData(monthRange, this.commonPlant))
    ).subscribe(res => {
      this.orderCompletionRateOptions.xAxis[0].data = res.xAxisData;
      this.orderCompletionRateOptions.series[0].data = res.complete;
      this.orderCompletionRateOptions.series[1].data = res.total;
      this.orderCompletionRateOptions.series[2].data = res.rate;
      this.orderCompletionRateOptions = Object.assign({}, this.orderCompletionRateOptions);
    });

    this.jobCompletionRateDateRange.pipe(
      debounceTime(500),
      filter((dateRange: Date[]) => dateRange[0] !== null && dateRange[1] !== null),
      switchMap((dateRange: Date[]) => this.queryService.getJobCompletionRateData(dateRange, this.jobCompletionRatePlanGroup))
    ).subscribe(res => {
      this.jobCompletionRateOptions.xAxis[0].data = res.xAxisData;
      this.jobCompletionRateOptions.series[0].data = res.complete;
      this.jobCompletionRateOptions.series[1].data = res.total;
      this.jobCompletionRateOptions.series[2].data = res.rate;
      this.jobCompletionRateOptions = Object.assign({}, this.jobCompletionRateOptions);
    });

    this.orderKitRateDateRange.pipe(
      debounceTime(500),
      filter((dateRange: Date[]) => dateRange[0] !== null && dateRange[1] !== null),
      switchMap((dateRange: Date[]) => this.queryService.getOrderKitRateData(dateRange, this.orderKitRatePlanGroup))
    ).subscribe(res => {
      this.orderKitRateOptions.xAxis[0].data = res.xAxisData;
      this.orderKitRateOptions.series[0].data = res.standard;
      this.orderKitRateOptions.series[1].data = res.expand;
      this.orderKitRateOptions.series[2].data = res.total;
      this.orderKitRateOptions.series[3].data = res.standardRate;
      this.orderKitRateOptions.series[4].data = res.expandRate;
      this.orderKitRateOptions = Object.assign({}, this.orderKitRateOptions);
    });

    this.orderDeliveryCycleAnalysisMonthRangeChange.next([this.orderDeliveryCycleAnalysisStartMonth, this.orderDeliveryCycleAnalysisEndMonth]);
    this.orderCompletionRateMonthRangeChange.next([this.orderCompletionRateStartMonth, this.orderCompletionRateEndMonth]);
    this.jobCompletionRateDateRange.next([this.jobCompletionRateStartDate, this.jobCompletionRateEndDate]);
    this.orderKitRateDateRange.next([this.orderKitRateStartDate, this.orderKitRateEndDate]);
    this.getIncomingKitData();
    interval(1000).subscribe(result => {
      if (new Date().getMinutes() === 0 && new Date().getSeconds() === 0) {
        this.dailyActualOutput = new Date().getHours() >= 8 ? (new Date().getHours() - 7) * 412 : 412 * (15 + new Date().getHours());
        this.getIncomingKitData();
      }
    });
    fromEvent(window, 'resize').subscribe(event => {
      const currentUrl = window.location.href;
      const targetUrl = this.router.routeConfig.path || '';
      if (currentUrl.includes(targetUrl)) {
        this.getResourceLoadRateData(this.activeIndex);
      }
    });
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

  getIncomingKitData() {
    this.queryService.getIncomingKitRateData().subscribe(res => {
      this.incomingKitRateOptions.xAxis[0].data = res.xAxisData;
      this.incomingKitRateOptions.series[0].data = res.kit;
      this.incomingKitRateOptions.series[1].data = res.nonKit;
      this.incomingKitRateOptions.series[2].data = res.rate;
      this.incomingKitRateOptions = Object.assign({}, this.incomingKitRateOptions);
      this.incomingKitRateArr = [];
      res.rate.forEach((item, index) => {
        this.incomingKitRateArr.push({
          title: `${index + 1}小时`,
          actual: `${item}%`,
          target: '100%',
          danger: item < 80
        });
      });
    });
  }

  getResourceLoadRateData(index: number) {
    this.queryService.getResourceLoadRateData(index, this.resourceLoadRatePlanGroup).subscribe(res => {
      this.resourceLoadRateOptions.time = index === 0 ? '1w' : '2w';
      this.resourceLoadRateOptions.series = res.data;
      this.resourceLoadRateOptions.yAxis.data = res.yAxis;
      const resource = this.el.nativeElement.querySelector('#tutorial');
      this.render.setProperty(resource, 'innerHTML', '');
      draw(this.resourceLoadRateOptions);
      const child = document.getElementById('tutorial').getElementsByTagName('div')[0];
      child.style.width = '100%';
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

  onOrderDeliveryCycleAnalysisStartMonthChange(date: Date) {
    this.orderDeliveryCycleAnalysisEndMonth = new Date(date.getFullYear() + 1, date.getMonth() - 1, 1);
    this.orderDeliveryCycleAnalysisMonthRangeChange.next([date, this.orderDeliveryCycleAnalysisEndMonth]);
  }

  onOrderDeliveryCycleAnalysisEndMonthChange(date: Date) {
    this.orderDeliveryCycleAnalysisStartMonth = new Date(date.getFullYear() - 1, date.getMonth() + 1, 1);
    this.orderDeliveryCycleAnalysisMonthRangeChange.next([this.orderDeliveryCycleAnalysisStartMonth, date]);
  }

  orderDeliveryCycleAnalysisPreviousMonth() {
    const year = this.orderDeliveryCycleAnalysisStartMonth.getFullYear();
    const month = this.orderDeliveryCycleAnalysisStartMonth.getMonth();
    const previous = new Date(year, month - 1, 1);
    this.orderDeliveryCycleAnalysisRightBtnDisabled = false;
    if (formatDate(previous, 'yyyy-MM', 'zh-Hans') === formatDate(this.threeYearsBefore, 'yyyy-MM', 'zh-Hans')) {
      this.orderDeliveryCycleAnalysisLeftBtnDisabled = true;
    }
    this.orderDeliveryCycleAnalysisStartMonth = previous;
    this.orderDeliveryCycleAnalysisEndMonth = new Date(this.orderDeliveryCycleAnalysisEndMonth.getFullYear(), this.orderDeliveryCycleAnalysisEndMonth.getMonth() - 1, 1);
    this.orderDeliveryCycleAnalysisMonthRangeChange.next([this.orderDeliveryCycleAnalysisStartMonth, this.orderDeliveryCycleAnalysisEndMonth]);
  }

  orderDeliveryCycleAnalysisNextMonth() {
    const year = this.orderDeliveryCycleAnalysisEndMonth.getFullYear();
    const month = this.orderDeliveryCycleAnalysisEndMonth.getMonth();
    const next = new Date(year, month + 1, 1);
    this.orderDeliveryCycleAnalysisLeftBtnDisabled = false;
    if (formatDate(next, 'yyyy-MM', 'zh-Hans') === formatDate(new Date(), 'yyyy-MM', 'zh-Hans')) {
      this.orderDeliveryCycleAnalysisRightBtnDisabled = true;
    }
    this.orderDeliveryCycleAnalysisStartMonth = new Date(this.orderDeliveryCycleAnalysisStartMonth.getFullYear(), this.orderDeliveryCycleAnalysisStartMonth.getMonth() + 1, 1);
    this.orderDeliveryCycleAnalysisEndMonth = next;
    this.orderDeliveryCycleAnalysisMonthRangeChange.next([this.orderDeliveryCycleAnalysisStartMonth, this.orderDeliveryCycleAnalysisEndMonth]);
  }

  onOrderCompletionRateStartMonthChange(date: Date) {
    this.orderCompletionRateEndMonth = new Date(date.getFullYear(), date.getMonth() + 5, 1);
    this.orderCompletionRateMonthRangeChange.next([date, this.orderCompletionRateEndMonth]);
  }

  onOrderCompletionRateEndMonthChange(date: Date) {
    this.orderCompletionRateStartMonth = new Date(date.getFullYear(), date.getMonth() - 5, 1);
    this.orderCompletionRateMonthRangeChange.next([this.orderCompletionRateStartMonth, date]);
  }

  orderCompletionRatePreviousMonth() {
    const year = this.orderCompletionRateStartMonth.getFullYear();
    const month = this.orderCompletionRateStartMonth.getMonth();
    const previous = new Date(year, month - 1, 1);
    this.orderCompletionRateRightBtnDisabled = false;
    if (formatDate(previous, 'yyyy-MM', 'zh-Hans') === formatDate(this.threeYearsBefore, 'yyyy-MM', 'zh-Hans')) {
      this.orderCompletionRateLeftBtnDisabled = true;
    }
    this.orderCompletionRateStartMonth = previous;
    this.orderCompletionRateEndMonth = new Date(this.orderCompletionRateEndMonth.getFullYear(), this.orderCompletionRateEndMonth.getMonth() - 1, 1);
    this.orderCompletionRateMonthRangeChange.next([this.orderCompletionRateStartMonth, this.orderCompletionRateEndMonth]);
  }

  orderCompletionRateNextMonth() {
    const year = this.orderCompletionRateEndMonth.getFullYear();
    const month = this.orderCompletionRateEndMonth.getMonth();
    const next = new Date(year, month + 1, 1);
    this.orderCompletionRateLeftBtnDisabled = false;
    if (formatDate(next, 'yyyy-MM', 'zh-Hans') === formatDate(new Date(), 'yyyy-MM', 'zh-Hans')) {
      this.orderCompletionRateRightBtnDisabled = true;
    }
    this.orderCompletionRateStartMonth = new Date(this.orderCompletionRateStartMonth.getFullYear(), this.orderCompletionRateStartMonth.getMonth() + 1, 1);
    this.orderCompletionRateEndMonth = next;
    this.orderCompletionRateMonthRangeChange.next([this.orderCompletionRateStartMonth, this.orderCompletionRateEndMonth]);
  }

  onJobCompletionRatePlanGroupChange(group: string) {

  }

  onJobCompletionRateStartDateChange(date: Date) {
    this.jobCompletionRateEndDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6);
    this.jobCompletionRateDateRange.next([date, this.jobCompletionRateEndDate]);
  }

  onJobCompletionRateEndDateChange(date: Date) {
    this.jobCompletionRateStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6);
    this.jobCompletionRateDateRange.next([this.jobCompletionRateStartDate, date]);
  }

  jobCompletionRatePreviousDate() {
    const year = this.jobCompletionRateStartDate.getFullYear();
    const month = this.jobCompletionRateStartDate.getMonth();
    const date = this.jobCompletionRateStartDate.getDate();
    const previous = new Date(year, month, date - 1);
    this.jobCompletionRateRightBtnDisabled = false;
    if (formatDate(previous, 'yyyy-MM-dd', 'zh-Hans') === formatDate(this.threeYearsAgo, 'yyyy-MM-dd', 'zh-Hans')) {
      this.jobCompletionRateLeftBtnDisabled = true;
    }
    this.jobCompletionRateStartDate = previous;
    this.jobCompletionRateEndDate = new Date(this.jobCompletionRateEndDate.getFullYear(), this.jobCompletionRateEndDate.getMonth(), this.jobCompletionRateEndDate.getDate() - 1);
    this.jobCompletionRateDateRange.next([this.jobCompletionRateStartDate, this.jobCompletionRateEndDate]);
  }

  jobCompletionRateNextDate() {
    const year = this.jobCompletionRateEndDate.getFullYear();
    const month = this.jobCompletionRateEndDate.getMonth();
    const date = this.jobCompletionRateEndDate.getDate();
    const next = new Date(year, month, date + 1);
    this.jobCompletionRateLeftBtnDisabled = false;
    if (formatDate(next, 'yyyy-MM-dd', 'zh-Hans') === formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans')) {
      this.jobCompletionRateRightBtnDisabled = true;
    }
    this.jobCompletionRateStartDate = new Date(this.jobCompletionRateStartDate.getFullYear(), this.jobCompletionRateStartDate.getMonth(), this.jobCompletionRateStartDate.getDate() + 1);
    this.jobCompletionRateEndDate = next;
    this.jobCompletionRateDateRange.next([this.jobCompletionRateStartDate, this.jobCompletionRateEndDate]);
  }

  onOrderKitRatePlanGroupChange(group: string) {

  }

  onOrderKitRateStartDateChange(date: Date) {
    this.orderKitRateEndDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6);
    this.orderKitRateDateRange.next([date, this.orderKitRateEndDate]);
  }

  onOrderKitRateEndDateChange(date: Date) {
    this.orderKitRateStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6);
    this.orderKitRateDateRange.next([this.orderKitRateStartDate, date]);
  }

  orderKitRatePreviousDate() {
    const year = this.orderKitRateStartDate.getFullYear();
    const month = this.orderKitRateStartDate.getMonth();
    const date = this.orderKitRateStartDate.getDate();
    const previous = new Date(year, month, date - 1);
    this.orderKitRateRightBtnDisabled = false;
    if (formatDate(previous, 'yyyy-MM-dd', 'zh-Hans') === formatDate(this.threeYearsAgo, 'yyyy-MM-dd', 'zh-Hans')) {
      this.orderKitRateLeftBtnDisabled = true;
    }
    this.orderKitRateStartDate = previous;
    this.orderKitRateEndDate = new Date(this.orderKitRateEndDate.getFullYear(), this.orderKitRateEndDate.getMonth(), this.orderKitRateEndDate.getDate() - 1);
    this.orderKitRateDateRange.next([this.orderKitRateStartDate, this.orderKitRateEndDate]);
  }

  orderKitRateNextDate() {
    const year = this.orderKitRateEndDate.getFullYear();
    const month = this.orderKitRateEndDate.getMonth();
    const date = this.orderKitRateEndDate.getDate();
    const next = new Date(year, month, date + 1);
    this.orderKitRateLeftBtnDisabled = false;
    if (formatDate(next, 'yyyy-MM-dd', 'zh-Hans') === formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans')) {
      this.orderKitRateRightBtnDisabled = true;
    }
    this.orderKitRateStartDate = new Date(this.orderKitRateStartDate.getFullYear(), this.orderKitRateStartDate.getMonth(), this.orderKitRateStartDate.getDate() + 1);
    this.orderKitRateEndDate = next;
    this.orderKitRateDateRange.next([this.orderKitRateStartDate, this.orderKitRateEndDate]);
  }

  onResourceLoadRatePlanGroupChange(group: string) {

  }

  tabSwitch(index: number) {
    this.activeIndex = index;
    this.getResourceLoadRateData(index);
  }
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
