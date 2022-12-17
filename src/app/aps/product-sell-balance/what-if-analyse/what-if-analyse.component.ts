import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../layout/pro/pro.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { WhatIfAnalyseService } from './what-if-analyse.service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';

@Component({
  selector: 'what-if-analyse',
  templateUrl: './what-if-analyse.component.html',
  styleUrls: ['./what-if-analyse.component.less'],
  providers: [WhatIfAnalyseService],
})
export class WhatIfAnalyseComponent extends CustomBaseContext implements OnInit {
  gridHeight = 300;

  /** 搜索下拉选项 */
  BUOptions = [];

  columns: any[];
  queryParams = {
    defines: [
      {
        field: 'BU',
        title: '事业部',
        ui: { type: UiType.select, options: this.BUOptions },
      },
      {
        field: 'cycle',
        title: '周期',
        ui: { type: UiType.dateTimeRange },
      },
    ],
    values: {
      BU: 0,
      cycle: 0,
    },
  };

  /** echart 参数 */
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
      data: ['版本1'],
    },
    xAxis: [
      {
        type: 'category',
        data: ['销量', '生产计划', '月末库存', '销售额', '生产成本', '物流费用', '利润', '库存占用金额'],
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
        name: '版本1',
        type: 'bar',
        data: [1700, 4000, 3100, 1600, 3200, 2600, 1000, 1300],
        itemStyle: {
          color: '#FBDA05'
        },
        barWidth: 16
      },
      {
        name: '按时完成率',
        type: 'line',
        yAxisIndex: 1,
        data: [77.3, 83.3, 83.8, 84.2, 88.9, 81.25, 83.3, 81.25],
        itemStyle: {
          color: '#F6A52C'
        },
        // areaStyle: {
        //   color: {
        //     type: 'linear',
        //     x: 0,
        //     y: 0,
        //     x2: 0,
        //     y2: 1,
        //     colorStops: [{
        //       offset: 0, color: 'rgba(246, 165, 44, 0.7)' // 0% 处的颜色
        //     }, {
        //       offset: 1, color: 'rgba(246, 165, 44, 0)' // 100% 处的颜色
        //     }],
        //     global: false // 缺省为 false
        //   }
        // }
      }
    ]
  };
  orderCompletionRateOptions2 = {
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
      data: ['版本1'],
    },
    xAxis: [
      {
        type: 'category',
        data: ['销量', '生产计划', '月末库存', '销售额', '生产成本', '物流费用', '利润', '库存占用金额'],
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
        name: '版本1',
        type: 'bar',
        data: [1700, 4000, 3100, 1600, 3200, 2600, 1000, 1300],
        itemStyle: {
          color: '#FBDA05'
        },
        barWidth: 16
      },
      {
        name: '按时完成率',
        type: 'line',
        yAxisIndex: 1,
        data: [77.3, 83.3, 83.8, 84.2, 88.9, 81.25, 83.3, 81.25],
        itemStyle: {
          color: '#2359FF'
        },
        // areaStyle: {
        //   color: {
        //     type: 'linear',
        //     x: 0,
        //     y: 0,
        //     x2: 0,
        //     y2: 1,
        //     colorStops: [{
        //       offset: 0, color: 'rgba(246, 165, 44, 0.7)' // 0% 处的颜色
        //     }, {
        //       offset: 1, color: 'rgba(246, 165, 44, 0)' // 100% 处的颜色
        //     }],
        //     global: false // 缺省为 false
        //   }
        // }
      }
    ]
  };
  option = {
    title: {
      text: '基础雷达图'
    },
    tooltip: {},
    legend: {
      data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
    },
    radar: {
      // shape: 'circle',
      name: {
        textStyle: {
          color: '#fff',
          backgroundColor: '#999',
          borderRadius: 3,
          padding: [3, 5]
        }
      },
      indicator: [
        { name: '销售（sales）', max: 6500},
        { name: '管理（Administration）', max: 16000},
        { name: '信息技术（Information Techology）', max: 30000},
        { name: '客服（Customer Support）', max: 38000},
        { name: '研发（Development）', max: 52000},
        { name: '市场（Marketing）', max: 25000}
      ]
    },
    series: [{
      name: '预算 vs 开销（Budget vs spending）',
      type: 'radar',
      // areaStyle: {normal: {}},
      data: [
        {
          value: [4300, 10000, 28000, 35000, 50000, 19000],
          name: '预算分配（Allocated Budget）'
        },
        {
          value: [5000, 14000, 28000, 31000, 42000, 21000],
          name: '实际开销（Actual Spending）'
        }
      ]
    }]
  };

  constructor(
    private pro: BrandService,
    private translateService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appService: AppConfigService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private wiaService: WhatIfAnalyseService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: translateService,
      msgSrv: msgSrv,
      appConfigSrv: appService,
    });
  }

  ngOnInit() {
    this.columns = [
      {
        field: 'BU',
        headerName: '事业部',
        pinned: 'left',
      },
      {
        field: 'cycle',
        headerName: '周期',
        pinned: 'left',
      },
      {
        field: 'version',
        headerName: '版本',
        pinned: 'left',
      },
      {
        field: 'version',
        headerName: '销量',
      },
      {
        field: 'version',
        headerName: '生产计划',
      },
      {
        field: 'version',
        headerName: '月末库存',
      },
      {
        field: 'version',
        headerName: '销售额',
      },
      {
        field: 'version',
        headerName: '生产成本',
      },
      {
        field: 'version',
        headerName: '物流费用',
      },
      {
        field: 'version',
        headerName: '利润',
      },
      {
        field: 'version',
        headerName: '库存占用金额',
      },
    ];
    // In18列
    this.headerNameTranslate(this.columns);
    this.query();
  }

  query(): void {
    this.wiaService.search().subscribe(res => {
        this.gridData = res.data;
      },
    );
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
