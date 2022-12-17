import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { BaseUsermanagerrespEditComponent } from 'app/aps/base/usermanagerresp/edit/edit.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { QueryService } from './query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-usermanagerresp-ag',
  templateUrl: './usermanagerresp-ag.component.html',
  providers: [QueryService]
})
export class BaseUsermanagerrespAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  p: any;
  userId : string;
  // public queryParams = {
  //   defines: [
  //     { field: 'userName', title: '用户名', readonly: true, ui: { type: UiType.string } },
  //     { field: 'description', title: '描述', readonly: true, ui: { type: UiType.string } }
  //   ],
  //   values: {
  //     userName: '',
  //     description: ''
  //   },
  // };
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'respsName', headerName: '职责名称', width: 190, pinned: 'left', tooltipField: 'respsName', menuTabs: ['filterMenuTab'] },
    { field: 'applicationName', headerName: '应用模块', width: 170, menuTabs: ['filterMenuTab'] },
    { field: 'startDate', headerName: '生效日期', width: 170, menuTabs: ['filterMenuTab'] },
    { field: 'endDate', headerName: '失效日期', width: 170, menuTabs: ['filterMenuTab'] }
  ];
  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
    this.gridHeight = 265;
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    // this.queryParams.values = { userName: this.p.userName, description: this.p.description };
    this.queryCommon();
  }
  public query() {
    super.query();
    this.queryCommon();
  }
  httpAction = { url: this.commonQueryService.queryUrl, method: 'GET' };
  public queryCommon() {
    const queryValues = { userId: this.userId, page: this._pageNo, pageSize: this._pageSize };
    this.commonQueryService.loadGridViewNew(this.httpAction, queryValues, this.context);
  }

  public clear() {
    // this.queryParams.values = {
    //   userName: '',
    //   description: ''
    // };
  }

  public add(item?: any) {
    this.modal
      .static(BaseUsermanagerrespEditComponent, { i: (item !== undefined ? this.clone(item) : { userId: this.userId }) })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.exportAction({ url: this.commonQueryService.exportUrl, method: 'GET' }, { userId: this.userId }, this.excelexport, this.context);
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
