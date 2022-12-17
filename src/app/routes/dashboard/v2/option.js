/*****
 * 本文件已经被弃用了，请勿维护，现在改用dashboard-service.ts
 * 
 * 
 * 
 */

import { mockData, draw } from './ganter';

const Options = {
  _getOrderCompletion,
  _getOrderCompletionRate,
  _getOrderProductionCycle,
  _getWorkCompletionRate,
  _getWorkChangeCompletionRate,
  _getOrderRate,
  _getGanter
}
// 获取订单完成量数据
function _getOrderCompletion(resArr) {
  // 渐变起点
  var pointStart = [
    0.5 - 0.5 * Math.cos(1) * Math.sin(1),
    0.5 + 0.5 * Math.cos(1) * Math.cos(1)
  ];
  // 渐变终点
  var pointEnd = [
    0.5 - 0.5 * Math.sin(1),
    0.5 + 0.5 * Math.cos(1)
  ];
  var options = {
    backgroundColor: '#fff',
    title: {
      text: '单位：台/件',
      left: 'right',
      top: '10%',
      textStyle: {
        color: '#919CA3',
        fontSize: 14,
        align: 'center',
        fontWeight: 100
      }
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function (params, ticket) {
        var res;
        if (params.name === '年度') {
          res = '<div><p>年度总数量：' + resArr.Result[0].YEAR_TOTAL + '</p></div>';
          res += '<div><p>年度完成数：' + resArr.Result[0].YEAR_FINISH_TOTAL + '</p></div>';
          res += '<div><p>年度完成率：' + resArr.Result[0].YEAR_FINISH_RATE + '%</p></div>';
        } else if (params.name === '月度') {
          res = '<div><p>月度总数量：' + resArr.Result[0].MONTH_TOTAL + '</p></div>';
          res += '<div><p>月度完成数：' + resArr.Result[0].MONTH_FINISH_TOTAL + '</p></div>';
          res += '<div><p>月度完成率：' + resArr.Result[0].MONTH_FINISH_RATE + '%</p></div>';
        } else if (params.name === '年度未满足率') {
          res = '<div><p>年度总数量：' + resArr.Result[0].YEAR_TOTAL + '</p></div>';
          res += `<div><p>年度未完成数： ${resArr.Result[0].YEAR_TOTAL - resArr.Result[0].YEAR_FINISH_TOTAL} </p></div>`;
          res += '<div><p>年度未完成率：' + (100 - resArr.Result[0].YEAR_FINISH_RATE).toFixed(2) + '%</p></div>';
        } else if (params.name === '月度未满足率') {
          res = '<div><p>月度总数量：' + resArr.Result[0].MONTH_TOTAL + '</p></div>';
          res += `<div><p>月度未完成数： ${resArr.Result[0].MONTH_TOTAL - resArr.Result[0].MONTH_FINISH_TOTAL} </p></div>`;
          res += '<div><p>月度未完成率：' + (100 - resArr.Result[0].MONTH_FINISH_RATE).toFixed(2) + '%</p></div>';
        }
        return res;
      },
    },
    legend: {
      orient: 'vertical',
      top: 'middle',
      itemHeight: 10,
      itemWidth: 10,
      position: 'center',
      textStyle: {
        fontSize: 13,
        fontWeight: 400,
      },
      formatter: function (item) {
        if (item === '年度') {
          return `年度   ${resArr.Result[0].YEAR_TOTAL}`
        } else {
          return `月度   ${resArr.Result[0].MONTH_TOTAL}`
        }
      },
      data: [{
        name: '年度',
        icon: 'rect'
      }, {
        name: '月度',
        icon: 'rect'
      }],
      padding: [7, 9]
    },
    series: [{
      name: '占比',
      type: 'pie',
      start1: 270, // 环图起始位置：正下发
      radius: ['50%', '60%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          // position: 'center',
          // formatter: ({
          //     data
          // }) => `        ${data.total || 0}\n\n`
        },
        emphasis: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [{
        name: '年度',
        value: resArr.Result[0].YEAR_FINISH_RATE,
        total: resArr.Result[0].YEAR_TOTAL,
        label: {
          normal: {
            fontSize: 12,
            color: '#585F6E',
            fontWeight: 'bolder',
          }
        },
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: pointStart[0],
              y: pointStart[1],
              x2: pointEnd[0],
              y2: pointEnd[1],
              colorStops: [
                // !! 在此添加渐变过程色 !!
                {
                  offset: 0,
                  color: '#B8A7EB'
                },
                {
                  offset: 1,
                  color: '#B8A7EB'
                }
              ]
            },
            shadowColor: 'rgba(34,192,245,0.8)',
            // shadowBlur: 10
          }
        }
      }, {
        name: '年度未满足率',
        value: (100 - resArr.Result[0].YEAR_FINISH_RATE).toFixed(2),
        label: {
          normal: {
            show: false,
            fontSize: 0
          }
        },
        itemStyle: {
          normal: {
            color: '#eee'
          },
          emphasis: {
            color: '#eee'
          }
        },
        hoverAnimation: false
      }]
    },
    {
      name: '占比',
      type: 'pie',
      start1: 270, // 环图起始位置：正下发
      radius: ['40%', '50%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'right',
          // bottom:'10%',
          // position: ['50%', '50%'],
          // formatter: ({
          //     data
          // }) => `\n\n        ${data.total}`
        },
        emphasis: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [{
        name: '月度',
        value: resArr.Result[0].MONTH_FINISH_RATE,
        total: resArr.Result[0].MONTH_TOTAL,
        label: {
          normal: {
            fontSize: 12,
            color: '#585F6E',
            fontWeight: '600',
          }
        },
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: pointStart[0],
              y: pointStart[1],
              x2: pointEnd[0],
              y2: pointEnd[1],
              colorStops: [
                // !! 在此添加渐变过程色 !!
                {
                  offset: 0,
                  color: '#6D8EF2'
                },
                {
                  offset: 1,
                  color: '#6D8EF2'
                }
              ]
            },
            shadowColor: 'rgba(34,192,245,0.8)',
            // shadowBlur: 10
          }
        }
      }, {
        name: '月度未满足率',
        value: (100 - resArr.Result[0].MONTH_FINISH_RATE).toFixed(2),
        label: {
          normal: {
            show: false,
            fontSize: 0
          }
        },
        itemStyle: {
          normal: {
            color: '#eee'
          },
          emphasis: {
            color: '#eee'
          }
        },
        hoverAnimation: false
      }]
    }
    ]
  }
  if (resArr.TotalCount === 0) { return false } else { return options }
}

