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
import { MidDWDatasetEntitiesService } from '../query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AlgorithmEngineDatasetEntitiesEditComponent } from './edit/edit.component';
import { AlgorithmEngineEntitieOrganizationComponent } from '../entities-organization/entities-organization.component';

@Component({
  selector: 'algorithm-engine-dataset-entities',
  templateUrl: './dataset-entities.component.html',
  providers: [MidDWDatasetEntitiesService]
})
export class AlgorithmEngineDatasetEntitiesComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public i: any;
  public selectBy = 'id';
  public queryParams = {
    defines: [
    ],
    values: {
      datasetId: '',
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
      field: 'entityVersion',
      width: 60,
      headerName: '版本'
    },
    {
      field: 'entityName',
      width: 180,
      headerName: '数据实体名称'
    },
    {
      field: 'entityTableDescription',
      width: 180,
      headerName: '数据实体描述'
    },
    {
      field: 'entityTableName',
      width: 210,
      headerName: '数据实体简称（表）'
    },
    {
      field: 'entitySnapshotTime',
      width: 180,
      headerName: '数据快照时间'
    },
    {
      field: 'statusDesc',
      width: 60,
      headerName: '状态'
    },
    {
      field: 'projectName',
      width: 120,
      headerName: '项目名称'
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
    },
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
    // this.loadInitData();
    this.query();
  }
  // 初始数据加载
  // private loadInitData() {

  // }
  // 获取查询参数
  private getQueryParamsValue(): any {
    return {
      datasetId: this.i.datasetId,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }
  httpAction = { url: this.editService.getEntitiesPageUrl, method: 'GET' };

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
        AlgorithmEngineDatasetEntitiesEditComponent,
        {
          i: item !== undefined ? item : {
            id: null, datasetId: this.i.datasetId,
            datasetName: this.i.datasetName,
            datasetShortName: this.i.datasetShortName,
            datasetType: this.i.datasetType,
            sqlColumnClauses: this.i.sqlColumnClauses,
            sqlTableClauses: this.i.sqlTableClauses,
            sqlWhereClauses: this.i.sqlWhereClauses,
            totalSqlStatements: this.i.totalSqlStatements,
            datasetVersion: this.i.datasetVersion
          }
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  public addOrg(item?: any) {
    this.modal
      .static(
        AlgorithmEngineEntitieOrganizationComponent,
        {
          i: item
        },
        'lg',
      )
      .subscribe();
  }

  release() {
    const rows = this.gridApi.getSelectedRows();
    if (rows.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请勾选要发布的数据行!'));
      return;
    }
    this.editService.release(rows).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
    this.query();
  }

  cancleRelease(){
    const rows = this.gridApi.getSelectedRows();
    if (rows.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请勾选要取消发布的数据行!'));
      return;
    }
    this.editService.cancleRelease(rows).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
    this.query();
  }

  extract(){
    const rows = this.gridApi.getSelectedRows();
    if (rows.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请勾选要提取的数据行!'));
      return;
    }
    this.editService.extract(rows).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    this.editService.exportAction({ url: this.editService.getEntitiesUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
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
