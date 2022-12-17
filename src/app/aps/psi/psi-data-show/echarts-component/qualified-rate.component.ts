import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { QueryService } from "../query.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonQueryService } from "app/modules/generated_module/services/common-query.service";
import { NzMessageService } from "ng-zorro-antd";
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import * as moment from 'moment';
import { getOptions } from './options';

@Component({
  selector: 'qualified-rate-echart',
  template: `
    <div class="chartsView">
      <span class="charts-title">{{title | translate}}</span>
      <span class="charts-text">{{subTitle}}</span>
      <div echarts [options]="chartOption" class="factory-echarts-view" [style]="0"></div>
    </div>
  `,
  styleUrls: ['./echart.less'],
  providers: [QueryService]
})
export class QualifiedRateEchartComponent implements OnInit {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() itemQualifiedRateList: Object;

  @Output() downloadEvent = new EventEmitter<any>();

  chartOption: EChartOption;
  constructor(
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryService: QueryService,
  ) {
  }
  ngOnInit() {
    this.initEchartsView();
  }

  newList(type, list) {
    const array = [];
    list.forEach((item) => {
      if (item.divisionValue === type) {
        array.push(item);
      }
    });
    array.sort(function (a, b) {
      return a.creationDate < b.creationDate ? -1 : 1;
    });
    return array;
  }

  initData() {
    const keys = [];
    const list = [];
    const seriesName = [];
    for (const key in this.itemQualifiedRateList) {
      if (Object.hasOwnProperty.call(this.itemQualifiedRateList, key)) {
        keys.push(key);
        if (this.itemQualifiedRateList[key].length) {
          this.itemQualifiedRateList[key].forEach((item) => {
            list.push(item);
          });
        }
      }
    }
    const values = Object.values(this.itemQualifiedRateList);
    if (values.length) {
      values[0].forEach((item) => {
        seriesName.push(item.divisionValue);
      });
    }
    keys.sort(function (a, b) {
      return moment(a).isBefore(b) ? -1 : 1;
    });

    const xAxis = keys;
    const yAxis = [
      {
        type: 'value',
        name: '合格率',
        splitNumber: 5,
        max: 100,
        min: 0,
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ];
    const series = seriesName.length ? seriesName.map((item) => {
      return {
        name: item,
        type: 'line',
        label: {
          show: true,
          position: 'left'
        },
        emphasis: {
          focus: 'series'
        },
        data: this.newList(item, list).map(item => {
          return item.qualificationRate.replace('%', '');
        })
      };
    }) : [];
    const dataObj = {
      legend: seriesName,
      xAxis,
      yAxis,
      series,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      }
    };
    return dataObj;
  }

  initEchartsView(chartsData?: any) {
    if(chartsData !== undefined) {
      [this.itemQualifiedRateList] = chartsData;
    }
    const data = this.initData();
    const options = getOptions({
      data,
      callback: null
      // callback: () => {
      //   this.downloadEvent.emit('qualified');
      // }
    });
    if (options) {
      this.chartOption = options;
    }
  }
}