// 获取按时完成率
function _getOrderCompletionRate(res) {
  var { YEAR_TOTAL, FINISH_RATE, UNFINISH_RATE, CANCEL_RATE } = res.Result[0];
  var echartData = [{
    value: FINISH_RATE,
    name: '已完成'
  }, {
    value: UNFINISH_RATE,
    name: '未完成'
  }, {
    value: CANCEL_RATE,
    name: '已取消'
  }]
  var rich = {
    total: {
      color: "#434D54",
      fontSize: 14,
      align: 'center',
      padding: [5, 0]
    },
    white: {
      align: 'center',
      fontSize: 12,
      padding: [0, 4]
    },
    blue: {
      fontSize: 12,
      align: 'center',
    },
    hr: {
      borderColor: '#0b5263',
      width: '100%',
      borderWidth: 1,
      height: 0,
    }
  }
  var options = {
    backgroundColor: '#fff',
    title: {
      text: '单位：台/件',
      left: 'right',
      top: '10%',
      textStyle: {
        color: '#919CA3',
        fontSize: 14,
        align: 'center',
        fontWeight: 100
      }
    },
    color: ['#4CC76A', '#F2B600', '#FA8057'],
    legend: {
      selectedMode: false,
      formatter: (name) => {
        return '{total|订单完成量\n' + YEAR_TOTAL + '}';
      },
      data: [echartData[0].name],
      left: 'center',
      top: 'center',
      icon: 'none',
      align: 'center',
      textStyle: {
        color: "#434D54",
        fontSize: 14,
        rich: rich
      },
    },
    // tooltip: {
    //   trigger: 'item',
    //   formatter: "{a} <br/>{b} : {c} ({d}%)"
    // },
    // calculable: true,
    series: [{
      name: '订单完成量',
      type: 'pie',
      radius: [78, 95],
      label: {
        normal: {
          formatter: (params, ticket, callback) => {
            return '{white|' + params.name + '} \n {blue|' + params.data.value + '%}  ';
          },
          rich: rich,
          show: true,
        },
      },
      labelLine: {
        normal: {
          length: 15,
          lineStyle: {
            color: '#0b5263'
          }
        }
      },
      roseType: 'area',
      data: echartData
    }]
  }
  if (res.TotalCount === 0) { return false } else { return options }

}

