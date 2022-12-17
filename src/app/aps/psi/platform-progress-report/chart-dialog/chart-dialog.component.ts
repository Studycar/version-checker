import { Component, OnInit, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';


@Component({
  selector: 'chart-dialog',
  templateUrl: './chart-dialog.component.html',
  providers: [QueryService]
})
export class PlatformProgressReportChartDialogComponent implements OnInit {

  private data: any;
  private monthText = 0;

  options: any = {};

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
  ) {

  }
  ngOnInit(): void {
    this.monthText = new Date(this.data.demandDate).getMonth() + 1;

    this.initChartsView();
  }

  initChartsView() {
    let option: any = {};
    let dataObj: any = {};

    dataObj = this.handleData();
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['预测', '接单', '生产', '接单占比', '生产占比']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: dataObj.xAxis,
          axisLabel: {
            align: 'left',
            padding: [0, 0, 0, -25]
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
          }
        },
        {
          name: '单位(%)',
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '预测',
          type: 'bar',
          barWidth: 50,
          barGap: 0,
          emphasis: {
            focus: 'series'
          },
          data: dataObj.data0
        },
        {
          name: '接单',
          type: 'bar',
          barWidth: 50,
          barGap: 0,
          emphasis: {
          focus: 'series'
        },
          data: dataObj.data1
        },
        {
          name: '生产',
          type: 'bar',
          barWidth: 50,
          barGap: 0,
          emphasis: {
          focus: 'series'
          },
          data: dataObj.data2
        },
        {
          name: '接单占比',
          type: 'line',
          yAxisIndex: 1,
          data: dataObj.data3
        },
        {
          name: '生产占比',
          type: 'line',
          yAxisIndex: 1,
          data: dataObj.data4
        }
      ]
    };

    this.options = option;
  }

  handleData(): object {
    const data = this.data;
    const obj = {
      xAxis: [this.getMonthText(this.monthText) + '月', this.getMonthText(this.monthText + 1) + '月', this.getMonthText(this.monthText + 2) + '月'],
      data0: [data.forecastN1, data.forecastN2, data.forecastN3],
      data1: [data.orderReceivedN1, data.orderReceivedN2, data.orderReceivedN3],
      data2: [data.productionN1, data.productionN2, data.productionN3],
      data3: [
        data.receivedProportionN1 ? data.receivedProportionN1.replace('%', '') : data.receivedProportionN1,
        data.receivedProportionN2 ? data.receivedProportionN2.replace('%', '') : data.receivedProportionN2,
        data.receivedProportionN3 ? data.receivedProportionN3.replace('%', '') : data.receivedProportionN3,
      ],
      data4: [
        data.productionProportionN1 ? data.productionProportionN1.replace('%', '') : data.productionProportionN1,
        data.productionProportionN2 ? data.productionProportionN2.replace('%', '') : data.productionProportionN2,
        data.productionProportionN3 ? data.productionProportionN3.replace('%', '') : data.productionProportionN3,
      ],
    };
    return obj;
  }

  getMonthText(month): string {
    return month > 10 ? `${month}` : `0${month}`;
  }

  close() {
    this.modal.destroy();
  }
}
