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
import { PostsService } from './query.service';
import { WorkerManagementPostsCertificateComponent } from './posts-certificate/posts-certificate.component';
import { WorkerManagementPostsSkillComponent } from './posts-skill/posts-skill.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { WorkerManagementPostsEditComponent } from './edit/edit.component';

@Component({
  selector: 'worker-management-posts',
  templateUrl: './posts.component.html',
  providers: [PostsService]
})
export class WorkerManagementPostsComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'Id';
  public optionListPosition: any[] = [];
  public yesNoList: any[] = [];
  public postTypeList: any[] = [];
  public optionListPlant: any[] = [];
  public queryParams = {
    defines: [
      // {
      //   field: 'PLANT_CODE',
      //   title: '工厂',
      //   ui: {
      //     type: UiType.select,
      //     options: this.optionListPlant
      //   },
      // },
      {
        field: 'POST_FROM',
        title: '工位自',
        ui: {
          type: UiType.select,
          options: this.optionListPosition
        },
      },
      {
        field: 'POST_TO',
        title: '工位至',
        ui: {
          type: UiType.select,
          options: this.optionListPosition
        },
      },
      {
        field: 'POST_TYPE',
        title: '工位类型',
        ui: {
          type: UiType.select,
          options: this.postTypeList
        },
      },
      {
        field: 'VALID_YN',
        title: '是否有效',
        ui: {
          type: UiType.select,
          options: this.yesNoList
        },
      },
    ],
    values: {
      // PLANT_CODE: this.appConfigService.getPlantCode(),
      POST_FROM: null,
      POST_TO: '',
      POST_TYPE: '',
      VALID_YN: 'Y'
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
  // {
  //   field: 'plantCode',
  //   width: 80,
  //   headerName: '工厂'
  // },
  {
    field: 'postName',
    width: 80,
    headerName: '工位名称'
  },
  {
    field: 'postCode',
    width: 80,
    headerName: '工位编码'
  },
  {
    field: 'postTypeDesc',
    width: 120,
    headerName: '工位类型'
  },
  {
    field: 'isKeyDesc',
    width: 150,
    headerName: '是否关键岗'
  },
  {
    field: 'isPublicDesc',
    width: 100,
    headerName: '是否公共岗',
  },
  {
    field: 'postGradeDesc',
    width: 150,
    headerName: '岗位类别',
  },
  {
    field: 'isNeededDesc',
    width: 100,
    headerName: '是否认定上岗'
  },
  {
    field: 'categoryDesc',
    width: 100,
    headerName: '岗位大类'
  },
  {
    field: 'subCatDesc',
    width: 100,
    headerName: '岗位小类'
  },
  {
    field: 'validYnDesc',
    width: 100,
    headerName: '是否有效'
  }
  ];

  constructor(public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: PostsService,
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
    this.commonQueryService.GetLookupByTypeRef('PS_HR_POST_TYPE', this.postTypeList);
    // 工厂
    // this.commonQueryService.GetUserPlant().subscribe(result => {
    //   result.Extra.forEach(d => {
    //     this.optionListPlant.push({
    //       label: d.PLANT_CODE,
    //       value: d.PLANT_CODE,
    //     });
    //   });
    // });
    this.editService.GetPosts().subscribe(result => {
      result.data.forEach(d => {
        this.optionListPosition.push({
          label: d.postCode + ' ' + d.postName,
          value: d.postCode,
        });
      });
    });
  }
  // 获取查询参数
  private getQueryParamsValue(): any {
    return {
      // PLANT_CODE:this.queryParams.values.PLANT_CODE,
      postFrom: this.queryParams.values.POST_FROM,
      postTo: this.queryParams.values.POST_TO,
      postType: this.queryParams.values.POST_TYPE,
      validYn: this.queryParams.values.VALID_YN,
      QueryParams: { pageIndex: this._pageNo, pageSize: this._pageSize }
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
        WorkerManagementPostsEditComponent,
        {
          i: item !== null ? item : { Id: null }
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  // 工位证书
  public showCertificate() {
    const rows = this.gridApi.getSelectedRows();
    if (rows.length !== 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请勾选一行记录!'));
      return;
    }
    this.modal
      .static(
        WorkerManagementPostsCertificateComponent,
        {
          i:
          {
            POST_ID: rows[0].Id,
            POST_CODE:rows[0].POST_CODE,
            POST_NAME:rows[0].POST_NAME,
          }
        },
        'lg',
      )
      .subscribe();
  }

  // 工位技能
  public showSkill() {
    const rows = this.gridApi.getSelectedRows();
    if (rows.length !== 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请勾选一行记录!'));
      return;
    }
    this.modal
      .static(
        WorkerManagementPostsSkillComponent,
        {
          i:
          {
            POST_ID: rows[0].Id,
            POST_CODE:rows[0].POST_CODE,
            POST_NAME:rows[0].POST_NAME,
          }
        },
        'lg',
      )
      .subscribe();
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    this.editService.exportAction({ url: this.editService.exportUrl, method: 'POST' }, this.getQueryParamsValue(), this.excelexport, this.context);
  }
  public clear() {
    this.queryParams.values = {
      // PLANT_CODE:this.appConfigService.getPlantCode(),
      POST_FROM: null,
      POST_TO: null,
      POST_TYPE: null,
      VALID_YN: 'Y',
    };
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
    // this.checkAuxDisabled();
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
