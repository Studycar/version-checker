import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { QueryService } from "../query.service";
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import * as moment from 'moment';
import { getOptions } from './options';
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonQueryService } from "app/modules/generated_module/services/common-query.service";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: 'book-up-echart',
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
export class BookUpEchartComponent implements OnInit {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() sopPlantQualifiedList;

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

  initData() {
    const xAxis = [];
    this.sopPlantQualifiedList.forEach(item => {
      xAxis.push(item.plantCode);
    });
    const yAxis = [
      {
        type: 'value',
        name: '数量',
        splitNumber: 5
      },
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
    const series = [
      {
        name: '合格品',
        type: 'bar',
        data: this.sopPlantQualifiedList.map(item => item.qualifiedQuantity)
      },
      {
        name: '不合格品',
        type: 'bar',
        data: this.sopPlantQualifiedList.map(item => {
          return `-${item.unqualifiedQuantity}`;
        })
      },
      {
        name: '产量',
        type: 'bar',
        data: this.sopPlantQualifiedList.map(item => item.outputQty)
      },
      {
        name: '合格率',
        type: 'line',
        label: {
          show: true,
          position: 'left'
        },
        emphasis: {
          focus: 'series'
        },
        yAxisIndex: 1,
        data: this.sopPlantQualifiedList.map(item => {
          return item.qualificationRate.replace('%', '');
        })
      }
    ];
    const dataObj = {
      legend: ['合格品', '不合格品', '产量', '合格率'],
      xAxis,
      yAxis,
      series,
      xrotate: 45,
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
      [this.sopPlantQualifiedList] = chartsData;
    }
    const data = this.initData();
    const options = getOptions({
      data,
      callback: null
      // callback: () => {
      //   this.downloadEvent.emit(4);
      // }
    });
    if (options) {
      this.chartOption = options;
    }
  }
}