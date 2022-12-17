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
import { PostsService } from '../query.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { WorkerManagementPostsCertificateEditComponent } from './edit/edit.component';

@Component({
  selector: 'worker-management-posts-certificate',
  templateUrl: './posts-certificate.component.html',
  providers: [PostsService]
})
export class WorkerManagementPostsCertificateComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public i: any;
  public selectBy = 'Id';
  public queryParams = {
    defines: [
    ],
    values: {
      // PLANT_CODE: this.appConfigService.getPlantCode(),
      POST_ID: '',
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
    {
      field: 'POST_NAME',
      width: 80,
      headerName: '工位名称'
    },
    {
      field: 'POST_CODE',
      width: 80,
      headerName: '工位编码'
    },
    {
      field: 'CERTIFICATE_NAME',
      width: 100,
      headerName: '证书名称'
    },
    {
      field: 'CERTIFICATE_CODE',
      width: 100,
      headerName: '证书编号'
    },
    {
      field: 'CERTIFICATE_SOURCE_DESC',
      width: 100,
      headerName: '证书来源'
    },
    {
      field: 'UNCERTIFICATED_ALLOWED_DESC',
      width: 180,
      headerName: '是否必须持证上岗'
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
    this.queryParams.values.POST_ID = this.i.POST_ID;
  }
  // 获取查询参数
  private getQueryParamsValue(): any {
    return {
      POST_ID: this.queryParams.values.POST_ID,
      QueryParams: { PageIndex: this._pageNo, PageSize: this._pageSize }
    };
  }
  httpAction = { url: this.editService.queryCertificateUrl, method: 'POST' };

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
        WorkerManagementPostsCertificateEditComponent,
        {
          i: item !== undefined ? item : { POST_ID: this.i.POST_ID, CERTIFICATE_ID: null, POST_CODE: this.i.POST_CODE, POST_NAME: this.i.POST_NAME }
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
    this.editService.DeleteCertificate([item[this.selectBy]]).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.Message);
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
        this.editService.DeleteCertificate(this.selectionKeys).subscribe(res => {
          if (res.Success === true) {
            this.msgSrv.success(
              this.appTranslationService.translate('删除成功'),
            );
            this.query();
          } else {
            this.msgSrv.error(
              this.appTranslationService.translate(res.Message),
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
    this.editService.exportAction({ url: this.editService.exporCertificateUrl, method: 'POST' }, this.getQueryParamsValue(), this.excelexport, this.context);
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
