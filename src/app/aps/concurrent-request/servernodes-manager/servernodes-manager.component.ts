import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ServerNodesManageService } from '../../../modules/generated_module/services/servernodes-manager-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ConcurrentRequestServernodesManagerEditComponent } from './edit/edit.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-servernodes-manager',
  templateUrl: './servernodes-manager.component.html',
})
export class ConcurrentRequestServernodesManagerComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  /*columns: any[] = [
    { title: '操作区', width: '80', field: 'Operate' },
    { title: '节点', width: '120', field: 'NODE_NAME' },
    { title: '平台', width: '200', field: 'PLATFORM_CODE' },
    { title: 'IP', width: '120', field: 'SERVER_ADDRESS' },
    { title: '支持并发', width: '100', field: 'SUPPORT_CP' },
    { title: '并发优先级', width: '100', field: 'CONCURRENT_PRIORITY' },
    { title: '主节点', width: '80', field: 'PRIMARY_NODE' },
    { title: '状态', width: '80', field: 'STATUS_NAME' },
    { title: '说明', width: '250', field: 'DESCRIPTION' }
  ];*/

  public columns22 = [
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
    { field: 'nodeName', headerName: '节点', menuTabs: ['filterMenuTab'] },
    {
      field: 'platformCode', headerName: '平台', menuTabs: ['filterMenuTab']
    },
    { field: 'serverAddress', headerName: 'IP', tooltipField: 'DESCRIPTION', menuTabs: ['filterMenuTab'] },
    { field: 'supportCp', headerName: '支持并发', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'concurrentPriority', headerName: '并发优先级', menuTabs: ['filterMenuTab'] },
    { field: 'primaryNode', headerName: '主节点', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'status', headerName: '状态', valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] },
    { field: 'description', headerName: '说明', menuTabs: ['filterMenuTab'] }
  ];

  gridHeight = document.body.clientHeight - 165;

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesOrNo;
        break;
      case 2:
        options = this.statusOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  public gridData: any[] = [];
  // public lastColumnName: string;
  private yesOrNo: any[] = [];
  statusOptions: any[] = [];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private serverNodesManageService: ServerNodesManageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private commonQueryService: CommonQueryService) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns22);
  }

  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;

    // this.lastColumnName = this.columns[this.columns.length - 1].field;

    this.commonQueryService.GetLookupByTypeNew('FND_CONC_SERVER_NODE_STATUS').subscribe(res => {
      res.data.forEach(item => {
        this.statusOptions.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });

    this.commonQueryService.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(item => {
        this.yesOrNo.push({
          label: item.meaning,
          value: item.lookupCode
        });
      });
    });

    this.Query();
  }

  Query() {
    this.serverNodesManageService.Query().subscribe(result => {
      if (result.data && result.data.length && result.data.length > 0) {
        this.gridData = result.data;
      } else {
        this.gridData = [];
      }
    });
  }

  add() {
    const Param = {
      opertype: '新增',
      IsRefresh: false,
      obj: {}
    };
    this.modal
      .static(ConcurrentRequestServernodesManagerEditComponent, { Param: Param })
      .subscribe(() => {
        if (Param.IsRefresh) {
          this.Query();
        }
      });
  }

  edit(obj: any) {
    const Param = {
      obj: obj,
      IsRefresh: false
    };
    this.modal
      .static(ConcurrentRequestServernodesManagerEditComponent, { Param: Param })
      .subscribe(() => {
        if (Param.IsRefresh) {
          this.Query();
        }
      });
  }

  remove(obj: any) {
    this.serverNodesManageService.Remove(obj.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.Query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });

  }

  /*onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }*/
}
