import { Component, OnInit, } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { deepCopy } from '@delon/util';
import { ModalHelper } from '@delon/theme';
import { NumberInputEditorComponent } from '../../number-input.component';
import { AdjustPsiSaveComponent } from './save/save.component';
import { AdjustPsiEditComponent } from './edit/edit.component';

@Component({
  selector: 'adjust-psi',
  templateUrl: './adjust-psi.component.html',
  providers: [QueryService]
})
export class AdjustPsiComponent extends CustomBaseContext implements OnInit {
  frameworkComponents = Object.assign(
    {},
    this.gridOptions.frameworkComponents,
    {
      numberInputRenderer: NumberInputEditorComponent,
    },
  );

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private modalHelper: ModalHelper,
  ) {
    super({ appTranslationSrv: appTranslationService });
  }

  i: any;
  businessUnitCodeOptions: any[] = [];
  categoryOptions: any[] = [];
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

  // 搜索项
  queryParams: any = {
    businessUnitCode: null,
    marketCategory: [],
  };
  // 调整月份
  month = 1;
  // 锁定月份
  monthCheckedList: any[] = [
    { value: 1, label: '1月', checked: false, },
    { value: 2, label: '2月', checked: false, },
    { value: 3, label: '3月', checked: false, },
    { value: 4, label: '4月', checked: false, },
    { value: 5, label: '5月', checked: false, },
    { value: 6, label: '6月', checked: false, },
    { value: 7, label: '7月', checked: false, },
    { value: 8, label: '8月', checked: false, },
    { value: 9, label: '9月', checked: false, },
    { value: 10, label: '10月', checked: false, },
    { value: 11, label: '11月', checked: false, },
    { value: 12, label: '12月', checked: false, },
  ];
  // 调整月份选项
  monthList: any[] = [];

  columns: any[] = [];

  editedRows: any[] = [];

  // 用于保存的数据
  items: any[] = [];

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
    this.renderMonthList();
    this.getInfo();
  }

  renderMonthList() {
    this.monthList = this.monthCheckedList.filter(item => !item.checked);
    if (this.monthList.length) {
      this.month = this.monthList[0].value;
    } else {
      this.month = null;
    }
  }

  monthCheckedListChange() {
    this.renderMonthList();
  }

  getInfo() {
    const params = { ...this.i };
    this.queryService.getInfo(params).subscribe(res => {
      if (res.code === 200) {
        const data = res.data || {};
        // this.queryParams.psiCode = data.psiCode;
        // this.queryParams.planPeriodMonth = data.planPeriodMonth;
        // this.queryParams.smltNum = data.smltNum;
        // this.queryParams.rsltVersion = data.rsltVersion;
        // this.queryParams.businessUnitCode = data.businessUnitCode;
        // this.queryParams.marketCategory = data.marketCategory;
        // const category = data.marketCategory ? data.marketCategory.split(',') : [];
        // this.queryParams.marketCategory = category;
        this.queryParams = data;
        if (this.queryParams.marketCategory) {
          this.queryParams.marketCategory = this.queryParams.marketCategory.split(',');
        } else {
          this.queryParams.marketCategory = [];
        }
        this.loadData();
        this.query();
      }
    });
  }

  // 查询参数
  getQueryParams(): any {
    const params = {
      month: this.month,
      planPeriodMonth: this.queryParams.planPeriodMonth,
      psiCode: this.queryParams.psiCode,
      rsltVersion: this.queryParams.rsltVersion,
      smltNum: this.queryParams.smltNum,
    };
    return params;
  }

  // 渲染表头
  renderColumns() {
    const columns = [
      { field: 'marketCategory', headerName: '品类金额不含税', pinned: 'left', type: 'rowSpan', },
      { field: 'channel', headerName: '渠道', pinned: 'left', width: 80, valueFormatter: 'ctx.optionsFind(value, 1).label', },
      {
        headerName: `${this.month === 1 ? 12 : this.month - 1}月库存周转`,
        children: [
          { field: 'valInvAmtLast', headerName: '价值链库存亿', },
          { field: 'selfInvAmtLast', headerName: '自有库存亿', headerClass: 'uneditable', },
          { field: 'chnlInvAmtLast', headerName: '渠道库存亿', headerClass: 'uneditable', },
          { field: 'mthAvgSaleAmtLast', headerName: '月均分销亿', },
          { field: 'valInvSaveSaleRatioLast', headerName: '价值链存销比-天', },
          { field: 'selfInvSaveSaleRatioLast', headerName: '自有存销比-天', },
          { field: 'chnlInvSaveSaleRatioLast', headerName: '渠道存销比-天', },
        ],
      },
      {
        headerName: `${this.month}月`,
        children: [
          {
            headerName: '生产',
            children: [
              { field: 'prodAmt', headerName: '生产金额', },
              { field: 'entitySelfPlanning', headerName: '实体自制规划万台', editable: params => this.isEditable(params), cellEditor: 'numberInputRenderer', },
              { field: 'emptyPlanning', headerName: '空壳规划万台', editable: params => this.isEditable(params), cellEditor: 'numberInputRenderer', },
              { field: 'oemPlanning', headerName: 'OEM规划万台', editable: params => this.isEditable(params), cellEditor: 'numberInputRenderer', },
              { field: 'prodAvgPrice', headerName: '生产均价', },
              { field: 'entitySelfAmt', headerName: '实体自制金额亿', },
              { field: 'oemPlanningAmt', headerName: 'OEM规划亿元', },
            ],
          },
          {
            headerName: '出仓',
            children: [
              { field: 'pickUpGoodsNum', headerName: '提货需求量万台', editable: params => this.isEditable(params), cellEditor: 'numberInputRenderer', },
              { field: 'pickUpGoodsAtm', headerName: '提货需求金额亿', editable: params => this.isEditable(params), cellEditor: 'numberInputRenderer', },
              { field: 'pickUpGoodsRatio', headerName: '提货同比', },
            ],
          },
          {
            headerName: '分销',
            children: [
              { field: 'salePlanningAmt', headerName: '分销规划金额亿', },
              { field: 'salePlanningRatio', headerName: '分销同比', },
            ],
          },
          {
            headerName: '库存周转',
            children: [
              { field: 'valInvAmt', headerName: '价值链库存亿', },
              { field: 'selfInvAmt', headerName: '自有库存亿', editable: params => this.isEditable(params), cellEditor: 'numberInputRenderer', },
              { field: 'chnlInvAmt', headerName: '渠道库存亿', editable: params => this.isEditable(params), cellEditor: 'numberInputRenderer', },
              { field: 'mthAvgSaleAmt', headerName: '月均分销亿', },
              { field: 'valInvSaveSaleRatio', headerName: '价值链存销比-天', },
              { field: 'selfInvSaveSaleRatio', headerName: '自有存销比-天', },
              { field: 'chnlInvSaveSaleRatio', headerName: '渠道存销比-天', },
            ],
          },
        ]
      },
    ];

    this.columns = columns;
  }

  // 可编辑
  isEditable(params): Boolean {
    const value = params.data.channel;
    return value === '1' || value === '2';
  }

  query() {
    this.editedRows.length = 0;
    this.renderColumns();
    const params = this.getQueryParams();
    this.queryService.getAdjustPsi(params).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      this.items = data.filter(item => item.channel === '1' || item.channel === '2');
      this.gridData = this.createData(data);
      setTimeout(() => {
        this.onVirtualColumnsChanged(null);
      })
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

  // 查询
  search() {
    this.query();
  }

  // 保存
  save() {
    this.modalHelper.static(
      AdjustPsiSaveComponent,
      {
        i: {
          psiCode: this.queryParams.psiCode,
          rsltVersion: this.queryParams.rsltVersion,
          items: this.items,
          planPeriodMonth: this.queryParams.planPeriodMonth,
        },
      },
      'xl',
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  // 修改生产均价
  edit() {
    this.modalHelper.static(
      AdjustPsiEditComponent,
      {
        i: {
          psiCode: this.queryParams.psiCode,
          rsltVersion: this.queryParams.rsltVersion,
          marketCategory: null,
          channel: null,
        },
        marketCategory: this.queryParams.marketCategory,
        gridData: this.gridData,
      },
      'xl',
    ).subscribe(res => {});
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['实体自制规划万台', '空壳规划万台', 'OEM规划万台', '提货需求量万台', '分销规划金额亿', '自有库存亿', '渠道库存亿', ];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#adjustPsi');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          if (!dom.parentElement.parentElement.parentElement.classList.contains('uneditable')) {
            dom.setAttribute('style', 'color: #F6A52C');
          }
        }
      });
    }
  }

  onCellValueChanged(event) {
    const data = event.node.data;
    if (!this.editedRows.map(item => item.id).includes(data.id)) {
      this.editedRows.push(data);
    }
  }

  // 加载搜索项
  loadData() {
    this.getBusinessUnitCodeOptions();
    this.getCategoryOptions();
  }

  // 获取事业部列表
  getBusinessUnitCodeOptions() {
    this.businessUnitCodeOptions.length = 0;
    this.queryService.getScheduleRegion().subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      data.forEach(item => {
        this.businessUnitCodeOptions.push({
          value: item.scheduleRegionCode,
          label: item.descriptions,
        });
      });
    });
  }

  // 获取品类列表
  getCategoryOptions() {
    const businessUnitCode = this.i.businessUnitCode;
    this.categoryOptions.length = 0;
    this.queryService.getCategoryOptions(businessUnitCode).subscribe(res => {
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      const marketCategory = Array.from(new Set(data.filter(item => item.marketCategory).map(item => item.marketCategory)));
      marketCategory.forEach(item => {
        this.categoryOptions.push({
          label: item,
          value: item,
        });
      });
    });
  }

  // 关闭
  close() {
    this.modal.destroy();
  }
}
