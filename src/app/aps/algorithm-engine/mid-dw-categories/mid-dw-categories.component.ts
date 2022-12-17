import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { MidDWCategoriesService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AlgorithmEngineMidDWCategoriesEditComponent } from './edit/edit.component';
import { AlgorithmEngineCategoriesDatasetsComponent } from './categories-datasets/categories-datasets.component';

@Component({
  selector: 'algorithm-engine-mid-dw-categories',
  templateUrl: './mid-dw-categories.component.html',
  providers: [MidDWCategoriesService]
})
export class AlgorithmEngineMidDWCategoriesComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  public yesNoList: any[] = [];
  public queryParams = {
    defines: [
      {
        field: 'categoryCode',
        title: '数据集大类编码',
        ui: { type: UiType.text },
      },
      {
        field: 'categoryName',
        title: '数据集大类名称',
        ui: { type: UiType.text },
      },
      // {
      //   field: 'activeFlag',
      //   title: '是否有效',
      //   ui: {
      //     type: UiType.select,
      //     options: this.yesNoList
      //   },
      // },
    ],
    values: {
      categoryCode: '',
      categoryName: '',
      // activeFlag: 'Y'
    },
  };

  public columns = [{
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
    field: 'categoryCode',
    width: 120,
    headerName: '数据集大类编码'
  },
  {
    field: 'categoryName',
    width: 150,
    headerName: '数据集大类名称'
  },
  {
    field: 'categoryDescription',
    width: 150,
    headerName: '数据集大类描述'
  },
  {
    field: 'categoryShortName',
    width: 150,
    headerName: '数据集大类英文简称'
  },
  {
    field: 'activeFlagDesc',
    width: 100,
    headerName: '是否有效',
  },
  {
    field: 'createdBy',
    width: 100,
    headerName: '创建人'
  },
  {
    field: 'creationDate',
    width: 150,
    headerName: '创建时间'
  }
  ];

  constructor(public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: MidDWCategoriesService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private exportImportService: ExportImportService
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
    this.loadInitData();
    this.query();
  }
  // 初始数据加载
  private loadInitData() {
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.yesNoList);
  }
  // 获取查询参数
  private getQueryParamsValue(): any {
    return {
      categoryCode: this.queryParams.values.categoryCode,
      categoryName: this.queryParams.values.categoryName,
      // activeFlag: this.queryParams.values.activeFlag,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }
  httpAction = { url: this.editService.queryUrl, method: 'GET' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridView(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
    );
  }

  // 新增 or 编辑
  public add(item?: any) {
    this.modal
      .static(
        AlgorithmEngineMidDWCategoriesEditComponent,
        {
          i: item !== undefined ? item : { id: null }
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  // 数据集
  public show() {
    const rows = this.gridApi.getSelectedRows();
    if (rows.length !== 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请勾选一行记录!'));
      return;
    }
    this.modal
      .static(
        AlgorithmEngineCategoriesDatasetsComponent,
        {
          i:
          {
            categoryId: rows[0].id,
            categoryCode: rows[0].categoryCode,
            categoryShortName: rows[0].categoryShortName,
          }
        },
        1100,
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  detail(item: any) {
    this.modal
      .static(
        AlgorithmEngineCategoriesDatasetsComponent,
        {
          i: {
            categoryId: item.id,
            categoryCode: item.categoryCode,
            categoryShortName: item.categoryShortName,
          },
        },
        1100,
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    this.editService.exportAction({ url: this.editService.exportUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
  }
  public clear() {
    this.queryParams.values = {
      categoryCode: '',
      categoryName: '',
      // activeFlag: 'Y'
    };
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.queryCommon();
  }
}
