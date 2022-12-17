import { Component, OnInit, ViewChild, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { deepCopy } from '@delon/util';

@Component({
  selector: 'show-psi',
  templateUrl: './show-psi.component.html',
  providers: [QueryService]
})
export class ShowPsiComponent extends CustomBaseContext implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) {
    super({ appTranslationSrv: appTranslationService });
  }

  i: any;
  queryParams: any = {};
  channelOptions = [
    { value: '0', label: '小计' },
    { value: '1', label: '线上' },
    { value: '2', label: '线下' },
  ];

  columnTypes = {
    rowSpan: {
      rowSpan: params => {
        if (params.data.rowSpan) return params.data.rowSpan;
        return 1;
      },
      cellClassRules: {
        'agGridShowCell': function(params) {
          return !!params.data.rowSpan;
        }
      },
    }
  };

  columns: any[] = [];

  staticColumns = [
    { field: 'marketCategory', headerName: '品类金额不含税', pinned: 'left', type: 'rowSpan',},
    { field: 'channel', headerName: '渠道', pinned: 'left', width: 80, valueFormatter: 'ctx.optionsFind(value, 1).label', },
    {
      headerName: '12月',
      children: [
        {
          headerName: '上期库存周转',
          children: [
            { field: 'valInvAmtLast', headerName: '价值链库存亿', width: 140, },
            { field: 'selfInvAmtLast', headerName: '自有库存亿', width: 120, },
            { field: 'chnlInvAmtLast', headerName: '渠道库存亿', width: 120, },
            { field: 'mthAvgSaleAmtLast', headerName: '月均分销亿', width: 120, },
            { field: 'valInvSaveSaleRatioLast', headerName: '价值链存销比-天', width: 150, },
            { field: 'selfInvSaveSaleRatioLast', headerName: '自有存销比-天', width: 150, },
            { field: 'chnlInvSaveSaleRatioLast', headerName: '渠道存销比-天', width: 150, },
          ],
        },
      ],
    }
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch(optionsIndex) {
      case 1:
        options = this.channelOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  ngOnInit(): void {
    this.defaultColDef.sortable = false;
    this.defaultColDef.filter = false;;
    this.renderColumns();
    this.adjustMaster();
  }

  getQueryParams(isExport?: boolean) {
    return this.queryParams;
  }

  // 渲染表头
  renderColumns() {
    const monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const monthColumns = monthList.map(item => {
      return {
        headerName: `${item}月`,
        children: [
          {
            headerName: '生产',
            children: [
              { field: `prodAmt${item}`, headerName: '生产金额', },
              { field: `entitySelfPlanning${item}`, headerName: '实体自制规划万台', },
              { field: `emptyPlanning${item}`, headerName: '空壳规划万台', },
              { field: `oemPlanning${item}`, headerName: 'OEM规划万台', },
              { field: `prodAvgPrice${item}`, headerName: '生产均价', },
              { field: `entitySelfAmt${item}`, headerName: '实体自制金额亿', },
              { field: `oemPlanningAmt${item}`, headerName: 'OEM规划亿元', },
            ],
          },
          {
            headerName: '出仓',
            children: [
              { field: `pickUpGoodsNum${item}`, headerName: '提货需求量万台', },
              { field: `pickUpGoodsAtm${item}`, headerName: '提货需求金额亿', },
              { field: `pickUpGoodsRatio${item}`, headerName: '提货同比', },
            ],
          },
          {
            headerName: '分销',
            children: [
              { field: `salePlanningAmt${item}`, headerName: '分销规划金额亿', },
              { field: `salePlanningRatio${item}`, headerName: '分销同比', },
            ],
          },
          {
            headerName: '库存周转',
            children: [
              { field: `valInvAmt${item}`, headerName: '价值链库存亿', },
              { field: `selfInvAmt${item}`, headerName: '自有库存亿', },
              { field: `chnlInvAmt${item}`, headerName: '渠道库存亿', },
              { field: `mthAvgSaleAmt${item}`, headerName: '月均分销亿', },
              { field: `valInvSaveSaleRatio${item}`, headerName: '价值链存销比-天', },
              { field: `selfInvSaveSaleRatio${item}`, headerName: '自有存销比-天', },
              { field: `chnlInvSaveSaleRatio${item}`, headerName: '渠道存销比-天', },
            ],
          },
        ],
      }
    });
    this.columns = [
      ...this.staticColumns,
      ...monthColumns,
    ];
    console.log('columns', this.columns);
  }

  adjustMaster() {
    this.setLoading(true);
    const params = { ...this.i };
    this.queryService.getInfo(params).subscribe(res => {
      this.setLoading(false);
      if (res.code === 200) {
        this.queryParams = {
          psiCode: res.data.psiCode,
          planPeriodMonth: res.data.planPeriodMonth,
          smltNum: res.data.smltNum,
          rsltVersion: res.data.rsltVersion
        };
        this.query();
      }
    })
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    const params = this.getQueryParams();
    this.setLoading(true);
    this.queryService.showPsi(params).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      const gridData = this.createData(data);
      this.gridData = gridData;
      // this.initGridWidth();
      setTimeout(() => {
        this.setLoading(false);
      }, 500);
    });
  }

  // 合并品类rowSpan
  createData(data: any[]): any[] {
    const result = deepCopy(data);
    const categoryArray = result.map(item => item.marketCategory);
    const uniqCategoryArray = [...new Set(categoryArray)];
    const categoryObj: { [key: string]: number } = {};
    const categoryChecked: { [key: string]: boolean } = {};
    uniqCategoryArray.forEach((category: string) => {
      categoryObj[category] = 0;
      categoryChecked[category] = false;
    });
    categoryArray.forEach((category: string) => {
      categoryObj[category]++;
    });
    result.forEach(item => {
      const category = item.marketCategory;
      if (uniqCategoryArray.includes(category) && !categoryChecked[category]) {
        item.rowSpan = categoryObj[category];
        categoryChecked[category] = true;
      }
    });
    return result;
  }

  // 关闭
  close() {
    this.modal.destroy();
  }

  // 导出
  expColumns: any[] = [];
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.showPsi(params).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      const exportData = this.createData(data);
      setTimeout(() => {
        this.excelexport.export(exportData);
      });
    })
  }

  // 导出
  exportFile() {
    const params = this.queryParams;
    const a = document.createElement('a');
    a.href = `/sys/sopPsiYearAdjustMaster/psiIndexExport?paramsJson=${encodeURI(JSON.stringify(params))}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