// 订单生产周期(生产口径)
/**
 *
 * @param {*} res 数据源
 * @param {*} barWidth 条形图宽度
 * @param {*} rotateVal X轴坐标倾斜角度
 */
function _getOrderProductionCycle(res, barWidth = 20, rotateVal = 40) {
  var params = {
    _XArr: [],
    _YArr: [],
    STANDARD: res.Result[0].STANDARD,
  }
  for (let item of res.Result[0].DATA) {
    params._XArr.push(item.X)
    params._YArr.push(item.Y)
  }
  var { _XArr, _YArr, STANDARD } = params;
  var maxValue = Math.max(..._YArr) > STANDARD ? Math.max(..._YArr) : STANDARD;
  var options = {
    // color:colorList,
    backgroundColor: '#fff',
    title: {
      text: '单位：天',
      left: 'right',
      top: '10%',
      textStyle: {
        color: '#919CA3',
        fontSize: 14,
        align: 'center',
        fontWeight: 100
      }
    },
    legend: {
      show: false,
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: "{c}"
    },
    grid: {
      left: '2%',
      right: '10%',
      bottom: '3%',
      height: '80%',
      width: '95%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#', //左边线的颜色
        }
      },
      axisLabel: {
        // splitNumber: 15,
        interval: 0,
        rotate: rotateVal,
        show: true,
        textStyle: {
          fontSize: 10,
        },
      },
      data: _XArr,

      axisTick: {
        alignWithLabel: false
      },
      axisPointer: {
        show: false,
      },
    }],
    yAxis: [{
      show: true,
      type: 'value',
      name: '',
      max: maxValue,
      splitLine: { //分割线
        show: true,
        color: "#EDF0F2",
        lineStyle: {
          color: '#EDF0F2'
        }
      },
      axisLabel: {
        interval: 0,
        rotate: 0,
        show: true,
        splitNumber: 30,
        textStyle: {
          fontSize: 12,
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    ],
    series: [{
      markLine: {
        symbol: 'none',
        itemStyle: {
          normal: {
            lineStyle: {
              type: 'dash',
              color: '#F25555'
            },
            label: {
              show: true,
              position: ''
            }
          }
        },
        data: [{
          name: 'Y 轴值为 100 的水平线',
          yAxis: STANDARD
        }]
      },
      name: '',
      type: 'bar',
      barWidth: barWidth, //柱图宽度
      data: _YArr,
      itemStyle: {
        normal: {
          color: ['#499DF2'],
          label: {
            show: false,
            position: 'top',
            formatter: '{c}%'
          }
        }
      }
    },
    ]
  };
  if (res.TotalCount === 0) { return false } else { return options }
}
// 作业变动率
function _getWorkCompletionRate(res) {
  var _params = {
    _XArr: [],
    detail: [],
    STANDARD: res.Result[0].STANDARD
  };
  var { _XArr, detail, STANDARD } = _params
  for (let item of res.Result[0].DATA) {
    _params._XArr.push(item.X);
    _params.detail.push({
      value: item.Y,
      projectTeam: item.MO_CHANGE_DETAIL[0].VALUE,
      time: item.MO_CHANGE_DETAIL[1].VALUE,
      workNum: item.MO_CHANGE_DETAIL[2].VALUE,
      unOrderRate: item.CHANGE_RATE[0].VALUE,
      orderRate: item.CHANGE_RATE[1].VALUE
    })
  }
  var options = {
    backgroundColor: '#fff',
    title: {
      text: '作业变动率',
      left: 'center',
      top: '4%',
      textStyle: {
        color: '#919CA3',
        fontSize: 14,
        align: 'center',
        fontWeight: 600
      }
    },
    legend: {
      show: false,
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function (params) {
        if (params.name === '标准线') { return }
        // var res = '<div><p>计划组：' + params.data.projectTeam + '</p></div>';
        // res += '<div><p>时间：' + params.data.time + '</p></div>';
        // res += '<div><p>作业数：' + params.data.workNum + '</p></div>';
        // res += '<div><p>不含顺序：' + params.data.unOrderRate + '%</p></div>';
        // res += '<div><p>含顺序：' + params.data.orderRate + '%</p></div>';
        var _res = "";
        for (let item of res.Result[0].DATA[params.dataIndex].MO_CHANGE_DETAIL) {
          _res += `<div><p>${item.KEY}：${item.VALUE}</p></div>`;
        }
        for (let item of res.Result[0].DATA[params.dataIndex].CHANGE_RATE) {
          _res += `<div><p>${item.KEY}：${item.VALUE}%</p></div>`;
        }
        return _res;
      },
    },
    toolbox: {
      show: true,
      feature: {
        mark: {
          show: true
        },
      }
    },
    grid: {
      left: '2%',
      right: '10%',
      bottom: '3%',
      height: '80%',
      width: '90%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#', //左边线的颜色
        }
      },
      axisLabel: {
        interval: 0,
        rotate: 40,
        show: true,
        splitNumber: 20,

        textStyle: {
          fontSize: 10,
        },

      },

      data: _XArr,

      axisTick: {

        alignWithLabel: false
      },
      axisPointer: {
        show: false,
      },
    }],
    yAxis: [{
      show: true,
      type: 'value',
      max: 100,
      // scale:true,
      name: '',
      splitLine: { //分割线
        show: true,
        color: "#EDF0F2",
        lineStyle: {
          color: '#EDF0F2'
        }
      },
      axisLabel: {
        formatter: '{value}%',
        interval: 0,
        rotate: 0,
        show: true,
        splitNumber: 30,
        textStyle: {
          fontSize: 12,
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }

    },
    ],
    series: [{
      markLine: {
        symbol: 'none',
        itemStyle: {
          normal: {
            lineStyle: {
              type: 'dash',
              color: '#F25555',
              fontSize: 10
            },
            label: {
              show: true,
              position: '',
              formatter: '{c}%',
              padding: [1, 0, 0, 320]
            }
          }
        },
        data: [{
          name: '标准线',
          yAxis: STANDARD
        }]
      },
      name: '',
      type: 'bar',
      barWidth: 10, //柱图宽度
      data: detail,
      itemStyle: {
        normal: {
          color: ['#6D8EF2'],
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            textStyle: {
              fontSize: 10,
            }
          }
        }
      }
    },]
  };
  if (res.TotalCount === 0) { return false } else { return options }
}
// 作业完成率
function _getWorkChangeCompletionRate(res) {
  var _params = {
    _XArr: [],
    detail: [],
    STANDARD: res.Result[0].STANDARD
  };
  var { _XArr, detail, STANDARD } = _params
  for (let item of res.Result[0].DATA) {
    _params._XArr.push(item.X);
    _params.detail.push({
      value: item.Y,
      projectTeam: item.MO_FINISH_DETAIL[0].VALUE,
      time: item.MO_FINISH_DETAIL[1].VALUE,
      finishRate: item.MO_FINISH_DETAIL[2].VALUE,
      workNum: item.MO_FINISH_DETAIL[3].VALUE,
    })
  }
  var options = {
    backgroundColor: '#fff',
    title: {
      text: '作业完成率',
      left: 'center',
      top: '4%',
      textStyle: {
        color: '#919CA3',
        fontSize: 14,
        align: 'center',
        fontWeight: 600
      }
    },
    legend: {
      show: false,
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function (params) {
        if (params.name === '标准线') {
          return
        }
        var _res = "";
        for (let item of res.Result[0].DATA[params.dataIndex].MO_FINISH_DETAIL) {
          if (item.KEY === '完成率') {
            _res += `<div><p>${item.KEY}：${item.VALUE} %</p></div>`;
          } else {
            _res += `<div><p>${item.KEY}：${item.VALUE}</p></div>`;
          }
        }
        // var res = '<div><p>计划组：' + params.data.projectTeam + '</p></div>';
        // res += '<div><p>时间：' + params.data.time + '</p></div>';
        // res += '<div><p>完成率：' + params.data.finishRate + '%</p></div>';
        // res += '<div><p>作业数：' + params.data.workNum + '</p></div>';
        return _res;
      },
    },
    toolbox: {
      show: true,
      feature: {
        mark: {
          show: true
        },
      }
    },
    grid: {
      left: '2%',
      right: '10%',
      bottom: '3%',
      height: '80%',
      width: '90%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#', //左边线的颜色
        }
      },
      axisLabel: {
        interval: 0,
        rotate: 40,
        show: true,
        splitNumber: 20,
        textStyle: {
          fontSize: 10,
        },
      },
      data: _XArr,
      axisTick: {
        alignWithLabel: false
      },
      axisPointer: {
        show: false,
      },
    }],
    yAxis: [{
      show: true,
      type: 'value',
      max: 100,
      // scale:true,
      name: '',
      splitLine: { //分割线
        show: true,
        color: "#EDF0F2",
        lineStyle: {
          color: '#EDF0F2'
        }
      },
      axisLabel: {
        formatter: '{value}%',
        interval: 0,
        rotate: 0,
        show: true,
        splitNumber: 30,
        textStyle: {
          fontSize: 12,
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    ],
    series: [{
      markLine: {
        symbol: 'none',
        itemStyle: {
          normal: {
            lineStyle: {
              type: 'dash',
              color: '#F25555'
            },
            label: {
              show: true,
              position: '',
              formatter: '{c}%',
              padding: [1, 0, 0, 320]
            }
          }
        },
        data: [{
          name: '标准线',
          yAxis: STANDARD
        }]
      },
      name: '',
      type: 'bar',
      barWidth: 10, //柱图宽度
      data: detail,
      itemStyle: {
        normal: {
          color: ['#6D8EF2'],
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            textStyle: {
              fontSize: 10,
            }
          }
        }
      }
    },]
  };
  if (res.TotalCount === 0) { return false } else { return options }
}

