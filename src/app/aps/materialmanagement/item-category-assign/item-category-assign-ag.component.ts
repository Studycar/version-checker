import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
} from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { MaterialmanagementItemCategoryAssignEditComponent } from './edit/edit.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { MaterialmanagementItemCategoryAssignImportComponent } from './import/import.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-item-category-assign-ag',
  templateUrl: './item-category-assign-ag.component.html',
  providers: [QueryService],
})
export class MaterialmanagementItemCategoryAssignAgComponent
  extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  public selectBy = 'id';
  public plantOptions: any[] = [];
  public categorySetOptions: any[] = [];
  public categoryOptions: any[] = [];
  public itemOptions: any[] = [];
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  }; // 物料起
  // public gridViewItems2: GridDataResult = {
  //   data: [],
  //   total: 0
  // }; // 物料止
  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];

  public queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions, eventNo: 1 },
      },
      {
        field: 'itemCode',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode' /*valueField和textField与gridView的列对应  */,
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2,
        },
      },
      {
        field: 'itemDescription',
        title: '物料描述',
        ui: { type: UiType.string },
      },
      {
        field: 'categorySetCode',
        title: '类别集',
        ui: {
          type: UiType.select,
          options: this.categorySetOptions,
          eventNo: 4,
        },
      },
      {
        field: 'categoryCode',
        title: '类别',
        ui: {
          type: UiType.scrollSelect,
          options: this.categoryOptions,
          extraEvent: {
            ScrollEventNo: 5, // 下拉选择的滚动事件序号
            SearchEventNo: 6,
          },
        },
      },
    ],
    values: {
      plantCode: '',
      itemCode: { value: '', text: '' },
      // ITEM_CODE_MAX: { value: '', text: '' },
      itemDescription: '',
      categorySetCode: '',
      categoryCode: '',
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    },
  };
  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1,
      cellClass: '',
      field: '',
      headerName: '',
      width: 40,
      pinned: 'left',
      lockPinned: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'plantCode',
      headerName: '工厂',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemCode',
      headerName: '物料编码',
      width: 165,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'itemDescription',
      headerName: '物料描述',
      width: 200,
      tooltipField: 'itemDescription',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'categorySetCode',
      headerName: '类别集',
      width: 120,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'categorySetDescription',
      headerName: '类别集描述',
      width: 200,
      tooltipField: 'categorySetDescription',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'categoryCode',
      headerName: '类别',
      width: 120,
      tooltipField: 'categoryCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'categoryDescription',
      headerName: '类别描述',
      width: 200,
      tooltipField: 'categoryDescription',
      menuTabs: ['filterMenuTab'],
    },
  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    public commonQueryService: QueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private exportImportService: ExportImportService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    // 加载工厂
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });


    /* 加载类别集*/
    this.commonQueryService.GetCategorySet('').subscribe(result => {
      result.data.forEach(d => {
        this.categorySetOptions.push({
          label: d.categorySetCode,
          value: d.categorySetCode
        });
      });
    });


    // 加载类别
    this.categoriesSearch('');
    this.clear();
    this.queryCommon();
  }

  // 工厂切换
  public plantChange(event: string) { }
  /* 分页加载类别 */
  public loadCategories(
    options: any[],
    categorySetCode: string,
    categoryCode: string,
    PageIndex: number,
    PageSize: number,
    IsNew: boolean = false,
  ) {
    this.commonQueryService
      .GetCategoryPageList1(categorySetCode, categoryCode, PageIndex, PageSize)
      .subscribe(result => {
        if (result !== null && result.data !== null) {
          if (IsNew) options.length = 0;
          result.data.content.forEach(d => {
            options.push({
              label: d.categoryCode,
              value: d.categoryCode,
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
    this.loadCategories(
      this.categoryOptions,
      this.queryParams.values.categorySetCode || '',
      this.categorySearchCode,
      this.pageIndex,
      this.pageSize,
    );
  }
  /* 类别search */
  categoriesSearch(event: any) {
    this.categorySearchCode = event;
    this.pageIndex = 1;
    this.categoryOptions.length = 0;
    this.loadCategories(
      this.categoryOptions,
      this.queryParams.values.categorySetCode || '',
      this.categorySearchCode,
      this.pageIndex,
      this.pageSize,
      true,
    );
  }

  public loadItems(
    PLANT_CODE: string,
    ITEM_CODE: string,
    PageIndex: number,
    PageSize: number,
    ViewNo: number = 1,
  ) {
    // 加载物料
    this.commonQueryService
      .getUserPlantItemPageList(
        PLANT_CODE || '',
        ITEM_CODE || '',
        '',
        PageIndex,
        PageSize,
      )
      .subscribe(res => {
        if (ViewNo === 1) {
          this.gridViewItems.data = res.data.content;
          this.gridViewItems.total = res.data.totalElements;
        }
        // else {
        //   this.gridViewItems2.data = res.Result;
        //   this.gridViewItems2.total = res.TotalCount;
        // }
      });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.plantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }
  // 物料弹出查询
  public searchItems2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.plantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
      2,
    );
  }



  onPopupRowSelectChanged(event: any) {
    this.queryParams.values.itemDescription = event.Value;
  }

  // 类别集切换
  public categorySetChange(event: string) {
    this.queryParams.values.categoryCode = '';
    this.categoriesSearch('');
  }

  httpAction = { url: this.commonQueryService.queryUrl, method: 'GET' };
  /* 查询 */
  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
    );
  }
  /* 重置 */
  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: { value: '', text: '' },
      // ITEM_CODE_MAX: { value: '', text: '' },
      itemDescription: '',
      categorySetCode: null,
      categoryCode: null,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
    this.gridViewItems.data = [];
    this.gridViewItems.total = 0;
    // this.gridViewItems2.data = [];
    // this.gridViewItems2.total = 0;
  }

  // 获取查询参数值
  private getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode.text,
      // ITEM_CODE_MAX: this.queryParams.values.ITEM_CODE_MAX.text,
      itemDescription: this.queryParams.values.itemDescription,
      categorySetCode: this.queryParams.values.categorySetCode,
      categoryCode: this.queryParams.values.categoryCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }
  /* 新增 */
  public add(item?: any) {
    this.modal
      .static(MaterialmanagementItemCategoryAssignEditComponent,
        { i: item !== undefined ? this.clone(item) : { id: null } }
        // { i: { id: item !== undefined ? item.id : null } },
      )
      .subscribe(value => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  // public import() {
  //   // this.modal
  //   //   .static(MaterialmanagementItemCategoryAssignImportComponent, {}, 'md')
  //   //   .subscribe(() => this.queryCommon());
  //   // 改用最新的方式来导入
  //   this.exportImportService.import('ITEM_CATEGORY_ASSIGN', result => {
  //     console.log('this.exportImportService.import(\'ITEM_CATEGORY_ASSIGN\')');
  //     if (result) {
  //       this.query();
  //     }
  //   });
  // }

  
  public import() {
    this.modal
      .static(MaterialmanagementItemCategoryAssignImportComponent, {}, 'md')
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  /* 删除 */
  public remove(item: any) {
    this.commonQueryService.Remove([item.id]).subscribe(res => {
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
      this.msgSrv.warning(
        this.appTranslationService.translate('请先选择要删除的记录！'),
      );
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.commonQueryService
          .Remove(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(
                this.appTranslationService.translate('删除成功'),
              );
              this.queryCommon();
            } else {
              this.msgSrv.error(
                this.appTranslationService.translate(this.appTranslationService.translate(res.msg)),
              );
            }
          });
      },
    });
  }

  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  /* 导出 */
  public export() {
    super.export(true);
    this.commonQueryService.exportAction(
      {
        url: this.commonQueryService.exportUrl,
        method: 'GET',
      },
      this.getQueryParamsValue(),
      this.excelexport,
    );
  }

  /* 导入 */
  impColumns = {
    columns: ['工厂', '物料编码', '类别集', '类别'],
    paramMappings: [
      {
        field: 'plantCode',
        title: '工厂',
        columnIndex: 1,
        constraint: { notNull: true },
      },
      {
        field: 'itemCode',
        title: '物料编码',
        columnIndex: 2,
        constraint: { notNull: true },
      },
      {
        field: 'categorySetCode',
        title: '类别集',
        columnIndex: 3,
        constraint: { notNull: true },
      },
      {
        field: 'categoryCode',
        title: '类别',
        columnIndex: 4,
        type: 'date',
        constraint: { notNull: true },
      },
      { field: 'rowNumber', title: '行号', default: 1 },
    ],
  };
  expColumnsError = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'itemCode', title: '物料编码', width: 200, locked: false },
    { field: 'categorySetCode', title: '类别集', width: 150, locked: false },
    { field: 'categoryCode', title: '类别', width: 200, locked: false },
    { field: 'failMessage', title: '错误信息', width: 300, locked: false },
  ];
  expColumnsOptionsError: any[] = [];
  @ViewChild('excelexportError', { static: true })
  excelexportError: CustomExcelExportComponent;

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
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
}
