import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ConcurrentDefineService } from '../../../modules/generated_module/services/concurrent-define-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ConcurrentRequestConcurrentDefineEditComponent } from './edit/edit.component';
import { ConcurrentRequestConcurrentRuleComponent } from './concurrent-rule.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-define',
  templateUrl: './concurrent-define.component.html',
})
export class ConcurrentRequestConcurrentDefineComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  /*columns: any[] = [
    { title: '操作区', width: '100', field: 'Operate' },
    { title: '管理器名称', width: '130', field: 'USER_CONCURRENT_MANANGER_NAME' },
    { title: '管理器代码', width: '130', field: 'CONCURRENT_MANANGER_NAME' },
    { title: '应用模块', width: '130', field: 'APPLICATION_NAME' },
    { title: '管理器类型', width: '130', field: 'MANAGER_TYPE_NAME' },
    { title: '主要节点', width: '100', field: 'NODE_NAME' },
    { title: '备用节点', width: '100', field: 'NODE_NAME2' },
    { title: '进程数量', width: '80', field: 'TARGET_PROCESSES' },
    { title: '休眠时间', width: '80', field: 'SLEEP_SECONDS' },
    { title: '启用', width: '80', field: 'ENABLED_FLAG' },
    { title: '默认管理器', width: '100', field: 'DEFAULT_FLAG' },
    { title: '启用调试', width: '80', field: 'ENABLE_DEBUG' },
    { title: '说明', width: '250', field: 'DESCRIPTION' }
  ];*/

  gridHeight = document.body.clientHeight - 165;

  public columns22 = [
    {
      colId: 0, field: '', headerName: '操作', width: 105, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'userConcurrentManangerName', headerName: '管理器名称', menuTabs: ['filterMenuTab'] },
    {
      field: 'concurrentManangerName', headerName: '管理器代码', menuTabs: ['filterMenuTab']
    },
    { field: 'applicationName', headerName: '应用模块', menuTabs: ['filterMenuTab'] },
    { field: 'managerType', headerName: '管理器类型', valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] },
    { field: 'nodeName', headerName: '主要节点', menuTabs: ['filterMenuTab'] },
    { field: 'nodeName2', headerName: '备用节点', menuTabs: ['filterMenuTab'] },
    { field: 'targetProcesses', headerName: '进程数量', menuTabs: ['filterMenuTab'] },
    { field: 'sleepSeconds', headerName: '休眠时间', menuTabs: ['filterMenuTab'] },
    { field: 'enabledFlag', headerName: '启用', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'defaultFlag', headerName: '默认管理器', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'enableDebug', headerName: '启用调试', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'description', headerName: '说明', menuTabs: ['filterMenuTab'] }
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesOrNo;
        break;
      case 2:
        options = this.manageTypeOptions;
        break;
    }
    // tslint:disable-next-line:triple-equals
    let option = options.find(x => x.value == value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  public gridData: any[] = [];
  // public lastColumnName: string;
  yesOrNo: any[] = [];
  manageTypeOptions: any[] = [];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private concurrentDefineService: ConcurrentDefineService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private commonQueryService: CommonQueryService,
    ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns22);
  }

  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;

    // this.lastColumnName = this.columns[this.columns.length - 1].field;
    this.commonQueryService.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(item => {
        this.yesOrNo.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
    this.commonQueryService.GetLookupByTypeNew('FND_CONC_MANAGER_TYPE').subscribe(res => {
      res.data.forEach(item => {
        this.manageTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });
    this.query();
  }

  query() {
    this.concurrentDefineService.Query().subscribe(result => {
      this.gridData = [];
      if (result.data && result.data.length && result.data.length > 0) {
        this.gridData = result.data;
      }
    },
      errMsg => { },
      () => { }
    );
  }

  add() {
    const Param = {
      opertype: '新增',
      IsRefresh: false,
      obj: {}
    };
    this.modal
      .static(ConcurrentRequestConcurrentDefineEditComponent, { Param: Param })
      .subscribe(() => { if (Param.IsRefresh) { this.query(); } });
  }

  edit(obj: any) {
    const Param = {
      obj: obj,
      IsRefresh: false
    };
    this.modal
      .static(ConcurrentRequestConcurrentDefineEditComponent, { Param: Param })
      .subscribe(() => { if (Param.IsRefresh) { this.query(); } });
  }

  detail(obj: any) {
    this.modal
      .static(ConcurrentRequestConcurrentRuleComponent, { i: obj }, 'lg')
      .subscribe();
  }

  remove(obj: any) {
    this.concurrentDefineService.Remove([obj.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });

  }

  /*onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }*/
}
