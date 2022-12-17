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
  selector: 'base-echart',
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
export class BaseEchartComponent implements OnInit {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() baseShipmentList;
  @Input() factoryList;
  @Input() baseInventoryList;
  @Input() baseInventoryThreshold; // 基地库存阈值

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
    this.baseShipmentList.forEach(item => {
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
        name: '基地出货',
        type: 'bar',
        data: this.baseShipmentList.map(item => item.count)
      },
      {
        name: '基地库存',
        type: 'line',
        label: {
          show: true,
          position: 'left'
        },
        emphasis: {
          focus: 'series'
        },
        data: this.baseInventoryList.map(item => item.count)
      },
      {
        name: '基地阈值',
        type: 'line',
        label: {
          show: true,
          position: 'left'
        },
        emphasis: {
          focus: 'series'
        },
        data: this.baseInventoryThreshold.map(item => item.thresholdValue)
      }
    ];
    const dataObj = {
      legend: ['基地出货', '基地库存', '基地阈值'],
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

  initEchartsView(chartsData?:any) {
    if(chartsData !== undefined) {
      [this.baseShipmentList, this.baseInventoryList, this.baseInventoryThreshold] = chartsData;
    }
    const data = this.initData();
    const options = getOptions({
      data,
      callback: () => {
        this.downloadEvent.emit('base');
      }
    });
    if (options) {
      this.chartOption = options;
    }
  }
}