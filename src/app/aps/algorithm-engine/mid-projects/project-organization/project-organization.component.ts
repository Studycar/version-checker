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
import { MidProjectsService } from '../query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AlgorithmEngineProjectOrganizationEditComponent } from './edit/edit.component';

@Component({
  selector: 'algorithm-engine-project-organization',
  templateUrl: './project-organization.component.html',
  providers: [MidProjectsService]
})
export class AlgorithmEngineProjectOrganizationComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public i: any;
  public selectBy = 'id';
  public queryParams = {
    defines: [
    ],
    values: {
      projectId: '',
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
    // {
    //   field: 'projectName',
    //   width: 80,
    //   headerName: '项目名称'
    // },
    {
      field: 'organizationCode',
      width: 80,
      headerName: '组织编码'
    },
    {
      field: 'organizationDescription',
      width: 100,
      headerName: '组织描述'
    },
    {
      field: 'activeFlagDesc',
      width: 100,
      headerName: '是否有效'
    },
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
    this.queryParams.values.projectId = this.i.projectId;
  }
  // 获取查询参数
  private getQueryParamsValue(): any {
    return {
      projectId: this.queryParams.values.projectId,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }
  httpAction = { url: this.editService.queryProjectOrgsUrl, method: 'GET' };

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
        AlgorithmEngineProjectOrganizationEditComponent,
        {
          i: item !== undefined ? item : { projectId: this.i.projectId }
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    var ids: any[] = [];
    ids.push([item[this.selectBy]]);
    this.editService.Delete(ids).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  removeBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.Delete(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(
              this.appTranslationService.translate('删除成功'),
            );
            this.query();
          } else {
            this.msgSrv.error(
              this.appTranslationService.translate(res.msg),
            );
          }
        });
      },
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    this.editService.exportAction({ url: this.editService.exportProjectOrgsUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
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
