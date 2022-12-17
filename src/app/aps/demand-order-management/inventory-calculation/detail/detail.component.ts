import { Component, OnInit } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { InventoryCalculationService } from '../inventory-calculation.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './detail.component.html',
  styles: [`
      .hidden {
          display: none;
          width: 100%;
      }

      .chart-view {
          width: 100%;
          height: 300px;
      }

      :host ::ng-deep .deduce-more-than-target {
          background-color: #B4F6FF;
      }

      :host ::ng-deep .deduce-less-than-safety {
          background-color: #ffd1de;
      }
  `],
  providers: [InventoryCalculationService]
})
export class InventoryDetailComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryService: InventoryCalculationService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  params: {[key: string]: any};
  locale = 'zh-Hans';
  type: string;
  typeOptions: Array<{label: string, value: string}> = [
    { label: '物料编码', value: '1' },
    { label: '库存分类', value: '2' },
  ];
  materialCodeColumns = [
    { field: 'CheckItemName', headerName: '物料编码', width: 130, menuTabs: ['filterMenuTab'], },
  ];
  inventoryTypeColumns = [
    { field: 'CheckItemName', headerName: '库存分类', width: 100, menuTabs: ['filterMenuTab'], },
  ];
  commonColumns = [
    { field: 'CheckItemDes', headerName: '描述', width: 200, menuTabs: ['filterMenuTab'], },
    { field: 'Date', headerName: '时间', width: 120, menuTabs: ['filterMenuTab'], },
    { field: 'MinInventory', headerName: '安全库存', width: 110, menuTabs: ['filterMenuTab'], },
    { field: 'MaxInventory', headerName: '目标库存', width: 110, menuTabs: ['filterMenuTab'], },
    { field: 'ApproachInventory', headerName: '推演库存', width: 110, menuTabs: ['filterMenuTab'], },
  ];
  rowClass = {
    'deduce-more-than-target': function(params) {
      return params.data.ApproachInventory > params.data.MaxInventory;
    },
    'deduce-less-than-safety': function(params) {
      return params.data.ApproachInventory < params.data.MinInventory;
    },
  };
  dataIndex: number[] = [];
  chartOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        let html = params[0].name + '<br>';
        for (let i = 0; i < params.length; i++) {
          if (params[i].componentSubType === 'line') {
            html += '<span style="display: inline-block; margin-right: 5px; border-radius: 10px; width: 10px; height: 10px; background-color:' + params[i].color + ';"></span>';
            html += params[i].seriesName + ': ' + params[i].value + '<br>';
          }
        }
        return html;
      }
    },
    grid: {
      left: '7%',
      right: 0,
      top: '20%',
      bottom: '18%'
    },
    legend: {
      textStyle: {
        color: '#49494e',
        fontSize: 12
      },
      left: 'center',
      itemGap: 40,
      padding: [5, 0],
      data: ['安全库存', '目标库存', '推演库存']
    },
    xAxis: [
      {
        type: 'category',
        data: [],
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
          interval: 0,
          color: '#49494e',
          rotate: 40
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
          color: '#49494e'
        }
      }
    ],
    series: [
      {
        name: '安全库存',
        type: 'line',
        data: [],
        label: {
          show: true,
          formatter: (params) => {
            if (this.dataIndex.indexOf(params.dataIndex) >= 0) {
              return params.data;
            }
            return '';
          }
        },
      },
      {
        name: '目标库存',
        type: 'line',
        data: [],
        label: {
          show: true,
          formatter: (params) => {
            if (this.dataIndex.indexOf(params.dataIndex) >= 0) {
              return params.data;
            }
            return '';
          },
          position: 'bottom'
        },
      },
      {
        name: '推演库存',
        type: 'line',
        data: [],
        markPoint: {
          data: [],
        }
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: [],
        symbolSize: 0,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        // itemStyle: {
        //   normal: {
        //     color: 'red',
        //     shadowBlur: 10,
        //     shadowColor: '#333'
        //   }
        // },
        zlevel: 0
      }
    ]
  };

  ngOnInit() {
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.setLoading(true);
    this.params = Object.assign(this.params, {
      CheckType: this.type,
      CheckItemValue: '',
      StartDatetime: formatDate(this.params.StartDatetime, 'yyyy-MM-dd', this.locale),
      EndDatetime: formatDate(this.params.EndDatetime, 'yyyy-MM-dd', this.locale),
    });
    this.queryService.inventoryCheck(this.params).subscribe(res => {
      if (res.Success) {
        this.gridData = res.Extra;
        this.setLoading(false);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }

  onGridCellClick(event: any) {
    this.getChartData(event.data.CheckItemName);
  }

  getChartData(itemCode: string) {
    const data = this.gridData.filter(i => i.CheckItemName === itemCode);
    const xAxisData: string[] = [];
    const safetyData: number[] = [];
    const targetData: number[] = [];
    const deduceData: number[] = [];
    data.forEach(item => {
      xAxisData.push(item.Date);
      safetyData.push(item.MinInventory);
      targetData.push(item.MaxInventory);
      deduceData.push(item.ApproachInventory);
    });
    const deduceMarkPointData: any[] = [];
    const effectScatterData: any[] = [...deduceData];
    for (let i = 0; i < xAxisData.length; i++) {
      if (deduceData[i] > targetData[i] || deduceData[i] < safetyData[i]) {
        this.dataIndex.push(i);
        deduceMarkPointData.push({ name: `deduce_${i}`, value: deduceData[i], coord: [i, deduceData[i]], symbol: 'circle', symbolSize: 20, });
        effectScatterData[i] = { value: deduceData[i], symbolSize: 20, };
      }
    }
    this.chartOptions.xAxis[0].data = xAxisData;
    this.chartOptions.series[0].data = safetyData;
    this.chartOptions.series[1].data = targetData;
    this.chartOptions.series[2].data = deduceData;
    this.chartOptions.series[2].markPoint.data = deduceMarkPointData;
    this.chartOptions.series[3].data = effectScatterData;
    this.chartOptions = Object.assign({}, this.chartOptions);
  }

  onTypeChange(value: string) {
    this.gridApi.setColumnDefs([]);
    if (value === '1') {
      this.gridApi.setColumnDefs([...this.materialCodeColumns, ...this.commonColumns]);
    } else {
      this.gridApi.setColumnDefs([...this.inventoryTypeColumns, ...this.commonColumns]);
    }
    this.query();
  }

  /*lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }*/
}
