import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ModalHelper } from '@delon/theme';
import { ShowPsiComponent } from '../psi-list/show-psi/show-psi.component';

@Component({
  selector: 'psi-merge',
  templateUrl: './psi-merge.component.html',
  styles: [`
    .col { float: left; }
    .col-1 { width: 45%; }
    .col-2 { width: 10%; }
    .col-3 { width: 45%; }
    .op-col { display: flex; flex-direction: column; align-items: center; margin-top: 40px; }
    .info { width: 100%; display: flex; justify-content: space-between; margin-bottom: 10px; }
    .info-left { line-height: 32px; }
    .clearfix {
      zoom: 1;
    }
    .clearfix:before,
    .clearfix:after {
      content: " ";
      display: table;
    }
    .clearfix:after {
      clear: both;
      visibility: hidden;
      font-size: 0;
      height: 0;
    }
  `],
  providers: [QueryService]
})
export class PsiMergeComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private queryService: QueryService,
    private modal: ModalHelper,
    private modalService: NzModalService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  columns: any[] = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
    },
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: 'left', lockPinned: true,
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    { field: 'planPeriodMonth', headerName: '计划期', width: 100, },
    { field: 'marketCategory', headerName: '品类', },
    { field: 'psiCode', headerName: 'PSI编号', },
    { field: 'rsltVersion', headerName: 'PSI版本', width: 100, },
    { field: 'createdBy', headerName: '创建人', width: 100, },
  ];
  businessUnitCodeOptions: any[] = [];
  categoryOptions: any[] = [];
  isMergeOptions: any[] = [
    { value: '1', label: '是' },
    { value: '0', label: '否' },
  ];

  queryParams: any = {
    defines: [
      { field: 'businessUnitCode', title: '事业部', ui: { type: UiType.select, options: this.businessUnitCodeOptions, eventNo: 1, }, required: true, },
      { field: 'planPeriodMonth', title: '计划期', ui: { type: UiType.monthPicker, }, required: true, },
      { field: 'marketCategory', title: '品类', ui: { type: UiType.selectMultiple, options: this.categoryOptions, }, },
      { field: 'psiCode', title: 'PSI编号', ui: { type: UiType.string }, },
      { field: 'isMerge', title: '是否用于合并', ui: { type: UiType.select, options: this.isMergeOptions, }, },
    ],
    values: {
      businessUnitCode: this.appConfigService.getActiveScheduleRegionCode(),
      planPeriodMonth: new Date(),
      marketCategory: [],
      psiCode: null,
      isMerge: null,
    },
  };

  // 待选表格数据
  mainTable: any[] = [];
  // 已选表格数据
  selectTable: any[] = [];
  selectMarketCategory: any[] = [];
  selectMarketCategoryStr: string = '';
  loading: Boolean = false;
  saveLoading: Boolean = false;
  private gridApiMainTable;
  private gridApiSelectTable;


  ngOnInit(): void {
    this.columns.forEach(item => {
      if (item.headerName === '操作') {
        item.cellRendererParams.customTemplate = this.customTemplate;
      }
    });
    this.loadOptions();
    this.query();
  }

  // 加载搜索项
  loadOptions() {
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

  businessUnitCodeOptionsChange(event: any) {
    this.queryParams.values.marketCategory = [];
    this.getCategoryOptions();
  }

  // 获取品类列表
  getCategoryOptions() {
    const params = this.getQueryParams();
    this.categoryOptions.length = 0;
    this.queryService.getCategoryOptions(params.businessUnitCode).subscribe(res => {
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

  getQueryParams(isExport?: boolean): any {
    const params: any = { ...this.queryParams.values };
    if (isExport) {
      params.isExport = true;
    } else {
      params.pageIndex = this._pageNo;
      params.pageSize = this._pageSize;
    }
    const bu = this.businessUnitCodeOptions.find(item => item.value === params.businessUnitCode);
    params.businessUnit = bu ? bu.label : null;
    if (params.marketCategory && params.marketCategory.length) {
      params.marketCategory = params.marketCategory.join(',');
    } else {
      params.marketCategory = '';
    }
    params.planPeriodMonth = params.planPeriodMonth ? this.queryService.formatDateTime2(params.planPeriodMonth, 'yyyy-MM') : null;
    console.log('getQueryParams', params);
    return params;
  }

  query() {
    const params = this.getQueryParams();
    this.loading = true;
    if (!this.isNull(this.gridApiMainTable)) {
      this.gridApiMainTable.deselectAll(); // 清除选择项
    }
    this.queryService.getData(params).subscribe(res => {
      this.loading = false;
      const data = res.data && res.data.records && Array.isArray(res.data.records) ? res.data.records : [];
      const total = res.data && res.data.total ? res.data.total : 0;

      // 已选择的去重
      this.mainTable = this.contrast(data, this.selectTable);
      if (!this.isNull(this.gridApiMainTable)) {
        this.getSelectMarketCategory();
      }

      this.view = {
        data: this.mainTable,
        total: total,
      };
    });

    setTimeout(() => {
      this.gridApiSelectTable && this.gridApiSelectTable.hideOverlay();
    });
  }

  clear() {
    this.queryParams.values = {
      businessUnitCode: null,
      planPeriodMonth: null,
      marketCategory: [],
      psiCode: null,
      isMerge: null,
    };
  }

  // 判断选择项是否有重复的品类
  isSame(): Boolean {
    let flag = false;
    this.getSelectMarketCategory();
    if (new Set(this.selectMarketCategory).size !== this.selectMarketCategory.length) {
      flag = true;
    }
    return flag;
  }

  // 获取所有选择的品类
  getSelectMarketCategory() {
    this.selectMarketCategory = [];
    const leftList = this.gridApiMainTable.getSelectedRows();
    leftList.forEach((data) => {
      this.selectMarketCategory = this.selectMarketCategory.concat(data.marketCategory.split(','));
    });
    this.selectTable.forEach((data) => {
      this.selectMarketCategory = this.selectMarketCategory.concat(data.marketCategory.split(','));
    });
    this.selectMarketCategoryStr = [...new Set(this.selectMarketCategory)].toString();
  }

  // 对比找出不一样
  contrast(list1, list2): any[] {
    return list1.filter((l2) => list2.every((l1) => l1.id !== l2.id));
  }

  // 右移
  handleRightMove(): void {
    const leftList = this.gridApiMainTable.getSelectedRows();
    console.log('handleRightMove', leftList);
    if (this.isSame()) {
      this.msgSrv.warning(this.appTranslationService.translate('存在相同的品类，无法移动'));
      return;
    }
    this.selectTable = this.selectTable.concat(leftList);
    setTimeout(() => {
      this.mainTable = this.contrast(this.mainTable, this.selectTable);
      this.gridApiMainTable.deselectAll();
    });
  }
  // 右全移
  handleRightMoveAll(): void {
    this.gridApiMainTable.selectAll();
    setTimeout(() => {
      this.handleRightMove();
    });
  }
  // 左移
  handleLeftMove(): void {
    const rightList = this.gridApiSelectTable.getSelectedRows();
    if (rightList.length) {
      this.selectTable = this.contrast(this.selectTable, rightList);
      this.gridApiSelectTable.deselectAll();
      this.query();
    }
  }
  // 左全移
  handleLeftMoveAll(): void {
    console.log('handleLeftMoveAll');
    if (this.selectTable.length) {
      console.log(this.selectTable);
      this.gridApiSelectTable.selectAll();
      setTimeout(() => {
        this.handleLeftMove();
      });
    }
  }

  // 保存
  save(): void {
    const params = this.getQueryParams();
    const saveParams = {
      businessUnitCode: params.businessUnitCode,
      planPeriodMonth: params.planPeriodMonth,
      marketCategory: this.selectMarketCategoryStr,
      rsltVersion: 0,
      masterDtoList: this.selectTable,
    };
    this.saveLoading = true;
    this.queryService.save(saveParams).subscribe(res => {
      this.saveLoading = false;
      if (res.code === 200) {
        const psiCode = res.data.psiCode;
        const rsltVersion = res.data.rsltVersion;
        this.modalService.success({
          nzTitle: '提示',
          nzContent: `PSI合并成功！(PSI编号 = ${psiCode})`,
          nzOkText: '确定',
          nzCancelText: '查看详情',
          nzOnOk: () => {},
          nzOnCancel: () => {
            // 查看详情
            this.modal.static(
              ShowPsiComponent,
              {
                i: {
                  psiCode,
                  rsltVersion,
                },
              },
              'xl',
            ).subscribe(res => {});
          }
        });
        this.query();
        this.selectTable = [];
        this.selectMarketCategory = [];
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '保存失败'));
      }
    })

  }

  // 预览
  showPsi(dataItem: any) {
    this.modal.static(
      ShowPsiComponent,
      {
        i: {
          psiCode: dataItem.psiCode,
          rsltVersion: dataItem.rsltVersion,
        },
      },
      'xl',
    ).subscribe(res => {});
  }

  onGridReadyMainTable(params) {
    this.gridApiMainTable = params.api;
  }

  onGridReadySelectTable(params) {
    this.gridApiSelectTable = params.api;
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.query();
    } else {
      this.setLoading(false);
    }
  }
}
