import { AfterContentInit, AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  selector: 'algorithm-engine-entities-organization',
  templateUrl: './entities-organization.component.html',
  providers: [MidDWDatasetEntitiesService]
})
export class AlgorithmEngineEntitieOrganizationComponent extends CustomBaseContext
  implements OnInit,AfterViewInit {
  // @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

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
  //  { colId: 0,
  //   field: '',
  //   headerName: '操作',
  //   width: 80,
  //   pinned: this.pinnedAlign,
  //   lockPinned: true,
  //   headerComponentParams: {
  //     template: this.headerTemplate,
  //   },
  //   cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
  //   cellRendererParams: {
  //     customTemplate: null, // Complementing the Cell Renderer parameters
  //   },
  // },
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
      field: 'organizationCode',
      width: 120,
      headerName: '组织编码'
    },
    {
      field: 'organizationDescription',
      width: 120,
      headerName: '组织描述'
    },
    {
      field: 'activeFlagDesc',
      width: 120,
      headerName: '是否有效'
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
    // this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadInitData();
    this.query();
  }

  ngAfterViewInit() {
    setTimeout(() => {
     var indexs: any[]= [];
      this.editService.getEntitieOrgs({entityId:this.i.id})
    .subscribe(result => {
      result.data.forEach(d => {
        const index = this.gridData.findIndex(a =>a.organizationCode=== d.organizationCode); 
        this.gridApi.selectIndex(index, true, false);
      });
    });
   }, 800);
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
      pageSize: 200
    };
  }
  httpAction = { url: this.editService.getProjectOrgsUrl, method: 'GET' };

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

  public save() {
    const rows = this.gridApi.getSelectedRows();
    if(rows.length===0){
      this.msgSrv.warning(this.appTranslationService.translate('请勾选组织!'));
      return;
    }
    rows.forEach(a=>a.entityId=this.i.id);
    this.editService.saveEntitieOrgs(rows).subscribe(res => {
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
    this.editService.exportAction({ url: this.editService.getProjectOrgsUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

    // 页码切换
    // onPageChanged({ pageNo, pageSize }) {
    //   this.gridApi.paginationSetPageSize(pageSize);
    //   this.queryCommon();
    // }

}
