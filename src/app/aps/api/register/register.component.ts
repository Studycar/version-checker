import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ApiRegisterEditComponent } from './edit/edit.component';
import { EditService } from './edit.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { ApiRegisterViewComponent } from './view/view.component';
import { ApiRegisterSourceSysComponent } from './sourcesys/sourcesys.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'api-register',
  templateUrl: './register.component.html',
  providers: [EditService]
})
export class ApiRegisterComponent extends CustomBaseContext implements OnInit {
  sourceOptions: any[] = [];
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  public queryParams = {
    defines: [
      { field: 'code', title: '接口编码', ui: { type: UiType.string } },
      { field: 'name', title: '接口名称', ui: { type: UiType.string } },
      { field: 'sourceCode', title: '关联系统', ui: { type: UiType.select, options: this.sourceOptions } }
    ],
    values: {
      code: '',
      name: '',
      sourceCode: null
    }
  };
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'code', headerName: '接口编码', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'name', headerName: '接口名称', width: 120, tooltipField: 'name', menuTabs: ['filterMenuTab'] },
    { field: 'remark', headerName: '接口描述', tooltipField: 'remark', menuTabs: ['filterMenuTab'] },
    { field: 'sourceCode', headerName: '关联系统', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'apiType', headerName: '接口方式', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'apiTable', headerName: '接口表', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'sourceTable', headerName: '关联系统表', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'fullFlagDesc', headerName: '全量同步', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'sourceUpdateField', headerName: '关联系统更新字段', menuTabs: ['filterMenuTab'] },
    { field: 'sourceUpdateDate', headerName: '关联系统更新时间', menuTabs: ['filterMenuTab'] },
    { field: 'sourcePlantField', headerName: '关联系统组织字段', menuTabs: ['filterMenuTab'] },
    { field: 'enableFlagDesc', headerName: '是否启用', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'sendFlagDesc', headerName: '数据流向', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'sendUrl', headerName: '外部url', menuTabs: ['filterMenuTab'] },
    { field: 'pushFlagDesc', headerName: '推拉方式', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'entityTypeDesc', headerName: '传输数据类型', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'logFlagDesc', headerName: '记录完整报文', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'programName', headerName: '并发程序简称', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'codeInput', headerName: '接口编码实参', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'creationDate', headerName: '创建时间', menuTabs: ['filterMenuTab'] },
    { field: 'createdBy', headerName: '创建人', menuTabs: ['filterMenuTab'] },
    { field: 'lastUpdateDate', headerName: '更新时间', menuTabs: ['filterMenuTab'] },
    { field: 'lastUpdatedBy', headerName: '更新人', menuTabs: ['filterMenuTab'] }
  ];
  constructor(private http: _HttpClient, private modal: ModalHelper,
    public pro: BrandService,
    private msgSrv: NzMessageService,
    public editService: EditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private appGridStateService: AppGridStateService) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.editService.querySources({}).subscribe(result => {
      this.sourceOptions.length = 0;
      result.data.forEach(d => {
        this.sourceOptions.push({
          label: d.sourceCode,
          value: d.sourceCode,
        });
      });
    });
    this.query();
  }
  public query() {
    super.query();
    this.queryCommon();
  }
  httpAction = { url: this.editService.queryUrl, method: 'GET' };
  private queryCommon() {
    this.editService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(), this.context);
  }
  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.editService.exportAction({ url: this.editService.exportUrl, method: 'GET' }, this.getQueryParamsValue(), this.excelexport, this.context);
  }
  // 获取查询参数值
  private getQueryParamsValue(): any {
    return {
      code: this.queryParams.values.code,
      name: this.queryParams.values.name,
      sourceCode: this.queryParams.values.sourceCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }
  public add(item?: any) {
    this.modal
      .static(ApiRegisterEditComponent, { i: { id: (item !== undefined ? item.id : null) } })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }
  public detail(item) {
    this.modal.static(ApiRegisterViewComponent, {
      apiId: item.id,
      apiCode: item.code,
      apiTable: item.apiTable
    }).subscribe(() => {
    });
  }
  public remove(item: any) {
    this.editService.remove(item.code).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.queryCommon();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  public removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.editService
          .removeBatch(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('删除成功'));
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
      },
    });
  }
  // 代码生成
  public generate() {
    const apiCodes = [];
    this.selectionKeys.forEach(key => {
      apiCodes.push(this.gridData.find(t => t[this.selectBy] === key).code);
    });
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('已生成的代码将被覆盖,确定要生成吗？'),
      nzOnOk: () => {
        this.editService.generateCode(apiCodes).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('生成成功！'));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }
  // 关联系统
  public sourceSys() {
    this.modal.static(ApiRegisterSourceSysComponent).subscribe(() => {
    });
  }

  public clear() {
    this.queryParams.values = {
      code: '',
      name: '',
      sourceCode: null
    };
  }
  public selectBy = 'code';
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
