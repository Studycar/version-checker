export function getOptions(payload) {
  const {
    data,
    callback
  } = payload;
  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        dataView: {
          show: !!data.dataView,
          readOnly: false
        },
        magicType: {
          show: !!data.magicType,
          type: ['line', 'bar']
        },
        myTool1: {
          show: !!data.myTool1,
          title: '下载',
          icon: 'image://https://z3.ax1x.com/2021/07/19/WG6HQU.png',
          onclick: () => {
            if (callback) callback();
          }
        }
      }
    },
    legend: {
      data: data.legend,
      bottom: 0
    },
    xAxis: [{
      type: 'category',
      data: data.xAxis,
      axisPointer: {
        type: 'shadow'
      },
      axisLabel: {
        rotate: data.xrotate || 0
      }
    }],
    yAxis: data.yAxis,
    grid: data.grid,
    series: data.series
  };
  return options;
}
