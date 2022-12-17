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
import { MidProjectsService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AlgorithmEngineMidProjectsEditComponent } from './edit/edit.component';
import { AlgorithmEngineProjectOrganizationComponent } from './project-organization/project-organization.component';

@Component({
  selector: 'algorithm-engine-mid-projects',
  templateUrl: './mid-projects.component.html',
  providers: [MidProjectsService]
})
export class AlgorithmEngineMidProjectsComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  public optionListTopic: any[] = [];
  public yesNoList: any[] = [];
  public queryParams = {
    defines: [
      {
        field: 'proejctTopicType',
        title: '业务主题域',
        ui: {
          type: UiType.select,
          options: this.optionListTopic
        },
      },
      {
        field: 'projectName',
        title: '项目名称',
        ui: { type: UiType.text },
      },
      {
        field: 'activeFlag',
        title: '是否有效',
        ui: {
          type: UiType.select,
          options: this.yesNoList
        },
      },
    ],
    values: {
      proejctTopicType: '',
      projectName: '',
      activeFlag: 'Y'
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
    field: 'id',
    width: 120,
    headerName: '项目ID'
  },
  {
    field: 'projectName',
    width: 120,
    headerName: '项目名称'
  },
  {
    field: 'projectDescription',
    width: 120,
    headerName: '项目描述'
  },
  {
    field: 'proejctTopicTypeDesc',
    width: 120,
    headerName: '业务主题域'
  },
  {
    field: 'statistics',
    width: 50,
    headerName: '项目统计'
  },
  {
    field: 'activeFlagDesc',
    width: 100,
    headerName: '是否有效',
  },
  {
    field: 'organization',
    width: 150,
    headerName: '组织',
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
  }
  ];

  constructor(public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: MidProjectsService,
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
    this.commonQueryService.GetLookupByTypeRef('AI_MID_BUSINESS_TOPIC_LIST', this.optionListTopic);
  }
  // 获取查询参数
  private getQueryParamsValue(): any {
    return {
      proejctTopicType: this.queryParams.values.proejctTopicType,
      projectName: this.queryParams.values.projectName,
      activeFlag: this.queryParams.values.activeFlag,
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
        AlgorithmEngineMidProjectsEditComponent,
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

  // 项目组织
  public show() {
    const rows = this.gridApi.getSelectedRows();
    if (rows.length !== 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请勾选一行记录!'));
      return;
    }
    this.modal
      .static(
        AlgorithmEngineProjectOrganizationComponent,
        {
          i:
          {
            projectId: rows[0].id,
            projectName: rows[0].projectName,
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

  detail(item: any) {
    this.modal
      .static(
        AlgorithmEngineProjectOrganizationComponent,
        {
          i: {
            projectId: item.id,
            projectName: item.projectName,
          },
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
  expColumnsOptions = [
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    this.editService.exportAction({ url: this.editService.exportUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
  }
  public clear() {
    this.queryParams.values = {
      proejctTopicType: '',
      projectName: '',
      activeFlag: 'Y'
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