// 工单齐套率
function _getOrderRate(res) {
  var standardArr = [];
  var finishArr = [];
  var totalArr = []
  var axisData = [];
  if (res.Result.length > 0) {
    for (let item of res.Result) {
      standardArr.push(item.Y_STANDARD);
      finishArr.push(item.Y_EXTEND);
      totalArr.push(item.MO_TOTAL);
      axisData.push(item.X_DATE);
    }
  }
  var option = {
    backgroundColor: "#fff",
    color: ['#4CC76A', '#FA8057'],
    title: [],
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        var tooltipStr =
          '<p>工单总个数 : ' + totalArr[params[0].dataIndex] +
          '<p>标准齐套率 : ' + standardArr[params[0].dataIndex] + ' %' +
          '<p>扩展齐套率 : ' + finishArr[params[0].dataIndex] + ' %' +
          '<p>日期 : ' + axisData[params[0].dataIndex];
        return tooltipStr;
      }
    },
    legend: {
      icon: 'rect',
      bottom: '-2%',
      textStyle: {
        color: '#000',
      },
      data: ['标准齐套率', '扩展齐套率']
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '16%',
      bottom: '10%',
      containLabel: true
    },
    toolbox: {
      "show": false,
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      "axisLine": {
        lineStyle: {
          color: '#000',
        }
      },
      "axisTick": {
        "show": false
      },
      axisLabel: {
        rotate: 40,
        textStyle: {
          color: '#000',
          fontSize: 10,
        }
      },
      boundaryGap: false,
      data: axisData
    },
    yAxis: {
      max: 100,
      "axisLine": {
        lineStyle: {
          color: '#000'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#c0c0c0'
        }
      },
      "axisTick": {
        "show": false
      },
      axisLabel: {
        textStyle: {
          color: '#000',
        },
        formatter: '{value} %'
      },
      type: 'value'
    },
    series: [{
      name: '标准齐套率',
      smooth: true,
      type: 'line',
      symbolSize: 3,
      symbol: 'circle',
      data: standardArr
    }, {
      name: '扩展齐套率',
      smooth: true,
      type: 'line',
      symbolSize: 8,
      symbol: 'circle',
      data: finishArr
    }]
  }
  if (res.TotalCount === 0) { return false } else { return option }
}

