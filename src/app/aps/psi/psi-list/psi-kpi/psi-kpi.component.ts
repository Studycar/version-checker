import { Component, OnInit, ViewChild, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { deepCopy } from '@delon/util';

@Component({
  selector: 'psi-kpi',
  templateUrl: './psi-kpi.component.html',
  providers: [QueryService]
})
export class PsiKpiComponent extends CustomBaseContext implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
  ) {
    super({ appTranslationSrv: appTranslationService });
  }

  i: any;

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

  staticColumns: any[] = [
    { field: 'marketCategory', headerName: '品类', width: 100, pinned: 'left', type: 'rowSpan', },
    { field: 'planPeriodMonth', headerName: 'PSI计划期', width: 120, pinned: 'left',},
    { field: 'channelCn', headerName: '渠道', width: 80, pinned: 'left', },
    { field: 'invSalesRatio', headerName: '年度库存收入比', width: 160, },
    { field: 'prodFluSd', headerName: '生产波动标准差(整年)', width: 180, },
  ];

  ngOnInit(): void {
    this.defaultColDef.sortable = false;
    this.defaultColDef.filter = false;;
    this.renderColumns();
    this.query();
  }

  getQueryParams(isExport?: boolean) {
    return this.i;
  }

  // 渲染表头
  renderColumns() {
    const monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const monthColumns = monthList.map(item => {
      return {
        field: 'monthFluRatio' + item,
        headerName: item + '月波动率',
        width: 110,
      };
    });

    this.columns = [
      ...this.staticColumns,
      ...monthColumns,
    ];
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    const params = this.getQueryParams();
    this.setLoading(true);
    this.queryService.getPsiKpi(params).subscribe(res => {
      // const data = res.data && res.data.content && Array.isArray(res.data.content) ? res.data.content : [];
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      const gridData = this.createData(data);
      this.gridData = gridData;
      // this.initGridWidth();
      setTimeout(() => {
        this.setLoading(false);
      }, 500);
    });
  }

  // 1.空数据显示'-'
  // 2.合并品类rowSpan
  createData(data: any[]): any[] {
    const result = deepCopy(data);
    const monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const monthColumns = monthList.map(item => 'monthFluRatio' + item);
    const fields = [ 'prodFluSd', ...monthColumns, ];

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
      fields.forEach(field => {
        item[field] = item[field] || '-';
      });
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
  public exportKpi() {
    super.export();
    this.expColumns = this.excelexport.setExportColumn(this.columns);
    const params = this.getQueryParams(true);
    this.queryService.getPsiKpi(params).subscribe(res => {
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
