import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { CommonQueryService } from "app/modules/generated_module/services/common-query.service";
import { NzMessageService } from "ng-zorro-antd";
import { QueryService } from "../query.service";
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import * as moment from 'moment';
import { getOptions } from './options';

@Component({
  selector: 'factory-echart',
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
export class FactoryEchartComponent implements OnInit {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() factoryList = [];
  @Input() centerList = [];
  @Input() straightList = [];
  @Input() factoryInventoryList = [];
  @Input() factoryInventoryNow; // 工厂每日初始库存
  @Input() factoryInventoryThreshold; // 9.工厂库存阈值

  @Output() downloadEvent = new EventEmitter<string>();

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
    this.factoryList.forEach(item => {
      xAxis.push(moment(item.countDate).format('MM-DD'));
    });
    const yAxis = [
      {
        type: 'value',
        name: '数量'
      }
    ];
    const series = [
      {
        name: '工厂生产',
        type: 'bar',
        data: this.factoryList.map(item => item.count)
      },
      {
        name: '中转',
        type: 'bar',
        data: this.centerList.map(item => item.count)
      },
      {
        name: '直发',
        type: 'bar',
        data: this.straightList.map(item => item.count),
        itemStyle: {
          normal: {
            color: '#2f4554'
          }
        }
      },
      {
        name: '工厂库存',
        type: 'line',
        label: {
          show: true,
          position: 'left'
        },
        emphasis: {
          focus: 'series'
        },
        data: this.factoryInventoryList.map(item => item.count)
      },
      {
        name: '工厂阈值',
        type: 'line',
        label: {
          show: true,
          position: 'left'
        },
        emphasis: {
          focus: 'series'
        },
        data: this.factoryInventoryThreshold.map(item => item.thresholdValue)
      }
    ];
    const dataObj = {
      legend: ['工厂生产', '中转', '直发', '工厂库存', '工厂阈值'],
      xAxis,
      yAxis,
      series,
      grid: {
        left: 80
      },
      dataView: true,
      magicType: true,
      myTool1: true
    };
    return dataObj;
  }

  initEchartsView(chartsData?: any) {
    if (chartsData !== undefined) {
      [this.factoryList, this.centerList, this.straightList, this.factoryInventoryList, this.factoryInventoryThreshold] = chartsData;
    }
    const data = this.initData();
    const options = getOptions({
      data,
      callback: () => {
        this.downloadEvent.emit('factory');
      }
    });
    if (options) {
      this.chartOption = options;
    }
  }


}