import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { QueryService } from "../query.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService } from "ng-zorro-antd";
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';

@Component({
  selector: 'gauge-charts',
  template: `
    <div style="width: 100%;height: 80%" [id]="'gaugeChart' + name" echarts [options]="myChart"></div>
    <div class="name">{{ title }}</div>
  `,
  styles: [`
    .name {
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: -20px;
    }
  `],
  providers: [QueryService],
})
export class GaugeChartsComponent implements OnInit {
  @Input() name: string;
  @Input() title;
  @Input() chartsData: any;
  @Input() warningFlag: Boolean;
  myChart: EChartOption;
  textColor = '#00b6fd';
  value = '';
  unit = '';
  colorObj = [
    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 0,
        color: '#005DCF'
      },
      {
        offset: 1,
        color: '#00CCFF'
      }
    ]),
    [
      [
        1,
        new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: 'rgba(0, 182, 253, 0)'
          },
          {
            offset: 0.5,
            color: 'rgba(0, 182, 253, .2)'
          },
          {
            offset: 1,
            color: 'rgba(0, 182, 253, .4)'
          }
        ])
      ]
    ]
  ];

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
      this.colorObj = [
        new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: '#f56c6c'
          },
          {
            offset: 1,
            color: '#f59e96'
          }
        ]),
        [
          [
            1,
            new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: 'rgba(245, 108, 108, 0)'
              },
              {
                offset: 0.5,
                color: 'rgba(245, 108, 108, .2)'
              },
              {
                offset: 1,
                color: 'rgba(245, 108, 108, .4)'
              }
            ])
          ]
        ]
      ];
      this.textColor = '#f56c6c';
    } else {
      this.colorObj = [
        new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: '#005DCF'
          },
          {
            offset: 1,
            color: '#00CCFF'
          }
        ]),
        [
          [
            1,
            new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: 'rgba(0, 182, 253, 0)'
              },
              {
                offset: 0.5,
                color: 'rgba(0, 182, 253, .2)'
              },
              {
                offset: 1,
                color: 'rgba(0, 182, 253, .4)'
              }
            ])
          ]
        ]
      ];
      this.textColor = '#00b6fd';
    }
    this.initGaugeCharts();
  }

  initGaugeCharts() {
    let option = {};
    const max = 100;
    const value = Number(this.value) < 100 ? this.value : 100;
    const rate = this.value;
    option = {
      title: [
        {
          text: '{b|' + rate + this.unit + '}',
          show: true,
          x: 'center',
          y: 'center',
          textStyle: {
            rich: {
              a: {
                fontSize: 30,
                color: '#000',
                padding: [0, 0, 10, 0]
              },
              b: {
                fontSize: 40,
                color: this.textColor,
                fontFamily: 'alibabaPuhuiM'
              }
            }
          }
        }
      ],
      polar: {
        center: ['50%', '50%'],
        radius: ['65%', '80%']
      },
      angleAxis: {
        max: max,
        show: false
      },
      radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      series: [
        {
          name: '',
          type: 'bar',
          roundCap: true,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(19, 84, 146, .2)'
          },
          data: [value],
          coordinateSystem: 'polar',
          itemStyle: {
            normal: {
              color: this.colorObj[0]
            }
          }
        },
        {
          name: '',
          type: 'gauge',
          radius: '54%',
          axisLine: {
            lineStyle: {
              color: this.colorObj[1],
              width: 1
            }
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          itemStyle: {
            show: false
          },
          detail: {
            show: false
          },
          data: [],
          pointer: {
            show: false
          }
        }
      ]
    };
    this.myChart = option;
  }
}