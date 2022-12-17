import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { MidDWCategoriesService } from '../query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AlgorithmEngineCategoriesDatasetsEditComponent } from './edit/edit.component';

@Component({
  selector: 'algorithm-engine-categories-datasets',
  templateUrl: './categories-datasets.component.html',
  providers: [MidDWCategoriesService]
})
export class AlgorithmEngineCategoriesDatasetsComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public i: any;
  public selectBy = 'id';
  public queryParams = {
    defines: [
    ],
    values: {
      categoryId: '',
    },
  };

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 40,
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
      field: 'datasetVersion',
      width: 80,
      headerName: '版本'
    },
    {
      field: 'datasetName',
      width: 120,
      headerName: '数据集名称'
    },
    {
      field: 'datasetDescription',
      width: 120,
      headerName: '数据集描述'
    },
    {
      field: 'datasetShortName',
      width: 120,
      headerName: '数据集简称'
    },
    {
      field: 'datasetORMNum',
      width: 120,
      headerName: '数据实体（个数）'
    },
    {
      field: 'totalSqlStatements',
      width: 200,
      headerName: 'SQL合并脚本'
    },
    {
      field: 'debugStatusDesc',
      width: 100,
      headerName: 'SQL调试状态'
    },
    {
      field: 'datasetStatusDesc',
      width: 100,
      headerName: '数据集状态'
    },
    {
      field: 'createdBy',
      width: 100,
      headerName: '创建人'
    },
    {
      field: 'creationDate',
      width: 100,
      headerName: '创建时间'
    },
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
    this.queryParams.values.categoryId = this.i.categoryId;
  }
  // 获取查询参数
  private getQueryParamsValue(): any {
    return {
      categoryId: this.queryParams.values.categoryId,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }
  httpAction = { url: this.editService.queryEditUrl, method: 'GET' };

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
        AlgorithmEngineCategoriesDatasetsEditComponent,
        {
          i: item !== undefined ? item : { categoryId: this.i.categoryId,categoryCode:this.i.categoryCode,categoryShortName:this.i.categoryShortName }
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }


  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    this.editService.exportAction({ url: this.editService.exportEditUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
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
