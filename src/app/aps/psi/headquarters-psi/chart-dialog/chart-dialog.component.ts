import { Component, OnInit, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';


@Component({
  selector: 'chart-dialog',
  templateUrl: './chart-dialog.component.html',
  providers: [QueryService]
})
export class HeadquartersPsiChartDialogComponent implements OnInit {

  private data: any;
  private type: number;
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
    switch(this.type) {
      case 1:
        dataObj = this.handleHistoryData();
        option = {
          grid: {
            left: '5%',
            right: '5%',
            bottom: '30',
            top: '20',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: dataObj.xAxis
          },
          yAxis: {
            type: 'value'
          },
          tooltip: {
            trigger: 'axis'
          },
          series: [{
            data: dataObj.data,
            type: 'line'
          }],
        };
        break;
      case 2:
        dataObj = this.handleCurrentData();
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['规划', '当前', '完成预算%']
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
              data: ['分销规划\n当前已分销', '生产规划\n当前已完成', '规划库存\n当前库存'],
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
              name: '规划',
              type: 'bar',
              barWidth: 50,
              barGap: 0,
              emphasis: {
                focus: 'series'
              },
              data: dataObj.data0
            },
            {
              name: '当前',
              type: 'bar',
              barWidth: 50,
              barGap: 0,
              emphasis: {
              focus: 'series'
            },
              data: dataObj.data1
            },
            {
              name: '完成预算%',
              type: 'line',
              yAxisIndex: 1,
              data: dataObj.data2
            }
          ]
        };
        break;

      case 3:
        dataObj = this.handleFutureData();
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['生产规划', '分销', '库存', '周转天数']
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
              name: '生产规划',
              type: 'bar',
              barWidth: 50,
              barGap: 0,
              emphasis: {
                focus: 'series'
              },
              data: dataObj.data0
            },
            {
              name: '分销',
              type: 'bar',
              barWidth: 50,
              barGap: 0,
              emphasis: {
                focus: 'series'
              },
              data: dataObj.data1
            },
            {
              name: '库存',
              type: 'bar',
              barWidth: 50,
              barGap: 0,
              emphasis: {
                focus: 'series'
              },
              data: dataObj.data2
            },
            {
              name: '周转天数',
              type: 'line',
              yAxisIndex: 1,
              data: dataObj.data3
            }
          ]
        };
        break;
    }
    this.options = option;
  }

  handleHistoryData(): object {
    const xAxis = [];
    const data = [];
    // 获取一整年的月份
    for (let i = 12; i > 0; i--) {
      const date = new Date(this.data.demandDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const template = month - i;
      const calculateMonth = template < 1 ? 12 + template : template;
      xAxis.push(`${template < 1 ? year - 1 : year}-${calculateMonth < 10 ? '0' + calculateMonth : calculateMonth}`);
      // xAxis.push(moment(this.data.demandDate).subtract(i, 'months').format('YYYY-MM'));
    }

    for (let j = 0; j < 12; j++) {
      data.push(this.data['monthSaleL' + (12 - j)]);
    }
    const obj = {
      xAxis: xAxis,
      data: data
    };
    return obj;
  }

  handleCurrentData(): object {
    const data = this.data;
    const obj = {
      data0: [data.forecastN, data.productionN, data.onhandN],
      data1: [data.monthSaleN, data.monthProductionN, data.monthOnhandN],
      data2: [
        Number(data.forecastN) ? (data.monthSaleN / data.forecastN).toFixed(2) : 0,
        Number(data.productionN) ? (data.monthProductionN / data.productionN).toFixed(2) : 0,
        Number(data.onhandN) ? (data.monthOnhandN / data.onhandN).toFixed(2) : 0
      ]
    };
    return obj;
  }

  handleFutureData(): object {
    const data = this.data;
      const obj = {
        xAxis: [],
        data0: [],
        data1: [],
        data2: [],
        data3: []
      };
      for (let i = 0; i < 3; i++) {
        const month = this.monthText + i > 12 ? this.monthText + i - 12 : this.monthText + i;
        obj.xAxis.push(Number(month) + '月');
        obj.data0.push(data['productionN' + (i + 1)]);
        obj.data1.push(data['forecastN' + (i + 1)]);
        obj.data2.push(data['onhandN' + (i + 1)]);
        obj.data3.push(data['inventoryRatioN' + (i + 1)]);
      }
      return obj;
  }

  close() {
    this.modal.destroy();
  }
}
