import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { UserManagerManageService } from '../../../modules/generated_module/services/user-manager-manage-service';
import { BaseUsermanagerEditComponent } from './edit/edit.component';
// import { BaseUsermanagerAttachComponent } from 'app/aps/base/usermanager/attachinfo/attach.component';
import { BaseUsermanagerInitComponent } from 'app/aps/base/usermanager/initpassword/init.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { QueryService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { BaseUsermanagerrespAgComponent } from '../usermanagerresp/usermanagerresp-ag.component';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import {BaseUsermanagerImportComponent} from './import/import.component';
import {BaseUserRespImportComponent} from '../usermanagerresp/import/import.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-usermanager-ag',
  templateUrl: './usermanager-ag.component.html',
  providers: [QueryService],
})
export class BaseUsermanagerAgComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  public selectBy = 'id';
  private isLoading = false;
  /**所有用户*/
  private users: any[] = [];
  /**查询参数*/
  getUserList = (value, pageIndex, pageSize) => this.commonQueryService.getUsersPage(value, pageIndex, pageSize);
  public queryParams = {
    defines: [
      // { field: 'UserName', title: '用户名', ui: { type: UiType.string } },
      { field: 'userName', title: '用户名', ui: 
        { 
          type: UiType.selectServer,
          selectLabelField: 'description',
          selectValueField: 'userName',
          isSelectedShowValue: true,
          ngModelChange: this.userChange,
          searchFunction: this.getUserList
        } 
      },
      { field: 'description', title: '真实姓名', ui: { type: UiType.string } },
      {
        field: 'startRange',
        title: '生效日期范围',
        ui: { type: UiType.dateRange },
      },
      {
        field: 'endRange',
        title: '失效日期范围',
        ui: { type: UiType.dateRange },
      },
    ],
    values: {
      userName: '',
      description: '',
      startRange: [],
      endRange: [],
      startBegin: '',
      startEnd: '',
      endBegin: '',
      endEnd: '',
    },
  };
  /**表格列*/
  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 100,
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
      field: 'userName',
      headerName: '用户名',
      width: 120,
      pinned: 'left',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'userPassword',
      headerName: '密码',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'description',
      headerName: '真实姓名',
      width: 100,
      tooltipField: 'description',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'phoneNumber',
      headerName: '手机号码',
      width: 120,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'emailAddress',
      headerName: '邮箱地址',
      width: 150,
      tooltipField: 'emailAddress',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'department',
      headerName: '部门',
      width: 120,
      tooltipField: 'department',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'defaultPlantCode',
      headerName: '默认工厂',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'startDate',
      headerName: '生效时间',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'endDate',
      headerName: '失效时间',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'salesType',
      headerName: '内外销',
      width: 150,
      valueFormatter: 'ctx.lookupValueName("SOP_SALES_TYPE", value)',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'nickname',
      headerName: '绑定微信号',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
  ];
  httpAction = { url: this.commonQueryService.queryUrl, method: 'GET' };
  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [];

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;

  /**构造函数*/
  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private userManagerManageService: UserManagerManageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appGridStateService: AppGridStateService,
    private appconfig: AppConfigService,
    public commonQuerySrv: CommonQueryService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }
  /**页面初始化*/
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.clear();
    // this.loadUser();
    // this.commonQuerySrv
    //   .getLookupItemsMutil(['SOP_SALES_TYPE'])
    //   .subscribe(it => {
    //     console.log('SOP_SALES_TYPE' + it);
    //     this.queryCommon();
    //   });

    this.queryCommon();
  }

  /**查询所有用户*/
  loadUser(): void {
    this.isLoading = true;
    this.commonQuerySrv.GetUserInfos().subscribe(result => {
      this.isLoading = false;
      result.data.forEach(d => {
        this.users.push({
          label: d.userName,
          value: d.userName,
        });
      });
    });
  }
  /**新增/编辑*/
  public add(item?: any) {
    this.modal
      .static(BaseUsermanagerEditComponent, {
        i: item !== undefined ? this.clone(item) : { id: null },
      })
      .subscribe(value => {
        if (value) {
          this.queryCommon();
        }
      });
  }
  /**删除*/
  public remove(item: any) {
    this.userManagerManageService
      .RemoveBatch('["' + item.id + '"]')
      .subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('删除成功'));
          this.queryCommon();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
  }
  /**删除*/
  public removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请先选择要删除的记录！'),
      );
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        const ids = '["' + this.selectionKeys.join('","') + '"]';
        this.userManagerManageService.RemoveBatch(ids).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(
              this.appTranslationService.translate('删除成功'),
            );
            this.queryCommon();
          } else {
            this.msgSrv.error(
              this.appTranslationService.translate(res.msg),
            );
          }
        });
      },
    });
  }
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  /**导出*/
  public export() {
    super.export();
    this.commonQueryService.exportAction(
      { url: this.commonQueryService.exportUrl, method: 'GET' },
      this.getQueryParamsValue(),
      this.excelexport,
      this.context,
    );
  }
  /**获取查询参数值*/
  private getQueryParamsValue(): any {
    return {
      userName: this.queryParams.values.userName,
      description: this.queryParams.values.description,
      startBegin:
        this.queryParams.values.startRange.length > 0
          ? this.commonQueryService.formatDate(
              this.queryParams.values.startRange[0],
            )
          : '',
      startEnd:
        this.queryParams.values.startRange.length > 0
          ? this.commonQueryService.formatDate(
              this.queryParams.values.startRange[1],
            )
          : '',
      endBegin:
        this.queryParams.values.endRange.length > 0
          ? this.commonQueryService.formatDate(
              this.queryParams.values.endRange[0],
            )
          : '',
      endEnd:
        this.queryParams.values.endRange.length > 0
          ? this.commonQueryService.formatDate(
              this.queryParams.values.endRange[1],
            )
          : '',
    };
  }
  /**查询*/
  public query() {
    super.query();
    // this.commonQuerySrv
    //   .getLookupItemsMutil(['SOP_SALES_TYPE'])
    //   .subscribe(it => {
    //     console.log(it);
    //     this.queryCommon();
    //   });

    this.queryCommon();
  }
  /**查询*/
  public queryCommon() {
    const queryValues = this.getQueryParamsValue();
    queryValues.page = this._pageNo;
    queryValues.pageSize = this._pageSize;
    this.commonQueryService.loadGridViewNew(
      this.httpAction,
      queryValues,
      this.context,
    );
  }
  /**重置*/
  public clear() {
    this.queryParams.values = {
      userName: '',
      description: '',
      startRange: [],
      endRange: [],
      startBegin: '',
      startEnd: '',
      endBegin: '',
      endEnd: '',
    };
  }
  /**分配职责 */
  public setting(item: any) {
    this.modal
      .static(BaseUsermanagerrespAgComponent, { p: this.clone(item) , userId : item.id })
      .subscribe(value => {
        if (value) {
          this.queryCommon();
        }
      });
  }
  // onGridReady(params) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  // }
  /**初始化密码*/
  public initPassword(item: any) {
    this.modal
      .static(BaseUsermanagerInitComponent, { i: this.clone(item) , userId : item.id})
      .subscribe(value => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  /**
   * 获取快码值（此方法不能直接调用，应该根据
   * @param key
   * @param code
   */
  public lookupValueName(key: string, code: string) {
    return this.commonQuerySrv.getLookupText(key, code);
  }

  // public attachInfo(item: any) {
  //   this.modal
  //     .static(BaseUsermanagerAttachComponent, { i: this.clone(item) })
  //     .subscribe(value => {
  //       if (value) {
  //         this.queryCommon();
  //       }
  //     });
  // }

  userChange(e) {
    this.queryParams.values.userName = e.value;
  }

  /**行选中改变*/
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  /**页码切换*/
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

  /**
   * 导入用户
   */
  public imports() {
    this.modal.static(BaseUsermanagerImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }

  /**
   * 导入用户职责
   */
  public userRespImports() {
    this.modal.static(BaseUserRespImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }

}
