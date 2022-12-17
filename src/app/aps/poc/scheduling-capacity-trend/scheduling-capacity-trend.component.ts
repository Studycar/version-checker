import { Component, OnInit } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'scheduling-capacity-trend',
  templateUrl: './scheduling-capacity-trend.component.html',
  styleUrls: ['./scheduling-capacity-trend.component.css']
})
export class SchedulingCapacityTrendComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.staticColumns);
  }

  plantOptions: any[] = [];
  minCapacity = 0;
  maxCapacity = 12;
  queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions } },
      { field: 'itemCode', title: '物料编码', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: ''
    }
  };
  cellClassRules = {
    'show-cell': function (params) {
      return params.node.rowIndex % 4 === 0;
    }
  };
  lackCellClassRules = {
    'color-red': params => {
      if (params.data.category === '汇总') {
        return typeof params.value === 'number' && params.value > this.maxCapacity;
      }
      return typeof params.value === 'number' && params.value < 0;
    }
  };

  staticColumns = [
    {
      field: 'itemCode',
      headerName: '产品型号',
      width: 120,
      menuTabs: ['filterMenuTab'],
      rowSpan: rowSpan,
      cellClassRules: this.cellClassRules,
      cellRenderer: 'showCellRenderer',
    },
    {
      field: 'category',
      headerName: '类别',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
  ];
  dynamicColumns = [];
  components = { showCellRenderer: this.createShowCellRenderer() };
  createShowCellRenderer() {
    function ShowCellRenderer() { }
    ShowCellRenderer.prototype.init = function (params) {
      const cellBlank = !params.value;
      if (cellBlank) {
        return null;
      }
      this.ui = document.createElement('div');
      this.ui.innerHTML = '<div class="show-name">' + params.value + '</div>';
    };
    ShowCellRenderer.prototype.getGui = function () {
      return this.ui;
    };
    return ShowCellRenderer;
  }
  options = {
    title: {
      text: 'Temporary storage capacity trend',
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type: 'scroll',
      left: '30%'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#EDF0F2'
        }
      },
    },
    dataset: {
      source: [],
    },
    series: []
  };

  ngOnInit() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.PLANT_CODE,
          value: item.PLANT_CODE,
        });
      });
    });
    this.commonQueryService.GetLookupByType('Extrusion_Stock_Capacity').subscribe(res => {
      this.maxCapacity = Number(res.Extra[0].LOOKUP_CODE);
    });
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: '',
    };
  }

  commonQuery() {
    this.commonQueryService.loadGridView(
      { url: '/afs/serverreport/royalitemrest/query', method: 'GET' },
      this.getQueryParams(),
      this,
      res => {
        const dataRelation: {[key: string]: any} = {};
        const dynamicColumns = new Set<string>();
        for (let i = 0; i < res.Result.length; i++) {
          const time = new Date(res.Result[i].REST_DATE);
          const headerName = `${time.getMonth() + 1}-${time.getDate()}_${time.getHours()}`;
          dynamicColumns.add(res.Result[i].REST_DATE);
          if (dataRelation[res.Result[i].ITEM_CODE]) {
            dataRelation[res.Result[i].ITEM_CODE][0][headerName] = res.Result[i].IN_QTY;
            dataRelation[res.Result[i].ITEM_CODE][1][headerName] = res.Result[i].OUT_QTY;
            dataRelation[res.Result[i].ITEM_CODE][2][headerName] = res.Result[i].REST_QTY;
            dataRelation[res.Result[i].ITEM_CODE][3][headerName] = res.Result[i].REST_BOX;
          } else {
            const pop = { itemCode: res.Result[i].ITEM_CODE, category: 'Extrusion', [headerName]: res.Result[i].IN_QTY };
            const pack = { itemCode: res.Result[i].ITEM_CODE, category: 'Packing', [headerName]: res.Result[i].OUT_QTY };
            const remain = { itemCode: res.Result[i].ITEM_CODE, category: 'Balance', [headerName]: res.Result[i].REST_QTY };
            const storage = { itemCode: res.Result[i].ITEM_CODE, category: 'Number of storage tanks', [headerName]: res.Result[i].REST_BOX };
            dataRelation[res.Result[i].ITEM_CODE] = [pop, pack, remain, storage];
          }
        }
        const summary = { category: 'summary' };
        this.dynamicColumns = [...dynamicColumns].sort((a, b) => {
          return new Date(a).getTime() - new Date(b).getTime();
        }).map(item => {
          const time = new Date(item);
          const headerName = `${time.getMonth() + 1}-${time.getDate()}_${time.getHours()}`;
          for (const key in dataRelation) {
            if (summary[headerName]) {
              summary[headerName] += dataRelation[key][3][headerName];
            } else {
              summary[headerName] = dataRelation[key][3][headerName];
            }
          }
          return {
            field: headerName,
            headerName: headerName,
            width: 90,
            menuTabs: ['filterMenuTab'],
            cellClassRules: this.lackCellClassRules,
          };
        });
        this.columns = [...this.staticColumns, ...this.dynamicColumns];
        const data: any[] = [];
        for (const key in dataRelation) {
          data.push(...dataRelation[key]);
        }
        if (res.Result.length > 0) {
          data.push(summary);
        }
        this.initChart(dataRelation, [...dynamicColumns], summary);
        return Object.assign({}, res, { Result: data });
      },
      () => {
        this.view.total = this.gridData.length > 0 ? (this.gridData.length - 1) / 4 : 0;
      }
    );
  }

  initChart(dataRelation: {[key: string]: any}, dynamicColumns: string[], summary: {[key: string]: any}) {
    const source: any[] = [];
    const line_1 = Object.keys(dataRelation);
    line_1.unshift('product');
    line_1.push('summary');
    source.push(line_1);
    dynamicColumns.sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    }).forEach(item => {
      const time = new Date(item);
      const headerName = `${time.getMonth() + 1}-${time.getDate()}_${time.getHours()}`;
      const arr: any[] = [];
      arr.push(headerName);
      Object.keys(dataRelation).forEach(_item => {
        arr.push(dataRelation[_item][3][headerName]);
      });
      arr.push(summary[headerName]);
      source.push(arr);
    });
    this.options.dataset.source = source;
    this.options.series = Object.keys(dataRelation).map(item => {
      return {
        type: 'line',
      };
    });
    if (dynamicColumns.length > 0) {
      this.options.series.push({
        type: 'line',
        markLine: {
          symbol: 'none',
          data: [
            {
              name: '最高库容',
              yAxis: this.maxCapacity,
              label: {
                formatter: 'Maximum storage capacity'
              },
              lineStyle: {
                color: 'red',
              }
            },
            {
              name: '最低库容',
              yAxis: 0,
              label: {
                formatter: 'Minimum storage capacity'
              },
              lineStyle: {
                color: 'red',
              }
            }
          ]
        }
      });
    }
    this.options = Object.assign({}, this.options);
  }

  getQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode,
      /*QueryParams: {
        PageIndex: this._pageNo,
        PageSize: this._pageSize * 4,
      }*/
    };
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize * 4);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}

function rowSpan(params) {
  if (params.data.category === '汇总') {
    return 1;
  }
  return params.node.rowIndex % 4 === 0 ? 4 : 1;
}
