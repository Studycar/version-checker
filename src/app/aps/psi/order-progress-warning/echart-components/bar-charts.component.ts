import { Component, Input, OnInit } from "@angular/core";
import { QueryService } from "../query.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService } from "ng-zorro-antd";
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';

@Component({
  selector: 'bar-charts',
  template: `
    <div style="width: 100%;height: 100%" [id]="'barCharts' + name" echarts [options]="barCharts"></div>
  `,
  providers: [QueryService],
})
export class BarChartsComponent implements OnInit {
  @Input() name: string;
  @Input() chartsData: any;
  @Input() warningFlag: Boolean;

  barCharts: EChartOption;
  value = '';
  unit = '';
  colorObj = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
    {
      offset: 0,
      color: '#005DCF'
    },
    {
      offset: 1,
      color: '#00CCFF'
    }
  ]);
  constructor(
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private queryService: QueryService,
  ) {
  }
  ngOnInit() {
    this.unit = this.chartsData.unit;
    this.value = this.chartsData.value;
    if (this.warningFlag) {
      this.colorObj =
        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: '#f56c6c'
          },
          {
            offset: 1,
            color: '#ff968c'
          }
        ]);
    } else {
      this.colorObj =
        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: '#005DCF'
          },
          {
            offset: 1,
            color: '#00CCFF'
          }
        ]);
    }
    this.initBarCharts();
  }

  initBarCharts() {
    let option = {};
    option = {
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        show: false,
        type: 'value',
        max: 31
      },
      yAxis: [
        {
          type: 'category',
          inverse: true,
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: '16',
              color: '#000'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: ['连续预警天数']
        }
      ],
      series: [
        {
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
            borderRadius: 30
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{@score}天',
            textStyle: {
              color: '#000',
              fontSize: '12'
            }
          },
          itemStyle: {
            normal: {
              barBorderRadius: 30,
              color: this.colorObj
            }
          },
          barWidth: 20,
          data: [this.value]
        }
      ]
    };
    this.barCharts = option;
  }
}