function _getGanter(res, timeRange) {
  var { COLOR_CONFIG, RESOURCE_LOAD_RATE, Y_DATA } = res.Result[0];
  var time = '4w'
  if (timeRange === 1) { time = '1t' } else if (timeRange === 2) { time = '1w' } else if (timeRange === 3) { time = '2w' }
  var options = {
    time: time,
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
      data: Y_DATA,
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
    },
    tooltip: {
      formatter: function (val) {  //val为data里的数据
        var str = '', plantGroup = '', resource = '', date = '', resourceType = '', resourceAvailableTime = '',
          resourceWorkingTime = '', value = '';
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
        str += plantGroup === "" ? '' : '计划组：' + plantGroup + '</br><div style="height: 10px;width: 100%;"></div>';
        str += resource === "" ? '' : '资源：' + resource + '</br><div style="height: 10px;width: 100%;"></div>';
        str += date === "" ? '' : '时间：' + date + '</br><div style="height: 10px;width: 100%;"></div>';
        str += resourceType === "" ? '' : '资源类型：' + resourceType + '</br><div style="height: 10px;width: 100%;"></div>';
        str += resourceAvailableTime === "" ? '' : '资源可用量（小时）：' + resourceAvailableTime + '</br><div style="height: 10px;width: 100%;"></div>';
        str += resourceWorkingTime === "" ? '' : '资源使用量（小时）：' + resourceWorkingTime + '</br><div style="height: 10px;width: 100%;"></div>';
        str += value === "" ? '' : '资源利用率：' + value + '%';
        return str;
      },
    },
    series: RESOURCE_LOAD_RATE,
    legend: function (dom) {
      var legendDom = document.createElement('div');
      var css = [
        'position: absolute;',
        'bottom: -25px;',
        'left: 50%',
        'transform: translateX(-50%)',
      ].join(';') + ';';
      legendDom.style.cssText = css;
      var str = '<ul style="margin: 0; padding: 0; list-style: none; font-size: 12px; font-family: 微软雅黑; color: #434D54;">';
      // for (let item of COLOR_CONFIG) {
      //   str += `<li style="display: inline-block; margin-right: 16px;"><span style="background-color: ${item.VALUE}; width: 25px; height: 16px; display: inline-block;vertical-align: text-bottom;"></span> ${item.KEY}</li>`;
      // }
      str += `<li style="display: inline-block; margin-right: 16px;"><span style="background-color: ${COLOR_CONFIG[0].VALUE}; width: 25px; height: 16px; display: inline-block;vertical-align: text-bottom;"></span> ${COLOR_CONFIG[0].KEY}</li>`;
      str += `<li style="display: inline-block; margin-right: 16px;"><span style="background-color: ${COLOR_CONFIG[2].VALUE}; width: 25px; height: 16px; display: inline-block;vertical-align: text-bottom;"></span> ${COLOR_CONFIG[2].KEY}</li>`;
      str += `<li style="display: inline-block; margin-right: 16px;"><span style="background-color: ${COLOR_CONFIG[1].VALUE}; width: 25px; height: 16px; display: inline-block;vertical-align: text-bottom;"></span> ${COLOR_CONFIG[1].KEY}</li>`;
      str += '</ul>';
      legendDom.innerHTML = str;
      dom.appendChild(legendDom);
    },
  };

  return options
}
export default Options;
