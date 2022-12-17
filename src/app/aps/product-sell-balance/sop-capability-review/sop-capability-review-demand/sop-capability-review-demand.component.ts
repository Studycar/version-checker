import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { BrandService } from 'app/layout/pro/pro.service';
import { _HttpClient } from '@delon/theme';
import { deepCopy } from '@delon/util';

import { ProductSellBalanceCapabilityService } from '../../product-sell-balance-capability.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService, HttpMethod } from 'app/modules/generated_module/services/common-query.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-capability-review-demand',
  templateUrl: './sop-capability-review-demand.component.html',
  styleUrls: ['./sop-capability-review-demand.component.css'],
})
export class SopCapabilityReviewDemandComponent extends CustomBaseContext implements OnInit {
  public gridStateKey = 'sop-capability-review-demand';
  q: any = {}; // 查询参数
  public gridHeight = 300; // 300高度

  public saleTypeOptions: any[] = []; // 内外销  
  public sourceOptions: any[] = []; // 需求来源

  public columns = [];
  public origin_columns = [
    { field: 'salesType', headerName: '内外销', valueFormatter: 'ctx.saleTypeFormatter(value)' },
    { field: 'source', headerName: '需求来源', valueFormatter: 'ctx.sourceFormatter( value)' },
    { field: 'sourcePlantCode', headerName: '需求组织' },
    { field: 'demandPeriod', headerName: '月份', valueFormatter: 'ctx.demandDateFormatter(value)' },
    { field: 'topItemCode', headerName: '成品编码' },
    { field: 'topPsItem.descriptionsCn', headerName: '成品描述' },
    { field: 'itemCode', headerName: '组件编码' },
    { field: 'itemDesc', headerName: '组件描述' }
  ];

  constructor(
    public pro: BrandService,
    private modal: NzModalRef,
    msgSrv: NzMessageService,
    private capabilityService: ProductSellBalanceCapabilityService,
    private appTranslationService: AppTranslationService,
    appConfigService: AppConfigService) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      commonQuerySrv: capabilityService,
    });
  }

  ngOnInit() {
    // this.query();
    this.headerNameTranslate(this.origin_columns);

    // 获取内外销数据
    this.capabilityService.GetLookupByType('REVIEW_DEMAND_SOURCE').subscribe(rsp => {
      rsp.Extra.forEach(item => {
        this.sourceOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });

    this.capabilityService.GetLookupByType('SOP_SALES_TYPE').subscribe(rsp => {
      rsp.Extra.forEach(item => {
        this.saleTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
  }

  /**
   * 查询数据
   */
  public query() {
    this.queryCommon();
  }

  /**
   * grid加载完毕回调事件
   */
  gridLoadCallback() {
    super.gridLoadCallback();
    this.columns = deepCopy(this.origin_columns);

    this.query();
  }

  public saleTypeFormatter(value) {
    if (this.saleTypeOptions.find(x => x.value === value)) {
      return this.saleTypeOptions.find(x => x.value === value).label;
    }
    return '';
  }

  public sourceFormatter(value) {
    if (this.sourceOptions.find(x => x.value === value)) {
      return this.sourceOptions.find(x => x.value === value).label;
    }
    return '';
  }

  public demandDateFormatter(value) {
    return this.capabilityService.formatDateTime2(value, 'yyyy-MM');
  }

  /**
   * 查询公共方法
   */
  public queryCommon() {
    const params = this.getqueryParams();
    if (params === null) return;
    this.setLoading(true);
    this.capabilityService.loadGridViewNew(
      {
        url: '/api/sop/sopcapabilityreviewdemand/querySopCapabilityReviewDemand',
        method: HttpMethod.get,
      },
      params,
      this.context,
      result => {
        // 数据预处理
        console.log('pre dill with:');
        return result;
      },
      () => {
        this.respDataHandle(this.gridData);
        // this.headerNameTranslate(this.columns);
        // 必须要set空一次，再set，才能更新列名
        (<any>this.gridApi).setColumnDefs([]);
        (<any>this.gridApi).setColumnDefs(this.columns);
        // 重置个性化
        this.agGridStateReset(this.gridStateKey);
        this.setLoading(false);
      },
    );
  }

  /**
   * 服务器返回数据的后处理
   */
  respDataHandle(data: any) {
    console.log('respDataHandle:');
    console.log(data);
    // 查询之后回调的方法
    if (data !== undefined && data !== null && data.length > 0) {
      // 先构造列
      const m_n_month_values = data[0].mnMonthValueList;
      if (m_n_month_values !== undefined && m_n_month_values !== null && m_n_month_values.length > 0) {
        this.columns = deepCopy(this.origin_columns);
        // 查询月份
        const startMonthIndex = new Date(this.getqueryParams().reviewMonth).getMonth() + 1;
        let monthIndex = startMonthIndex;
        // 成品
        let columnIndex = 0;
        m_n_month_values.forEach(() => {
          this.columns.push({
            field: 'MNMonthValue_topDemand' + columnIndex,
            headerName: this.appTranslationService.translate('成品' + monthIndex + '月需求')
          });
          columnIndex++;
          monthIndex++;
        });
        // 组件
        columnIndex = 0;
        monthIndex = startMonthIndex;
        m_n_month_values.forEach(() => {
          this.columns.push({
            field: 'MNMonthValue_demand' + columnIndex,
            headerName: this.appTranslationService.translate('组件' + monthIndex + '月需求')
          });
          columnIndex++;
          monthIndex++;
        });
      }
      // 再构造数据
      this.configGridData(data);
    }
  }

  /**
   * 重新配置grid的列值
   * 主要是把M_N_MONTH_INVENTORY数组的数据拷贝出来
   */
  configGridData(data: any) {
    data.forEach(rowData => {
      let columnIndex = 0;
      const m_n_month_values = rowData.mnMonthValueList;
      m_n_month_values.forEach(item => {
        console.log('grid data foreach:');
        console.log(item);
        for (const pro in item) {
          rowData['MNMonthValue_' + pro + columnIndex] = item[pro];
        }
        columnIndex++;
      });
    });
  }

  /**
   * 关闭对话框
   */
  public close() {
    this.modal.destroy();
  }

  /**
   * 构造查询参数
   */
  public getqueryParams(): any {
    return this.q;
  }
}
