import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { deepCopy } from '@delon/util';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext, LookupItem } from 'app/modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { MessageManageService } from 'app/modules/generated_module/services/message-manage-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ProductSellBalanceForecastService } from '../product-sell-balance-forecast.service';
import { SopReductionRuleManageEditComponent } from './edit/edit.component';
import { SopReductionRuleManageService } from '../../../modules/generated_module/services/SopReductionRuleManage-service.';
import { EditService } from './edit.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-reductionRuleManage',
  templateUrl: './sop-reductionRuleManage.component.html',
  styleUrls: ['./sop-reductionRuleManage.component.css'],
  encapsulation: ViewEncapsulation.None, // 组件css直接应用于全局CSS（css可进可出）
  providers: [ProductSellBalanceForecastService, EditService]
})
export class SopReductionRuleManageComponent extends CustomBaseContext implements OnInit {
  public BtnImg = {
    addImgSrc: '/assets/imgs/base-icon/基础icon-新增.svg',
    save: '/assets/imgs/planSchedule/11.svg',
    save_disabled: '/assets/imgs/planSchedule/11_un.svg',
  };
  public valueChangedItem = new Map(); // 更新的项数组
  selectBy = 'Id';
  public sopConsumeOption: any[] = []; // 冲减规则
  public consumeProductionOption: any[] = []; // 产品维度
  public CustomerOptions = [
    { label: '客户编码', value: '客户编码' },
    { label: '业务区域', value: '业务区域' },
    { label: '业务大区', value: '业务大区' },
    { label: '总部', value: '总部' },
  ];
  public queryParams = {
    defines: [
      { field: 'CONSUME_CODE', title: '冲减规则', ui: { type: UiType.select, options: this.sopConsumeOption, optionsLabel: 'label', optionsValue: 'value', /* optionsValue: 'Code'*/ } },
    ],
    values: {
      CONSUME_CODE: null,
    }
  };

