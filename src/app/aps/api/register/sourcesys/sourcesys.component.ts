import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { EditService } from '../edit.service';
import { ApiRegisterSourceSysEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'api-register-sourcesys',
  templateUrl: './sourcesys.component.html',
  providers: [EditService]
})
export class ApiRegisterSourceSysComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  public queryParams = {
    defines: [
      { field: 'sourceCode', title: '系统编码' },
      { field: 'sourceName', title: '系统名称' },
    ],
    values: {
      sourceCode: '',
      sourceName: ''
    }
  };
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 60, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    // {
    //   colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
    //   checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
    //   headerComponentParams: {
    //     template: this.headerTemplate
    //   }
    // },
    { field: 'sourceCode', headerName: '系统编码', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'sourceName', headerName: '系统名称', width: 120, tooltipField: 'sourceName', menuTabs: ['filterMenuTab'] },
    { field: 'baseUrl', headerName: '根url', tooltipField: 'baseUrl', menuTabs: ['filterMenuTab'] },
    { field: 'connectionString', headerName: '数据库连接串', tooltipField: 'connectionString', menuTabs: ['filterMenuTab'] },
    { field: 'dbType', headerName: '数据库类型', width: 120, menuTabs: ['filterMenuTab'] },
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
    this.query();
  }
  public query() {
    super.query();
    this.queryCommon();
  }
  httpAction = { url: this.editService.querySourceUrl, method: 'GET' };
  private queryCommon() {
    this.editService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(), this.context);
  }
  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    }, 100);
  }
  // 获取查询参数值
  private getQueryParamsValue(): any {
    return{
      sourceCode: this.queryParams.values.sourceCode,
      sourceName: this.queryParams.values.sourceName,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }
  public add(item?: any) {
    this.modal
      .static(ApiRegisterSourceSysEditComponent, { i: { id: (item !== undefined ? item.id : null) } })
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  public remove(item: any) {
    this.editService.removeSources([item[this.selectBy]]).subscribe(res => {
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

  public clear() {
    this.queryParams.values = {
      sourceCode: '',
      sourceName: ''
    };
  }
  public selectBy = 'Id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
}
