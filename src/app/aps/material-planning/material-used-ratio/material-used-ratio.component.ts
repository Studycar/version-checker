import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { ModalHelper } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomOperateCellRenderComponent } from '../../../modules/base_module/components/custom-operatecell-render.component';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'material-used-ratio',
  templateUrl: './material-used-ratio.component.html',
  styleUrls: ['./material-used-ratio.component.css']
})
export class MaterialUsedRatioComponent extends CustomBaseContext implements OnInit {


  constructor(public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private modal: ModalHelper,
    private commonQueryService: CommonQueryService,
    public httpClient: _HttpClient, ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }
  columnCagetoryType: any[] = [
    { field: 'categoriesCode', title: '编码', width: '200px' },
    { field: 'descriptions', title: '描述', width: '200px' }
  ];
  plantOption: any[] = [];
  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOption, ngModelChange: this.onPlantCodeChange },
        required: true
      },
      {
        field: 'StockCategory',
        title: '库存分类',
        required: true,
        ui: {
          type: UiType.treeSelect,
          valueLevel: 0,
          options: [],
          columns: this.columnCagetoryType,
          keyField: 'categoriesCode',
          valueField: 'categoriesCode',
          selection: [],
        },
      },
      { field: 'createDate', title: '日期范围', ui: { type: UiType.dateRange } },

    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      StockCategory: '',
      createDate: [],
    }
  };
  columnTypes = {
    rowSpan: {
      rowSpan: params => {
        if (params.data.itemCount) return params.data.itemCount;
        return 1;
      },
      cellClassRules: {
        'agGridShowCell': function(params) {
          return !!params.data.itemCount;
        }
      },
    }
  };
  columns = [
    { field: 'plantCode', headerName: '工厂', width: 80, menuTabs: ['filterMenuTab'] },
    { field: 'stockCategory', headerName: '库存分类', width: 140, menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', width: 180, menuTabs: ['filterMenuTab'] },
    { field: 'usedQty', headerName: '使用量', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'ratio', headerName: '占比(%)', width: 130, menuTabs: ['filterMenuTab'] },
  ];
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  pieOption = {
    title: {
      text: '',
      left: 'center',
    },
    grid: {
      containLabel: true,
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      left: 'center',
      bottom: 15,
      data: []
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: '50%',
        center: ['50%', '50%'],
        data: [],
        label: {
          show: true,
          formatter: '{c} ({d}%)',
          alignTo: 'edge',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  onCellClick(params) {
    this.pieOption.title.text = `物料使用占比——${params.data.stockCategory}`;
    this.pieOption.series[0].name = params.data.stockCategory;
    const queryParams = {
      plantCode: params.data.plantCode,
      listStockCategory: [params.data.stockCategory],
      BEGIN_DATE: null,
      END_DATE: null,
      pageIndex: 1,
      pageSize: 1000
    };
    this.httpClient.post<ResponseDto>('/api/mrp/mrpDataOperation/materialUsedRatio', queryParams).subscribe(res => {
      const legendData: string[] = [];
      const data: Array<{ name: string, value: number }> = [];
      res.data.content.forEach(item => {
        legendData.push(item.itemCode);
        data.push({
          name: item.itemCode,
          value: item.usedQty
        });
      });
      this.pieOption.legend.data = legendData;
      this.pieOption.series[0].data = data;
      this.pieOption = Object.assign({}, this.pieOption);
    });
  }


  ngOnInit() {
    this.defaultColDef.sortable = false;
    this.defaultColDef.filter = false;
    this.loadPlantOption(this.appConfigService.getDefaultScheduleRegionCode());
    this.queryCagetoryType();
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }
  
  
  commonQuery() {
    this.commonQueryService.loadGridViewNew(
      { url: '/api/mrp/mrpDataOperation/materialUsedRatio', method: 'POST' },
      this.getQueryParams(),
      this.context,
      this.dataProcess
    );
  }
  dataProcess(result: ResponseDto): ResponseDto {
    let stockCategory = result.data.content[0].stockCategory;
    let count = 0;
    let firstItem = result.data.content[0]
    result.data.content.forEach(item => {
      if (item.stockCategory === stockCategory) {
        count += 1;
      } else {
        firstItem.itemCount = count;
        firstItem = item;
        stockCategory = item.stockCategory;
        count = 1;
      }
    });
    return result;
  }
  // 加载库存分类
  queryCagetoryType() {


    this.commonQueryService.QueryStockCategory('',this.queryParams.values.plantCode,'',).subscribe(res => {
      const data = [];
      res.data.forEach(x => {
        data.push({ categoriesCode: x.categoriesCode, descriptions: x.descriptions });
      });
      this.queryParams.defines.find(t => t.field === 'StockCategory').ui.options = data;
    });
  }

  // GetPurCagetory(plantCode: String): Observable<ResponseDto> {
  //   return this.httpClient.get<ResponseDto>('/afs/ServerMrpDataOperation/MrpDataOperationService/QueryStockCategory?plantCode=' + plantCode);
  // }

  getQueryParams() {
    const data = [];
    this.get_control_obj('StockCategory').ui.selection.forEach(x => { data.push(x['categoriesCode']); });
    return {
      plantCode: this.queryParams.values.plantCode,
      listStockCategory: data,
      beginDate: this.formatDate(this.queryParams.values.createDate[0]),
      endDate: this.formatDate(this.queryParams.values.createDate[1]),
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  onPlantCodeChange(val: string) {
    this.queryParams.values.StockCategory = '';
    this.get_control_obj('StockCategory').ui.selection = [];
    this.queryCagetoryType();
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      createDate: [],
      StockCategory: ''
    };
    this.get_control_obj('StockCategory').ui.selection = [];
  }

  get_control_obj(field: string) {
    return this.queryParams.defines.find(t => t.field === field);
  }

  loadPlantOption(businessUnitCode: string) {
    this.commonQueryService.GetUserPlant(businessUnitCode, '').subscribe(res => {
      this.plantOption.length = 0;
      res.Extra.forEach(item => {
        this.plantOption.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // // 页码切换
  // onPageChanged({ pageNo, pageSize }) {
  //   if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
  //     if (this.lastPageSize !== pageSize) {
  //       this.gridApi.paginationSetPageSize(pageSize);
  //     }
  //     this.lastPageNo = pageNo;
  //     this.lastPageSize = pageSize;
  //     this.commonQuery();
  //   } else {
  //     this.setLoading(false);
  //   }
  // }

    // 页码切换
    onPageChanged({ pageNo, pageSize }) {
      this.gridApi.paginationSetPageSize(pageSize);
      this.gridApi.paginationGoToPage(pageNo - 1);
      this.setLoading(false);
    }
}