  public origin_columns = [];
  public columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }, menuTabs: ['filterMenuTab']
    },
    {
      field: 'CONSUME_CODE', headerName: '冲减规则', editable: true, width: 100,
      pinned: 'left', lockPinned: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        if (params.colDef.field === 'CONSUME_CODE') {
          return { values: this.filterData(this.sopConsumeOption) };
        }
      }, menuTabs: ['filterMenuTab']
    },
    {
      field: 'CONSUMER_PRIORITY', headerName: '冲减优先级', editable: true, pinned: 'left', lockPinned: true, cellEditor: 'agTextCellEditor', menuTabs: ['filterMenuTab']
    },
    {
      field: 'CONSUME_PRODUCTION', headerName: '产品维度', editable: true,
      pinned: 'left', lockPinned: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        if (params.colDef.field === 'CONSUME_PRODUCTION') {
          return { values: this.filterData(this.consumeProductionOption) };
        }
      }, menuTabs: ['filterMenuTab']
    },
    {
      field: 'CONSUME_CUSTOMER', headerName: '客户维度', editable: true,
      pinned: 'left', lockPinned: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        if (params.colDef.field === 'CONSUME_CUSTOMER') {
          return { values: this.filterData(this.CustomerOptions) };
        }
      }, menuTabs: ['filterMenuTab']
    }
  ];

  constructor(public pro: BrandService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private messageManageService: MessageManageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private innerService: ProductSellBalanceForecastService,
    private sopReductionRuleManageService: SopReductionRuleManageService,
    public editService: EditService,
    private appConfigService: AppConfigService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService, commonQuerySrv: innerService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.gridData = [];
    this.cloneQueryParams();
    this.init();
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {
    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      if (this.allColumnIds.length < 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('sop-reductionRuleManage');
  }

  /**
   * 控件初始化
   */
  protected init(): void {
    this.consumeProductionOption.push({ label: '产品编码', value: '产品编码' });
    this.sopReductionRuleManageService.filterLookUpByCode('SOP_CONSUME_CODE', this.appConfigService.getPlantCode()).subscribe(result => {
      result.Extra.forEach(d => {
        this.sopConsumeOption.push({
          label: d.MEANING,
          value: d.MEANING,
        });
      });
    });

    this.sopReductionRuleManageService.getConsumeProduction().subscribe(result => {
      result.Extra.forEach(d => {
        this.consumeProductionOption.push({
          label: d.CATEGORY_SET_CODE,
          value: d.CATEGORY_SET_CODE,
        });
      });
    });
  }

  // 重置
  public clear() {
    super.clear();
    this.queryParams.values = {
      CONSUME_CODE: null,
    };
  }

  // 单元格内容改变
  onCellValueChanged(event) {
    console.log(event);
    if (this.isNullDefault(event.oldValue, '').toString() !== this.isNullDefault(event.newValue, '').toString()) {
      this.editService.update(event.data);
    }
  }

  /**
   * grid加载完毕回调事件
  gridLoadCallback() {
    super.gridLoadCallback();
    this.columns = deepCopy(this.origin_columns);
    (<any>this.gridApi).setColumnDefs(this.columns);
  }
  */

  /**
   * 获取单元格更新的值对象
   */
  getCellUpdateValueObj(data: any) {
    const obj = {
      ID: '',
      RelativeID: '',
      FieldName: '',
      Value: '',
      PeriodIndex: 0,
    };
    const fields = ['CONSUME_CODE', 'CONSUMER_PRIORITY', 'CONSUME_PRODUCTION', 'CONSUME_CUSTOMER'];
    if (fields.findIndex(it => it === data.column.colId) >= 0) {
      obj.ID = data.data.ID;
      obj.FieldName = data.column.colId;
      obj.Value = data.newValue;
    } else {
      // 获取更新对应记录的ID
      const columnIndex = data.column.userProvidedColDef.periodIndex;
      // 寻找该月份对应的行记录ID，如果找不到，则传入相关联的本月的行ID值
      const relativeID = data.data.M_N_MONTH_INVENTORY[columnIndex].SOP_UNCSTR_FORECAST_ID;
      if (relativeID !== undefined && relativeID !== null) {
        obj.ID = relativeID;
      } else {
        obj.RelativeID = data.data.ID;
      }
      obj.FieldName = data.column.userProvidedColDef.dbField;
      obj.Value = data.newValue;
      obj.PeriodIndex = data.column.userProvidedColDef.periodIndex;
    }
    return obj;
  }

  /**
   * 保存调整后的数据
   */
  public save(): void {
    this.gridApi.showLoadingOverlay();
    this.sopReductionRuleManageService.Update(this.editService.getUpdateItems())
      .subscribe((rsp) => {
        this.gridApi.hideOverlay();
        if (rsp.Success) {
          this.msgSrv.success(this.appTranslationService.translate(rsp.Message || '保存成功'));
          this.query();
          this.editService.reset();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(rsp.Message));
        }
      });
  }

  /**
   * 格式化需求日期
   * @param value
   */
  public demandDateFormatter(value) {
    return this.innerService.formatDateTime2(value, 'yyyy-MM');
  }

  /**
   * 导入
   */
  public import() {
    this.modal
      .static(SopReductionRuleManageEditComponent, {}, 'md')
      .subscribe((rsp) => {
        if (rsp) {
          this.query();
        }
      });
  }

  /* 新增 */
  public add(item?: any) {
    this.modal
      .static(SopReductionRuleManageEditComponent,
        {
          i: {
            ID: (item !== undefined ? item.ID : null),
            CONSUME_CODE: (item !== undefined ? item.CONSUME_CODE : null),
            CONSUMER_PRIORITY: (item !== undefined ? item.CONSUMER_PRIORITY : null),
            CONSUME_PRODUCTION: (item !== undefined ? item.CONSUME_PRODUCTION : null),
            CONSUME_CUSTOMER: (item !== undefined ? item.CONSUME_CUSTOMER : null),
          },
          sopConsumeOption: this.sopConsumeOption,
          consumeProductionOption: this.consumeProductionOption
        })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  /**
   * 查询
   */
  public query() {
    super.query();
    this.queryCommon();
  }

  /**
   * 查询的公共方法
   */
  httpAction = { url: this.sopReductionRuleManageService.queryUrl, method: 'POST' };
  public queryCommon() {
    this.innerService.loadGridView(this.httpAction, this.queryParams.values, this.context);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  public removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.sopReductionRuleManageService
          .removeBatch(this.selectionKeys)
          .subscribe(res => {
            if (res.Success) {
              this.msgSrv.success(this.appTranslationService.translate(res.Message || '删除成功'));
              this.selectionKeys.length = 0;
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.Message));
            }
          });
      },
    });
  }

  /**
   * 构造查询参数
   */
  public getqueryParams(): any {
    return this.queryParams.values;
  }

  /**
   * 过滤数据
   */
  public filterData(resData: any[]): any {
    const selectValue = [];
    resData.forEach(t => {
      selectValue.push(t.value);
    });
    return selectValue;
  }
}
