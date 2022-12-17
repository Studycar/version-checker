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
import { MidDWDatasetEntitiesService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AlgorithmEngineDatasetEntitiesComponent } from './dataset-entities/dataset-entities.component';

@Component({
  selector: 'algorithm-engine-mid-dw-dataset-entities',
  templateUrl: './mid-dw-dataset-entities.component.html',
  providers: [MidDWDatasetEntitiesService]
})
export class AlgorithmEngineMidDWDatasetEntitiesComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  public datasetTypeList: any[] = [];
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
      {
        field: 'datasetType',
        title: '数据集类型',
        ui: {
          type: UiType.select,
          options: this.datasetTypeList
        },
      },
      {
        field: 'datasetName',
        title: '数据集名称',
        ui: { type: UiType.text },
      },
      {
        field: 'datasetShortName',
        title: '数据集简称',
        ui: { type: UiType.text },
      },
    ],
    values: {
      categoryCode: '',
      categoryName: '',
      datasetType: '',
      datasetName: '',
      datasetShortName: '',
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
    field: 'datasetVersion',
    width: 60,
    headerName: '版本'
  },
  {
    field: 'categoryCode',
    width: 210,
    headerName: '数据集大类编码'
  },
  {
    field: 'categoryName',
    width: 210,
    headerName: '数据集大类名称'
  },
  {
    field: 'datasetName',
    width: 150,
    headerName: '数据集名称'
  },
  {
    field: 'datasetDescription',
    width: 150,
    headerName: '数据集描述',
  },
  {
    field: 'datasetShortName',
    width: 150,
    headerName: '数据集简称'
  },
  {
    field: 'datasetORMNum',
    width: 180,
    headerName: '数据实体个数',
  },
  {
    field: 'datasetTypeDesc',
    width: 150,
    headerName: '数据集类型',
  },
  {
    field: 'totalSqlStatements',
    width: 180,
    headerName: 'SQL合并脚本',
  },
  {
    field: 'createdBy',
    width: 90,
    headerName: '创建人'
  },
  {
    field: 'creationDate',
    width: 120,
    headerName: '创建时间'
  }
  ];

  constructor(public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: MidDWDatasetEntitiesService,
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
    this.commonQueryService.GetLookupByTypeRef('AI_MID_DW_DATASET_TYPE', this.datasetTypeList);
  }
  // 获取查询参数
  private getQueryParamsValue(): any {
    return {
      categoryCode: this.queryParams.values.categoryCode,
      categoryName: this.queryParams.values.categoryName,
      datasetType: this.queryParams.values.datasetType,
      datasetName: this.queryParams.values.datasetName,
      datasetShortName: this.queryParams.values.datasetShortName,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }
  httpAction = { url: this.editService.getDatasetsPageUrl, method: 'GET' };

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

  // 数据集实体
  public show() {
    const rows = this.gridApi.getSelectedRows();
    if (rows.length !== 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请勾选一行记录!'));
      return;
    }
    this.modal
      .static(
        AlgorithmEngineDatasetEntitiesComponent,
        {
          i:
          {
            datasetId: rows[0].id,
            datasetName: rows[0].datasetName,
            datasetShortName: rows[0].datasetShortName,
            datasetType: rows[0].datasetType,
            sqlColumnClauses:rows[0].sqlColumnClauses,
            sqlTableClauses:rows[0].sqlTableClauses,
            sqlWhereClauses:rows[0].sqlWhereClauses,
            totalSqlStatements:rows[0].totalSqlStatements,
            datasetVersion:rows[0].datasetVersion
          }
        },
        1200,
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
        AlgorithmEngineDatasetEntitiesComponent,
        {
          i: {
            datasetId: item.id,
            datasetName: item.datasetName,
            datasetShortName: item.datasetShortName,
            datasetType: item.datasetType,
            sqlColumnClauses:item.sqlColumnClauses,
            sqlTableClauses:item.sqlTableClauses,
            sqlWhereClauses:item.sqlWhereClauses,
            totalSqlStatements:item.totalSqlStatements,
            datasetVersion:item.datasetVersion
          },
        },
        1200,
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
    this.editService.exportAction({ url: this.editService.getDatasetsUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
  }
  public clear() {
    this.queryParams.values = {
      categoryCode: '',
      categoryName: '',
      datasetType: '',
      datasetName: '',
      datasetShortName: '',
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
