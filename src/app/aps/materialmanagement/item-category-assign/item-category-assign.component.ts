import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { State, process } from '@progress/kendo-data-query';
import { MaterialmanagementItemCategoryAssignEditComponent } from './edit/edit.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { MaterialmanagementItemCategoryAssignImportComponent } from './import/import.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppGridStateService } from '../../../modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-item-category-assign',
  templateUrl: './item-category-assign.component.html',
  providers: [QueryService]
})
export class MaterialmanagementItemCategoryAssignComponent extends CustomBaseContext implements OnInit {
  // public context = this;
  public selectBy = 'ID';
  public plantOptions: any[] = [];
  public categorySetOptions: any[] = [];
  public categoryOptions: any[] = [];
  public itemOptions: any[] = [];
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  }; // 物料起
  public gridViewItems2: GridDataResult = {
    data: [],
    total: 0
  }; // 物料止
  public columnsItems: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料',
      width: '100'
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100'
    }
  ];

  public queryParams = {
    defines: [
      { field: 'PLANT_CODE', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 } },
      {
        field: 'ITEM_CODE_MIN', title: '物料起', ui: {
          type: UiType.popupSelect, valueField: 'ITEM_CODE', textField: 'ITEM_CODE' /*valueField和textField与gridView的列对应  */
          , gridView: this.gridViewItems, columns: this.columnsItems, eventNo: 2
        }
      },
      {
        field: 'ITEM_CODE_MAX', title: '物料止', ui: {
          type: UiType.popupSelect, valueField: 'ITEM_CODE', textField: 'ITEM_CODE' /*valueField和textField与gridView的列对应  */
          , gridView: this.gridViewItems2, columns: this.columnsItems, eventNo: 3
        }
      },
      { field: 'ITEM_DESCRIPTION', title: '物料描述', ui: { type: UiType.text } },
      { field: 'CATEGORY_SET_CODE', title: '类别集', ui: { type: UiType.select, options: this.categorySetOptions, eventNo: 4 } },
      {
        field: 'CATEGORY_CODE', title: '类别', ui: {
          type: UiType.scrollSelect, options: this.categoryOptions, extraEvent: {
            ScrollEventNo: 5, // 下拉选择的滚动事件序号
            SearchEventNo: 6
          }
        }
      }
    ],
    values: {
      PLANT_CODE: '',
      ITEM_CODE_MIN: { value: '', text: '' },
      ITEM_CODE_MAX: { value: '', text: '' },
      ITEM_DESCRIPTION: '',
      CATEGORY_SET_CODE: '',
      CATEGORY_CODE: '',
      PAGE_INDEX: 1,
      PAGE_SIZE: this.gridState.take
    }
  };
  public columns = [
    { field: 'PLANT_CODE', title: '工厂', width: 80, locked: false },
    { field: 'ITEM_CODE', title: '物料', width: 150, locked: false },
    { field: 'ITEM_DESCRIPTION', title: '物料描述', width: 200, locked: false, ui: { tooltip: 1 } },
    { field: 'CATEGORY_SET_CODE', title: '类别集', width: 120, locked: false },
    { field: 'CATEGORY_SET_DESCRIPTION', title: '类别集描述', width: 200, locked: false, ui: { tooltip: 1 } },
    { field: 'CATEGORY_CODE', title: '类别', width: 120, locked: false, ui: { tooltip: 1 } },
    { field: 'CATEGORY_DESCRIPTION', title: '类别描述', width: 200, locked: false, ui: { tooltip: 1 } }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public commonQueryService: QueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
  }

  ngOnInit() {
    // 加载工厂
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(d => {
        this.plantOptions.push(
          {
            label: d.PLANT_CODE,
            value: d.PLANT_CODE,
          }
        );
      });
    });
    // 加载类别集
    this.commonQueryService.GetCategorySet('').subscribe(res => {
      res.extra.forEach(d => {
        this.categorySetOptions.push(
          {
            label: d.CATEGORY_SET_CODE,
            value: d.CATEGORY_SET_CODE,
          }
        );
      });
    });
    // 加载类别
    this.categoriesSearch('');
    this.clear();
    this.queryCommon();
  }

  // 工厂切换
  public plantChange(event: string) {
  }
  /* 分页加载类别 */
  public loadCategories(options: any[], categorySetCode: string, categoryCode: string, PageIndex: number, PageSize: number, IsNew: boolean = false) {
    this.commonQueryService.GetCategoryPageList(categorySetCode, categoryCode, PageIndex, PageSize).subscribe(result => {
      if (result !== null && result.Result !== null) {
        if (IsNew) options.length = 0;
        result.Result.forEach(d => {
          options.push({
            label: d.CATEGORY_CODE,
            value: d.CATEGORY_CODE,
          });
        });
      }
    });
  }
  private categorySearchCode = '';
  private pageIndex = 1;
  private pageSize = 10;
  /* 类别scroll */
  categoriesScroll(event: any) {
    this.pageIndex++;
    this.loadCategories(this.categoryOptions, this.queryParams.values.CATEGORY_SET_CODE || '', this.categorySearchCode, this.pageIndex, this.pageSize);
  }
  /* 类别search */
  categoriesSearch(event: any) {
    this.categorySearchCode = event;
    this.pageIndex = 1;
    this.categoryOptions.length = 0;
    this.loadCategories(this.categoryOptions, this.queryParams.values.CATEGORY_SET_CODE || '', this.categorySearchCode, this.pageIndex, this.pageSize, true);
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number, ViewNo: number = 1) {
    // 加载物料
    this.commonQueryService.GetUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      if (ViewNo === 1) {
        this.gridViewItems.data = res.Result;
        this.gridViewItems.total = res.TotalCount;
      } else {
        this.gridViewItems2.data = res.Result;
        this.gridViewItems2.total = res.TotalCount;
      }
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.PLANT_CODE, e.SearchValue, PageIndex, e.PageSize);
  }
  // 物料弹出查询
  public searchItems2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.PLANT_CODE, e.SearchValue, PageIndex, e.PageSize, 2);
  }
  // 类别集切换
  public categorySetChange(event: string) {
    this.queryParams.values.CATEGORY_CODE = '';
    this.categoriesSearch('');
  }

  httpAction = { url: this.commonQueryService.queryUrl, method: 'POST' };
  /* 查询 */
  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridView(this.httpAction, this.getQueryParamsValue(), this.context);
  }
  /* 重置 */
  public clear() {
    this.queryParams.values = {
      PLANT_CODE: this.appConfigService.getPlantCode(),
      ITEM_CODE_MIN: { value: '', text: '' },
      ITEM_CODE_MAX: { value: '', text: '' },
      ITEM_DESCRIPTION: '',
      CATEGORY_SET_CODE: '',
      CATEGORY_CODE: '',
      PAGE_INDEX: 1,
      PAGE_SIZE: this.gridState.take
    };
    this.gridViewItems.data = [];
    this.gridViewItems.total = 0;
    this.gridViewItems2.data = [];
    this.gridViewItems2.total = 0;
  }

  // 获取查询参数值
  private getQueryParamsValue(): any {
    return {
      PLANT_CODE: this.queryParams.values.PLANT_CODE,
      ITEM_CODE_MIN: this.queryParams.values.ITEM_CODE_MIN.text,
      ITEM_CODE_MAX: this.queryParams.values.ITEM_CODE_MAX.text,
      ITEM_DESCRIPTION: this.queryParams.values.ITEM_DESCRIPTION,
      CATEGORY_SET_CODE: this.queryParams.values.CATEGORY_SET_CODE,
      CATEGORY_CODE: this.queryParams.values.CATEGORY_CODE,
      PAGE_INDEX: this.gridState.skip / this.gridState.take + 1,
      PAGE_SIZE: this.gridState.take
    };
  }
  /* 页面切换 */
  public dataStateChange(state: State) {
    this.gridState = state;
    this.queryCommon();
  }
  /* 新增 */
  public add(item?: any) {
    this.modal
      .static(MaterialmanagementItemCategoryAssignEditComponent, { i: (item !== undefined ? this.clone(item) : { ID: null }) })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public import() {
    this.modal
      .static(MaterialmanagementItemCategoryAssignImportComponent, {}, 'md')
      .subscribe(() => this.queryCommon());
  }

  /* 删除 */
  public remove(item: any) {
    this.commonQueryService.Remove(item.ID).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        // this.msgSrv.error(res.Message);
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  /* 批量删除 */
  public removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.commonQueryService
          .BatchRemove(this.selectionKeys)
          .subscribe(res => {
            if (res.Success) {
              this.msgSrv.success(this.appTranslationService.translate('删除成功'));
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.Message));
            }
          });
      },
    });
  }

  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  /* 导出 */
  public export() {
    super.export();
    this.commonQueryService.exportAction({ url: this.commonQueryService.exportUrl, method: 'POST' }, this.getQueryParamsValue(), this.excelexport, this.context);
  }

  /* 导入 */
  impColumns = {
    columns: ['工厂', '物料', '类别集', '类别'],
    paramMappings: [
      { field: 'PLANT_CODE', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'ITEM_CODE', title: '物料', columnIndex: 2, constraint: { notNull: true } },
      { field: 'CATEGORY_SET_CODE', title: '类别集', columnIndex: 3, constraint: { notNull: true } },
      { field: 'CATEGORY_CODE', title: '类别', columnIndex: 4, type: 'date', constraint: { notNull: true, } },
      { field: 'ROW_NUMBER', title: '行号', default: 1 }
    ],
  };
  expColumnsError = [
    { field: 'PLANT_CODE', title: '工厂', width: 150, locked: false },
    { field: 'ITEM_CODE', title: '物料', width: 200, locked: false },
    { field: 'CATEGORY_SET_CODE', title: '类别集', width: 150, locked: false },
    { field: 'CATEGORY_CODE', title: '类别', width: 200, locked: false },
    { field: 'FAIL_MESSAGE', title: '错误信息', width: 300, locked: false }
  ];
  expColumnsOptionsError: any[] = [];
  @ViewChild('excelexportError', {static: true}) excelexportError: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.commonQueryService.Import(tempData).subscribe(res => {
      // if (res.Success) {
      //   this.msgSrv.success(this.appTranslationService.translate(res.Message));
      //   if (res.Extra != null && res.Extra.length > 0)
      //     this.excelexportError.export(res.Extra);
      //   this.query();
      // } else {
      //   this.msgSrv.error(this.appTranslationService.translate(res.Message));
      // }
      if (res.code === 200) {
        this.msgSrv.success('导入成功');
        //   if (res.Extra != null && res.Extra.length > 0)
       //    this.excelexportError.export(res.Extra);
        this.query();       
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }
}
